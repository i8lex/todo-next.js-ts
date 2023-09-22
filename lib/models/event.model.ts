import mongoose from 'mongoose';

export type EventType = {
  title: string;
  description: string;
  users: mongoose.Types.ObjectId[];
  chat: mongoose.Types.ObjectId;
  tasks: mongoose.Types.ObjectId[];
  images: mongoose.Types.ObjectId[];
  audios: mongoose.Types.ObjectId[];
  videos: { name: string; link: string }[];
  isPrivate: string;
  done: boolean;
  created: Date;
  deadline: Date;
};

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [4, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username must be at max 20 characters long'],
  },
  description: {
    type: String,
    maxlength: [2000, 'Event description must be at max 2000 characters long'],
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  videos: { type: [Object], default: [] },
  isPrivate: {
    type: String,
  },
  done: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
  deadline: { type: Date, default: new Date(0) },
});

export const Event =
  mongoose.models.Event || mongoose.model<EventType>('Event', EventSchema);
