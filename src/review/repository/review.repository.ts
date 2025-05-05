import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../../mongoSchema/review.schema';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const review = new this.reviewModel({
      ...createReviewDto,
      userId,
    });
    return review.save();
  }

  async findAllByProduct(productId: string) {
    return this.reviewModel.find({ productId }).exec();
  }

  async findOne(id: string) {
    return this.reviewModel.findById(id).exec();
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.reviewModel.findByIdAndUpdate(
      id,
      { ...updateReviewDto, updatedAt: new Date() },
      { new: true },
    ).exec();
  }

  async isOwner(userId: string, reviewId: string) {
    const review = await this.reviewModel.findById(reviewId).exec();
    return review?.userId === userId;
  }
}