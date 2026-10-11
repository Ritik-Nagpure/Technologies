// 08_Typescript_Modules/04_Internal_Modules.ts

/* ============================================================
 *  📘 INTERNAL MODULES (LEGACY NAMESPACES)
 *
 *  "Internal modules" was the ORIGINAL name for TypeScript
 *  namespaces (before TS 1.5). The syntax `module X {}` was
 *  later renamed to `namespace X {}`.
 *
 *  Sections:
 *   1. Historical context
 *   2. `module` keyword (legacy syntax)
 *   3. Multi-file internal modules
 *   4. `/// <reference>` directive
 *   5. How they compile
 *   6. Why they're obsolete
 *   7. Migration to modern ES modules
 *   8. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ HISTORICAL CONTEXT
 * ============================================================ */

// Before TS 1.5, TypeScript had two module concepts:
//   - "Internal modules" → written `module Foo { ... }`
//   - "External modules" → later renamed "modules" (ES modules)
//
// TS 1.5 renamed:
//   - "Internal modules" → namespaces  (`module` → `namespace`)
//   - "External modules" → modules     (`export` / `import`)
//
// The old `module Foo {}` syntax is still ACCEPTED by the compiler for
// backward compatibility but is deprecated in style.

/* ============================================================
 *  2️⃣ `module` KEYWORD (LEGACY SYNTAX)
 * ============================================================ */

// ❌ Old style (still compiles)
module LegacyMath {
  export function add(a: number, b: number) { return a + b; }
}

// ✅ Modern equivalent
namespace ModernMath {
  export function add(a: number, b: number) { return a + b; }
}

LegacyMath.add(1, 2);
ModernMath.add(1, 2);

// 🔸 When used with a STRING name, `module` still means "external module"
//    (i.e., ambient module declaration):
declare module "my-lib" {
  export function greet(): string;
}
// This usage is CURRENT and correct.

// 🔸 Without a string, `module X {}` = namespace → legacy.

/* ============================================================
 *  3️⃣ MULTI-FILE INTERNAL MODULES
 * ============================================================ */

// Pre-ES-modules, you'd split a namespace across files using
// reference directives. All files contribute to the SAME namespace.

// ──── file: geometry/shapes.ts ────
// /// <reference path="./math-utils.ts" />
// namespace Geometry {
//   export interface Shape { area(): number }
// }

// ──── file: geometry/circle.ts ────
// /// <reference path="./shapes.ts" />
// namespace Geometry {
//   export class Circle implements Shape {
//     constructor(public radius: number) {}
//     area() { return Math.PI * this.radius ** 2; }
//   }
// }

// ──── file: app.ts ────
// /// <reference path="./geometry/circle.ts" />
// const c = new Geometry.Circle(1);

/* ============================================================
 *  4️⃣ /// <reference> DIRECTIVE
 * ============================================================ */

// Tells the compiler to INCLUDE another file BEFORE this one.
// Two forms:
//
//   /// <reference path="./file.ts" />        → file dependency
//   /// <reference types="node" />            → @types package
//   /// <reference lib="es2015" />            → built-in lib
//
// These are ONLY honored at the TOP of a file (before any code).

// Compiler flags that affect it:
//   --outFile     → concatenate into one JS file (namespace-style)
//   --outDir      → emit to folder
//
// With `outFile`, references establish ordering.
// Without `outFile`, references just add files to the program.

/* ============================================================
 *  5️⃣ HOW THEY COMPILE
 * ============================================================ */

// namespace/module blocks compile to IIFEs assigning to a shared var:

//   namespace Geometry { export const PI = 3.14; }
//   ↓
//   var Geometry;
//   (function (Geometry) {
//     Geometry.PI = 3.14;
//   })(Geometry || (Geometry = {}));

// With `--outFile bundle.js`, TS concatenates all files in the
// order given by `<reference>` directives and merges the namespace.

/* ============================================================
 *  6️⃣ WHY THEY'RE OBSOLETE
 * ============================================================ */

// - Not tree-shakeable — bundlers keep everything.
// - Pollute globals unless nested inside a module.
// - No dynamic imports.
// - No interoperability with the wider JS ecosystem (ES modules).
// - TS 1.5+ recommends ES modules for all new code.
// - Tooling (webpack, rollup, vite) prefers ESM.

/* ============================================================
 *  7️⃣ MIGRATION TO MODERN ES MODULES
 * ============================================================ */

// BEFORE (namespace + reference):
//   /// <reference path="./shapes.ts" />
//   namespace Geo { export class Circle {} }
//   const c = new Geo.Circle(1);

// AFTER (ES modules):
//   // shapes.ts
//   export interface Shape { area(): number }
//   // circle.ts
//   import { Shape } from "./shapes";
//   export class Circle implements Shape { area() { return 0; } }
//   // app.ts
//   import { Circle } from "./circle";
//   const c = new Circle();

// 🔸 Steps:
//   1. Change `module X {}` → `namespace X {}` if keeping namespaces.
//   2. Better: convert each namespace to its own module file.
//   3. Replace `<reference path="..." />` with `import`.
//   4. Replace `X.Y.Z` global access with imported bindings.
//   5. Remove `outFile` from tsconfig; let the bundler handle it.

/* ============================================================
 *  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `module X {}` without a string is DEPRECATED — use `namespace`.
// ⚠️ `module "x" {}` (with string) is CURRENT — ambient module decl.
// ⚠️ `/// <reference>` is still used for `types` and `lib` — not for
//    local file imports in modern code.
// ⚠️ `outFile` only works with `module: "amd" | "system"` (and none).
// ⚠️ Merging namespaces across files requires all files to be in the
//    compilation (via tsconfig include or reference directives).
// ⚠️ Modern tooling (vite, esbuild) doesn't support `<reference path>`.
// ⚠️ Don't mix namespaces with ES module imports in the same file —
//    confusing and error-prone.

// 🕒 Version notes
// - `module X {}` (internal): TS 1.0
// - Renamed to `namespace` in TS 1.5
// - `module "x" {}` (ambient): unchanged, still current.
// - ES modules preferred from TS 1.5+.

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature                     | Old (internal)   | New (ES module)  |
 * ─────────────────────────────────────────────────────────────
 * | Syntax block                | module X {}      | export / import  |
 * | Renamed to                  | namespace X {}   | ESM              |
 * | Multi-file include          | /// reference    | import "..."     |
 * | Merge across files          | ✅ same namespace| ❌                |
 * | Tree-shakeable              | ❌               | ✅                |
 * | Bundler-friendly            | ❌               | ✅                |
 * | Used for ambient "x"        | module "x" {} ✅ | still current    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Never write `module X {}` — use `namespace X {}` if you need
 *    a namespace at all.
 *  - Prefer ES modules for all new code.
 *  - Keep `declare module "x" { }` (with string) — this is current
 *    and correct for ambient declarations.
 *  - Migrate `<reference path>` to `import`.
 *  - Avoid `outFile` — let your bundler concat.
 *  - Enable `"module": "esnext"` in tsconfig for modern output.
 * ============================================================ */