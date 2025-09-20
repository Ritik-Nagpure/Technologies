// ambient-modules.d.ts
// ✅ This is a TypeScript declaration file for ambient modules.

// ─────────────────────────────────────────────────────────────
// 🧠 WHAT IS AN AMBIENT MODULE?
// An ambient module is a way to tell TypeScript about the shape of a module
// that exists at runtime but has no type information available.
// This is common when using untyped JavaScript libraries or virtual modules.

// ─────────────────────────────────────────────────────────────
// 🧠 WHY USE AMBIENT MODULES?
// - To enable type-safe imports from external or untyped sources.
// - To avoid TypeScript errors when importing modules without definitions.
// - To provide IntelliSense and type checking for custom or third-party code.

// ─────────────────────────────────────────────────────────────
// 📦 EXAMPLE: Declaring an ambient module for a JS library

declare module 'my-external-lib' {
  // Function exported by the module
  export function greet(name: string): string;

  // Constant exported by the module
  export const version: string;
}

// ─────────────────────────────────────────────────────────────
// 📦 EXAMPLE: Declaring ambient modules for non-code assets

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// ─────────────────────────────────────────────────────────────
// 🧠 NOTES:
// - Ambient modules must be declared in `.d.ts` files.
// - They do not contain implementation—only type information.
// - TypeScript automatically includes `.d.ts` files in compilation.
// - You don't need to import them manually—they're global to the project.
