import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    id: Number,
    title: String,
    completed: Boolean
});

export const todo = mongoose.model("todo", todoSchema)