// 07-type-assertions.ts

/* ============================================================
 *  📘 TYPE ASSERTIONS & RELATED OPERATORS — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. `as` — type assertion
 *   2. `<T>` — angle-bracket assertion
 *   3. `as unknown as T` — double assertion
 *   4. `as any` — the dangerous escape hatch
 *   5. `as const` — readonly + literal inference
 *   6. Non-null assertion `!`
 *   7. `satisfies`
 *   8. Assertion functions (`asserts x is T`)
 *   9. `import type` / `export type`
 *  10. Runtime conversions (what assertions are NOT)
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ `as <type>` — TYPE ASSERTION
 * ============================================================ */

// Tells TS to treat a value as a specific type during type checking.
// Does NOT change runtime structure — purely compile-time.

let value: unknown = "Hello TypeScript";
let strLen = (value as string).length;

/* ============================================================
 *  2️⃣ `<type>` — ANGLE-BRACKET ASSERTION
 * ============================================================ */

// Only works in .ts files — conflicts with JSX in .tsx.
let another: unknown = "Another";
let altLen = (<string>another).length;

/* ============================================================
 *  3️⃣ `as unknown as T` — DOUBLE ASSERTION
 * ============================================================ */

// Bypasses incompatible types that a single `as` would reject.
let n = 42 as unknown as string;
// n.toUpperCase(); // ✅ compiles, crashes at runtime

// 🔸 Common use: casting between unrelated structural types.
const event = {} as unknown as MouseEvent;

/* ============================================================
 *  4️⃣ `as any` — DANGEROUS ESCAPE HATCH
 * ============================================================ */

let risky: unknown = "123";
let unchecked = (risky as any).toUpperCase();

// ⚠️ Only use when you have no other option (legacy JS interop).
//    Prefer `unknown` + narrowing.

/* ============================================================
 *  5️⃣ `as const` — READONLY + LITERAL INFERENCE
 * ============================================================ */

const config = { mode: "dark", version: 1 } as const;
// config.mode = "light"; // ❌ readonly
// typeof config.mode === "dark"

const arr = [1, 2, 3] as const;  // readonly [1, 2, 3]

// 🔸 Without `as const`:
const loose = { mode: "dark" };     // typeof mode === string
// 🔸 With `as const`:
const tight = { mode: "dark" } as const; // typeof mode === "dark"

// 🔸 `as const` on arrays → readonly tuple
// 🔸 `as const` on enum-like values → great for discriminated unions

/* ============================================================
 *  6️⃣ NON-NULL ASSERTION `!`
 * ============================================================ */

function getElement(id: string): number | null { return Number(id); }

const el = getElement("8")!;   // tells TS `el` is not null
el.toFixed(2);                 // ✅

// Chained usage
// document.getElementById("name")!.value = "Ravi";

// ⚠️ No runtime check — if it's null, you crash.

/* ============================================================
 *  7️⃣ `satisfies` (TS 4.9+)
 * ============================================================ */

// Ensures a value MATCHES a type WITHOUT changing the inferred type.
type Settings = {
  theme: "light" | "dark";
  notifications: boolean;
};

const settings = {
  theme: "dark",
  notifications: true,
  // unknownProp: 0,  // ❌ errors — not in Settings
} satisfies Settings;

// settings.theme is still "dark" (literal), not "light" | "dark".
// Compare with:
const annotated: Settings = { theme: "dark", notifications: true };
// annotated.theme is "light" | "dark" (widened).

// 🔸 Real-world: config objects with exact keys, keeping precision
const palette = {
  red:   [255, 0, 0],
  green: [0, 255, 0],
  blue:  [0, 0, 255],
} satisfies Record<string, [number, number, number]>;
// palette.red is [number, number, number], not number[]

/* ============================================================
 *  8️⃣ ASSERTION FUNCTIONS — `asserts x is T`
 * ============================================================ */

function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}

let maybe: unknown = "hello";
assertIsString(maybe);
maybe.toUpperCase();  // ✅ narrowed

// `asserts condition`
function assert(cond: unknown): asserts cond {
  if (!cond) throw new Error("assertion failed");
}

// ⚠️ Rules:
// - Cannot be arrow functions (must be a function declaration or method)
// - The asserted variable must have an explicit type annotation
// - The function must be called with a variable/const, not a complex expr

/* ============================================================
 *  9️⃣ `import type` / `export type`
 * ============================================================ */

// Type-only imports — erased at compile time, no runtime import
// import type { User } from "./types";
// export type { User };

// Inline form
// import { type User, greet } from "./mod";

// Benefits:
// - Avoids bundling unused imports
// - Prevents circular import issues
// - Works with `isolatedModules`

/* ============================================================
 *  🔟 RUNTIME CONVERSIONS (WHAT ASSERTIONS ARE NOT)
 * ============================================================ */

// ⚠️ `as` is NOT a conversion. It doesn't parse, cast, or transform.
// To actually convert values at runtime, use:
Number("42");        // 42
String(42);          // "42"
Boolean(0);          // false
parseInt("10", 10);  // 10
parseFloat("3.14");  // 3.14
JSON.parse("{}");    // {}
// "5" as unknown as number === "5" // still a string at runtime!

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Assertions are erased at compile time — no runtime effect.
// ⚠️ Use `unknown` bridges when types don't overlap.
// ⚠️ `!` disables null checks — overuse hides bugs.
// ⚠️ Prefer `satisfies` over `as` when you want validation without widening.
// ⚠️ Prefer `satisfies` over `:` when you want to KEEP literal types.
// ⚠️ Assertion functions can't be arrow functions when narrowing `this`.
// ⚠️ `<T>x` is illegal in .tsx files — use `x as T`.

// 🕒 Version notes
// - TS 3.4  — `as const`
// - TS 3.7  — assertion functions (asserts x)
// - TS 4.9  — `satisfies`
// - TS 5.0  — improved const type parameters

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Syntax              | Purpose                                | Runtime |
 * ─────────────────────────────────────────────────────────────
 * | x as T              | Assert value is T                      | None    |
 * | <T>x                | Same (not in .tsx)                     | None    |
 * | x as unknown as T   | Force assertion across gaps            | None    |
 * | x as any            | Disable type checking                  | None    |
 * | x as const          | Deep readonly + literal types          | None    |
 * | x!                  | Assert non-null                        | None    |
 * | x satisfies T       | Check against T without widening       | None    |
 * | asserts x is T      | Runtime check + narrowing              | Yes     |
 * | import type { X }   | Type-only import (erased)              | None    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer `satisfies` over `as` when possible.
 *  - Prefer `unknown` + narrowing over `as any`.
 *  - Use `as const` for frozen literals and tuples.
 *  - Use `!` sparingly — assertions hide bugs.
 *  - Use `import type` in libraries and when isolatedModules is on.
 *  - Never rely on `as` for runtime conversion — use Number/String/JSON.
 * ============================================================ */