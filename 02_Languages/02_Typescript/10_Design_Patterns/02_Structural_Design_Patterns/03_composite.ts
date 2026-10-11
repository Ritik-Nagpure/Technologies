// 05_Classes_OOP/15_Composite_Pattern.ts

/* ============================================================
 *  📘 THE COMPOSITE PATTERN IN TYPESCRIPT
 *
 *  Composite lets you compose objects into TREE structures and
 *  work with them as if they were individual objects.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Composite solves
 *   4. Basic implementation (file system)
 *   5. Another example (UI components)
 *   6. Safe vs transparent composite
 *   7. Generic composite (type-safe)
 *   8. Iterator / visitor integration
 *   9. Real-world use cases
 *  10. Pros & cons
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// A tree structure where LEAF nodes and COMPOSITE nodes share the
// same interface. Clients treat both uniformly:
//
//        Composite
//        /       \
//    Leaf      Composite
//               /      \
//            Leaf      Leaf
//
// Calling `operation()` on a composite delegates to children.
// Client code doesn't care whether it's talking to a leaf or
// a subtree — same interface.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌─────────────────────┬──────────────────────────────────────────┐
// │ Role                │ Responsibility                            │
// ├─────────────────────┼──────────────────────────────────────────┤
// │ Component           │ Common interface for leaves & composites  │
// │ Leaf                │ Primitive element — no children           │
// │ Composite           │ Holds children, delegates operations      │
// │ Client              │ Works with Component uniformly            │
// └─────────────────────┴──────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM COMPOSITE SOLVES
 * ============================================================ */

// Without Composite, you end up with:
//   - Type checks ("is this a Leaf or a Group?")
//   - Special-case code for trees
//   - Recursion boilerplate repeated in every operation
//
// Composite pushes the recursion INTO the tree structure, so the
// client calls one method and gets the right behavior.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — FILE SYSTEM
 * ============================================================ */

// ─── Component ───
interface FileSystemNode {
  getName(): string;
  getSize(): number;         // total bytes (recursive for folders)
  print(indent?: string): void;
}

// ─── Leaf ───
class FileNode implements FileSystemNode {
  constructor(private name: string, private size: number) {}

