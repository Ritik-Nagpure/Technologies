// 05_Classes_OOP/08_Singleton_Pattern.ts

/* ============================================================
 *  📘 THE SINGLETON PATTERN IN TYPESCRIPT
 *
 *  A Singleton ensures a class has EXACTLY ONE instance and
 *  provides a global point of access to it.
 *
 *  Sections:
 *   1. Core idea
 *   2. Your implementation (annotated)
 *   3. How it works — step by step
 *   4. Why each modifier matters
 *   5. Alternative implementations
 *   6. Real-world use cases
 *   7. Pros & cons
 *   8. Testing the singleton
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Normally: `new MyClass()` creates a fresh instance each time.
// Singleton: intercepts construction and reuses ONE instance.
//
//   - Constructor is PRIVATE → no one can `new` from outside.
//   - A STATIC field holds the single instance.
//   - A STATIC method returns the instance, creating it lazily.

/* ============================================================
 *  2️⃣ YOUR IMPLEMENTATION (ANNOTATED)
 * ============================================================ */

class Singleton {
  // ─── The one and only instance — held on the static side ───
  private static instance: Singleton;

  // ─── Shared state — stored statically ───
  private static _value: number;

  // ─── Private constructor → blocks `new Singleton()` from outside ───
  private constructor() {}

  // ─── Lazy accessor — creates the instance on first call ───
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  // ─── Instance setter → writes to the STATIC field ───
  set value(val: number) {
    Singleton._value = val;
  }

  // ─── Instance getter → reads from the STATIC field ───
  get value() {
    return Singleton._value;
  }
}

// ─── Usage ───
let instance1 = Singleton.getInstance();
let instance2 = Singleton.getInstance();

instance1.value = 25;
console.log(instance1.value);          // 25
console.log(instance2.value);          // 25  ← same static storage
console.log(instance1 === instance2);  // true ← same object

/* ============================================================
 *  3️⃣ HOW IT WORKS — STEP BY STEP
 * ============================================================ */

// 1. `private static instance: Singleton;`
//    Holds the reference to the singleton. Initial value is
//    `undefined` — no instance yet.
//
// 2. `private constructor() {}`
//    Prevents `new Singleton()` outside the class.
//    `new Singleton()` → ❌ TS error: Constructor is private.
//
// 3. `static getInstance()`
//    - If `instance` is falsy → create one via `new Singleton()`.
//      (This works because we're INSIDE the class.)
//    - Return `instance`.
//
// 4. `set value` / `get value`
//    Both operate on the STATIC `_value` field so the state is
//    shared across every call — even though we only have one
//    instance anyway.
//
// 5. Two calls to `getInstance()` return the SAME object.
//    `instance1 === instance2` → true.

/* ============================================================
 *  4️⃣ WHY EACH MODIFIER MATTERS
 * ============================================================ */

// ┌────────────────────────────────┬─────────────────────────────────┐
// │ Modifier / keyword             │ Why it's needed                 │
// ├────────────────────────────────┼─────────────────────────────────┤
// │ private static instance        │ Single shared slot              │
// │ private static _value          │ Shared state across callers     │
// │ private constructor            │ Blocks `new` from outside       │
// │ public static getInstance()    │ Controlled entry point          │
// │ get / set accessors            │ Encapsulate read/write of state │
// └────────────────────────────────┴─────────────────────────────────┘

/* ============================================================
 *  5️⃣ ALTERNATIVE IMPLEMENTATIONS
 * ============================================================ */

// 🔸 Eager initialization — create at class-definition time
class EagerSingleton {
  private static instance = new EagerSingleton();
  private constructor() {}
  static getInstance() { return EagerSingleton.instance; }
}

// 🔸 Frozen instance — prevent mutation of the object shape
class FrozenSingleton {
  private static instance: FrozenSingleton;
  private constructor() {}
  static getInstance() {
    if (!FrozenSingleton.instance) {
      FrozenSingleton.instance = Object.freeze(new FrozenSingleton());
    }
    return FrozenSingleton.instance;
  }
}

