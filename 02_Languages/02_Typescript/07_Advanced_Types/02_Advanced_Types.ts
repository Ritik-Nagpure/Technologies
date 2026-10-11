// advanced-types-complete.ts

/* ============================================================
 *  📘 ADVANCED TYPES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sections:
 *   1.  Literal types
 *   2.  Template literal types
 *   3.  Mapped types
 *   4.  Conditional types
 *   5.  Recursive types
 *   6.  Index signatures
 *   7.  `infer` keyword
 *   8.  Nullable types
 *   9.  Type aliases vs interfaces (deep)
 *  10.  Discriminated unions
 *  11.  keyof + indexed access (recap)
 *  12.  Distributive conditional types
 *  13.  Variadic tuple types
 *  14.  Branded / nominal types
 *  15.  Other advanced tools (asserts, satisfies)
 *  16.  Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ LITERAL TYPES
 *  Restrict a value to exact literals instead of general types.
 * ============================================================ */

type Direction = "up" | "down" | "left" | "right";
const move: Direction = "left";
// const bad: Direction = "north"; // ❌

// 🔸 Literals for numbers, booleans
type One = 1;
type Yes = true;

// 🔸 Combination with unions
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// 🔸 Literal inference & widening
let lv = "dark";          // widened to string
const lc = "dark";        // kept as "dark"

/* ============================================================
 *  2️⃣ TEMPLATE LITERAL TYPES
 *  Construct new string types via interpolation.
 * ============================================================ */

type Lang = "en" | "fr" | "de";
type GreetingKey = `greeting_${Lang}`;      // "greeting_en" | "greeting_fr" | "greeting_de"

const greet: GreetingKey = "greeting_fr";

// 🔸 Combine with intrinsic string utilities
type Shout = Uppercase<`hello_${"world"}`>; // "HELLO_WORLD"

// 🔸 Real-world: event handler names
type Event = "click" | "focus" | "blur";
type Handler = `on${Capitalize<Event>}`;    // "onClick" | "onFocus" | "onBlur"

// 🔸 Extract from templated strings using infer
type ExtractLang<S> = S extends `${infer _}_${infer L}` ? L : never;
type L = ExtractLang<"greeting_fr">;        // "fr"

// 🔸 Recursive template patterns
type Join<T extends string[], Sep extends string = ","> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? R extends [] ? F : `${F}${Sep}${Join<R, Sep>}`
    : "";

/* ============================================================
 *  3️⃣ MAPPED TYPES
 *  Transform keys of one type into another.
 * ============================================================ */

type UserKeys = "id" | "email";
type UserMap = { [K in UserKeys]: string };

const user1: UserMap = { id: "abc123", email: "user@example.com" };

// 🔸 Mapped over generic T
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T>  = { [K in keyof T]?: T[K] };

// 🔸 Modifiers: +? / -? / +readonly / -readonly
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };

// 🔸 Key remapping with `as`
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// 🔸 Filtering keys via `as ... never`
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

/* ============================================================
 *  4️⃣ CONDITIONAL TYPES
 *  Types chosen based on a compile-time condition.
 *  Syntax: T extends U ? X : Y
 * ============================================================ */

type IsString<T> = T extends string ? "yes" : "no";
type Test1 = IsString<string>;   // "yes"
type Test2 = IsString<number>;   // "no"

// 🔸 Nested conditional chains
type TypeName<T> =
  T extends string  ? "string"  :
  T extends number  ? "number"  :
  T extends boolean ? "boolean" :
  T extends Function? "function":
  "other";

// 🔸 Conditional types with constraints
type MessageOf<T extends { message: unknown }> = T["message"];

// 🔸 Non-distributive wrapper — wrap both sides in tuples
type IsNever<T> = [T] extends [never] ? true : false;

/* ============================================================
 *  5️⃣ RECURSIVE TYPES
 *  Types that refer to themselves — trees, JSON, linked lists.
 * ============================================================ */

type JSONValue =
  | string | number | boolean | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const data: JSONValue = {
  name: "Alice",
  age: 30,
  tags: ["dev", "typescript"],
  address: { city: "Pune", zip: 411001 },
};

// 🔸 Linked list
type List<T> = { value: T; next: List<T> | null };

// 🔸 Tree
type Tree<T> = { value: T; children: Tree<T>[] };

// 🔸 Recursive mapped type (deep partial / readonly)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/* ============================================================
 *  6️⃣ INDEX SIGNATURES
 *  Allow dynamic keys with a consistent value type.
 * ============================================================ */

type ScoreMap = { [name: string]: number };
const scores: ScoreMap = { Alice: 95, Bob: 88 };

// 🔸 Numeric index signature
type StringArray = { [index: number]: string };

