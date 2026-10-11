// 08_Typescript_Modules/05_External_Modules.ts

/* ============================================================
 *  📘 ES MODULES: IMPORTS & EXTERNAL MODULES
 *
 *  "External modules" = ES modules — files with their own scope
 *  that import/export bindings.
 *
 *  Sections:
 *   1.  What is a module?
 *   2.  Named imports
 *   3.  Default imports
 *   4.  Namespace imports
 *   5.  Side-effect imports
 *   6.  Type-only imports
 *   7.  Dynamic imports
 *   8.  Import attributes / assertions
 *   9.  import.meta
 *  10.  Module resolution
 *  11.  CommonJS vs ESM interop
 *  12.  Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT IS A MODULE?
 * ============================================================ */

// A file with at least one top-level import or export.
// Modules have their OWN scope — nothing leaks to global.
//
// Contrast with SCRIPT files (no imports/exports): global scope.
//
// One module = one file (unless you use `export ... from`).

/* ============================================================
 *  2️⃣ NAMED IMPORTS
 * ============================================================ */

// import { PI, area } from "./math";
// import { PI as p, area as computeArea } from "./math";
// import { PI, area } from "./math.js";       // with explicit ext for ESM

// 🔸 Import + rename
// import { legacyFn as newFn } from "./legacy";

// 🔸 Import everything named explicitly (no default):
// import { a, b, c } from "./mod";

/* ============================================================
 *  3️⃣ DEFAULT IMPORTS
 * ============================================================ */

// import greet from "./greet";         // default export, any name
// import greet, { helper } from "./mod"; // default + named together

// 🔸 Under `esModuleInterop: true`, this also imports CJS `module.exports = fn`.

/* ============================================================
 *  4️⃣ NAMESPACE IMPORTS
 * ============================================================ */

// import * as Math from "./math";
// Math.PI;
// Math.area(2);

// 🔸 Combines well with default:
// import Math, * as MathNS from "./math";

// ⚠️ Namespace imports can block tree-shaking when the whole namespace
//    is retained. Prefer named imports in performance-sensitive code.

/* ============================================================
 *  5️⃣ SIDE-EFFECT IMPORTS
 * ============================================================ */

// import "./polyfills";              // runs module, no bindings
// import "./styles.css";             // bundlers may handle CSS
// import "reflect-metadata";         // common pattern for polyfills

// 🧠 Use for side effects only — no bindings imported.

/* ============================================================
 *  6️⃣ TYPE-ONLY IMPORTS
 * ============================================================ */

// import type { User } from "./models";
// import { type User, greet } from "./mod";     // inline (TS 4.5+)

// 🧠 Benefits:
//  - Erased at compile time → smaller bundles.
//  - Clear intent — this import is for types only.
//  - Required in some setups (isolatedModules + verbatimModuleSyntax).

// 🔸 Importing a type as a value (or vice versa) is a common bug —
//    type-only imports make this explicit.

/* ============================================================
 *  7️⃣ DYNAMIC IMPORTS
 * ============================================================ */

// Returns a Promise — loads the module lazily at runtime.

async function loadMath() {
  const math = await import("./math");
  return math.area(2);
}

// 🔸 Named binding directly:
async function loadFn() {
  const { area } = await import("./math");
  return area(2);
}

// 🔸 Type-only dynamic import (no runtime code):
type MathModule = typeof import("./math");

// 🔸 Conditional loading:
async function loadLocale(lang: "en" | "fr") {
  const mod = await import(`./locales/${lang}`);
  return mod.default;
}

// 🧠 Bundlers code-split dynamic imports into separate chunks.

/* ============================================================
 *  8️⃣ IMPORT ATTRIBUTES / ASSERTIONS
 * ============================================================ */

// Assert the expected type of a JSON module (older syntax):
// import data from "./data.json" assert { type: "json" };

// Newer "attributes" syntax (ES2023, TS 5.3+):
// import data from "./data.json" with { type: "json" };

// 🔸 tsconfig: "resolveJsonModule": true to import JSON directly.

/* ============================================================
 *  9️⃣ import.meta
 * ============================================================ */

// `import.meta` gives ESM runtime metadata.

console.log(import.meta.url);          // file URL of the module

