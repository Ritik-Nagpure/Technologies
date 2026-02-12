import { Request, Response, NextFunction } from "express";

export const validateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { desc, completed } = req.body;

  if (!desc || typeof desc !== "string") {
    return res.status(400).json({ message: "desc is required and must be a string" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ message: "Completed must be a boolean" });
  }

  next();
};
