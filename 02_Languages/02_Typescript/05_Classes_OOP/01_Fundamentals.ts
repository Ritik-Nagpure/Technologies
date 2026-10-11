// 05_Classes_OOP/01_Fundamentals.ts

/* ============================================================
 *  📘 CLASS FUNDAMENTALS
 *
 *  Sections:
 *   1. Class declaration & instantiation
 *   2. Constructor + parameter properties
 *   3. Methods (instance, static, private)
 *   4. Getters & setters
 *   5. Field initialization order
 *   6. `this` typing & fluent APIs
 *   7. Classes as types & values (instance vs static side)
 *   8. Edge cases & pitfalls
 * ============================================================ */

/* ============================================================
 *  1️⃣ CLASS DECLARATION & INSTANTIATION
 * ============================================================ */

// A class is a blueprint for creating objects with shared structure.
// It's BOTH a value (constructor function) and a type (instance shape).

class Person {
  // Instance field — must be typed or initialized
  name: string;

  constructor(name: string) {
    this.name = name;   // assign in constructor
  }

  // Method — public by default
  greet(): void {
    console.log(`Hello, ${this.name}`);
  }
}

const p1 = new Person("Aarav");
p1.greet();                                 // Hello, Aarav

// 🔸 Using the class as a TYPE
const p2: Person = new Person("Bob");

// 🔸 Using the class as a VALUE (constructor reference)
const Ctor = Person;
const p3 = new Ctor("Carol");

/* ============================================================
 *  2️⃣ CONSTRUCTOR + PARAMETER PROPERTIES
 * ============================================================ */

// Verbose form — declare fields, then assign in constructor
class RectangleLong {
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

// Shorthand — parameter properties (access modifier + name)
class Rectangle {
  constructor(private width: number, private height: number) {}
  area(): number { return this.width * this.height; }
}

// 🔸 Mixing parameter properties with regular params
class Box {
  constructor(
    public label: string,     // becomes a public property
    private _size: number,    // becomes a private property
    note?: string             // stays a normal param
  ) {
    if (note) console.log(note);
  }
  get size(): number { return this._size; }
}

// 🔸 Readonly parameter property — set once in constructor, then immutable
class Config {
  constructor(public readonly env: string) {}
}
// new Config("prod").env = "dev";   // ❌

/* ============================================================
 *  3️⃣ METHODS
 * ============================================================ */

class Calculator {
  // Instance method
  add(a: number, b: number): number { return a + b; }

  // Static method — belongs to the class, not to instances
  static version(): string { return "1.0.0"; }

  // Private method — only callable inside the class
  private helper(): void { /* ... */ }

  // Overloaded method — signatures + a single implementation
  format(v: number): string;
  format(v: string): string;
  format(v: number | string): string { return String(v); }
}

Calculator.version();              // ✅ static access
new Calculator().add(1, 2);        // ✅ instance access
// new Calculator().helper();      // ❌ private

/* ============================================================
 *  4️⃣ GETTERS & SETTERS
 * ============================================================ */

class Rect2 {
  constructor(private width: number, private height: number) {}

  // Getter — computed read-only access
  get area(): number { return this.width * this.height; }

  // Setter — controlled write
  set dimensions([w, h]: [number, number]) {
    this.width = w;
    this.height = h;
  }
}

const rect = new Rect2(10, 5);
console.log(rect.area);               // 50
rect.dimensions = [20, 10];           // setter invoked
console.log(rect.area);               // 200

// 🔸 Getter-only → property is effectively readonly from outside
// rect.area = 100;                   // ❌ no setter

// 🔸 Different getter / setter types (TS 4.3+)
class Box2 {
  private _v: string | number = "";
  get value(): string | number { return this._v; }
  set value(v: string | number) { this._v = v; }
}

/* ============================================================
 *  5️⃣ FIELD INITIALIZATION ORDER
 * ============================================================ */

// Order of execution when `new Init()` is called:
//   1. Parameter properties assigned
//   2. Instance field initializers run in declaration order
//   3. Constructor body executes

class Init {
  a = 1;                 // step 2
  b = this.a + 1;        // step 2 — sees a = 1
  c: number;             // declared, not initialized
  constructor() {
    // step 3
    this.c = this.b + 1; // c = 3
  }
}
console.log(new Init()); // { a: 1, b: 2, c: 3 }

/* ============================================================
 *  6️⃣ `this` TYPING & FLUENT APIs
 * ============================================================ */

class QueryBuilder {
  private parts: string[] = [];

