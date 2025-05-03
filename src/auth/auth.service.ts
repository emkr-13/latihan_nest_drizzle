import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from '../utils/helper/api-response';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.authRepo.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.authRepo.createUser({
      email: dto.email,
      password: hashedPassword,
      fullname: dto.fullname,
      role: 'user',
    });

    return ApiResponse.success('Registration successful', {
      email: user.email,
      fullname: user.fullname,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Simpan refresh token ke database
    const refreshTokenExp = process.env.REFRESH_TOKEN_EXP || '604800'; // Default 7 days
    const refreshTokenExpSeconds = parseInt(refreshTokenExp);

    await this.authRepo.updateUser(user.id, {
      refreshToken,
      refreshTokenExp: new Date(Date.now() + refreshTokenExpSeconds * 1000),
    });

    return ApiResponse.success('Login successful', {
      token: accessToken,
      refreshToken,
    });
  }

  private generateAccessToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.AUTH_TOKEN_EXP,
    });
  }

  private generateRefreshToken(user: any) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    });
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.authRepo.findUserById(payload.sub);
      if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Add type guard for refreshTokenExp
      if (!user.refreshTokenExp) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Explicitly create Date objects for comparison
      const now = new Date();
      const tokenExpiryDate = new Date(user.refreshTokenExp);

      if (now > tokenExpiryDate) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Calculate new expiry date safely
      const refreshTokenExpSeconds = parseInt(
        process.env.REFRESH_TOKEN_EXP || '604800',
      );
      const newRefreshTokenExp = new Date(
        Date.now() + refreshTokenExpSeconds * 1000,
      );

      await this.authRepo.updateUser(user.id, {
        refreshToken: newRefreshToken,
        refreshTokenExp: newRefreshTokenExp,
      });

      return ApiResponse.success('Token refreshed successfully', {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
