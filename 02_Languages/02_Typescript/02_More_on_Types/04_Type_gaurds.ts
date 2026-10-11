// type-guards-and-narrowing-complete.ts

/* ============================================================
 *  📘 TYPE GUARDS & TYPE NARROWING — COMPLETE COVERAGE
 *
 *  Type guards NARROW the type of a variable inside a block.
 *  Narrowing = TypeScript narrowing the type of a value based
 *  on control-flow analysis (if/switch/ternary/logical ops).
 *
 *  Sections:
 *   1. typeof guard
 *   2. instanceof guard
 *   3. Equality / discriminant narrowing (===, !==, ==, !=)
 *   4. Truthiness narrowing
 *   5. `in` operator guard
 *   6. Type predicates (`x is T`)
 *   7. Assertion functions (`asserts x is T`)
 *   8. Custom guards for complex types
 *   9. `switch` with exhaustiveness (`never`)
 *  10. Narrowing with `Array.isArray`
 *  11. Narrowing with `null` / `undefined` (optional chaining, `??`)
 *  12. Narrowing inside callbacks (const binding caveat)
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ TYPEOF GUARD
 * ============================================================ */

// `typeof` returns one of: "string", "number", "boolean", "bigint",
// "symbol", "undefined", "object", "function".
// ⚠️ Note: `typeof null === "object"` — special case.

function printValue(val: string | number) {
  if (typeof val === "string") {
    console.log("String value:", val.toUpperCase());  // val: string
  } else {
    console.log("Number value:", val.toFixed(2));     // val: number
  }
}

// 🔸 typeof with boolean / symbol / function
function describe(x: string | boolean | (() => void) | symbol) {
  if (typeof x === "string") x.toUpperCase();
  else if (typeof x === "boolean") x.valueOf();
  else if (typeof x === "function") x();
  else x.description;   // symbol
}

// ⚠️ `typeof null === "object"` — always check null explicitly:
function maybeObj(v: object | null) {
  if (typeof v === "object" && v !== null) {
    // v narrowed to non-null object
  }
}

/* ============================================================
 *  2️⃣ INSTANCEOF GUARD
 * ============================================================ */

class Dog { bark() { console.log("Woof!"); } }
class Cat { meow() { console.log("Meow!"); } }

function handlePet(pet: Dog | Cat) {
  if (pet instanceof Dog) pet.bark();
  else pet.meow();
}

// 🔸 instanceof with built-ins
function checkDate(x: unknown) {
  if (x instanceof Date) return x.toISOString();   // x: Date
  if (x instanceof Error) return x.message;        // x: Error
  if (x instanceof Map) return x.size;             // x: Map<unknown, unknown>
  if (x instanceof Set) return x.size;
  return "unknown";
}

// ⚠️ instanceof requires the right-hand side to be a constructor.
// ⚠️ Cross-realm objects (iframes, vm) fail instanceof — use branded checks.

/* ============================================================
 *  3️⃣ EQUALITY / DISCRIMINANT NARROWING
 * ============================================================ */

// Discriminated unions use a literal-tagged property (role, kind, type).

type Admin = { role: "admin"; privileges: string[] };
type User  = { role: "user";  email: string };

function getRole(person: Admin | User) {
  if (person.role === "admin") console.log(person.privileges);  // Admin
  else console.log(person.email);                                // User
}

// 🔸 === / !== / == / != all narrow
function cmp(a: string | number, b: string | number) {
  if (a === b) {
    // both narrowed to same type inside
  }
}

// 🔸 Switch on discriminant (exhaustive-friendly)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rect"; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    case "rect":   return s.w * s.h;
  }
}

/* ============================================================
 *  4️⃣ TRUTHINESS NARROWING
 * ============================================================ */

// Removes null, undefined, 0, "", false, NaN from the type.
function processInput(input?: string) {
  if (input) console.log(input.trim());   // input: string
  else console.log("No input");
}

// 🔸 Truthiness with objects removes null/undefined
function handleObj(o: object | null | undefined) {
  if (o) {
    // o narrowed to object
  }
}

// ⚠️ Truthiness also drops 0, "", false — sometimes you ONLY want to
//    drop null/undefined. Use explicit checks instead:
function careful(x: number | null | undefined) {
  if (x != null) {           // drops BOTH null and undefined, keeps 0
    console.log(x.toFixed(2));
  }
}

