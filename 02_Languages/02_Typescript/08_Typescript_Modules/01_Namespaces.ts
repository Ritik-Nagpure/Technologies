// 08_Typescript_Modules/01_Namespaces.ts

/* ============================================================
 *  📘 NAMESPACES IN TYPESCRIPT
 *
 *  A namespace groups related code under a single name to avoid
 *  polluting the global scope. It's TypeScript's PRE-ES-modules
 *  way of organizing code.
 *
 *  Sections:
 *   1. What is a namespace?
 *   2. Basic namespace syntax
 *   3. Nested namespaces
 *   4. Exporting from namespaces
 *   5. Namespace + interface / type / class
 *   6. Merging namespaces with functions/classes/enums
 *   7. Multi-file namespaces (reference)
 *   8. Namespaces vs ES modules (when to use what)
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS A NAMESPACE?
 * ============================================================ */

// A namespace is a runtime object that wraps declarations.
// It compiles to an IIFE that assigns properties to a global
// (or module-scoped) object.
//
//   namespace Geometry { export const PI = 3.14; }
//        ↓ compiles to ↓
//   var Geometry;
//   (function (Geometry) {
//     Geometry.PI = 3.14;
//   })(Geometry || (Geometry = {}));

/* ============================================================
 *  2️⃣ BASIC NAMESPACE SYNTAX
 * ============================================================ */

namespace Geometry {
  export const PI = 3.14159;

  export function area(radius: number): number {
    return PI * radius ** 2;
  }

  // Not exported — private to the namespace
  const internalHelper = () => 42;
}

console.log(Geometry.PI);              // 3.14159
console.log(Geometry.area(2));         // 12.56636

/* ============================================================
 *  3️⃣ NESTED NAMESPACES
 * ============================================================ */

namespace App {
  export namespace Models {
    export interface User { id: number; name: string }
    export class Product { constructor(public title: string) {} }
  }

  export namespace Utils {
    export function log(msg: string) { console.log("[App]", msg); }
  }
}

const u: App.Models.User = { id: 1, name: "Ravi" };
const p = new App.Models.Product("Laptop");
App.Utils.log("started");

/* ============================================================
 *  4️⃣ EXPORTING FROM NAMESPACES
 * ============================================================ */

// Only `export`-ed members are visible outside the namespace.
// Non-exported members are private to the namespace body.

namespace Counter {
  let count = 0;              // private
  export function inc() { count++; }
  export function value() { return count; }
}

Counter.inc();
console.log(Counter.value()); // 1
// console.log(Counter.count); // ❌ private

/* ============================================================
 *  5️⃣ NAMESPACE + INTERFACE / TYPE / CLASS
 * ============================================================ */

namespace Shapes {
  export interface Shape { area(): number }

  export class Circle implements Shape {
    constructor(public radius: number) {}
    area() { return Math.PI * this.radius ** 2; }
  }

  export class Square implements Shape {
    constructor(public side: number) {}
    area() { return this.side ** 2; }
  }

  export type ShapeKind = "circle" | "square";
}

const c = new Shapes.Circle(1);
const s = new Shapes.Square(2);
const kinds: Shapes.ShapeKind[] = ["circle", "square"];

/* ============================================================
 *  6️⃣ MERGING NAMESPACES WITH FUNCTIONS / CLASSES / ENUMS
 * ============================================================ */

// A namespace with the SAME NAME as a function/class/enum can merge
// to add static-like helpers.

function greet(name: string) { return `Hello, ${name}`; }
namespace greet {
  export const defaultName = "World";
  export function formal(name: string) { return `Dear ${name}`; }
}

greet("Ravi");            // "Hello, Ravi"
greet.defaultName;        // "World"
greet.formal("Ravi");     // "Dear Ravi"

// 🔸 Enum + namespace
enum Color { Red, Green }
namespace Color {
  export function fromName(n: "Red" | "Green") { return Color[n]; }
}
Color.fromName("Red");    // 0

// 🔸 Class + namespace — the pre-static-block way to attach statics
class Config {
  constructor(public value: string) {}
}
namespace Config {
  export const DEFAULT = new Config("default");
}
Config.DEFAULT.value;     // "default"

/* ============================================================
 *  7️⃣ MULTI-FILE NAMESPACES
 * ============================================================ */

// Namespaces can span files using triple-slash references:
//
//   /// <reference path="./geometry-helpers.ts" />
//
// This is the OLD way — modern code uses ES modules instead.
// If you see `/// <reference ... />` in a codebase, it's pre-ES6
// style namespacing.

/* ============================================================
 *  8️⃣ NAMESPACES vs ES MODULES
 * ============================================================ */

// ┌────────────────────────────┬─────────────┬───────────────┐
// │ Feature                     │ namespace   │ ES module     │
// ├────────────────────────────┼─────────────┼───────────────┤
// │ Runtime output              │ IIFE object │ import/export │
// │ Works in browsers natively  │ ✅ (global) │ ✅ (bundled)  │
// │ Tree-shakeable              │ ❌          │ ✅            │
// │ Circular deps               │ ✅ easier   │ ⚠️             │
// │ Preferred for new code      │ ❌          │ ✅            │
// │ Used for global libraries   │ ✅          │ ⚠️             │
// │ Declaration merging         │ ✅          │ ❌            │
// └────────────────────────────┴─────────────┴───────────────┘

// 🧠 Rule of thumb:
//   - Use ES modules for APPLICATION code.
//   - Use namespaces only for GLOBAL LIBRARY types or ambient
//     declarations (e.g., `declare global { ... }`).

// 🔸 Namespace exporting from a module:
export namespace Legacy {
  export function oldApi() { return "legacy"; }
}

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Namespaces are NOT tree-shakeable — bundlers keep all members.
// ⚠️ Namespaces pollute globals if not wrapped in a module.
// ⚠️ Mixed with `"type": "module"` (ESM) — namespaces still work but
//    you must not use `export =` with them.
// ⚠️ Multi-file namespaces need `/// <reference path="..." />` — do
//    NOT use in modern projects; use ES imports instead.
// ⚠️ Namespace + class merging is legacy — prefer `static` members.
// ⚠️ `declare namespace` describes external shapes without emitting JS.
// ⚠️ Inside a module file, namespaces are scoped to the module — they
//    don't leak to global unless you `export` them.

// 🕒 Version notes
// - Namespaces were called "internal modules" before TS 1.5.
// - `module X {}` syntax is legacy — now `namespace X {}`.
// - Prefer ES modules since TS 1.5+ / ES2015.

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature                     | Syntax                          |
 * ─────────────────────────────────────────────────────────────
 * | Declaration                 | namespace X { }                 |
 * | Export a member             | export const y = 1;             |
 * | Nested                      | namespace X { namespace Y {} }  |
 * | Access                      | X.y                             |
 * | Merge with function         | function f() {}; namespace f{}  |
 * | Merge with class            | class C {}; namespace C {}      |
 * | Multi-file reference        | /// <reference path="..." />    |
 * | Ambient declaration         | declare namespace X {}          |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer ES modules for new code.
 *  - Use namespaces only for global/ambient types.
 *  - Keep namespaces shallow — nesting hurts discoverability.
 *  - Use `export` explicitly — everything else is private.
 *  - Avoid multi-file namespaces — use ES imports.
 *  - Prefer `static` members over class-namespace merging.
 *  - Do not mix `export =` with namespaces in modern projects.
 * ============================================================ */