// interfaces-complete.ts

/* ============================================================
 *  📘 INTERFACES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. Basic interface declaration
 *   2. Optional & readonly properties
 *   3. Extending interfaces (single + multiple)
 *   4. Interfaces for function types
 *   5. Interfaces for array / index signatures
 *   6. Hybrid types (callable + props)
 *   7. Interfaces for classes (implements)
 *   8. Interface declaration merging
 *   9. Interfaces vs Type aliases (deep comparison)
 *  10. Generic interfaces
 *  11. Interface with method signatures
 *  12. Recursive & nested interfaces
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ BASIC INTERFACE DECLARATION
 * ============================================================ */

// Interfaces define the shape of an object.
// They describe the structure an object must adhere to.
interface Person {
  name: string;
  age: number;
  isEmployed: boolean;
}

const employee: Person = {
  name: "Aarav",
  age: 30,
  isEmployed: true,
};

/* ============================================================
 *  2️⃣ OPTIONAL & READONLY PROPERTIES
 * ============================================================ */

// Optional — property may be omitted
interface Product {
  id: number;
  name: string;
  description?: string; // optional
}

// Readonly — cannot be reassigned after creation
interface User {
  readonly id: number;
  username: string;
}

const user: User = { id: 101, username: "coder123" };
// user.id = 102; // ❌ Error: Cannot assign to 'id' — read-only property

// 🔸 readonly is SHALLOW — nested objects remain mutable
interface Config {
  readonly theme: { color: string };
}
const cfg: Config = { theme: { color: "dark" } };
cfg.theme.color = "light"; // ✅ allowed — only the reference is readonly

// 🔸 readonly arrays via interface
interface ReadonlyList {
  readonly items: readonly string[];
}

/* ============================================================
 *  3️⃣ EXTENDING INTERFACES
 * ============================================================ */

// Single inheritance
interface Animal { species: string }

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const myDog: Dog = {
  species: "Canine",
  breed: "Labrador",
  bark() { console.log("Woof!"); },
};

// Multiple inheritance
interface A { a: number }
interface B { b: number }
interface AB extends A, B { c: number }

const ab: AB = { a: 1, b: 2, c: 3 };

// 🔸 Extending a type alias (interface can extend a type if it's an object)
type Named = { name: string };
interface Aged extends Named { age: number }

// ⚠️ Interfaces can only extend object-like types — NOT unions/primitives
// interface Bad extends string {}   // ❌

/* ============================================================
 *  4️⃣ INTERFACES FOR FUNCTION TYPES
 * ============================================================ */

// Call signature describes a callable shape
interface StringFormatter {
  (input: string): string;
}

const toUpperCase: StringFormatter = (text) => text.toUpperCase();

// 🔸 Overloaded call signatures in one interface
interface Parser {
  (input: string): string[];
  (input: number): number[];
  (input: boolean): boolean[];
}

// 🔸 Call signature + property (see hybrid types below)

/* ============================================================
 *  5️⃣ INTERFACES FOR ARRAY / INDEX SIGNATURES
 * ============================================================ */

// Numeric index signature
interface StringArray {
  [index: number]: string;
}
const fruits: StringArray = ["apple", "banana", "cherry"];

// String index signature
interface StringMap {
  [key: string]: number;
}
const scores: StringMap = { math: 90, science: 85 };

// 🔸 Mixing explicit props with index signature — explicit must match
interface Mixed {
  known: string;
  [key: string]: string;   // `known` must be string-compatible
}

// ⚠️ Index signature types must be assignable to explicit props (and vice versa).

/* ============================================================
 *  6️⃣ HYBRID TYPES — CALLABLE + PROPS
 * ============================================================ */

// Interface that is both callable AND has properties.
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  const counter = ((start: number) => `Starting at ${start}`) as Counter;
  counter.interval = 1000;
  counter.reset = () => console.log("Counter reset");
  return counter;
}

const c = getCounter();
console.log(c(10));       // Starting at 10
c.reset();                // Counter reset
console.log(c.interval);  // 1000

// 🧠 Common in real libs: e.g., jQuery `$` is callable + has `.ajax()` etc.

/* ============================================================
 *  7️⃣ INTERFACES FOR CLASSES (IMPLEMENTS)
 * ============================================================ */

interface Clock {
  currentTime: Date;
  tick(): void;
}

class DigitalClock implements Clock {
  currentTime: Date = new Date();
  tick() { this.currentTime = new Date(); }
}

// 🔸 A class can implement multiple interfaces
interface A2 { a: number }
interface B2 { b: number }
class Both implements A2, B2 {
  a = 1;
  b = 2;
}

// ⚠️ Class implementing an interface must include all non-optional members.
// ⚠️ Interfaces describe the PUBLIC shape — private/protected members are excluded.

/* ============================================================
 *  8️⃣ INTERFACE DECLARATION MERGING
 * ============================================================ */

// Interfaces with the SAME NAME merge automatically (unlike type aliases).
interface Window {
  title: string;
}
interface Window {
  size: number;
}
const win: Window = { title: "My App", size: 800 };

// 🔸 Real-world use: augmenting third-party / global types
declare global {
  interface Window { myCustomProp: string }
}
// window.myCustomProp = "hi";  // now typed

// ⚠️ Merging conflicts (same key, different types) → compile error.
// interface X { a: string }
// interface X { a: number }   // ❌

/* ============================================================
 *  9️⃣ INTERFACES vs TYPE ALIASES — DEEP COMPARISON
 * ============================================================ */

