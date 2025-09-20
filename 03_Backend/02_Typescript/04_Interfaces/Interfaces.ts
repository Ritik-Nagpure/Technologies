// ===============================
// INTERFACES IN TYPESCRIPT
// ===============================

// Interfaces define the shape of an object.
// They are used to describe the structure that an object must adhere to.

// ✅ Interface Declaration
interface Person {
  name: string;
  age: number;
  isEmployed: boolean;
}

// Example usage:
const employee: Person = {
  name: "Aarav",
  age: 30,
  isEmployed: true,
};

// Interfaces can also include optional properties using '?'
interface Product {
  id: number;
  name: string;
  description?: string; // optional
}

// Interfaces can include readonly properties
interface User {
  readonly id: number;
  username: string;
}

// Trying to modify a readonly property will cause an error
const user: User = { id: 101, username: "coder123" };
// user.id = 102; // ❌ Error: Cannot assign to 'id' because it is a read-only property

// ===============================
// EXTENDING INTERFACES
// ===============================

// Interfaces can extend other interfaces to build on existing structures

interface Animal {
  species: string;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const myDog: Dog = {
  species: "Canine",
  breed: "Labrador",
  bark() {
    console.log("Woof!");
  },
};

// ===============================
// INTERFACE FOR FUNCTION TYPES
// ===============================

// Interfaces can describe function signatures

interface StringFormatter {
  (input: string): string;
}

const toUpperCase: StringFormatter = (text) => text.toUpperCase();

// ===============================
// INTERFACE FOR ARRAY TYPES
// ===============================

interface StringArray {
  [index: number]: string;
}

const fruits: StringArray = ["apple", "banana", "cherry"];

// ===============================
// HYBRID TYPES
// ===============================

// Hybrid types are interfaces that describe objects with both properties and callable signatures

interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {
    return `Starting at ${start}`;
  } as Counter;

  counter.interval = 1000;
  counter.reset = () => {
    console.log("Counter reset");
  };

  return counter;
}

const c = getCounter();
console.log(c(10)); // Starting at 10
c.reset(); // Counter reset
console.log(c.interval); // 1000

// ===============================
// TYPES VS INTERFACES
// ===============================

// - Both can describe object shapes.
// - 'type' is more flexible (can use unions, intersections, primitives).
// - 'interface' is better for extending and implementing in classes.
// - Interfaces are preferred for public APIs and class contracts.

// Example of type:
type Vehicle = {
  make: string;
  model: string;
};

// Example of union type:
type Status = "success" | "error" | "loading";

// ===============================
// INTERFACE DECLARATION MERGING
// ===============================

// Interfaces can be declared multiple times and will merge automatically

interface Window {
  title: string;
}

interface Window {
  size: number;
}

const win: Window = {
  title: "My App",
  size: 800,
};

// ===============================
// SUMMARY TOPICS
// ===============================

// ✅ Types vs Interfaces:
//    - Use 'type' for unions, primitives, and complex compositions.
//    - Use 'interface' for object shapes and class contracts.

// ✅ Extending Interfaces:
//    - Use 'extends' to build on existing interfaces.
//    - Supports multiple inheritance.

// ✅ Interface Declaration:
//    - Use 'interface' keyword.
//    - Supports optional, readonly, function, and array types.

// ✅ Hybrid Types:
//    - Interfaces can describe callable objects with properties.
//    - Useful for libraries and advanced API design.

// ===============================
// 🔎 IMPORTANT NOTES: Type vs Interface
// ===============================
//
// ✅ Use `interface` when:
//    - Designing object shapes, especially for class implementations.
//    - You need declaration merging (e.g., extending built-in types or third-party interfaces).
//    - You want to extend multiple interfaces cleanly.
//
// ✅ Use `type` when:
//    - Creating unions, intersections, or aliases for primitives.
//    - You need more flexibility in composing types (e.g., `type Status = "success" | "error"`).
//    - You want to represent tuples, mapped types, or conditional types.
//
// ⚠️ Both are similar for object shapes, but `interface` is more extendable and preferred for public APIs.
// ⚠️ `type` is more powerful for advanced type operations.
//
// 🧠 Rule of thumb:
//    - Use `interface` for structure.
//    - Use `type` for composition.
//
// You can often use either, but understanding their strengths helps write cleaner, scalable TypeScript.

interface newtest {
    male : 'F' | 'M';
    name : string;
}

let a : newtest = {
    male : 'F',
    name : 'Hello'
}

console.log(a);
