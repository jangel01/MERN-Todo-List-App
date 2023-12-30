import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
    description: { type: String, required: true },
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


export type Task = InferSchemaType<typeof taskSchema>
export type Section = InferSchemaType<typeof sectionSchema>
export type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>("Todo", todoSchema);
