
# A. Node.js architecture and concepts

## 1. What is Node.js?

Node.js is an open-source, cross-platform JavaScript runtime environment that allows us to execute JavaScript outside the browser.

It is built on Google's V8 JavaScript engine, which compiles JavaScript into machine code for execution.

Node.js is primarily used for building scalable backend applications, REST APIs, real-time applications, microservices, and command-line tools.

Key features:

1. Asynchronous and non-blocking I/O.
2. Event-driven architecture.
3. Single-threaded JavaScript execution.
4. V8 JavaScript engine.
5. Built-in modules such as HTTP, FS, Path, and Events.
6. NPM ecosystem for managing dependencies.

In my experience, I use Node.js with Express.js to build REST APIs, authentication systems, backend services, and enterprise application integrations.

## 2. How does Node.js work?

Node.js works using an event-driven, non-blocking I/O architecture.

Although JavaScript execution typically runs on a single main thread, Node.js can handle multiple concurrent requests without creating a separate JavaScript thread for every request.

The main components are:

1. V8 Engine:
   Executes JavaScript code by compiling it into machine code.

2. Event Loop:
   Coordinates the execution of callbacks and asynchronous operations.

3. Event Queue:
   Holds callbacks waiting to be executed.

4. Libuv:
   Provides the event loop, asynchronous I/O operations, and thread pool.

5. Thread Pool:
   Handles certain expensive operations such as filesystem operations, DNS lookup operations, and cryptographic tasks.

Execution flow:

1. A client sends a request to the Node.js server.
2. The request is received by the event loop.
3. If the operation is synchronous, JavaScript executes it on the main thread.
4. If the operation involves asynchronous I/O, Node.js delegates it to the operating system or libuv thread pool, depending on the operation.
5. The main thread continues processing other requests.
6. Once the asynchronous operation completes, its callback or continuation becomes eligible for execution.
7. The event loop executes the callback when the appropriate phase or microtask processing allows it.

This architecture allows Node.js to handle a large number of concurrent I/O operations efficiently without blocking the main JavaScript thread.

## 3. What is a Buffer in Node.js?

A Buffer is a built-in Node.js class used to handle raw binary data directly in memory.

JavaScript traditionally works with strings and other high-level data types, but when dealing with files, network communication, images, and streams, we often need to process binary data.

Node.js provides the Buffer API for this purpose.

Example:

```javascript
const buffer = Buffer.from("Hello Ritik");

console.log(buffer);
console.log(buffer.toString());
```

Output:

```text
<Buffer 48 65 6c 6c 6f 20 52 69 74 69 6b>
Hello Ritik
```

Common Buffer methods:

1. Buffer.from() - Creates a buffer from existing data.
2. Buffer.alloc() - Creates a zero-filled buffer.
3. Buffer.allocUnsafe() - Allocates an uninitialized buffer.
4. buffer.toString() - Converts buffer data into a string.
5. Buffer.concat() - Combines multiple buffers.
6. Buffer.byteLength() - Returns the byte length of a value.

Buffers are commonly used in file processing, TCP communication, image processing, and stream handling.

## 4. What is a Stream in Node.js?

A Stream in Node.js is an abstraction that allows us to read or write data continuously in smaller chunks instead of loading the entire data into memory.

Streams are particularly useful when working with large files, network requests, video processing, and real-time data.

For example, instead of loading a 10 GB file completely into RAM, we can read it in smaller chunks and process each chunk individually.

Node.js provides a built-in stream module.

```javascript
const fs = require("fs");

const readStream = fs.createReadStream("large-file.txt");

readStream.on("data", (chunk) => {
    console.log("Received chunk:", chunk.length);
});

readStream.on("end", () => {
    console.log("File reading completed");
});
```

Streams improve memory efficiency and allow data processing to begin before the entire data source has been read.

## 5. What is the use of Streams in Node.js?

Streams are used to process large amounts of data efficiently without loading everything into memory.

