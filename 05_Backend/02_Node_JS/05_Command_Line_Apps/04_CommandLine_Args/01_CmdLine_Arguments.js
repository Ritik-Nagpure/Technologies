// -------------------------------------------
// process.argv is an array containing the command-line arguments
// passed when starting a Node.js process.

// Example:
// If you run: node process-argv-notes.js hello world
// Then process.argv will look like:
// [
//   '/path/to/node',
//   '/path/to/process-argv-notes.js',
//   'hello',
//   'world'
// ]

// ✅ Let's inspect the full array
console.log('🔍 Full process.argv array:');
console.log(process.argv);

// ✅ Slice to get only user-provided arguments
// The first two elements are always:
// [0] path to Node.js executable
// [1] path to the script file
const args = process.argv.slice(2);

console.log('\n📦 User-provided arguments:');
console.log(args);

// ✅ Access individual arguments
const firstArg = args[0] || 'No first argument';
const secondArg = args[1] || 'No second argument';

console.log(`\n👉 First argument: ${firstArg}`);
console.log(`👉 Second argument: ${secondArg}`);

// ✅ Use arguments in logic
if (args.includes('--help')) {
  console.log('\n🆘 Help: This script demonstrates how to use process.argv');
}

// ✅ Example: greet user by name
// Run: node process-argv-notes.js --name Alice
const nameFlagIndex = args.indexOf('--name');
if (nameFlagIndex !== -1 && args[nameFlagIndex + 1]) {
  const userName = args[nameFlagIndex + 1];
  console.log(`\n👋 Hello, ${userName}!`);
} else {
  console.log('\n👋 Hello, Guest!');
}

// ✅ Summary:
// - process.argv gives access to CLI arguments
// - Use slice(2) to skip system paths
// - Useful for building CLI tools, scripts, and automation

// to use this 
// node 05_Command_Line_Apps\04_CommandLine_Args\01_CmdLine_Arguments.js --name Pankaj