// 🔸 Module-level singleton (idiomatic modern pattern)
//    An ESM module is ALREADY a singleton — one instance per program.
class Logger {
  log(msg: string) { console.log(msg); }
}
export const logger = new Logger();       // ← shared instance via module
//
// Consumer:
//   import { logger } from "./logger";
//
// 🧠 This is often preferred over the class-based pattern in modern code.

// 🔸 Generic singleton factory
function singleton<T>(Ctor: new () => T): () => T {
  let instance: T | undefined;
  return () => (instance ??= new Ctor());
}

/* ============================================================
 *  6️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Configuration objects (env vars, app settings)
// - Loggers
// - Database connections / connection pools
// - Caching layers
// - Feature flag providers
// - App-wide event buses
// - Dependency injection containers
//
// ⚠️ Modern frameworks (Angular, NestJS) provide singletons via DI
//    rather than manual `getInstance()`. Prefer DI where available.

/* ============================================================
 *  7️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Controlled access to a single shared resource.
//  - Lazy creation (only when first requested).
//  - Simple to reason about for global state.
//
// ❌ Cons
//  - HARD to test — global state carries over between tests.
//  - Hides dependencies (callers don't declare they need it).
//  - Violates Single Responsibility (creation + behavior).
//  - Can make concurrency/async reasoning tricky.
//  - Encourages hidden coupling across modules.
//
// 🧠 Consider Dependency Injection as an alternative.

/* ============================================================
 *  8️⃣ TESTING THE SINGLETON
 * ============================================================ */

// Because the instance is created lazily and stored on the class,
// tests can't easily reset state. Workarounds:

// 🔸 Add a reset method (DEV only):
class ResettableSingleton {
  private static instance: ResettableSingleton | null = null;
  private constructor() {}
  static getInstance() {
    return (ResettableSingleton.instance ??= new ResettableSingleton());
  }
  static __resetForTests() {
    ResettableSingleton.instance = null;
  }
}

// 🔸 Use jest.resetModules() to re-import the module fresh.

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `private constructor` is COMPILE-TIME only — at runtime, `new`
//    still works if someone bypasses TS (e.g., `(Singleton as any)()`
//    or JavaScript consumers).
// ⚠️ Not thread-safe in languages with real threads; JS is single-threaded
//    so this is fine.
// ⚠️ Subclassing a singleton is tricky — private constructor blocks it.
// ⚠️ Lazy init means the first call has a tiny cost; eager init avoids it.
// ⚠️ Static state persists across imports — tests may leak.
// ⚠️ In worker threads / multiple realms, each realm gets its OWN
//    "singleton" — it's per-realm, not truly global.
// ⚠️ Module-scoped singletons (`export const x = new Foo()`) are
//    often cleaner than class-based singletons in modern TS.
// ⚠️ TypeScript's `private` disappears at runtime — use `#` if you
//    need real privacy for the instance field.

// 🕒 Version notes
// - `static` members: TS 1.0
// - `private` constructor: TS 1.0
// - Getters/setters: TS 1.0
// - `#private` runtime privacy: TS 3.8
// - Static initialization blocks: TS 4.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Piece                        | Purpose                       |
 * ─────────────────────────────────────────────────────────────
 * | private static instance      | Holds the one instance        |
 * | private constructor          | Blocks external `new`         |
 * | static getInstance()         | Lazy access point             |
 * | static state (private)       | Shared data across callers    |
 * | get / set accessors          | Encapsulated read/write       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use the singleton ONLY when truly ONE instance is required.
 *  - Prefer module-scoped singletons (`export const x = new X()`) in ESM.
 *  - Prefer DI containers in frameworks (Angular, NestJS).
 *  - Keep the singleton IMMUTABLE or clearly scoped — hidden state bites.
 *  - Provide a `__resetForTests` (dev only) or use module reload.
 *  - Don't use singletons for pure utilities — use static methods instead.
 *  - Document the singleton's lifetime and reset semantics.
 *  - Prefer lazy init unless startup cost is trivial.
 * ============================================================ */