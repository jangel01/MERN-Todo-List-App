import { InferSchemaType, Schema, model } from "mongoose";

const todoSchema = new Schema({
    name: { type: String, required: true },
    sections: [{
        name: { type: String },
        tasks: [{
            description: { type: String },
            completed: { type: Boolean, default: false },
        }]
    }]
}, { timestamps: true });

type Todo = InferSchemaType<typeof todoSchema>;

export default model<Todo>("Todo", todoSchema);
