// unions-intersections-aliases-keyof-complete.ts

/* ============================================================
 *  📘 UNION, INTERSECTION, TYPE ALIAS & keyof — COMPLETE COVERAGE
 *
 *  Sections:
 *   1. Type Alias (deep dive)
 *   2. Union Types (deep dive)
 *   3. Intersection Types (deep dive)
 *   4. keyof Operator (deep dive)
 *   5. Combining all four — real-world patterns
 *   6. Utility types built on these
 *   7. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ TYPE ALIAS — DEEP DIVE
 * ============================================================ */

// A type alias gives a NAME to any type — object, union, primitive, tuple, function.

// 🔸 Alias for a primitive / union
type UserID = string | number;

// 🔸 Alias for an object shape
type User = {
  id: UserID;
  cid?: string | number;
  name: string;
  email?: string;    // optional
};

const user1: User = { id: 101, name: "Alice" };

// 🔸 Alias for a function type
type Predicate<T> = (value: T) => boolean;

// 🔸 Alias for a tuple
type Pair<A, B> = [A, B];

// 🔸 Alias for a union of literals
type Direction = "north" | "south" | "east" | "west";

// 🔸 Alias for a mapped/conditional type (advanced)
type ReadonlyDeep<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = T | null;

// 🔸 Alias for another alias (chaining)
type ID = UserID;
type UserRef = { id: ID };

// 🧠 Key points:
//  - Aliases do NOT create a new type — they're a NAME for an existing one.
//  - Cannot be declaration-merged (unlike interfaces).
//  - Can alias anything (unions, tuples, primitives) — interfaces cannot.
//  - Prefer `interface` for public API object shapes; `type` for composition.

/* ============================================================
 *  2️⃣ UNION TYPES — DEEP DIVE
 * ============================================================ */

// Union = "one of these types". Value must match AT LEAST ONE.
// Written with `|`.

// 🔸 Literal union (string)
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  if (status === "loading") console.log("⏳ Loading...");
  else if (status === "success") console.log("✅ Success!");
  else console.log("❌ Error!");
}

// 🔸 Primitive union
let value: string | number;
value = "hello";
value = 42;
// value = true;  // ❌ not in union

// 🔸 Object union — must satisfy ONE of the shapes
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  // Discriminant `kind` narrows the union
  if (s.kind === "circle") return Math.PI * s.radius ** 2;
  return s.side ** 2;
}

// 🔸 Union of unions (flattened)
type AB = "a" | "b";
type ABC = AB | "c";    // "a" | "b" | "c"

// 🔸 Nullable unions
type MaybeString = string | null | undefined;

// 🔸 Accessing union members — only COMMON properties are safe
type Cat = { meow(): void; name: string };
type Dog = { bark(): void; name: string };
function speak(p: Cat | Dog) {
  p.name;        // ✅ common
  // p.meow();   // ❌ not on Dog
}

// 🔸 Narrowing a union
function format(v: string | number): string {
  if (typeof v === "string") return v.toUpperCase();  // narrowed
  return v.toFixed(2);                                 // narrowed to number
}

// 🔸 Exhaustiveness with `never`
function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}

// 🔸 Union with `never` collapses
type DropNever = string | never;   // string

// 🧠 Best practices:
//  - Prefer literal unions over enums for small closed sets.
//  - Use a discriminant field (`kind`, `type`) for tagged unions.
//  - Always handle narrowing — never cast blindly.

/* ============================================================
 *  3️⃣ INTERSECTION TYPES — DEEP DIVE
 * ============================================================ */

// Intersection = "ALL of these types at once". Written with `&`.

type Person = { name: string };
type Employee = { employeeId: number };
type Staff = Person & Employee;         // must have BOTH

const staffMember: Staff = {
  name: "Bob",
  employeeId: 1234,
};

// 🔸 Multiple intersections
type Named = { name: string };
type Aged = { age: number };
type Contactable = { email: string };
type FullUser = Named & Aged & Contactable;

