// 05_Classes_OOP/03_OOPs_Concepts.ts

/* ============================================================
 *  📘 OOP CONCEPTS IN TYPESCRIPT
 *
 *  Sections:
 *   1. Encapsulation
 *   2. Inheritance (extends, super, override)
 *   3. Polymorphism (subtype, parametric, ad-hoc)
 *   4. Abstraction (abstract classes)
 *   5. Composition over inheritance
 *   6. Interfaces as contracts (implements)
 *   7. Mixins
 *   8. SOLID principles (quick tour)
 *   9. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ ENCAPSULATION
 * ============================================================ */

// Hide internal state; expose a controlled public API.

class BankAccount {
  #balance = 0;                                   // truly private

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Invalid deposit");
    this.#balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }

  get balance(): number { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.withdraw(30);
console.log(acc.balance);       // 70

/* ============================================================
 *  2️⃣ INHERITANCE
 * ============================================================ */

class Animal {
  constructor(public name: string) {}
  speak(): void { console.log(`${this.name} makes a sound.`); }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);                          // must call super first
  }
  override speak(): void {
    console.log(`${this.name} (${this.breed}) barks.`);
    super.speak();                        // call parent method
  }
}

new Dog("Rex", "Lab").speak();

// 🔸 `override` keyword (TS 4.3+) — required under noImplicitOverride.
// 🔸 Override signature must be compatible with the base method.

/* ============================================================
 *  3️⃣ POLYMORPHISM
 * ============================================================ */

// 🔸 Subtype polymorphism — subclasses can stand in for parents.
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private r: number) { super(); }
  area(): number { return Math.PI * this.r ** 2; }
}

class Square extends Shape {
  constructor(private s: number) { super(); }
  area(): number { return this.s ** 2; }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((t, s) => t + s.area(), 0);
}

totalArea([new Circle(1), new Square(2)]);   // polymorphic call

// 🔸 Parametric polymorphism — generics
class Box<T> {
  constructor(public value: T) {}
  map<U>(fn: (v: T) => U): Box<U> { return new Box(fn(this.value)); }
}

// 🔸 Ad-hoc polymorphism — function/method overloading
function print(x: string): void;
function print(x: number): void;
function print(x: string | number): void { console.log(x); }

/* ============================================================
 *  4️⃣ ABSTRACTION
 * ============================================================ */

// Abstract classes define shared behavior + enforce subclass contracts.

abstract class Repository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<void>;

  // Concrete shared helper available to subclasses
  protected log(action: string): void {
    console.log(`[${this.constructor.name}] ${action}`);
  }
}

class UserRepository extends Repository<{ id: string; name: string }> {
  async findById(id: string) { this.log(`findById(${id})`); return null; }
  async save() { this.log("save"); }
}

// 🔸 Rule: abstract classes CANNOT be instantiated directly.
//     They CAN declare abstract methods (no body) and concrete methods (with body).

/* ============================================================
 *  5️⃣ COMPOSITION OVER INHERITANCE
 * ============================================================ */

// Prefer "has-a" over "is-a" — less coupling, easier testing.

// ❌ Fragile inheritance:
// class Logger {} class Service extends Logger {}

// ✅ Composition:
class Logger {
  log(msg: string): void { console.log(msg); }
}

class Service {
  constructor(private logger: Logger = new Logger()) {}
  run(): void { this.logger.log("running"); }
}

// 🔸 Dependency injection (constructor param) makes testing easy.

/* ============================================================
 *  6️⃣ INTERFACES AS CONTRACTS (implements)
 * ============================================================ */

interface Serializable {
  serialize(): string;
  deserialize(input: string): void;
}

interface Loggable {
  log(): void;
}

class Entity implements Serializable, Loggable {
  constructor(public data: Record<string, unknown>) {}
  serialize(): string { return JSON.stringify(this.data); }
  deserialize(input: string): void { this.data = JSON.parse(input); }
  log(): void { console.log("Entity:", this.data); }
}

// 🔸 A class can `extends` one class AND `implements` many interfaces.
// 🔸 Interfaces describe PUBLIC shape — private/protected ignored.

/* ============================================================
 *  7️⃣ MIXINS
 * ============================================================ */

// Composing behaviors without deep inheritance chains.

type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();
    getAge() { return Date.now() - this.timestamp.getTime(); }
  };
}

function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tag = "";
    setTag(t: string) { this.tag = t; }
  };
}

class BaseEntity { id = ""; }

const TrackedEntity = Tagged(Timestamped(BaseEntity));

const te = new TrackedEntity();
te.id = "1";
te.setTag("user");
console.log(te.getAge());

/* ============================================================
 *  8️⃣ SOLID PRINCIPLES (QUICK TOUR)
 * ============================================================ */

// S — Single Responsibility
//     One reason to change. Split large classes.
//     ❌ class User { save(); email(); render(); }
//     ✅ class UserRepository / EmailService / UserRenderer

// O — Open/Closed
//     Open for extension, closed for modification.
//     Extend via subclasses/interfaces, not by editing base logic.

// L — Liskov Substitution
//     Subtypes must be substitutable for their base type.
//     Overriding must preserve behavior contracts.

// I — Interface Segregation
//     Small, focused interfaces over fat ones.
//     interface Reader { read() } interface Writer { write() }

// D — Dependency Inversion
//     Depend on abstractions, not concretions.
//     constructor(private logger: LoggerInterface) {}

/* ============================================================
 *  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `super()` must be called BEFORE `this` in a derived constructor.
// ⚠️ Overriding must be COMPATIBLE — narrowing params or widening returns
//     can break Liskov substitution.
// ⚠️ Abstract classes cannot be instantiated — but CAN hold shared logic.
// ⚠️ `abstract` members must be implemented by concrete subclasses.
// ⚠️ Mixin chains grow types quickly — mind complexity.
// ⚠️ Prefer composition for cross-cutting concerns (logging, caching).
// ⚠️ Prefer interfaces for contracts, classes for implementation.
// ⚠️ `override` under `noImplicitOverride` catches accidental overrides.
// ⚠️ Static side is NOT inherited by subclasses in the same way — `this` in
//     static methods refers to the derived constructor.

// 🕒 Version notes
// - `super` and inheritance: TS 1.0+
// - `abstract` classes: TS 1.0+
// - `override` keyword: TS 4.3
// - Mixins with generic constructors: TS 2.2+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept        | Tool                                |
 * ─────────────────────────────────────────────────────────────
 * | Encapsulation  | private / protected / #field        |
 * | Inheritance    | extends, super, override            |
 * | Polymorphism   | abstract / override / generics      |
 * | Abstraction    | abstract class / interface          |
 * | Composition    | constructor injection               |
 * | Contracts      | implements                          |
 * | Mixins         | generic constructor + class expr    |
 * | SOLID          | principles summary                  |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Favor composition over inheritance.
 *  - Program to interfaces, not implementations.
 *  - Prefer abstract classes for shared code, interfaces for contracts.
 *  - Use `override` for clear intent.
 *  - Keep inheritance shallow (2–3 levels max).
 *  - Apply SOLID when the codebase grows.
 * ============================================================ */