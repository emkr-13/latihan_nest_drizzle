import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { ApiResponse } from '../utils/helper/api-response';
import { calculatePagination, PaginationResponse } from '../utils/helper/pagination';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepo.create(createCategoryDto);
    return ApiResponse.success('Category created successfully', category);
  }

  async findAll(query: QueryCategoriesDto) {
    const { search, page = 1, limit = 10 } = query;
    
    // Get data from repository
    const result = await this.categoriesRepo.findAll({
      search,
      page: Number(page),
      limit: Number(limit),
    });

    // Calculate pagination metadata
    const pagination: PaginationResponse = calculatePagination(
      result.meta.total,
      Number(page),
      Number(limit)
    );

    return ApiResponse.success('Categories retrieved successfully', {
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
    const category = await this.categoriesRepo.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return ApiResponse.success('Category retrieved successfully', category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepo.update(id, updateCategoryDto);
    return ApiResponse.success('Category updated successfully', category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepo.softDelete(id);
    return ApiResponse.success('Category deleted successfully', category);
  }
}
