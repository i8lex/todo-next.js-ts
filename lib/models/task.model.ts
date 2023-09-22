import mongoose from 'mongoose';

export type TaskType = {
  title: string;
  description: string;
  chat: mongoose.Types.ObjectId;
  microtasks: mongoose.Types.ObjectId[];
  images: mongoose.Types.ObjectId[];
  audios: mongoose.Types.ObjectId[];
  videos: { name: string; link: string }[];
  user: mongoose.Types.ObjectId;
  taggedUsers: mongoose.Types.ObjectId[];
  done: boolean;
  created: Date;
  deadline: Date;
};

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  taggedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [4, 'Title must be at least 4 characters long'],
    maxlength: [20, 'Title must be at max 20 characters long'],
  },
  microtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Microtask' }],
  description: {
    type: String,
    maxlength: [2000, 'Task description must be at max 2000 characters long'],
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  videos: [{ type: [Object], default: [] }],
  done: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
  deadline: { type: Date, default: new Date(0) },
});

export const Task =
  mongoose.models.Task || mongoose.model<TaskType>('Task', TaskSchema);
