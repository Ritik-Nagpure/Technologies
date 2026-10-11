// 08_Typescript_Modules/02_Ambient_Modules.d.ts

/* ============================================================
 *  📘 AMBIENT MODULES (.d.ts)
 *
 *  Ambient declarations describe types for code that exists at
 *  runtime but is NOT written in TypeScript (JS libs, globals,
 *  third-party modules without types).
 *
 *  Sections:
 *   1. What is an ambient declaration?
 *   2. Global ambient values
 *   3. `declare module "..."` — typed external modules
 *   4. Wildcard module declarations
 *   5. UMD module declarations
 *   6. `declare global` — augment global scope
 *   7. Module augmentation (extending existing modules)
 *   8. .d.ts file conventions
 *   9. Where TS looks for .d.ts files
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS AN AMBIENT DECLARATION?
 * ============================================================ */

// Ambient declarations use `declare` to tell TS "this exists at
// runtime but you don't need to emit any code for it."
//
// They live in `.d.ts` files (declaration-only files).
// Nothing in a .d.ts is compiled to JS.

/* ============================================================
 *  2️⃣ GLOBAL AMBIENT VALUES
 * ============================================================ */

// declare const / let / var
declare const APP_VERSION: string;
declare let debugMode: boolean;
declare var legacyGlobal: number;

// declare function
declare function fetchData(url: string): Promise<unknown>;

// declare class
declare class LegacyWidget {
  constructor(id: string);
  render(): void;
}

// declare enum
declare enum Direction { Up, Down, Left, Right }

// declare namespace
declare namespace MyLib {
  function init(): void;
  const version: string;
}

// ⚠️ These describe runtime values — you must ensure they exist
//    at runtime (script tag, polyfill, node global, etc.).

/* ============================================================
 *  3️⃣ declare module "..." — TYPED EXTERNAL MODULES
 * ============================================================ */

// Describes the shape of an npm package that ships JS without types.

declare module "my-lib" {
  export function greet(name: string): string;
  export const version: string;
  export default function defaultFn(): void;
}

// 🔸 With named + default exports
declare module "cool-pkg" {
  export interface Options {
    debug?: boolean;
    retries?: number;
  }
  export function run(opts?: Options): Promise<void>;
  const _default: { run: typeof run };
  export default _default;
}

// 🔸 Any-typed module (escape hatch — discouraged):
declare module "untyped-lib";

/* ============================================================
 *  4️⃣ WILDCARD MODULE DECLARATIONS
 * ============================================================ */

// For asset imports (CSS, images, JSON) — the classic use case.

declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}

// 🔸 Wildcard with generic structure
declare module "*.worker" {
  const worker: {
    new (): Worker;
  };
  export default worker;
}

/* ============================================================
 *  5️⃣ UMD MODULE DECLARATIONS
 * ============================================================ */

// UMD modules work as both global and module.
// Use `export as namespace` to describe the global form.

declare module "jquery" {
  export = jQuery;
}

declare global {
  const jQuery: JQueryStatic;
  interface JQueryStatic {
    (selector: string): JQuery;
    ajax(url: string): Promise<unknown>;
  }
  interface JQuery {
    on(event: string, fn: () => void): this;
  }
}

// `export as namespace X;` inside a module declaration also exposes
// it globally for UMD libraries.
// declare module "lodash" {
//   export as namespace _;
//   export function chunk<T>(arr: T[], size: number): T[][];
// }

/* ============================================================
 *  6️⃣ declare global — AUGMENTING THE GLOBAL SCOPE
 * ============================================================ */

// Inside a MODULE file, wrap global augmentations in `declare global`.

export {}; // ensure this file is a module

declare global {
  interface Window {
    myCustomProp: string;
    analytics?: { track(event: string): void };
  }

  var __DEV__: boolean;
}

// Now `window.myCustomProp` and `globalThis.__DEV__` are typed.

// ⚠️ `declare global` must be inside a MODULE (a file with import/export).
// ⚠️ Without `export {}` it's treated as a global script — no need for
//    `declare global`, but you lose module scoping.

/* ============================================================
 *  7️⃣ MODULE AUGMENTATION (EXTENDING EXISTING MODULES)
 * ============================================================ */

