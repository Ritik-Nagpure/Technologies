// 05-any-unknown.ts

/* ============================================================
 *  📘 ANY vs UNKNOWN — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. `any` — behavior & dangers
 *   2. `unknown` — behavior & safety
 *   3. Side-by-side comparison
 *   4. Narrowing `unknown` (typeof, instanceof, custom guards)
 *   5. Assertions vs narrowing
 *   6. Variance & generics interactions
 *   7. `unknown` in catch clauses & Promise rejections
 *   8. Config flags & lint rules
 *   9. Best practices & when to use each
 *  10. Version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ ANY
 * ============================================================ */

// `any` opts OUT of type checking for the value.
let rawData: any;

rawData = 42;
rawData = "hello";
rawData = { x: 1 };

// No errors even if rawData isn't a string:
// rawData.toUpperCase();
// rawData.nonExistentMethod();
// rawData();

// 🔸 `any` is CONTAGIOUS — it propagates
let a: any = "hello";
let b = a;         // b is `any`
let c = b + 1;     // still `any`

// 🔸 Assignment both ways
let num: number = 5;
let anything: any = "a string";
num = anything;    // ✅ no error (unsafe)
anything = num;    // ✅

// 🔸 Generic `any`
function badIdentity<T>(x: T): T { return x; }   // fine — but T may be any
badIdentity<any>("hi");                           // explicitly any

/* ============================================================
 *  2️⃣ UNKNOWN
 * ============================================================ */

// `unknown` accepts any value — but you must NARROW before use.
let input: unknown = "TypeScript";

// input.toUpperCase();  // ❌ error — must narrow first

if (typeof input === "string") {
  input.toUpperCase();  // ✅ narrowed
}

/* ============================================================
 *  3️⃣ SIDE-BY-SIDE
 * ============================================================ */

// | Operation                      | any        | unknown      |
// | ------------------------------- | ---------- | ------------ |
// | Accept any value                | ✅          | ✅            |
// | Read/use directly               | ✅          | ❌ error      |
// | Call / index / new              | ✅          | ❌ error      |
// | Assign into typed variables     | ✅ (unsafe) | ❌ error      |
// | Must narrow before use          | ❌          | ✅            |
// | Recommended for user input      | ❌          | ✅            |
// | Recommended for legacy JS       | ✅ sparingly| ✅            |

/* ============================================================
 *  4️⃣ NARROWING UNKNOWN
 * ============================================================ */

function process(v: unknown): string {
  if (typeof v === "number") return v.toFixed(2);
  if (typeof v === "string") return v.toUpperCase();
  if (Array.isArray(v)) return `array(${v.length})`;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object" && v !== null) return Object.keys(v).join(",");
  if (typeof v === "bigint") return v.toString();
  if (typeof v === "symbol") return v.description ?? "sym";
  return "unknown";
}

// 🔸 Custom type guard
function isUser(v: unknown): v is { name: string; age: number } {
  return (
    typeof v === "object" &&
    v !== null &&
    "name" in v &&
    "age" in v &&
    typeof (v as any).name === "string"
  );
}

const maybe: unknown = { name: "Ravi", age: 25 };
if (isUser(maybe)) {
  maybe.name;  // ✅ typed
}

/* ============================================================
 *  5️⃣ ASSERTIONS vs NARROWING
 * ============================================================ */

// Assertion — no runtime check:
const asserted = input as string;
asserted.toUpperCase();  // ✅ compiles, no guarantee

// Assertion function — runtime check + narrowing:
function assertStr(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}
assertStr(input);
input.toUpperCase();     // ✅ narrowed because we KNOW it threw otherwise

/* ============================================================
 *  6️⃣ VARIANCE & GENERICS
 * ============================================================ */

// `any` is bivariant — silently makes generics unsafe.
// `unknown` is contravariant-safe — you must narrow to use it.
// Prefer `unknown` in generic defaults:
function log<T = unknown>(value: T): T { return value; }

// `noImplicitAny` catches accidental `any` in params.

/* ============================================================
 *  7️⃣ UNKNOWN IN CATCH & PROMISES
 * ============================================================ */

// Since TS 4.4 / 4.0:
// - `catch (e)` gives `e: unknown` under `useUnknownInCatchVariables`.
// - Promise rejection reasons are `any` (be careful).

try {
  throw new Error("boom");
} catch (e) {
  if (e instanceof Error) console.log(e.message);
  else console.log("unknown error", e);
}

/* ============================================================
 *  8️⃣ CONFIG FLAGS & LINT RULES
 * ============================================================ */

// tsconfig.json:
// {
//   "compilerOptions": {
//     "strict": true,                              // includes noImplicitAny
//     "noImplicitAny": true,
//     "useUnknownInCatchVariables": true
//   }
// }
//
// ESLint:
//   @typescript-eslint/no-explicit-any — flags every explicit `any`

/* ============================================================
 *  9️⃣ BEST PRACTICES
 * ============================================================ */

// ✅ Prefer `unknown` over `any` whenever the type is truly unknown.
// ✅ Reserve `any` for:
//      - gradual migration from JS
//      - third-party libs without types
//      - extremely short-lived placeholders
// ✅ Never let `any` appear in PUBLIC API signatures — use generics.
// ✅ Prefer `unknown` + narrowing + custom guards over assertions.
// ✅ Use `unknown` in function parameters that accept anything.

/* ============================================================
 *  🔟 VERSION NOTES
 * ============================================================ */

// - TS 3.0  — `unknown` introduced
// - TS 4.0  — `unknown` in catch clauses (opt-in)
// - TS 4.4  — `useUnknownInCatchVariables` under strict
// - TS 4.9  — `satisfies` enables type-safe narrowing without as any

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Question                             | any | unknown |
 * ─────────────────────────────────────────────────────────────
 * | Can hold any value?                  | ✅  | ✅      |
 * | Can be used without narrowing?       | ✅  | ❌      |
 * | Can be assigned to a typed variable? | ✅  | ❌      |
 * | Safe against runtime errors?         | ❌  | ✅      |
 * | Propagates to derived variables?     | ✅  | ❌      |
 * | Recommended for input validation?    | ❌  | ✅      |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 RULE OF THUMB
 *   When in doubt, use `unknown`. Reach for `any` only when you
 *   genuinely need to bypass the type system, and scope it tightly.
 * ============================================================ */