// 05_Classes_OOP/16_Decorator_Pattern.ts

/* ============================================================
 *  📘 THE DECORATOR PATTERN IN TYPESCRIPT
 *
 *  Decorator ATTACHES additional responsibilities to an object
 *  dynamically — WITHOUT changing its interface and WITHOUT
 *  subclassing.
 *
 *  ⚠️ NOT the same as TypeScript `@decorators` (that's a language
 *     feature — see 06_Class_Decorators.ts). This is the GoF
 *     structural pattern.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Decorator solves
 *   4. Basic implementation (coffee)
 *   5. Wrapping and unwrapping
 *   6. Decorator vs Inheritance
 *   7. Decorator vs Proxy vs Adapter vs Facade
 *   8. Generic decorator (type-safe)
 *   9. Functional decorators (higher-order functions)
 *  10. Real-world use cases
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// You have an object with an interface. You want to ADD behavior
// (logging, caching, formatting, compression, ...) at RUNTIME.
//
// Instead of subclassing (which explodes combinatorially), you
// WRAP the object in another object with the SAME interface:
//
//   Client → Decorator → Decorator → BaseComponent
//
// Each decorator adds a bit of behavior and delegates the rest.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌────────────────────┬───────────────────────────────────────────┐
// │ Role               │ Responsibility                             │
// ├────────────────────┼───────────────────────────────────────────┤
// │ Component          │ Common interface for wrappers + concrete   │
// │ ConcreteComponent  │ The base object being decorated            │
// │ Decorator          │ Abstract base — holds a Component ref      │
// │ ConcreteDecorator  │ Adds behavior around the wrapped object    │
// └────────────────────┴───────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM DECORATOR SOLVES
 * ============================================================ */

// ─── Without Decorator: subclass explosion ───
//
//          Beverage
//         /    |    \
//     Coffee  CoffeeWithMilk  CoffeeWithMilkAndSugar
//                ...
//     Add a new condiment → new subclass for EVERY combination.
//     N condiments → 2^N subclasses.

// ─── With Decorator ───
//
//     Beverage (interface)
//       ├ Coffee (base)
//       ├ MilkDecorator → wraps any Beverage
//       ├ SugarDecorator → wraps any Beverage
//       └ WhipDecorator → wraps any Beverage
//
//     Compose at runtime: new Whip(new Milk(new Coffee()))
//     N condiments → N decorator classes.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — COFFEE
 * ============================================================ */

// ─── Component ───
interface Beverage {
  description(): string;
  cost(): number;
}

// ─── Concrete Component ───
class Espresso implements Beverage {
  description() { return "Espresso"; }
  cost() { return 2.0; }
}

class HouseBlend implements Beverage {
  description() { return "House Blend"; }
  cost() { return 1.5; }
}

// ─── Decorator base ───
abstract class BeverageDecorator implements Beverage {
  constructor(protected wrapped: Beverage) {}
  abstract description(): string;
  abstract cost(): number;
}

// ─── Concrete Decorators ───
class Milk extends BeverageDecorator {
  description() { return this.wrapped.description() + ", Milk"; }
  cost() { return this.wrapped.cost() + 0.5; }
}

class Sugar extends BeverageDecorator {
  description() { return this.wrapped.description() + ", Sugar"; }
  cost() { return this.wrapped.cost() + 0.25; }
}

class Whip extends BeverageDecorator {
  description() { return this.wrapped.description() + ", Whip"; }
  cost() { return this.wrapped.cost() + 0.75; }
}

// ─── Client — decorators compose like LEGO ───
const order1: Beverage = new Espresso();
const order2: Beverage = new Milk(order1);
const order3: Beverage = new Sugar(new Milk(new Whip(order1)));

console.log(order1.description(), "$" + order1.cost());
// Espresso $2

console.log(order2.description(), "$" + order2.cost());
// Espresso, Milk $2.5

console.log(order3.description(), "$" + order3.cost());
// Espresso, Whip, Milk, Sugar $3.5

// 🧠 Each decorator adds a bit; nesting gives combinatorial behavior.

/* ============================================================
 *  5️⃣ WRAPPING AND UNWRAPPING
 * ============================================================ */

// You can inspect / unwrap decorators if they expose the wrapped ref.

class TransparentMilk extends BeverageDecorator {
  description() { return this.wrapped.description() + ", Milk"; }
  cost() { return this.wrapped.cost() + 0.5; }

