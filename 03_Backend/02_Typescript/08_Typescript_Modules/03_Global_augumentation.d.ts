// global-augmentation.d.ts
// ✅ Global augmentation in Node.js lets you extend the `global` object.
// ✅ Useful for adding shared config, utilities, or mocking globals in tests.

export {}; // Ensures this file is treated as a module

// ─────────────────────────────────────────────────────────────
// 🧠 WHAT IS GLOBAL AUGMENTATION?
// Global augmentation means extending built-in global types like `globalThis` in Node.js.
// This allows TypeScript to recognize custom properties on the global object.

declare global {
  namespace NodeJS {
    interface Global {
      appName: string;
      logInfo(message: string): void;
    }
  }
}


// ─────────────────────────────────────────────────────────────
// 🧠 Summary:
// - Use `declare global {}` to extend NodeJS.Global or globalThis.
// - Must be in a `.d.ts` file with `export {}` to ensure module context.
// - TypeScript merges your declarations with built-in types.
// - Great for shared globals, test mocks, or runtime config.


