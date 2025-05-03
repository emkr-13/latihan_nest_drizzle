import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    return this.authRepo.createUser({
      ...dto,
      password: hashedPassword,
      role: 'user',
    });
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findUserByEmail(dto.email);
    // Pastikan user ditemukan
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
