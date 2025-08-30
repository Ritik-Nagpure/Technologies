// primitive-types.ts

// ✅ NUMBER
// Represents both integers and floating-point numbers.
// TypeScript uses double-precision 64-bit format (same as JavaScript).
let age: number = 30;
let temperature: number = 36.6;
let hex: number = 0xff;         // hexadecimal
let binary: number = 0b1010;    // binary
let octal: number = 0o744;      // octal

// ✅ STRING
// Used to store textual data. Can use single, double, or backticks.
// Backticks allow for template literals and embedded expressions.
let firstName: string = "John";
let lastName: string = 'Doe';
let fullName: string = `${firstName} ${lastName}`; // template literal

// ✅ BOOLEAN
// Represents logical values: true or false.
// Commonly used in control flow and conditionals.
let isActive: boolean = true;
let hasPermission: boolean = false;

// ✅ NULL
// Represents an intentional absence of any object value.
// Often used to reset or clear a variable.
let emptyValue: null = null;

// ✅ UNDEFINED
// Indicates a variable has been declared but not yet assigned a value.
// Default value of uninitialized variables.
let notAssigned: undefined = undefined;

// ✅ SYMBOL
// Introduced in ES6. Used to create unique and immutable identifiers.
// Often used as keys for object properties to avoid naming collisions.
const uniqueId: symbol = Symbol("id");
const anotherId: symbol = Symbol("id");
console.log(uniqueId === anotherId); // false — each symbol is unique

// ✅ BIGINT
// Used for arbitrarily large integers beyond the safe range of number.
// Useful in financial or scientific calculations requiring precision.
let bigNumber: bigint = 9007199254740991n;
let anotherBig: bigint = BigInt("123456789012345678901234567890");

// ✅ TYPE INFERENCE
// TypeScript can automatically infer the type based on the assigned value.
let score = 100;       // inferred as number
let message = "Hello"; // inferred as string

// ✅ STRICT NULL CHECKS (optional)
// With strictNullChecks enabled, null and undefined must be explicitly handled.
let maybeString: string | null = null;
let optionalValue: number | undefined = undefined;

// ✅ LOGGING ALL VALUES
console.log("Age:", age);
console.log("Full Name:", fullName);
console.log("Is Active:", isActive);
console.log("Empty Value:", emptyValue);
console.log("Not Assigned:", notAssigned);
console.log("Big Number:", bigNumber);
