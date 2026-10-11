// type-inference-complete.ts

/* ============================================================
 *  📘 TYPE INFERENCE IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. What is type inference?
 *   2. Inference in variable declarations (let/const/var)
 *   3. Inference in arrays & tuples
 *   4. Inference in objects
 *   5. Inference in functions (params, returns, defaults)
 *   6. Contextual typing
 *   7. Best common type (union inference)
 *   8. Literal widening & narrowing
 *   9. `as const` and const type params
 *  10. Inference in generics
 *  11. Inference with classes
 *  12. Inference in destructuring
 *  13. Return type inference pitfalls
 *  14. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS TYPE INFERENCE?
 * ============================================================ */

// Type inference = TypeScript AUTOMATICALLY figures out the type
// of a value based on how it's declared and used — no annotation needed.
// Under the hood, TS uses control-flow + assignment analysis.

let age = 25;                    // inferred as number
const title = "TS Guide";        // inferred as "TS Guide" (literal, const)
let items = [1, 2, 3];           // inferred as number[]
let user = { name: "Sam", active: true }; // { name: string; active: boolean }
function double(x = 2) { return x * 2; }  // x: number, return: number

/* ============================================================
 *  2️⃣ INFERENCE IN VARIABLE DECLARATIONS
 * ============================================================ */

// 🔸 `let` — widens to the general type
let a = 42;             // number  (NOT literal 42)
let b = "hello";        // string  (NOT literal "hello")
let c = true;           // boolean (NOT literal true)

// 🔸 `const` — keeps the narrow literal type
const d = 42;           // 42
const e = "hello";      // "hello"
const f = true;         // true

// 🔸 `var` — same as let for inference
var g = 42;             // number

// 🔸 Explicit annotation OVERRIDES inference
let h: 42 = 42;         // literal 42
let i: number = 42;     // number

// 🔸 Without initializer — implicit `any` (or error under noImplicitAny)
// let j;               // any (or error if noImplicitAny is on)
// j = 5;               // still `any` at this point, doesn't retro-infer

// 🧠 Why let vs const matters:
//    let  → "this may change" → wider type (number, string)
//    const → "this is fixed"  → narrow type (literal)

/* ============================================================
 *  3️⃣ INFERENCE IN ARRAYS & TUPLES
 * ============================================================ */

// Homogeneous array — union of element types
let nums = [1, 2, 3];            // number[]
let strs = ["a", "b"];           // string[]
let mixed = [1, "a", true];      // (string | number | boolean)[]

// Nested arrays
let matrix = [[1, 2], [3, 4]];   // number[][]

// Empty array — special case
let empty = [];                  // any[] (evolving array in some contexts)
// Use explicit annotation for empty arrays:
let emptyStr: string[] = [];

// Tuple inference requires explicit annotation OR `as const`
let pair: [number, string] = [1, "a"];
let roPair = [1, "a"] as const;  // readonly [1, "a"]

// ⚠️ Without annotation, `[1, "a"]` is inferred as (string | number)[], NOT a tuple.

/* ============================================================
 *  4️⃣ INFERENCE IN OBJECTS
 * ============================================================ */

// Inferred object shape — property types are inferred per property
let user2 = { name: "Sam", active: true };
// type: { name: string; active: boolean }

// Nested objects
let settings = {
  theme: "dark",
  layout: { columns: 2, wide: false }
};
// { theme: string; layout: { columns: number; wide: boolean } }

// Mixed with methods
let api = {
  base: "/api",
  get: (path: string) => `GET ${path}`,
};
// { base: string; get: (path: string) => string }

// ⚠️ Object property types WIDEN under let (just like primitives):
let theme = { mode: "dark" };      // { mode: string }
const themeC = { mode: "dark" } as const; // { readonly mode: "dark" }

/* ============================================================
 *  5️⃣ INFERENCE IN FUNCTIONS
 * ============================================================ */

// 🔸 Return type inferred from the return statement
function add(x: number, y: number) {
  return x + y;             // return type inferred as number
}

