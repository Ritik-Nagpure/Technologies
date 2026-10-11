// 06_Generics/01_Generic_Types.ts

/* ============================================================
 *  📘 GENERIC TYPES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. What are generics?
 *   2. Generic functions
 *   3. Generic type aliases
 *   4. Generic classes
 *   5. Multiple type parameters
 *   6. Default type parameters
 *   7. Generic inference (when it works)
 *   8. Explicit type arguments
 *   9. Const type parameters (TS 5.0+)
 *  10. Generic arrow functions (in .ts vs .tsx)
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHAT ARE GENERICS?
 * ============================================================ */

// Generics let you write code that works over MULTIPLE types
// while preserving type information. They're like "type variables".
//
// Without generics → you'd use `any` (loses info) or duplicate code.
// With generics    → one implementation, exact types flow through.

/* ============================================================
 *  2️⃣ GENERIC FUNCTIONS
 * ============================================================ */

// Basic form: `function f<T>(x: T): T`
function identity<T>(value: T): T {
  return value;
}

identity(42);            // T = number
identity("hello");       // T = string
identity({ x: 1 });      // T = { x: number }

// 🔸 Return type can use T in complex ways
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 🔸 Multiple independent generics
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
pair(1, "a");            // [number, string]

// 🔸 Generics with additional (non-generic) parameters
function repeat<T>(value: T, times: number): T[] {
  return Array.from({ length: times }, () => value);
}
repeat("x", 3);          // string[]

// 🔸 Using generics in the return type only
function empty<T>(): T[] {
  return [];
}
const nums: number[] = empty();   // T inferred from annotation

/* ============================================================
 *  3️⃣ GENERIC TYPE ALIASES
 * ============================================================ */

type Box<T> = { value: T };

const b1: Box<number> = { value: 42 };
const b2: Box<string> = { value: "hi" };

// 🔸 Generic tuple alias
type Pair<A, B> = [A, B];

// 🔸 Generic function type
type Mapper<In, Out> = (input: In) => Out;

// 🔸 Generic union alias
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function tryParse<T>(raw: string, parse: (s: string) => T): Result<T> {
  try { return { ok: true, value: parse(raw) }; }
  catch (e) { return { ok: false, error: String(e) }; }
}

// 🔸 Nested generic aliases
type Container<T> = { items: T[] };
type ContainerOfBoxes<T> = Container<Box<T>>;

/* ============================================================
 *  4️⃣ GENERIC CLASSES
 * ============================================================ */

class Stack<T> {
  private items: T[] = [];

  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  get size(): number { return this.items.length; }
}

const s = new Stack<number>();
s.push(1);
s.push(2);
s.pop();                 // number | undefined

// 🔸 Generic class with generic methods
class Wrapper<T> {
  constructor(public value: T) {}

  map<U>(fn: (v: T) => U): Wrapper<U> {
    return new Wrapper(fn(this.value));
  }
}
new Wrapper(1).map((n) => n.toString());   // Wrapper<string>

// 🔸 Generic class + static helpers
class Box2<T> {
  constructor(public value: T) {}
  static of<T>(value: T): Box2<T> { return new Box2(value); }
}
Box2.of(42);             // Box2<number>

/* ============================================================
 *  5️⃣ MULTIPLE TYPE PARAMETERS
 * ============================================================ */

type Dict<K extends string | number, V> = Record<K, V>;

class Table<Row, Key extends keyof Row> {
  constructor(private rows: Row[], private key: Key) {}
  find(value: Row[Key]): Row | undefined {
    return this.rows.find(r => r[this.key] === value);
  }
}

// 🔸 Up to any number of type params — keep it readable (2–3 typically)

/* ============================================================
 *  6️⃣ DEFAULT TYPE PARAMETERS
 * ============================================================ */

// Defaults kick in when inference can't determine T.
type Container2<T = string> = { items: T[] };

const c1: Container2 = { items: ["a"] };          // T = string
const c2: Container2<number> = { items: [1] };    // T = number

function create<T = object>(): T {
  return {} as T;
}
create();                                         // object
create<number>();                                 // number

// 🔸 Default can reference earlier type params
type Pair2<A, B = A> = [A, B];
const p: Pair2<number> = [1, 2];                  // B = number

/* ============================================================
 *  7️⃣ GENERIC INFERENCE
 * ============================================================ */

// TS infers T from arguments when possible.

function head<T>(arr: T[]): T | undefined { return arr[0]; }
head([1, 2, 3]);                                  // T = number
head(["a", "b"]);                                 // T = string