// 🔸 With Vite: `import.meta.env`
//     if (import.meta.env.DEV) { ... }
//
// 🔸 With Node.js: `import.meta.resolve(...)`, `import.meta.dirname` (Node 20+)

// ⚠️ `import.meta` is only available in ESM modules.

/* ============================================================
 *  1️⃣0️⃣ MODULE RESOLUTION
 * ============================================================ */

// TypeScript resolves import paths using one of several strategies,
// chosen by tsconfig `moduleResolution`:
//
//   "node10" (or "node")  — classic Node resolution
//   "node16" / "nodenext" — Node ESM + CJS dual resolution
//   "bundler"             — bundler-style (Vite, esbuild) — TS 5.0+
//
// Influenced by:
//   "baseUrl"      — root for non-relative imports
//   "paths"        — alias mappings
//   "rootDirs"     — virtual dir merging
//   "typeRoots"    — @types lookup
//
// 🔸 Example alias in tsconfig:
//   {
//     "compilerOptions": {
//       "baseUrl": ".",
//       "paths": {
//         "@app/*": ["src/app/*"],
//         "@utils/*": ["src/utils/*"]
//       }
//     }
//   }
//
//   import { x } from "@utils/string";
//
// ⚠️ Aliases require matching bundler config too.

/* ============================================================
 *  1️⃣1️⃣ COMMONJS vs ESM INTEROP
 * ============================================================ */

// CommonJS:
//   const x = require("./mod");
//   module.exports = fn;
//
// ESM:
//   import x from "./mod";
//   export default fn;
//
// Interop settings (tsconfig):
//   "esModuleInterop": true        → allow `import x from` a CJS module
//   "allowSyntheticDefaultImports": true → allow default even if module lacks one
//   "moduleResolution": "node16" or "nodenext" → native dual resolution
//
// ⚠️ Node's ESM requires file EXTENSIONS in relative imports:
//     import { x } from "./util.js"   // even if source is .ts
//     (or use "moduleResolution": "bundler")

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Mixing CJS require() and ESM import() in one project — mind types.
// ⚠️ Namespace imports retain everything — worse for tree-shaking.
// ⚠️ Default imports from a CJS module without esModuleInterop can be
//     `undefined` at runtime.
// ⚠️ In Node ESM, relative imports need file extensions.
// ⚠️ Dynamic imports create async boundaries — mind top-level awaits.
// ⚠️ Bare `import "./x"` runs the module for side effects — easy to
//     forget why it's there.
// ⚠️ Path aliases need both tsconfig AND bundler support.
// ⚠️ `import.meta` is illegal in CommonJS modules.
// ⚠️ Under `verbatimModuleSyntax`, you MUST use `import type` for types.
// ⚠️ Circular imports: values may be `undefined` at first use.

// 🕒 Version notes
// - Dynamic import(): ES2020 / TS 2.4
// - `import type`: TS 3.8
// - Inline `type` modifiers: TS 4.5
// - `import ... with { type: "json" }`: TS 5.3
// - `moduleResolution: "bundler"`: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Import form                     | Syntax                         |
 * ─────────────────────────────────────────────────────────────
 * | Named                           | import { a, b } from "./m"     |
 * | Named + rename                  | import { a as x } from "./m"   |
 * | Default                         | import x from "./m"            |
 * | Default + named                 | import x, { a } from "./m"     |
 * | Namespace                       | import * as M from "./m"       |
 * | Side-effect                     | import "./m"                   |
 * | Type-only                       | import type { T } from "./m"   |
 * | Inline type                     | import { type T, f } from "./m"|
 * | Dynamic                         | const m = await import("./m")  |
 * | JSON assert/attr                | import j from "./j.json" with {type:"json"} |
 * | Meta                            | import.meta.url                |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer named imports over default.
 *  - Use `import type` for types — smaller output.
 *  - Prefer static imports; use dynamic for lazy-loading.
 *  - Avoid barrel files that pull in large sub-graphs.
 *  - Configure `moduleResolution: "bundler"` for Vite/esbuild.
 *  - Set `esModuleInterop: true` for CJS compatibility.
 *  - Enable `verbatimModuleSyntax` (TS 5.0+) for explicit type imports.
 *  - Include `.js` extensions in relative ESM imports for Node.
 *  - Watch circular imports — restructure to break cycles.
 *  - Use path aliases consistently across tsconfig and bundler.
 * ============================================================ */