// 🔸 Mixing explicit props with index signature
interface Mixed {
  known: string;
  [key: string]: string;   // all explicit props must be compatible
}

// 🔸 Generic indexed access
type Dict<V> = { [key: string]: V };
type NumberDict = Dict<number>;

// 🔸 Record vs index signature
type A1 = { [k: string]: number };   // index signature
type A2 = Record<string, number>;    // equivalent

// 🔸 Template-literal index signature (TS 4.4+)
type DataAttrs = {
  [K in `data-${string}`]?: string;
};
const el: DataAttrs = { "data-id": "42", "data-role": "btn" };

/* ============================================================
 *  7️⃣ `infer` KEYWORD
 *  Extract types from structural positions inside conditional types.
 * ============================================================ */

type ReturnType2<T> = T extends (...args: any[]) => infer R ? R : never;
type R1 = ReturnType2<() => boolean>;               // boolean

// 🔸 Extract from Promise
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type U1 = Unwrap<Promise<number>>;                  // number

// 🔸 Extract from array
type ElementType<T> = T extends (infer U)[] ? U : never;
type E1 = ElementType<string[]>;                    // string

// 🔸 Extract from tuple positions
type First<T extends any[]> = T extends [infer F, ...any] ? F : never;
type F1 = First<[number, string]>;                  // number

// 🔸 Multiple infer in one condition
type Unzip<T> = T extends [infer A, infer B] ? [B, A] : never;

// 🔸 `infer ... extends` (TS 4.7+)
type FirstString<T> =
  T extends [infer S extends string, ...any] ? S : never;

/* ============================================================
 *  8️⃣ NULLABLE TYPES
 *  Explicitly include null / undefined.
 * ============================================================ */

type Maybe<T> = T | null | undefined;
const maybeName: Maybe<string> = undefined;

// 🔸 With optional chaining & nullish coalescing
type Profile = { name?: string; age?: number };
function greetUser(p: Profile) {
  const n = p.name ?? "anon";
  return `Hi ${n}`;
}

// 🔸 NonNullable to strip them
type Definite = NonNullable<Maybe<string>>;         // string

/* ============================================================
 *  9️⃣ TYPE ALIASES vs INTERFACES (DEEP)
 * ============================================================ */

type Alias = { x: number };

interface ShapeI { x: number }
interface ShapeI { y: number }   // ✅ declaration merging
const pointI: ShapeI = { x: 10, y: 20 };

// ┌──────────────────────────┬───────────┬────────┐
// │ Feature                   │ interface │ type   │
// ├──────────────────────────┼───────────┼────────┤
// │ Object shape              │ ✅        │ ✅     │
// │ Extends / inheritance     │ ✅        │ ✅ (&) │
// │ Declaration merging       │ ✅        │ ❌     │
// │ Union types               │ ❌        │ ✅     │
// │ Intersection types        │ ❌        │ ✅     │
// │ Tuple / primitives alias  │ ❌        │ ✅     │
// │ Conditional / mapped      │ ❌        │ ✅     │
// │ Template literal          │ ❌        │ ✅     │
// │ Implements (class)        │ ✅        │ ✅     │
// │ Better error messages     │ ✅        │ ⚠️     │
// └──────────────────────────┴───────────┴────────┘

/* ============================================================
 *  🔟 DISCRIMINATED UNIONS
 *  Unions where every variant shares a common literal tag.
 * ============================================================ */

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type ShapeUnion = Circle | Square;

function area(shape: ShapeUnion): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
  }
}

// 🔸 Exhaustiveness with never
function assertNever(x: never): never {
  throw new Error(`Unexpected: ${JSON.stringify(x)}`);
}
function areaExhaustive(s: ShapeUnion) {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    default: return assertNever(s);
  }
}

/* ============================================================
 *  1️⃣1️⃣ keyof + INDEXED ACCESS (RECAP)
 * ============================================================ */

type User = { id: number; name: string };
type Keys = keyof User;              // "id" | "name"
type Values = User[keyof User];      // number | string
function get<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }

/* ============================================================
 *  1️⃣2️⃣ DISTRIBUTIVE CONDITIONAL TYPES
 * ============================================================ */

// Conditionals distribute over naked type parameters:
type ToArray<T> = T extends any ? T[] : never;
type Result2 = ToArray<string | number>;    // string[] | number[]

// 🔸 To PREVENT distribution, wrap in a tuple:
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Result3 = ToArrayNonDist<string | number>;  // (string | number)[]

// 🔸 `never` is the identity of unions
type DropNever = string | never;   // string

/* ============================================================
 *  1️⃣3️⃣ VARIADIC TUPLE TYPES
 * ============================================================ */

type Concat<A extends any[], B extends any[]> = [...A, ...B];
type AB = Concat<[1, 2], [3, 4]>;    // [1, 2, 3, 4]

