import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'string@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  fullname: string;
}
