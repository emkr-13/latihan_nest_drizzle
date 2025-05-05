import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryCategoriesDto {
  @ApiProperty({
    description: 'Search by category name',
    example: 'Electro',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    default: 10,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
