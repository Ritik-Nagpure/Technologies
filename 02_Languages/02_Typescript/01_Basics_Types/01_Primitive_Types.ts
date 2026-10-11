// 03-primitive-types-and-void.ts

/* ============================================================
 *  📘 PRIMITIVE TYPES & VOID — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. number (incl. literals, NaN, Infinity, -0)
 *   2. string (incl. literal types, template literals)
 *   3. boolean (incl. literal true/false, truthiness)
 *   4. null & undefined (incl. strictNullChecks)
 *   5. symbol (incl. Symbol keys, well-known symbols)
 *   6. bigint (incl. rules & limitations)
 *   7. void (incl. void vs undefined)
 *   8. Literal types (bonus section)
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ NUMBER
 * ============================================================ */

// All numbers are 64-bit floats (IEEE 754) — same as JS.
let age: number = 30;
let temp: number = 36.6;
let hex: number = 0xff;         // 255
let bin: number = 0b1010;       // 10
let oct: number = 0o744;        // 484
let sep: number = 1_000_000;    // numeric separators (ES2021)
let exp: number = 1e3;          // 1000

// Special values
let nan: number = NaN;
let inf: number = Infinity;
let negInf: number = -Infinity;
let negZero: number = -0;

// ⚠️ Number rules
// - No integer vs float distinction — both are `number`.
// - Safe integer range: Number.MIN_SAFE_INTEGER .. MAX_SAFE_INTEGER
// - Beyond that, use bigint for precision.
// - `NaN !== NaN` — use Number.isNaN().

/* ============================================================
 *  2️⃣ STRING
 * ============================================================ */

let first: string = "John";
let last: string = 'Doe';
let full: string = `${first} ${last}`;  // template literal
let multi: string = `line1
line2`;                                  // multi-line

// 🔸 String literal types (see section 8)
type Greeting = "hello" | "hi" | "hey";

/* ============================================================
 *  3️⃣ BOOLEAN
 * ============================================================ */

let isActive: boolean = true;
let hasPerm: boolean = false;

// Literal types
let alwaysTrue: true = true;
// alwaysTrue = false; // ❌

// ⚠️ Truthiness: TS won't let you use non-booleans as conditions
//    (unless you use `!!` or explicit comparisons).

/* ============================================================
 *  4️⃣ NULL & UNDEFINED
 * ============================================================ */

let empty: null = null;
let notAssigned: undefined = undefined;

// 🔸 strictNullChecks (tsconfig) — ON in `strict` mode
//    When ON:
//      null and undefined are NOT assignable to other types
//      You must explicitly handle them (or use `!` / narrowing)
//    When OFF:
//      null/undefined are assignable to everything (unsafe)

// 🔸 Optional chaining + nullish coalescing
type MaybeUser = { name?: string } | null;
const u: MaybeUser = null;
const n = u?.name ?? "anon";  // "anon"

/* ============================================================
 *  5️⃣ SYMBOL
 * ============================================================ */

const uid: symbol = Symbol("id");
const uid2: symbol = Symbol("id");
uid === uid2;   // false — each Symbol is unique

// Symbols as object keys
const KEY = Symbol("key");
const obj = { [KEY]: 42 };
obj[KEY];       // 42 — only accessible via the same symbol

// Well-known symbols (typing common ones)
class Coll {
  [Symbol.iterator](): Iterator<number> {
    let n = 0;
    return { next: () => ({ value: n++, done: n > 3 }) };
  }
}
[...new Coll()]; // [0, 1, 2]

// 🔸 unique symbol — for const declarations only
const TOKEN: unique symbol = Symbol("token");
// Type of TOKEN is `typeof TOKEN`, a distinct type
type Token = typeof TOKEN;

// ⚠️ Symbols cannot be used as numeric indices or in JSON.stringify.

/* ============================================================
 *  6️⃣ BIGINT
 * ============================================================ */

let big: bigint = 9007199254740991n;
let big2: bigint = BigInt("12345678901234567890");
let big3: bigint = BigInt(42);

// Arithmetic
big + 1n;       // ✅
// big + 1;     // ❌ cannot mix bigint & number in arithmetic
big * 2n;
big > 1;        // ✅ comparisons allowed across number/bigint

// Conversions
Number(1n);     // 1
BigInt(42);     // 42n

// ⚠️ Bigint limitations
// - Cannot be used with Math.* methods
// - Cannot mix with number in arithmetic (except comparisons)
// - No JSON.stringify support
// - Requires target ES2020+ in tsconfig

/* ============================================================
 *  7️⃣ VOID
 * ============================================================ */

function logMessage(msg: string): void { console.log(msg); }

// void callback can return anything — return is ignored
type Cb = () => void;
const c: Cb = () => 42;  // ✅

// ⚠️ void vs undefined
// void      — TYPE for "no return value"; only meaningful as fn return
// undefined — VALUE (and also a type)
let u1: undefined = undefined;
// let v1: void = undefined;   // ✅ technically allowed but useless
// let v2: void = "hello";     // ❌

// ⚠️ void-returning function != function returning undefined
function f1(): void {}
function f2(): undefined { return; }
// Both called the same way, but typed differently.

/* ============================================================
 *  8️⃣ LITERAL TYPES (BONUS)
 * ============================================================ */

// A literal type is a type with exactly ONE value.
type Direction = "north" | "south" | "east" | "west";
type One = 1;
type Yes = true;

// Combined with `as const` — see type-assertions notes.

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `NaN` and `-0` are edge cases — use Number.isNaN / Object.is.
// ⚠️ `number` is NOT an integer — always validate integer inputs with
//    Number.isInteger.
// ⚠️ bigint + JSON.stringify throws — stringify manually.
// ⚠️ Symbols don't appear in Object.keys / for..in — use
//    Object.getOwnPropertySymbols.
// ⚠️ Under strictNullChecks, `undefined` is NOT assignable to optional
//    params unless you use `?` or `| undefined`.

// 🕒 Version notes
// - bigint supported from TS 3.2 (target ES2020)
// - numeric separators (1_000) from TS 2.7
// - strictNullChecks since TS 2.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Type      | Example                 | Notes                    |
 * ─────────────────────────────────────────────────────────────
 * | number    | 30, 36.6, 0xff, 1_000   | 64-bit float             |
 * | string    | "a", 'a', `a`           | Template literals OK     |
 * | boolean   | true, false             | Literal types allowed    |
 * | null      | null                    | Intentional empty        |
 * | undefined | undefined               | Not yet assigned         |
 * | symbol    | Symbol("id")            | Unique, immutable        |
 * | unique sym| const X = Symbol()      | distinct type            |
 * | bigint    | 9007199254740991n       | ES2020+ required         |
 * | void      | function f(): void {}   | Only fn return           |
 * | literal   | "dark", 1, true         | One-value type           |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Enable "strict": true (includes strictNullChecks).
 *  - Prefer literal types over string for small closed sets.
 *  - Use bigint only when int precision beyond 2^53 is needed.
 *  - Avoid `void` return in anything other than callbacks/actions.
 *  - Validate runtime numbers — TS `number` ≠ integer.
 * ============================================================ */