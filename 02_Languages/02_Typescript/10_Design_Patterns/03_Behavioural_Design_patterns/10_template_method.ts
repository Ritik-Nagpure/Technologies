// 05_Classes_OOP/30_Template_Method_Pattern.ts

/* ============================================================
 *  📘 THE TEMPLATE METHOD PATTERN IN TYPESCRIPT
 *
 *  Template Method defines the SKELETON of an algorithm in a base
 *  class, letting subclasses override specific STEPS without
 *  changing the algorithm's STRUCTURE.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Template Method solves
 *   4. Basic implementation (data pipeline)
 *   5. Hooks — optional steps
 *   6. Abstract vs concrete vs hook methods
 *   7. Functional Template Method (HOF)
 *   8. Template + Strategy comparison
 *   9. Real-world use cases
 *  10. Template Method vs Strategy vs Factory Method
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// A base class defines an algorithm as a series of method calls.
// Some steps are CONCRETE (implemented in the base); some are
// ABSTRACT (subclasses must implement); some are HOOKS (optional
// overrides for customization).
//
//   abstract class Pipeline {
//     run() {          // TEMPLATE METHOD — the skeleton
//       this.setup();
//       this.process();
//       this.teardown();
//     }
//     protected abstract process(): void;   // subclass fills this
//   }
//
// The base class CONTROLS the flow; subclasses fill in the steps.
// This is one of the easiest GoF patterns to get right.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬────────────────────────────────────────┐
// │ Role                 │ Responsibility                          │
// ├──────────────────────┼────────────────────────────────────────┤
// │ AbstractClass        │ Template method + abstract step defs    │
// │ ConcreteClass        │ Implements the abstract/hook steps      │
// │ Client               │ Calls the template method               │
// └──────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM TEMPLATE METHOD SOLVES
 * ============================================================ */

// Imagine three data export flows: CSV, JSON, XML. They all:
//   1. Validate input
//   2. Open a destination
//   3. Write data (format-specific)
//   4. Close the destination
//   5. Log the result
//
// WITHOUT Template Method — you copy/paste the flow 3 times:
//
//   class CSVExporter {
//     export(data) {
//       validate(data); const out = open(); /* write csv */; close(out); log();
//     }
//   }
//   class JSONExporter {
//     export(data) {
//       validate(data); const out = open(); /* write json */; close(out); log();
//     }
//   }
//   // ... duplicated flow
//
// WITH Template Method — the flow lives ONCE in a base class:
//
//   abstract class Exporter {
//     export(data) { validate; open; write; close; log; }   // skeleton
//     protected abstract write(out, data): void;             // step
//   }

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — DATA PIPELINE
 * ============================================================ */

// ─── Abstract Class ───
abstract class DataPipeline<TInput, TOutput> {
  // 🔸 TEMPLATE METHOD — the skeleton, marked `final`-like
  //    by convention (TS has no `final`, we just document it).
  run(input: TInput): TOutput {
    this.beforeRun(input);
    const validated = this.validate(input);
    const transformed = this.transform(validated);
    const output = this.load(transformed);
    this.afterRun(output);
    return output;
  }

  // 🔸 ABSTRACT STEPS — subclasses MUST implement
  protected abstract validate(input: TInput): TInput;
  protected abstract transform(input: TInput): TInput;
  protected abstract load(input: TInput): TOutput;

  // 🔸 HOOKS — optional overrides with sensible defaults
  protected beforeRun(_input: TInput): void {}
  protected afterRun(_output: TOutput): void {}
}

// ─── Concrete Class: Number Pipeline ───
class NumberPipeline extends DataPipeline<number, string> {
  protected validate(input: number): number {
    if (Number.isNaN(input)) throw new Error("NaN input");
    return input;
  }
  protected transform(input: number): number {
    return input * 2;
  }
  protected load(input: number): string {
    return `Result: ${input}`;
  }
  // 🔸 Optional hook — subclasses override when needed
  protected beforeRun(input: number): void {
    console.log(`[number] starting with ${input}`);
  }
  protected afterRun(output: string): void {
    console.log(`[number] done → ${output}`);
  }
}

// ─── Concrete Class: String Pipeline ───
class StringPipeline extends DataPipeline<string, number> {
  protected validate(input: string): string {
    if (!input.trim()) throw new Error("empty string");
    return input;
  }
  protected transform(input: string): string {
    return input.toUpperCase();
  }
  protected load(input: string): number {
    return input.length;
  }
}

// ─── Client ───
const np = new NumberPipeline();
console.log(np.run(21));
// [number] starting with 21
// [number] done → Result: 42
// → "Result: 42"

const sp = new StringPipeline();
console.log(sp.run("hello"));    // 5

// 🧠 The pipeline ORDER is fixed. Only the STEPS vary.

/* ============================================================
 *  5️⃣ HOOKS — OPTIONAL STEPS
 * ============================================================ */

