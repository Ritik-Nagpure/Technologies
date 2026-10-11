// 06_Generics/03_Generic_Constraints.ts

/* ============================================================
 *  📘 GENERIC CONSTRAINTS
 *
 *  Sections:
 *   1. Why constraints?
 *   2. `extends` constraint
 *   3. Multiple constraints (via intersection)
 *   4. `keyof` + constraints
 *   5. `keyof typeof` + constraints
 *   6. Constraint with indexed access
 *   7. Conditional constraint patterns
 *   8. `const` type params (TS 5.0)
 *   9. `NoInfer<T>` (TS 5.4)
 *  10. Common real-world constraint shapes
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ WHY CONSTRAINTS?
 * ============================================================ */

// Without constraints, T is `unknown` — you can't do much with it.
// Constraints narrow T to a known shape without losing flexibility.

function lenBad<T>(x: T): number {
  // return x.length;   // ❌ Property 'length' does not exist on type 'T'
  return 0;
}

function lenGood<T extends { length: number }>(x: T): number {
  return x.length;      // ✅ now T has `.length`
}

/* ============================================================
 *  2️⃣ `extends` CONSTRAINT
 * ============================================================ */

// The classic `T extends X` constraint.

function getLength<T extends { length: number }>(x: T): number {
  return x.length;
}
getLength("hello");       // T = string
getLength([1, 2, 3]);     // T = number[]
// getLength(42);         // ❌ number has no length

// 🔸 Constraint to primitive
function wrap<T extends string | number>(x: T): { value: T } {
  return { value: x };
}

// 🔸 Constraint to object
function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

// 🔸 Constraint to class (instance)
class Animal { speak() {} }
function describe<T extends Animal>(a: T): string {
  a.speak();
  return a.constructor.name;
}

// 🔸 Constraint to constructor
function create<T extends new () => any>(Ctor: T): InstanceType<T> {
  return new Ctor();
}

/* ============================================================
 *  3️⃣ MULTIPLE CONSTRAINTS (via INTERSECTION)
 * ============================================================ */

function process<T extends HasId & HasName>(x: T) {
  return `${x.id}: ${x.name}`;
}

interface HasId { id: string }
interface HasName { name: string }

// 🔸 Constraint with a union
function describe2<T extends string | number>(v: T): string {
  return typeof v === "string" ? v : v.toFixed(2);
}

// 🔸 Constraint with `object`
function merge<A extends object, B extends object>(a: A, b: B): A & B {
  return { ...a, ...b };
}

/* ============================================================
 *  4️⃣ `keyof` + CONSTRAINTS
 * ============================================================ */

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ravi" };
get(user, "id");           // number
get(user, "name");         // string
// get(user, "email");     // ❌ "email" is not assignable to keyof typeof user

// 🔸 Constraint to a specific key set
type Status = { state: "on" | "off"; since: number };

function setState<K extends keyof Status>(key: K, value: Status[K]) {
  // ...
}
setState("state", "on");     // ✅
setState("since", 123);      // ✅
// setState("state", "yes"); // ❌

/* ============================================================
 *  5️⃣ `keyof typeof` + CONSTRAINTS
 * ============================================================ */

// Constrain keys to a value's keys.

const config = { host: "localhost", port: 8080 };

function getConfig<K extends keyof typeof config>(key: K) {
  return config[key];
}
getConfig("host");         // string
getConfig("port");         // number

/* ============================================================
 *  6️⃣ CONSTRAINT WITH INDEXED ACCESS
 * ============================================================ */

// Combine constraint + indexed access for type-safe updaters.

function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

// 🔸 Extract the value type of a given key
type ValueOf<T, K extends keyof T> = T[K];

// 🔸 Constrain to string-valued keys only
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

function getStr<T, K extends StringKeys<T>>(obj: T, key: K): T[K] {
  return obj[key];
}

/* ============================================================
 *  7️⃣ CONDITIONAL CONSTRAINT PATTERNS
 * ============================================================ */

// Conditional types often need a constraint to distribute correctly.

type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T];

type OnlyNumberKeys = KeysOfType<{ a: 1; b: "x"; c: 2 }, number>;  // "a" | "c"

// 🔸 Constraint referencing another type param
function assign<T extends U, U>(target: T, source: U): T {
  return Object.assign(target, source);
}

