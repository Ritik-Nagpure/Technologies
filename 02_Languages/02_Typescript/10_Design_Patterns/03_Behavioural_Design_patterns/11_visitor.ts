// 05_Classes_OOP/24_Visitor_Pattern.ts

/* ============================================================
 *  📘 THE VISITOR PATTERN IN TYPESCRIPT
 *
 *  Visitor lets you add NEW OPERATIONS to a group of objects
 *  WITHOUT changing the classes themselves.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Visitor solves
 *   4. Basic implementation (shapes)
 *   5. Double dispatch explained
 *   6. Visitor with state / accumulator
 *   7. Generic visitor (type-safe)
 *   8. Visitor over a tree (Composite + Visitor)
 *   9. Functional alternative — discriminated unions + switch
 *  10. Real-world use cases
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Normally, adding an operation to a class hierarchy means
// editing EVERY class. With many operations × many classes,
// classes become bloated.
//
// Visitor moves OPERATIONS OUT of the elements and into
// visitor classes. Each element only needs ONE method:
// `accept(visitor)`, which calls the right visitor method.
//
//   Element.accept(v) → v.visitElement(this)
//
// Adding a new operation = new Visitor class.
// You DON'T touch the element classes.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌─────────────────────┬────────────────────────────────────────┐
// │ Role                │ Responsibility                          │
// ├─────────────────────┼────────────────────────────────────────┤
// │ Visitor             │ Interface: visit methods per element    │
// │ ConcreteVisitor     │ One per operation (e.g., area, render)  │
// │ Element             │ Interface: `accept(visitor)`            │
// │ ConcreteElement     │ Calls the visitor's matching method     │
// │ Client              │ Picks element + visitor, calls accept   │
// └─────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM VISITOR SOLVES
 * ============================================================ */

// Suppose you have a Shape hierarchy: Circle, Square, Triangle.
// Operations needed: area, perimeter, SVG render, PDF render,
// bounding box, scaling, colorizing, exporting...
//
// WITHOUT Visitor:
//   class Circle { area(); perimeter(); toSVG(); toPDF(); ... }
//   class Square { area(); perimeter(); toSVG(); toPDF(); ... }
//   Every new operation touches every class.
//
// WITH Visitor:
//   class Circle { accept(v) { v.visitCircle(this); } }
//   Every new operation = a new Visitor class.
//   Element classes NEVER change.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — SHAPES
 * ============================================================ */

// ─── Visitor interface ───
interface ShapeVisitor<R> {
  visitCircle(c: Circle): R;
  visitSquare(s: Square): R;
  visitTriangle(t: Triangle): R;
}

// ─── Element interface ───
interface Shape {
  accept<R>(visitor: ShapeVisitor<R>): R;
}

// ─── Concrete Elements ───
class Circle implements Shape {
  constructor(public radius: number) {}
  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitCircle(this);
  }
}

class Square implements Shape {
  constructor(public side: number) {}
  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitSquare(this);
  }
}

class Triangle implements Shape {
  constructor(public base: number, public height: number) {}
  accept<R>(visitor: ShapeVisitor<R>): R {
    return visitor.visitTriangle(this);
  }
}

// ─── Concrete Visitor: Area ───
class AreaVisitor implements ShapeVisitor<number> {
  visitCircle(c: Circle): number { return Math.PI * c.radius ** 2; }
  visitSquare(s: Square): number { return s.side ** 2; }
  visitTriangle(t: Triangle): number { return 0.5 * t.base * t.height; }
}

// ─── Concrete Visitor: SVG Renderer ───
class SvgVisitor implements ShapeVisitor<string> {
  visitCircle(c: Circle): string {
    return `<circle r="${c.radius}" />`;
  }
  visitSquare(s: Square): string {
    return `<rect width="${s.side}" height="${s.side}" />`;
  }
  visitTriangle(t: Triangle): string {
    return `<polygon points="0,${t.height} ${t.base},${t.height} ${t.base / 2},0" />`;
  }
}