// Hooks are methods with empty/default bodies that subclasses
// MAY override. They provide optional extension points.

abstract class HttpHandler {
  handle(req: Request): Response {
    if (this.shouldLog()) this.logRequest(req);
    this.auth(req);
    const result = this.process(req);
    if (this.shouldLog()) this.logResponse(result);
    return result;
  }

  // 🔸 Abstract — must implement
  protected abstract process(req: Request): Response;
  protected auth(_req: Request): void {
    // default: no auth required — override to enforce
  }

  // 🔸 Hooks — return default values; subclasses override
  protected shouldLog(): boolean { return false; }
  protected logRequest(req: Request): void { console.log(`→ ${req.url}`); }
  protected logResponse(res: Response): void { console.log(`← ${res.status}`); }
}

type Request = { url: string; body: string; user?: string };
type Response = { status: number; body: string };

class PublicHandler extends HttpHandler {
  protected process(_req: Request): Response {
    return { status: 200, body: "public data" };
  }
  // Logs disabled by default (hook not overridden)
}

class AdminHandler extends HttpHandler {
  protected process(req: Request): Response {
    return { status: 200, body: `admin: ${req.body}` };
  }
  protected auth(req: Request): void {
    if (req.user !== "admin") throw new Error("Forbidden");
  }
  protected shouldLog(): boolean { return true; }   // override hook
}

const pub = new PublicHandler();
console.log(pub.handle({ url: "/public", body: "" }));

const adm = new AdminHandler();
console.log(adm.handle({ url: "/admin", body: "hi", user: "admin" }));
// → /admin
// ← 200
// { status: 200, body: "admin: hi" }

/* ============================================================
 *  6️⃣ ABSTRACT vs CONCRETE vs HOOK METHODS
 * ============================================================ */

// ┌────────────────────┬────────────────────────────────────────┐
// │ Kind               │ Behavior                                │
// ├────────────────────┼────────────────────────────────────────┤
// │ Template method    │ Concrete; defines the ALGORITHM         │
// │ Abstract method    │ No body; subclass MUST implement        │
// │ Concrete method    │ Body provided; subclass MAY override    │
// │ Hook method        │ Empty/default; override to extend       │
// └────────────────────┴────────────────────────────────────────┘

// 🔸 Naming conventions (informal but common):
//   - `doX()` — abstract step
//   - `shouldX()` — boolean hook
//   - `onX()` / `beforeX()` / `afterX()` — lifecycle hooks

/* ============================================================
 *  7️⃣ FUNCTIONAL TEMPLATE METHOD (HOF)
 * ============================================================ */

// In modern TS, the same idea often lives as a higher-order
// function that takes the varying steps as arguments.

type Steps<TIn, TOut> = {
  validate: (input: TIn) => TIn;
  transform: (input: TIn) => TIn;
  load: (input: TIn) => TOut;
  beforeRun?: (input: TIn) => void;
  afterRun?: (output: TOut) => void;
};

function runPipeline<TIn, TOut>(steps: Steps<TIn, TOut>) {
  return (input: TIn): TOut => {
    steps.beforeRun?.(input);
    const validated = steps.validate(input);
    const transformed = steps.transform(validated);
    const output = steps.load(transformed);
    steps.afterRun?.(output);
    return output;
  };
}

// ─── Usage — same flow, expressed functionally ───
const numberPipeline = runPipeline<number, string>({
  validate: (n) => {
    if (Number.isNaN(n)) throw new Error("NaN input");
    return n;
  },
  transform: (n) => n * 2,
  load: (n) => `Result: ${n}`,
  beforeRun: (n) => console.log(`[number] starting with ${n}`),
  afterRun: (out) => console.log(`[number] done → ${out}`),
});

console.log(numberPipeline(21));
// [number] starting with 21
// [number] done → Result: 42
// → "Result: 42"

// 🧠 Functional Template Method = dependency injection of steps.
//    No inheritance required. Often the better modern choice.

/* ============================================================
 *  8️⃣ TEMPLATE + STRATEGY COMPARISON
 * ============================================================ */

// ┌────────────────────┬──────────────────────────────────────────┐
// │ Pattern            │ Distinguishing trait                      │
// ├────────────────────┼──────────────────────────────────────────┤
// │ Template Method    │ Skeleton in base; subclasses fill steps   │
// │ Strategy           │ WHOLE algorithm swapped at runtime        │
// └────────────────────┴──────────────────────────────────────────┘
//
// 🧠 Template Method uses INHERITANCE (compile-time).
//    Strategy uses COMPOSITION (runtime).
//    Template Method fixes the FLOW; Strategy replaces the FLOW.
//
//    Both can be combined: the base class uses a Strategy for
//    one of its steps.

