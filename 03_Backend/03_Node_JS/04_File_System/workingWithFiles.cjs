// Define a file path as a string (not used in this example, but could be for reading/writing)
let thispath = "G/NodeJS/packages/File_System/textfile1.txt";

// __dirname returns the absolute path of the directory containing the current file
console.log(__dirname); // Example output: /Users/yourname/G/NodeJS/packages/File_System

// __filename returns the absolute path of the current file itself
console.log(__filename); // Example output: /Users/yourname/G/NodeJS/packages/File_System/app.js

// These two globals are especially useful when working with file paths, loading modules, or serving static files.
// __dirname and __filename are neither default JavaScript functions nor keywords — they are special variables provided by Node.js.

// Here’s the breakdown:
    // ✅ Not JavaScript keywords: You won’t find them in the ECMAScript spec.
    // ✅ Not functions: They’re variables, not callable.
    // ✅ Injected by Node.js: When Node runs your file, it wraps it in a function and injects these variables so you can access the file and directory paths easily.