// ─── Concrete Visitor: Bounding Box ───
class BoundingBoxVisitor implements ShapeVisitor<{ w: number; h: number }> {
  visitCircle(c: Circle) { return { w: c.radius * 2, h: c.radius * 2 }; }
  visitSquare(s: Square) { return { w: s.side, h: s.side }; }
  visitTriangle(t: Triangle) { return { w: t.base, h: t.height }; }
}

// ─── Client ───
const shapes: Shape[] = [
  new Circle(2),
  new Square(3),
  new Triangle(4, 5),
];

const areaVisitor = new AreaVisitor();
const svgVisitor = new SvgVisitor();
const bboxVisitor = new BoundingBoxVisitor();

for (const s of shapes) {
  console.log(s.accept(areaVisitor));    // area
  console.log(s.accept(svgVisitor));     // svg
  console.log(s.accept(bboxVisitor));    // bounding box
}

// 🧠 Adding a new visitor = new class. No element touched.

/* ============================================================
 *  5️⃣ DOUBLE DISPATCH EXPLAINED
 * ============================================================ */

// Visitor relies on DOUBLE DISPATCH:
//
//   1st dispatch: `shape.accept(visitor)` — picks the concrete
//      element's method (which element am I?).
//   2nd dispatch: inside accept, `visitor.visitCircle(this)`
//      picks the right visitor method (which operation?).
//
// TS/JS are single-dispatch languages — methods dispatch on the
// receiver only. Visitor simulates double dispatch by explicitly
// routing through `accept`.

/* ============================================================
 *  6️⃣ VISITOR WITH STATE / ACCUMULATOR
 * ============================================================ */

// A visitor can carry state — accumulate results, count visits,
// build outputs progressively.

class PerimeterVisitor implements ShapeVisitor<number> {
  visitCircle(c: Circle) { return 2 * Math.PI * c.radius; }
  visitSquare(s: Square) { return 4 * s.side; }
  visitTriangle(t: Triangle) {
    // No hypotenuse info — assume right triangle
    const hyp = Math.sqrt(t.base ** 2 + t.height ** 2);
    return t.base + t.height + hyp;
  }
}

class StatsVisitor implements ShapeVisitor<void> {
  totalArea = 0;
  count = 0;

  visitCircle(c: Circle) {
    this.totalArea += Math.PI * c.radius ** 2;
    this.count++;
  }
  visitSquare(s: Square) {
    this.totalArea += s.side ** 2;
    this.count++;
  }
  visitTriangle(t: Triangle) {
    this.totalArea += 0.5 * t.base * t.height;
    this.count++;
  }
}

const stats = new StatsVisitor();
for (const s of shapes) s.accept(stats);
console.log(`Visited ${stats.count} shapes, total area ${stats.totalArea.toFixed(2)}`);

/* ============================================================
 *  7️⃣ GENERIC VISITOR (TYPE-SAFE)
 * ============================================================ */

// A reusable generic visitor interface parameterized by the
// element union and return type.

interface GenericVisitor<TUnion, R> {
  visit<N extends TUnion>(node: N): R;
}

// 🔸 Concrete example — expression tree (AST) evaluation
type Expr =
  | { kind: "num"; value: number }
  | { kind: "add"; left: Expr; right: Expr }
  | { kind: "mul"; left: Expr; right: Expr };

class EvalVisitor {
  visit(node: Expr): number {
    switch (node.kind) {
      case "num": return node.value;
      case "add": return this.visit(node.left) + this.visit(node.right);
      case "mul": return this.visit(node.left) * this.visit(node.right);
    }
  }
}

class PrintVisitor {
  visit(node: Expr): string {
    switch (node.kind) {
      case "num": return String(node.value);
      case "add": return `(${this.visit(node.left)} + ${this.visit(node.right)})`;
      case "mul": return `(${this.visit(node.left)} * ${this.visit(node.right)})`;
    }
  }
}

