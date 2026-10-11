// 01-functions-and-overloading.ts

/* ============================================================
 *  📘 TYPESCRIPT FUNCTIONS — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. Basic & arrow functions
 *   2. Optional / default / rest parameters
 *   3. `this` typing
 *   4. Function type expressions & call signatures
 *   5. Generics (with constraints & defaults)
 *   6. Function overloading (with rules & pitfalls)
 *   7. Higher-order functions
 *   8. `void` / `never` return types
 *   9. Constructor signatures (regular + abstract)
 *  10. Async functions & Promise returns
 *  11. Assertion functions
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ BASIC & ARROW FUNCTIONS
 * ============================================================ */

// Standard declaration — params & return type are explicit
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function — concise syntax; return type inferred (can be explicit)
const multiply = (a: number, b: number): number => a * b;

// Arrow returning object literal — wrap in parens
const makeUser = (id: number) => ({ id, name: "anon" });

// Immediately Invoked Function Expression (IIFE)
const sumIIFE = (function (a: number, b: number) { return a + b; })(3, 4);

// Function expression with a named function (useful for stack traces)
const divide = function divideFn(a: number, b: number): number { return a / b; };

// 🔸 Function hoisting
// `function` declarations are hoisted; `const` arrow functions are NOT.
console.log(hoisted());          // ✅ works
function hoisted() { return "hoisted"; }
// console.log(notHoisted());    // ❌ ReferenceError — used before declaration
const notHoisted = () => "not hoisted";

/* ============================================================
 *  2️⃣ OPTIONAL / DEFAULT / REST PARAMETERS
 * ============================================================ */

