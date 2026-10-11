// 05_Classes_OOP/05_Overloading.ts

/* ============================================================
 *  📘 OVERLOADING IN CLASSES
 *
 *  Sections:
 *   1. Method overloading
 *   2. Constructor overloading
 *   3. Static method overloading
 *   4. Getter/setter overload alternatives
 *   5. Generic overloads
 *   6. Overload rules & pitfalls
 *   7. Edge cases, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ METHOD OVERLOADING
 * ============================================================ */

// Overload signatures (no body) + one implementation signature.
// The implementation signature is NOT visible to callers.

class Formatter {
  format(v: number): string;
  format(v: string): string;
  format(v: Date): string;
  format(v: number | string | Date): string {
    if (typeof v === "number") return v.toFixed(2);
    if (typeof v === "string") return v.trim();
    return v.toISOString();
  }
}

const f = new Formatter();
f.format(3.14159);           // "3.14"
f.format("  hi  ");          // "hi"
f.format(new Date());        // ISO string

// 🔸 Order matters — most specific first
class Parser {
  parse(v: null): null;
  parse(v: string): string[];
  parse(v: number): number[];
  parse(v: string | number | null) {
    if (v === null) return null;
    return typeof v === "number" ? [v] : v.split("");
  }
}

/* ============================================================
 *  2️⃣ CONSTRUCTOR OVERLOADING
 * ============================================================ */

// Same principle: signatures + one implementation.

class Version {
  version: string;

  constructor(major: number, minor: number);
  constructor(version: string);
  constructor(a: number | string, b?: number) {
    this.version = typeof a === "string" ? a : `${a}.${b ?? 0}`;
  }
}

new Version(1, 2);            // "1.2"
new Version("3.0.1");         // "3.0.1"
// new Version(true);         // ❌ no matching overload

// 🔸 Overloads + parameter properties — parameter-property syntax only on
//    the IMPLEMENTATION signature, and it applies to that signature.

class Box {
  constructor(public value: number);
  constructor(value: string);
  constructor(value: number | string) {
    this.value = typeof value === "number" ? value : Number(value);
  }
  value: number;
}

/* ============================================================
 *  3️⃣ STATIC METHOD OVERLOADING
 * ============================================================ */

class Factory {
  static create(kind: "user"): { kind: "user"; name: string };
  static create(kind: "post"): { kind: "post"; title: string };
  static create(kind: "user" | "post") {
    return kind === "user"
      ? { kind: "user", name: "" }
      : { kind: "post", title: "" };
  }
}

Factory.create("user");       // { kind: "user"; name: string }
Factory.create("post");       // { kind: "post"; title: string }

/* ============================================================
 *  4️⃣ GETTER / SETTER OVERLOAD ALTERNATIVES
 * ============================================================ */

// Accessors cannot be overloaded in the same way.
// Use a method overload instead, or use union types.

class Safe {
  private _value: string | number = 0;

  // Union-typed accessor (TS 4.3+ allows different get/set types)
  get value(): string | number { return this._value; }
  set value(v: string | number) { this._value = v; }
}

// 🔸 If you need overload-like behavior, use a method:
class Safe2 {
  private store: Record<string, string | number> = {};
  set(key: "id", v: number): void;
  set(key: "name", v: string): void;
  set(key: string, v: string | number): void { this.store[key] = v; }
}

/* ============================================================
 *  5️⃣ GENERIC OVERLOADS
 * ============================================================ */

// Combine generics + overloads for strong typing.

class Collection<T> {
  add(item: T): this;
  add(items: T[]): this;
  add(itemOrItems: T | T[]): this {
    return this;
  }
}

// 🔸 Generic with conditional return
function pluck<T, K extends keyof T>(obj: T, key: K): T[K];
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][];
function pluck<T, K extends keyof T>(obj: T, keyOrKeys: K | K[]) {
  if (Array.isArray(keyOrKeys)) return keyOrKeys.map(k => obj[k]);
  return obj[keyOrKeys];
}

/* ============================================================
 *  6️⃣ OVERLOAD RULES & PITFALLS
 * ============================================================ */

// ✅ Rules
//  - Implementation signature must be COMPATIBLE with every overload.
//  - Implementation signature is NOT visible to callers.
//  - The first matching overload wins (order matters).
//  - You can have as many overload signatures as you want, then ONE impl.

// ⚠️ Pitfalls
//  - Forgetting a matching overload → confusing error to callers.
//  - Implementation signature that WIDENS types can silently accept
//    more than intended.
//  - Overloading arrow functions is not possible directly — use function
//    declarations or interface with call signatures.
//  - Overloads + generics can get very complex — consider unions first.

// 🔸 Simpler alternative to overloading:
//     function f(x: number | string): number | string
//     Overload when the RETURN TYPE depends on the INPUT TYPE.

/* ============================================================
 *  7️⃣ EDGE CASES, VERSION NOTES
 * ============================================================ */

// ⚠️ A method's overloads must be in the same class body.
// ⚠️ Override of an overloaded method in a subclass must re-declare all
//     overloads — inherited ones are not automatically preserved.
// ⚠️ Optional parameters in overloads behave like normal functions.
// ⚠️ Abstract method overloads are allowed — subclasses must implement impl.
// ⚠️ Access modifiers apply to the implementation signature.

// 🕒 Version notes
// - Function/method overloads: TS 1.0+
// - Generic overloads: TS 2.x+
// - Union return + overload simplification patterns: TS 3.x+
// - Accessor with different types: TS 4.3

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Overload kind       | Syntax                                     |
 * ─────────────────────────────────────────────────────────────
 * | Method              | sig; sig; impl { }                         |
 * | Constructor         | sig; sig; constructor(...) { }             |
 * | Static              | static sig; static sig; static impl { }    |
 * | Abstract            | abstract sig; abstract impl-like sig       |
 * | Generic             | sig<T>; sig<T>; impl<T> { }                |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer union types when the return type doesn't depend on input.
 *  - Use overloads when RETURN TYPE varies with the INPUT TYPE.
 *  - Order overload signatures from most specific to least.
 *  - Keep the implementation signature WIDE enough to cover all overloads.
 *  - Document each overload with a short comment.
 *  - Re-declare inherited overloads in subclasses that override methods.
 * ============================================================ */