  // 🔸 Expose the wrapped beverage
  unwrap(): Beverage { return this.wrapped; }
}

const wrapped = new TransparentMilk(new Espresso());
wrapped.unwrap();   // Espresso

// ⚠️ Exposing `unwrap` is optional. Many decorators are opaque and
//    don't reveal their wrappee.

/* ============================================================
 *  6️⃣ DECORATOR vs INHERITANCE
 * ============================================================ */

// ┌───────────────────────┬───────────────────┬─────────────────────┐
// │ Aspect                │ Inheritance        │ Decorator           │
// ├───────────────────────┼───────────────────┼─────────────────────┤
// │ Timing                │ Compile-time       │ Runtime             │
// │ Combinations          │ N × M subclasses   │ N + M classes       │
// │ Interface             │ Same as parent     │ Same as component   │
// │ Reuse                 │ Rigid              │ Highly composable   │
// │ Change behavior       │ Recompile          │ Reassemble          │
// │ Transparency          │ Weak (is-a)        │ Strong (has-a)      │
// └───────────────────────┴───────────────────┴─────────────────────┘

// 🧠 Prefer Decorator when variations multiply and could combine.

/* ============================================================
 *  7️⃣ DECORATOR vs PROXY vs ADAPTER vs FACADE
 * ============================================================ */

// ┌──────────────┬─────────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                            │
// ├──────────────┼─────────────────────────────────────────────────┤
// │ Decorator    │ ADDS behavior; same interface; wraps 1 object   │
// │ Proxy        │ CONTROLS access; same interface; wraps 1 object │
// │ Adapter      │ CONVERTS interface; wraps 1 object              │
// │ Facade       │ SIMPLIFIES many; different interface            │
// └──────────────┴─────────────────────────────────────────────────┘
//
//  🧠 Decorator ≈ Proxy in shape. Difference is INTENT:
//     Decorator = add responsibilities.
//     Proxy     = control, defer, protect, or log.

/* ============================================================
 *  8️⃣ GENERIC DECORATOR (TYPE-SAFE)
 * ============================================================ */

// Generic base decorator that works with any Component type.

abstract class GenericDecorator<T> {
  constructor(protected wrapped: T) {}
  unwrap(): T { return this.wrapped; }
}

// A concrete use: wrap a data source with logging + caching.
interface DataSource {
  read(): string;
  write(data: string): void;
}

class FileDataSource implements DataSource {
  private content = "";
  read() { return this.content; }
  write(data: string) { this.content = data; }
}

class DataSourceDecorator extends GenericDecorator<DataSource> implements DataSource {
  read() { return this.wrapped.read(); }
  write(data: string) { this.wrapped.write(data); }
}

class EncryptionDecorator extends DataSourceDecorator {
  private key = "k";
  read() { return this.decode(this.wrapped.read()); }
  write(data: string) { this.wrapped.write(this.encode(data)); }
  private encode(s: string) { return [...s].map((c) => String.fromCharCode(c.charCodeAt(0) ^ 1)).join(""); }
  private decode(s: string) { return this.encode(s); } // symmetric XOR
}

class CompressionDecorator extends DataSourceDecorator {
  read() { return `[unzip:${this.wrapped.read()}]`; }
  write(data: string) { this.wrapped.write(`[zip:${data}]`); }
}

const src = new FileDataSource();
const decorated = new CompressionDecorator(new EncryptionDecorator(src));
decorated.write("hello");
console.log(decorated.read());

/* ============================================================
 *  9️⃣ FUNCTIONAL DECORATORS (HIGHER-ORDER FUNCTIONS)
 * ============================================================ */

// In TypeScript, a "decorator" is often just a HOF that wraps a fn.
// Functionally identical to the class-based pattern — smaller code.

type Logger = (msg: string) => void;

function withTimestamp(fn: Logger): Logger {
  return (msg) => fn(`[${new Date().toISOString()}] ${msg}`);
}

function withPrefix(prefix: string) {
  return (fn: Logger): Logger => (msg) => fn(`[${prefix}] ${msg}`);
}

const base: Logger = console.log;
const enhanced = withTimestamp(withPrefix("APP")(base));

enhanced("boot");   // [2025-...Z] [APP] boot

// 🔸 Wraps are composable like the OO version, but lighter-weight.

// 🔸 Memoization decorator
function memoize<A extends any[], R>(fn: (...args: A) => R): (...args: A) => R {
  const cache = new Map<string, R>();
  return (...args: A) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!;
  };
}

