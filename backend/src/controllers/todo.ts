import { RequestHandler } from "express";
import TodoModel from "../models/todo";
import createHttpError from "http-errors";
import * as TodoInterfaces from "../interfaces/todo";
import mongoose from "mongoose";

export const getTodos: RequestHandler = async (req, res, next) => {
    try {
        const todos = await TodoModel.find().exec();
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

export const getTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

export const createTodo: RequestHandler<unknown, unknown, TodoInterfaces.CreateTodoBody, unknown> = async (req, res, next) => {
    const name = req.body.name;

    try {
        if (!name) {
            throw createHttpError(400, "Todo must have a name");
        }

        const newToDo = await TodoModel.create({
            name: name,
        });

        res.status(201).json(newToDo);
    } catch (error) {
        next(error);
    }
};

export const updateTodo: RequestHandler<TodoInterfaces.UpdateTodoParams, unknown, TodoInterfaces.UpdateTodoBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const name = req.body.name;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        if (!name) {
            throw createHttpError(400, "Todo must have a name");
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todoId,
            { $set: { name: name } },
            { new: true }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not update todo name: todo not found");
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        await TodoModel.findByIdAndDelete(todoId);

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};

export const createSection: RequestHandler<TodoInterfaces.CreateSectionParams, unknown, TodoInterfaces.CreateSectionBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    let sectionName = req.body.name;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todoId,
            { $push: { sections: { name: sectionName } } },
            { new: true }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not create section: todo not found");
        }

        const newSectionId = updatedTodo.sections[updatedTodo.sections.length - 1]._id;
        const newSection = updatedTodo.sections.find(section => section._id?.equals(newSectionId));

        res.status(201).json(newSection);
    } catch (error) {
        next(error);
    }
};

export const updateSection: RequestHandler<TodoInterfaces.UpdateSectionParams, unknown, TodoInterfaces.UpdateSectionBody, unknown> = async (req, res, next) => {
    const { todoId, sectionId } = req.params;

    let sectionName = req.body.name;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: todoId, 'sections._id': sectionId },
            { $set: { 'sections.$.name': sectionName } },
            { new: true }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not update section name: section not found");
        }

        res.status(200).json(updatedTodo);

    } catch (error) {
        next(error);
    }
};

export const deleteSection: RequestHandler = async (req, res, next) => {
    const { todoId, sectionId} = req.params;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        await TodoModel.findOneAndUpdate(
            { _id: todoId },
            { $pull: { sections: { _id: sectionId } } },
            { new: true }
        );

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};

export const createTask: RequestHandler<TodoInterfaces.CreateTaskParams, unknown, TodoInterfaces.CreateTaskBody, unknown> = async (req, res, next) => {
    const { todoId, sectionId } = req.params;
    const description = req.body.description;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        if (!description) {
            throw createHttpError(400, "Task must have a description");
        }

        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: todoId, 'sections._id': sectionId },
            { $push: { 'sections.$.tasks': { description: description, completed: false } } },
            { new: true }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not create task: section not found");
        }

        res.status(201).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

export const updateTaskName: RequestHandler<TodoInterfaces.UpdateTaskNameParams, unknown, TodoInterfaces.UpdateTaskNameBody, unknown> = async (req, res, next) => {
    const { todoId, sectionId, taskId } = req.params;
    const description = req.body.description;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        if (!description) {
            throw createHttpError(400, "Task must have a description");
        }

        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: todoId, 'sections._id': sectionId, 'sections.tasks._id': taskId },
            { $set: { 'sections.$.tasks.$[task].description': description } },
            { new: true, arrayFilters: [{ 'task._id': taskId }] }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not update task name: Task not found");
        }

        res.status(200).json(updatedTodo);

    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus: RequestHandler<TodoInterfaces.UpdateTaskStatusParams, unknown, TodoInterfaces.UpdateTaskStatusBody, unknown> = async (req, res, next) => {
    const { todoId, sectionId, taskId } = req.params;
    const completed = req.body.completed;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: todoId, 'sections._id': sectionId, 'sections.tasks._id': taskId },
            { $set: { 'sections.$.tasks.$[task].completed': completed } },
            { new: true, arrayFilters: [{ 'task._id': taskId }] }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Could not update task status: Task not found");
        }

        res.status(200).json(updatedTodo);

    } catch (error) {
        next(error);
    }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
    const { todoId, sectionId, taskId } = req.params;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId) || !mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Error: Invalid id specified");
        }

        await TodoModel.findOneAndUpdate(
            { _id: todoId, 'sections._id': sectionId },
            { $pull: { 'sections.$.tasks': { _id: taskId } } },
            { new: true }
        );

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};