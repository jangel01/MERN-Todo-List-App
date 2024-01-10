import { RequestHandler } from "express";
import { TodoModel, SectionModel, TaskModel } from "../models/models";
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
            throw createHttpError(400, "Error: Invalid todo id");
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Error: Todo not found");
        }

        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

export const createTodo: RequestHandler<unknown, unknown, TodoInterfaces.CreateTodoBody, unknown> = async (req, res, next) => {
    const todoName = req.body.todoName;

    try {
        if (!todoName) {
            throw createHttpError(400, "Error: Todo must have a name");
        }

        const newToDo = await TodoModel.create({
            todoName: todoName,
        });

        res.status(201).json(newToDo);
    } catch (error) {
        next(error);
    }
};

export const updateTodo: RequestHandler<TodoInterfaces.UpdateTodoParams, unknown, TodoInterfaces.UpdateTodoBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const todoName = req.body.todoName;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Error: Invalid todo id specified");
        }

        if (!todoName) {
            throw createHttpError(400, "Error: Todo must have a name");
        }

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            todoId,
            { $set: { todoName: todoName } },
            { new: true }
        );

        if (!updatedTodo) {
            throw createHttpError(404, "Error: Could not update todo name -- todo not found");
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
            throw createHttpError(400, "Error: Invalid todo id specified");
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Error: Todo not found");
        }

        const sectionsToDelete = await SectionModel.find({ todoId: todoId });

        for (const section of sectionsToDelete) {
            await TaskModel.deleteMany({ sectionId: section._id });
        }

        await SectionModel.deleteMany({ todoId: todoId });

        await todo.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};