// 🔸 Parameter types are NOT inferred — they need annotation
// function bad(x, y) { ... }   // ❌ under noImplicitAny
// x, y are inferred as `any` if `noImplicitAny` is OFF

// 🔸 Default parameter values DO infer types
function greet(name = "World") { return `Hello, ${name}`; }
// name: string, return: string

// 🔸 Multiple return statements → union inference
function val(flag: boolean) {
  if (flag) return 1;
  return "no";
}
// return type: number | string

// 🔸 Never-returning branches don't pollute the union
function getX(flag: boolean) {
  if (!flag) throw new Error("bad");
  return 42;                // return: number (throw branches filtered)
}

// 🔸 Recursive functions need explicit return type annotation
// function fib(n: number): number {      // ← annotation recommended
//   return n <= 1 ? n : fib(n - 1) + fib(n - 2);
// }

/* ============================================================
 *  6️⃣ CONTEXTUAL TYPING
 * ============================================================ */

// TS infers types based on the EXPECTED type in the surrounding context.

// Callback params inferred from the function's expected signature:
[1, 2, 3].map((n) => n * 2);       // n inferred as number

// Object literal inferred from a contextual type:
interface Cfg { theme: string; debug: boolean }
const cfg: Cfg = { theme: "dark", debug: true };
// theme and debug inferred from Cfg

// Array literal inferred from context:
const names: string[] = [];        // empty, but context says string[]
names.push("Ravi");                // ✅

// Event handler params:
// document.addEventListener("click", (e) => { e.clientX });  // e: MouseEvent

// 🔸 Contextual typing ONLY works when the expected type is known.

/* ============================================================
 *  7️⃣ BEST COMMON TYPE (UNION INFERENCE)
 * ============================================================ */

// When inferring from multiple candidates, TS computes the "best common type".
let arr = [0, 1, null];            // (number | null)[]
let arr2 = [0, 1, "a"];            // (number | string)[]

// 🧠 TS walks the array and picks the nearest common ancestor (union).
// Explicit annotation forces a specific type:
let arr3: (number | string | boolean)[] = [0, 1, "a", true];

/* ============================================================
 *  8️⃣ LITERAL WIDENING & NARROWING
 * ============================================================ */

// Literal widening: when a literal is assigned to a mutable location,
// its type widens to the general type.

let lw = "dark";                   // string (widened)
const lc = "dark";                 // "dark" (not widened)

// Widening in objects (properties widen)
let obj = { mode: "dark" };        // { mode: string }

// 🔸 You can prevent widening with `as const`:
let frozen = { mode: "dark" } as const;  // { readonly mode: "dark" }

// 🔸 Contextual narrowing: TS narrows types within control flow
function process(x: string | number) {
  if (typeof x === "string") {
    x.toUpperCase();               // x narrowed to string
  } else {
    x.toFixed(2);                  // x narrowed to number
  }
}

/* ============================================================
 *  9️⃣ `as const` AND CONST TYPE PARAMS
 * ============================================================ */

// `as const` — deep readonly + literal preservation
const palette = {
  red: [255, 0, 0],
  green: [0, 255, 0],
} as const;

// Const type params (TS 5.0+) — infer literals without `as const`
function tuple<const T extends readonly unknown[]>(...args: T): T {
  return args;
}
const t = tuple("a", "b", "c");    // readonly ["a", "b", "c"]

/* ============================================================
 *  🔟 INFERENCE IN GENERICS
 * ============================================================ */

// T inferred from argument
function identity<T>(x: T): T { return x; }
identity(42);          // T = 42? No → T = number (widened)
identity("hello");     // T = string

// Multiple type params
function pair<K, V>(k: K, v: V): [K, V] { return [k, v]; }
pair("a", 1);          // [string, number]

// Inference from return position (return type annotation guides T)
function make<T>(): T { return {} as T; }
const num = make<number>();

// 🔸 Default type params kick in when inference can't determine T
function box<T = string>(v?: T): T[] { return v ? [v] : []; }
box();                 // T = string

