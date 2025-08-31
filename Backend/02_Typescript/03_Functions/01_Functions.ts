// functions-and-overloading.ts

// 🔹 Basic Function
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 🔹 Arrow Function
const multiply = (a: number, b: number): number => a * b;

// 🔹 Function Overloading
// The first two lines are overload signatures.
// The third line is the actual implementation, which uses any to handle both cases.
// But TypeScript does not use the implementation signature to validate calls. 
// It only checks if the call matches one of the declared overloads.

function combine(a: number, b: number): number;
function combine(a: string, b: string): string;
// function combine(a: any, b: any): string;  // explcit addition of a case for last combine case below
function combine(a: any, b: any): any {
  return a + b;
}

// 🔹 Usage Examples
console.log(greet("Ravi"));               // Output: Hello, Ravi!
console.log(multiply(4, 5));              // Output: 20
console.log(combine(10, 20));            // Output: 30
console.log(combine("Type", "Script"));  // Output: TypeScript

// 🔹 Invalid usage (will cause TypeScript error)
// console.log(combine(10, "Script"));   // ❌ No matching overload