// 🔸 Intersection with methods
type Serializable = { toJSON(): string };
type Loggable = { log(): void };
type Entity = Serializable & Loggable;

// 🔸 Intersection of function types — OVERLOADS collapse
type F1 = (x: string) => void;
type F2 = (x: number) => void;
type Both = F1 & F2;   // callable with either signature

const fn: Both = ((x: string | number) => {}) as Both;
fn("a");  // ✅
fn(1);    // ✅

// 🔸 Intersection with union — distributes over union
type A = { a: 1 } | { a: 2 };
type B = { b: 3 };
type AB2 = A & B;    // ({ a: 1 } & { b: 3 }) | ({ a: 2 } & { b: 3 })

// ⚠️ Conflicting primitives collapse to `never`
type Impossible = string & number;   // never
// const x: Impossible = ...;        // ❌ nothing fits

// ⚠️ Conflicting object props also produce `never` for that prop
type Conflict = { a: string } & { a: number };   // a: never
// const y: Conflict = { a: 1 };    // ❌

// 🧠 Best practices:
//  - Use intersections to compose reusable "mixins".
//  - Watch for conflicting property types → silently becomes `never`.
//  - Intersections distribute over unions — useful for building cartesian types.

/* ============================================================
 *  4️⃣ keyof OPERATOR — DEEP DIVE
 * ============================================================ */

// `keyof T` = union of all property NAMES of T (as string literals).

type Product = {
  id: number;
  title: string;
  price: number;
};

type ProductKeys = keyof Product;   // "id" | "title" | "price"

// 🔸 Safe indexed access using keyof
function getProductProperty(product: Product, key: ProductKeys) {
  return product[key];   // type: number | string (union of prop types)
}

const sampleProduct: Product = { id: 1, title: "Laptop", price: 999 };
console.log(getProductProperty(sampleProduct, "title"));   // "Laptop"

// 🔸 Generic indexed access preserves the EXACT type of the property
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const title = getProp(sampleProduct, "title");   // string (not union!)
const id = getProp(sampleProduct, "id");         // number

// 🔸 keyof with index signatures
type Dict = { [key: string]: number };
type DictKeys = keyof Dict;                     // string | number
// (yes — number, because numeric indices are coerced to strings in JS)

// 🔸 keyof with arrays
type ArrKeys = keyof string[];                  // number | "length" | "push" | ...
// → use `number` for element keys, or `keyof T[number]` for value keys

// 🔸 keyof with unions
type A2 = { a: 1; common: true };
type B2 = { b: 2; common: true };
type UnionKeys = keyof (A2 | B2);               // "common" (intersection of keys)
type InterKeys = keyof (A2 & B2);               // "a" | "b" | "common"

// 🔸 keyof typeof — get keys of a VALUE's type
const config = { host: "localhost", port: 8080 };
type ConfigKeys = keyof typeof config;          // "host" | "port"

// 🔸 Numeric keys are also included as string literals
type NumKeys = keyof { 0: string; 1: number };  // 0 | 1 (numeric literals)

// 🔸 Filtering keys with mapped types
type OnlyStrings<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];
// Extracts names of string-typed props.

// 🧠 Best practices:
//  - Use `keyof T` + `T[K]` for type-safe property accessors.
//  - Use `K extends keyof T` to constrain generics.
//  - Combine with mapped types to build utility types (see §6).

/* ============================================================
 *  5️⃣ COMBINING ALL FOUR — REAL-WORLD PATTERNS
 * ============================================================ */

// 🔸 Type-safe object update function
function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}
update(sampleProduct, "title", "MacBook");  // ✅
// update(sampleProduct, "title", 42);      // ❌ number not assignable to string
// update(sampleProduct, "unknown", 1);     // ❌ "unknown" not a key

// 🔸 Type-safe event dispatcher using unions + keyof
type Events = {
  click: { x: number; y: number };
  keypress: { key: string };
};
type EventName = keyof Events;

function emit<K extends EventName>(name: K, payload: Events[K]): void {
  console.log(name, payload);
}
emit("click", { x: 10, y: 20 });
emit("keypress", { key: "Enter" });
// emit("click", { key: "Enter" });   // ❌ wrong payload shape

