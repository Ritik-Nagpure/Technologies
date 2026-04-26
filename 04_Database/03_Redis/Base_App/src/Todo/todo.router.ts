import { Router } from "express";
import { getTodos, createTodo, updateTodo, deleteTodo, getTodo } from "../Todo/todo.controller";
import { validateTodo } from "../Todo/todo.validation";

const router = Router();

router.get("/", getTodos);
router.post("/", validateTodo, createTodo);
router.get("/:id", getTodo);
router.put("/:id", validateTodo, updateTodo);
router.delete("/:id", deleteTodo);

export default router;

// expected json body to be : {"id": 8, "title": "new todoghgh", "completed": false}
