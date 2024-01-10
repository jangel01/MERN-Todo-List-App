import express from "express";
import * as TodosController from "../controllers/todo";

const router = express.Router();

router.get("/", TodosController.getTodos);

router.post("/", TodosController.createTodo);

router.get("/:todoId", TodosController.getTodo)

router.patch("/:todoId", TodosController.updateTodo);

router.delete("/:todoId", TodosController.deleteTodo);

export default router;