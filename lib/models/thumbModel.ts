import mongoose, { Schema } from 'mongoose';

export type ThumbType = {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  image: mongoose.Types.ObjectId;
  filename: string;
  mimetype: string;
  thumb: object;
  thumbSize: number;
  thumbPath: string;
  created_at: Date;
};

const thumbSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    unique: true,
    required: true,
  },
  filename: String,
  mimetype: String,
  thumb: Object,
  thumbSize: Number,
  thumbPath: String,
  created_at: { type: Date, default: Date.now },
});

export const Thumb =
  mongoose.models.Thumb || mongoose.model<ThumbType>('Thumb', thumbSchema);
