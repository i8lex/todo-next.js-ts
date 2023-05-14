import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {
        type: String,
        required: [true, "Name is required"],
        minlength: [4, "Username must be at least 4 characters long"],
        maxlength: [20, "Username must be at max 20 characters long"],
    },
    description: {
        type: String,
        maxlength: [500, "Task description must be at max 500 characters long"],
    },
    images: Array,
    done: {
        type: Boolean,
        default: false,
    },
    created: { type: Date, default: Date.now },
    deadline: { type: Date },
});

export const Task = mongoose.model("Task", TaskSchema);