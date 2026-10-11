// uncaught-exception-demo.js

console.log('🚨 Uncaught Exceptions in Node.js\n');

// ✅ Simulate an uncaught exception
// This error is not wrapped in try-catch, so it will crash the process
setTimeout(() => {
  throw new Error('This is an uncaught exception!');
}, 1000);

// ✅ Global handler for uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Caught by process.on(\'uncaughtException\'):', err.message);
  // Explanation: This catches any exception not handled elsewhere.
  // You can log the error, clean up resources, and optionally exit.
  process.exit(1); // Recommended: restart app after fatal error
});

// ✅ Example of a caught exception (safe)
try {
  throw new Error('This is a caught exception');
} catch (err) {
  console.error('Caught safely:', err.message);
}

// ✅ Best practice: avoid relying on uncaughtException
/*
  - Use try-catch for synchronous code.
  - Use .catch() or async/await for promises.
  - Use process.on('uncaughtException') only for logging and graceful shutdown.
  - Restart the app after fatal errors using a process manager like PM2 or Docker.
*/

console.log('✅ Setup complete. Uncaught exception will trigger in 1 second...');
