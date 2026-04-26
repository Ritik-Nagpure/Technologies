import { Request, Response } from "express";
import { createEntry, getEntry, getALLEntries } from "../Redis/redis";


// Mock in-memory store
let todos: { id: number; title: string; completed: boolean }[] = [];
let idCounter = 1;

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await getALLEntries();
    res.status(200).json(todos);
  }
  catch {
    res.status(500).json("Some error Occured");
  }

};

export const getTodo = async (req: Request, res: Response) => {
  try {
    const tid: string = String(req.params.id);
    const todos: string = await getEntry(tid) || '';
    res.status(200).json(JSON.parse(todos));
  }
  catch {
    res.status(500).json("Some error Occured");
  }

};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;
    const newTodo = { id: idCounter++, title, completed: completed || false };
    const todokey = await createEntry(JSON.stringify(newTodo));
    res.status(201).json(todokey);
  }
  catch {
    res.status(500).json("Some error Occured");
  }

};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = todos.find(t => t.id === Number(id));

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.title = title ?? todo.title;
  todo.completed = completed ?? todo.completed;

  res.status(200).json(todo);
};

export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id !== Number(id));
  res.status(204).send();
};
