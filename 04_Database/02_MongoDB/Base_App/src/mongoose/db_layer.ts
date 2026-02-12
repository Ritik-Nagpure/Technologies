import mongoose from "mongoose";
import { todo } from './todo';

const url: string = (process.env.URL || 'username:pass').replace('pass', (process.env.PASSWORD || 'pass')).replace('username', (process.env.USERID || 'username'));
type Todo = { id: number, title: string, completed: boolean };

export const createTodo_mg = async (todoData: Todo) => {
    try {
        await mongoose.connect(url); // await the connection 
        const result = await todo.create(todoData); // use your defined model 
        console.log("Todo created:", result);
        await mongoose.disconnect();
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }
}

export const getTodo_mg = async (todoid: object) => {
    try {
        await mongoose.connect(url); // await the connection 
        const result = await todo.findOne(todoid); // use your defined model 
        console.log("Todo get completed:", result);
        await mongoose.disconnect();
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }
}

export const readTodos_mg = async () => {
    try {
        console.log('read todos')
        await mongoose.connect(url); // await the connection 
        const result = await todo.find(); // use your defined model 
        console.log("Todo List Found:", result);
        await mongoose.disconnect();
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }
}

export const updateTodo_mg = async (todoData: Todo) => {
    try {
        await mongoose.connect(url); // await the connection 
        const result = await todo.findOneAndUpdate(todoData); // use your defined model 
        console.log("Todo Updated:", result);
        await mongoose.disconnect();
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }
}

export const deleteTodo_mg = async (todoid: object) => {
    try {
        await mongoose.connect(url); // await the connection 
        const result = await todo.findOneAndDelete(todoid); // use your defined model 
        console.log("Todo Deleted:", result);
        await mongoose.disconnect();
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }
}
