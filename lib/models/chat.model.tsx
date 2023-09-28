import mongoose, { Schema } from 'mongoose';
const fileDataSchema = new Schema({
  name: { type: String },
  buffer: { type: String },
  mimeType: { type: String },
});
export type ChatType = {
  messages: {
    user: mongoose.Types.ObjectId;
    type: string;
    text?: string;
    image?: {
      name: string;
      buffer: string;
      thumbBuffer: string;
      mimeType: string;
    };
    audio?: {
      name: string;
      buffer: string;
      mimeType: string;
    };
    video?: { name: string; link: string };
    created: Date;
  }[];
  event: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  microtask: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  users: mongoose.Types.ObjectId[];
  created: Date;
};

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  microtask: { type: mongoose.Schema.Types.ObjectId, ref: 'Microtask' },

  messages: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
    },
    text: {
      type: String,
      minlength: [1, 'Message must be at min 1 characters long'],
      maxlength: [500, 'Message must be at max 500 characters long'],
    },
    image: fileDataSchema,
    audio: fileDataSchema,
    video: { type: Object },
    created: { type: Date, default: Date.now },
  },
  created: { type: Date, default: Date.now },
});

export const Microtask =
  mongoose.models.Chat || mongoose.model<ChatType>('Chat', ChatSchema);
