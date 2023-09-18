import mongoose, { Schema } from 'mongoose';

export type ImageType = {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  thumb: mongoose.Types.ObjectId;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  image: object;
  thumbMimetype: string;
  thumbSize: number;
  thumbPath: string;
  created_at: Date;
};

const imageSchema: Schema = new Schema({
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
  thumb: {
    type: Schema.Types.ObjectId,
    ref: 'Thumb',
    unique: true,
  },
  filename: String,
  mimetype: String,
  size: Number,
  path: String,
  image: Object,
  thumbMimetype: String,
  thumbSize: Number,
  thumbPath: String,
  created_at: { type: Date, default: Date.now },
});

export const Image =
  mongoose.models.Image || mongoose.model<ImageType>('Image', imageSchema);