// Add new exports/members to an existing module.

// augmenting "express"
declare module "express" {
  interface Request {
    userId?: string;
  }
}

// augmenting "react"
// declare module "react" {
//   interface CSSProperties {
//     "--custom-var"?: string;
//   }
// }

// augmenting "vue"
// declare module "vue/types/vue" {
//   interface Vue {
//     $myPlugin: (msg: string) => void;
//   }
// }

// ⚠️ You MUST import the module being augmented for augmentation to work
//    in some setups; use `import "express";` at the top.

/* ============================================================
 *  8️⃣ .d.ts FILE CONVENTIONS
 * ============================================================ */

// - Only type-level declarations.
// - No runtime code.
// - Only `declare` / `export` / `import` / interfaces / types.
// - Compiled output: none (declaration-only).
//
// 🔸 Two flavors:
//   - Script .d.ts (no top-level import/export) → GLOBAL scope
//   - Module .d.ts (has top-level import/export) → LOCAL scope
//
// 🔸 Naming:
//   - foo.d.ts       → type declarations for foo.js
//   - foo.d.ts.map   → maps back to foo.ts source
//
// 🔸 `/// <reference path="./x.d.ts" />` — old-style include.
//    Prefer tsconfig "include" or "typeRoots".

/* ============================================================
 *  9️⃣ WHERE TS LOOKS FOR .d.ts FILES
 * ============================================================ */

// By default:
//   - `node_modules/@types/*`             — auto-included
//   - `node_modules/*/package.json#types` — per-package types
//   - tsconfig "typeRoots" and "types"    — custom roots
//   - tsconfig "include"                  — project files
//   - "files" in tsconfig                 — explicit list
//
// 🔸 Custom type roots:
//     tsconfig.json:
//     {
//       "compilerOptions": {
//         "typeRoots": ["./node_modules/@types", "./types"],
//         "types": ["node", "jest"]
//       }
//     }

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `declare` alone doesn't provide a runtime implementation.
// ⚠️ Module augmentation must NOT re-declare existing exports — only
//    extend interfaces/types.
// ⚠️ You cannot "override" a module's types via augmentation — only extend.
// ⚠️ A .d.ts with no imports/exports is a GLOBAL script — no `declare global`
//    wrapper needed. Accidentally adding an `import` flips it into a module.
// ⚠️ Wildcard `declare module "*.ext"` catches ALL matching files — can
//    hide missing files silently.
// ⚠️ `declare module "x";` (bare) makes x `any` — use sparingly.
// ⚠️ `export =` (CommonJS) can only appear once per module.
// ⚠️ `export as namespace` is for UMD only.
// ⚠️ `declare global` requires the file to be a module (import/export).
// ⚠️ `esModuleInterop` affects how default imports map to CommonJS exports.

// 🕒 Version notes
// - Ambient modules: TS 1.0
// - `declare global`: TS 1.0
// - Module augmentation: TS 1.8
// - `import type` in .d.ts: TS 3.8
// - `resolveJsonModule` (JSON typing): TS 2.9

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Declaration                         | Purpose                    |
 * ─────────────────────────────────────────────────────────────
 * | declare const/let/var               | Ambient values             |
 * | declare function                    | Ambient functions          |
 * | declare class                       | Ambient classes            |
 * | declare namespace                   | Ambient namespaces         |
 * | declare module "name" { ... }       | Typed module               |
 * | declare module "*.ext"              | Wildcard (assets)          |
 * | declare module "name";              | Any-typed module           |
 * | export =                            | CommonJS export            |
 * | export as namespace                 | UMD global exposure        |
 * | declare global { ... }              | Global augmentation        |
 * | declare module "existing" { ... }   | Module augmentation        |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer @types packages (DefinitelyTyped) over writing your own.
 *  - Keep .d.ts files PURE — no runtime code.
 *  - Use `declare global` only when you truly need globals.
 *  - Augment third-party modules in a `types/` folder, not inline.
 *  - Enable `typeRoots` / `types` in tsconfig for custom type dirs.
 *  - Prefer `import type` in .d.ts to avoid runtime imports.
 *  - Avoid bare `declare module "x";` — hides errors.
 *  - Prefer well-scoped augmentations over wildcards.
 * ============================================================ */