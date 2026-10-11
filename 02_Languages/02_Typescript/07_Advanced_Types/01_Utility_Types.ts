// utility-types-complete.ts

/* ============================================================
 *  📘 UTILITY TYPES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Utility types are BUILT-IN generic types that transform other
 *  types. They ship with TypeScript's lib and are available
 *  globally — no import needed.
 *
 *  Sections:
 *   1.  Partial<T>
 *   2.  Required<T>
 *   3.  Readonly<T>
 *   4.  Pick<T, K>
 *   5.  Omit<T, K>
 *   6.  Record<K, T>
 *   7.  Exclude<T, U>
 *   8.  Extract<T, U>
 *   9.  NonNullable<T>
 *  10.  ReturnType<T>
 *  11.  Parameters<T>
 *  12.  ConstructorParameters<T>
 *  13.  InstanceType<T>
 *  14.  ThisParameterType<T>
 *  15.  OmitThisParameter<T>
 *  16.  Awaited<T>
 *  17.  Other built-ins (Uppercase, Lowercase, Capitalize,
 *       Uncapitalize, NoInfer, ThisType)
 *  18.  Implementations from scratch (how they're built)
 *  19.  Combining utilities — real-world patterns
 *  20.  Edge cases, pitfalls, version notes
 * ============================================================ */

// 📌 Reference type used throughout
type User = { name: string; age: number };

/* ============================================================
 *  1️⃣ PARTIAL<T>
 *  Makes all properties optional.
 *  Use: step-by-step object building, partial updates.
 * ============================================================ */

function createUser(data: Partial<User>) {
  console.log("Partial:", data);
}
createUser({ name: "Alice" });          // ✅ age optional
createUser({});                          // ✅ both optional
createUser({ name: "Alice", age: 30 }); // ✅

// 🔸 Deep partial (not built-in — must be written)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/* ============================================================
 *  2️⃣ REQUIRED<T>
 *  Makes all properties required.
 *  Use: enforce complete data before persistence.
 * ============================================================ */

type OptionalUser = { name?: string; age?: number };
const fullUser: Required<OptionalUser> = { name: "Bob", age: 30 };

// 🔸 Removes optionality AND undefined from the type
//    (so `{ name: undefined }` fails under strictNullChecks).

/* ============================================================
 *  3️⃣ READONLY<T>
 *  Makes all properties readonly (shallow).
 *  Use: immutability, safe data structures.
 * ============================================================ */

const readonlyUser: Readonly<User> = { name: "Carol", age: 25 };
// readonlyUser.age = 26;   // ❌ read-only

// 🔸 Deep readonly (must be written)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// ⚠️ Readonly is SHALLOW — nested objects remain mutable.

/* ============================================================
 *  4️⃣ PICK<T, K>
 *  Keep only the specified keys.
 *  Use: extract needed fields, create DTOs.
 * ============================================================ */

type NameOnly = Pick<User, "name">;
const nameObj: NameOnly = { name: "Dave" };

// 🔸 Pick multiple
type UserPreview = Pick<User, "name" | "age">;

// 🔸 Constraint: K extends keyof T
// type Bad = Pick<User, "email">;  // ❌ "email" not in User

/* ============================================================
 *  5️⃣ OMIT<T, K>
 *  Remove the specified keys.
 *  Use: exclude sensitive or irrelevant fields.
 * ============================================================ */

type WithoutAge = Omit<User, "age">;
const noAge: WithoutAge = { name: "Eve" };

// 🔸 Omit multiple
type PublicUser = Omit<User, "age">;

// ⚠️ Omit does NOT error on unknown keys (unlike Pick).

/* ============================================================
 *  6️⃣ RECORD<K, T>
 *  Build an object type with keys from K and values of type T.
 *  Use: map roles, statuses, enums.
 * ============================================================ */

type Role = "admin" | "guest";
const roleMap: Record<Role, string> = {
  admin: "Alice",
  guest: "Bob",
};
// Missing key → ❌; Extra key → ❌ (freshness)

// 🔸 Record with string keys
type StringMap = Record<string, number>;
const scores: StringMap = { math: 90, sci: 85 };

