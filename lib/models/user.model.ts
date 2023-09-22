import mongoose, { Schema } from 'mongoose';

export type UserType = {
  name: string;
  firstname: string;
  lastname: string;
  birthday: string;
  isBirthdayShowing: string;
  gender: string;
  isGenderShowing: string;
  company: string;
  isCompanyShowing: string;
  role: string;
  isRoleShowing: string;
  about: string;
  isAboutShowing: string;
  email: string;
  password: string;
  confirmationCode: string;
  isConfirmed: boolean;
  created: Date;
  events: mongoose.Types.ObjectId[];
  createdChats: mongoose.Types.ObjectId[];
  chats: mongoose.Types.ObjectId[];
  isEventsShowing: string;
  tasks: mongoose.Types.ObjectId[];
  microtasks: mongoose.Types.ObjectId[];
  connects: mongoose.Types.ObjectId[];
  isConnectsShowing: string;
  avatar: {
    name: string;
    buffer: string;
    thumbBuffer: string;
    mimeType: string;
  };
  superUser: string;
};

const fileDataSchema = new Schema({
  name: { type: String },
  buffer: { type: String },
  mimeType: { type: String },
});
const UserSchema = new mongoose.Schema({
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  isEventsShowing: {
    type: String,
    default: 'false',
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  microtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Microtask' }],
  connects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  isConnectsShowing: {
    type: String,
    default: 'false',
  },
  name: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [2, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username must be at max 20 characters long'],
  },
  firstname: {
    type: String,
    minlength: [2, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username must be at max 20 characters long'],
  },
  lastname: {
    type: String,
    minlength: [2, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username must be at max 20 characters long'],
  },
  birthday: {
    type: String,
  },
  isBirthdayShowing: {
    type: String,
    default: 'false',
  },
  gender: {
    type: String,
    default: 'none',
  },
  isGenderShowing: {
    type: String,
    default: 'false',
  },
  company: {
    type: String,
  },
  isCompanyShowing: {
    type: String,
    default: 'false',
  },
  role: {
    type: String,
  },
  isRoleShowing: {
    type: String,
    default: 'false',
  },
  about: {
    type: String,
    maxlength: [2000, 'Event description must be at max 2000 characters long'],
  },
  isAboutShowing: {
    type: String,
    default: 'false',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one lowercase letter, one uppercase letter and one number',
    ],
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  images: { type: [String], default: [] },
  avatar: fileDataSchema,
  superUser: {
    type: String,
    default: 'false',
  },
  created: { type: Date, default: Date.now },
});

export const User =
  mongoose.models.User || mongoose.model<UserType>('User', UserSchema);
