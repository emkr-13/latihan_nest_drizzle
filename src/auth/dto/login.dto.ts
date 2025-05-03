import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  // Email
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  // Password
  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}