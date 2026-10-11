// 05_Classes_OOP/25_Strategy_Pattern.ts

/* ============================================================
 *  📘 THE STRATEGY PATTERN IN TYPESCRIPT
 *
 *  Strategy defines a FAMILY of algorithms, encapsulates each
 *  one, and makes them interchangeable at RUNTIME.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Strategy solves
 *   4. Basic implementation (payment methods)
 *   5. Strategy via constructor injection
 *   6. Strategy via setter (runtime swap)
 *   7. Functional strategy (functions as strategies)
 *   8. Strategy with context data
 *   9. Generic / typed strategies
 *  10. Strategy registry
 *  11. Real-world use cases
 *  12. Strategy vs State vs Bridge vs Template Method
 *  13. Pros & cons
 *  14. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// When an object needs to perform a task in MULTIPLE ways, you
// can:
//   - Use if/else or switch (rigid, violates Open/Closed), OR
//   - Delegate to a Strategy object chosen at runtime.
//
//   Context → Strategy (interface) ← ConcreteStrategyA/B/C
//
// The Context doesn't know which algorithm runs — it just calls
// `strategy.execute(...)`. Swapping behavior = swapping the strategy.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌─────────────────────┬────────────────────────────────────────┐
// │ Role                │ Responsibility                          │
// ├─────────────────────┼────────────────────────────────────────┤
// │ Strategy            │ Common interface for algorithms         │
// │ ConcreteStrategy    │ One algorithm per class                 │
// │ Context             │ Holds a Strategy; delegates to it       │
// │ Client              │ Picks a Strategy; configures Context    │
// └─────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM STRATEGY SOLVES
 * ============================================================ */

// WITHOUT Strategy — one big switch:
//
//   class Checkout {
//     pay(method: "card" | "paypal" | "crypto", amount: number) {
//       if (method === "card") { /* 20 lines */ }
//       else if (method === "paypal") { /* 25 lines */ }
//       else if (method === "crypto") { /* 15 lines */ }
//     }
//   }
//
// Adding a new method requires editing `pay`. Testing one method
// means dragging the whole class along.
//
// WITH Strategy:
//
//   class Checkout {
//     constructor(private strategy: PaymentStrategy) {}
//     pay(amount: number) { return this.strategy.pay(amount); }
//   }
//
// Adding a new method = new class. No edits to Checkout.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — PAYMENT METHODS
 * ============================================================ */

// ─── Strategy interface ───
interface PaymentStrategy {
  readonly name: string;
  pay(amount: number): Promise<string>;
}

// ─── Concrete Strategies ───
class CreditCardStrategy implements PaymentStrategy {
  readonly name = "credit-card";
  constructor(private cardNumber: string) {}

  async pay(amount: number): Promise<string> {
    if (!this.cardNumber) throw new Error("Missing card");
    await new Promise((r) => setTimeout(r, 5));
    return `Charged $${amount} to card ****${this.cardNumber.slice(-4)}`;
  }
}

class PayPalStrategy implements PaymentStrategy {
  readonly name = "paypal";
  constructor(private email: string) {}

  async pay(amount: number): Promise<string> {
    await new Promise((r) => setTimeout(r, 5));
    return `Charged $${amount} via PayPal (${this.email})`;
  }
}

class CryptoStrategy implements PaymentStrategy {
  readonly name = "crypto";
  constructor(private wallet: string) {}

  async pay(amount: number): Promise<string> {
    await new Promise((r) => setTimeout(r, 5));
    return `Broadcast $${amount} from ${this.wallet}`;
  }
}

// ─── Context ───
class Checkout {
  constructor(private strategy: PaymentStrategy) {}

  // Runtime swap
  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async pay(amount: number): Promise<string> {
    return this.strategy.pay(amount);
  }
}

// ─── Client ───
(async () => {
  const checkout = new Checkout(new CreditCardStrategy("4111111111111234"));
  console.log(await checkout.pay(99.99));

  checkout.setStrategy(new PayPalStrategy("user@example.com"));
  console.log(await checkout.pay(50));

  checkout.setStrategy(new CryptoStrategy("0xabc"));
  console.log(await checkout.pay(20));
})();

