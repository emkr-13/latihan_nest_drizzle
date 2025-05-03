import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const ReviewModel = model('Review', ReviewSchema);