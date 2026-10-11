// 06_Generics/02_Generic_Interfaces.ts

/* ============================================================
 *  📘 GENERIC INTERFACES
 *
 *  Sections:
 *   1. Basic generic interface
 *   2. Generic interface with multiple type params
 *   3. Generic interface + methods
 *   4. Generic interface for functions (call signatures)
 *   5. Generic interface extending other interfaces
 *   6. Generic interface implemented by a class
 *   7. Generic interfaces for data structures
 *   8. Interfaces with default generics
 *   9. Interface vs type alias for generics
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ BASIC GENERIC INTERFACE
 * ============================================================ */

interface Box<T> {
  value: T;
}

const numBox: Box<number> = { value: 1 };
const strBox: Box<string> = { value: "hi" };

// 🔸 Generic interface as a type in function params
function unbox<T>(box: Box<T>): T { return box.value; }
unbox(numBox);            // number

/* ============================================================
 *  2️⃣ MULTIPLE TYPE PARAMETERS
 * ============================================================ */

interface Pair<K, V> {
  key: K;
  value: V;
}

const p: Pair<string, number> = { key: "age", value: 30 };

// 🔸 Structured records
interface ApiResponse<TData, TError = string> {
  ok: boolean;
  data?: TData;
  error?: TError;
}

const r1: ApiResponse<{ id: number }> = { ok: true, data: { id: 1 } };
const r2: ApiResponse<null, { code: number; msg: string }> = {
  ok: false,
  error: { code: 404, msg: "not found" },
};

/* ============================================================
 *  3️⃣ GENERIC INTERFACE + METHODS
 * ============================================================ */

interface Repository<T> {
  get(id: string): T | undefined;
  save(item: T): void;
  list(): T[];
}

// 🔸 Generic methods INSIDE a generic interface
interface Transformer<T> {
  map<U>(fn: (v: T) => U): Transformer<U>;
  reduce<U>(fn: (acc: U, v: T) => U, init: U): U;
  value(): T;
}

// 🔸 Interface with both generic and non-generic methods
interface Cache<T> {
  get(key: string): T | undefined;      // uses T from interface
  clear(): void;                         // doesn't use T
  map<U>(fn: (v: T) => U): Cache<U>;     // own type param U
}

/* ============================================================
 *  4️⃣ GENERIC INTERFACE FOR FUNCTIONS
 * ============================================================ */

// Call signature with generic type
interface Mapper<In, Out> {
  (input: In): Out;
}

const toLen: Mapper<string, number> = (s) => s.length;

// 🔸 Generic call signature on the interface itself
interface Callable {
  <T>(x: T): T;
}

const idCall: Callable = <T,>(x: T) => x;
idCall(42);               // number
idCall("hi");             // string

// 🔸 Overloaded generic call signatures
interface Parsable {
  <T>(input: string, parser: (s: string) => T): T;
  (input: string): string;
}

/* ============================================================
 *  5️⃣ GENERIC INTERFACE EXTENDING OTHER INTERFACES
 * ============================================================ */

interface HasId { id: string }

interface Entity<T> extends HasId {
  data: T;
}

// 🔸 Extending another generic interface
interface Wrapper<T> { value: T }

interface NamedWrapper<T> extends Wrapper<T> {
  name: string;
}

// 🔸 Extending multiple interfaces
interface A { a: number }
interface B { b: string }
interface AB<T> extends A, B { value: T }

// 🔸 Extending with constraint
interface WithArray<T extends any[]> { items: T }

/* ============================================================
 *  6️⃣ GENERIC INTERFACE IMPLEMENTED BY A CLASS
 * ============================================================ */

interface Storable<T> {
  save(item: T): void;
  load(): T | undefined;
}

class MemoryStore<T> implements Storable<T> {
  private item?: T;
  save(item: T): void { this.item = item; }
  load(): T | undefined { return this.item; }
}

const store = new MemoryStore<number>();
store.save(42);
store.load();             // number | undefined

/* ============================================================
 *  7️⃣ GENERIC INTERFACES FOR DATA STRUCTURES
 * ============================================================ */

interface LinkedList<T> {
  value: T;
  next: LinkedList<T> | null;
}

interface Tree<T> {
  value: T;
  children: Tree<T>[];
}

interface Graph<TNode, TEdge = { weight: number }> {
  nodes: TNode[];
  edges: [TNode, TNode, TEdge][];
}

interface Queue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  size(): number;
}

/* ============================================================
 *  8️⃣ INTERFACES WITH DEFAULT GENERICS
 * ============================================================ */

interface Response<TData = unknown, TError = Error> {
  ok: boolean;
  data?: TData;
  error?: TError;
}

const res1: Response = { ok: true };                          // defaults
const res2: Response<{ id: number }> = { ok: true, data: { id: 1 } };

/* ============================================================
 *  9️⃣ INTERFACE vs TYPE ALIAS FOR GENERICS
 * ============================================================ */

// Both support generics.
interface IBox<T> { value: T }
type TBox<T> = { value: T };

// 🔸 Interfaces can:
//    - be extended by other interfaces
//    - be declaration-merged
//    - be implemented by classes
// 🔸 Type aliases can:
//    - represent unions/intersections
//    - conditionals, mapped, and template literal types

// 🔸 For generic OBJECT shapes → interfaces preferred.
// 🔸 For generic FUNCTION types or unions → type alias preferred.

// Union using type alias:
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Interfaces can only describe OBJECT-like shapes — not unions/primitives.
// ⚠️ Generic interface without type args uses DEFAULTS or errors:
//     interface Box<T> { value: T }
//     const x: Box = ...       // ❌ T required unless default exists
// ⚠️ Declaration merging on generic interfaces works, but is rarely used.
// ⚠️ Interfaces cannot contain conditional/mapped type expressions directly —
//     use type aliases for those.
// ⚠️ Same-name interface merging must have COMPATIBLE generic signatures:
//     interface Foo<T> {}; interface Foo<T, U = unknown> {}   // ❌ error
// ⚠️ Interfaces with generic methods cannot be implemented by classes that
//     narrow the type params rigidly.

// 🕒 Version notes
// - Generic interfaces: TS 1.0+
// - Default type params in interfaces: TS 2.3+
// - `const` type params: TS 5.0 (mostly for functions/classes)

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature                     | Syntax                          |
 * ─────────────────────────────────────────────────────────────
 * | Basic generic interface     | interface Box<T> { value: T }   |
 * | Multiple type params        | interface Pair<K, V> {}         |
 * | Generic method inside       | map<U>(fn: (v:T)=>U): Foo<U>    |
 * | Call signature + generic    | interface F { <T>(x: T): T }    |
 * | Extends generic interface   | interface X<T> extends Y<T> {}  |
 * | Extends + constraint        | interface X<T extends any[]> {} |
 * | Implemented by class        | class C<T> implements I<T> {}   |
 * | Default generic             | interface R<T = unknown> {}     |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer interfaces for public generic OBJECT shapes.
 *  - Use type aliases for generic UNIONS / conditional / mapped types.
 *  - Keep type params to 2–3 max.
 *  - Provide defaults for optional generics (T = unknown).
 *  - Use constraints for semantic limits (T extends object).
 *  - Prefer `Record<K, V>` over hand-rolled index signature interfaces.
 *  - Prefer `Pick`/`Omit`/`Partial` over rewriting generic shapes.
 * ============================================================ */