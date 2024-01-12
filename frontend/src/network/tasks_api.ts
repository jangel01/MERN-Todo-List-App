import fetchData from "./utils/fetchData";
import { TaskDescriptionInput, TaskStatusInput } from "./interfaces/task";
import { Task as TaskModel } from '../models/task';

export async function fetchTasks(sectionId: string): Promise<TaskModel[]> {
    const response = await fetchData("/api/tasks/" + sectionId + "/getTasks/", { method: "GET" });
    return response.json();
}

export async function fetchTask(sectionId: string, taskId: string): Promise<TaskModel> {
    const body = {sectionId}

    const response = await fetchData("/api/tasks/" + taskId + "/getTask/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    return response.json();
}

export async function createTask(sectionId: string, task: TaskDescriptionInput) {
    const body = {...task, sectionId}

    const response = await fetchData("/api/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function updateTaskDescription(sectionId: string, taskId: string, task: TaskDescriptionInput) {
    const body = {...task, sectionId}

    const response = await fetchData("/api/tasks/" + taskId + "/description/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function updateTaskStatus(sectionId: string, taskId: string, task: TaskStatusInput) {
    const body = {...task, sectionId};

    const response = await fetchData("/api/tasks/" + taskId + "/completed/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function deleteTask(sectionId: string, taskId: string) {
    const body = {sectionId}

    await fetchData("api/tasks/" + taskId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
}