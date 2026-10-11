// 04-object-types.ts

/* ============================================================
 *  📘 OBJECT TYPES — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. Interface (incl. extends, merging, generics)
 *   2. Type alias for objects
 *   3. Class (modifiers, abstract, getters/setters, static)
 *   4. Enum (numeric, string, const, reverse mapping)
 *   5. Array (readonly, generics, tuple combos)
 *   6. Tuple (labeled, optional, rest, readonly)
 *   7. Object literal / inline types
 *   8. Index signatures & mapped types
 *   9. Discriminated unions & intersection types
 *  10. keyof / indexed access
 *  11. Utility types (Pick, Omit, Partial, Required, Record, Readonly)
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ INTERFACE
 * ============================================================ */

interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const user1: User = { id: 101, name: "Aarav", isActive: true };

// Optional & readonly
interface Product {
  readonly id: number;      // cannot reassign after creation
  name: string;
  price?: number;
}
const p1: Product = { id: 1, name: "Laptop" };
// p1.id = 2; // ❌

// Extending
interface Admin extends User { role: "super" | "mod" }

// Multiple extends
interface A { a: number }
interface B { b: number }
interface AB extends A, B {}

// 🔸 Declaration merging — two interfaces with the same name MERGE
interface Config { theme: string }
interface Config { locale: string }
const cfg: Config = { theme: "dark", locale: "en" }; // ✅

// 🔸 Generic interfaces
interface Box<T> { value: T }
interface Pair<K, V> { key: K; value: V }

// 🔸 Interfaces with methods
interface Service {
  start(): void;
  stop(): Promise<void>;
}

/* ============================================================
 *  2️⃣ TYPE ALIAS FOR OBJECTS
 * ============================================================ */

type Point = { x: number; y: number };

// 🔸 Interface vs Type alias — key differences
// - Interfaces: extendable, mergeable, better error messages.
// - Type aliases: can alias ANY type (unions, primitives, tuples).
// - Types cannot be declaration-merged.
// - Types cannot extend other types (but can intersect with `&`).

/* ============================================================
 *  3️⃣ CLASS
 * ============================================================ */

class Animal {
  species: string;
  constructor(species: string) { this.species = species; }
  speak(): void { console.log(`${this.species} makes a sound.`); }
}
new Animal("Dog").speak();

// 🔸 Access modifiers
class Employee {
  public    name: string;         // default
  private   salary: number;       // only this class
  protected dept: string;         // this + subclasses
  readonly  id: number;           // set once

  constructor(name: string, salary: number, dept: string, id: number) {
    this.name = name;
    this.salary = salary;
    this.dept = dept;
    this.id = id;
  }
}

// 🔸 Parameter properties (shorthand)
class Short {
  constructor(public name: string, private age: number) {}
}

// 🔸 Inheritance
class Manager extends Employee {
  constructor(n: string, s: number, d: string, i: number) { super(n, s, d, i); }
  describe() { return `${this.name} (${this.dept})`; }
}

// 🔸 Implements an interface
interface Shape { area(): number }
class Circle implements Shape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2; }
}

// 🔸 Abstract classes
abstract class Base {
  abstract doWork(): void;       // must be implemented by subclasses
  helper(): void { console.log("helper"); }
}
class Impl extends Base { doWork() { console.log("done"); } }
// new Base(); // ❌ cannot instantiate abstract class

// 🔸 Getters / setters
class Temp {
  private _c = 0;
  get celsius(): number { return this._c; }
  set celsius(v: number) { this._c = v; }
  get fahrenheit(): number { return this._c * 9/5 + 32; }
}

// 🔸 Static members
class Counter {
  static count = 0;
  static increment() { Counter.count++; }
}
Counter.increment();

// 🔸 Implements vs extends — a class can do both
class Hybrid extends Base implements Shape {
  doWork() {}
  area() { return 0; }
}

