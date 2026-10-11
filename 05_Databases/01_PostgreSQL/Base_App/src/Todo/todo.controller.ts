import { Request, Response } from "express";

// Mock in-memory store
let todos: { id: number; title: string; completed: boolean }[] = [];
let idCounter = 1;

export const getTodos = (req: Request, res: Response) => {
  res.json(todos);
};

export const createTodo = (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const newTodo = { id: idCounter++, title, completed: completed || false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = todos.find(t => t.id === Number(id));

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.title = title ?? todo.title;
  todo.completed = completed ?? todo.completed;

  res.json(todo);
};

export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== Number(id));
  res.status(204).send();
};