// 🔸 Spreading in function params
function call<A extends any[], R>(f: (...a: A) => R, ...a: A): R { return f(...a); }

// 🔸 Partial application typing
type Curry<P extends any[], R> =
  P extends [infer F, ...infer Rest]
    ? (a: F) => Curry<Rest, R>
    : R;

/* ============================================================
 *  1️⃣4️⃣ BRANDED / NOMINAL TYPES
 * ============================================================ */

// TS is structural by default — brands make it nominal.
type UserID = string & { readonly __brand: "UserID" };
type OrderID = string & { readonly __brand: "OrderID" };

function toUserID(s: string): UserID { return s as UserID; }
function toOrderID(s: string): OrderID { return s as OrderID; }

// Now UserID and OrderID are NOT interchangeable.

/* ============================================================
 *  1️⃣5️⃣ OTHER ADVANCED TOOLS
 * ============================================================ */

// 🔸 `asserts x is T` — assertion functions
function assertIsString(v: unknown): asserts v is string {
  if (typeof v !== "string") throw new Error("not a string");
}

// 🔸 `satisfies` (TS 4.9+) — validate without widening
const palette = {
  red:   [255, 0, 0],
  green: [0, 255, 0],
} satisfies Record<string, [number, number, number]>;

// 🔸 `const` type parameters (TS 5.0+)
function tuple<const T extends readonly unknown[]>(...a: T): T { return a; }

/* ============================================================
 *  1️⃣6️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Literals WIDEN under `let` and mutable object properties.
// ⚠️ Template literal types can explode for large unions — mind compile time.
// ⚠️ Mapped types with `as` remapping must produce string/number/symbol keys.
// ⚠️ Conditional types distribute over naked `T` — wrap to prevent.
// ⚠️ Recursive types can hit depth limits; keep them reasonable.
// ⚠️ Index signatures make ALL matching keys valid — no typo detection.
// ⚠️ `infer` can appear multiple times, but each must be in a distinct position.
// ⚠️ Nullable types + strictNullChecks — behavior differs a lot when off.
// ⚠️ Interface declaration merging is a footgun for accidental merges.
// ⚠️ Discriminated unions require a UNIQUE literal tag per variant.
// ⚠️ Never mixes tuple + array syntax incorrectly: `[number, ...string[]]` OK,
//      `[...string[], number]` NOT allowed.
// ⚠️ Branded types require a cast — they don't validate at runtime by themselves.
// ⚠️ Variadic tuples require TS 4.0+.
// ⚠️ Template literal utility types (Uppercase etc.) are compiler intrinsics.

// 🕒 Version notes
// - Literal types, mapped, conditional, keyof: TS 2.1
// - `infer`: TS 2.8
// - Template literal types: TS 4.1
// - Variadic tuple types: TS 4.0
// - `infer ... extends`: TS 4.7
// - `satisfies`: TS 4.9
// - Const type params: TS 5.0
// - `NoInfer`: TS 5.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept              | Syntax / Keyword                    |
 * ─────────────────────────────────────────────────────────────
 * | Literal              | "up" \| "down" \| ...               |
 * | Template literal     | `greeting_${Lang}`                  |
 * | Mapped               | { [K in keyof T]: ... }             |
 * | Key remap            | { [K in keyof T as ...]: T[K] }     |
 * | Conditional          | T extends U ? X : Y                 |
 * | Recursive            | type J = ... \| J[] \| { [k]: J }   |
 * | Index signature      | { [k: string]: V }                  |
 * | infer                | T extends (infer U)[] ? U : never   |
 * | Nullable             | T \| null \| undefined              |
 * | Interface vs Type    | merge vs flexible composition       |
 * | Discriminated union  | { kind: "a"; ... } \| { kind: "b" } |
 * | Distributive cond    | naked T distributes over unions     |
 * | Variadic tuple       | [...A, ...B]                        |
 * | Branded              | string & { __brand: "ID" }          |
 * | asserts              | asserts x is T                      |
 * | satisfies            | x satisfies T                       |
 * | const type param     | <const T>                           |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use literal unions over enums for small closed sets.
 *  - Use template literal types for naming conventions & event maps.
 *  - Use mapped + conditional + infer for reusable utilities.
 *  - Wrap conditional types in tuples to prevent unwanted distribution.
 *  - Prefer recursive types for tree/JSON shapes with `DeepPartial` etc.
 *  - Prefer branded types over runtime checks when invariants are guaranteed.
 *  - Use `satisfies` when validating without widening.
 *  - Use `const T` in utilities that should preserve literals.
 *  - Keep recursive + template types shallow to avoid slowing the compiler.
 * ============================================================ */