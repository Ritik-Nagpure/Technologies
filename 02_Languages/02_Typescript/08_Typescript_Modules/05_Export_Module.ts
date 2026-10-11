// 08_Typescript_Modules/05_Export_Module.ts

/* ============================================================
 *  📘 ES MODULES: EXPORTS
 *
 *  Modern ES module system — the preferred way to organize code.
 *
 *  Sections:
 *   1.  Named exports
 *   2.  Default exports
 *   3.  Re-exports
 *   4.  Type-only exports
 *   5.  `export * from`
 *   6.  `export = ` (CommonJS interop)
 *   7.  Live bindings
 *   8.  Combined exports & tree-shaking
 *   9.  tsconfig: module / moduleResolution
 *  10.  Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ NAMED EXPORTS
 * ============================================================ */

// Declare then export
const PI = 3.14159;
function area(r: number) { return PI * r ** 2; }
export { PI, area };

// Inline export
export const E = 2.71828;
export function log(msg: string) { console.log(msg); }
export interface Point { x: number; y: number }
export type Direction = "up" | "down";
export class Circle { constructor(public r: number) {} }
export enum Level { Info, Warn, Error }

// Rename on export
const internalFn = (x: number) => x;
export { internalFn as publicFn };

// ⚠️ Consumers import named exports by name:
//   import { PI, area } from "./math";

/* ============================================================
 *  2️⃣ DEFAULT EXPORTS
 * ============================================================ */

// A module can have at most ONE default export.
export default function greet(name: string) { return `Hello, ${name}`; }

// Consumers:
//   import greet from "./greet";           // no braces
//   import myGreet from "./greet";         // any name — consumer chooses

// 🔸 Default exporting an expression:
// const api = { run() {} };
// export default api;

// 🔸 Named + default together:
// export default function main() {}
// export function helper() {}

// ⚠️ Prefer NAMED exports over default exports in most codebases:
//   - Named exports are auto-renamed by IDEs.
//   - Named exports enable consistent naming.
//   - Default exports complicate tree-shaking and refactors.

/* ============================================================
 *  3️⃣ RE-EXPORTS
 * ============================================================ */

// Re-export from another module without importing first.
// export { a, b } from "./other";
// export { a as default } from "./other";
// export { a as alias } from "./other";

// 🔸 Barrel pattern — index.ts re-exports the folder:
//     // src/utils/index.ts
//     export * from "./string";
//     export * from "./number";
//     export * from "./array";
//
//     // consumer:
//     import { capitalize, clamp } from "./utils";

// ⚠️ Barrels can cause circular dependencies and hurt tree-shaking
//    when used recklessly.

/* ============================================================
 *  4️⃣ TYPE-ONLY EXPORTS
 * ============================================================ */

// `export type` — exports a TYPE only, removed at compile time.

export type UserID = string | number;
export interface Shape2 { area(): number }

// 🔸 Inline type export
export { type UserID, type Shape2 };

// 🔸 Re-export types from another module
// export type { User } from "./models";

// 🔸 `export type *` — TS 5.0+, re-export only types
// export type * from "./models";

// 🧠 Benefits:
//  - Cleaner `import` output.
//  - Prevents bundlers from mistakenly including unused modules.
//  - Required under `isolatedModules` in some cases.

/* ============================================================
 *  5️⃣ `export * from`
 * ============================================================ */

// Re-export everything (named) from a module.
// export * from "./math";
// export * from "./geometry";
//
// ⚠️ `export *` does NOT re-export DEFAULT exports.
// ⚠️ Conflicts between two `export *` for the same name are errors.

// 🔸 Rename `export *`? Not directly — re-export selectively instead.

/* ============================================================
 *  6️⃣ `export =` (CommonJS INTEROP)
 * ============================================================ */

// `export =` — TypeScript's syntax for CommonJS `module.exports = X`.
// Can only be used ONCE per file and NOT with ES exports in the same file.

//   // math.ts
//   function add(a: number, b: number) { return a + b; }
//   export = add;
//
// Consumer with CommonJS:
//   import add = require("./math");
//
// Consumer with ESM + esModuleInterop:
//   import add from "./math";

