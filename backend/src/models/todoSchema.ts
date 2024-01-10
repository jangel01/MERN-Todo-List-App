import { Schema } from "mongoose";

const todoSchema = new Schema({
    todoName: { type: String, required: true },
}, { timestamps: true });

export default todoSchema;