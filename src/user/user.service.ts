import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { ApiResponse } from '../utils/helper/api-response';
import { UpdateUserDto } from './dto/update-user.dto';


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
      const updatedUser = await this.userRepo.updateUserFullname(userId, dto.fullname);
      return ApiResponse.success('Profile updated successfully', {
        fullname: updatedUser.fullname,
      });
    } catch (error) {
      return ApiResponse.error('Failed to update profile');
    }
  }
}