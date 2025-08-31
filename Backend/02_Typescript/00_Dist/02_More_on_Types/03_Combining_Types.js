"use strict";
// ===============================
// 📘 TypeScript Notes & Examples
// Topics: Union, Intersection, Type Alias, keyof
// ===============================
Object.defineProperty(exports, "__esModule", { value: true });
// Example usage:
const user1 = {
    id: 101,
    name: "Alice",
};
function handleStatus(status) {
    if (status === "loading") {
        console.log("⏳ Loading...");
    }
    else if (status === "success") {
        console.log("✅ Success!");
    }
    else {
        console.log("❌ Error!");
    }
}
// Union with primitives:
let value;
value = "hello";
value = 42;
const staffMember = {
    name: "Bob",
    employeeId: 1234,
};
function getProductProperty(product, key) {
    return product[key];
}
const sampleProduct = {
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
