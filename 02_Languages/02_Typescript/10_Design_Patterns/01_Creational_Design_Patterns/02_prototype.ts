// 05_Classes_OOP/09_Prototype_Pattern.ts

/* ============================================================
 *  📘 THE PROTOTYPE PATTERN IN TYPESCRIPT
 *
 *  The Prototype pattern creates new objects by CLONING an
 *  existing object rather than calling `new`.
 *
 *  Sections:
 *   1. Core idea
 *   2. Your implementation (annotated + FIXED)
 *   3. Bugs in the original code
 *   4. How the fix works
 *   5. Shallow clone vs deep clone
 *   6. Alternative implementations
 *   7. When to use Prototype
 *   8. Pros & cons
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Instead of `new ConcretePrototype(config)` for every object,
// you create ONE prototype, then CLONE it whenever you need a
// new copy — optionally tweaking fields after cloning.
//
// Useful when:
//   - Object creation is expensive (DB, network, complex init)
//   - You need many similar objects with minor differences
//   - You want to avoid subclassing just to vary construction

/* ============================================================
 *  2️⃣ YOUR IMPLEMENTATION (ANNOTATED + FIXED)
 * ============================================================ */

interface UserDetails {
  id: number;
  name: string;
  age: number;
}

interface Prototype {
  clone(): Prototype;
  getUserDetails(): UserDetails;
}

class ConcretePrototype implements Prototype {
  private user: UserDetails;

  // ⚠️ ORIGINAL BUG: `constructor(user: UserDetails) { }` — never assigns!
  // ✅ FIX: assign the parameter to the field.
  constructor(user: UserDetails) {
    this.user = user;
  }

  public clone(): Prototype {
    // Object.create(this) → new object whose prototype is `this`
    const clone = Object.create(this) as ConcretePrototype;

    // Shallow-copy the `user` object → independent from the original
    clone.user = { ...this.user };

    return clone;
  }

  public getUserDetails(): UserDetails {
    return this.user;
  }
}

const userdata = {
  id: 2,
  name: "pankaj",
  age: 23,
};

console.log(userdata);

let user1 = new ConcretePrototype(userdata);
let user2 = user1.clone();

let u1d = user1.getUserDetails();
console.log(u1d);                       // { id: 2, name: 'pankaj', age: 23 }

console.log(user2.getUserDetails());    // { id: 2, name: 'pankaj', age: 23 }
console.log(user1 === user2);           // false ← different objects

/* ============================================================
 *  3️⃣ BUGS IN THE ORIGINAL CODE
 * ============================================================ */

// 🐛 BUG #1 — constructor never assigns `this.user`
//     constructor(user: UserDetails) { }   // ❌ user param discarded
//     → `this.user` is `undefined` on every new instance.
//
//     That's why `user1.getUserDetails()` returned `undefined` (or crashed
//     under strictPropertyInitialization).
//
//     ✅ FIX: `this.user = user;`

// 🐛 BUG #2 — cloning the reference, not the value
//     If you did `clone.user = this.user`, both instances would share the
//     SAME nested object — mutating one would affect the other.
//
//     ✅ FIX: spread `{ ...this.user }` to make a shallow copy.
//
// 🐛 BUG #3 — `Object.create(this)` and TypeScript
//     `Object.create(this)` returns `any` in most configs, so TS may
//     not infer the clone as `ConcretePrototype`. Annotate with `as`.
//
// 🐛 BUG #4 — `clone.user` is `private`
//     Accessing `clone.user` in the class is fine, but any code that
//     tried to access it from outside would fail. Keep the cloning
//     logic INSIDE the class — which you did. ✅

/* ============================================================
 *  4️⃣ HOW THE FIX WORKS
 * ============================================================ */

// 1. `Object.create(this)`
//    Creates a new empty object whose PROTOTYPE is the current instance.
//    Methods (clone, getUserDetails) are inherited automatically.
//    Own properties (like `user`) are NOT copied — we copy them manually.
//
// 2. `clone.user = { ...this.user }`
//    Assigns a fresh copy of the nested object to the new instance.
//    Now mutating `user1.user` does NOT affect `user2.user`.
//
// 3. `user1 === user2` → false
//    Two DISTINCT objects with independent state.

/* ============================================================
 *  5️⃣ SHALLOW CLONE vs DEEP CLONE
 * ============================================================ */

// Shallow: one level of copying. Nested objects still shared.
//
//   const clone = { ...this };
//
//   // Mutating a NESTED field on the clone mutates the original!
//   // clone.a.b = 1  →  original.a.b === 1
//
// Deep: recursive copying of every level.

