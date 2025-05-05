import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { ApiResponse } from '../utils/helper/api-response';
import {
  calculatePagination,
  PaginationResponse,
} from '../utils/helper/pagination';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepo.create({
      ...createProductDto,
      isActive: createProductDto.isActive ?? true,
    });
    return ApiResponse.success('Product created successfully', product);
  }

  async findAll(query: QueryProductsDto) {
    const { search, page = 1, limit = 10 } = query;
    const result = await this.productRepo.findAll({
      search,
      page: Number(page),
      limit: Number(limit),
    });
    const pagination: PaginationResponse = calculatePagination(
      result.meta.total,
      Number(page),
      Number(limit),
    );
    return ApiResponse.success('Products retrieved successfully', {
      data: result.data,
      pagination: {
        total_data: pagination.total_data,
        total_page: pagination.total_page,
        current_page: pagination.current,
        per_page: limit,
        first_page: pagination.first_page,
        last_page: pagination.last_page,
        next_page: pagination.next,
        prev_page: pagination.prev,
        page_numbers: pagination.detail,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return ApiResponse.success('Product retrieved successfully', product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.update(id, updateProductDto);
    return ApiResponse.success('Product updated successfully', product);
  }

  async remove(id: number) {
    const product = await this.productRepo.softDelete(id);
    return ApiResponse.success('Product deleted successfully', product);
  }
}
