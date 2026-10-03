// main.ts
// ✅ Importing from an external module

import { add, multiply } from './05_Export_Module.js';

console.log('Add:', add(2, 3));         // Output: Add: 5
console.log('Multiply:', multiply(4, 5)); // Output: Multiply: 20

// ─────────────────────────────────────────────────────────────

// 🧠 External Modules:
// - Use `export` and `import`
// - Each file is its own module
// - Preferred in modern TypeScript
// - Works well with bundlers (Webpack, ESBuild, etc.)
