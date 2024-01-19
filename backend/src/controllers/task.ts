import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as TaskInterfaces from "../interfaces/task";
import { TaskModel } from "../models/models";
import { assertIsDefined } from "../util/assertIsDefined";
import { validateFetchSection, validateFetchTask } from "../util/validateId";

export const getTasks: RequestHandler = async (req, res, next) => {
    const sectionId = req.params.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        
        await validateFetchSection(sectionId, authenticatedUserId);

        const tasks = await TaskModel.find({userId: authenticatedUserId, sectionId: sectionId}).exec();

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

export const getTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId;
    const sectionId = req.body.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchSection(sectionId, authenticatedUserId);

        const task = await validateFetchTask(taskId, authenticatedUserId, sectionId);

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

export const createTask: RequestHandler<unknown, unknown, TaskInterfaces.CreateTaskBody, unknown> = async (req, res, next) => {
    const taskDescription = req.body.taskDescription;
    const sectionId = req.body.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!taskDescription) {
            throw createHttpError(400, "Task must have a description");
        }

        await validateFetchSection(sectionId, authenticatedUserId);

        const newTask = await TaskModel.create({
            userId: authenticatedUserId,
            taskDescription: taskDescription,
            taskCompleted: false,
            sectionId: sectionId,
        });

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

export const updateTaskName: RequestHandler<TaskInterfaces.UpdateTaskNameParams, unknown, TaskInterfaces.UpdateTaskNameBody, unknown> = async (req, res, next) => {
    const taskId = req.params.taskId;
    const taskDescription = req.body.taskDescription;
    const sectionId = req.body.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!taskDescription) {
            throw createHttpError(400, "Error: Task must have a description");
        }

        await validateFetchSection(sectionId, authenticatedUserId);

        const taskToUpdate = await validateFetchTask(taskId, authenticatedUserId, sectionId);

        taskToUpdate.taskDescription = taskDescription;

        const updatedTask = await taskToUpdate.save();

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus: RequestHandler<TaskInterfaces.UpdateTaskStatusParams, unknown, TaskInterfaces.UpdateTaskStatusBody, unknown> = async (req, res, next) => {
    const taskId = req.params.taskId;
    const taskCompleted = req.body.taskCompleted;
    const sectionId = req.body.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (taskCompleted === undefined) {
            throw createHttpError(404, "Error: Can not update task status -- boolean is undefined");
        }

        await validateFetchSection(sectionId, authenticatedUserId);

        const taskToUpdate = await validateFetchTask(taskId, authenticatedUserId, sectionId);

        taskToUpdate.taskCompleted = taskCompleted;

        const updatedTask = await taskToUpdate.save();

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId;
    const sectionId = req.body.sectionId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchSection(sectionId, authenticatedUserId);

        const taskToDelete = await validateFetchTask(taskId, authenticatedUserId, sectionId);

        await taskToDelete.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};