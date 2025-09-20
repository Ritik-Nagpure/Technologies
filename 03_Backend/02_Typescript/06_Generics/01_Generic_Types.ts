// ===============================
// 🧬 GENERIC TYPES
// ===============================
// Generic types allow you to write reusable code that works with multiple data types
// while preserving type safety. Think of them as "type variables"—like function parameters, but for types.

// ✅ Basic Generic Function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);       // T is number
const str = identity<string>("hello");  // T is string

// ✅ Generic Type Alias
type Pair<T, U> = {
  first: T;
  second: U;
};

const coordinates: Pair<number, number> = { first: 10, second: 20 };

// ✅ Generic Class
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

// ✅ Generic Arrays
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(firstElement(["a", "b", "c"])); // "a"
console.log(firstElement([1, 2, 3]));       // 1

// ✅ Generic Default Type
function wrap<T = string>(value: T): { wrapped: T } {
  return { wrapped: value };
}

console.log(wrap("hello")); // { wrapped: "hello" }
console.log(wrap(100));     // { wrapped: 100 }

// ✅ Generic Inference
function getLast<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const last = getLast([true, false]); // T inferred as boolean

// ✅ Trick Questions
// - Can you use multiple generic types? ✅ Yes: <T, U>
// - Do generics exist in compiled JS? ❌ No—they’re erased
// - Can you use generics with tuples? ✅ Yes: [T, U]
// - Can you use generics with union types? ✅ Yes: T extends string | number
