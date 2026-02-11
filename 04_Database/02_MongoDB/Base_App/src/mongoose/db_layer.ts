import mongoose from "mongoose";
import { todo } from './todo';

const url: string = (process.env.URL || 'username:pass').replace('pass', (process.env.PASSWORD || 'pass')).replace('username', (process.env.USERID || 'username'));
type Todo = { id: number, title: string, completed: boolean };

export const createTodo = async (todoData: Todo) => {
    console.log('incoming', todoData , url);
    try {
        await mongoose.connect(url); // await the connection 
        const result = await todo.create(todoData); // use your defined model 
        console.log("Todo created:", result);
        return result;
    } catch (err) {
        console.error("Error creating todo:", err);
        throw err;
    }


    // mongoose.connect(url);
    // todo.create(todoData);

    console.log('todo Created')
}
