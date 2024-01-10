export interface CreateTaskBody {
    taskDescription?: string,
    sectionId?: string,
}

export interface UpdateTaskNameParams {
    taskId: string,
}

export interface UpdateTaskNameBody {
    taskDescription?: string,
    sectionId?: string,
}

export interface UpdateTaskStatusParams {
    taskId: string,
}

export interface UpdateTaskStatusBody {
    taskCompleted? : boolean,
    sectionId?: string,
}