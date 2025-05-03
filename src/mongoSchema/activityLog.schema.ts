import { Schema, model } from 'mongoose';

const ActivityLogSchema = new Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true }, // Contoh: "create_product", "add_to_wishlist"
  details: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export const ActivityLogModel = model('ActivityLog', ActivityLogSchema);