Major use cases:

1. Large File Processing:
   Read and process large files in smaller chunks.

2. File Uploads:
   Handle large file uploads without storing the entire file in memory.

3. File Downloads:
   Send files to clients incrementally.

4. Network Communication:
   Process incoming and outgoing HTTP request and response data.

5. Video and Audio Streaming:
   Deliver media content progressively.

6. Data Transformation:
   Transform data while it is being transferred using Transform streams.

7. Database Processing:
   Process large query results incrementally when the database driver supports streaming or cursors.

Streams also support backpressure, which prevents a faster data producer from overwhelming a slower consumer.

## 6. How do you change the default buffer size of a Stream?

In Node.js, the buffer size of a stream is generally controlled through the highWaterMark option.

The highWaterMark defines the threshold at which a stream stops requesting or accepting more data until the buffered data is consumed.

For readable streams, it is generally measured in bytes. For object-mode streams, it is measured in the number of objects.

Example:

```javascript
const fs = require("fs");

const readStream = fs.createReadStream("large-file.txt", {
    highWaterMark: 1024 * 1024
});

console.log(readStream.readableHighWaterMark);
```

Here, highWaterMark is set to 1 MB.

Similarly, for writable streams:

```javascript
const fs = require("fs");

const writeStream = fs.createWriteStream("output.txt", {
    highWaterMark: 1024 * 1024
});

console.log(writeStream.writableHighWaterMark);
```

Increasing highWaterMark can reduce the number of I/O operations but may increase memory consumption.

It is important to understand that highWaterMark is a buffering threshold, not a strict maximum memory limit.

## 7. What are the different types of Streams available in Node.js?

Node.js provides four major types of streams.

1. Readable Streams:
   Used to read data from a source.

   Examples:
   - fs.createReadStream()
   - HTTP incoming request body.

2. Writable Streams:
   Used to write data to a destination.

   Examples:
   - fs.createWriteStream()
   - HTTP response.

3. Duplex Streams:
   Support both reading and writing independently.

   Examples:
   - TCP sockets.
   - Network sockets.

4. Transform Streams:
   A special type of Duplex stream where data can be modified or transformed while reading and writing.

   Examples:
   - zlib compression.
   - Crypto transformations.

# B. Streams and file handling

## 8. You have a 100 GB text file. How would you read it into a Node.js program without crashing the server?

I would use Node.js Readable Streams instead of fs.readFile() because loading a 100 GB file completely into memory could exhaust the available RAM and crash the application.

I would process the file incrementally using createReadStream() and readline.

Implementation:

```javascript
const fs = require("fs");
const readline = require("readline");

async function processLargeFile() {
    const readStream = fs.createReadStream("large-file.txt", {
        encoding: "utf8",
        highWaterMark: 64 * 1024
    });

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        // Process one line at a time
        console.log(line);
    }

    console.log("File processing completed");
}

processLargeFile().catch(console.error);
```

How it works:

1. createReadStream() reads the file in smaller chunks.
2. readline processes the input line by line.
3. Each line is processed without loading the entire file into memory.
4. Once processing is completed, the next line is consumed.
5. Memory consumption remains relatively low.

For production, I would also consider:

- Handling stream errors.
- Monitoring memory consumption.
- Implementing backpressure.
- Processing records in controlled batches.
- Avoiding synchronous operations.
- Implementing checkpointing if processing needs to resume after failure.

This approach allows us to process very large files efficiently without requiring RAM equivalent to the file size.

## 9. How would you process a large file efficiently using Streams?

I would use a combination of Readable, Transform, and Writable streams through stream.pipeline().

This allows us to read data, transform it, and write the processed output without loading the entire file into memory.

Implementation:

```javascript
const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const processedData = chunk.toString().toUpperCase();

        callback(null, processedData);
    }
});

async function processFile() {
    try {
        await pipeline(
            fs.createReadStream("input.txt"),
            transformStream,
            fs.createWriteStream("output.txt")
        );

        console.log("File processed successfully");
    } catch (error) {
        console.error("Processing failed:", error);
    }
}

processFile();
```

How it works:

1. Readable Stream reads the input file in chunks.
2. Transform Stream processes each chunk.
3. Writable Stream writes the transformed data into the output file.
4. pipeline() manages stream connections, backpressure, and error propagation.

For production systems, I would also ensure that transformations correctly handle data boundaries between chunks. For example, a line or UTF-8 character may span multiple chunks.

## 10. How would you avoid loading an entire large file into memory?

I would use streaming APIs instead of APIs that load the complete file into memory.

For example:

Avoid:

```javascript
const fs = require("fs");

const data = fs.readFileSync("large-file.txt", "utf8");
```

This loads the entire file into memory synchronously and blocks the event loop.

Prefer:

```javascript
const fs = require("fs");

const stream = fs.createReadStream("large-file.txt", {
    encoding: "utf8",
    highWaterMark: 64 * 1024
});

stream.on("data", (chunk) => {
    console.log("Processing chunk:", chunk.length);
});

stream.on("end", () => {
    console.log("Reading completed");
});

stream.on("error", (error) => {
    console.error(error);
});
```

Additional techniques:

1. Use Readable Streams for incremental reading.
2. Use Writable Streams for incremental writing.
3. Use Transform Streams for processing data.
4. Use pipeline() to handle backpressure and errors.
5. Process data in controlled batches.
6. Avoid accumulating all chunks in an array.
7. Monitor memory usage and stream buffering.

The key principle is to process data incrementally rather than loading the complete dataset into memory.



# C. Asynchronous programming

## 1. What is callback hell?

Callback hell is a situation in JavaScript where multiple nested callbacks make the code difficult to read, understand, debug, and maintain.

It usually occurs when multiple asynchronous operations depend on the results of previous operations.

```javascript
getUser(userId, (user) => {
    getOrders(user.id, (orders) => {
        getPayment(orders[0].id, (payment) => {
            sendNotification(payment, (response) => {
                console.log(response);
            });
        });
    });
});
```

As the number of dependent asynchronous operations increases, callbacks become deeply nested, creating callback hell.

## 2. What problems does callback hell create?

Callback hell creates several problems:

1. Poor Readability: Deeply nested callbacks make code difficult to understand.
2. Difficult Maintenance: Modifying nested callbacks becomes complicated.
3. Error Handling: Managing errors across multiple nested callbacks becomes difficult.
4. Debugging: Tracking execution flow and identifying issues becomes challenging.
5. Code Reusability: Nested callback logic is difficult to reuse.
6. Inversion of Control: We depend on external functions to execute our callbacks correctly.

These problems make large asynchronous applications difficult to maintain.

## 3. How can you overcome callback hell?

We can overcome callback hell using several approaches:

1. Named Functions: Break nested callbacks into smaller reusable functions.
2. Promises: Use then(), catch(), and finally() to organize asynchronous operations.
3. Async/Await: Write asynchronous code in a synchronous-looking structure.
4. Modularization: Separate asynchronous operations into independent modules.

Using Promises:

```javascript
getUser(userId)
    .then(user => getOrders(user.id))
    .then(orders => getPayment(orders[0].id))
    .then(payment => sendNotification(payment))
    .then(response => console.log(response))
    .catch(error => console.error(error));
```

Using Async/Await:

```javascript
async function processUser(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const payment = await getPayment(orders[0].id);

        const response = await sendNotification(payment);

        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
```

I generally prefer async/await because it improves readability, simplifies error handling, and makes asynchronous workflows easier to maintain.

## 4. What is a Promise?

A Promise is a JavaScript object that represents the eventual completion or failure of an asynchronous operation.

It allows us to handle asynchronous operations without deeply nested callbacks.

