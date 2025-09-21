// error-handling-demo.js

// ✅ Synchronous Error Handling using try-catch
function syncErrorExample() {
  try {
    // This will throw an error because 'x' is not defined
    console.log(x);
  } catch (err) {
    console.error('Caught a synchronous error:', err.message);
  }
  finally{
    console.log(`syncErrorExample function is completed.`);
    
  }
}
syncErrorExample();

// ✅ Asynchronous Error Handling using Callbacks
import fs from 'fs'

fs.readFile('nonexistent.txt', 'utf8', (err, data) => {
  // Error-first callback pattern: check if error exists
  if (err) {
    console.error('Callback error:', err.message);
    return;
  }
  console.log('File content:', data);
});

// ✅ Promises with .catch()
function promiseErrorExample() {
  return new Promise((resolve, reject) => {
    // Simulate an async failure
    setTimeout(() => reject(new Error('Promise failed')), 1000);
  });
}

promiseErrorExample()
  .then(data => console.log(data))
  .catch(err => console.error('Promise error:', err.message));

// ✅ Async/Await with try-catch
async function asyncAwaitExample() {
  try {
    // Simulate async error
    await Promise.reject(new Error('Async/Await failed'));
  } catch (err) {
    console.error('Async/Await error:', err.message);
  }
}
asyncAwaitExample();

// ✅ Global Error Handlers (use with caution in production)

// Catch uncaught exceptions (e.g., sync errors not caught by try-catch)
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err.message);
  // Optional: clean up and exit
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err.message);
});

// ✅ Best Practices Summary (not executable code)
/*
  - Always validate inputs to prevent errors early.
  - Use centralized logging for better debugging.
  - Avoid silent failures—log or handle all errors.
  - Gracefully shut down the app on fatal errors.
  - Use async/await for cleaner async code.
*/

console.log('✅ Error handling demo complete');
