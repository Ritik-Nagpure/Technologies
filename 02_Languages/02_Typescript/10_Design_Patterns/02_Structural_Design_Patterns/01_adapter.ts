// 05_Classes_OOP/13_Adapter_Pattern.ts

/* ============================================================
 *  📘 THE ADAPTER PATTERN IN TYPESCRIPT
 *
 *  Adapter allows objects with INCOMPATIBLE interfaces to
 *  collaborate by wrapping one interface with another.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. Basic implementation (class adapter via composition)
 *   4. Object adapter vs class adapter
 *   5. Two-way adapter
 *   6. Generic adapter (type-safe wrapper)
 *   7. Real-world use cases
 *   8. Adapter vs Facade vs Decorator vs Proxy
 *   9. Pros & cons
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Problem: You have code expecting interface A, but you're given
// a library/legacy class with interface B.
//
// Solution: A wrapper (the Adapter) that IMPLEMENTS A and
// DELEGATES calls to an instance of B.
//
//   Client → Target (interface A) → Adapter → Adaptee (class B)
//
// The client never knows the underlying class exists.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Role         │ Responsibility                                │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Target       │ Interface the client expects                  │
// │ Client       │ Uses only the Target interface                │
// │ Adaptee      │ Existing class with an incompatible interface │
// │ Adapter      │ Implements Target, wraps Adaptee              │
// └──────────────┴──────────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ BASIC IMPLEMENTATION
 * ============================================================ */

// ─── Scenario: app uses a modern `Logger` interface, but we have
//     a legacy `OldLogger` with a different API. ───

// ─── Target: the interface the app expects ───
interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

// ─── Adaptee: existing incompatible class ───
class OldLogger {
  writeLog(level: number, msg: string): void {
    const tags = ["INFO", "WARN", "ERROR"];
    console.log(`[${tags[level]}] ${msg}`);
  }
}

// ─── Adapter: bridges the two ───
class LoggerAdapter implements Logger {
  constructor(private oldLogger: OldLogger) {}

  info(message: string): void { this.oldLogger.writeLog(0, message); }
  warn(message: string): void { this.oldLogger.writeLog(1, message); }
  error(message: string): void { this.oldLogger.writeLog(2, message); }
}

// ─── Client code — depends only on `Logger` ───
function runApp(logger: Logger): void {
  logger.info("App started");
  logger.warn("Low memory");
  logger.error("Crash!");
}

runApp(new LoggerAdapter(new OldLogger()));
// [INFO] App started
// [WARN] Low memory
// [ERROR] Crash!

// 🧠 The client can't tell it's using OldLogger.

/* ============================================================
 *  4️⃣ OBJECT ADAPTER vs CLASS ADAPTER
 * ============================================================ */

// ─── Object Adapter (composition) — PREFERRED ───
// The adapter HOLDS an instance of the adaptee.

class ObjectAdapter implements Logger {
  constructor(private adaptee: OldLogger) {}
  info(msg: string)  { this.adaptee.writeLog(0, msg); }
  warn(msg: string)  { this.adaptee.writeLog(1, msg); }
  error(msg: string) { this.adaptee.writeLog(2, msg); }
}

// ─── Class Adapter (inheritance) — limited by single inheritance ───
// The adapter EXTENDS the adaptee and implements the target.

class ClassAdapter extends OldLogger implements Logger {
  info(msg: string)  { this.writeLog(0, msg); }
  warn(msg: string)  { this.writeLog(1, msg); }
  error(msg: string) { this.writeLog(2, msg); }
}

// ┌──────────────────┬──────────────────────┬──────────────────────┐
// │ Feature           │ Object Adapter        │ Class Adapter        │
// ├──────────────────┼──────────────────────┼──────────────────────┤
// │ Mechanism         │ Composition           │ Inheritance          │
// │ Works with final  │ ✅                    │ ❌                   │
// │ Multiple adaptees │ ✅                    │ ❌                   │
// │ TypeScript default│ ✅ prefer this        │ rare                 │
// │ Coupling          │ Looser                │ Tighter              │
// └──────────────────┴──────────────────────┴──────────────────────┘

// 🧠 Prefer OBJECT ADAPTER — composition over inheritance.

/* ============================================================
 *  5️⃣ TWO-WAY ADAPTER
 * ============================================================ */

// Sometimes you need to convert EITHER direction.
// The adapter implements both Target and Adaptee interfaces.

interface ModernPayment {
  pay(amount: number): string;
}

class LegacyPayment {
  makePayment(amountInCents: number): string {
    return `Legacy: paid ${amountInCents} cents`;
  }
}

// Adapter that works both ways:
class PaymentBridge implements ModernPayment {
  constructor(private legacy: LegacyPayment) {}

  // Modern → Legacy
  pay(amount: number): string {
    return this.legacy.makePayment(Math.round(amount * 100));
  }

  // Expose legacy shape too
  makePayment(amountInCents: number): string {
    return this.legacy.makePayment(amountInCents);
  }
}

const bridge = new PaymentBridge(new LegacyPayment());
bridge.pay(9.99);                // Legacy: paid 999 cents
bridge.makePayment(500);         // Legacy: paid 500 cents

/* ============================================================
 *  6️⃣ GENERIC ADAPTER (TYPE-SAFE WRAPPER)
 * ============================================================ */

// When adapters follow a common shape, use a generic wrapper.

// A source with an incompatible method name:
interface Source<T> {
  fetchValue(): T;
}