// 🔸 Inference from RETURN position via annotation
const fromReturn: number = identity(0);           // T = number

// 🔸 Inference from context (contextual typing)
const cb: (x: number) => string = (x) => String(x);

// 🔸 Inference fails → widen to `unknown`/`{}`/union
function merge<A extends object, B extends object>(a: A, b: B): A & B {
  return { ...a, ...b };
}
merge({ a: 1 }, { b: 2 });                        // inferred { a: number } & { b: number }

// 🔸 Inference with unions
function toArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}
toArray(1);                                       // number[]
toArray([1, 2]);                                  // number[]

/* ============================================================
 *  8️⃣ EXPLICIT TYPE ARGUMENTS
 * ============================================================ */

identity<number>(42);                             // force T = number
identity<string>("hi");                           // force T = string

// 🔸 Partially explicit (rest inferred)
function pair3<A, B>(a: A, b: B): [A, B] { return [a, b]; }
pair3<string, number>("a", 1);                    // ✅ both explicit
// pair3<string>("a", 1);                         // ❌ must be all-or-nothing

// 🔸 Explicit type args with classes
new Stack<number>();

// 🔸 Instantiation expression (TS 4.7+)
const identityNum = identity<number>;
identityNum(42);                                  // number

/* ============================================================
 *  9️⃣ CONST TYPE PARAMETERS (TS 5.0+)
 * ============================================================ */

// `const` type params preserve literal types WITHOUT `as const`.

function tuple<const T extends readonly unknown[]>(...args: T): T {
  return args;
}
const t = tuple("a", "b", "c");                   // readonly ["a", "b", "c"]

// Without `const`:
function looseTuple<T extends readonly unknown[]>(...args: T): T {
  return args;
}
const lt = looseTuple("a", "b", "c");             // string[]

// 🔸 Use `const` when you want the CALLER to get literal inference.

/* ============================================================
 *  🔟 GENERIC ARROW FUNCTIONS
 * ============================================================ */

// ✅ In .ts files — angle brackets fine
const id1 = <T>(x: T): T => x;

// ❌ In .tsx files — angle brackets conflict with JSX
// const id2 = <T>(x: T): T => x;   // parse error

// ✅ In .tsx — add a trailing comma or use `extends unknown`
const id3 = <T,>(x: T): T => x;
const id4 = <T extends unknown>(x: T): T => x;

// ✅ Works in both — inferred generic on a callable expression
const id5: <T>(x: T) => T = (x) => x;

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Type parameters are NOT values — you cannot log/compare them at runtime.
// ⚠️ Generics are ERASED at compile time — no runtime overhead.
// ⚠️ Inference widens literal types unless `const T` is used.
// ⚠️ In .tsx files, `<T>` alone is ambiguous — add `,` or `extends unknown`.
// ⚠️ Instantiation expressions (TS 4.7) let you partially apply generics.
// ⚠️ Defaults only apply when inference can't determine the type.
// ⚠️ Multiple type params that all extend `object` slow error messages.
// ⚠️ Overusing generics hurts readability — use when types actually vary.

// 🕒 Version notes
// - Generics: TS 1.0
// - Default type params: TS 2.3
// - Instantiation expressions: TS 4.7
// - Const type parameters: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Feature                  | Syntax                                |
 * ─────────────────────────────────────────────────────────────
 * | Generic function         | function f<T>(x: T): T { }            |
 * | Multiple type params     | function f<A, B>(a: A, b: B): [A,B]   |
 * | Default type param       | function f<T = string>() {}           |
 * | Generic type alias       | type Box<T> = { value: T }            |
 * | Generic class            | class Stack<T> {}                     |
 * | Generic method           | map<U>(fn: (v:T)=>U): Wrapper<U>      |
 * | Generic arrow (.ts)      | const f = <T>(x: T) => x              |
 * | Generic arrow (.tsx)     | const f = <T,>(x: T) => x             |
 * | Const type param         | function f<const T>(...) {}           |
 * | Instantiation expr       | const g = identity<number>            |
 * | Explicit type args       | f<number>(42)                         |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use generics when a function/class genuinely works over many types.
 *  - Let inference do the work — annotate only when needed.
 *  - Prefer `const T` when literal precision matters.
 *  - Keep type params to 2–3 max for readability.
 *  - Use descriptive names (T, TItem, TKey) — not just T1, T2.
 *  - Avoid generics when a union or overload is clearer.
 *  - Remember: generics vanish at runtime — no cost.
 * ============================================================ */