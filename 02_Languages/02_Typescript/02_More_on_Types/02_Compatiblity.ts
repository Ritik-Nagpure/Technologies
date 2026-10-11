// type-compatibility-complete.ts

/* ============================================================
 *  📘 TYPE COMPATIBILITY IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  TypeScript uses STRUCTURAL typing — types are compatible if
 *  their shapes match, regardless of explicit declarations.
 *  (Not nominal like Java/C#.)
 *
 *  Sections:
 *   1. Structural typing — the core rule
 *   2. Assignability basics
 *   3. Excess property checks
 *   4. Function compatibility (params & returns)
 *   5. Variance (covariance, contravariance, bivariance)
 *   6. Optional & excess members
 *   7. Index signatures & compatibility
 *   8. Classes & compatibility (private/protected)
 *   9. Enums & compatibility
 *  10. Generics & compatibility
 *  11. `any`, `unknown`, `never` in compatibility
 *  12. Soundness holes & unsound assignments
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ STRUCTURAL TYPING — THE CORE RULE
 * ============================================================ */

// Two types are compatible if their SHAPES match — names don't matter.
interface Animal { name: string; }
interface Dog { name: string; breed: string; }

let pet: Animal;
let myDog: Dog = { name: "Rex", breed: "Labrador" };

pet = myDog;   // ✅ Dog has ALL props Animal requires (name)

// 🔸 Reverse assignment fails — Animal lacks `breed`
// myDog = pet; // ❌ Property 'breed' is missing in type 'Animal'

// 🔸 Same shape, different names → still compatible
interface Point2D { x: number; y: number }
interface Coord { x: number; y: number }
let p: Point2D = { x: 1, y: 2 };
let c2: Coord = p;   // ✅ shapes match

/* ============================================================
 *  2️⃣ ASSIGNABILITY BASICS
 * ============================================================ */

// A is assignable to B if A has AT LEAST the properties of B
// (with compatible types). Extra properties are fine for variables.

// Variable case — extra props OK
const bigger = { a: 1, b: 2, c: 3 };
const smaller: { a: number; b: number } = bigger;  // ✅

// Object literal case — extra props NOT OK (freshness, see §3)
// const wrong: { a: number } = { a: 1, b: 2 };   // ❌

/* ============================================================
 *  3️⃣ EXCESS PROPERTY CHECKS
 * ============================================================ */

// TS applies stricter checks on FRESH object literals to catch typos.
interface Cfg { theme: string }

const okCfg = { theme: "dark", extra: 1 };
const cfg: Cfg = okCfg;         // ✅ not fresh — no excess check

const badCfg: Cfg = { theme: "dark", extra: 1 };
// ❌ Object literal may only specify known properties.

// 🔸 Bypass tricks (use carefully):
const bypass1: Cfg = { theme: "dark", extra: 1 } as Cfg;      // assertion
const bypass2: Cfg = { ...{ theme: "dark", extra: 1 } };      // spread
const bypass3: Cfg = Object.assign({}, { theme: "dark", extra: 1 });

// 🧠 Freshness check exists to catch typos, not to enforce strict shapes.

/* ============================================================
 *  4️⃣ FUNCTION COMPATIBILITY
 * ============================================================ */

// 🔸 Return types — covariant
// A function returning a SUBTYPE is compatible where a SUPERtype return is expected.
type Producer = () => Animal;
const producesDog: () => Dog = () => ({ name: "Rex", breed: "Lab" });
const p1: Producer = producesDog;   // ✅ Dog is assignable to Animal

// 🔸 Parameters — contravariant (under strictFunctionTypes)
// A function accepting a SUPERTYPE is compatible where a SUBTYPE accept is expected.
type Handler = (d: Dog) => void;
const wideHandler: (a: Animal) => void = (a) => console.log(a.name);
const h: Handler = wideHandler;     // ✅ accepts Animal ⊇ Dog
// const narrowHandler: (d: Dog) => void = (a: Animal) => {};
// would fail in the reverse direction

// 🔸 Parameter count — fewer params OK
type Two = (a: number, b: number) => void;
const one: Two = (a) => {};         // ✅ fewer params OK
// const three: Two = (a, b, c) => {}; // ❌ more params NOT OK

