// 02-jsdoc-and-typechecking.js

/* ============================================================
 *  📘 JSDOC IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. What JSDoc does
 *   2. Enabling type checking
 *   3. Common tags (full table)
 *   4. @param / @returns / @type / @typedef / @template
 *   5. Generics with constraints
 *   6. @callback & @overload
 *   7. @import (TS 5.5+) — type imports in JS
 *   8. @this, @satisfies, @deprecated
 *   9. Emitting .d.ts from JS
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

// @ts-check
// Enables type checking for this JS file.
// To opt-out project-wide: // @ts-nocheck

/* ============================================================
 *  1️⃣ WHAT JSDOC DOES
 * ============================================================
 *
 *  ✅ Documents code — describes functions, params, returns, classes.
 *  ✅ Enables type checking — with // @ts-check in plain .js files.
 *  ✅ Editor support — autocomplete, tooltips, inline docs (VS Code).
 *  ✅ Generates HTML docs — via the `jsdoc` CLI tool.
 *  ✅ Emits .d.ts — via tsc with "declaration": true + "allowJs": true.
 *
 *  ─────────────────────────────────────────────────────────────
 *  📌 COMMON TAGS
 *  ─────────────────────────────────────────────────────────────
 *  | Tag         | Purpose                                       |
 *  ─────────────────────────────────────────────────────────────
 *  | @param      | Describes a function parameter                |
 *  | @returns    | Describes the return value                    |
 *  | @typedef    | Defines a custom type                         |
 *  | @type       | Declares the type of a variable               |
 *  | @template   | Declares a generic type parameter             |
 *  | @callback   | Defines a function type                       |
 *  | @overload   | Declares an overload signature                |
 *  | @this        | Types the `this` value                        |
 *  | @satisfies  | TS 5.x — validates against a type            |
 *  | @import     | TS 5.5+ — imports types into JS files        |
 *  | @example    | Provides usage examples                       |
 *  | @deprecated | Marks code as outdated                        |
 *  | @see        | References related docs                       |
 *  | @readonly   | Marks a property read-only                    |
 *  | @enum       | Declares an enum-like object                  |
 *  | @extends    | Type inheritance                              |
 *  | @implements | Interface implementation                      |
 *  | @private    | Access modifier                               |
 *  | @public     | Access modifier                               |
 *  | @protected  | Access modifier                               |
 *  ─────────────────────────────────────────────────────────────
 */

/* ============================================================
 *  2️⃣ ENABLING TYPE CHECKING
 * ============================================================
 *
 *  Per-file:      // @ts-check
 *  Opt-out:       // @ts-nocheck
 *  Per-project:   tsconfig.json → { "compilerOptions": {
 *                     "allowJs": true, "checkJs": true, "noEmit": true } }
 *  CLI:           npx tsc --allowJs --checkJs --noEmit file.js
 */

/* ============================================================
 *  3️⃣ @param / @returns / @type / @typedef
 * ============================================================ */

/**
 * Adds two numbers.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The sum.
 */
function add(a, b) { return a + b; }

// Optional + default
/**
 * @param {string} name
 * @param {string} [title] - Optional title.
 * @param {number} [age=18] - Default age.
 */
function greet(name, title, age = 18) { return `${title ?? ""} ${name} (${age})`; }

// Variable type
/** @type {string} */
let username = "Ravi";
// username = 42; // ❌ error

// Custom type via @typedef
/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 * @property {boolean} [isAdmin] - optional
 */
/** @type {User} */
const user = { name: "Ravi", age: 25 };

// Union types
/**
 * @param {string | number} id
 * @returns {string}
 */
function formatId(id) { return `ID-${id}`; }

// Function type via @type
/** @type {(a: number, b: number) => number} */
const mul = (a, b) => a * b;

/* ============================================================
 *  4️⃣ @template — GENERICS
 * ============================================================ */

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function identity(value) { return value; }

