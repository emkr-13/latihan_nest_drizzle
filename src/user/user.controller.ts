import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({ status: 200, description: 'Return user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.sub);
  }
}