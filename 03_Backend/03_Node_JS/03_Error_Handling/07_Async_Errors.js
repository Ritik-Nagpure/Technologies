// async-error-demo.js

console.log('⏳ Asynchronous Error Handling in Node.js\n');

// ✅ Callback-based async error handling
function simulateAsyncCallback(success, callback) {
  setTimeout(() => {
    if (!success) {
      callback(new Error('Callback failed!'));
    } else {
      callback(null, 'Callback succeeded');
    }
  }, 500);
}

simulateAsyncCallback(false, (err, result) => {
  if (err) {
    console.error('Callback Error:', err.message);
  } else {
    console.log('Callback Result:', result);
  }
});

// ✅ Promise-based async error handling
function simulateAsyncPromise(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      success ? resolve('Promise succeeded') : reject(new Error('Promise failed!'));
    }, 500);
  });
}

simulateAsyncPromise(false)
  .then(result => console.log('Promise Result:', result))
  .catch(err => console.error('Promise Error:', err.message));

// ✅ Async/Await with try-catch
async function simulateAsyncAwait(success) {
  try {
    const result = await simulateAsyncPromise(success);
    console.log('Async/Await Result:', result);
  } catch (err) {
    console.error('Async/Await Error:', err.message);
  }
}

simulateAsyncAwait(false);

// ✅ Unhandled Promise Rejection (bad practice)
setTimeout(() => {
  simulateAsyncPromise(false); // No .catch() — will trigger unhandledRejection
}, 1000);

// ✅ Global handler for unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Caught by process.on(\'unhandledRejection\'):', err.message);
  // Explanation: This catches promise errors that aren't handled with .catch()
});

console.log('\n✅ Async error demo setup complete.');
