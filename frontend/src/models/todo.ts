export interface Task {
    _id: string;
    description: string;
    completed: boolean;
}

export interface Section {
    _id: string;
    name?: string;
    tasks: Task[];
}

export interface Todo {
    _id: string;
    name: string;
    sections: Section[];
    createdAt: string,
    updatedAt: string,
}
