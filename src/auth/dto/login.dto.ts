// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for logging in a user
 */
export class LoginDto {
  /**
   * User's email address
   * @example "user@example.com"
   */
  @IsEmail()
  email: string;

  /**
   * User's password
   * @example "password123"
   */
  @IsString()
  @MinLength(6)
  password: string;
}