// Optional — must come after required params
function greetUser(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}!` : `Hello, ${name}!`;
}

// Default — used when arg is `undefined` (or omitted)
function power(base: number, exponent: number = 2): number {
  return base ** exponent;
}
power(5);        // 25
power(2, 10);    // 1024
power(3, undefined); // 9 (undefined triggers default)

// Default referencing an earlier parameter (allowed)
function makeBox(w: number, h: number = w): { w: number; h: number } {
  return { w, h };
}
makeBox(5);      // { w: 5, h: 5 }

// Rest — collects remaining args into a typed array; must be last
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5); // 15

// Rest + required params
function logAll(prefix: string, ...rest: unknown[]): void {
  console.log(prefix, ...rest);
}

// Rest with tuple type (preserves per-position types)
function pair(...args: [number, string]): string {
  return `${args[0]}-${args[1]}`;
}
pair(1, "a");    // ✅
// pair("a", 1); // ❌ Error

// ⚠️ Pitfalls
// - Required params cannot follow optional ones in the SAME list,
//   but a required param CAN follow a defaulted one:
//     function f(a = 1, b: number) {} // ✅ (caller must pass b explicitly)
// - Default values are evaluated at call time, not definition time.

/* ============================================================
 *  3️⃣ `this` TYPING
 * ============================================================ */

// Explicit `this` parameter — must be first, erased at compile time
function getInfo(this: { name: string; age: number }): string {
  return `${this.name} is ${this.age}.`;
}
const person = { name: "Ravi", age: 25, getInfo };
person.getInfo();       // ✅
// getInfo();           // ❌ Error — `this` context missing

// `this` type in classes (polymorphic `this`)
class Builder {
  private parts: string[] = [];
  add(part: string): this {
    this.parts.push(part);
    return this; // returns `this` — supports fluent chaining
  }
  build(): string { return this.parts.join(","); }
}
new Builder().add("a").add("b").build(); // "a,b"

// `this` in callbacks — arrow functions capture enclosing `this`
class Counter {
  count = 0;
  incArrow = () => { this.count++; };            // captures class `this`
  incFn() { setTimeout(function (this: Counter) { this.count++; }, 0); }
}

/* ============================================================
 *  4️⃣ FUNCTION TYPE EXPRESSIONS & CALL SIGNATURES
 * ============================================================ */

// Function type expression
type MathOp = (a: number, b: number) => number;
const add: MathOp = (a, b) => a + b;

// Call signature in interface (callable object with extra props)
interface Formatter {
  (input: string): string;
  locale: string;
}
const upper: Formatter = (s: string) => s.toUpperCase();
upper.locale = "en-US";

// Overloaded call signatures in an interface
interface Parser {
  (input: string): string[];
  (input: number): number[];
}

// Constructor signature
type Ctor = new (name: string) => { name: string };

// ⚠️ Prefer type aliases over interfaces for pure function types —
//    easier to read, composable with unions/intersections.
type Handler = ((e: Event) => void) | ((e: string) => void);

/* ============================================================
 *  5️⃣ GENERICS (WITH CONSTRAINTS & DEFAULTS)
 * ============================================================ */

// Basic generic
function identity<T>(value: T): T { return value; }

// Constraint — T must have a `length`
function len<T extends { length: number }>(x: T): number { return x.length; }

// Default type parameter
function createArray<T = string>(items: T[] = []): T[] { return items; }

// Multiple type params with constraints
function merge<A extends object, B extends object>(a: A, b: B): A & B {
  return { ...a, ...b };
}

// Const type parameters (TS 5.0+) — infers literal types without `as const`
function tuple<const T extends readonly unknown[]>(...args: T): T { return args; }
const t = tuple("a", "b", "c");  // type: readonly ["a", "b", "c"]

// Generic keyof helper
function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }

/* ============================================================
 *  6️⃣ FUNCTION OVERLOADING — RULES & PITFALLS
 * ============================================================ */

// Overload signatures (no body) + single implementation signature.
// ⚠️ The implementation signature is NOT visible to callers.
function combine(a: number, b: number): number;
function combine(a: string, b: string): string;
function combine(a: any, b: any): any { return a + b; }

combine(10, 20);         // ✅ 30
combine("Type", "Script");// ✅ "TypeScript"
// combine(10, "Script");// ❌ No matching overload

// ⚠️ Overload ordering matters — more specific FIRST
function pick(x: null): "null";
function pick(x: string): "string";
function pick(x: any): string { return x === null ? "null" : typeof x; }
pick(null);              // "null"
pick("hi");              // "string"

// ⚠️ Implementation must be COMPATIBLE with every overload signature
// function bad(a: number): number;      // overload
// function bad(a: string): string;      // overload
// function bad(a: number): number { }   // ❌ implementation not compatible with string

// ⚠️ Prefer generics or unions when possible — overloading adds complexity:
// Instead of 3 overloads, do: function f(x: number | string): number | string

/* ============================================================
 *  7️⃣ HIGHER-ORDER FUNCTIONS
 * ============================================================ */

// A function that takes a function and returns a function
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a));
}
const toString = (n: number) => n.toString();
const exclaim = (s: string) => s + "!";
const pipeline = compose(exclaim, toString);
pipeline(42); // "42!"

// Currying
function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a) => (b) => f(a, b);
}
const addCurried = curry((a: number, b: number) => a + b);
addCurried(1)(2); // 3

// Typing a decorator-like HOF that preserves signature
function withLogging<F extends (...args: any[]) => any>(fn: F): F {
  return ((...args: Parameters<F>) => {
    console.log("called with", args);
    return fn(...args);
  }) as F;
}

/* ============================================================
 *  8️⃣ VOID & NEVER RETURN TYPES
 * ============================================================ */

// void — function completes but returns no meaningful value
function logMessage(msg: string): void { console.log(msg); }

// void in callback position — return value is ignored, ANY value OK
type Callback = () => void;
const c: Callback = () => 42; // ✅ allowed — return value discarded

// never — function never returns (throws or infinite loop)
function throwError(msg: string): never { throw new Error(msg); }
function infinite(): never { while (true) {} }

/* ============================================================
 *  9️⃣ CONSTRUCTOR SIGNATURES (REGULAR + ABSTRACT)
 * ============================================================ */

// Regular construct signature
interface PointCtor { new (x: number, y: number): { x: number; y: number }; }
const Pt: PointCtor = class { constructor(public x: number, public y: number) {} };

// Abstract construct signature (TS 4.2+) — for abstract base classes
abstract class Shape { abstract area(): number; }
type ShapeCtor = abstract new () => Shape;
function makeShape(Ctor: ShapeCtor): Shape { return new (Ctor as any)(); }

// Generic constructor
function create<T>(Ctor: new () => T): T { return new Ctor(); }

/* ============================================================
 *  🔟 ASYNC FUNCTIONS & PROMISES
 * ============================================================ */

async function fetchName(id: number): Promise<string> {
  return `user-${id}`;
}

// Async with typed rejection (never — since Promise rejections are `unknown`)
async function safeFetch(): Promise<string> {
  try { return await fetchName(1); }
  catch (e) { return "fallback"; }  // `e` is `unknown` under strict mode
}

// Async arrow with explicit Promise return
const load = async (): Promise<number> => 42;

// Promise-returning union — flattened by TS
function maybeAsync(x: number): number | Promise<number> { return x; }

/* ============================================================
 *  1️⃣1️⃣ ASSERTION FUNCTIONS
 * ============================================================ */

// Asserts a condition — if it fails, the assertion fn throws
function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? "Assertion failed");
}

// Asserts a value is a specific type
function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}

// Usage: TS narrows the variable after the call
let maybe: unknown = "hello";
assertIsString(maybe);
maybe.toUpperCase(); // ✅ narrowed to string

// ⚠️ Assertion functions must be called on a `const`/`let` with explicit type
//    (not on parameters you assign to). They also can't be arrow-bound
//    when narrowing requires `this` context.

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Excess property checks apply to fresh object literals only
function takeCfg(c: { a: number }) {}
takeCfg({ a: 1, b: 2 }); // ❌ error — object literal
const cfg = { a: 1, b: 2 };
takeCfg(cfg);            // ✅ no error — `cfg` not "fresh"

// ⚠️ Function parameter bivariance (unsound by default)
// Enable "strictFunctionTypes": true in tsconfig to fix.

// ⚠️ Generic functions lose specificity if you annotate at call site:
identity<string>("hi");  // forces T = string

// ⚠️ `arguments` object is not typed well — prefer rest params.

// ⚠️ `Function` type is dangerous — it's like `any` for callables. Avoid.

// ⚠️ Overloads on methods inside classes work the same as top-level.

// 🕒 Version notes
// - TS 3.0  — `unknown` in catch clauses, tuples in rest params
// - TS 3.4  — readonly arrays, `as const`
// - TS 4.0  — variadic tuple types, labeled tuple elements
// - TS 4.1  — template literal types
// - TS 4.2  — abstract construct signatures
// - TS 4.7  — instantiation expressions
// - TS 4.9  — `satisfies`
// - TS 5.0  — const type parameters, decorators (std)
// - TS 5.2  — `using` (explicit resource management)
// - TS 5.4  — `NoInfer<T>`

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature                | Syntax Example                       |
 * ─────────────────────────────────────────────────────────────
 * | Basic fn               | function f(x: T): R {}               |
 * | Arrow                  | const f = (x: T): R => ...           |
 * | Optional               | function f(x?: T)                    |
 * | Default                | function f(x: T = v)                 |
 * | Rest                   | function f(...xs: T[])               |
 * | `this` param           | function f(this: T)                  |
 * | Function type          | type F = (x: T) => R                 |
 * | Call signature         | interface F { (x: T): R }            |
 * | Generic                | function f<T>(x: T): T               |
 * | Constrained generic    | function f<T extends X>(x: T)        |
 * | Const type param       | function f<const T>(x: T)            |
 * | Overloads              | 2+ sigs + 1 impl                     |
 * | HOF                    | (f: (a:A)=>B) => (a:A)=>B            |
 * | void                   | function f(): void                   |
 * | never                  | function f(): never                  |
 * | Constructor sig        | type C = new () => T                 |
 * | Abstract ctor sig      | type C = abstract new () => T        |
 * | Async                  | async function f(): Promise<T>       |
 * | Assertion fn           | asserts x is T                       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer union types over overloads when possible.
 *  - Prefer generics over `any` in HOFs.
 *  - Use `Parameters<F>` / `ReturnType<F>` for HOF signatures.
 *  - Enable `strictFunctionTypes` in tsconfig.
 *  - Never annotate generic args unless you must — let inference work.
 * ============================================================ */