// 🧠 Checkout never knows which payment method runs.

/* ============================================================
 *  5️⃣ STRATEGY VIA CONSTRUCTOR INJECTION
 * ============================================================ */

// Immutable context — strategy is set once and never changes.
// Best for functional / stateless contexts.

class Compressor {
  constructor(private strategy: CompressionStrategy) {}
  compress(data: string): string { return this.strategy.compress(data); }
}

interface CompressionStrategy {
  compress(data: string): string;
}

class GzipStrategy implements CompressionStrategy {
  compress(data: string): string { return `[gzip]${data}`; }
}

class BrotliStrategy implements CompressionStrategy {
  compress(data: string): string { return `[brotli]${data}`; }
}

// 🔸 Immutable — once constructed, the strategy doesn't change.
//    Thread-safe in languages with concurrency; easy to reason about.

/* ============================================================
 *  6️⃣ STRATEGY VIA SETTER (RUNTIME SWAP)
 * ============================================================ */

// Mutable context — strategy can change at any time.
// Best when the same Context handles multiple behavior modes.

type SortStrategy<T> = (arr: T[]) => T[];

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): this {
    this.strategy = strategy;
    return this;      // fluent
  }

  sort(arr: T[]): T[] {
    return this.strategy([...arr]);   // defensive copy
  }
}

// ─── Concrete strategies as plain functions ───
const ascending = (a: number, b: number) => a - b;
const descending = (a: number, b: number) => b - a;

const numericSorter = new Sorter<number>((arr) => [...arr].sort(ascending));

console.log(numericSorter.sort([3, 1, 2]));    // [1, 2, 3]
numericSorter.setStrategy((arr) => [...arr].sort(descending));
console.log(numericSorter.sort([3, 1, 2]));    // [3, 2, 1]

/* ============================================================
 *  7️⃣ FUNCTIONAL STRATEGY (FUNCTIONS AS STRATEGIES)
 * ============================================================ */

// In modern TS, a strategy is often just a function — no classes needed.

type DiscountStrategy = (orderTotal: number) => number;

const noDiscount: DiscountStrategy = (total) => total;
const tenPercentOff: DiscountStrategy = (total) => total * 0.9;
const seasonalDiscount: DiscountStrategy = (total) =>
  total > 100 ? total - 20 : total;

class Order {
  constructor(public total: number, private discount: DiscountStrategy) {}

  setDiscount(d: DiscountStrategy): this {
    this.discount = d;
    return this;
  }

  checkout(): number {
    return this.discount(this.total);
  }
}

const order = new Order(200, tenPercentOff);
console.log(order.checkout());                 // 180

order.setDiscount(seasonalDiscount);
console.log(order.checkout());                 // 180

order.setDiscount(noDiscount);
console.log(order.checkout());                 // 200

// 🧠 Function strategies are lighter and compose with HOFs.

/* ============================================================
 *  8️⃣ STRATEGY WITH CONTEXT DATA
 * ============================================================ */

// Real strategies usually need context (user, config, request).
// Pass it as an argument to `execute`.

interface ShippingStrategy {
  estimate(ctx: { from: string; to: string; weightKg: number }): number;
}

class FlatRateShipping implements ShippingStrategy {
  estimate(): number { return 5; }
}

class WeightBasedShipping implements ShippingStrategy {
  estimate(ctx: { weightKg: number }): number {
    return 2 + ctx.weightKg * 0.5;
  }
}

class DistanceBasedShipping implements ShippingStrategy {
  estimate(ctx: { from: string; to: string }): number {
    // Fake distance lookup
    const distance = ctx.from === ctx.to ? 0 : 100;
    return 3 + distance * 0.01;
  }
}

