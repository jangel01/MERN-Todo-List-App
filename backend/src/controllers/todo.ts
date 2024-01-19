import { RequestHandler } from "express";
import { TodoModel, SectionModel, TaskModel } from "../models/models";
import createHttpError from "http-errors";
import * as TodoInterfaces from "../interfaces/todo";
import { assertIsDefined } from "../util/assertIsDefined";
import { validateFetchTodo } from "../util/validateId";

export const getTodos: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const todos = await TodoModel.find({ userId: authenticatedUserId }).exec();

        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

export const getTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const todo = await validateFetchTodo(todoId, authenticatedUserId);

        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

export const createTodo: RequestHandler<unknown, unknown, TodoInterfaces.CreateTodoBody, unknown> = async (req, res, next) => {
    const todoName = req.body.todoName;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!todoName) {
            throw createHttpError(400, "Todo must have a name");
        }

        const newToDo = await TodoModel.create({
            userId: authenticatedUserId,
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
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!todoName) {
            throw createHttpError(400, "Todo must have a name");
        }

        const todo = await validateFetchTodo(todoId, authenticatedUserId);

        todo.todoName = todoName;

        const updatedTodo = await todo.save();

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const todo = await validateFetchTodo(todoId, authenticatedUserId);

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
