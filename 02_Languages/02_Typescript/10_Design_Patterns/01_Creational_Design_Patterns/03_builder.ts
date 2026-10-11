// 05_Classes_OOP/10_Builder_Pattern.ts

/* ============================================================
 *  📘 THE BUILDER PATTERN IN TYPESCRIPT
 *
 *  Builder separates the CONSTRUCTION of a complex object from
 *  its REPRESENTATION — the same construction process can create
 *  different representations.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. Your implementation (annotated + COMPLETED)
 *   4. The missing pieces (Director + getResult)
 *   5. Fluent / chainable builder variant
 *   6. Functional builder (modern alternative)
 *   7. Real-world use cases
 *   8. Pros & cons
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Complex objects often have many fields, and you don't want a
// telescoping constructor `new Foo(a, b, c, d, e, f)`.
//
// Builder lets you:
//   - Construct step by step
//   - Reuse the same construction pipeline for different variants
//   - Keep construction logic OUT of the product class
//
// Typical flow:
//
//   const builder = new ConcreteBuilder();
//   const director = new Director(builder);
//   director.buildMinimalProduct();
//   const product = builder.getResult();

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Role         │ Responsibility                                │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Builder      │ Interface: methods to build parts            │
// │ ConcreteBuilder │ Implements Builder, holds Product         │
// │ Director     │ Orchestrates build steps using the Builder   │
// │ Product      │ The complex object being built               │
// └──────────────┴──────────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ YOUR IMPLEMENTATION (ANNOTATED + COMPLETED)
 * ============================================================ */

interface Builder {
  setPartA(): void;
  setPartB(): void;
  setPartC(): void;
}

class Product {
  private parts: string[] = [];

  public add(part: string): void {
    this.parts.push(part);
  }

  public listParts(): void {
    console.log(`Product parts : ${this.parts.join("_-_")}`);
  }
}

class ConcreteBuilder implements Builder {
  // ⚠️ `!` tells TS "we'll assign this before use".
  //    Better: initialize `= new Product()` in the field.
  private product: Product = new Product();

  public setPartA(): void {
    this.product.add("Part A");
  }

  public setPartB(): void {
    this.product.add("Part B");
  }

  public setPartC(): void {
    this.product.add("Part C");
  }

  // 🔸 MISSING from the original — how does the client GET the product?
  public getResult(): Product {
    return this.product;
  }

  // 🔸 Optional: reset to allow building another product with the same builder.
  public reset(): void {
    this.product = new Product();
  }
}

/* ============================================================
 *  4️⃣ THE MISSING PIECES
 * ============================================================ */

// A Director orchestrates the build steps. It knows the ORDER of
// construction — the builder only knows HOW to build each part.

class Director {
  private builder: Builder;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  // Preset: minimal product
  public buildMinimal(): void {
    this.builder.setPartA();
  }

  // Preset: full product
  public buildFull(): void {
    this.builder.setPartA();
    this.builder.setPartB();
    this.builder.setPartC();
  }

  // Preset: partial product
  public buildVariant(): void {
    this.builder.setPartA();
    this.builder.setPartC();
  }
}

// ─── Usage ───
const builder = new ConcreteBuilder();
const director = new Director(builder);

director.buildFull();
const product = builder.getResult();
product.listParts();                    // Product parts : Part A_-_Part B_-_Part C

builder.reset();
director.buildMinimal();
builder.getResult().listParts();        // Product parts : Part A

/* ============================================================
 *  5️⃣ FLUENT / CHAINABLE BUILDER VARIANT
 * ============================================================ */

// The most common TS flavor — each setter returns `this`.
// No Director needed; the caller chains.

class FluentBuilder {
  private product = new Product();

  partA(): this { this.product.add("Part A"); return this; }
  partB(): this { this.product.add("Part B"); return this; }
  partC(): this { this.product.add("Part C"); return this; }

  build(): Product { return this.product; }
}

