// import mongoose from "mongoose";
//
// export const thumbSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
//     image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
//     filename: String,
//     mimetype: String,
//     thumb: Object,
//     thumbSize: Number,
//     thumbPath: String,
//     created_at: { type: Date, default: Date.now },
// });
//
// export const Thumb = mongoose.model("Thumb");

import mongoose, { Document, Schema } from "mongoose";

export type ThumbType = {
  user: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  image: mongoose.Types.ObjectId;
  filename: string;
  mimetype: string;
  thumb: object;
  thumbSize: number;
  thumbPath: string;
  created_at: Date;
};

const thumbSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  task: { type: Schema.Types.ObjectId, ref: "Task" },
  image: { type: Schema.Types.ObjectId, ref: "Image" },
  filename: String,
  mimetype: String,
  thumb: Object,
  thumbSize: Number,
  thumbPath: String,
  created_at: { type: Date, default: Date.now },
});

export const Thumb = mongoose.models.Thumb;
