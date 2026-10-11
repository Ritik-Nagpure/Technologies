// 08_Typescript_Modules/03_Global_augmentation.d.ts

/* ============================================================
 *  📘 GLOBAL AUGMENTATION IN TYPESCRIPT
 *
 *  Global augmentation lets you ADD members to globally-scoped
 *  types (Window, Document, NodeJS.Global, Array, etc.) or to
 *  types that are globally available (e.g., JSX, Express).
 *
 *  Sections:
 *   1.  What is global augmentation?
 *   2.  `declare global` inside a module
 *   3.  Augmenting built-in interfaces (Window, Document, Array)
 *   4.  Adding global variables & functions
 *   5.  Augmenting NodeJS globals
 *   6.  Augmenting JSX namespace
 *   7.  `interface Window` vs `declare global`
 *   8.  Module augmentation vs global augmentation
 *   9.  Best practices and organizational tips
 *  10.  Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS GLOBAL AUGMENTATION?
 * ============================================================ */

// You can extend globally-visible types by declaring them AGAIN in
// the global scope. TypeScript merges interface declarations.
//
// Common targets:
//   Window, Document, Element, Event, Array, String, Number
//   JSX, NodeJS.Global, ProcessEnv

/* ============================================================
 *  2️⃣ `declare global` INSIDE A MODULE
 * ============================================================ */

// If your file has any `import`/`export`, it's a MODULE.
// Global augmentations must then be wrapped in `declare global { }`.

export {}; // ensures this file is a module

declare global {
  interface Window {
    __APP_NAME__: string;
  }
}

// ⚠️ Without `export {}` (or any import/export), the file is a SCRIPT —
//    the `declare global` wrapper is unnecessary (and would be an error).

/* ============================================================
 *  3️⃣ AUGMENTING BUILT-IN INTERFACES
 * ============================================================ */

// 🔸 Window
declare global {
  interface Window {
    myAnalytics: {
      track(event: string, props?: Record<string, unknown>): void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

// window.myAnalytics.track("click");  // ✅ typed

// 🔸 Document
declare global {
  interface Document {
    _legacyQuery(sel: string): Element | null;
  }
}

// 🔸 Array
declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}

if (!Array.prototype.last) {
  Array.prototype.last = function <T>(this: T[]): T | undefined {
    return this[this.length - 1];
  };
}
// [1, 2, 3].last();  // ✅ typed

// 🔸 String
declare global {
  interface String {
    toTitleCase(): string;
  }
}

// 🔸 Number
declare global {
  interface Number {
    isPositive(): boolean;
  }
}

// ⚠️ Augmenting BUILT-INS is risky — it can break third-party libs.
//    Prefer pure utility functions over prototype patching.

/* ============================================================
 *  4️⃣ ADDING GLOBAL VARIABLES & FUNCTIONS
 * ============================================================ */

// Use `var` for globals (not const/let) — otherwise TS complains about
// redeclaration in some cases.

declare global {
  var __DEV__: boolean;
  var __VERSION__: string;

  function __log__(msg: string): void;
}

// if (__DEV__) __log__("dev mode");

/* ============================================================
 *  5️⃣ AUGMENTING NODEJS GLOBALS
 * ============================================================ */

// For Node projects with @types/node installed:

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      DATABASE_URL: string;
      PORT?: string;
    }
    interface Global {
      myGlobal: number;
    }
  }
}

// process.env.NODE_ENV;      // typed as union
// process.env.UNKNOWN;       // ❌ error

// 🔸 `globalThis` typing:
declare global {
  var __featureFlags: Record<string, boolean>;
}
// globalThis.__featureFlags?.newUI;

/* ============================================================
 *  6️⃣ AUGMENTING JSX NAMESPACE
 * ============================================================ */

