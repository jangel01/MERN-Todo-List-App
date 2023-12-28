import { RequestHandler } from "express";
import TodoModel from "../models/todo";
import createHttpError from "http-errors";
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

interface CreateTodoBody {
    name?: string,
}

export const createTodo: RequestHandler<unknown, unknown, CreateTodoBody, unknown> = async (req, res, next) => {
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

interface CreateSectionParams {
    todoId: string,
}

interface CreateSectionBody {
    name?: string,
}

export const createSection: RequestHandler<CreateSectionParams, unknown, CreateSectionBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    let sectionName = req.body.name;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        // const updatedTodo = await TodoModel.findByIdAndUpdate(
        //     todoId,
        //     { $push: { sections: { name: sectionName } } },
        //     { new: true, runValidators: true }
        // );

        todo.sections.push({ name: sectionName });

        const updatedTodo = await todo.save();

        res.status(201).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

interface CreateTaskParams {
    todoId: string,
    sectionId: string,
}

interface CreateTaskBody {
    description?: string,
}

export const createTask: RequestHandler<CreateTaskParams, unknown, CreateTaskBody, unknown> = async (req, res, next) => {
    const todoId = req.params.todoId;
    const sectionId = req.params.sectionId;
    const description = req.body.description;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Invalid todo id");
        }

        if (!mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Invalid section id");
        }

        if (!description) {
            throw createHttpError(400, "Task must have a description");
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Todo not found");
        }

        // const updatedTodo = await TodoModel.findOneAndUpdate(
        //     { "_id": todoId, "sections._id": sectionId },
        //     {
        //         $push: {
        //             "sections.$.tasks": { description: description, completed: false }
        //         }
        //     },
        //     { new: true, runValidators: true }
        // );

        const sectionIndex = todo.sections.findIndex((section) => section._id?.equals(sectionId));

        if (sectionIndex === -1) {
            throw createHttpError(404, "Section not found");
        }

        todo.sections[sectionIndex].tasks.push({ description, completed: false });

        const updatedTodo = await todo.save();

        res.status(201).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};
