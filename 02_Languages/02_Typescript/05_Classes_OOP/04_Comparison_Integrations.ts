// 05_Classes_OOP/04_Comparison_Integrations.ts

/* ============================================================
 *  📘 CLASSES vs INTERFACES vs TYPES — COMPARISON & INTEGRATION
 *
 *  Sections:
 *   1. Interface vs class vs type alias
 *   2. Structural vs nominal typing
 *   3. `implements` vs `extends`
 *   4. Instance type vs constructor type
 *   5. Abstract constructor signatures
 *   6. Interfaces describing classes
 *   7. Classes in generic positions
 *   8. Declaration merging
 *   9. Best practices for choosing
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ INTERFACE vs CLASS vs TYPE ALIAS
 * ============================================================ */

// Interface — contract, compile-time only.
interface IUser { name: string; age: number }

// Type alias — any type, compile-time only.
type TUser = { name: string; age: number };

// Class — runtime construct + type.
class CUser {
  constructor(public name: string, public age: number) {}
  greet() { return `Hi ${this.name}`; }
}

// 🔸 Key differences
// ┌──────────────────────────┬───────────┬────────┬───────┐
// │ Feature                   │ interface │ type   │ class │
// ├──────────────────────────┼───────────┼────────┼───────┤
// │ Runtime construct         │ ❌        │ ❌     │ ✅    │
// │ Declaration merging       │ ✅        │ ❌     │ ❌    │
// │ Extends                   │ ✅        │ ✅ (&) │ ✅    │
// │ Implements                │ ❌        │ ❌     │ ✅    │
// │ Union / tuple / mapped    │ ❌        │ ✅     │ ❌    │
// │ Instance state            │ ❌        │ ❌     │ ✅    │
// │ Methods (real)            │ ❌        │ ❌     │ ✅    │
// │ Access modifiers          │ ❌        │ ❌     │ ✅    │
// │ Abstract members          │ ❌        │ ❌     │ ✅    │
// └──────────────────────────┴───────────┴────────┴───────┘

/* ============================================================
 *  2️⃣ STRUCTURAL vs NOMINAL TYPING
 * ============================================================ */

// TypeScript uses STRUCTURAL typing — shape compatibility.
// Exception: classes with `private` / `protected` members are NOMINAL.

class A { x = 0 }
class B { x = 0 }
const a: A = new B();            // ✅ same shape (public)

class P { private s = 1 }
class Q { private s = 1 }
// const p: P = new Q();         // ❌ nominal — different `s` declarations

// 🔸 Interfaces are always structural — no nominal behavior.

/* ============================================================
 *  3️⃣ `implements` vs `extends`
 * ============================================================ */

// `extends`  — inherit implementation AND contract.
// `implements` — inherit CONTRACT only.

class BaseC { run() { console.log("base run"); } }

interface Contract { run(): void }

class X extends BaseC {}
new X().run();                   // inherited implementation

class Y implements Contract {
  run(): void { console.log("Y run"); }   // must implement
}

// 🔸 Class can do both:
class Z extends BaseC implements Contract {
  run(): void { console.log("Z run"); }
}

// 🔸 A class can extend ONE class + implement MULTIPLE interfaces.

/* ============================================================
 *  4️⃣ INSTANCE TYPE vs CONSTRUCTOR TYPE
 * ============================================================ */

class Person {
  constructor(public name: string) {}
  greet() {}
}

// Instance type → the shape of `new Person()`
type PersonInstance = Person;                    // instance side

// Constructor type → the shape of `Person` itself
type PersonCtor = typeof Person;                 // static side

// Utility helpers
type P2 = InstanceType<typeof Person>;           // instance side
type Args = ConstructorParameters<typeof Person>; // [string]

// 🔸 Typing a parameter that IS a constructor
function makeInstance(Ctor: typeof Person, name: string): Person {
  return new Ctor(name);
}

/* ============================================================
 *  5️⃣ ABSTRACT CONSTRUCTOR SIGNATURES (TS 4.2+)
 * ============================================================ */

abstract class Animal {
  abstract speak(): void;
}

type AnimalCtor = abstract new () => Animal;

function createAnimal(Ctor: AnimalCtor): Animal {
  return new (Ctor as any)();
}

// 🔸 Regular vs abstract constructor signature
//    Regular: `new () => T`   — requires instantiable class
//    Abstract: `abstract new () => T` — accepts abstract classes too