// 🔸 Record<K, T> with K = union of literal strings
type Status2 = "draft" | "published";
const labels: Record<Status2, { title: string }> = {
  draft: { title: "Draft" },
  published: { title: "Published" },
};

// 🔸 Numeric-key record
type ById = Record<number, User>;

/* ============================================================
 *  7️⃣ EXCLUDE<T, U>
 *  Remove from union T every member assignable to U.
 *  Use: filter union variants.
 * ============================================================ */

type Status = "draft" | "published" | "archived";
type VisibleStatus = Exclude<Status, "archived">;   // "draft" | "published"

const status: VisibleStatus = "published";

// 🔸 Exclude works on any union, not just literals
type T1 = Exclude<string | number | boolean, boolean>;   // string | number

// 🔸 Distributes over unions
type T2 = Exclude<"a" | "b" | "c", "a" | "c">;            // "b"

/* ============================================================
 *  8️⃣ EXTRACT<T, U>
 *  Keep from union T only members assignable to U.
 *  Use: narrow to specific variants.
 * ============================================================ */

type PublicStatus = Extract<Status, "published" | "archived">;
const pubStatus: PublicStatus = "archived";

// 🔸 Extract to a common base
type Extract2 = Extract<string | number | (() => void), Function>; // () => void

// 🔸 Common: extract non-function keys
type DataKeys<T> = Extract<keyof T, string>;

/* ============================================================
 *  9️⃣ NONNULLABLE<T>
 *  Remove null and undefined.
 *  Use: enforce definite values.
 * ============================================================ */

type Maybe = string | null | undefined;
type Definitely = NonNullable<Maybe>;   // string

const safe: Definitely = "Hello";

// 🔸 Commonly combined with optional properties
type DefiniteUser = { [K in keyof User]-?: NonNullable<User[K]> };

/* ============================================================
 *  1️⃣0️⃣ RETURNTYPE<T>
 *  Get the return type of a function.
 *  Use: reuse function output types without duplication.
 * ============================================================ */

function greet(): string { return "Hi!"; }
type GreetReturn = ReturnType<typeof greet>;   // string

// 🔸 Works with async functions (returns Promise<...>)
async function fetchName(): Promise<string> { return "x"; }
type FetchRet = ReturnType<typeof fetchName>;  // Promise<string>

// 🔸 Works with generic functions — instantiate first
function id<T>(x: T): T { return x; }
type IdStr = ReturnType<typeof id<string>>;    // string

// ⚠️ Requires `typeof` when passing a FUNCTION, not its return value.

/* ============================================================
 *  1️⃣1️⃣ PARAMETERS<T>
 *  Get parameter types as a tuple.
 *  Use: forward/validate arguments.
 * ============================================================ */

function sum(a: number, b: number): number { return a + b; }
type SumParams = Parameters<typeof sum>;   // [number, number]

const args: SumParams = [5, 7];
console.log("Parameters:", args, "→ Sum:", sum(...args));

// 🔸 Rest params preserved
function log(...msgs: string[]): void {}
type LogParams = Parameters<typeof log>;   // string[]

// 🔸 Tuple with optional elements preserved
function f(a: string, b?: number) {}
type FParams = Parameters<typeof f>;       // [a: string, b?: number]

/* ============================================================
 *  1️⃣2️⃣ CONSTRUCTORPARAMETERS<T>
 *  Get constructor argument types.
 *  Use: instantiate classes dynamically.
 * ============================================================ */

class Person {
  constructor(public name: string, public age: number) {}
}
type PersonArgs = ConstructorParameters<typeof Person>;   // [string, number]

const personArgs: PersonArgs = ["Zoe", 22];
const person = new Person(...personArgs);

// 🔸 Abstract constructors work too (TS 4.2+)
abstract class Shape { constructor(public sides: number) {} }
type ShapeArgs = ConstructorParameters<typeof Shape>;     // [number]

/* ============================================================
 *  1️⃣3️⃣ INSTANCETYPE<T>
 *  Get the instance type from a constructor.
 *  Use: type-safe object creation, factory helpers.
 * ============================================================ */

