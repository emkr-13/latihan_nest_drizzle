import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Updated Electronics',
    required: false,
    maxLength: 100,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Updated description',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