A Promise can produce a value when the operation succeeds or an error when it fails.

```javascript
const promise = new Promise((resolve, reject) => {
    const success = true;

    if (success) {
        resolve("Operation successful");
    } else {
        reject("Operation failed");
    }
});

promise
    .then(result => console.log(result))
    .catch(error => console.log(error));
```

Promises are commonly used for API calls, database operations, file processing, and other asynchronous tasks.

## 5. What are the different states of a Promise?

A Promise has three possible states:

1. Pending:
   The initial state. The asynchronous operation has not yet completed.

2. Fulfilled:
   The operation has completed successfully, and the Promise has a resolved value.

3. Rejected:
   The operation has failed, and the Promise has a rejection reason.

Once a Promise becomes fulfilled or rejected, it is considered settled, and its state cannot change again.

## 6. What is the default state of a Promise?

The default state of a newly created Promise is Pending.

It remains pending until either resolve() or reject() is called.

```javascript
const promise = new Promise((resolve, reject) => {
    // No resolve or reject called
});

console.log(promise);

// Promise { <pending> }
```

Once settled, the Promise cannot transition to another state.

## 7. What is `Promise.all()`?

Promise.all() is a JavaScript method that accepts an iterable of Promises and returns a single Promise.

It fulfills when all input Promises fulfill and returns their results in the same order as the input Promises.

If even one Promise rejects, Promise.all() immediately rejects with that rejection reason.

```javascript
const promise1 = Promise.resolve("User");
const promise2 = Promise.resolve("Orders");
const promise3 = Promise.resolve("Payments");

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log(results);
    })
    .catch(error => {
        console.log(error);
    });

// Output:
// ["User", "Orders", "Payments"]
```

It is useful when multiple independent asynchronous operations must all succeed before proceeding.

## 8. What is `Promise.allSettled()`?

Promise.allSettled() is a JavaScript method that accepts multiple Promises and waits until every Promise has either fulfilled or rejected.

Unlike Promise.all(), it does not reject just because one of the input Promises fails.

It returns an array containing the status and result or rejection reason of every Promise.

```javascript
const promise1 = Promise.resolve("User");
const promise2 = Promise.reject("Payment failed");
const promise3 = Promise.resolve("Orders");

Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        console.log(results);
    });
```

Output:

```javascript
[
    { status: "fulfilled", value: "User" },
    { status: "rejected", reason: "Payment failed" },
    { status: "fulfilled", value: "Orders" }
]
```

It is useful when we need the results of all operations, regardless of whether individual operations succeed or fail.

## 9. Why would you use `Promise.all()`?

I use Promise.all() when multiple independent asynchronous operations need to execute concurrently, and I need all of them to succeed before proceeding.

For instance, when loading a dashboard, we might need user information, account details, and transaction history.

```javascript
async function loadDashboard() {
    try {
        const [user, account, transactions] = await Promise.all([
            fetch("/api/user"),
            fetch("/api/account"),
            fetch("/api/transactions")
        ]);

        console.log(user, account, transactions);

    } catch (error) {
        console.error("Dashboard loading failed:", error);
    }
}

loadDashboard();
```

Benefits:

1. Executes independent operations concurrently.
2. Reduces total waiting time compared to sequential execution.
3. Provides results in the original input order.
4. Rejects when any input Promise rejects.

One important consideration is that Promise.all() does not automatically cancel the remaining operations when one Promise rejects.

## 10. Why would you use `Promise.allSettled()`?

I use Promise.allSettled() when multiple independent asynchronous operations need to execute, but the failure of one operation should not prevent us from receiving the results of the others.

For instance, when loading multiple independent dashboard widgets, one API failure should not prevent the remaining widgets from displaying their data.

```javascript
async function loadDashboard() {
    const results = await Promise.allSettled([
        fetch("/api/user"),
        fetch("/api/notifications"),
        fetch("/api/recommendations")
    ]);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log("Success:", result.value);
        } else {
            console.log("Failed:", index, result.reason);
        }
    });
}

loadDashboard();
```

