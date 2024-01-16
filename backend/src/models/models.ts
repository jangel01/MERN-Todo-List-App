import { InferSchemaType, model } from "mongoose";
import taskSchema from "./taskSchema";
import sectionSchema from "./sectionSchema";
import todoSchema from "./todoSchema";
import userSchema from "./userSchema";

type Task = InferSchemaType<typeof taskSchema>;
type Section = InferSchemaType<typeof sectionSchema>;
type Todo = InferSchemaType<typeof todoSchema>;
type User = InferSchemaType<typeof userSchema>

export const TaskModel = model<Task>("Task", taskSchema);
export const SectionModel = model<Section>("Section", sectionSchema);
export const TodoModel = model<Todo>("Todo", todoSchema);
export const UserModel = model<User>("User", userSchema);