const expr: Expr = {
  kind: "add",
  left: { kind: "num", value: 3 },
  right: {
    kind: "mul",
    left: { kind: "num", value: 5 },
    right: { kind: "num", value: 2 },
  },
};

console.log(new EvalVisitor().visit(expr));    // 13
console.log(new PrintVisitor().visit(expr));   // (3 + (5 * 2))

/* ============================================================
 *  8️⃣ VISITOR OVER A TREE (COMPOSITE + VISITOR)
 * ============================================================ */

// Combining Composite + Visitor is the classic real-world combo:
// walk a tree, apply an operation at each node.

interface FileSystemVisitor<R> {
  visitFile(file: FsFile): R;
  visitFolder(folder: FsFolder): R;
}

interface FsNode {
  accept<R>(visitor: FileSystemVisitor<R>): R;
}

class FsFile implements FsNode {
  constructor(public name: string, public size: number) {}
  accept<R>(visitor: FileSystemVisitor<R>): R {
    return visitor.visitFile(this);
  }
}

class FsFolder implements FsNode {
  children: FsNode[] = [];
  constructor(public name: string) {}
  add(node: FsNode): this { this.children.push(node); return this; }
  accept<R>(visitor: FileSystemVisitor<R>): R {
    return visitor.visitFolder(this);
  }
}

// 🔸 Size visitor — recursive
class SizeVisitor implements FileSystemVisitor<number> {
  visitFile(file: FsFile): number { return file.size; }
  visitFolder(folder: FsFolder): number {
    return folder.children.reduce(
      (sum, child) => sum + child.accept(this),
      0
    );
  }
}

// 🔸 List visitor — builds a flat list of paths
class ListVisitor implements FileSystemVisitor<string[]> {
  private path: string[] = [];

  visitFile(file: FsFile): string[] {
    return [...this.path, file.name];
  }

  visitFolder(folder: FsFolder): string[] {
    this.path.push(folder.name);
    const results: string[] = [];
    for (const child of folder.children) {
      results.push(...child.accept(this));
    }
    this.path.pop();
    return results;
  }
}

const root = new FsFolder("root")
  .add(new FsFile("readme.md", 1200))
  .add(
    new FsFolder("src")
      .add(new FsFile("index.ts", 800))
      .add(new FsFile("app.ts", 1500))
  );

console.log(root.accept(new SizeVisitor()));     // 3500
console.log(root.accept(new ListVisitor()));     // ["root","readme.md","root","src","index.ts",...]

/* ============================================================
 *  9️⃣ FUNCTIONAL ALTERNATIVE — DISCRIMINATED UNIONS + SWITCH
 * ============================================================ */

// In modern TypeScript, VISITOR is often replaced by discriminated
// unions + exhaustive switches. Same effect, less boilerplate.

type Shape2 =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

// One function per operation — no `accept`, no visitor class.
function area2(s: Shape2): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    case "triangle": return 0.5 * s.base * s.height;
  }
}

function toSvg2(s: Shape2): string {
  switch (s.kind) {
    case "circle": return `<circle r="${s.radius}" />`;
    case "square": return `<rect width="${s.side}" height="${s.side}" />`;
    case "triangle":
      return `<polygon points="0,${s.height} ${s.base},${s.height} ${s.base / 2},0" />`;
  }
}