Benefits:

1. Waits for every Promise to settle.
2. Provides both successful and failed results.
3. Prevents one failure from rejecting the entire Promise.allSettled() operation.
4. Useful for independent API calls and batch processing.

The main difference is that Promise.all() is appropriate when all operations must succeed, whereas Promise.allSettled() is appropriate when we need to handle each operation independently.

## 11. What is `async/await`?

Async/await is a JavaScript syntax built on top of Promises that allows us to write asynchronous code in a synchronous-looking manner.

1. async:
   Declares an asynchronous function that always returns a Promise.

2. await:
   Pauses the execution of the surrounding async function until the awaited Promise settles.

```javascript
async function getUser() {
    const response = await fetch("/api/user");

    const data = await response.json();

    return data;
}

getUser()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

The await keyword does not block the main JavaScript thread. Other JavaScript tasks can continue executing while the asynchronous operation is pending.

## 12. Why do we need `async/await`?

We use async/await to make asynchronous code more readable, maintainable, and easier to handle.

Before async/await, we commonly used nested callbacks or Promise chains, which could become difficult to manage in complex workflows.

Benefits:

1. Readability: Makes asynchronous code look similar to synchronous code.
2. Error Handling: Allows us to use try/catch for asynchronous errors.
3. Maintainability: Makes sequential asynchronous workflows easier to understand.
4. Debugging: Makes execution flow easier to follow.
5. Dependency Handling: Makes it easier to execute operations sequentially when one depends on another.

```javascript
async function getUserDetails(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const payments = await getPayments(orders);

        return payments;

    } catch (error) {
        console.error("Something went wrong:", error);
    }
}
```

I commonly use async/await when implementing REST API integrations, authentication workflows, and backend services using Node.js and Express.js.

## D. Event loop and execution order

## 13. What is the Event Loop?

The Event Loop is a mechanism in JavaScript that coordinates synchronous code execution and asynchronous callbacks.

In Node.js, the Event Loop is provided by libuv and allows Node.js to handle asynchronous operations without blocking the main JavaScript execution thread.

Its primary responsibilities include:

1. Execute synchronous JavaScript code.
2. Handle completed asynchronous operations.
3. Process queued callbacks.
4. Coordinate timers and I/O operations.
5. Execute callbacks when the call stack is available.

The basic execution flow is:

1. JavaScript executes synchronous code on the call stack.
2. Asynchronous operations are handled by the operating system or libuv.
3. Completed operations make callbacks eligible for execution.
4. The Event Loop processes callbacks according to their scheduling mechanism.
5. The process continues until there is no more work to execute.

This architecture enables Node.js to handle multiple concurrent I/O operations efficiently.

## 14. What are the stages of the Event Loop?

Node.js Event Loop has six main phases:

1. Timers:
   Executes callbacks scheduled by setTimeout() and setInterval() when their thresholds have been reached.

2. Pending Callbacks:
   Executes certain I/O callbacks deferred from previous event loop iterations.

3. Idle, Prepare:
   Internal phases used by Node.js and libuv.

4. Poll:
   Retrieves new I/O events and executes most I/O-related callbacks.

5. Check:
   Executes callbacks scheduled using setImmediate().

6. Close Callbacks:
   Executes close event callbacks, such as socket.on("close").

There are also two important scheduling mechanisms:

- process.nextTick(): Its callbacks are processed through Node.js's next-tick queue, outside the regular Event Loop phases.
- Promise callbacks: Promise.then(), catch(), and finally() callbacks are processed as microtasks.

In Node.js, the next-tick queue is generally processed before the Promise microtask queue after the current operation completes.

## 15. What is the difference between `process.nextTick()` and `setImmediate()`?

Both process.nextTick() and setImmediate() are used to schedule asynchronous callbacks, but they execute at different points in the Node.js execution cycle.

1. process.nextTick():
   - Schedules a callback in the next-tick queue.
   - Executes after the current JavaScript operation completes.
   - Runs before the Event Loop continues to its next phase.
   - Runs before Promise microtasks in typical Node.js scheduling.

2. setImmediate():
   - Schedules a callback in the Check phase of the Event Loop.
   - Executes after the Poll phase of the current iteration, when eligible.

```javascript
console.log("Start");