class ShippingCalculator {
  constructor(private strategy: ShippingStrategy) {}
  setStrategy(s: ShippingStrategy): this { this.strategy = s; return this; }
  cost(ctx: { from: string; to: string; weightKg: number }): number {
    return this.strategy.estimate(ctx);
  }
}

const calc = new ShippingCalculator(new FlatRateShipping());
console.log(calc.cost({ from: "A", to: "B", weightKg: 2 }));      // 5

calc.setStrategy(new WeightBasedShipping());
console.log(calc.cost({ from: "A", to: "B", weightKg: 2 }));      // 3

calc.setStrategy(new DistanceBasedShipping());
console.log(calc.cost({ from: "A", to: "B", weightKg: 2 }));      // 4

/* ============================================================
 *  9️⃣ GENERIC / TYPED STRATEGIES
 * ============================================================ */

// A generic strategy interface parameterized by input/output.

interface Strategy<TInput, TOutput> {
  readonly name: string;
  execute(input: TInput): TOutput;
}

class Pipeline<TInput, TOutput> {
  constructor(private strategy: Strategy<TInput, TOutput>) {}

  setStrategy(s: Strategy<TInput, TOutput>): this {
    this.strategy = s;
    return this;
  }

  run(input: TInput): TOutput {
    return this.strategy.execute(input);
  }

  get current(): string { return this.strategy.name; }
}

// ─── Concrete generic strategies ───
class UpperCaseStrategy implements Strategy<string, string> {
  readonly name = "upper";
  execute(input: string): string { return input.toUpperCase(); }
}

class ReverseStrategy implements Strategy<string, string> {
  readonly name = "reverse";
  execute(input: string): string { return [...input].reverse().join(""); }
}

const pipeline = new Pipeline<string, string>(new UpperCaseStrategy());
console.log(pipeline.run("hello"));    // HELLO
pipeline.setStrategy(new ReverseStrategy());
console.log(pipeline.run("hello"));    // olleh
console.log(pipeline.current);         // reverse

/* ============================================================
 *  🔟 STRATEGY REGISTRY
 * ============================================================ */

// A registry maps names to strategies — great for config-driven
// or plugin-driven systems.

class StrategyRegistry<TInput, TOutput> {
  private strategies = new Map<string, Strategy<TInput, TOutput>>();

  register(s: Strategy<TInput, TOutput>): this {
    this.strategies.set(s.name, s);
    return this;
  }

  get(name: string): Strategy<TInput, TOutput> {
    const s = this.strategies.get(name);
    if (!s) throw new Error(`Unknown strategy: ${name}`);
    return s;
  }

  list(): string[] {
    return [...this.strategies.keys()];
  }
}

const registry = new StrategyRegistry<string, string>();
registry.register(new UpperCaseStrategy());
registry.register(new ReverseStrategy());

console.log(registry.list());                             // ["upper", "reverse"]
console.log(registry.get("upper").execute("hi"));         // HI
console.log(registry.get("reverse").execute("hi"));       // ih

/* ============================================================
 *  1️⃣1️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Payment methods (card / PayPal / crypto / bank transfer)
// - Shipping cost / tax / discount calculation
// - Compression (gzip / brotli / zstd)
// - Sorting comparators
// - Authentication (OAuth / API key / session)
// - Retry / backoff strategies
// - Rendering engines (SVG / Canvas / WebGL)
// - Pricing rules / promotions
// - File format parsers (CSV / JSON / XML)
// - Route selection (fastest / shortest / eco)
// - Feature flag evaluation
// - Rate-limiting algorithms (token bucket / leaky bucket)
// - Validation strategies per field type
//
// Frameworks / libraries:
//   - Passport.js (auth strategies)
//   - Sharp (image resize strategies)
//   - Axios (adapter strategies)
//   - React Router (routing strategies)
//   - Passport / OAuth (multiple providers)
//   - Jest config (testEnvironment strategies)

/* ============================================================
 *  1️⃣2️⃣ STRATEGY vs STATE vs BRIDGE vs TEMPLATE METHOD
 * ============================================================ */

