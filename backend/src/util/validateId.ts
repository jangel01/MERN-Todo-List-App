import mongoose from "mongoose";
import { SectionModel, TaskModel, TodoModel } from "../models/models";
import createHttpError from "http-errors";

const validateObjectId = (documentId: string | undefined, modelName: string) => {
    if (!mongoose.isValidObjectId(documentId)) {
        throw createHttpError(400, `Invalid ${modelName} id specified`);
    }
};

const validateAccess = <T extends { userId: mongoose.Types.ObjectId }>(
    document: T | null,
    documentType: string,
    userId: mongoose.Types.ObjectId,
    documentReferenceIdMatch?: (query: T) => boolean
) => {
    if (!document) {
        throw createHttpError(404, `Error: ${documentType} not found`);
    }

    if (!document.userId.equals(userId)) {
        throw createHttpError(401, `You cannot access this ${documentType}`);
    }

    if (documentReferenceIdMatch && !documentReferenceIdMatch(document)) {
        throw createHttpError(401, `${documentType} reference id do not match`);
    }
};


export const validateFetchTodo = async (
    todoId: string | undefined,
    userId: mongoose.Types.ObjectId) => {

    validateObjectId(todoId, "todo");

    const todo = await TodoModel.findById(todoId).exec();
    validateAccess(todo, "Todo", userId);

    return todo!;
};

export const validateFetchSection = async (
    sectionId: string | undefined,
    userId: mongoose.Types.ObjectId,
    todoId?: string,) => {

    validateObjectId(sectionId, "section");

    let section; 
    if (todoId !== undefined) {
        section = await SectionModel.findOne({ userId: userId, _id: sectionId, todoId: todoId }).exec();

        validateAccess(
            section,
            "Section",
            userId,
            (section) => section && section.todoId.equals(todoId)
        );
    } else {
        section = await SectionModel.findById(sectionId);

        validateAccess(
            section,
            "Section",
            userId,
        );
    }

    return section!;
};

export const validateFetchTask = async (
    taskId: string | undefined,
    userId: mongoose.Types.ObjectId,
    sectionId?: string,
) => {

    validateObjectId(taskId, "task");

    let task;
    if (sectionId !== undefined) {
        task = await TaskModel.findOne({ userId: userId, _id: taskId, sectionId: sectionId }).exec();

        validateAccess(
            task,
            "Task",
            userId,
            (task) => task && task.sectionId.equals(sectionId)
        );
    } else {
        task = await TaskModel.findById(taskId);

        validateAccess(
            task,
            "Task",
            userId,
        );
    }

    return task!;
};