// Both can describe object shapes:
type Vehicle = { make: string; model: string };
interface VehicleI { make: string; model: string }

// 🔸 Feature matrix
// ┌──────────────────────────────┬───────────┬───────────┐
// │ Feature                       │ interface │ type      │
// ├──────────────────────────────┼───────────┼───────────┤
// │ Object shape                  │ ✅        │ ✅        │
// │ Extends / inheritance         │ ✅        │ ✅ (via &)│
// │ Declaration merging           │ ✅        │ ❌        │
// │ Implements in classes         │ ✅        │ ✅        │
// │ Union types                   │ ❌        │ ✅        │
// │ Intersection types            │ ❌        │ ✅        │
// │ Tuple types                   │ ❌        │ ✅        │
// │ Primitive alias               │ ❌        │ ✅        │
// │ Conditional / mapped types    │ ❌        │ ✅        │
// │ Template literal types        │ ❌        │ ✅        │
// │ Better error messages         │ ✅        │ ❌        │
// │ Performance (large codebases) │ ✅ faster │ ⚠️ slower │
// └──────────────────────────────┴───────────┴───────────┘

// 🔸 Union — only type
type Status = "success" | "error" | "loading";

// 🔸 Primitive alias — only type
type ID = string | number;

// 🔸 Tuple — only type (as an alias)
type Point = [number, number];

// 🔸 Conditional — only type
type IsString<T> = T extends string ? true : false;

/* ============================================================
 *  🔟 GENERIC INTERFACES
 * ============================================================ */

interface Box<T> { value: T }
interface Pair<K, V> { key: K; value: V }

// Constraint
interface HasLength<T extends { length: number }> { item: T }

// Default
interface Container<T = string> { items: T[] }

// Generic method inside interface
interface Repo<T> {
  get(id: number): T;
  save(item: T): void;
}

/* ============================================================
 *  1️⃣1️⃣ INTERFACE WITH METHOD SIGNATURES
 * ============================================================ */

interface Service {
  // Method syntax — bivariant
  start(): void;
  stop(): Promise<void>;

  // Property syntax — checked strictly (preferred under strictFunctionTypes)
  reload: () => void;
}

// 🧠 Prefer property-function syntax for stricter variance checking.

/* ============================================================
 *  1️⃣2️⃣ RECURSIVE & NESTED INTERFACES
 * ============================================================ */

interface TreeNode {
  value: number;
  children: TreeNode[];   // recursive reference
}

interface Config2 {
  theme: string;
  nested: {
    fontSize: number;
    colors: { primary: string; secondary: string };
  };
}

// 🔸 JSON-like structures are commonly modeled this way.

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Interfaces only describe OBJECTS — not primitives, unions, or tuples.
// ⚠️ Declaration merging is a feature AND a footgun — accidental merges happen.
// ⚠️ `readonly` is shallow — deeply freeze objects manually if needed.
// ⚠️ Index signatures force all explicit props to match the index type.
// ⚠️ Under `strictFunctionTypes`, method syntax is bivariant but property
//    syntax is contravariant — pick deliberately.
// ⚠️ Interfaces can extend multiple interfaces but only OBJECT-like types.
// ⚠️ Classes implementing interfaces must declare every required member.

// 🕒 Version notes
// - Interfaces have been stable since TS 1.0
// - Declaration merging dates back to early TS
// - `strictFunctionTypes` (TS 2.6) affects method vs property syntax
// - `readonly` arrays and tuples refined in TS 3.4

// 🔸 Your sample at the end:
interface newtest {
  male: 'F' | 'M';
  name: string;
}

let a: newtest = {
  male: 'F',
  name: 'Hello'
};

console.log(a); // { male: 'F', name: 'Hello' }

// 🔸 Note: `male` is a LITERAL UNION — only 'F' or 'M' allowed.
//    Renaming to `gender` would follow naming conventions better.

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept                     | Syntax                                    |
 * ─────────────────────────────────────────────────────────────
 * | Basic declaration           | interface X { a: number }                 |
 * | Optional prop               | { a?: string }                            |
 * | Readonly prop               | { readonly id: number }                   |
 * | Extends (single)            | interface B extends A {}                  |
 * | Extends (multiple)          | interface C extends A, B {}               |
 * | Call signature              | { (x: string): string }                   |
 * | Numeric index               | { [i: number]: string }                   |
 * | String index                | { [k: string]: number }                   |
 * | Hybrid type                 | { (x: number): string; prop: number }     |
 * | Implements (class)          | class C implements I {}                   |
 * | Declaration merging         | interface X {}; interface X {}            |
 * | Generic interface           | interface Box<T> { value: T }             |
 * | Generic constraint          | interface B<T extends X> {}               |
 * | Recursive interface         | interface T { children: T[] }             |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use `interface` for public APIs, class contracts, and object shapes.
 *  - Use `type` for unions, intersections, tuples, and complex compositions.
 *  - Prefer property-function syntax (`reload: () => void`) under strict mode.
 *  - Avoid declaration merging unless you INTEND to augment (e.g., global).
 *  - Prefer readonly for immutable shapes; document deeply-frozen invariants.
 *  - Prefer generic interfaces over `any` for reusable containers.
 *  - Prefer unions over enums when values are a small closed set.
 *
 * 🧠 RULE OF THUMB
 *  - Structure  →  interface
 *  - Composition →  type
 * ============================================================ */