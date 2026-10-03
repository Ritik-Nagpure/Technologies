import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: String,
    completed: Boolean
});

export const todo = mongoose.model("todo", todoSchema)