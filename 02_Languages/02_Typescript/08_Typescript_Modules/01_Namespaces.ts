// geometry.ts
// ✅ TypeScript namespaces group related code under a single name.
// ✅ Useful for organizing related logic without using modules.
// ✅ Ideal for browser-based projects or internal grouping in large codebases.

// ─────────────────────────────────────────────────────────────
// 🧠 NAMESPACE: Geometry
// This namespace contains types and functions related to 2D geometry.
// All members are exported so they can be accessed outside the namespace.

namespace Geometry {
  // ──────────────── TYPE ────────────────
  // 📐 Point: Represents a coordinate in 2D space.
  export type Point = { x: number; y: number };

  // ──────────────── FUNCTION ────────────────
  // 📏 distance: Calculates the Euclidean distance between two points.
  export function distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ➕ add: Adds two points together (vector addition).
  export function add(p1: Point, p2: Point): Point {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }

  // ➖ subtract: Subtracts one point from another.
  export function subtract(p1: Point, p2: Point): Point {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }
}

// ─────────────────────────────────────────────────────────────
// 🧪 USAGE EXAMPLES
// Demonstrates how to use the Geometry namespace and its members.

const a: Geometry.Point = { x: 0, y: 0 };
const b: Geometry.Point = { x: 3, y: 4 };

console.log('Distance:', Geometry.distance(a, b)); // Output: 5
console.log('Added Point:', Geometry.add(a, b));   // Output: { x: 3, y: 4 }
console.log('Subtracted Point:', Geometry.subtract(b, a)); // Output: { x: 3, y: 4 }

// ─────────────────────────────────────────────────────────────
// 🧠 Summary Notes:
// - Namespaces group related code under a single identifier.
// - Use `export` to expose members.
// - Access members using `NamespaceName.memberName`.
// - Prefer modules (`import/export`) in modern TypeScript unless namespaces are required.

// 📦 What Is Namespace Augmentation?
// ✅ Namespace augmentation allows you to add new members to an existing namespace.
// ✅ Useful for extending third-party libraries, organizing code, or splitting logic across files.
// ✅ Works even if the original namespace is declared in another file or module.


namespace Geometry {
  export function multiply(a: Point, b: Point): Point {
    return { x: (a.x * b.x), y: (a.y * b.y) }
  }
}

console.log('Distance:', Geometry.multiply(a, b));     // Output: 5


// ─────────────────────────────────────────────────────────────
// 🧠 Namespace Augmentation Summary:
// - Declare the same namespace name again to extend it.
// - All declarations must use `export` to be accessible.
// - Works across multiple files or within the same file.
// - Commonly used to extend third-party namespaces or organize large codebases.


