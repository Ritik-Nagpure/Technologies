import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


import todo from "./Todo/todo.router";
import { createTodo } from './mongoose/db_layer';

const port = process.env.PORT || 3000
const app = express();

app.use(cors())


// Middleware
app.use(express.json());

// Routes
app.use("/todos", todo);

type Todo = { id: number, title: string, completed: boolean };
const t1: Todo = { id: 45, title: "first todo", completed: false };

// Root route
app.get("/", (req: Request, res: Response) => {
    console.log('incomming req.')
    res.send("Welcome to Express + TypeScript Todo Application! use api endpoint /todo");
    createTodo(t1);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);    
});