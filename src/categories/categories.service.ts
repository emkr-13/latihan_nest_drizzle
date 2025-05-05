import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { ApiResponse } from '../utils/helper/api-response';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepo.create(createCategoryDto);
    return ApiResponse.success('Category created successfully', category);
  }

  async findAll(query: QueryCategoriesDto) {
    const result = await this.categoriesRepo.findAll(query);
    return ApiResponse.success('Categories retrieved successfully', {
      categories: result.data,
      meta: result.meta,
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