/* ============================================================
 *  4️⃣ ENUM
 * ============================================================ */

// Numeric (auto-increment)
enum Direction { Up, Down, Left, Right }   // 0,1,2,3
const d: Direction = Direction.Left;        // 2
Direction[d];                               // "Left" — reverse mapping

// Explicit values
enum Status { Active = 1, Inactive = 0, Unknown = -1 }

// String enum
enum Level { Info = "INFO", Warn = "WARN", Error = "ERROR" }

// const enum — inlined at compile time (no runtime object)
const enum LogLvl { Info, Warn, Error }

// Heterogeneous enum (mixed) — discouraged
enum Mixed { No = 0, Yes = "YES" }

// ⚠️ Enum gotchas
// - Numeric enums allow ANY number to be assigned (unsafe):
//     const x: Direction = 999;   // ✅ compiles
// - String enums do NOT have reverse mapping.
// - `const enum` needs `isolatedModules: false` or `preserveConstEnums`.

// 🔸 Prefer union types over enums when possible:
type Dir2 = "up" | "down" | "left" | "right";

/* ============================================================
 *  5️⃣ ARRAY
 * ============================================================ */

const fruits: string[] = ["Apple", "Banana"];
const scores: Array<number> = [90, 85];

// Readonly array
const colors: readonly string[] = ["red"];
// colors.push("blue"); // ❌
const colors2: ReadonlyArray<string> = ["red"];

// Array of objects
const users: User[] = [{ id: 1, name: "A", isActive: true }];

// Generic array helpers
function first<T>(arr: readonly T[]): T | undefined { return arr[0]; }

// ⚠️ `string[]` and `Array<string>` are identical — pick one style.

/* ============================================================
 *  6️⃣ TUPLE
 * ============================================================ */

const pair: [number, string] = [1, "a"];

// Labeled tuples (TS 4.0+)
const point: [x: number, y: number] = [10, 20];

// Optional + rest elements
type Range = [start: number, end?: number, ...extras: number[]];

// Readonly tuple
const ro: readonly [number, string] = [1, "a"];

// Tuples in rest params
function logAll(...args: [string, number, boolean]) { }
logAll("a", 1, true);

// Variadic tuple types (TS 4.0+)
type Concat<A extends any[], B extends any[]> = [...A, ...B];
type AB = Concat<[1, 2], [3, 4]>;  // [1, 2, 3, 4]

// Destructuring preserves types
const [id, name, active] = [1, "a", true] as const;

/* ============================================================
 *  7️⃣ OBJECT LITERAL / INLINE
 * ============================================================ */

const settings: { theme: string; notif: boolean } = { theme: "dark", notif: true };

// Reusable via type alias
type Prefs = { theme: string; notif: boolean };
const prefs: Prefs = { theme: "dark", notif: true };

// Excess property checks (fresh literal)
// const bad: Prefs = { theme: "dark", notif: true, extra: 1 }; // ❌

/* ============================================================
 *  8️⃣ INDEX SIGNATURES & MAPPED TYPES
 * ============================================================ */

// Index signature
type Dict = { [key: string]: number };
const d1: Dict = { a: 1, b: 2 };

// Constrained key index
type Only2 = { [K in "a" | "b"]: number };
const o: Only2 = { a: 1, b: 2 };

// Mapped type helper
type MyPartial<T> = { [K in keyof T]?: T[K] };

// 🔸 Mixing index signature with explicit props — explicit must be compatible
interface Mixed2 {
  known: string;              // must be assignable to index type
  [key: string]: string;
}

/* ============================================================
 *  9️⃣ DISCRIMINATED UNIONS & INTERSECTION TYPES
 * ============================================================ */

// Discriminated union — every variant has a literal `kind` field
type Result =
  | { kind: "ok"; value: number }
  | { kind: "err"; message: string };

function handle(r: Result) {
  switch (r.kind) {
    case "ok":  return r.value;
    case "err": return r.message;
  }
}

