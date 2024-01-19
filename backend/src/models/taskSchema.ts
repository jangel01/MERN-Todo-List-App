import { Schema } from "mongoose";

const taskSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    taskDescription: { type: String, required: true },
    taskCompleted: { type: Boolean, default: false },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
}, { timestamps: true });

export default taskSchema;