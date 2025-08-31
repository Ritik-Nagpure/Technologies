"use strict";
// objectTypesDemo.ts
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ Basic Object Type
// Define an object with specific property types
let person = {
    name: "Aarav",
    age: 25,
};
console.log("Basic Object:", person);
// 🧩 Optional Properties
// Use `?` to make a property optional
let book = {
    title: "TypeScript Handbook",
};
console.log("Optional Property:", book);
// 🛡️ Readonly Properties
// Prevent reassignment of a property using `readonly`
let config = {
    apiKey: "12345",
};
// config.apiKey = "67890"; // ❌ Error: Cannot assign to 'apiKey'
console.log("Readonly Property:", config);
let newUser = {
    username: "coder123",
    email: "coder@example.com",
};
console.log("Type Alias:", newUser);
let myCar = {
    brand: "Tesla",
    speed: 250,
};
console.log("Interface:", myCar);
let ev = {
    brand: "Nissan",
    speed: 180,
    batteryRange: 300,
};
console.log("Extended Interface:", ev);
// 🧮 Index Signature
// Allow dynamic property names with a specific value type
let errorBag = {
    email: "Invalid email format",
    username: "Username already taken",
};
console.log("Index Signature:", errorBag);
const calc = {
    add: (x, y) => x + y,
};
console.log("Function Property:", calc.add(5, 7));
function logPoint(p) {
    console.log(`Point: x=${p.x}, y=${p.y}`);
}
const point3D = { x: 10, y: 20, z: 30 };
logPoint(point3D); // ✅ Extra property is ignored