// 🔸 Use ONLY when writing/publishing a CommonJS library.
//    Modern code uses ES modules + `export default` / named exports.

/* ============================================================
 *  7️⃣ LIVE BINDINGS
 * ============================================================ */

// ES module imports are LIVE BINDINGS — they reflect the current
// value of the export at access time (not a snapshot).

//   // counter.ts
//   export let count = 0;
//   export function inc() { count++; }
//
//   // main.ts
//   import { count, inc } from "./counter";
//   console.log(count);  // 0
//   inc();
//   console.log(count);  // 1  (live binding)
//
// ⚠️ You CANNOT reassign an imported binding:
//     import { count } from "./counter";
//     count = 5;   // ❌ SyntaxError

/* ============================================================
 *  8️⃣ COMBINED EXPORTS & TREE-SHAKING
 * ============================================================ */

// Bundlers (webpack, rollup, vite) do "tree-shaking" — drop unused
// exports. This works best when:
//   - Exports are NAMED.
//   - Modules have NO SIDE EFFECTS (or are marked `"sideEffects": false`
//     in package.json).
//   - You avoid `export *` from index files with side effects.

// Example package.json:
//   {
//     "sideEffects": ["*.css"]
//   }

/* ============================================================
 *  9️⃣ TSCONFIG: MODULE / MODULERESOLUTION
 * ============================================================ */

// tsconfig.json:
//   {
//     "compilerOptions": {
//       "module": "esnext",         // ESNext output for bundlers
//       "moduleResolution": "bundler",
//       "esModuleInterop": true,     // CJS interop for default imports
//       "verbatimModuleSyntax": true // TS 5.0 — strict type-only enforcement
//     }
//   }
//
// Common "module" values:
//   - "commonjs"      → Node (older)
//   - "es2015"/"esnext" → ESM output
//   - "nodenext"      → Node ESM+CJS dual support
//   - "bundler"       → for bundler resolution (TS 5.0+)

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ A file is a MODULE if it has any top-level import/export.
//     Otherwise it's a SCRIPT — its declarations are global.
// ⚠️ Default exports can be renamed arbitrarily by consumers — hurts
//     refactor tools.
// ⚠️ `export =` and `export default` cannot coexist in the same file.
// ⚠️ `export * from` does not re-export default.
// ⚠️ Under `isolatedModules: true`, type-only re-exports MUST use
//     `export type`.
// ⚠️ Re-exporting can cause circular imports — watch carefully.
// ⚠️ `import { type X }` (inline type) requires TS 4.5+.
// ⚠️ `verbatimModuleSyntax` (TS 5.0) forces you to declare type-only
//     imports explicitly.
// ⚠️ `esModuleInterop` changes how `import x from "cjs-lib"` behaves.

// 🕒 Version notes
// - ES modules (ESM): ES2015 (TS 1.5)
// - `import type` / `export type`: TS 3.8
// - Inline `type` modifiers: TS 4.5
// - `verbatimModuleSyntax`: TS 5.0
// - `module: "bundler"`: TS 5.0
// - `export type *`: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Export form                  | Syntax                          |
 * ─────────────────────────────────────────────────────────────
 * | Named export                 | export const x = 1              |
 * | Named batch                  | export { a, b }                 |
 * | Rename                       | export { a as b }               |
 * | Default                      | export default fn               |
 * | Re-export                    | export { a } from "./m"         |
 * | Re-export default            | export { a as default } from "x"|
 * | Re-export all                | export * from "./m"             |
 * | Type-only                    | export type { T }               |
 * | Inline type                  | export { type T, f }            |
 * | Re-export types only         | export type * from "./m"        |
 * | CommonJS-style               | export = value                  |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer NAMED exports over default — better tooling, refactors.
 *  - Use `export type` for types — cleaner JS output.
 *  - Use barrel index.ts files sparingly — watch circular deps.
 *  - Set `"sideEffects": false` in package.json for tree-shaking.
 *  - Enable `esModuleInterop` for CJS compatibility.
 *  - Enable `verbatimModuleSyntax` (TS 5.0+) for strict type imports.
 *  - Avoid `export =` in new code — only for CJS libraries.
 *  - Prefer re-exports that don't obscure origins.
 * ============================================================ */