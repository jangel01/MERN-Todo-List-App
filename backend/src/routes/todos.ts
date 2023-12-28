import express from "express";
import * as TodosController from "../controllers/todos";

const router = express.Router();

router.get("/", TodosController.getTodos);

router.get("/:todoId", TodosController.getTodo)

router.post("/", TodosController.createTodo);

router.post('/:todoId/sections', TodosController.createSection);

router.post('/:todoId/sections/:sectionId/tasks', TodosController.createTask);

export default router;