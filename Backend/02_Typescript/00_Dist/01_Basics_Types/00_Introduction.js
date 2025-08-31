"use strict";
// intro.ts
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ TypeScript Introduction
// 1. Type annotations
let message = "Hello, TypeScript!";
let year = 2025;
let isAwesome = true;
// 2. Functions with types
function greet(name) {
    return `Hello, ${name}!`;
}
const user = {
    name: "Aarav",
    age: 30,
};
// 4. Classes
class Animal {
    name;
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} makes a sound.`);
    }
}
const dog = new Animal("Dog");
dog.speak();
// 5. Union types
function printId(id) {
    console.log(`Your ID is: ${id}`);
}
printId(101);
printId("TS2025");
// 6. Enums
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
console.log(Direction.Up); // 0
// Run this file using the instructions below!
