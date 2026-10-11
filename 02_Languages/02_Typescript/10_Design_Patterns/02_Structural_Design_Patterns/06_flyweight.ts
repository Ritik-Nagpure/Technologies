// 05_Classes_OOP/18_Flyweight_Pattern.ts

/* ============================================================
 *  📘 THE FLYWEIGHT PATTERN IN TYPESCRIPT
 *
 *  Flyweight lets you fit MORE objects into memory by SHARING
 *  common state (intrinsic) across many objects, while keeping
 *  per-object state (extrinsic) external.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Flyweight solves
 *   4. Intrinsic vs extrinsic state
 *   5. Basic implementation (tree forest)
 *   6. Flyweight factory with cache
 *   7. Another example (text characters)
 *   8. Generic flyweight factory
 *   9. Real-world use cases
 *  10. Flyweight vs Singleton vs Object Pool
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// When you need MILLIONS of similar objects, storing all their
// data individually wastes memory.
//
// Flyweight splits object state into:
//   - INTRINSIC state — shared, immutable, stored ONCE
//   - EXTRINSIC state — unique per object, stored OUTSIDE
//
// Many objects SHARE the same intrinsic flyweight instance and
// pass their extrinsic state as method arguments.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬───────────────────────────────────────────┐
// │ Role                 │ Responsibility                             │
// ├──────────────────────┼───────────────────────────────────────────┤
// │ Flyweight            │ Stores intrinsic state; methods take ext.  │
// │ ConcreteFlyweight    │ The actual shared object                   │
// │ FlyweightFactory     │ Caches & hands out shared flyweights       │
// │ Client               │ Holds extrinsic state; requests flyweights │
// └──────────────────────┴───────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM FLYWEIGHT SOLVES
 * ============================================================ */

// Forest simulation with 1,000,000 trees.
//
// ❌ Naive approach — store everything per tree:
//
//   class Tree {
//     x, y;             // 8 bytes each
//     name;             // "Oak" — 3 bytes × 1M = ~3 MB (!!!)
//     color;            // RGB — 12 bytes × 1M
//     texture;          // big object × 1M — blows up RAM
//   }
//
// ✅ Flyweight approach:
//
//   class TreeType {    // SHARED — one instance per unique kind
//     name; color; texture;
//   }
//   class Tree {        // MANY — only per-instance data
//     x, y;
//     type: TreeType;   // REFERENCE, not a copy
//   }
//
// Memory: M unique TreeTypes + N lightweight Tree records.

/* ============================================================
 *  4️⃣ INTRINSIC vs EXTRINSIC STATE
 * ============================================================ */

// ┌────────────────────┬─────────────────────┬───────────────────────┐
// │ Aspect             │ Intrinsic            │ Extrinsic            │
// ├────────────────────┼─────────────────────┼───────────────────────┤
// │ Who owns it        │ Flyweight            │ Client / context     │
// │ Shared?            │ ✅ yes               │ ❌ no                │
// │ Mutable?           │ ❌ immutable         │ ✅ mutable           │
// │ Stored where       │ Inside the flyweight │ Passed to methods    │
// │ Example            │ tree texture, color  │ tree x, y position   │
// └────────────────────┴─────────────────────┴───────────────────────┘

/* ============================================================
 *  5️⃣ BASIC IMPLEMENTATION — TREE FOREST
 * ============================================================ */

// ─── Flyweight: shared, immutable ───
class TreeType {
  constructor(
    public readonly name: string,
    public readonly color: string,
    public readonly texture: string
  ) {}

  // Draw takes EXTRINSIC state from the caller
  draw(x: number, y: number): void {
    console.log(`Draw ${this.name} at (${x}, ${y}) with texture ${this.texture}`);
  }
}

