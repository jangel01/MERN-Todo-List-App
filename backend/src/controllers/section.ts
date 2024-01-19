import { RequestHandler } from "express";
import {SectionModel, TaskModel} from "../models/models";
import * as SectionInterfaces from "../interfaces/section";
import { assertIsDefined } from "../util/assertIsDefined";
import { validateFetchSection, validateFetchTodo } from "../util/validateId";

export const getSections: RequestHandler = async (req, res, next) => {
    const todoId = req.params.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchTodo(todoId, authenticatedUserId);

        const sections = await SectionModel.find({userId: authenticatedUserId, todoId : todoId}).exec();

        res.status(200).json(sections);
    } catch (error) {
        next(error);
    }
};

export const getSection: RequestHandler = async (req, res, next) => {
    const sectionId = req.params.sectionId;
    const todoId = req.body.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchTodo(todoId, authenticatedUserId);

        const section = await validateFetchSection(sectionId, authenticatedUserId, todoId);

        res.status(200).json(section);
    } catch (error) {
        next(error);
    }
};

export const createSection: RequestHandler<unknown, unknown, SectionInterfaces.CreateSectionBody, unknown> = async (req, res, next) => {
    const todoId = req.body.todoId;
    let sectionName = req.body.sectionName;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchTodo(todoId, authenticatedUserId);

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const newSection = await SectionModel.create({
            userId: authenticatedUserId,
            sectionName: sectionName,
            todoId: todoId,
        });

        res.status(201).json(newSection);
    } catch (error) {
        next(error);
    }
};

export const updateSection: RequestHandler<SectionInterfaces.UpdateSectionParams, unknown, SectionInterfaces.UpdateSectionBody, unknown> = async (req, res, next) => {
    const sectionId = req.params.sectionId;
    let sectionName = req.body.sectionName;
    const todoId = req.body.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        await validateFetchTodo(todoId, authenticatedUserId);

        const sectionToUpdate = await validateFetchSection(sectionId, authenticatedUserId, todoId);

        sectionToUpdate.sectionName = sectionName;

        const updatedSection = await sectionToUpdate.save();

        res.status(200).json(updatedSection);
    } catch (error) {
        next(error);
    }
};

export const deleteSection: RequestHandler = async (req, res, next) => {
    const sectionId = req.params.sectionId;
    const todoId = req.body.todoId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        await validateFetchTodo(todoId, authenticatedUserId);

        const sectionToDelete = await validateFetchSection(sectionId, authenticatedUserId, todoId);

        await TaskModel.deleteMany({ sectionId: sectionId });

        await sectionToDelete.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};