/* ============================================================
 *  5️⃣ `in` OPERATOR GUARD
 * ============================================================ */

// Checks whether a property EXISTS on an object.

type Fish2 = { swim: () => void };
type Bird2 = { fly: () => void };

function move1(a: Fish2 | Bird2) {
  if ("swim" in a) a.swim();   // a: Fish2
  else a.fly();                // a: Bird2
}

// 🔸 `in` works on unions of object types
type A = { a: number };
type B = { b: string };
type C = { c: boolean };
function handle(x: A | B | C) {
  if ("a" in x) x.a.toFixed();
  else if ("b" in x) x.b.toUpperCase();
  else x.c.valueOf();
}

// ⚠️ `in` can only be used when the right operand is an object type.
// ⚠️ It checks the PROTOTYPE chain too — `'toString' in {}` is true.

/* ============================================================
 *  6️⃣ TYPE PREDICATES (`x is T`)
 * ============================================================ */

// A function whose RETURN TYPE is `arg is Type`.
// Tells TS: "if this returns true, arg is Type".

function isFish(animal: Fish2 | Bird2): animal is Fish2 {
  return (animal as Fish2).swim !== undefined;
}

function move(animal: Fish2 | Bird2) {
  if (isFish(animal)) animal.swim();  // narrowed to Fish2
  else animal.fly();                  // narrowed to Bird2
}

// 🔸 Custom guard for object shape
function isUser(v: unknown): v is { name: string; age: number } {
  return (
    typeof v === "object" && v !== null &&
    "name" in v && "age" in v
  );
}

// 🔸 Predicates with arrays
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/* ============================================================
 *  7️⃣ ASSERTION FUNCTIONS (`asserts x is T`)
 * ============================================================ */

// Like a predicate but instead of returning boolean, it THROWS if false.
// After the call, TS narrows the variable.

function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}

let maybe: unknown = "hello";
assertIsString(maybe);
maybe.toUpperCase();   // ✅ narrowed

// 🔸 Asserts truthiness only (`asserts x`)
function assert(cond: unknown): asserts cond {
  if (!cond) throw new Error("assertion failed");
}

// ⚠️ Assertion functions must be function declarations or methods
//    (cannot be arrow functions if narrowing `this`).
// ⚠️ Cannot call on complex expressions — must be a variable/const.

/* ============================================================
 *  8️⃣ CUSTOM GUARDS FOR COMPLEX TYPES
 * ============================================================ */

// Recursive guard
type JSONValue =
  | string | number | boolean | null
  | JSONValue[]
  | { [k: string]: JSONValue };

function isJSON(v: unknown): v is JSONValue {
  if (v === null) return true;
  const t = typeof v;
  if (t === "string" || t === "number" || t === "boolean") return true;
  if (Array.isArray(v)) return v.every(isJSON);
  if (t === "object") return Object.values(v as object).every(isJSON);
  return false;
}

// Guard for a branded/nominal type
type UserID = string & { __brand: "UserID" };
function toUserID(s: string): UserID {
  if (!s.startsWith("U")) throw new Error("bad id");
  return s as UserID;
}

/* ============================================================
 *  9️⃣ SWITCH + EXHAUSTIVENESS WITH `never`
 * ============================================================ */

function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

type Event =
  | { type: "click"; x: number; y: number }
  | { type: "key"; key: string };

function onEvent(e: Event): void {
  switch (e.type) {
    case "click": handleClick(e); break;
    case "key":   handleKey(e);   break;
    default:      assertNever(e);         // ✅ compile-time exhaustiveness
  }
}
function handleClick(e: { x: number; y: number }) {}
function handleKey(e: { key: string }) {}

/* ============================================================
 *  🔟 Array.isArray NARROWING
 * ============================================================ */

// Narrows to `unknown[]` / `any[]` — refine further with element checks.
function sum(x: number | number[]) {
  if (Array.isArray(x)) return x.reduce((a, b) => a + b, 0);
  return x;
}

// Combine with element-type guard for strong narrowing:
function sum2(x: number | number[]) {
  if (Array.isArray(x) && x.every((n) => typeof n === "number")) {
    return (x as number[]).reduce((a, b) => a + b, 0);
  }
  return x as number;
}

