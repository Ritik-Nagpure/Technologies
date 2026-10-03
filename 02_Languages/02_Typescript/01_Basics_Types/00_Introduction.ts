// intro.ts

// ✅ TypeScript Introduction

// 1. Type annotations
let message: string = "Hello, TypeScript!";
let year: number = 2025;
let isAwesome: boolean = true;

// 2. Functions with types
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 3. Interfaces
interface Person {
  name: string;
  age: number;
}

const user: Person = {
  name: "Aarav",
  age: 30,
};

// 4. Classes
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound.`);
  }
}

const dog = new Animal("Dog");
dog.speak();

// 5. Union types
function printId(id: number | string): void {
  console.log(`Your ID is: ${id}`);
}

printId(101);
printId("TS2025");

// 6. Enums
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Up); // 0

// Run this file using the instructions below!