const result = new FluentBuilder()
  .partA()
  .partB()
  .partC()
  .build();

result.listParts();                     // Product parts : Part A_-_Part B_-_Part C

/* ============================================================
 *  6️⃣ FUNCTIONAL BUILDER (MODERN ALTERNATIVE)
 * ============================================================ */

// For DTO-style objects, plain options objects + defaults beat builders.

type HttpRequest = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  body?: unknown;
};

const defaultRequest: Partial<HttpRequest> = {
  method: "GET",
  headers: {},
};

function makeRequest(opts: Partial<HttpRequest> & { url: string }): HttpRequest {
  return { ...defaultRequest, ...opts } as HttpRequest;
}

const req = makeRequest({ url: "/api/users", method: "POST" });

// 🧠 For simple data, a "builder" is often just an options object with defaults.

/* ============================================================
 *  7️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Building complex query objects (Knex, Sequelize)
// - Constructing HTTP requests (axios, fetch wrappers)
// - Configuring framework instances (webpack, Vite)
// - Assembling ASTs (Babel, TypeScript compiler)
// - Building UI trees / component configs
// - Parsing CSV/JSON with many options
// - Test data builders (faker-style fixtures)
//
// Fluent example (Knex-like):
//   knex("users").select("id", "name").where("active", true).limit(10);
//
// Each call returns a builder; the final `await` or `.toString()` triggers build.

/* ============================================================
 *  8️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Avoids telescoping constructors
//  - Construction logic stays OUT of the product class
//  - Reusable pipelines (Directors presets)
//  - Fluent APIs read like DSL
//  - Enables immutable-style step-by-step assembly
//
// ❌ Cons
//  - More classes / boilerplate than a simple options object
//  - Overkill for simple data structures
//  - Stateful builder is not thread-safe (matters in async flows)
//  - Fluent builders can be hard to debug if steps mutate shared state

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ In the original code, `private product!: Product;` — the `!`
//     bypasses strict initialization but the field is NEVER assigned.
//     Using the builder would throw at runtime.
//     ✅ FIX: `= new Product()` OR assign in the constructor.
// ⚠️ The Builder interface typically includes `getResult(): Product` —
//     otherwise the client has no way to retrieve the built object.
// ⚠️ Reset between builds if the builder is reused — otherwise parts
//     accumulate.
// ⚠️ A fluent builder returning `this` is stateful — do NOT share
//     across async tasks without care.
// ⚠️ Directors are optional. Fluent builders usually skip them.
// ⚠️ For plain DTOs, prefer options objects with defaults over a
//     builder — less code, easier types.
// ⚠️ Remember: a builder is most valuable when construction has
//     ORDER constraints or multiple preconfigured variants.

// 🕒 Version notes
// - Builder pattern: GoF, 1994 (language-agnostic)
// - `this` return type in classes: TS 1.0
// - F-bounded polymorphism for fluent APIs: TS 2.x
// - Optional chaining / spread help modern alternatives: TS 3.7+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Participant      | Role                                    |
 * ─────────────────────────────────────────────────────────────
 * | Builder          | Interface of build steps                |
 * | ConcreteBuilder  | Implements steps, holds Product         |
 * | Director         | Orchestrates build order                |
 * | Product          | Complex object being assembled          |
 * | getResult()      | Retrieve final Product                  |
 * | reset()          | Start a fresh Product with same builder |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Add `getResult()` to the Builder interface — otherwise clients
 *    can't retrieve the product.
 *  - Initialize `product` in the field, not via `!`.
 *  - Provide `reset()` if the builder is reusable.
 *  - Prefer FLUENT builders for ergonomics; use Director when there
 *    are multiple fixed recipes.
 *  - Keep the Product class ignorant of build order.
 *  - For simple data, prefer options objects + defaults over a builder.
 *  - Avoid stateful builders in async pipelines — clone or recreate.
 *  - Type `this` returns as `this` (not the concrete class) for
 *    subclass-friendly fluent APIs.
 * ============================================================ */