/* ============================================================
 *  1️⃣1️⃣ NARROWING WITH null / undefined
 * ============================================================ */

type Profile = { name?: string | null; age?: number };

function describeProfile(p: Profile): string {
  // Optional chaining + nullish coalescing
  const n = p.name ?? "anon";
  const a = p.age ?? 0;
  return `${n} (${a})`;
}

// 🔸 Non-null assertion (`!`) — no runtime check
function getEl(): HTMLElement | null { return null; }
// const el = getEl()!;
// el.innerHTML = "hi";     // compiles; crashes if null at runtime

// 🔸 Prefer explicit null checks over `!`
const el = getEl();
if (el !== null) el.innerHTML = "hi";

/* ============================================================
 *  1️⃣2️⃣ NARROWING INSIDE CALLBACKS — CONST BINDING CAVEAT
 * ============================================================ */

// TS CANNOT narrow `let` variables across callback boundaries
// (they could be reassigned before the callback runs).
function example(x: string | null) {
  if (x !== null) {
    // x narrowed to string here
    [1].forEach(() => {
      // x is STILL string inside — closure captures the narrowed value
      // only when x is `const` OR effectively const (never reassigned).
      x.toUpperCase();
    });
  }
}

// 🔸 If narrowing is lost inside a callback, assign to a const first:
function example2(x: string | null) {
  if (x === null) return;
  const y = x;                // y: string (stable)
  [1].forEach(() => y.toUpperCase());
}

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `typeof null === "object"` — always pair with a null check.
// ⚠️ `instanceof` fails across realms (iframes, workers).
// ⚠️ Type predicates are TRUSTED — you must implement the runtime check
//    correctly, or you'll silently lie to TS.
// ⚠️ Assertion functions must be function declarations (not arrow fns).
// ⚠️ `in` walks the prototype chain — check `Object.hasOwn` for own props.
// ⚠️ Truthiness drops 0, "", false — use `!= null` when you only want to
//    drop null/undefined.
// ⚠️ Narrowing is lost across `let` reassignment boundaries — bind to const.
// ⚠️ Narrowing does NOT survive callbacks on `let` variables under strict mode.
// ⚠️ `Array.isArray` narrows to `any[]` for `unknown` inputs — refine further.
// ⚠️ Exhaustive switch: forget the `default: assertNever(x)` and TS is silent
//    when a case is missing (unless `noImplicitReturns` is on).

// 🕒 Version notes
// - Type predicates (`x is T`): TS 1.6
// - Assertion functions (`asserts x is T`): TS 3.7
// - `unknown` in catch: TS 4.4 (under strict)
// - Control-flow improvements across closures: ongoing

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Guard               | Use for                              |
 * ─────────────────────────────────────────────────────────────
 * | typeof x === "..."  | primitives                           |
 * | x instanceof C      | class instances / built-ins          |
 * | x === y / switch    | literal discriminants (tagged unions) |
 * | if (x) / if (!x)    | truthiness (drops null, 0, "", false) |
 * | x != null           | drop null/undefined only             |
 * | "prop" in x         | presence of property                 |
 * | Array.isArray(x)    | arrays                               |
 * | fn(x): x is T       | custom predicate                     |
 * | fn(x): asserts x is T | assertion function (throws)        |
 * | never + assertNever | exhaustiveness check                 |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer discrimination with literal tags over `as` casts.
 *  - Prefer narrow, composable predicates over giant `if` chains.
 *  - Always handle the `else` branch — TS is happier, and you'll catch bugs.
 *  - Use `assertNever` in switch defaults for exhaustiveness.
 *  - Use assertion functions only when the check is trivial and sure.
 *  - Prefer `unknown` over `any` in guard inputs — forces narrowing.
 *  - Bind narrowed values to `const` if used inside callbacks.
 *  - Never use `!` to silence the compiler — check explicitly.
 *
 * 🎯 SUMMARY
 *  - typeof      → primitives
 *  - instanceof  → class instances
 *  - equality    → literal discriminants
 *  - truthiness  → null/undefined
 *  - in          → property presence
 *  - predicates  → custom, reusable guards
 *  - asserts     → throwing guards (narrow caller scope)
 * ============================================================ */