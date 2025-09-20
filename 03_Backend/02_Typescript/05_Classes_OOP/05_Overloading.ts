// ===============================
// 🔁 OVERLOADING
// ===============================
// This file explores how TypeScript supports overloading—defining multiple ways to call a function or method
// using different parameter types or counts. Overloading improves flexibility and readability.

// ✅ Function Overloading
// Function overloading allows you to define multiple call signatures for a single function.

function greet(name: string): string;
function greet(age: number): string;
function greet(value: string | number): string {
  // This is the actual implementation that handles both overloads.
  return typeof value === "string"
    ? `Hello, ${value}` // If a string is passed, greet by name.
    : `You are ${value} years old`; // If a number is passed, respond with age.
}

console.log(greet("Aarav")); // Hello, Aarav
console.log(greet(25));      // You are 25 years old

// ✅ Method Overloading
// You can overload methods inside classes using multiple signatures.

class Printer {
  // Overload signatures
  print(text: string): void;
  print(count: number): void;

  // Actual implementation
  print(value: string | number): void {
    // Handles both string and number inputs
    console.log(`Printing: ${value}`);
  }
}

const printer = new Printer();
printer.print("Report"); // Printing: Report
printer.print(3);        // Printing: 3

// ✅ Constructor Overloading (Simulated)
// TypeScript doesn't support multiple constructor bodies, but you can simulate it using union types.

class Point {
  x: number;
  y: number;

  // Overload signatures
  constructor(x: number, y: number);
  constructor(coords: [number, number]);

  // Single implementation
  constructor(xOrCoords: number | [number, number], y?: number) {
    if (Array.isArray(xOrCoords)) {
      // If an array is passed, unpack coordinates
      [this.x, this.y] = xOrCoords;
    } else {
      // Otherwise, use x and y directly
      this.x = xOrCoords;
      this.y = y!;
    }
  }
}

const p1 = new Point(5, 10);
const p2 = new Point([15, 20]);
console.log(p1); // Point { x: 5, y: 10 }
console.log(p2); // Point { x: 15, y: 20 }

// ✅ Why Overloading Matters
// Overloading makes your APIs more intuitive and flexible.
// It allows you to support multiple input types without writing separate functions.

// ===============================
// ❓ Trick Questions
// ===============================
// - Can you have multiple function bodies in TypeScript? ❌ No—only one implementation.
// - Do overloads exist in compiled JavaScript? ❌ No—they’re erased during compilation.
// - Can you overload constructors with different parameter types? ✅ Yes—but only one body.
// - Can you overload based on return type alone? ❌ No—must differ by parameters.
// - Is method overloading the same as overriding? ❌ No—overloading is within one class; overriding is across inheritance.
