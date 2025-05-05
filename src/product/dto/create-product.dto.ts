import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsInt } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsInt()
  stock: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty()
  @IsInt()
  categoryId: number;
}
