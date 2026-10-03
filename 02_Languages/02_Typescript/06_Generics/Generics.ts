// ===============================
// 🧬 GENERIC TYPES IN TYPESCRIPT
// ===============================
// Generics allow you to write reusable, type-safe code that works with multiple types.
// They act like placeholders for types and are resolved when the code is used.

// ✅ Generic Function
// A function that works with any type T.
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);       // T is number
const str = identity<string>("hello");  // T is string

// ✅ Generic Function with Multiple Types
function merge<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

const merged = merge("Aarav", 25); // ["Aarav", 25]

// ✅ Generic Interface
// Interfaces can use generics to describe flexible data structures.
interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: "Books" };
const numberBox: Box<number> = { content: 99 };

// ✅ Generic Class
// Classes can be parameterized with types to support multiple use cases.
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const stringContainer = new Container("Hello");
const numberContainer = new Container(123);

// ✅ Generic Constraints
// Restrict T to types that have certain properties.
function printLength<T extends { length: number }>(item: T): void {
  console.log("Length:", item.length);
}

printLength("TypeScript"); // Valid
printLength([1, 2, 3]);     // Valid
// printLength(42);         ❌ Error: number has no length

// ✅ Default Generic Type
// Provide a fallback type if none is specified.
function wrap<T = string>(value: T = "" as T ): { wrapped: T } {
  return { wrapped: value };
}

console.log(wrap());        // { wrapped: "" } (default string)
console.log(wrap(100));     // { wrapped: 100 }

// ✅ Generic Type Aliases
type Pair<T, U> = {
  first: T;
  second: U;
};

const coordinates: Pair<number, number> = { first: 10, second: 20 };

// ✅ Generic Utility Types
// Built-in helpers that use generics.

type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  name: string;
  age: number;
}

const readonlyUser: ReadOnly<User> = {
  name: "Aarav",
  age: 30,
};
// readonlyUser.age = 31; ❌ Error: Cannot assign to 'age'

// ✅ Generic Conditional Types
type IsString<T> = T extends string ? "Yes" : "No";

type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"

// ✅ Generic Inference
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirst([10, 20, 30]); // T inferred as number

// ===============================
// ❓ Trick Questions
// ===============================
// - Can you use multiple generic types in one function? ✅ Yes: <T, U>
// - Can you restrict generics to specific types? ✅ Yes: T extends string | number
// - Can you use generics with tuples? ✅ Yes: [T, U]
// - Can you assign a generic function to a non-generic variable? ❌ No—types must match
// - Can you use generics with mapped types? ✅ Yes—like ReadOnly<T>
// - Can you use generics in decorators? ✅ Yes—but it's an advanced use case
