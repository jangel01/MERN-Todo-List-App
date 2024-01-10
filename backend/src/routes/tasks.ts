import express from "express";
import * as TasksController from "../controllers/task";

const router = express.Router();

router.get("/", TasksController.getTasks);

router.post("/", TasksController.createTask);

router.get("/:taskId", TasksController.getTask);

router.delete("/:taskId", TasksController.deleteTask);

router.patch("/:taskId/description", TasksController.updateTaskName);

router.patch("/:taskId/completed", TasksController.updateTaskStatus);

export default router;

