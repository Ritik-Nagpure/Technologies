"use strict";
// functions-and-overloading.ts
Object.defineProperty(exports, "__esModule", { value: true });
// 🔹 Basic Function
function greet(name) {
    return `Hello, ${name}!`;
}
// 🔹 Arrow Function
const multiply = (a, b) => a * b;
// function combine(a: any, b: any): string;  // explcit addition of a case for last combine case below
function combine(a, b) {
    return a + b;
}
// 🔹 Usage Examples
console.log(greet("Ravi")); // Output: Hello, Ravi!
console.log(multiply(4, 5)); // Output: 20
console.log(combine(10, 20)); // Output: 30
console.log(combine("Type", "Script")); // Output: TypeScript
// 🔹 Invalid usage (will cause TypeScript error)
// console.log(combine(10, "Script"));   // ❌ No matching overload
