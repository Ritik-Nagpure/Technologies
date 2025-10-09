
/*
🧠 What Is process.stdin?
process.stdin is a built-in Node.js stream that allows your program to receive input from the terminal — perfect for interactive CLI tools, user prompts, or piping data into your script.

    It’s a Readable Stream connected to standard input (the keyboard or piped data).
    You can use it to read user input line-by-line or as raw data.

🧪 Basic Example: Read a Line of Input
*/

process.stdin.setEncoding('utf8');

console.log('Enter your name:');

process.stdin.on('data', (input) => {
  const name = input.trim();
  console.log(`Hello, ${name}!`);
  process.exit(); // Exit after receiving input
});