// ─── Factory: caches flyweights ───
class TreeFactory {
  private static cache = new Map<string, TreeType>();

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}|${color}|${texture}`;
    let type = this.cache.get(key);
    if (!type) {
      type = new TreeType(name, color, texture);
      this.cache.set(key, type);
      console.log(`Created new TreeType: ${key}`);
    }
    return type;
  }

  static getCacheSize(): number {
    return this.cache.size;
  }
}

// ─── Context: many of these, but they're LIGHTWEIGHT ───
class Tree {
  constructor(
    private x: number,
    private y: number,
    private type: TreeType    // reference to shared flyweight
  ) {}

  draw(): void { this.type.draw(this.x, this.y); }
}

// ─── Forest client ───
class Forest {
  private trees: Tree[] = [];

  plantTree(x: number, y: number, name: string, color: string, texture: string) {
    const type = TreeFactory.getTreeType(name, color, texture);
    this.trees.push(new Tree(x, y, type));
  }

  draw() { for (const t of this.trees) t.draw(); }
}

const forest = new Forest();
for (let i = 0; i < 1000; i++) {
  forest.plantTree(i, i, "Oak", "green", "oak.png");
  forest.plantTree(i, i + 1, "Pine", "dark-green", "pine.png");
}

console.log(`Total TreeTypes: ${TreeFactory.getCacheSize()}`); // 2
// forest.draw();   // 2000 draw calls — but only 2 TreeType objects

// 🧠 2000 trees share just 2 TreeTypes.

/* ============================================================
 *  6️⃣ FLYWEIGHT FACTORY WITH CACHE
 * ============================================================ */

// The factory is ESSENTIAL — without caching, you don't get sharing.
// A well-designed factory:
//   - Returns existing flyweights when the key matches
//   - Creates new ones only for NEW intrinsic states
//   - Is often a singleton or module-level Map

// 🔸 Generic flyweight factory keyed by any string
class FlyweightFactory<K extends string, T> {
  private cache = new Map<K, T>();

  get(key: K, create: () => T): T {
    let item = this.cache.get(key);
    if (!item) {
      item = create();
      this.cache.set(key, item);
    }
    return item;
  }

  size(): number { return this.cache.size; }
  clear(): void { this.cache.clear(); }
}

// 🔸 WeakMap variant — auto-GC when keys are unused
const weakCache = new WeakMap<object, unknown>();
function getOrCreate<K extends object, V>(key: K, make: () => V): V {
  let v = weakCache.get(key) as V | undefined;
  if (!v) { v = make(); weakCache.set(key, v); }
  return v;
}

/* ============================================================
 *  7️⃣ ANOTHER EXAMPLE — TEXT CHARACTERS
 * ============================================================ */

// Classic GoF example: rendering text in a document.
// Billions of characters → share glyph objects.

class Glyph {
  constructor(
    public readonly char: string,
    public readonly font: string,
    public readonly size: number
  ) {}

  render(x: number, y: number): void {
    console.log(`'${this.char}' (${this.font} ${this.size}px) at (${x}, ${y})`);
  }
}

class GlyphFactory {
  private static cache = new Map<string, Glyph>();

  static get(char: string, font: string, size: number): Glyph {
    const key = `${char}:${font}:${size}`;
    let g = this.cache.get(key);
    if (!g) { g = new Glyph(char, font, size); this.cache.set(key, g); }
    return g;
  }
}

// Document stores only (char, x, y, font, size) — but shares Glyph objects.
type CharRecord = { x: number; y: number; font: string; size: number; char: string };

class Document2 {
  private chars: CharRecord[] = [];
  add(c: CharRecord) { this.chars.push(c); }
  render() {
    for (const c of this.chars) {
      GlyphFactory.get(c.char, c.font, c.size).render(c.x, c.y);
    }
  }
}

/* ============================================================
 *  8️⃣ GENERIC FLYWEIGHT FACTORY
 * ============================================================ */

// Reusable, type-safe factory parameterized by key & value.

class Registry<K, V> {
  private items = new Map<K, V>();

  constructor(private create: (key: K) => V) {}

  get(key: K): V {
    let v = this.items.get(key);
    if (!v) { v = this.create(key); this.items.set(key, v); }
    return v!;
  }

  stats() { return { count: this.items.size }; }
}

// Usage: bullet objects by type
type BulletKind = { sprite: string; damage: number };
const bulletRegistry = new Registry<string, BulletKind>((id) => ({
  sprite: `${id}.png`,
  damage: id === "pistol" ? 10 : 25,
}));

const b1 = bulletRegistry.get("pistol");
const b2 = bulletRegistry.get("pistol");   // same instance
const b3 = bulletRegistry.get("rifle");

// 🧠 Reusable across game entities, icons, fonts, etc.

/* ============================================================
 *  9️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Text editors (shared glyphs, style objects)
// - Game worlds (trees, bullets, enemies, tiles)
// - Maps (terrain tiles, markers, roads)
// - Icon/emoji sets (shared vector definitions)
// - Log formatting (shared template metadata)
// - Networking (shared packet headers)
// - CSS-in-JS (shared style objects)
// - Database row caching (shared type descriptors)
// - VFX / particles (shared particle templates)
// - HTML rendering (shared DOM node types)
//
// Frameworks using flyweight-like ideas:
//   - React (element templates / fiber reuse)
//   - Canvas / WebGL engines (batch draw calls)
//   - Word / Google Docs (glyph caches)
//   - Map providers (vector tiles)

/* ============================================================
 *  🔟 FLYWEIGHT vs SINGLETON vs OBJECT POOL
 * ============================================================ */

// ┌────────────┬────────────────────────────────────────────────────┐
// │ Pattern    │ Purpose / distinguishing trait                     │
// ├────────────┼────────────────────────────────────────────────────┤
// │ Flyweight  │ Share IMMUTABLE intrinsic state across many        │
// │ Singleton  │ Exactly ONE instance of a class                    │
// │ Pool       │ Reuse MUTABLE objects (expensive to create)        │
// └────────────┴────────────────────────────────────────────────────┘
//
//  🧠 Flyweight = many shared immutable objects.
//     Singleton = one object.
//     Pool      = recycle expensive instances.

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Massive memory savings for large object populations
//  - Fewer objects → less GC pressure
//  - Centralizes shared state in one place
//  - Great for caching "type" data separately from "instance" data
//
// ❌ Cons
//  - Complexity — must carefully separate intrinsic vs extrinsic
//  - Extrinsic state passed everywhere — more parameters
//  - Thread safety concerns in concurrent environments
//  - Adds a factory + cache layer
//  - Overkill if object counts are small
//  - Cache management (eviction) is non-trivial for long-lived caches

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Flyweights MUST be IMMUTABLE. If a shared instance is mutated,
//     all clients see the change — often a subtle bug.
// ⚠️ Key the factory cache reliably — collisions cause wrong sharing.
// ⚠️ Do NOT cache mutable objects like DOM nodes as flyweights — you'll
//     corrupt state across callers.
// ⚠️ In JS, `Map` is fine; use `WeakMap` for auto-GC when keys are
//     objects that may become unreachable.
// ⚠️ Flyweight does NOT reduce object COUNT at the client level —
//     it reduces the size of each object by sharing subparts.
// ⚠️ String interning in JS engines is a native example — literals
//     are already shared; you don't need a custom factory for strings.
// ⚠️ Watch out for "leaky abstraction" — extrinsic state must be
//     consistently passed for correct rendering/behavior.
// ⚠️ Prefer `readonly` on flyweight fields — TypeScript enforces it.
// ⚠️ If extrinsic state becomes complex, consider bundling it into a
//     single context object.
// ⚠️ Reset / clear caches between tests to avoid state leakage.

// 🕒 Version notes
// - Flyweight pattern: GoF, 1994
// - `Map`: ES2015 / TS 2.0
// - `WeakMap`: ES2015 / TS 2.0
// - `readonly` properties: TS 2.0
// - `readonly` arrays: TS 3.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept             │ Notes                                    │
 * ─────────────────────────────────────────────────────────────
 * | Flyweight           │ Shared, immutable, intrinsic state        │
 * | Extrinsic state     │ Passed by caller — per-instance data      │
 * | Flyweight factory   │ Cache — returns existing or creates new   │
 * | Context object      │ Holds extrinsic state + reference to fw   │
 * │ Key                 │ Identifies which flyweight to look up     │
 * ──────────────────────┴──────────────────────────────────────────┘
 *
 * | Pattern    │ Purpose                                             │
 * ─────────────────────────────────────────────────────────────
 * | Flyweight  │ Share IMMUTABLE state across many objects           │
 * | Singleton  │ Exactly ONE instance                                │
 * | Pool       │ Recycle MUTABLE expensive objects                   │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Ensure flyweights are IMMUTABLE (`readonly` fields).
 *  - Design cache keys carefully — avoid collisions.
 *  - Use `WeakMap` when keys are objects and GC matters.
 *  - Prefer `Map` for string/number keys.
 *  - Keep extrinsic state SIMPLE — bundle it if it grows.
 *  - Measure memory impact — flyweight is only worth it at scale.
 *  - Provide a `clear()` on the factory for tests.
 *  - Don't cache mutable objects or resources (DOM, sockets).
 *  - Prefer built-in interning (strings, symbols) where possible.
 *  - Remember: fewer DISTINCT intrinsic states → bigger savings.
 * ============================================================ */