type PersonInstance = InstanceType<typeof Person>;
const anotherPerson: PersonInstance = new Person("Max", 40);

// 🔸 Generic factory using InstanceType
function create<T extends new (...args: any) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new Ctor(...args);
}
const someone = create(Person, "Neha", 28);   // Person

/* ============================================================
 *  1️⃣4️⃣ THISPARAMETERTYPE<T>
 *  Get the type of `this` in a function.
 *  Use: context-aware function bindings.
 * ============================================================ */

function say(this: Person, msg: string) {
  console.log(`${this.name} says: ${msg}`);
}
type ThisTypeOfSay = ThisParameterType<typeof say>;   // Person

const boundSay = say.bind(person);
boundSay("Hello!");

/* ============================================================
 *  1️⃣5️⃣ OMITTHISPARAMETER<T>
 *  Remove `this` from a function type.
 *  Use: convert methods to standalone functions.
 * ============================================================ */

type SayWithoutThis = OmitThisParameter<typeof say>;   // (msg: string) => void
const speak: SayWithoutThis = (msg) => console.log("Someone says:", msg);
speak("Hi there!");

/* ============================================================
 *  1️⃣6️⃣ AWAITED<T>
 *  Recursively unwrap Promise types.
 *  Use: async type inference.
 * ============================================================ */

async function getName(): Promise<string> { return "AsyncName"; }
type ResolvedName = Awaited<ReturnType<typeof getName>>;   // string

getName().then((name: ResolvedName) => console.log("Awaited:", name));

// 🔸 Unwraps nested promises
type Nested = Awaited<Promise<Promise<number>>>;   // number

// 🔸 Works with thenables too

/* ============================================================
 *  1️⃣7️⃣ OTHER BUILT-IN UTILITIES
 * ============================================================ */

// 🔸 String manipulation utilities (TS 4.1+)
type Upper = Uppercase<"hello">;          // "HELLO"
type Lower = Lowercase<"HELLO">;          // "hello"
type Cap = Capitalize<"hello">;           // "Hello"
type Uncap = Uncapitalize<"Hello">;       // "hello"

// 🔸 NoInfer<T> (TS 5.4+) — blocks inference at a position
function pickOne<T>(arr: T[], def: NoInfer<T>): T { return arr[0] ?? def; }

// 🔸 ThisType<T> — marker for contextual `this` in object literals
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

/* ============================================================
 *  1️⃣8️⃣ IMPLEMENTATIONS FROM SCRATCH (HOW THEY'RE BUILT)
 * ============================================================ */

// Partial
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Required (strip `?` with `-?`)
type MyRequired<T> = { [K in keyof T]-?: T[K] };

// Readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Pick
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Omit (Pick + Exclude)
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;

// Record
type MyRecord<K extends keyof any, T> = { [P in K]: T };

// Exclude
type MyExclude<T, U> = T extends U ? never : T;

// Extract
type MyExtract<T, U> = T extends U ? T : never;

// NonNullable
type MyNonNullable<T> = T extends null | undefined ? never : T;

// ReturnType
type MyReturnType<F extends (...args: any) => any> =
  F extends (...args: any) => infer R ? R : never;

// Parameters
type MyParameters<F extends (...args: any) => any> =
  F extends (...args: infer P) => any ? P : never;

// Awaited
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;

/* ============================================================
 *  1️⃣9️⃣ COMBINING UTILITIES — REAL-WORLD PATTERNS
 * ============================================================ */

// 🔸 DTO from entity — omit server-only fields + readonly
type UserDTO = Readonly<Omit<User, "age">> & { age: number | null };

// 🔸 Patch/update type — all fields optional except id
type UserPatch = Partial<Omit<User, "name">> & { name: string };

// 🔸 Form state — required fields + optional metadata
type FormState = Required<Pick<User, "name">> & Partial<Pick<User, "age">>;

// 🔸 Record of typed API responses
type ApiEndpoints = "/users" | "/posts";
type ApiResponse = Record<ApiEndpoints, { status: number; body: unknown }>;

