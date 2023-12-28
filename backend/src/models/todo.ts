import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
    description: { type: String },
    completed: { type: Boolean, default: false },
});

const sectionSchema = new Schema({
    name: { type: String },
    tasks: [taskSchema],
});

const todoSchema = new Schema({
    name: { type: String, required: true },
    sections: [sectionSchema],
}, { timestamps: true });


type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>("Todo", todoSchema);
