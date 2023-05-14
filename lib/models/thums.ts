import mongoose from "mongoose";

const thumbSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
    filename: String,
    mimetype: String,
    thumb: Object,
    thumbSize: Number,
    thumbPath: String,
    created_at: { type: Date, default: Date.now },
});

export const Thumb = mongoose.model("Thumb");