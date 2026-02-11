import mongoose from "mongoose";
import {todo} from './todo';

const url: string = (process.env.URL || 'user:pass').replace('pass', (process.env.PASSWORD || 'pass')).replace('username', (process.env.USERID || 'user'));
type Todo = [ id: number,title: string, completed: boolean ];


export  const logs = () => console.log(url)

export const createTodo = (todoData : Todo) =>{
    const conn = mongoose.connect(url);
    todo.create(todoData);
}
// const mg = mongoose.connect();