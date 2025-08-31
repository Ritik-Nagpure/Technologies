"use strict";
/*
The as <type> syntax is a type assertion, not a type conversion. That means:
    It tells TypeScript to treat a value as a certain type during type checking.
    It does not change the actual runtime type or structure of the value.
    It’s purely a compile-time construct—used to help TypeScript understand your intent.
*/
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ Type Assertion using `as <type>`
// Tells TypeScript to treat a value as a specific type
let value = "Hello TypeScript";
let strLength = value.length;
console.log("Type Assertion (as string):", strLength);
// ✅ Type Assertion using `<type>` syntax (alternative)
// Only works in .ts files, not .tsx (React)
let anotherValue = "Another string";
let lengthAlt = anotherValue.length;
console.log("Type Assertion (<string>):", lengthAlt);
// ✅ Type Assertion using `as any`
// Temporarily disables type checking for a value
let risky = "123";
let unchecked = risky.toUpperCase(); // No error, but risky!
console.log("Type Assertion (as any):", unchecked); // Runtime error if not a string
// ✅ `as const`
// Makes object or array values deeply immutable and narrows literal types
const config = {
    mode: "dark",
    version: 1,
};
console.log("As Const:", config);
// config.mode = "light"; // ❌ Error: Cannot assign to 'mode' because it is a read-only property
// ✅ Non-null Assertion (`!`)
// Tells TypeScript that a value is not null or undefined
function getElement(id) {
    return Number(id);
}
const el = getElement("8");
console.log("Non-null Assertion:", el); // Assumes 'el' is not null
const userSettings = {
    theme: "dark",
    notifications: true,
    //   kjkd: 0   // Shows error because this property is not declared in type settings
};
console.log("Satisfies Keyword:", userSettings);
