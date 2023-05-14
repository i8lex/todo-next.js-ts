import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    thumb: { type: mongoose.Schema.Types.ObjectId, ref: "Thumb" },
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

export const Image = mongoose.model("Image");