// Intersection types
type Named = { name: string };
type Aged  = { age: number };
type Person = Named & Aged;
const p: Person = { name: "R", age: 25 };

// ⚠️ Intersection of conflicting primitives = never
// type Bad = string & number; // never

/* ============================================================
 *  🔟 keyof / INDEXED ACCESS
 * ============================================================ */

type U = { id: number; name: string };
type UKeys = keyof U;          // "id" | "name"
type UIdType = U["id"];        // number
type UValues = U[keyof U];     // number | string

// keyof + generic
function get<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }

/* ============================================================
 *  1️⃣1️⃣ UTILITY TYPES (A SUMMARY)
 * ============================================================ */

// Partial<T>       — all props optional
// Required<T>      — all props required
// Readonly<T>      — all props readonly
// Pick<T, K>       — subset by keys
// Omit<T, K>       — remove by keys
// Record<K, V>     — { [k in K]: V }
// Exclude<T, U>    — remove from union
// Extract<T, U>    — keep overlap
// NonNullable<T>   — remove null/undefined
// ReturnType<F>    — function return type
// Parameters<F>    — tuple of params
// Awaited<T>       — unwrap Promise
// InstanceType<C>  — instance type of a class

type UP = Partial<User>;
type UR = Required<Product>;
type URo = Readonly<User>;
type UPick = Pick<User, "id" | "name">;
type UOmit = Omit<User, "isActive">;
type URec = Record<"a" | "b", number>;

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Interfaces MERGE; type aliases do NOT. Accidental merges are a real bug source.
// ⚠️ Excess property checks apply only to FRESH object literals.
// ⚠️ Index signatures make all props compatible with the index type.
// ⚠️ Numeric enums allow ANY number — prefer string enums or unions.
// ⚠️ `readonly` is shallow — nested props remain mutable.
// ⚠️ Abstract classes cannot be instantiated, but can be extended.
// ⚠️ Class field initialization order matters (fields run before constructor body in modern TS).

// 🕒 Version notes
// - TS 2.0  — readonly, discriminated unions
// - TS 2.7  — strictPropertyInitialization
// - TS 3.0  — unknown in catch, tuples in rest
// - TS 3.4  — readonly arrays
// - TS 4.0  — variadic tuple types, labeled tuples
// - TS 4.1  — template literal types in mapped types
// - TS 4.9  — satisfies
// - TS 5.0  — decorators, const type params

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Type             | Syntax                                  |
 * ─────────────────────────────────────────────────────────────
 * | Interface        | interface U { id: number }              |
 * | Type alias       | type P = { x: number }                  |
 * | Class            | class A { constructor() {} }            |
 * | Abstract class   | abstract class A { abstract f(): void } |
 * | Enum (num)       | enum D { Up, Down }                     |
 * | Enum (string)    | enum L { A = "A" }                      |
 * | Const enum       | const enum X { A }                      |
 * | Array            | string[] or Array<string>               |
 * | Readonly array   | readonly string[]                       |
 * | Tuple            | [number, string]                        |
 * | Variadic tuple   | [...A, ...B]                            |
 * | Object literal   | { theme: string; ... }                  |
 * | Index signature  | { [k: string]: number }                 |
 * | Mapped type      | { [K in keyof T]: ... }                 |
 * | Discriminated U  | { kind: "a"; ... } \| { kind: "b"; ... }|
 * | Intersection     | A & B                                   |
 * | keyof            | keyof T                                 |
 * | Indexed access   | T[K]                                    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer `interface` for public APIs; `type` for unions/aliases.
 *  - Prefer string unions over enums for simplicity.
 *  - Use `readonly` arrays/tuples in function params for immutability.
 *  - Prefer discriminated unions over enums for tagged variants.
 *  - Use utility types instead of rewriting shapes manually.
 *  - Avoid heterogeneous enums.
 * ============================================================ */