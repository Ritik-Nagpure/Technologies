# ![Node.js Logo](https://nodejs.org/static/images/logo.svg) 

## 📌 What is Node.js and Why Use It?

- **Node.js** is a runtime environment that allows you to run JavaScript outside the browser, built on Chrome's V8 engine.
- It uses an **event-driven**, **non-blocking I/O model**, making it lightweight and efficient.
- Ideal for building **scalable network applications**, especially real-time apps like chat servers and APIs.

## 🕰️ Short History of Node.js

- Created by **Ryan Dahl** in **2009**.
- Designed to handle **high concurrency** and **real-time applications**.
- Initially supported only Linux and macOS; Windows support came later.
- Has grown into a massive ecosystem with **npm**, the largest package registry.

## ▶️ Running JavaScript in Node.js

To run JavaScript using Node.js:

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Create a `.js` file (e.g., `app.js`)
3. Write your code:
    ```js
    console.log("Hello from Node.js!");
    ```
4. Run it in terminal:
    ```bash
    node app.js
    ```

## 🔄 Monitoring Changes in Node.js

During development, it's helpful to automatically restart your Node.js app when files change. This improves workflow and reduces manual effort.

## ✅ Using nodemon

**Install nodemon globally:**
```bash
npm install -g nodemon
nodemon app.js
```
Watch specific files or folders:

```bash
nodemon --watch src app.js
```
You can also watch multiple folders:

```bash
nodemon --watch src --watch config app.js
```
Ignore files or folders:

```bash
nodemon --ignore node_modules app.js
```
Use a config file (nodemon.json):

```json
{
  "watch": ["src", "config"],
  "ignore": ["node_modules"],
  "ext": "js,json"
}
```
📘 Learn more at nodemon.io


## 📦 npm (Node Package Manager)
## What is npm?
- npm is the default package manager for Node.js..
- It helps install, manage, and share reusable code modules.
- Comes bundled with Node.js installation.

## Common npm Commands
```bash
npm init         # Initialize a new project (creates package.json)
npm install pkg  # Install a package locally
npm install -g pkg  # Install a package globally
npm update       # Update installed packages
npm uninstall pkg  # Remove a package
```

## package.json
- Metadata file that describes your project and its dependencies.
- Created using npm init or npm init -y.

## 🚀 npx (Node Package Execute)
## What is npx?
- npx is a tool that comes with npm (v5.2+).
- It allows you to run Node.js packages without installing them globally.
- Great for one-time use tools like create-react-app, eslint, etc.

## Common npx Usage
```bash
npx create-react-app my-app   # Run create-react-app without installing
npx eslint .                  # Run eslint on current directory
npx cowsay "Hello Node.js!"   # Fun CLI tool example
```

- `1` → Major version: stable API
- `4` → Minor version: added new features
- `2` → Patch version: fixed bugs

---


## 📌 Semantic Versioning (SemVer) Notes

Semantic Versioning is a versioning scheme that conveys meaning about the underlying changes in a release. It follows the format:


## 🔢 Version Number Breakdown

| Segment | Meaning                                                                 |
|---------|-------------------------------------------------------------------------|
| MAJOR   | Incompatible API changes — breaking changes that may require refactoring |
| MINOR   | Backward-compatible functionality — new features, enhancements           |
| PATCH   | Backward-compatible bug fixes — small changes that don’t affect the API  |

---

## 🧠 Example


## 📋 Rules of Semantic Versioning

1. **Initial development (0.x.y)**: Anything may change at any time. The public API should not be considered stable.
2. **Major version increment**: Introduce breaking changes.
3. **Minor version increment**: Add new functionality in a backward-compatible manner.
4. **Patch version increment**: Make backward-compatible bug fixes.
5. **Pre-release versions**: Use hyphen and identifier (e.g., `1.0.0-alpha`, `2.1.0-beta.3`)
6. **Build metadata**: Use plus sign (e.g., `1.0.0+build.123`)

---

## ✅ Best Practices

- Always update the version number before publishing.
- Use version ranges in dependencies (`^`, `~`) to control updates.
- Follow SemVer to make your package predictable and trustworthy.

---

📚 Learn more at [semver.org](https://semver.org)

## ❓ Node.js Interview Questions

1. **What is Node.js and how is it different from JavaScript in the browser?**  
   - Node.js is a runtime environment that lets you run JavaScript on the server side. 
   - In the browser, JavaScript is used for client-side interactions. 
   - Node.js provides access to system-level APIs like file system and networking, which browsers restrict.

2. **Explain the event loop in Node.js.**  
   - The event loop handles asynchronous operations in Node.js. 
   - It checks the call stack and task queue, executing queued callbacks when the stack is empty. 
   - This enables non-blocking I/O.

3. **What is the role of the V8 engine?**  
   - V8 is Google’s JavaScript engine used in Chrome and Node.js. 
   - It compiles JavaScript to native machine code, enabling fast execution of scripts.

4. **What are streams in Node.js?**  
   - Streams are objects for continuous reading or writing of data. 
   - Types include Readable, Writable, Duplex, and Transform. 
   - They’re efficient for handling large files or data chunks.

5. **How does Node.js handle asynchronous operations?**  
   - Node.js uses callbacks, Promises, and async/await. 
   - The event loop and libuv manage background tasks and I/O, allowing thousands of concurrent connections without blocking.

6. **What is the difference between `require()` and `import`?**  
   - `require()` is CommonJS and synchronous. 
   - `import` is ES Module syntax, asynchronous, and supports top-level `await`. 
   - Node.js supports both with configuration.

7. **What is middleware in Express.js?**  
   - Middleware functions run during the request-response cycle. 
   - They can modify `req` and `res`, end the request, or pass control to the next middleware.

   ```js
   app.use((req, res, next) => {
     console.log('Request received');
     next();
   });
   ```

8. How do you handle errors in Node.js?? 
   - Use try...catch for sync code, .catch() or try...catch with async/await for async code. 
   - Express uses error-handling middleware:

    ```js
    app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    });
    ```

9. What is the difference between npm and npx?

| Feature         | npm                                  | npx                                      |
|----------------|---------------------------------------|------------------------------------------|
| Purpose         | Installs packages                    | Executes packages without installing     |
| Usage           | `npm install <package>`              | `npx <package>`                          |
| Global install  | Often needed                         | Not required                             |
| Example         | `npm install create-react-app -g`    | `npx create-react-app my-app`            |