// 🔸 Discriminated unions + intersection for extensibility
type Base = { id: string; createdAt: Date };
type Draft = Base & { status: "draft" };
type Published = Base & { status: "published"; publishedAt: Date };
type Post = Draft | Published;

function describePost(p: Post): string {
  if (p.status === "draft") return `Draft ${p.id}`;
  return `Published on ${p.publishedAt.toDateString()}`;
}

// 🔸 Picking a subset via keyof + mapped type
type Pick2<T, K extends keyof T> = { [P in K]: T[P] };
type ProductTitle = Pick2<Product, "title">;

/* ============================================================
 *  6️⃣ UTILITY TYPES BUILT ON THESE (QUICK REFERENCE)
 * ============================================================ */

// Partial<T>        → all props optional
// Required<T>       → all props required
// Readonly<T>       → all props readonly
// Pick<T, K>        → subset of props (K extends keyof T)
// Omit<T, K>        → complement of Pick
// Record<K, V>      → { [key in K]: V }
// Exclude<T, U>     → remove from union
// Extract<T, U>     → keep intersection of unions
// NonNullable<T>    → remove null/undefined
// ReturnType<F>     → return type of function F
// Parameters<F>     → tuple of params
// Awaited<T>        → unwrap Promise
// InstanceType<C>   → instance type of class C

type P1 = Partial<Product>;                    // all optional
type P2 = Pick<Product, "id" | "title">;       // just id, title
type P3 = Omit<Product, "price">;              // id, title
type P4 = Record<"a" | "b", number>;           // { a: number; b: number }

/* ============================================================
 *  7️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Type aliases cannot be declaration-merged — use interfaces for that.
// ⚠️ Unions only expose COMMON properties — narrow before accessing specifics.
// ⚠️ Intersections with conflicting props collapse to `never` silently.
// ⚠️ `keyof` on index signatures returns `string | number`, not just string.
// ⚠️ `keyof (A | B)` = intersection of keys; `keyof (A & B)` = union of keys.
// ⚠️ `T[K]` with a union of keys returns a union of value types — use
//    `K extends keyof T` with generics to preserve exact types.
// ⚠️ Empty objects satisfy empty type aliases but fail freshness checks with excess props.
// ⚠️ Intersection of two DIFFERENT primitives is always `never` (with one
//    exception: `any & X === any`).

// 🕒 Version notes
// - Unions & intersections since TS 1.0
// - `keyof` since TS 1.0
// - Type aliases since TS 1.4
// - Mapped types and conditional types from TS 2.1+
// - Const type params (TS 5.0) help in keyof-based utilities

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept        | Symbol | Meaning                              |
 * ─────────────────────────────────────────────────────────────
 * | Type alias     | type   | Name a type (any kind)               |
 * | Union          | \|     | One of many types                    |
 * | Intersection   | &      | All of many types at once            |
 * | keyof          | keyof  | Union of property names of a type    |
 * | Indexed access | T[K]   | Type of property K on T              |
 * | Mapped type    | { [K in keyof T]: ... }  Transform each key |
 * | Conditional    | T extends U ? X : Y    Choose type at compile time |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer `interface` for object shapes and public APIs.
 *  - Prefer `type` for unions, intersections, tuples, and aliases.
 *  - Use literal unions over enums for closed sets.
 *  - Use a discriminant field for tagged unions.
 *  - Use `K extends keyof T` to constrain generic keys.
 *  - Use `T[K]` for type-preserving property access.
 *  - Combine all four with mapped + conditional types for advanced utilities.
 *  - Watch for accidental `never` in intersections of conflicting types.
 *  - Never cast to "fix" a union issue — narrow it instead.
 *
 * 🎯 SUMMARY
 *  - Type Alias:  A name for a type.
 *  - Union:       One of many types.
 *  - Intersection: Combines multiple types.
 *  - keyof:       Union of keys of a type.
 * ============================================================ */