// Generic with constraint
/**
 * @template {string | number} T
 * @param {T} x
 * @returns {T}
 */
function same(x) { return x; }

/* ============================================================
 *  5️⃣ @callback — FUNCTION TYPES
 * ============================================================ */

/**
 * @callback Comparator
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */

/** @type {Comparator} */
const asc = (a, b) => a - b;

/* ============================================================
 *  6️⃣ @overload — DECLARING OVERLOADS IN JS
 * ============================================================ */

/**
 * @overload
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
/**
 * @overload
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
/**
 * @param {number | string} a
 * @param {number | string} b
 * @returns {number | string}
 */
function combine(a, b) { return /** @type {any} */ (a) + b; }

/* ============================================================
 *  7️⃣ @import — TYPES IN JS FILES (TS 5.5+)
 * ============================================================ */

// Import a type from a .ts file without a runtime import:
// /**
//  * @import { User } from "./types"
//  * @import { Product as P } from "./models/product"
//  */
// Then use User/P directly as JSDoc types: /** @type {User} */

/* ============================================================
 *  8️⃣ @this / @satisfies / @deprecated
 * ============================================================ */

/**
 * @this {{ name: string }}
 * @returns {string}
 */
function getName() { return this.name; }

// @satisfies — validates against a type without widening
/** @satisfies {{ theme: "light" | "dark" }} */
const theme = { theme: /** @type {const} */ ("dark") };

/**
 * @deprecated Use `add()` instead.
 * @param {number} a
 * @param {number} b
 */
function oldAdd(a, b) { return a + b; }

/* ============================================================
 *  9️⃣ EMITTING .d.ts FROM JS
 * ============================================================ */

// tsconfig.json:
// {
//   "compilerOptions": {
//     "allowJs": true,
//     "declaration": true,
//     "emitDeclarationOnly": true,
//     "outDir": "types"
//   },
//   "include": ["src/**/*.js"]
// }
// Then: npx tsc
// → emits `types/*.d.ts` files inferred from JSDoc comments.

/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ JSDoc types are WEAKER than TS types:
//    - No conditional types, no mapped types, no infer
//    - Limited support for advanced generics
// ⚠️ JSDoc annotations apply to the DECLARATION that follows them.
// ⚠️ Too-long union types are hard to read — define via @typedef.
// ⚠️ Not all editors honor @satisfies/@overload equally.
// ⚠️ Use `checkJs: false` per-file with `// @ts-nocheck` when needed.

// 🕒 Version notes
// - TS 4.7  — `@template` inferred from usage improvements
// - TS 5.0  — `@satisfies` support in JS
// - TS 5.5  — `@import` tag for type imports in JS files

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept            | JSDoc                    | TS equivalent       |
 * ─────────────────────────────────────────────────────────────
 * | Param type         | @param {number} a        | a: number           |
 * | Return type        | @returns {number}        | ): number {         |
 * | Var type           | @type {string}           | let x: string       |
 * | Custom type        | @typedef {Object} U      | interface U         |
 * | Union              | {string \| number}       | string \| number    |
 * | Generic            | @template T              | <T>                 |
 * | Constraint         | @template {X} T          | <T extends X>       |
 * | Callback           | @callback F              | type F = () => void |
 * | Overload           | @overload × N + impl     | N sigs + impl       |
 * | This               | @this {{ ... }}          | this: { ... }       |
 * | Import type        | @import {X} from "..."   | import type { X }   |
 * | Deprecate          | @deprecated              |  @deprecated        |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use @ts-check for gradual adoption.
 *  - Prefer @import (TS 5.5+) over inline `import("./x").T`.
 *  - Prefer .ts when possible — JSDoc can't do conditional/mapped types.
 *  - Enable "checkJs" project-wide once JSDoc coverage is high.
 *  - Emit .d.ts from JS to publish types for JS-only packages.
 * ============================================================ */