// 🔸 Mapped helper — turn nullable fields into non-null
type StripNull<T> = { [K in keyof T]: NonNullable<T[K]> };

// 🔸 Extract only method names from a class type
type Methods<T> = Extract<keyof T, string>;

// 🔸 Async handler factory
type Handler<F extends (...args: any) => any> =
  (...args: Parameters<F>) => Promise<ReturnType<F>>;

/* ============================================================
 *  2️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Readonly is SHALLOW — use DeepReadonly for nested immutability.
// ⚠️ Partial is SHALLOW — use DeepPartial for recursive objects.
// ⚠️ Omit does NOT error on unknown keys:
//      Omit<User, "notAKey"> → still allowed (silently ignored)
//    Whereas Pick<User, "notAKey"> → ❌ error.
// ⚠️ Record with `number` keys → TS accepts any number, not just literals.
// ⚠️ Exclude/Extract with primitives work by assignability, not identity:
//      Exclude<string | number, number> → string
// ⚠️ ReturnType/Parameters require `typeof fn` — forgetting `typeof` passes
//    the RETURN VALUE type, causing confusing errors.
// ⚠️ ReturnType on overloaded functions picks the LAST overload signature.
// ⚠️ Awaited is recursive — deeply nested promises fully unwrap.
// ⚠️ NonNullable is distributive over unions (it removes per-member).
// ⚠️ Required removes undefined from optional fields — behavior changes under
//    strictNullChecks ON vs OFF.
// ⚠️ Uppercase/Lowercase work on string literal types, not runtime values.

// 🕒 Version notes
// - Partial / Required / Readonly / Pick / Omit / Record / Exclude / Extract
//   / NonNullable: TS 2.1
// - ReturnType / InstanceType / Parameters / ConstructorParameters
//   / ThisParameterType / OmitThisParameter: TS 2.8
// - Uppercase / Lowercase / Capitalize / Uncapitalize: TS 4.1
// - Awaited: TS 4.5
// - NoInfer: TS 5.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Utility                 | What it does                        |
 * ─────────────────────────────────────────────────────────────
 * | Partial<T>              | All props optional                  |
 * | Required<T>             | All props required                  |
 * | Readonly<T>             | All props readonly (shallow)        |
 * | Pick<T, K>              | Keep only keys K                    |
 * | Omit<T, K>              | Remove keys K                       |
 * | Record<K, T>            | Map K → T                           |
 * | Exclude<T, U>           | Remove U from union T               |
 * | Extract<T, U>           | Keep U from union T                 |
 * | NonNullable<T>          | Remove null & undefined             |
 * | ReturnType<F>           | Return type of F                    |
 * | Parameters<F>           | Parameter tuple of F                |
 * | ConstructorParameters<C>| Constructor arg tuple               |
 * | InstanceType<C>         | Instance type of C                  |
 * | ThisParameterType<F>    | Type of `this` in F                 |
 * | OmitThisParameter<F>    | Remove `this` from F                |
 * | Awaited<T>              | Unwrap Promise types                |
 * | Uppercase<S>            | S → S.toUpperCase() literal         |
 * | Lowercase<S>            | S → S.toLowerCase() literal         |
 * | Capitalize<S>           | First letter uppercase              |
 * | Uncapitalize<S>         | First letter lowercase              |
 * | NoInfer<T>              | Block inference at a position       |
 * | ThisType<T>             | Contextual `this` marker            |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer built-in utilities over hand-rolled mapped types.
 *  - Combine utilities (e.g., Readonly<Omit<...>>) for DTOs and patches.
 *  - Remember Partial and Readonly are SHALLOW — write Deep variants if needed.
 *  - Use `Pick` when you want strictness (errors on unknown keys).
 *  - Use `Omit` when you want flexibility (ignores unknown keys).
 *  - Use `Record` for fixed-key maps instead of loose index signatures.
 *  - Use `Awaited<ReturnType<F>>` to get the resolved async value type.
 *  - Reuse `Parameters<F>` and `ReturnType<F>` to avoid duplicated types.
 *  - Use `InstanceType` and `ConstructorParameters` for factory functions.
 * ============================================================ */