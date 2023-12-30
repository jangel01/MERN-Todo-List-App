export interface CreateTodoBody {
    name?: string;
}

export interface UpdateTodoParams {
    todoId: string;
}

export interface UpdateTodoBody {
    name?: string;
}

export interface CreateSectionParams {
    todoId: string;
}

export interface CreateSectionBody {
    name?: string;
}

export interface UpdateSectionParams {
    todoId: string;
    sectionId: string;
}

export interface UpdateSectionBody {
    name?: string;
}

export interface CreateTaskParams {
    todoId: string;
    sectionId: string;
}

export interface CreateTaskBody {
    description?: string;
}

export interface UpdateTaskNameParams {
    todoId: string,
    sectionId: string,
    taskId: string,
}

export interface UpdateTaskNameBody {
    description?: string,
}

export interface UpdateTaskStatusParams {
    todoId: string,
    sectionId: string,
    taskId: string,
}

export interface UpdateTaskStatusBody {
    completed? : boolean,
}