/* ============================================================
 *  6️⃣ INTERFACES DESCRIBING CLASSES
 * ============================================================ */

// An interface can describe the PUBLIC shape of a class.
interface Greetable { greet(): void }

class Human implements Greetable {
  greet() { console.log("hi"); }
}

// 🔸 Instance-side interface:
interface HumanShape {
  name: string;
  greet(): void;
}

const h: HumanShape = new Human() as any;

// 🔸 Static-side interface:
interface HumanStatic {
  new (name: string): HumanShape;
  species: string;
}

/* ============================================================
 *  7️⃣ CLASSES IN GENERIC POSITIONS
 * ============================================================ */

// Generic constraint on constructor
function create<T>(Ctor: new () => T): T {
  return new Ctor();
}

// Generic constraint on instances
function logProps<T extends object>(obj: T): void {
  console.log(Object.keys(obj));
}

// Factory using a constructor map
const registry = new Map<string, typeof Person>();
registry.set("person", Person);

/* ============================================================
 *  8️⃣ DECLARATION MERGING
 * ============================================================ */

// Interfaces merge; classes do NOT.
interface UserExt { name: string }
interface UserExt { age: number }
const ue: UserExt = { name: "R", age: 25 };      // ✅ merged

// 🔸 A class can merge with a NAMESPACE of the same name:
class Box { x = 1 }
namespace Box { export const version = "1.0"; }
Box.version;                                     // ✅

// 🔸 A class can merge with an INTERFACE (adds instance members):
interface Box { y: number }
// `Box` instances now have `x: number` and `y: number`.

/* ============================================================
 *  9️⃣ BEST PRACTICES FOR CHOOSING
 * ============================================================ */

// Use INTERFACE when:
//   - Describing object shape or class contract
//   - You want declaration merging
//   - You want better error messages
//   - Extending library types globally

// Use TYPE ALIAS when:
//   - Creating unions, intersections, tuples
//   - Aliasing primitives or functions
//   - Using conditional / mapped / template literal types
//   - Composing complex types

// Use CLASS when:
//   - You need runtime code (state, methods, static)
//   - You need instantiation via `new`
//   - You want access modifiers / `#private` / inheritance
//   - You need abstract contracts + shared implementation

// Use both together when:
//   - A class implements an interface for the public API
//   - An interface describes the shape the class exposes
//   - A class extends an abstract base and implements utilities

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Classes with `private`/`protected` members are NOMINAL — you cannot
//     assign one class instance to a structurally identical other.
// ⚠️ `implements` checks only PUBLIC shape.
// ⚠️ Interfaces cannot extend unions or primitives.
// ⚠️ Type aliases cannot be declaration-merged.
// ⚠️ `typeof Class` gives the constructor type; `Class` (bare) gives instance.
// ⚠️ Abstract constructor signatures accept abstract classes.
// ⚠️ Class + namespace merging is a real feature — often used for static-like
//     helpers before modern static support.
// ⚠️ Class + interface merging extends the INSTANCE side (rare, be careful).
// ⚠️ Prefer interfaces for contracts, types for composition, classes for runtime.

// 🕒 Version notes
// - `abstract new () => T`: TS 4.2
// - `override` keyword: TS 4.3
// - `#private`: TS 3.8
// - `const` type params: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Choose             | When                                      |
 * ─────────────────────────────────────────────────────────────
 * | interface          | Object shapes, contracts, merging         |
 * | type               | Unions, tuples, mapped/conditional types  |
 * | class              | Runtime code, instantiation, encapsulation|
 * | extends            | Inherit implementation                    |
 * | implements         | Enforce a contract                        |
 * | abstract class     | Shared code + required overrides          |
 * | typeof Class       | The static side type                      |
 * | InstanceType<C>    | The instance side type                    |
 * | ConstructorParameters<C> | The constructor arg tuple           |
 * | abstract new () => T | Constructor of an abstract class        |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Interfaces for public APIs; types for advanced composition.
 *  - Classes for real behavior, not just shapes.
 *  - Prefer `implements` + composition over deep `extends` chains.
 *  - Use `InstanceType<typeof C>` and `ConstructorParameters<typeof C>` in
 *    factory code.
 *  - Use `abstract new () => T` for factory params accepting abstract classes.
 *  - Avoid accidental class-interface merging.
 * ============================================================ */