/* ============================================================
 *  9️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Data import/export pipelines (CSV / JSON / XML)
// - Build tools (webpack plugins, gulp tasks)
// - Test frameworks (Jest / Mocha setup→test→teardown)
// - Game loops (init → update → render → cleanup)
// - ETL pipelines (Extract, Transform, Load)
// - Compiler passes (parse → analyze → optimize → emit)
// - Authentication flows (login → session → redirect)
// - Payment flows (validate → authorize → capture → confirm)
// - HTTP frameworks (middleware pipelines)
// - Template engines (compile → render)
// - State machine step sequences
//
// Frameworks / libraries using Template Method:
//   - Express (middleware chain — the chain is the skeleton)
//   - Jest (beforeEach → test → afterEach)
//   - Angular lifecycle hooks (ngOnInit, ngOnDestroy)
//   - React class components (componentDidMount, etc.)
//   - Testcontainers (setup → run → teardown)
//   - JUnit (setUp → test → tearDown)

/* ============================================================
 *  1️⃣0️⃣ TEMPLATE METHOD vs STRATEGY vs FACTORY METHOD
 * ============================================================ */

// ┌────────────────────┬──────────────────────────────────────────┐
// │ Pattern            │ Distinguishing trait                      │
// ├────────────────────┼──────────────────────────────────────────┤
// │ Template Method    │ FIXED flow; VARIABLE steps (inheritance)  │
// │ Strategy           │ VARIABLE flow; same context (composition) │
// │ Factory Method     │ Defers INSTANTIATION to subclasses        │
// └────────────────────┴──────────────────────────────────────────┘
//
// 🧠 Template Method: subclasses provide STEPS.
//    Factory Method: subclasses provide WHAT to create.
//    Strategy: an external object provides the WHOLE algorithm.

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Code reuse: the skeleton lives ONCE in the base class
//  - Enforces a fixed structure — subclasses can't break the flow
//  - Follows Hollywood Principle: "don't call us, we'll call you"
//  - Easy to reason about: algorithm shape is visible in one place
//  - Hooks make extension points explicit
//  - Natural fit for pipelines, lifecycles, workflows
//
// ❌ Cons
//  - Inheritance-based — less flexible than composition
//  - Subclasses tightly coupled to base class structure
//  - Favor composition over inheritance argues for HOF version
//  - Deep hierarchies can grow hard to follow
//  - Hooks without documentation can confuse — some are optional,
//    some are required
//  - In JS, common pitfalls with `this` when subclasses override

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ The TEMPLATE METHOD itself should not be overridable — but TS
//     has no `final`. Enforce by convention + documentation.
// ⚠️ Subclasses should not CHANGE the flow — they should only fill
//     the steps.
// ⚠️ Hooks should have SAFE defaults (empty or no-op) so overriding
//     is optional.
// ⚠️ Beware of `this` binding issues if steps are extracted as
//     callbacks — use arrow functions or bind explicitly.
// ⚠️ Very deep Template hierarchies (3+) hurt readability — consider
//     composition instead.
// ⚠️ Under strict mode, make step methods `protected` (or `private`
//     for internal helpers) — the public API should be `run()` only.
// ⚠️ If the algorithm varies across environments (not just steps),
//     Strategy is likely a better fit.
// ⚠️ Functional Template Method (HOF) is a strong modern alternative
//     when you don't need inheritance.
// ⚠️ Prefer `abstract` steps over runtime checks (`if (!this.doX)
//     throw`) — let the compiler enforce contracts.
// ⚠️ Test the base class with a simple concrete subclass — verifies
//     the flow independently of real subclasses.

// 🕒 Version notes
// - Template Method pattern: GoF, 1994
// - `abstract` classes + methods: TS 1.0
// - `protected` members: TS 1.0
// - HOF-based alternative: JS/TS native

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role              │ Notes                                     │
 * ─────────────────────────────────────────────────────────────
 * | AbstractClass     │ Defines template method + abstract steps  │
 * | ConcreteClass     │ Implements steps + optional hooks         │
 * | Client            │ Calls the template method only            │
 * ─────────────────────────────────────────────────────────────
 *
 * | Method kind       │ Behavior                                  │
 * ─────────────────────────────────────────────────────────────
 * | Template          │ Concrete; defines flow; callers invoke    │
 * | Abstract step     │ No body; subclasses must implement        │
 * | Concrete method   │ Body provided; subclasses may override    │
 * | Hook              │ Empty/default; override for extension     │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Keep the template method UNCHANGED by subclasses (by convention).
 *  - Provide SAFE defaults for hooks.
 *  - Mark step methods `protected`; keep template method `public`.
 *  - Avoid deep hierarchies — 2 levels is usually enough.
 *  - Document the flow (order of steps) in the base class.
 *  - Prefer HOF-based Template Method when you don't need inheritance.
 *  - Combine with Strategy when only ONE step varies widely.
 *  - Test the base class with a minimal concrete subclass.
 *  - Guard against subclasses breaking the flow — don't expose
 *    internal steps publicly.
 *  - Remember the Hollywood Principle: "Don't call us, we'll call you."
 * ============================================================ */