class DeepCloneable {
  constructor(
    public user: UserDetails,
    public tags: string[],
    public meta: { created: Date; nested: { level: number } }
  ) {}

  clone(): DeepCloneable {
    // structuredClone (Node 17+, browsers modern) — deep copy built-in
    return structuredClone(this);
  }
}

// 🔸 Alternatives for deep cloning:
//   - structuredClone(x)               (built-in, ES2022+)
//   - JSON.parse(JSON.stringify(x))    (loses Dates, undefined, functions)
//   - lodash.cloneDeep(x)
//   - Custom recursive function

/* ============================================================
 *  6️⃣ ALTERNATIVE IMPLEMENTATIONS
 * ============================================================ */

// 🔸 Classic — explicit copy constructor
class Rectangle {
  constructor(public w: number, public h: number) {}
  copyWith({ w, h }: Partial<{ w: number; h: number }>): Rectangle {
    return new Rectangle(w ?? this.w, h ?? this.h);
  }
}

// 🔸 Modern — functional (no mutation, no `clone` method)
type Point = { x: number; y: number };
const protoPoint: Point = { x: 0, y: 0 };
const p1 = { ...protoPoint, x: 5 };      // "clone" via spread

// 🔸 Prototype registry — store and retrieve named prototypes
class PrototypeRegistry {
  private prototypes = new Map<string, Prototype>();
  register(key: string, proto: Prototype) { this.prototypes.set(key, proto); }
  get(key: string): Prototype | undefined {
    return this.prototypes.get(key)?.clone();
  }
}

/* ============================================================
 *  7️⃣ WHEN TO USE PROTOTYPE
 * ============================================================ */

// ✅ Use when:
//   - Object construction is expensive or complex
//   - You want to avoid a factory hierarchy
//   - You need many variants of a base object
//   - You want runtime-configurable object creation
//
// ❌ Avoid when:
//   - Objects are trivially cheap to construct
//   - You already have a clean factory / DI setup
//   - Deep copying is complex (Dates, Maps, class instances, cycles)

/* ============================================================
 *  8️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Reuse expensive initialization
//  - Avoid subclassing boilerplate
//  - Add/remove at runtime
//  - Flexible configurations
//
// ❌ Cons
//  - Shallow vs deep copying is a common source of bugs
//  - Copying class instances with private state needs care
//  - Cycles in objects require special handling
//  - `Object.create` bypasses constructors — no initialization runs

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `Object.create(this)` does NOT run the constructor. Side effects
//     in the constructor won't fire on clones.
// ⚠️ `Object.create(this)` returns `any` in TS — cast to the concrete type.
// ⚠️ Spread (`{...x}`) is SHALLOW — nested objects remain shared.
// ⚠️ `structuredClone` fails on: functions, symbols, class methods,
//     DOM nodes, WeakMaps, and circular structures (mostly).
// ⚠️ `JSON.parse(JSON.stringify(x))` loses Dates (→ strings), undefined,
//     Map/Set, class prototypes.
// ⚠️ `private` fields are not enumerable on the prototype — spread won't
//     copy them. Access them explicitly in `clone()`.
// ⚠️ `#private` fields break `structuredClone` (unless you implement
//     a custom clone).
// ⚠️ Cloning an object whose prototype chain has state can produce
//     surprising results.
// ⚠️ In TypeScript, prefer explicit copy methods over raw `Object.create`
//     for type safety and clarity.

// 🕒 Version notes
// - Object.create: ES5 (2009)
// - Object spread (shallow): ES2018 / TS 2.1
// - structuredClone: ES2022 (Node 17+, modern browsers)

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept                 | Notes                                  |
 * ─────────────────────────────────────────────────────────────
 * | Prototype pattern       | Clone existing objects instead of new  |
 * | Object.create(this)     | New object sharing the prototype       |
 * | Spread {...x}           | Shallow copy of own enumerable props   |
 * | structuredClone(x)      | Deep clone built-in (ES2022+)          |
 * | JSON.parse/stringify    | Deep clone but lossy (no Dates etc.)   |
 * | Copy constructor        | Explicit clone with parameter overrides|
 * | Registry                | Named prototypes, cloned on demand     |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer explicit `clone()` methods over raw `Object.create`.
 *  - Decide shallow vs deep ONCE — document it clearly.
 *  - For simple objects, `{ ...obj }` beats Prototype pattern.
 *  - Use `structuredClone` when you need a true deep copy.
 *  - Keep cloning logic INSIDE the class (handles private state).
 *  - Avoid cloning class instances that hold resources (DB connections,
 *    sockets, file handles) unless you re-open them.
 *  - Test cloning with nested mutations to verify depth.
 *  - Prefer immutability + spread patterns for modern TS code.
 * ============================================================ */