// 🔸 "At least one of" constraint via union
type AtLeastOne<T> = {
  [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>
}[keyof T];

/* ============================================================
 *  8️⃣ `const` TYPE PARAMS (TS 5.0+)
 * ============================================================ */

// `const T` — narrows the inferred type as if `as const` were applied.

function tuple<const T extends readonly unknown[]>(...args: T): T {
  return args;
}
const t = tuple("a", "b", "c");   // readonly ["a", "b", "c"]

// 🔸 Without const → widened
function loose<T extends readonly unknown[]>(...args: T): T { return args; }
const lt = loose("a", "b", "c");  // string[]

// 🔸 Combine with constraints: `<const T extends object>`
function literalKeys<const T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
const ks = literalKeys({ a: 1, b: 2 });   // ("a" | "b")[]

/* ============================================================
 *  9️⃣ `NoInfer<T>` (TS 5.4+)
 * ============================================================ */

// Blocks inference at a given position — T is inferred from OTHER args only.

function pickOne<T>(arr: T[], fallback: NoInfer<T>): T {
  return arr[0] ?? fallback;
}

pickOne([1, 2, 3], 99);           // T = number (not number | 99)
// pickOne([1, 2, 3], "x");       // ❌ "x" not assignable to number

// 🔸 Common case: narrowing inference to a "primary" argument.

/* ============================================================
 *  1️⃣0️⃣ COMMON REAL-WORLD CONSTRAINT SHAPES
 * ============================================================ */

// 🔸 Entity with an ID
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(i => i.id === id);
}

// 🔸 Any object with a constructor
function instantiate<T extends new (...args: any[]) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new Ctor(...args);
}

// 🔸 Literal unions
function fromUnion<T extends string>(value: T, allowed: readonly T[]): T {
  if (!allowed.includes(value)) throw new Error("not allowed");
  return value;
}

// 🔸 Generic constraint to keyof another param
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(i => i[key]);
}

// 🔸 Recursive constraint with mapped type
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function patch<T extends object>(target: T, patch: DeepPartial<T>): T {
  return { ...target, ...patch };
}

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Constraint does NOT restrict what the caller can pass — it restricts
//    what the BODY can assume. Caller can pass any subtype.
// ⚠️ `T extends any` does NOT distribute — it's the identity constraint.
// ⚠️ `T extends unknown` also identity; use for TSX arrow compat.
// ⚠️ Constraining to `{}` allows anything non-null/undefined (including
//    0, "", false) — often NOT what you want. Use `object` for objects.
// ⚠️ `keyof T` where T is a primitive returns lots of irrelevant keys.
// ⚠️ Multiple constraints via `&` can silently become `never` on conflict.
// ⚠️ Conditional constraints inside mapped types distribute — beware.
// ⚠️ `NoInfer<T>` is TS 5.4+ — older code may use a `[T][T extends any ? 0 : never]` hack.
// ⚠️ `const T` requires the argument to be a literal or a fresh expression.

// 🕒 Version notes
// - `extends` constraints: TS 1.0
// - `keyof` + constraints: TS 2.1
// - Conditional constraints: TS 2.8
// - Const type params: TS 5.0
// - `NoInfer<T>`: TS 5.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Constraint              | Use case                              |
 * ─────────────────────────────────────────────────────────────
 * | T extends X             | Require T to have shape X             |
 * | T extends A & B         | Require multiple shapes               |
 * | T extends string \| number | Require primitive subset         |
 * | K extends keyof T       | Safe key accessors                    |
 * | K extends keyof typeof X| Constrain to a value's keys           |
 * | T extends new () => U   | Constrain to a constructor            |
 * | T[K]                    | Indexed access with K extends keyof T |
 * | const T                 | Preserve literal inference            |
 * | NoInfer<T>              | Block inference at a position         |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Constrain generics to the MINIMUM you need.
 *  - Use `keyof` + `T[K]` for type-safe accessors.
 *  - Use `const T` when the caller expects literal precision.
 *  - Use `NoInfer<T>` to prevent inference leaking across args.
 *  - Prefer `object` over `{}` when you mean "an object".
 *  - Prefer built-in utilities (Pick, Omit, Record) over hand-rolled
 *    generic constraints.
 *  - Keep conditional constraints shallow — deep inference is slow.
 * ============================================================ */