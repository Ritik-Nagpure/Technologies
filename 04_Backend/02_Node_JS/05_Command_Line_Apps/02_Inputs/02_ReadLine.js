import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your favorite color? ', (answer) => {
  console.log(`Nice choice: ${answer}`);
  rl.close();
});
