// Type Inference — automatic type detection by TypeScript
//Type inference in TypeScript refers to the process of automatically determining the type of a variable based on the value assigned to it. 

let age = 25; // inferred as number
const title = "TS Guide"; // inferred as string
let items = [1, 2, 3]; // inferred as number[]
let user = { name: "Sam", active: true }; // inferred object shape
function double(x = 2) { return x * 2; } // x inferred as number
