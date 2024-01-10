import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import {SectionModel, TodoModel, TaskModel} from "../models/models";
import * as SectionInterfaces from "../interfaces/section";

export const getSections: RequestHandler = async (req, res, next) => {
    try {
        const sections = await SectionModel.find().exec();
        res.status(200).json(sections);
    } catch (error) {
        next(error);
    }
};

export const getSection: RequestHandler = async (req, res, next) => {
    const sectionId = req.params.sectionId;
    const todoId = req.body.todoId;

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Invalid todo or section id specified");
        }

        const section = await SectionModel.findOne({ _id: sectionId, todoId: todoId }).exec();

        if (!section) {
            throw createHttpError(404, "Error: Section not found");
        }

        res.status(200).json(section);
    } catch (error) {
        next(error);
    }
};

export const createSection: RequestHandler<unknown, unknown, SectionInterfaces.CreateSectionBody, unknown> = async (req, res, next) => {
    const todoId = req.body.todoId;
    let sectionName = req.body.sectionName;

    try {
        if (!mongoose.isValidObjectId(todoId)) {
            throw createHttpError(400, "Error: Invalid todo id specified");
        }

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Error: Can not create section -- todo not found");
        }

        const newSection = await SectionModel.create({
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

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid todo or section id specified");
        }

        if (!sectionName) {
            sectionName = "Unnamed section";
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Error: Can not update section -- todo not found");
        }

        const sectionToUpdate = await SectionModel.findById(sectionId).exec();

        if (!sectionToUpdate) {
            throw createHttpError(404, "Error: Section not found");
        }

        if (sectionToUpdate.todoId.toString() !== todoId) {
            throw createHttpError(400, "Error: The specified todoId does not match the todoId associated with the section");
        }

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

    try {
        if (!mongoose.isValidObjectId(todoId) || !mongoose.isValidObjectId(sectionId)) {
            throw createHttpError(400, "Error: Invalid todo or section id specified");
        }

        const todo = await TodoModel.findById(todoId).exec();

        if (!todo) {
            throw createHttpError(404, "Error: Can not delete section -- todo not found");
        }

        const sectionToDelete = await SectionModel.findById(sectionId).exec();

        if (!sectionToDelete) {
            throw createHttpError(404, "Error: Can not delete section -- section not found");
        }

        if (sectionToDelete.todoId.toString() !== todoId) {
            throw createHttpError(400, "Error: The specified todoId does not match the todoId associated with the section");
        }

        await TaskModel.deleteMany({ sectionId: sectionId });

        await sectionToDelete.deleteOne();

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};