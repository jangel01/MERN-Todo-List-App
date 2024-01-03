import { Todo as TodoModel} from "../models/todo";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export interface TodoInput {
    name: string,
}

export async function createTodo(todo: TodoInput) {
    const response = await fetchData("/api/todos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });

    return response.json();
}

export async function updateTodo(todoId: string, todo: TodoInput): Promise<TodoModel> {
    const response = await fetchData("/api/todos/" + todoId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    })

    return response.json();
}