// 🔸 Method syntax → bivariant (unsound but pragmatic)
interface Obj1 { method(x: Dog): void }
interface Obj2 { method(x: Animal): void }
// These are compatible EITHER direction when using method syntax.

// 🔸 Property-function syntax → strict (contravariant) under strictFunctionTypes
interface Obj3 { fn: (x: Dog) => void }
interface Obj4 { fn: (x: Animal) => void }
// Obj4 assignable to Obj3, not the reverse.

/* ============================================================
 *  5️⃣ VARIANCE — SUMMARY
 * ============================================================ */

// ┌──────────────────────┬──────────────┬─────────────────────┐
// │ Position             │ Variance     │ Meaning             │
// ├──────────────────────┼──────────────┼─────────────────────┤
// │ Return type          │ Covariant    │ Sub → Super OK      │
// │ Parameter type       │ Contravariant│ Super → Sub OK      │
// │ Method syntax param  │ Bivariant    │ Either direction    │
// │ Property type        │ Covariant    │ Sub → Super OK      │
// │ readonly array       │ Covariant    │ string[] → readonly │
// │ Mutable array        │ Invariant    │ Must match exactly  │
// └──────────────────────┴──────────────┴─────────────────────┘

// 🔸 Arrays:
let nums: number[] = [1, 2, 3];
let roNums: readonly number[] = nums;   // ✅ mutable → readonly
// nums = roNums;                       // ❌ readonly → mutable

/* ============================================================
 *  6️⃣ OPTIONAL & EXCESS MEMBERS
 * ============================================================ */

// Optional props make a type more permissive on the SOURCE side.
interface A1 { a: number; b?: number }
interface A2 { a: number }

const x1: A1 = { a: 1 };
const x2: A2 = x1;         // ✅ A1 assignable to A2
const x3: A1 = { a: 1 };
// const x4: A2 = x3; // still ✅

// 🔸 Missing optional props are fine in both directions
const a2Val: A2 = { a: 1 };
const a1Val: A1 = a2Val;   // ✅

/* ============================================================
 *  7️⃣ INDEX SIGNATURES & COMPATIBILITY
 * ============================================================ */

// Index signature types must be compatible with explicit props.
interface Dict { [key: string]: number; count: number }

// ⚠️ Explicit props must be assignable to the index signature type.
// interface BadDict { [k: string]: number; name: string } // ❌

// 🔸 Assigning object to index-signature type
const d: Dict = { count: 5, other: 10 };

// 🔸 Implicit index signature (from object literal) matches index signature
// as long as ALL values are the same type.

/* ============================================================
 *  8️⃣ CLASSES & COMPATIBILITY
 * ============================================================ */

// Public members only → structural compatibility
class A {
  x = 0;
  m() {}
}
class B {
  x = 0;
  m() {}
}
const aInst: A = new B();   // ✅ same shape (public members)

// 🔸 private/protected members make classes NOMINAL
class C1 { private secret = 1 }
class C2 { private secret = 1 }
// const c: C1 = new C2();  // ❌ different declarations of `secret`

// 🔸 A class instance is assignable to an interface if shape matches
interface HasX { x: number }
const hx: HasX = new A();    // ✅

/* ============================================================
 *  9️⃣ ENUMS & COMPATIBILITY
 * ============================================================ */

enum E1 { A, B }
enum E2 { A, B }

// Numeric enums are compatible with `number` (⚠️ unsound)
const numFromEnum: number = E1.A;         // ✅
const enumFromNum: E1 = 42;               // ✅ (numeric enums allow it)

// String enums are NOMINAL — E1 and E2 are NOT interchangeable
enum Status1 { Ok = "OK" }
enum Status2 { Ok = "OK" }
// const s: Status1 = Status2.Ok;         // ❌

// Union of literal strings is often a better choice:
type Status = "OK" | "ERROR";

/* ============================================================
 *  🔟 GENERICS & COMPATIBILITY
 * ============================================================ */

// Generic types are checked structurally when instantiated.
interface Box<T> { value: T }

