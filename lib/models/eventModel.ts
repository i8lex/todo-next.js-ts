import mongoose from 'mongoose';

export type EventType = {
  title: string;
  description: string;
  images: string[];
  done: boolean;
  created: Date;
  deadline: Date;
};

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  images: { type: [String], default: [] },
  done: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
  deadline: { type: Date, default: new Date(0) },
});

export const Event =
  mongoose.models.Event || mongoose.model<EventType>('Event', EventSchema);
