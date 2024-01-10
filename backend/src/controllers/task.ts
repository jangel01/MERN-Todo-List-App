import * as TaskInterfaces from "../interfaces/task";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {SectionModel, TaskModel} from "../models/models";
import { RequestHandler } from "express";

export const createTask: RequestHandler<unknown, unknown, TaskInterfaces.CreateTaskBody, unknown> = async (req, res, next) => {
    const taskDescription = req.body.taskDescription;
    const sectionId = req.body.sectionId;

    try {
        if (!mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid section id specified");
        }

        if (!taskDescription) {
            throw createHttpError(400, "Error: Task must have a description");
        }

        const section = await SectionModel.findById(sectionId).exec();

        if (!section) {
            throw createHttpError(404, "Error: Can not create task -- section not found");
        }

        const newTask = await TaskModel.create({
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

    try {
        if (!mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid section or task id specified");
        }

        if (!taskDescription) {
            throw createHttpError(400, "Error: Task must have a description");
        }

        const section = await SectionModel.findById(sectionId).exec();

        if (!section) {
            throw createHttpError(404, "Error: Can not update task name -- section not found");
        }

        const taskToUpdate = await TaskModel.findById(taskId).exec();

        if (!taskToUpdate) {
            throw createHttpError(404, "Error: Task not found");
        }

        if (taskToUpdate.sectionId.toString() !== sectionId) {
            throw createHttpError(400, "Error: The specified sectionId does not match the sectionId associated with the task");
        }

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

    try {
        if (!mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid section or task id specified");
        }

        if (!taskCompleted) {
            throw createHttpError(404, "Error: Can not update task status -- boolean is undefined");
        }

        const section = await SectionModel.findById(sectionId).exec();

        if (!section) {
            throw createHttpError(404, "Error: Can not update task -- section not found");
        }

        const taskToUpdate = await TaskModel.findById(taskId).exec();

        if (!taskToUpdate) {
            throw createHttpError(404, "Error: Task not found");
        }

        if (taskToUpdate.sectionId.toString() !== sectionId) {
            throw createHttpError(400, "Error: The specified sectionId does not match the sectionId associated with the task");
        }

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

    try {
        if (!mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        const section = await SectionModel.findById(sectionId).exec();

        if (!section) {
            throw createHttpError(404, "Error: Can not delete task -- section not found");
        }

        const taskToDelete = await TaskModel.findById(taskId).exec();

        if (!taskToDelete) {
            throw createHttpError(404, "Error: Can not delete task -- task not found");
        }

        await taskToDelete.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};