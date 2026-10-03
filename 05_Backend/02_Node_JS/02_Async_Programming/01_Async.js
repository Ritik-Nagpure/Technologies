// 📘 Node.js Asynchronous Programming Notes

// ✅ 1. Callback-based Asynchronous Code
// Node.js uses callbacks to handle async tasks like reading files, making HTTP requests, etc.

import fs from 'fs'

fs.readFile('02_Async_Programming/example.txt', 'utf8', (err, data) => {
    if (err) {
        // If there's an error reading the file, log it
        console.error('Error reading file:', err);
        return;
    }
    // If successful, log the file contents
    console.log('File contents:', data);
});

// ⚠️ Callback Hell: Nesting multiple callbacks can make code hard to read and maintain

// ✅ 2. Promises
// Promises provide a cleaner way to handle async operations and avoid callback hell

const readFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

readFilePromise('02_Async_Programming/example.txt')
    .then((data) => {
        console.log('Promise result:', data);
    })
    .catch((err) => {
        console.error('Promise error:', err);
    });

// ✅ 3. async/await
// Introduced in ES2017, async/await makes asynchronous code look synchronous

const readFileAsync = async () => {
    try {
        const data = await readFilePromise('02_Async_Programming/example.txt');
        console.log('Async/Await result:', data);
    } catch (err) {
        console.error('Async/Await error:', err);
    }
};

readFileAsync();

// ✅ 4. setTimeout and setInterval
// These are built-in timers that run code after a delay or repeatedly

setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2000);

let count = 0;
const intervalId = setInterval(() => {
    console.log('Interval count:', ++count);
    if (count === 3) clearInterval(intervalId); // Stop after 3 times
}, 1000);

// ✅ 5. Event Loop
// The event loop is the core of Node.js async behavior. It processes tasks in phases:
// - Timers (setTimeout, setInterval)
// - Pending callbacks
// - I/O polling
// - Check (setImmediate)
// - Close callbacks

// You can visualize the event loop using tools like Chrome DevTools or Node's --inspect flag

import events from 'events'

// Create an instance of EventEmitter
const myEmitter = new events.EventEmitter();

// Attach a listener to a custom event
myEmitter.on('greet', () => {
    console.log('Hello! Event received.');
});

// Emit the event
myEmitter.emit('greet');

// ✅ 6. process.nextTick vs setImmediate
// These schedule callbacks differently in the event loop

console.log('Start');

// ✅ 7. process.nextTick()
// This schedules a callback to run immediately after the current operation completes,
// before the event loop continues to the next phase.
process.nextTick(() => {
    console.log('Inside process.nextTick');
});

// ✅ 8. setImmediate()
// This schedules a callback to run in the "check" phase of the event loop,
// which happens after I/O events and timers.
setImmediate(() => {
    console.log('Inside setImmediate');
});

console.log('End');

/*
🧠 Expected Output:
Start
End
Inside process.nextTick
Inside setImmediate

🔍 Explanation:
- 'Start' and 'End' are printed first because they are synchronous.
- process.nextTick runs before any other asynchronous callbacks.
- setImmediate runs after the current poll phase of the event loop.
*/


// ✅ Summary:
// - Use Promises or async/await for cleaner async code
// - Understand the event loop to debug performance issues
// - Use timers and scheduling functions wisely

// 🧠 Tip: Always handle errors in async code to avoid crashes
