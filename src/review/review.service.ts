import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewRepository } from './repository/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiResponse } from '../utils/helper/api-response';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const review = await this.reviewRepo.create(userId, createReviewDto);
    return ApiResponse.success('Review created successfully', review);
  }

  async findAllByProduct(productId: string) {
    const reviews = await this.reviewRepo.findAllByProduct(productId);
    
    // Get user details for each review
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userRepo.findUserById(review.userId);
        return {
          ...review.toObject(),
          user: {
            fullname: user.fullname,
            email: user.email,
          },
        };
      }),
    );

    return ApiResponse.success('Reviews retrieved successfully', reviewsWithUsers);
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
