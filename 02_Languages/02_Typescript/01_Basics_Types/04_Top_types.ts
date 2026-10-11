// 06-never-type.ts

/* ============================================================
 *  📘 THE `never` TYPE — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. What `never` is
 *   2. Throwing functions
 *   3. Infinite loops
 *   4. Exhaustive checks
 *   5. `never` in utility & conditional types
 *   6. Distributive conditional types
 *   7. `Promise<never>` & infinite pending
 *   8. Assertion functions returning `never`
 *   9. `never` vs `void` vs `any` vs `unknown`
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS `never`?
 * ============================================================ */

// `never` is the BOTTOM type — the "empty set" of types.
// No value can be assigned to `never` (except another `never`).
// Every other type is assignable TO `never`? → NO.
// `never` is assignable to every other type? → YES.

// 🧠 Use cases:
//   - Functions that always throw
//   - Functions that loop forever
//   - Exhaustive switches / unreachable code
//   - Utility types (Exclude, NonNullable)

/* ============================================================
 *  2️⃣ THROWING FUNCTIONS
 * ============================================================ */

function throwError(msg: string): never {
  throw new Error(msg);
}

/* ============================================================
 *  3️⃣ INFINITE LOOPS
 * ============================================================ */

function infinite(): never {
  while (true) { /* forever */ }
}

/* ============================================================
 *  4️⃣ EXHAUSTIVE CHECKS
 * ============================================================ */

type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle": return Math.PI * 1 * 1;
    case "square": return 1 * 1;
    default:
      // If a new shape is added and NOT handled above, TS errors here.
      const exhaustive: never = shape;
      return exhaustive;
  }
}

// When you add "triangle" to the union, TS errors on the default branch.

/* ============================================================
 *  5️⃣ `never` IN UTILITY & CONDITIONAL TYPES
 * ============================================================ */

// Exclude<T, U> — removes U from union (uses never)
type E = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"

// Conditional types can produce `never`
type OnlyStrings<T> = T extends string ? T : never;
type OnlyStr = OnlyStrings<"a" | 1 | "b">; // "a" | "b"

// NonNullable uses never internally
type NN = NonNullable<string | null | undefined>;  // string

/* ============================================================
 *  6️⃣ DISTRIBUTIVE CONDITIONAL TYPES
 * ============================================================ */

// Conditional types distribute over unions.
// `never` is the identity element of union: `T | never === T`.
// So `Foo<never>` collapses depending on context.

type Distribute<T> = T extends any ? T[] : never;
type D = Distribute<"a" | "b">;   // "a"[] | "b"[]

// To PREVENT distribution, wrap in a tuple:
type NoDistribute<T> = [T] extends [any] ? T[] : never;
type ND = NoDistribute<"a" | "b">;  // ("a" | "b")[]

/* ============================================================
 *  7️⃣ Promise<never> — INFINITE PENDING
 * ============================================================ */

// A Promise that never resolves/rejects (e.g., stalled fetch).
const pending: Promise<never> = new Promise(() => {});

// Async function that throws → return type is `Promise<never>`
async function alwaysThrows(): Promise<never> {
  throw new Error("nope");
}

/* ============================================================
 *  8️⃣ ASSERTION FUNCTIONS RETURNING `never`
 * ============================================================ */

function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throwError("not a string");
}

const maybe: unknown = "hello";
assertIsString(maybe);
maybe.toUpperCase();

/* ============================================================
 *  9️⃣ `never` vs `void` vs `any` vs `unknown`
 * ============================================================ */

// | Type    | Meaning                                    |
// | ------- | ------------------------------------------ |
// | void    | Function completes with no useful value    |
// | never   | Function NEVER completes (throws/loops)    |
// | any     | Any type, disables checking                |
// | unknown | Any type, must narrow before use           |

/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `never` is assignable to EVERY type, but no type is assignable to `never`.
// ⚠️ `let x: never = ...` is almost always wrong — nothing fits.
// ⚠️ Don't confuse `never` with `void` — see table above.
// ⚠️ If a switch lacks a `default`, the `never` check can't protect you.
// ⚠️ `never` in mapped types removes keys: { [K in keyof T as ...]: never }
//    is a common "filter out" pattern.

// 🕒 Version notes
// - `never` has been in TS since 1.0
// - Improved inference in TS 2.8 (conditional types)
// - Distributive behavior refined over many versions

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Situation                          | Return type         |
 * ─────────────────────────────────────────────────────────────
 * | Always throws                      | never               |
 * | Infinite loop                      | never               |
 * | Assertion fn (asserts x is T)      | (void at signature) |
 * | Async always-throws                | Promise<never>      |
 * | Union with never                   | never disappears    |
 * | Intersection with never            | collapses to never  |
 * | Conditional producing no branch    | never               |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use `never` in `default` of exhaustive switches.
 *  - Use `never` for functions that always throw.
 *  - Never use `never` as a variable type (except in edge generic logic).
 *  - Prefer `unknown` when you MEAN "unknown input".
 *  - Use Exclude / NonNullable rather than hand-rolled never-based types.
 * ============================================================ */