import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ApiResponse } from '../utils/helper/api-response';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      return ApiResponse.error('User not found');
    }
    return ApiResponse.success('Profile retrieved successfully', user);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    try {
      const updatedUser = await this.userRepo.updateUserFullname(
        userId,
        dto.fullname,
      );
      return ApiResponse.success('Profile updated successfully', {
        fullname: updatedUser.fullname,
      });
    } catch (error) {
      return ApiResponse.error('Failed to update profile');
    }
  }
  async createUser(requesterRole: string, dto: CreateUserDto) {
    // Only admin can create users
    if (requesterRole !== 'admin') {
      throw new ForbiddenException('Only admin can create users');
    }

    // Check if email already exists
    const existingUser = await this.userRepo.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Create user
    const user = await this.userRepo.createUser({
      email: dto.email,
      password: hashedPassword,
      fullname: dto.fullname,
      role: dto.role,
    });

    return ApiResponse.success('User created successfully', {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    });
  }

  async userLogout(userId: string) {
    const logout = await this.userLogout(userId);
    return ApiResponse.success('Logout successfully');
  }
}