// 🔸 Retry decorator
function retry<A extends any[], R>(fn: (...args: A) => Promise<R>, attempts = 3) {
  return async (...args: A): Promise<R> => {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
      try { return await fn(...args); }
      catch (e) { lastErr = e; }
    }
    throw lastErr;
  };
}

// 🧠 For MOST TypeScript codebases, HOF-based decorators are simpler
//    than class hierarchies. Use the class-based pattern when you
//    need polymorphism, state, or interface uniformity.

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - HTTP middleware (Express, Koa, Fastify)
// - Stream transformations (Node.js `Transform` streams)
// - I/O buffering (BufferedReader / BufferedWriter)
// - Data compression + encryption stacks
// - UI component wrapping (HOCs in React)
// - Caching layers
// - Rate limiting / retry logic
// - Logging / metrics / tracing
// - Feature flags / A/B wrapping
// - Input validation wrapping
// - Notification channels (email + SMS + push + ...)
//
// Frameworks:
//   - Express middleware chain
//   - NestJS interceptors
//   - Angular HttpInterceptors
//   - Node.js stream pipelines
//   - React Higher-Order Components

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Add behavior at RUNTIME without subclassing
//  - Compose freely — M + N instead of M × N
//  - Same interface as the component — transparent to client
//  - Single Responsibility — each decorator does one thing
//  - Open/Closed — extend without editing existing classes
//
// ❌ Cons
//  - Many small wrappers — harder to debug / trace
//  - Stack traces can be noisy
//  - Some languages have identity issues (this === that)
//  - Careful with state — decorators are stateful wrappers
//  - Deep nesting makes reasoning harder
//  - Harder to compare "is this the same object?"

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Decorator must implement the SAME interface as the component —
//     otherwise it's an Adapter, not a Decorator.
// ⚠️ Decorator should NOT change the interface. If it does, it's an
//     Adapter or a Facade.
// ⚠️ Keep decorators FOCUSED — one responsibility each.
// ⚠️ Beware of state — decorators can accumulate state; document it.
// ⚠️ Equality — `wrapped === original` is true, but `decorator === original`
//     is false. Don't rely on identity checks.
// ⚠️ Order matters — `Encrypt(Compress(x))` ≠ `Compress(Encrypt(x))`.
// ⚠️ Avoid decorators that silently SWALLOW return values or errors.
// ⚠️ In TS, prefer the FUNCTIONAL form (HOF) for one-off wrappers and
//     the CLASS form for polymorphic, stateful, or interface-uniform
//     behavior.
// ⚠️ Do NOT confuse with the TypeScript `@decorator` syntax — that's a
//     language feature (see 06_Class_Decorators.ts).
// ⚠️ Express middlewares and React HOCs are the functional flavor —
//     they wrap with the same signature.

// 🕒 Version notes
// - GoF Decorator pattern: 1994
// - Generics for wrappers: TS 1.0
// - `Symbol.iterator` / iterables: ES2015 / TS 2.3
// - `Promise` for async decorators: ES2017 / TS 2.1
// - HOF-based decorators: JS-native, always available

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept            │ Notes                                    │
 * ─────────────────────────────────────────────────────────────
 * | Component          │ Common interface for all                 │
 * | ConcreteComponent  │ The base object being wrapped            │
 * | Decorator          │ Holds a Component, same interface        │
 * | ConcreteDecorator  │ Adds specific behavior around wrapped    │
 * │ Client             │ Uses only the Component interface        │
 * ─────────────────────┴──────────────────────────────────────────┘
 *
 * | Pattern   | Intent                                              |
 * ─────────────────────────────────────────────────────────────
 * | Decorator | ADD behavior; same interface                        │
 * | Proxy     | CONTROL access; same interface                      │
 * | Adapter   | CONVERT interface                                    │
 * | Facade    | SIMPLIFY many interfaces                             │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Implement the SAME interface as the component.
 *  - One decorator = one responsibility.
 *  - Document behavior order when stacking.
 *  - Prefer `private readonly` for the wrapped instance.
 *  - Use a `protected` base decorator class to share delegation.
 *  - Avoid state unless you truly need it — document carefully.
 *  - Consider HOF-based decorators for lightweight wrapping.
 *  - Don't change the interface — that's Adapter territory.
 *  - Don't control access — that's Proxy territory.
 *  - Remember: composition here is LEGO-like — keep pieces small.
 * ============================================================ */