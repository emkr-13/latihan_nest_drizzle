import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userId: string) {
    return await this.userRepo.findUserById(userId);
  }
}