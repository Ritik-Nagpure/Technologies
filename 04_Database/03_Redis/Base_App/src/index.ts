import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import todo from "./Todo/todo.router";

dotenv.config()

const port = process.env.PORT || 3000
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.use("/todos", todo);

// Root route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express + TypeScript Todo Application! use api endpoint /todo");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});