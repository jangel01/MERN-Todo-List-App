import express from "express";
import * as TodosController from "../controllers/todo";

const router = express.Router();

router.get("/", TodosController.getTodos);

router.get("/:todoId", TodosController.getTodo)

router.post("/", TodosController.createTodo);

router.patch("/:todoId", TodosController.updateTodo);

router.delete("/:todoId", TodosController.deleteTodo);

router.post("/:todoId/sections", TodosController.createSection);

router.patch("/:todoId/sections/:sectionId", TodosController.updateSection);

router.delete("/:todoId/sections/:sectionId", TodosController.deleteSection);

router.post("/:todoId/sections/:sectionId/tasks", TodosController.createTask);

router.delete("/:todoId/sections/:sectionId/tasks/:taskId", TodosController.deleteTask);

router.patch("/:todoId/sections/:sectionId/tasks/:taskId/description", TodosController.updateTaskName);

router.patch("/:todoId/sections/:sectionId/tasks/:taskId/completed", TodosController.updateTaskStatus);

export default router;