// 🧠 Same benefit (new operation = new function, no element changes)
//    with ZERO visitor ceremony. Prefer this in modern TS unless:
//    - Elements are CLASSES with state and methods, or
//    - You want polymorphic dispatch across many element types.

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - Compilers / interpreters (type check, optimize, emit per AST node)
// - Linters (per-node rule checks)
// - Code formatters (per-node rendering)
// - Graphics systems (render, bounds, hit-test per shape)
// - Document exporters (render a document to PDF/HTML/DOCX)
// - File system scans (size, list, search)
// - Serialization frameworks (JSON, XML, binary per type)
// - Expression evaluators (see §7)
// - Sorting / comparing heterogeneous collections
// - Tree/graph traversals with a per-node operation
//
// Frameworks / systems using Visitor-like ideas:
//   - Babel plugins (per-node visitors)
//   - ESLint rules (per-node)
//   - TypeScript compiler (per-node checks)
//   - PostCSS visitors
//   - GraphQL AST visitors
//   - Rollup/Rollup plugins

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Add new OPERATIONS without touching element classes
//  - Related behavior centralized in one visitor class
//  - Visitors can carry state (accumulators)
//  - Double dispatch works across a heterogeneous hierarchy
//  - Great fit for ASTs, trees, and compiler-like workloads
//
// ❌ Cons
//  - Adding a new ELEMENT type requires touching every visitor
//  - Double dispatch adds indirection and complexity
//  - Boilerplate — each element needs `accept`
//  - Visitor breaks encapsulation if it needs internal state
//  - Overkill for small hierarchies or one-off operations

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Visitor is best when ELEMENTS are stable but OPERATIONS change.
//     If elements also change, prefer discriminated unions + switch.
// ⚠️ Adding a new element means editing every visitor — plan for it.
// ⚠️ `accept<R>` should be GENERIC in the return type so different
//     visitors can return different things.
// ⚠️ The `accept` method must call the right `visit*` — typos here
//     cause infinite loops or wrong dispatch.
// ⚠️ Visitors with state must be single-use or reset between runs.
// ⚠️ Under strict mode, use exhaustive `switch` with `never` for
//     sealed hierarchies so adding a case is caught at compile time.
// ⚠️ Modern TS often prefers discriminated unions + switch — less
//     boilerplate for the same benefit. Use Visitor when elements
//     are CLASSES with behavior/state.
// ⚠️ Don't use Visitor just to "look OO" — it has real cost.
// ⚠️ Recursion depth: deep ASTs can blow the stack — consider
//     iterative traversal for very large trees.
// ⚠️ Interfaces with many visit methods become painful; split into
//     focused visitors per operation family if needed.

// 🕒 Version notes
// - Visitor pattern: GoF, 1994
// - Generic methods (`accept<R>`): TS 1.0
// - Discriminated unions + exhaustive switch: TS 2.0+
// - `never` exhaustiveness helper: TS 2.0+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role             │ Notes                                      │
 * ─────────────────────────────────────────────────────────────
 * | Visitor          │ One visit method per element type          │
 * | ConcreteVisitor  │ One operation per class                    │
 * | Element          │ `accept(visitor)` routes to correct visit  │
 * | ConcreteElement  │ Calls the visitor's specific method        │
 * | Client           │ Combines element + visitor                 │
 * ─────────────────────────────────────────────────────────────
 *
 * | Pattern     │ When to prefer                                 │
 * ─────────────────────────────────────────────────────────────
 * | Visitor     │ Stable elements, many operations, classes      │
 * | D-Union     │ Modern TS — fewer boilerplate, same benefit    │
 * | Composite   │ Tree structure; often combined with Visitor    │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use Visitor when the ELEMENT hierarchy is STABLE and you'll
 *    add MANY operations.
 *  - Make `accept<R>` generic in the RETURN type.
 *  - Keep each visitor focused on ONE operation.
 *  - Prefer exhaustive `switch` + discriminated unions in modern TS.
 *  - Combine with Composite for tree traversals (AST, files).
 *  - Guard recursion depth on huge trees.
 *  - Reset stateful visitors between runs.
 *  - Don't force Visitor on small hierarchies — function + switch wins.
 *  - Type the visitor interface generically when many return types.
 *  - Remember: adding an ELEMENT means editing every visitor.
 * ============================================================ */