// With React/JSX:

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "my-custom-element": {
//         "data-id"?: string;
//         children?: unknown;
//       };
//     }
//   }
// }

// With Preact — augment `preact.JSX.IntrinsicElements`
// With Solid — augment `solid-js.JSX.IntrinsicElements`

/* ============================================================
 *  7️⃣ `interface Window` vs `declare global`
 * ============================================================ */

// In a SCRIPT file (.d.ts with no imports/exports), you can just do:

//   interface Window { myProp: string; }

// In a MODULE file, use:

//   export {};
//   declare global { interface Window { myProp: string; } }

// 🔸 Both end up merging into the global `Window` interface.

/* ============================================================
 *  8️⃣ MODULE vs GLOBAL AUGMENTATION
 * ============================================================ */

// ┌────────────────────────────┬─────────────────────┬──────────────────────┐
// │ Feature                     │ Global augmentation │ Module augmentation  │
// ├────────────────────────────┼─────────────────────┼──────────────────────┤
// │ Target                      │ global interfaces   │ module's exports     │
// │ Syntax                      │ declare global { }  │ declare module "x"{} │
// │ Requires file to be module  │ ✅                  │ ✅                   │
// │ Common use                  │ Window, Array, env  │ Express, React, Vue  │
// │ Risk of conflicts           │ high                │ moderate             │
// └────────────────────────────┴─────────────────────┴──────────────────────┘

/* ============================================================
 *  9️⃣ BEST PRACTICES & ORGANIZATIONAL TIPS
 * ============================================================ */

// - Put all global augmentations in a dedicated folder, e.g.:
//     types/globals.d.ts
//     types/env.d.ts
//     types/express.d.ts
// - Each file should be a MODULE (start with `export {}` or an import).
// - Reference them via tsconfig "include":
//     { "include": ["src", "types"] }
// - Name files with `.d.ts` suffix.
// - Keep augmentations SMALL — one concern per file.
// - Document WHY each augmentation exists.
// - Prefer module augmentation over global when possible.
// - Prefer pure functions over prototype patching.

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ In a MODULE file, `interface Window {}` alone does NOT augment
//    global — it creates a LOCAL interface. Must use `declare global`.
// ⚠️ Use `var` for global vars in `declare global` — using `let`/`const`
//    can produce "Cannot redeclare block-scoped variable" errors.
// ⚠️ Augmenting `Array` / `String` is bad practice — affects every file.
// ⚠️ Augmenting ProcessEnv with non-string values is a lie — env is string.
// ⚠️ Namespace augmentations (JSX, NodeJS) require the exact namespace path.
// ⚠️ Multiple global augmentations of the same interface MERGE silently.
// ⚠️ Conflicts surface only at usage site — hard to trace.
// ⚠️ Under `isolatedModules`, .d.ts files still work but tooling varies.
// ⚠️ `declare global` cannot be used at top level of a script file.
// ⚠️ Node's `global` object needs `@types/node` for `globalThis` typing.

// 🕒 Version notes
// - `declare global`: TS 1.0
// - `globalThis` typing: TS 3.4
// - `import type` in .d.ts: TS 3.8
// - Standard decorators / `Symbol.metadata`: TS 5.x

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Task                           | Pattern                              |
 * ─────────────────────────────────────────────────────────────
 * | Augment Window                 | declare global { interface Window }  |
 * | Augment Document               | declare global { interface Document }|
 * | Augment Array/String/Number    | declare global { interface Array<T>} |
 * | Add global var                 | declare global { var X: T }          |
 * | Augment Node env               | declare global { namespace NodeJS }  |
 * | Augment JSX                    | declare global { namespace JSX }     |
 * | From script file               | interface Window { }                 |
 * | From module file               | export {}; declare global { }        |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use `declare global` ONLY inside module files.
 *  - Put augmentations in `types/*.d.ts` and include them in tsconfig.
 *  - Prefer module augmentation over global when possible.
 *  - Never augment Array/String/Number unless you must.
 *  - Use `var` for globals in declarations.
 *  - One concern per file — easy to find and disable.
 *  - Document why each augmentation exists (comment header).
 *  - Watch for conflicts — everything is a global merge.
 * ============================================================ */