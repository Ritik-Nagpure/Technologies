// ===============================
// 🔒 GENERIC CONSTRAINTS
// ===============================
// Constraints restrict what types can be used in a generic.
// This helps enforce structure and prevent misuse.

// ✅ Extending a Shape
function logLength<T extends { length: number }>(item: T): void {
  console.log("Length:", item.length);
}

logLength("Hello");       // Valid
logLength([1, 2, 3]);     // Valid
// logLength(42);         ❌ Error: number has no length

// ✅ Using keyof Constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Aarav", age: 30 };
console.log(getProperty(user, "name")); // Aarav

// ✅ Using extends with Union Types
function isStringOrNumber<T extends string | number>(value: T): boolean {
  return typeof value === "string" || typeof value === "number";
}

isStringOrNumber("hello"); // true
isStringOrNumber(123);     // true
// isStringOrNumber(true); // ❌ Error

// ✅ Conditional Types (Advanced)
type IsString<T> = T extends string ? "Yes" : "No";

type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"

// ✅ Trick Questions
// - Can you constrain T to multiple types? ✅ Yes: T extends string | number
// - Can you use keyof on a generic type? ✅ Yes
// - Can you use constraints with default types? ✅ Yes—but they must be compatible
// - Can you use constraints with mapped types? ✅ Yes—especially in utility types
