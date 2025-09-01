// ===============================
// 📘 TypeScript Notes & Examples
// Topics: Union, Intersection, Type Alias, keyof
// ===============================

// 🔹 1. TYPE ALIAS
// A type alias gives a name to a type. Useful for readability and reuse.

type UserID = string | number;

type User = {
  id: UserID;
  cid?: string | number;
  name: string;
  email?: string; // optional property
};

// Example usage:
const user1: User = {
  id: 101,
  name: "Alice",
};

// 🔹 2. UNION TYPE
// Union Types in TypeScript allow you to specify multiple possible types for a single variable or parameter. 
// A union type is written as a vertical bar | separated list of types.

type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  if (status === "loading") {
    console.log("⏳ Loading...");
  } else if (status === "success") {
    console.log("✅ Success!");
  } else {
    console.log("❌ Error!");
  }
}

// Union with primitives:
let value: string | number;
value = "hello";
value = 42;

// 🔹 3. INTERSECTION TYPE
// An intersection type creates a new type by combining multiple existing types. 
// The new type has all features of the existing types.

type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
};

type Staff = Person & Employee;

const staffMember: Staff = {
  name: "Bob",
  employeeId: 1234,
};

// 🔹 4. KEYOF OPERATOR
// The keyof operator in TypeScript is used to get the union of keys from an object type. 
// `keyof` creates a union of all property names of a type.

type Product = {
  id: number;
  title: string;
  price: number;
};

type ProductKeys = keyof Product; // "id" | "title" | "price"

function getProductProperty(product: Product, key: ProductKeys) {
  return product[key];
}

const sampleProduct: Product = {
  id: 1,
  title: "Laptop",
  price: 999,
};

console.log(getProductProperty(sampleProduct, "title")); // Output: "Laptop"

// ===============================
// 🧠 Summary:
// - Type Alias: Custom name for a type.
// - Union: One of many types.
// - Intersection: Combines multiple types.
// - keyof: Gets keys of a type as a union.
// ===============================