// ┌────────────────────┬──────────────────────────────────────────┐
// │ Pattern            │ Distinguishing trait                      │
// ├────────────────────┼──────────────────────────────────────────┤
// │ Strategy           │ Client CHOOSES the algorithm              │
// │ State              │ Object CHANGES behavior via internal state│
// │ Bridge             │ Two INDEPENDENT hierarchies               │
// │ Template Method    │ Skeleton in base; steps in subclasses     │
// └────────────────────┴──────────────────────────────────────────┘
//
// 🧠 Strategy: external choice.
//    State: internal transitions.
//    Bridge: structure.
//    Template Method: fixed flow, variable steps.

/* ============================================================
 *  1️⃣3️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Open/Closed: add strategies without editing context
//  - Single Responsibility: one algorithm per strategy
//  - Composable: swap strategies at runtime
//  - Testable: each strategy independently
//  - Removes if/else and switch chains
//  - Great fit for plugin-style behavior
//
// ❌ Cons
//  - More classes / functions than inline if/else
//  - Client must know which strategy to pick
//  - Strategy and Context can become tightly coupled if the
//    context leaks data into the strategy
//  - For 2–3 tiny algorithms, a switch may be simpler
//  - Too many strategies → many files to navigate

/* ============================================================
 *  1️⃣4️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Keep strategies STATELESS when possible — otherwise swap
//     semantics depend on history.
// ⚠️ If strategies carry state, `setStrategy` should reset it or
//     the caller must provide a fresh instance.
// ⚠️ The Context should pass WHAT the strategy needs, not leak its
//     own internals (avoid `context: this` unless intentional).
// ⚠️ Function-based strategies are lighter — prefer for small
//     algorithms with no state.
// ⚠️ Under strict mode, type strategy input/output generically so
//     TS catches mismatched payloads.
// ⚠️ Don't use Strategy to hide a simple config flag (`mode: "a" | "b"`).
//     Use it when behaviors are TRULY different.
// ⚠️ Registry approach requires disciplined naming — enforce with
//     a `name` field on the strategy interface.
// ⚠️ Async strategies: standardize on `Promise<T>` return so the
//     context doesn't care about sync/async — or split into two
//     strategy interfaces.
// ⚠️ Beware of "strategy becomes state" — if the strategy changes
//     itself based on events, you're actually using State pattern.
// ⚠️ Combined with DI containers, strategies become pluggable —
//     common in enterprise stacks.

// 🕒 Version notes
// - Strategy pattern: GoF, 1994
// - Function strategies: JS/TS native
// - Generic strategies: TS 1.0+
// - Discriminated union alternatives: TS 2.0+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role             │ Notes                                      │
 * ─────────────────────────────────────────────────────────────
 * | Strategy         │ Common interface for algorithms            │
 * | ConcreteStrategy │ One algorithm per class / function         │
 * | Context          │ Delegates to the strategy                  │
 * | Client           │ Chooses and injects the strategy           │
 * ─────────────────────────────────────────────────────────────
 *
 * | Alternative form     │ When to prefer                          │
 * ─────────────────────────────────────────────────────────────
 * | Class-based          │ State, multiple methods, polymorphism   │
 * | Function-based       │ Small, stateless algorithms             │
 * | Registry             │ Config-driven / plugin-based selection  │
 * | Generic typed        │ Type-safe input/output contracts        │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer STATELESS strategies.
 *  - Use CONSTRUCTOR injection for immutable contexts.
 *  - Use SETTER injection when runtime swapping is needed.
 *  - Prefer FUNCTION strategies for tiny algorithms.
 *  - Use a `name` field for registry-based strategies.
 *  - Pass only what the strategy needs — don't leak the context.
 *  - Standardize async strategies on `Promise<T>`.
 *  - Type strategies generically (`Strategy<I, O>`).
 *  - Don't over-engineer: 2 tiny branches → switch is fine.
 *  - Distinguish from State: Strategy = external choice;
 *    State = internal transitions.
 * ============================================================ */