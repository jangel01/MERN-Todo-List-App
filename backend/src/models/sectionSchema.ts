import { Schema } from "mongoose";

const sectionSchema = new Schema({
    sectionName: { type: String },
    todoId: { type: Schema.Types.ObjectId, ref: 'Todo', required: true },
}, { timestamps: true });

export default sectionSchema;