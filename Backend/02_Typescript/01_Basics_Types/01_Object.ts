// objectTypesDemo.ts

// ✅ Basic Object Type
// Define an object with specific property types
let person: { name: string; age: number } = {
  name: "Aarav",
  age: 25,
};
console.log("Basic Object:", person);

// 🧩 Optional Properties
// Use `?` to make a property optional
let book: { title: string; author?: string } = {
  title: "TypeScript Handbook",
};
console.log("Optional Property:", book);

// 🛡️ Readonly Properties
// Prevent reassignment of a property using `readonly`
let config: { readonly apiKey: string } = {
  apiKey: "12345",
};
// config.apiKey = "67890"; // ❌ Error: Cannot assign to 'apiKey'
console.log("Readonly Property:", config);

// 🧠 Type Alias
// Create a reusable object type using `type`
type User = {
  username: string;
  email: string;
};

let newUser: User = {
  username: "coder123",
  email: "coder@example.com",
};
console.log("Type Alias:", newUser);

// 🧬 Interface
// Define object structure using `interface`
interface Car {
  brand: string;
  speed: number;
}

let myCar: Car = {
  brand: "Tesla",
  speed: 250,
};
console.log("Interface:", myCar);

// 🔗 Extending Interfaces
// Combine multiple interfaces using `extends`
interface ElectricCar extends Car {
  batteryRange: number;
}

let ev: ElectricCar = {
  brand: "Nissan",
  speed: 180,
  batteryRange: 300,
};
console.log("Extended Interface:", ev);

// 🧮 Index Signature
// Allow dynamic property names with a specific value type
let errorBag: { [key: string]: string } = {
  email: "Invalid email format",
  username: "Username already taken",
};
console.log("Index Signature:", errorBag);

// 🧰 Function Properties in Objects
// Define methods inside objects with type annotations
type Calculator = {
  add: (a: number, b: number) => number;
};

const calc: Calculator = {
  add: (x, y) => x + y,
};
console.log("Function Property:", calc.add(5, 7));

// 🧼 Structural Typing (Duck Typing)
// TypeScript allows extra properties if required ones match
type Point = { x: number; y: number };

function logPoint(p: Point) {
  console.log(`Point: x=${p.x}, y=${p.y}`);
}

const point3D = { x: 10, y: 20, z: 30 };
logPoint(point3D); // ✅ Extra property is ignored
