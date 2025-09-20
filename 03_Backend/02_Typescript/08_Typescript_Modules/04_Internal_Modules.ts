// internal-module.ts
// ✅ Internal modules use the `namespace` keyword.
// ✅ They are bundled in the same file or project and do not use import/export.

namespace Logger {
  export function log(message: string) {
    console.log('Log:', message);
  }

  export function error(message: string) {
    console.error('Error:', message);
  }
}

// ✅ Usage of internal module
Logger.log('Hello from internal module');
Logger.error('Something went wrong');

// 🧠 Internal Modules:
// - Use `namespace`
// - No import/export needed
// - Good for small projects or browser scripts
// - Can lead to global scope pollution

