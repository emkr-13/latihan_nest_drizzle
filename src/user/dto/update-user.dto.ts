import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe Updated',
    required: true,
  })
  @IsString()
  @MinLength(2)
  fullname: string;
}