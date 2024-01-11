export interface TaskInput {
    taskDescription?: string,
    taskCompleted: string,
}

export interface TaskDescriptionInput {
    taskDescription?: string,
}

export interface TaskStatusInput {
    taskCompleted: boolean,
}