process.nextTick(() => {
    console.log("Next Tick");
});

setImmediate(() => {
    console.log("Immediate");
});

console.log("End");
```

Output:

```text
Start
End
Next Tick
Immediate
```

process.nextTick() executes before setImmediate() in this example because its queue is processed before the Event Loop continues to the Check phase.

## 16. What is the difference between `setTimeout()` and `setImmediate()`?

Both are used to schedule asynchronous callbacks, but they execute at different stages of the Node.js Event Loop.

1. setTimeout():
   - Executes a callback after a specified minimum delay.
   - Its callback is processed in the Timers phase when eligible.
   - Actual execution time may be later depending on Event Loop activity.

2. setImmediate():
   - Schedules a callback for the Check phase.
   - Executes after the Poll phase in the Event Loop iteration.

```javascript
setTimeout(() => {
    console.log("Timeout");
}, 0);

setImmediate(() => {
    console.log("Immediate");
});
```

The output is not guaranteed to have a consistent order when both are scheduled from the main module.

Depending on timing and Event Loop scheduling, either callback may execute first.

However, when both are scheduled inside an I/O callback, setImmediate() executes before setTimeout(..., 0) in the usual case.

## 17. Which code executes first when using different asynchronous scheduling mechanisms?

In Node.js, the execution order depends on the scheduling mechanism and the context in which callbacks are registered.

Consider the following example:

```javascript
console.log("Start");

setTimeout(() => {
    console.log("setTimeout");
}, 0);

setImmediate(() => {
    console.log("setImmediate");
});

Promise.resolve().then(() => {
    console.log("Promise");
});

process.nextTick(() => {
    console.log("nextTick");
});

console.log("End");
```

Output in a typical CommonJS execution:

```text
Start
End
nextTick
Promise
setTimeout / setImmediate
```

The relative order of setTimeout() and setImmediate() is not guaranteed when scheduled from the main module.

Execution priority:

1. Synchronous JavaScript code executes first.
2. process.nextTick() callbacks execute after the current operation.
3. Promise microtasks execute after the next-tick queue is processed.
4. setTimeout() and setImmediate() execute in their respective Event Loop phases.

Important interview point:

process.nextTick() can starve the Event Loop if recursively scheduled without allowing other phases to execute.

Therefore, I use setImmediate() when I want to schedule work for a later Event Loop iteration rather than continuously prioritizing next-tick callbacks.


# E. HTTP server

## 1. Without using any external package, write a basic HTTP server in Node.js.

Node.js provides a built-in HTTP module that allows us to create HTTP servers without installing any external packages.

We can use the http.createServer() method to create a server and listen() to start accepting incoming requests.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Hello World");
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

How it works:

1. Import the built-in HTTP module.
2. createServer() creates an HTTP server.
3. The callback receives two arguments:
   - req: Contains incoming request information.
   - res: Used to send a response to the client.
4. writeHead() sets the HTTP status code and response headers.
5. end() sends the response and completes the request.
6. listen() starts the server on port 3000.

We can access the server at http://localhost:3000.

## 2. How do you send `Hello World` as a response when a request comes to your HTTP server?

We can use the response.end() method to send Hello World as the response.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello World");
});

server.listen(3000);
```

Here, whenever a client sends a request to the server, the callback executes and res.end() sends Hello World as the response.

By default, Node.js sends a successful HTTP response with status code 200 if no other status code has been set.

For production applications, I would explicitly configure the status code and Content-Type header.
