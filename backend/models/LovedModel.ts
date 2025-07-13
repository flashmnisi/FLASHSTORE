import mongoose, { Schema } from 'mongoose';

const lovedSchema = new Schema({
  userId: { type: String, required: true, index: true },
  products: [{ type: String }],
});

lovedSchema.index({ userId: 1 });

export const Loved = mongoose.model('Loved', lovedSchema);