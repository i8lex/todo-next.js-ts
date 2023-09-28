import mongoose from 'mongoose';

export type MicrotaskType = {
  title: string;
  description: string;
  chat: mongoose.Types.ObjectId;
  tasks: mongoose.Types.ObjectId[];
  image: mongoose.Types.ObjectId;
  audio: mongoose.Types.ObjectId;
  taggedUsers: mongoose.Types.ObjectId[];
  video: { name: string; link: string };
  user: mongoose.Types.ObjectId;
  done: boolean;
  created: Date;
  deadline: Date;
};

const MicrotaskSchema = new mongoose.Schema({
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
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  description: {
    type: String,
    maxlength: [
      2000,
      'Microtask description must be at max 2000 characters long',
    ],
  },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  audio: { type: mongoose.Schema.Types.ObjectId, ref: 'Audio' },
  video: { type: Object },
  done: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
  deadline: { type: Date, default: new Date(0) },
});

export const Microtask =
  mongoose.models.Microtask ||
  mongoose.model<MicrotaskType>('Microtask', MicrotaskSchema);
