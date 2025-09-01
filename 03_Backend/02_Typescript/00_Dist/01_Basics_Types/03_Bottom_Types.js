"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 🧨 ANY – disables type checking entirely
let rawData;
rawData = 42;
rawData = "hello";
rawData = { x: 1 };
// No error, even if rawData isn't a string
// console.log(rawData.toUpperCase()); // risky!
// 🕵️ UNKNOWN – safer alternative to any
let userInput = "TypeScript";
if (typeof userInput === "string") {
    // TypeScript now knows it's a string
    console.log(userInput.toUpperCase()); // safe!
}
