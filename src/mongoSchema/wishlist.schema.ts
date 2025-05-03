import { Schema, model } from 'mongoose';

const WishlistSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

export const WishlistModel = model('Wishlist', WishlistSchema);
