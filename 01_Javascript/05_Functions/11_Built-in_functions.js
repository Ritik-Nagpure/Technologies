/*
JavaScript comes packed with built-in functions that make your life easier—no need to reinvent the wheel! 
Here's a compact rundown of the most useful ones grouped by category:

🔢 Number & Math Functions
    parseInt("42") → Converts string to integer
    parseFloat("3.14") → Converts string to float
    isNaN(value) → Checks if value is NaN
    isFinite(value) → Checks if value is a finite number
    Math.round(x) → Rounds to nearest integer
    Math.floor(x) / Math.ceil(x) → Rounds down/up
    Math.random() → Returns a random number between 0 and 1

📅 Date Functions
    Date() → Current date/time
    Date.now() → Timestamp in milliseconds
    new Date().getFullYear() → Gets current year
    new Date().toLocaleString() → Localized date/time string

📚 String Functions
    String.length → Length of string
    String.charAt(i) → Character at index
    String.includes("text") → Checks for substring
    String.replace("old", "new") → Replaces text
    String.split(",") → Splits into array
    String.trim() → Removes whitespace

📦 Array Functions
    Array.isArray(arr) → Checks if it's an array
    arr.push(item) / arr.pop() → Add/remove from end
    arr.shift() / arr.unshift(item) → Remove/add from start
    arr.slice(start, end) → Extracts part of array
    arr.map(fn) / arr.filter(fn) / arr.reduce(fn) → Functional magic

🧠 Object & Utility Functions
    Object.keys(obj) → Array of keys
    Object.values(obj) → Array of values
    Object.entries(obj) → Array of key-value pairs
    Object.assign({}, obj) → Clones object
    Object.is(a, b) → Precise comparison

🌐 Global Functions --> DOM only
    alert("Hi!") → Popup alert
    confirm("Are you sure?") → Yes/No dialog
    prompt("Your name?") → Input dialog
    setTimeout(fn, ms) / setInterval(fn, ms) → Delayed/repeated execution
    encodeURI() / decodeURI() → URI encoding

*/