// Strings literals

// Declaration of string literals
// Using single quotes, double quotes, or backticks
    // This is a basic string primitive.
    // Stored directly in the stack.
    // It’s lightweight and efficient.
    // Immutable: you can't change characters within it.

let str1 = "Hello, World!";
let str2 = 'Hello, World!';
let str3 = `Hello, World!`;

console.log(str1, typeof(str1)); // "Hello, World!" "string"
console.log(str2, typeof(str2)); // "Hello, World!" "string"
console.log(str3, typeof(str3)); // "Hello, World!" "string"

// Declaration of string objects
    // Using String constructor or String object
    // Converts 'hello' to a primitive string using the String() function.
    // If the input is already a string, it’s basically just a safe wrapper.
    // Same result as the literal 'hello'.
let str4 = String("Hello, World!");
let str5 = String('Hello, World!');
let str6 = String(`Hello, World!`);

console.log(str4, typeof(str4)); // "Hello, World!" "string"
console.log(str5, typeof(str5)); // "Hello, World!" "string"
console.log(str6, typeof(str6)); // "Hello, World!" "string"

// Using the String constructor with new keyword
// This creates a String object, not a primitive string
    // Creates a String object, not a primitive.
    // Stored in the heap, and behaves like an object.
    // Has properties and methods (like .length, etc).
    // Most JS code auto-unboxes it when needed, but can cause bugs when doing comparisons!

let str7 = new String("Hello, World!");
let str8 = new String('Hello, World!');
let str9 = new String(`Hello, World!`);

console.log(str7, typeof(str7)); // [String: 'Hello, World!'] "object"
console.log(str8, typeof(str8)); // [String: 'Hello, World!'] "object"
console.log(str9, typeof(str9)); // [String: 'Hello, World!'] "object"
// Note: Using new String() is generally discouraged unless you specifically need an object.


// ---------------------- String properties and methods ----------------------
// 1] --> Length of a string
// Using .length property to get the length of a string
let strLength = str1.length; // 13
console.log(strLength, typeof(strLength)); // 13 "number"

// 2] --> Accessing characters in a string
// Using bracket notation to access characters
let firstChar = str1[0]; // 'H'
console.log(firstChar, typeof(firstChar)); // 'H' "string"

// 3] --> Using charAt() method to access characters
let secondChar = str1.charAt(1); // 'e'
console.log(secondChar, typeof(secondChar)); // 'e' "string"

// 4] --> Finding the index of a character
// Using indexOf() method to find the index of a character
let indexOfChar = str1.indexOf('W'); // 7
console.log(indexOfChar, typeof(indexOfChar)); // 7 "number"

// 5] --> Finding the last index of a character
// Using lastIndexOf() method to find the last index of a character
let lastIndexOfChar = str1.lastIndexOf('o'); 
console.log("lastTndexofChar('o') --> ",lastIndexOfChar, typeof(lastIndexOfChar)); // 8 "number"

// 6] --> Converting to uppercase and lowercase
// Using toUpperCase() and toLowerCase() methods
let upperCaseStr = str1.toUpperCase(); // "HELLO, WORLD!"
let lowerCaseStr = str1.toLowerCase(); // "hello, world!"
console.log(upperCaseStr, typeof(upperCaseStr)); // "HELLO, WORLD!" "string"
console.log(lowerCaseStr, typeof(lowerCaseStr)); // "hello, world!" "string

// 7] --> Trimming whitespace
// Using trim() method to remove whitespace from both ends of a string
let strWithSpaces = "   Hello, World!   ";
console.log(strWithSpaces); // "   Hello, World!   " "string"
let trimmedStr = strWithSpaces.trim(); // "Hello, World!"
console.log(trimmedStr, typeof(trimmedStr)); // "Hello, World!" "string"

// 8] --> Splitting a string into an array
// Using split() method to split a string into an array of substrings
let strToSplit = "Hello, World!";
let splitStr = strToSplit.split(", "); // ["Hello", "World!"]
console.log(splitStr, typeof(splitStr)); // ["Hello", "World!"] "object" (array)

