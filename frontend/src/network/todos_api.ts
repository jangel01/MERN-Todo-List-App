import { Todo as TodoModel} from "../models/todo";
import { TodoInput } from "./interfaces/todo";
import fetchData from "./utils/fetchData";

export async function fetchTodos(): Promise<TodoModel[]> {
    const response = await fetchData("/api/todos/", { method: "GET" });
    return response.json();
}

export async function fetchTodo(todoId: string): Promise<TodoModel> {
    const response = await fetchData("/api/todos/" + todoId, { method: "GET" });

    return response.json();
}

export async function createTodo(todo: TodoInput) {
    const response = await fetchData("/api/todos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
    });

    return response.json();
}

export async function updateTodo(todoId: string, todo: TodoInput): Promise<TodoModel> {
    const response = await fetchData("/api/todos/" + todoId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
    })

    return response.json();
}

export async function deleteTodo(todoId: string) {
    await fetchData("/api/todos/" + todoId, {method: "DELETE"});
}