const boxNum: Box<number> = { value: 1 };
const boxNumOrStr: Box<number | string> = boxNum; // ✅ number ⊆ union

// 🔸 Readonly<T> is NOT just T with readonly props — it creates a new shape.
// 🔸 Invariance: Box<Dog> is NOT assignable to Box<Animal> in general,
//    because `value` is a mutable covariant-unsafe slot.

/* ============================================================
 *  1️⃣1️⃣ any / unknown / never IN COMPATIBILITY
 * ============================================================ */

// 🔸 any is assignable to and from EVERYTHING
let anyV: any = 1;
const n1: number = anyV;
const s1: string = anyV;

// 🔸 unknown is only assignable TO things after narrowing
let unkV: unknown = 1;
// const n2: number = unkV;   // ❌ must narrow first
const anything: unknown = 42; // ✅ anything → unknown

// 🔸 never is assignable to EVERYTHING, but nothing is assignable to never
let neverV!: never;
const x: number = neverV;      // ✅
const y: string = neverV;      // ✅
// neverV = 42;                // ❌

/* ============================================================
 *  1️⃣2️⃣ SOUNDNESS HOLES (UNSOUND ASSIGNMENTS)
 * ============================================================ */

// ⚠️ TS is INTENTIONALLY unsound in a few places for pragmatism:

// 1) Array covariance (mutable!)
const dogs: Dog[] = [{ name: "Rex", breed: "Lab" }];
const animals: Animal[] = dogs;      // ✅ but unsound
animals.push({ name: "Cat" });       // 💥 dogs now contains a non-Dog

// 2) Numeric enums accept any number (see §9)

// 3) Method parameter bivariance (see §4)

// 4) `any` bypasses everything

// 🧠 Understanding these holes helps you avoid subtle runtime bugs.

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Freshness / excess property check only applies to literals.
// ⚠️ Interfaces with same shape but different names ARE compatible.
// ⚠️ Classes with private/protected members are NOMINALLY typed.
// ⚠️ Enums (numeric) accept any number — string enums are strict.
// ⚠️ Function params are contravariant under strictFunctionTypes; methods bivariant.
// ⚠️ readonly arrays are covariant; mutable arrays are unsound-covariant.
// ⚠️ Optional fields don't affect direction of assignability, only presence.
// ⚠️ Index signatures place constraints on ALL explicit props.

// 🕒 Version notes
// - Structural typing since TS 1.0
// - strictFunctionTypes: TS 2.6
// - Improved variance with property-function syntax
// - const type params (TS 5.0) interact with generics and inference

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept                              | Rule                     |
 * ─────────────────────────────────────────────────────────────
 * | Object shape matching                | Structural (shape-based) |
 * | Extra props on variables             | ✅ OK                    |
 * | Extra props on literals              | ❌ (excess check)        |
 * | Return type assignability            | Covariant                |
 * | Function param assignability         | Contravariant (strict)   |
 * | Method param assignability           | Bivariant                |
 * | Fewer params than expected           | ✅ OK                    |
 * | More params than expected            | ❌                       |
 * | Optional props on source             | ✅ OK                    |
 * | Missing required props on source     | ❌                       |
 * | Classes with private members         | Nominal                  |
 * | Numeric enums ↔ number               | Bidirectional (unsound)  |
 * | String enums across declarations     | ❌ Nominal               |
 * | mutable → readonly array             | ✅                       |
 * | readonly → mutable array             | ❌                       |
 * | `any` assignable both ways           | ✅                       |
 * | `never` assignable to everything     | ✅                       |
 * | `unknown` assignable from everything | ✅                       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Rely on structural typing — it enables duck-typing-style APIs.
 *  - Be aware of excess property checks on literals — use spread to bypass.
 *  - Turn on `strictFunctionTypes` for sounder callbacks.
 *  - Prefer property-function syntax for stricter variance.
 *  - Prefer string unions over numeric enums to avoid nominal/unsound traps.
 *  - Prefer readonly arrays — covariant and safer.
 *  - Remember mutable arrays are unsound-covariant — be careful with shared refs.
 *  - Use `unknown` at API boundaries to force narrowing.
 * ============================================================ */