// 9] --> Replacing a substring
// Using replace() method to replace a substring with another substring
let strToReplace = "Hello, World!";
let replacedStr = strToReplace.replace("World", "JavaScript"); // "Hello, JavaScript!"
console.log(replacedStr, typeof(replacedStr)); // "Hello, JavaScript!" "string"

// 10] --> Checking if a string starts or ends with a substring
// Using startsWith() and endsWith() methods
let startsWithHello = str1.startsWith("Hello"); // true
console.log(startsWithHello, typeof(startsWithHello)); // true "boolean"
let endsWithWorld = str1.endsWith("World!"); // true
console.log(endsWithWorld, typeof(endsWithWorld)); // true "boolean"

// 11] --> Checking if a string includes a substring
// Using includes() method to check if a string contains a substring
let includesWorld = str1.includes("World"); // true
console.log(includesWorld, typeof(includesWorld)); // true "boolean"

// 12] --> Repeating a string
// Using repeat() method to repeat a string multiple times
let strToRepeat = "Hello! ";
let repeatedStr = strToRepeat.repeat(3); // "Hello! Hello! Hello! "
console.log(repeatedStr, typeof(repeatedStr)); // "Hello! Hello! Hello! " "string"

// ---------------------- String concatenation ----------------------
// Concatenating strings using different methods
// Concatenation is the process of joining two or more strings together.

// 1] --> Using the + operator to concatenate strings
let nam = 'Ritik';
let greet = 'Hello, ' + nam + '!'; // "Hello, Ritik!"
console.log(greet, typeof(greet)); // "Hello, Ritik!" "string"


// 2] --> Using template literals (backticks) for interpolation
let greetTemplate = `Hello, ${nam}!`; // "Hello, Ritik!"
console.log(greetTemplate, typeof(greetTemplate)); // "Hello, Ritik!" "string"

// 3] --> Using String.concat() method
let greetConcat = 'Hello, '.concat(nam, '!'); // "Hello, Ritik!"
console.log(greetConcat, typeof(greetConcat)); // "Hello, Ritik!" "string"

// 4] --> Using Array.join() method for concatenation
// This method joins all elements of an array into a single string.
let arr = ['Hello, ', nam, '!'];
let greetJoin = arr.join(''); // "Hello, Ritik!"
console.log(greetJoin, typeof(greetJoin)); // "Hello, Ritik!" "string"

// 5] --> Using Array.reduce() method for concatenation
// This method reduces the array to a single string by concatenating its elements.
// It’s a more functional approach to concatenation.
// The initial value is set to an empty string.
// acc is the accumulator, curr is the current value in the array.
// acc starts as an empty string and each element is concatenated to it.
// cur is the current element being processed in the array.

let greetReduce = arr.reduce((acc, curr) => acc + curr, ''); // "Hello, Ritik!"
console.log(greetReduce, typeof(greetReduce)); // "Hello, Ritik!" "string"

// 6] --> Using String.raw() for raw string literals
// String.raw() is used to create raw string literals, ignoring escape sequences.
// It’s useful for creating strings that should not interpret escape sequences.
let rawStr = String.raw`Hello, ${nam}!`; // "Hello, Ritik!"
console.log(rawStr, typeof(rawStr)); // "Hello, Ritik!" "string"

// 7] --> Using String.fromCharCode() to create a string from character codes
// This method creates a string from a sequence of Unicode character codes.
let charCodes = [72, 101, 108, 108, 111, 44, 32, 82, 105, 116, 105, 107, 33]; // Unicode codes for "Hello, Ritik!"
let fromCharCodeStr = String.fromCharCode(...charCodes); // "Hello, Ritik!"
console.log(fromCharCodeStr, typeof(fromCharCodeStr)); // "Hello, Ritik!" "string"

console.log(String.fromCharCode( 54,64,89,67,86,24,689,87,54,67)); // "6@YCVʱW6C" "string"

// Some more properties that can be usefull for DOM only
console.log(str1.strike()); // "Hello, World!" "string"
console.log(str1.bold()); // "Hello, World!" "string"
console.log(str1.italics()); // "Hello, World!" "string"

// 