// 🔸 Constraint doesn't affect inference directly, only validation
function len<T extends { length: number }>(x: T): number { return x.length; }
len("hi");             // T = string

/* ============================================================
 *  1️⃣1️⃣ INFERENCE WITH CLASSES
 * ============================================================ */

// Field types inferred from initializer
class Point {
  x = 0;               // number
  y = 0;               // number
}

// Constructor param properties — types come from annotations
class Circle {
  constructor(public radius: number) {}
}

// Method return types inferred
class Calc {
  add(a: number, b: number) { return a + b; }   // number
}

// 🔸 Class fields WITHOUT initializer need annotations (strict mode)
class UserC {
  name: string;        // must annotate
  constructor(name: string) { this.name = name; }
}

/* ============================================================
 *  1️⃣2️⃣ INFERENCE IN DESTRUCTURING
 * ============================================================ */

const { name, age: a2 } = { name: "Ravi", age: 25 };
// name: string, a2: number

const [first, second] = [1, "b"];  // first: number, second: string

// Function parameter destructuring
function printUser({ name, age }: { name: string; age: number }) {
  console.log(name, age);
}

// Default values in destructuring
const { theme = "light" } = {} as { theme?: string }; // theme: string

/* ============================================================
 *  1️⃣3️⃣ RETURN TYPE INFERENCE PITFALLS
 * ============================================================ */

// ⚠️ Public API functions should annotate return types — prevents
//    accidental type changes leaking to consumers.
export function pubAdd(a: number, b: number): number { return a + b; }

// ⚠️ Recursive functions can't infer without annotation → use explicit.

// ⚠️ Async function return type is `Promise<inferred>`
async function fetchName() { return "Ravi"; }   // Promise<string>

// ⚠️ Return type can silently widen if you later add a return path.

/* ============================================================
 *  1️⃣4️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `let x = null` → x is `any` (unless strictNullChecks: true → null)
// ⚠️ `let x = undefined` → same story.
// ⚠️ Uninitialized `let x;` → implicit any (error under noImplicitAny).
// ⚠️ Object literal property types widen unless `as const`.
// ⚠️ TS never infers a TUPLE from an array literal — use `as const` or annotate.
// ⚠️ `const enum` members infer their value as the enum, not number.
// ⚠️ Under `strictFunctionTypes`, callback params infer contravariantly.

// 🕒 Version notes
// - Const type parameters: TS 5.0
// - Improved literal inference in catch: TS 4.x
// - `as const` since TS 3.4
// - Const assertion in generics: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Construct                     | Inferred type                  |
 * ─────────────────────────────────────────────────────────────
 * | let a = 42                    | number                         |
 * | const a = 42                  | 42                             |
 * | let s = "hi"                  | string                         |
 * | const s = "hi"                | "hi"                           |
 * | let arr = [1, 2]              | number[]                       |
 * | let arr = [1, "a"]            | (number | string)[]            |
 * | let obj = { a: 1 }            | { a: number }                  |
 * | let obj = { a: 1 } as const   | { readonly a: 1 }              |
 * | function f(x = 1) {}          | x: number                      |
 * | function f() { return 1 }     | (): number                     |
 * | function f(b) { if(b) return 1; return "a" } | (): number \| string |
 * | callback in `.map(n => ...)`  | contextual: number             |
 * | generic f<T>(x: T) called with 42 | T = number                |
 * | destructure { a } from {a: 1} | a: number                      |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Let inference work for LOCAL variables.
 *  - ANNOTATE public API boundaries (exports, class fields, DTOs).
 *  - Use `as const` when you want literal types preserved.
 *  - Use `const` type params (TS 5.0+) for utilities that should keep literals.
 *  - Enable `noImplicitAny` and `strict` to catch inference gaps early.
 *  - Prefer `unknown` over implicit `any` when a value truly has no type yet.
 *  - Annotate return types for exported functions to lock the public contract.
 * ============================================================ */