import { Schema } from "mongoose";

const todoSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    todoName: { type: String, required: true },
}, { timestamps: true });

export default todoSchema;