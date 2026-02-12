import { Router } from "express";
import { readTodos, getTodo, createTodo, updateTodo, deleteTodo } from "../Todo/todo.controller";
import { validateTodo } from "../Todo/todo.validation";

const router = Router();

router.get("/", readTodos);
router.get("/:id", getTodo);
router.post("/", validateTodo, createTodo);
router.put("/", validateTodo, updateTodo);
router.delete("/", deleteTodo);

export default router;

// expected json body to be : {"id": 8, "title": "new todoghgh", "completed": false}
