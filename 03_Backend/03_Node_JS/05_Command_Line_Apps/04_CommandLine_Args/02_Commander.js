/*
🚀 What Is commander?
commander is one of the most popular libraries in Node.js for building command-line interfaces (CLIs). 
It helps you parse arguments, define commands, handle options, and generate help messages — all with clean syntax.

    A lightweight Node.js package for building CLI tools.
    Handles command-line arguments and flags elegantly.
    Automatically generates help and usage instructions.
*/


import { Command } from 'commander';
const program = new Command();

program
    .name('greet')
    .description('A simple CLI to greet users')
    .version('1.0.0');

program
    .option('-n, --name <string>', 'name of the user')
    .option('-c, --country <string>', 'country of the user');

program.parse(process.argv);

const options = program.opts();
console.log(`Hello, ${options.name || 'Guest'} from ${options.country || 'somewhere'}!`);


// to run use below command in cmd
// node 05_Command_Line_Apps\04_CommandLine_Args\02_Commander.js --name Alice --country India