"use strict";
// primitive-types.ts
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ NUMBER
// Represents both integers and floating-point numbers.
// TypeScript uses double-precision 64-bit format (same as JavaScript).
let age = 30;
let temperature = 36.6;
let hex = 0xff; // hexadecimal
let binary = 0b1010; // binary
let octal = 0o744; // octal
// ✅ STRING
// Used to store textual data. Can use single, double, or backticks.
// Backticks allow for template literals and embedded expressions.
let firstName = "John";
let lastName = 'Doe';
let fullName = `${firstName} ${lastName}`; // template literal
// ✅ BOOLEAN
// Represents logical values: true or false.
// Commonly used in control flow and conditionals.
let isActive = true;
let hasPermission = false;
// ✅ NULL
// Represents an intentional absence of any object value.
// Often used to reset or clear a variable.
let emptyValue = null;
// ✅ UNDEFINED
// Indicates a variable has been declared but not yet assigned a value.
// Default value of uninitialized variables.
let notAssigned = undefined;
// ✅ SYMBOL
// Introduced in ES6. Used to create unique and immutable identifiers.
// Often used as keys for object properties to avoid naming collisions.
const uniqueId = Symbol("id");
const anotherId = Symbol("id");
console.log(uniqueId === anotherId); // false — each symbol is unique
// ✅ BIGINT
// Used for arbitrarily large integers beyond the safe range of number.
// Useful in financial or scientific calculations requiring precision.
let bigNumber = 9007199254740991n;
let anotherBig = BigInt("123456789012345678901234567890");
// ✅ LOGGING ALL VALUES
console.log("Age:", age);
console.log("Full Name:", fullName);
console.log("Is Active:", isActive);
console.log("Empty Value:", emptyValue);
console.log("Not Assigned:", notAssigned);
console.log("Big Number:", bigNumber);
// voidTypeDemo.ts
// ✅ What is `void`?
// `void` is used to indicate that a function does not return a value.
// It's commonly used for functions that perform actions like logging or updating state.
function logMessage(message) {
    console.log("Log:", message);
}
logMessage("Hello from a void function!");
function run(callback) {
    console.log("Running callback...");
    callback();
}
run(() => {
    console.log("Callback executed.");
});
// ⚠️ `void` vs `undefined`
// `undefined` is a value, while `void` is a type.
// You can assign `undefined` to a variable, but you can't assign `void`.
let notDefined = undefined;
console.log("Undefined value:", notDefined);
// let nothing: void = undefined; // ✅ Technically allowed, but not useful
// let wrong: void = "hello";     // ❌ Error: Type 'string' is not assignable to type 'void'
// 🧠 Trivia
// In JavaScript, functions that don’t return anything implicitly return `undefined`.
// TypeScript uses `void` to make that intent explicit.
function jsStyleFunction() {
    console.log("This function returns nothing.");
}
const result = jsStyleFunction(); // result is `undefined`
console.log("Result of jsStyleFunction():", result);
