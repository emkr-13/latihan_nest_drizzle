import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from './repository/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiResponse } from '../utils/helper/api-response';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const review = await this.reviewRepo.create(userId, createReviewDto);
    return ApiResponse.success('Review created successfully', review);
  }

  async findAllByProduct(productId: string) {
    const reviews = await this.reviewRepo.findAllByProduct(productId);
    return ApiResponse.success('Reviews retrieved successfully', reviews);
  }

  async findOne(id: string) {
    const review = await this.reviewRepo.findOne(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return ApiResponse.success('Review retrieved successfully', review);
  }

  async update(userId: string, id: string, updateReviewDto: UpdateReviewDto) {
    const isOwner = await this.reviewRepo.isOwner(userId, id);
    if (!isOwner) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const review = await this.reviewRepo.update(id, updateReviewDto);
    return ApiResponse.success('Review updated successfully', review);
  }
}
