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

export async function deleteTodo(todoId: string) {
    await fetchData("/api/todos/" + todoId, {method: "DELETE"});
}

export interface SectionInput {
    name?: string,
}

export async function createSection(todoId: string, section: SectionInput) {
    const response = await fetchData("/api/todos/" + todoId + "/sections/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(section),
    });

    return response.json();
}

export async function updateSection(todoId: string, sectionId: string, section: SectionInput) {
    const response = await fetchData("api/todos/" + todoId + "/sections/" + sectionId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(section),
    });

    return response.json();
}

export async function deleteSection(todoId: string, sectionId: string) {
    await fetchData("api/todos/" + todoId + "/sections/" + sectionId, {method: "DELETE"});
}

