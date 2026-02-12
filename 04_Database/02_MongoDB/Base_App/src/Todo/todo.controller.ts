import { Request, Response } from "express";
import { createTodo_mg, readTodos_mg, getTodo_mg, updateTodo_mg, deleteTodo_mg } from "../mongoose/db_layer";

type Todo = { id: number; title: string; completed: boolean }

// Mock in-memory store
let todos: Todo[] = [];
let idCounter = 1;

export const readTodos = async (req: Request, res: Response) => {
  const result: any = await readTodos_mg();
  res.json(result);
};

export const getTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result: any = await getTodo_mg({ id: id });
  res.json(result);
};

export const createTodo = (req: Request, res: Response) => {
  const { desc, completed } = req.body;
  const newTodo = { id: idCounter++, title: desc, completed: completed || false };
  createTodo_mg(newTodo);
  console.log(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id, desc, completed } = req.body;
  const todoedit = { id: id, title: desc, completed: completed };
  const updateres = await updateTodo_mg(todoedit);
  console.log(updateres);
  res.status(201).json(updateres);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(req.body, id)
  const delres: any = await deleteTodo_mg({ id: id });
  res.send(delres).send();
};
