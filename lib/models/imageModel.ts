import mongoose, { Document, Schema } from "mongoose";

export type ImageType = {
  user: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
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
  user: { type: Schema.Types.ObjectId, ref: "User" },
  task: { type: Schema.Types.ObjectId, ref: "Task" },
  thumb: { type: Schema.Types.ObjectId, ref: "Thumb" },
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

export const Image = mongoose.models.Image;
