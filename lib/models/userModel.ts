import mongoose from "mongoose";

export type UserType = {
  name: string;
  email: string;
  password: string;
  confirmationCode: string;
  isConfirmed: boolean;
  created: Date;
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minlength: [4, "Username must be at least 4 characters long"],
    maxlength: [20, "Username must be at max 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter and one number",
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
  created: { type: Date, default: Date.now },
});

export const User = mongoose.models.User;