  select(cols: string): this {          // returning `this` = fluent API
    this.parts.push(`SELECT ${cols}`);
    return this;
  }
  from(table: string): this {
    this.parts.push(`FROM ${table}`);
    return this;
  }
  build(): string { return this.parts.join(" "); }
}

const q = new QueryBuilder().select("*").from("users").build();
// → "SELECT * FROM users"

// 🔸 `this` as a parameter type (rare, for helper functions)
function bindTo<T>(this: T, fn: (t: T) => void) { fn(this); }

/* ============================================================
 *  7️⃣ CLASSES AS TYPES & VALUES
 * ============================================================ */

class Foo {
  x = 1;                    // instance field
  static y = 2;             // static field
  method() {}               // instance method
  static helper() {}        // static method
}

// Instance side — what `new Foo()` produces
const instFoo: Foo = new Foo();
instFoo.x;                  // ✅ 1

// Static side — the constructor function itself
const CtorFoo: typeof Foo = Foo;
CtorFoo.y;                  // ✅ 2
CtorFoo.helper();           // ✅
// CtorFoo.x;               // ❌ — `x` is instance-side

// 🔸 `typeof Foo` gives the static side
// 🔸 `Foo` (bare) gives the instance side

/* ============================================================
 *  8️⃣ EDGE CASES & PITFALLS
 * ============================================================ */

// ⚠️ You MUST call `new` — cannot invoke a class without it.
//     `Person("x")` → ❌ TypeError
// ⚠️ Field initializers run BEFORE the constructor body.
// ⚠️ In DERIVED classes, `super()` must be called BEFORE any use of `this`.
// ⚠️ Static members cannot access instance members via `this`.
// ⚠️ Under `strictPropertyInitialization`, every field must be initialized
//     in the declaration OR in the constructor. Otherwise, use `!` or `?`.
// ⚠️ `private` here is COMPILE-TIME only — use `#private` for runtime privacy
//     (see 02_Access_Modifiers.ts).
// ⚠️ Class fields with arrow-function values capture `this` (good for handlers).
// ⚠️ Methods are on the prototype — arrow fields are per-instance (memory cost).

class WithArrow {
  name = "x";
  handler = () => console.log(this.name);  // arrow — bound `this`
  method() { console.log(this.name); }     // prototype — dynamic `this`
}

// ⚠️ Class declarations are NOT hoisted the way function declarations are.
//     `new X()` before `class X {}` → ReferenceError (temporal dead zone).

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature             | Syntax                                  |
 * ─────────────────────────────────────────────────────────────
 * | Declaration         | class C { ... }                         |
 * | Constructor         | constructor(...) {}                     |
 * | Parameter property  | constructor(public x: number) {}        |
 * | Instance method     | m(): R { }                              |
 * | Static method       | static m(): R { }                       |
 * | Static field        | static x = 1                            |
 * | Getter              | get x(): T { }                          |
 * | Setter              | set x(v: T) { }                         |
 * | Readonly field      | readonly x: T                           |
 * | Fluent method       | m(): this { return this; }              |
 * | Instance type       | InstanceType<typeof C>                  |
 * | Static type         | typeof C                                |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use parameter properties to reduce constructor boilerplate.
 *  - Prefer `readonly` for fields set once.
 *  - Enable `strictPropertyInitialization` (part of `strict: true`).
 *  - Use getters/setters when you need computed or validated access.
 *  - Return `this` for chainable APIs.
 *  - Use arrow-function fields only when you need bound `this`.
 *  - Prefer `#private` over `private` for real encapsulation (next file).
 * ============================================================ */