  getName(): string { return this.name; }
  getSize(): number { return this.size; }
  print(indent = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.size} bytes)`);
  }
}

// ─── Composite ───
class FolderNode implements FileSystemNode {
  private children: FileSystemNode[] = [];

  constructor(private name: string) {}

  getName(): string { return this.name; }

  add(node: FileSystemNode): this {
    this.children.push(node);
    return this;
  }

  remove(node: FileSystemNode): void {
    this.children = this.children.filter((c) => c !== node);
  }

  // 🔸 Recursive aggregation
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  // 🔸 Recursive rendering
  print(indent = ""): void {
    console.log(`${indent}📁 ${this.name} (${this.getSize()} bytes)`);
    for (const child of this.children) {
      child.print(indent + "  ");
    }
  }
}

// ─── Client code — treats leaves and folders the same ───
const root = new FolderNode("root");
const docs = new FolderNode("docs");
const images = new FolderNode("images");

root.add(docs).add(images);
docs.add(new FileNode("readme.md", 1200));
docs.add(new FileNode("guide.md", 3400));
images.add(new FileNode("logo.png", 15000));
images.add(new FileNode("banner.png", 22000));

root.print();
// 📁 root (41600 bytes)
//   📁 docs (4600 bytes)
//     📄 readme.md (1200 bytes)
//     📄 guide.md (3400 bytes)
//   📁 images (37000 bytes)
//     📄 logo.png (15000 bytes)
//     📄 banner.png (22000 bytes)

console.log(root.getSize()); // 41600

/* ============================================================
 *  5️⃣ ANOTHER EXAMPLE — UI COMPONENTS
 * ============================================================ */

interface UIComponent {
  render(): string;
}

class Text implements UIComponent {
  constructor(private content: string) {}
  render(): string { return this.content; }
}

class Button implements UIComponent {
  constructor(private label: string) {}
  render(): string { return `[Button: ${this.label}]`; }
}

class Panel implements UIComponent {
  private children: UIComponent[] = [];

  add(child: UIComponent): this {
    this.children.push(child);
    return this;
  }

  render(): string {
    return this.children.map((c) => c.render()).join("\n");
  }
}

const ui = new Panel()
  .add(new Text("Welcome"))
  .add(new Button("OK"))
  .add(new Panel().add(new Button("Cancel")).add(new Text("...")));

console.log(ui.render());

/* ============================================================
 *  6️⃣ SAFE vs TRANSPARENT COMPOSITE
 * ============================================================ */

// ─── Transparent composite ───
// Component interface has `add/remove/getChildren`. Client treats
// leaves and composites the same, but leaves must throw / no-op
// for those methods. Type-unsafe in strict mode.

interface TransparentComponent {
  operation(): string;
  add?(child: TransparentComponent): void;       // optional → leaves omit
  remove?(child: TransparentComponent): void;
}

// ─── Safe composite ───
// Component interface contains ONLY common operations.
// Composite adds child-management methods. Client must know when
// it's dealing with a composite.

interface SafeComponent {
  operation(): string;
}

interface SafeComposite extends SafeComponent {
  add(child: SafeComponent): void;
  remove(child: SafeComponent): void;
  getChildren(): SafeComponent[];
}

// 🧠 Safe composite is preferred in TypeScript — type-safe and clear.

/* ============================================================
 *  7️⃣ GENERIC COMPOSITE (TYPE-SAFE)
 * ============================================================ */

// A generic tree where any node can be a leaf or a branch.

type Visit<T, R> = (value: T, depth: number) => R;

class TreeNode<T> {
  private children: TreeNode<T>[] = [];

  constructor(public value: T) {}

  add(child: TreeNode<T>): this {
    this.children.push(child);
    return this;
  }

  remove(child: TreeNode<T>): void {
    this.children = this.children.filter((c) => c !== child);
  }

  // 🔸 Depth-first traversal
  walk<R>(visit: Visit<T, R>, depth = 0): R[] {
    const results: R[] = [visit(this.value, depth)];
    for (const child of this.children) {
      results.push(...child.walk(visit, depth + 1));
    }
    return results;
  }

  // 🔸 Aggregation (functional)
  fold<R>(leaf: (v: T) => R, combine: (acc: R, cur: R) => R): R {
    const own = leaf(this.value);
    return this.children.reduce(
      (acc, child) => combine(acc, child.fold(leaf, combine)),
      own
    );
  }
}

// ─── Usage ───
const tree = new TreeNode<number>(1)
  .add(new TreeNode(2).add(new TreeNode(3)).add(new TreeNode(4)))
  .add(new TreeNode(5));

console.log(tree.walk((v, d) => `${"  ".repeat(d)}${v}`));
console.log(tree.fold((v) => v, (a, b) => a + b)); // 15

/* ============================================================
 *  8️⃣ ITERATOR / VISITOR INTEGRATION
 * ============================================================ */

// 🔸 Make composite iterable
class IterableTreeNode<T> implements Iterable<T> {
  private children: IterableTreeNode<T>[] = [];

  constructor(public value: T) {}

  add(child: IterableTreeNode<T>): this {
    this.children.push(child);
    return this;
  }

  *[Symbol.iterator](): Iterator<T> {
    yield this.value;
    for (const child of this.children) {
      yield* child;
    }
  }
}

const iterTree = new IterableTreeNode("a").add(
  new IterableTreeNode("b").add(new IterableTreeNode("c"))
);
for (const v of iterTree) console.log(v); // a b c

// 🔸 Visitor pattern integration
interface Visitor<T> {
  visitLeaf(node: T): void;
  visitComposite(node: T): void;
}

// Visitor keeps operations OUT of node classes — useful for many
// different tree traversals without adding methods.

/* ============================================================
 *  9️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - File systems (files + folders)
// - UI trees (React / DOM node hierarchies)
// - Document structure (paragraphs, sections, tables)
// - Organization charts (employees + departments)
// - Menu systems (items + submenus)
// - Graphics (shapes + groups)
// - AST trees (compiler / linter)
// - Scene graphs (games / 3D rendering)
// - Report structures (rows + columns + sections)
//
// Frameworks using Composite-like structures:
//   - React (virtual DOM)
//   - Angular (component trees)
//   - Vue (component trees)
//   - Babel (AST nodes)
//   - TypeScript compiler (SyntaxTree)
//   - HTML DOM (Node / Element / DocumentFragment)

/* ============================================================
 *  🔟 PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Uniform treatment of leaves and composites
//  - Recursion is baked into the structure
//  - Open/Closed — add new node types easily
//  - Simple client code
//  - Natural fit for hierarchical data
//
// ❌ Cons
//  - Component interface can become too broad if you force uniformity
//  - Deep recursion risks stack overflow for very tall trees
//  - Caching/mutation must be managed carefully in composites
//  - Type safety degrades with "transparent" composites in languages
//    without variadic generics

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Parent references — if children point back to parents, watch
//     for cycles and memory leaks. Use `WeakRef` where needed.
// ⚠️ Deep recursion on tall trees can blow the stack — use an
//     explicit stack-based traversal for production systems.
// ⚠️ Cache computed values (like `getSize()`) only when the tree is
//     stable — invalidation is the hard part.
// ⚠️ "Transparent" composites (where leaves must implement add/remove)
//     break type safety — prefer SAFE composites in TS.
// ⚠️ Beware of shared children — a node added to two parents will be
//     traversed twice. Enforce single-parent ownership or use DAG
//     semantics deliberately.
// ⚠️ Mutation during traversal can skip or repeat nodes — iterate
//     over a snapshot if you plan to modify.
// ⚠️ In TS, recursive types (`type Tree = T | Tree[]`) work but the
//     class-based approach gives you methods and identity.
// ⚠️ `Symbol.iterator` on a composite should be a well-defined order
//     (typically pre-order DFS) — document it.

// 🕒 Version notes
// - Composite pattern: GoF, 1994
// - Iterable / `Symbol.iterator`: ES2015 / TS 2.3
// - Generator functions: ES2015 / TS 2.3
// - Recursive conditional types: TS 4.1
// - Variadic tuple types: TS 4.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept      │ Notes                                         │
 * ─────────────────────────────────────────────────────────────
 * | Component    │ Common interface for leaves + composites      │
 * | Leaf         │ No children — primitive element               │
 * | Composite    │ Holds children — delegates operations         │
 * | Client       │ Treats everything as Component                │
 * ─────────────────────────────────────────────────────────────
 *
 * | Safe vs Transparent    │ Trade-off                          │
 * ─────────────────────────────────────────────────────────────
 * | Safe composite         │ Type-safe; client checks children   │
 * | Transparent composite  │ Uniform API; leaves must no-op      │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer SAFE composites in TypeScript — keep child-management
 *    methods on the Composite, not the Component.
 *  - Use a shared interface for operations both leaves and composites
 *    must support.
 *  - Enforce single-parent ownership to avoid cycle bugs.
 *  - Use iterative traversal for very deep trees.
 *  - Expose `Symbol.iterator` for a defined traversal order.
 *  - Consider a Visitor when you'll add many operations later.
 *  - Cache computed results only when the tree is stable.
 *  - Document traversal order — pre-order DFS is a common default.
 *  - Generic composites (`TreeNode<T>`) improve type safety when
 *    node values vary.
 *  - Use the pattern whenever your domain IS hierarchical — files,
 *    menus, UI, ASTs, org charts.
 * ============================================================ */