// A target with a different method name:
interface Target<T> {
  get(): T;
}

class MethodNameAdapter<T> implements Target<T> {
  constructor(private source: Source<T>) {}
  get(): T { return this.source.fetchValue(); }
}

// 🔸 Function-signature adapter — convert a callback style to Promise
function promisify<A extends any[], R>(
  fn: (...args: [...A, (err: Error | null, result?: R) => void]) => void
): (...args: A) => Promise<R> {
  return (...args: A) =>
    new Promise<R>((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result as R)));
    });
}

// 🔸 Async-to-sync style adapter (be careful — this is illustrative)
class AsyncToSync<T> implements Target<T> {
  private cached: T;
  constructor(private source: Source<Promise<T>>, defaultValue: T) {
    this.cached = defaultValue;
    this.source.fetchValue().then((v) => (this.cached = v));
  }
  get(): T { return this.cached; }
}

/* ============================================================
 *  7️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Wrapping legacy code with modern interfaces
// - Integrating third-party SDKs behind a stable internal API
// - Bridging ORMs/drivers (Sequelize vs TypeORM under one repo interface)
// - Converting data formats (CSV parser → unified Reader interface)
// - Payment gateways (Stripe/PayPal behind one PaymentProvider)
// - Logging libraries (Winston/Pino behind one Logger interface)
// - HTTP clients (axios/fetch/node-fetch behind one HttpClient)
// - File systems (local/S3/GCS behind one FileStore)
// - Testing: adapter wraps a real service to a fake one in tests
//
// Framework examples:
//   - Jest adapters (vue-jest, ts-jest)
//   - React adapter libraries (react-redux, react-router)
//   - HTTP adapters in NestJS (platform-express, platform-fastify)

/* ============================================================
 *  8️⃣ ADAPTER vs FACADE vs DECORATOR vs PROXY
 * ============================================================ */

// ┌──────────────────┬──────────────────────────────────────────────┐
// │ Pattern          │ Purpose                                       │
// ├──────────────────┼──────────────────────────────────────────────┤
// │ Adapter          │ CONVERT interface A → B (different names)     │
// │ Facade           │ SIMPLIFY many interfaces into one             │
// │ Decorator        │ ADD behavior without changing interface       │
// │ Proxy            │ SAME interface — control access (lazy, log,   │
// │                  │  cache, protect)                              │
// └──────────────────┴──────────────────────────────────────────────┘
//
//  🧠 Key distinction:
//    - Adapter changes the interface SHAPE.
//    - Decorator/Proxy keep the same shape.

/* ============================================================
 *  9️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Decouples client from third-party/legacy code
//  - Reuse existing classes without modification
//  - Clean seam for testing (mock the target)
//  - Single Responsibility: conversion lives in one place
//  - Enables swapping implementations later
//
// ❌ Cons
//  - Extra layer of indirection
//  - Can hide performance costs (e.g., translation overhead)
//  - Too many adapters → hard to trace real implementation
//  - Class adapter limited by single inheritance in TS

/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Adapter should CONVERT, not ADD behavior. Adding caching/logging
//     belongs in a Decorator or Proxy.
// ⚠️ Avoid deep adapter chains (A→B→C→D) — they hurt debuggability.
// ⚠️ When the adaptee throws differently than the target expects,
//     translate errors in the adapter (e.g., wrap low-level errors).
// ⚠️ Async mismatches require careful adaptation — sync APIs can't
//     magically consume async sources without blocking/caching.
// ⚠️ Object adapter hides the adaptee — make sure critical properties
//     (IDs, config) are exposed through the target interface when needed.
// ⚠️ If you find yourself adapting the SAME class in many places,
//     consider refactoring the original to accept the target interface.
// ⚠️ Interfaces should be MINIMAL — every method you expose must be
//     adapted, growing adapter size.
// ⚠️ TypeScript's structural typing means formal Adapter is often
//     unnecessary — you can sometimes just match shapes. Use Adapter
//     when CONVERSION LOGIC is needed (not just shape compatibility).
// ⚠️ Class adapters that extend final classes are impossible — use
//     object adapters.

// 🕒 Version notes
// - Adapter pattern: GoF, 1994
// - Structural typing reduces need in TS — use Adapter for behavior
// - Generic adapters with conditional types: TS 2.8+
// - `abstract new () => T` for constructor adapters: TS 4.2

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept         │ Notes                                       │
 * ─────────────────────────────────────────────────────────────
 * | Target          │ Interface the client expects                │
 * | Adaptee         │ Existing incompatible class                 │
 * | Adapter         │ Implements Target, wraps Adaptee            │
 * | Object adapter  │ Uses composition (preferred)                │
 * | Class adapter   │ Uses inheritance (single-inheritance limit) │
 * | Two-way adapter │ Converts both directions                    │
 * | Generic adapter │ Wraps any source of shape T                 │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer OBJECT adapters (composition) over class adapters.
 *  - Adapter should ONLY translate interfaces — no added behavior.
 *  - Keep the target interface MINIMAL.
 *  - Wrap and translate errors from the adaptee.
 *  - Consider `promisify` for callback → Promise adaptation.
 *  - Name adapters `<Adaptee>To<Target>Adapter` for clarity.
 *  - Use `private readonly` for the wrapped instance.
 *  - Add a fake adapter in tests to swap real implementations.
 *  - Don't confuse with Facade (simplify) or Decorator (extend).
 *  - Refactor the adaptee if it's adapted in many places — smell.
 * ============================================================ */