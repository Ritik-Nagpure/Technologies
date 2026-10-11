// 05_Classes_OOP/07_Metadata.ts

/* ============================================================
 *  📘 METADATA & REFLECTION IN TYPESCRIPT
 *
 *  Metadata = "data about data" — decorators can attach design-time
 *  type information that becomes available at runtime via the
 *  `reflect-metadata` polyfill.
 *
 *  Sections:
 *   1.  What is metadata?
 *   2.  Enabling metadata (tsconfig + reflect-metadata)
 *   3.  Built-in design:* metadata keys
 *   4.  Property metadata (design:type)
 *   5.  Method metadata (design:returntype, design:paramtypes)
 *   6.  Parameter metadata (design:paramtypes)
 *   7.  Custom metadata (Reflect.metadata / defineMetadata)
 *   8.  Reading metadata
 *   9.  Real-world patterns (validation, DI, serialization)
 *  10.  Metadata on classes & class members
 *  11.  Edge cases, pitfalls, version notes
 * ============================================================ */

// tsconfig.json:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true
//   }
// }
// 📦 Install: npm i reflect-metadata

import "reflect-metadata";

/* ============================================================
 *  1️⃣ WHAT IS METADATA?
 * ============================================================ */

// Metadata is data ABOUT data — attached to classes, methods,
// properties, and parameters.
// Decorators + metadata = powerful tools for:
//   - Validation
//   - Dependency Injection
//   - Serialization / deserialization
//   - ORM mapping
//   - Auto-documentation
//
// Without `emitDecoratorMetadata: true`, TS does NOT emit design:*
// metadata — you must attach it yourself via `Reflect.metadata`.

/* ============================================================
 *  2️⃣ ENABLING METADATA
 * ============================================================ */

// 1) tsconfig.json must have:
//      "experimentalDecorators": true,
//      "emitDecoratorMetadata": true
// 2) Import `reflect-metadata` once at app entry.
// 3) BOTH decorators AND at least one decorator on the target
//    are needed for TS to emit metadata on that element.

/* ============================================================
 *  3️⃣ BUILT-IN design:* METADATA KEYS
 * ============================================================ */

// TypeScript emits three reserved keys when a declaration is
// decorated AND emitDecoratorMetadata is on:
//
//   "design:type"       → the type of a property
//   "design:paramtypes" → array of parameter types of a method/ctor
//   "design:returntype" → return type of a method
//
// These are read at runtime via Reflect.getMetadata(...).

/* ============================================================
 *  4️⃣ PROPERTY METADATA — design:type
 * ============================================================ */

function LogType(target: any, key: string) {
  const type = Reflect.getMetadata("design:type", target, key);
  console.log(`Property ${key} type: ${type?.name}`);
}

class Book {
  @LogType
  title!: string;              // → "String"

  @LogType
  pages!: number;              // → "Number"

  @LogType
  published!: Date;            // → "Date"

  @LogType
  tags!: string[];             // → "Array"  (⚠️ element type not captured)
}

// new Book();  // triggers decorator at class-definition time (once)

/* ============================================================
 *  5️⃣ METHOD METADATA — design:returntype / design:paramtypes
 * ============================================================ */

function LogMethodMeta(target: any, key: string, desc: PropertyDescriptor) {
  const returnType = Reflect.getMetadata("design:returntype", target, key);
  const paramTypes = Reflect.getMetadata("design:paramtypes", target, key);

  console.log(`Method ${key} return: ${returnType?.name}`);
  console.log(
    `Method ${key} params: ${(paramTypes ?? []).map((t: any) => t?.name).join(", ")}`
  );
}

class Calculator {
  @LogMethodMeta
  add(a: number, b: number): number {
    return a + b;
  }

  @LogMethodMeta
  greet(name: string, when: Date): string {
    return `Hi ${name} at ${when.toISOString()}`;
  }
}

/* ============================================================
 *  6️⃣ PARAMETER METADATA — design:paramtypes
 * ============================================================ */

// `design:paramtypes` on a method/constructor gives the array of
// parameter types. Parameter decorators alone don't emit metadata,
// but they coexist with method decorators that read it.

function ParamLogger(target: any, key: string | undefined, index: number) {
  const types = Reflect.getMetadata("design:paramtypes", target, key as any) ?? [];
  const type = types[index];
  console.log(`Param #${index} of ${key ?? "constructor"}: ${type?.name}`);
}

class Calc2 {
  constructor(
    @ParamLogger private name: string,
    @ParamLogger private value: number
  ) {}

  @ParamLogger
  sum(@ParamLogger a: number, @ParamLogger b: number): number {
    return a + b;
  }
}

/* ============================================================
 *  7️⃣ CUSTOM METADATA
 * ============================================================ */

// You can define your own metadata keys and values using
// `Reflect.metadata(key, value)` (decorator) or
// `Reflect.defineMetadata(key, value, target, key)`.

// Decorator factory for setting custom metadata
function SetMeta(key: string, value: any) {
  return Reflect.metadata(key, value);
}

// Reader decorator
function GetMeta(target: any, key: string) {
  const val = Reflect.getMetadata("custom:info", target, key);
  console.log(`Custom metadata on ${key}: ${val}`);
}

class User {
  @SetMeta("custom:info", "Sensitive field")
  @GetMeta
  password!: string;

  @SetMeta("custom:role", "admin")
  role!: string;
}

// 🔸 Reading custom metadata anywhere:
// const info = Reflect.getMetadata("custom:info", User.prototype, "password");
// → "Sensitive field"

/* ============================================================
 *  8️⃣ READING METADATA
 * ============================================================ */

// Common read methods on Reflect:
//   Reflect.getMetadata(key, target [, propertyKey])
//   Reflect.getOwnMetadata(key, target [, propertyKey])
//   Reflect.hasMetadata(key, target [, propertyKey])
//   Reflect.getMetadataKeys(target [, propertyKey])
//   Reflect.deleteMetadata(key, target [, propertyKey])

// Reflect.metadata(key, value) → decorator that DEFINES metadata.
// Reflect.defineMetadata(key, value, target [, propertyKey]) → direct define.

const meta = Reflect.getMetadata("custom:info", User.prototype, "password");
console.log("Read back:", meta);   // "Sensitive field"

// 🔸 Iterate keys
const keys = Reflect.getMetadataKeys(User.prototype);
console.log("Metadata keys on User.prototype:", keys);

/* ============================================================
 *  9️⃣ REAL-WORLD PATTERNS
 * ============================================================ */

// 🔸 Validation decorators
const validators = new Map<string, (v: any) => boolean>();

function IsString(target: any, key: string) {
  const existing = validators.get(key) ?? (() => true);
  validators.set(key, (v) => existing(v) && typeof v === "string");
}

function MinLength(len: number) {
  return (target: any, key: string) => {
    const existing = validators.get(key) ?? (() => true);
    validators.set(
      key,
      (v) => existing(v) && typeof v === "string" && v.length >= len
    );
  };
}

class RegisterDTO {
  @IsString
  @MinLength(3)
  username!: string;
}

function validate(obj: any, cls: Function): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(obj)) {
    const fn = validators.get(key);
    if (fn && !fn(obj[key])) errors.push(`Invalid ${key}`);
  }
  return errors;
}

// 🔸 Dependency Injection (NestJS style)
const injectableMeta = Symbol("injectable");

function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(injectableMeta, true, target);
  };
}

function Inject2<T>(token: string): ParameterDecorator {
  return (target, key, index) => {
    const existing = Reflect.getMetadata("inject:tokens", target, key as any) ?? [];
    existing[index] = token;
    Reflect.defineMetadata("inject:tokens", existing, target, key as any);
  };
}

@Injectable()
class UserService {
  constructor(@Inject2("Repo") private repo: any) {}
}

// 🔸 Serialization (class-transformer style)
function Expose(name?: string) {
  return (target: any, key: string) => {
    const mapping = Reflect.getMetadata("serialize:map", target) ?? {};
    mapping[key] = name ?? key;
    Reflect.defineMetadata("serialize:map", mapping, target);
  };
}

class Post {
  @Expose() id!: number;
  @Expose("post_title") title!: string;
}

/* ============================================================
 *  🔟 METADATA ON CLASSES & CLASS MEMBERS
 * ============================================================ */

// 🔸 Class-level metadata
function Entity(table: string): ClassDecorator {
  return (target) => Reflect.defineMetadata("orm:table", table, target);
}

@Entity("users")
class UserEntity {
  id!: number;
}

// read at runtime:
const table = Reflect.getMetadata("orm:table", UserEntity);
console.log("ORM table:", table);   // "users"

// 🔸 Static-side vs instance-side metadata:
//    - Instance side  → User.prototype
//    - Static side    → User (the constructor)
//    Reflect APIs let you attach to either.

// 🔸 Constructor parameter metadata:
//    Reflect.getMetadata("design:paramtypes", User) gives ctor param types.

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `emitDecoratorMetadata: true` is REQUIRED for design:* keys.
// ⚠️ You must import "reflect-metadata" ONCE per runtime entrypoint.
// ⚠️ A decorator MUST be present on the element for TS to emit metadata
//    for that element (bare classes/members get none).
// ⚠️ `design:type` loses generic / array element info — only "Array",
//    "Object", "Promise" etc. are captured.
// ⚠️ `interface` and `type` types do NOT emit metadata — only classes,
//    primitives, and arrays get design:type info. Interfaces are
//    compile-time only.
// ⚠️ Union types emit `Object` as the metadata.
// ⚠️ `design:paramtypes` on a method WITHOUT a decorator on that method
//    returns `undefined`.
// ⚠️ Standard TC39 decorators (TS 5.0) do NOT support design:* metadata
//    the same way — reflection is limited; frameworks mostly use legacy
//    decorators today.
// ⚠️ Metadata is mutable — anyone with the prototype can define/override
//    a key. Not a security boundary.
// ⚠️ Reflect metadata is stored on the prototype — inheritance chains
//    mean metadata may be read from a parent class unless you use
//    `getOwnMetadata`.
// ⚠️ Tree-shaking may remove classes with only metadata — help bundlers
//    by marking side effects.

// 🕒 Version notes
// - `reflect-metadata`: not part of TS, separate polyfill (ES7 proposal).
// - `emitDecoratorMetadata`: TS 1.5.
// - Standard decorators (TS 5.0): do NOT emit design:* metadata; use
//   explicit metadata APIs instead.
// - `Symbol.metadata` (TS 5.2): standardized metadata slot for
//   standard decorators — different from reflect-metadata.

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Metadata key             | Value                                 |
 * ─────────────────────────────────────────────────────────────
 * | "design:type"            | Type of the property                  |
 * | "design:paramtypes"      | Array of parameter types (method/ctor)|
 * | "design:returntype"      | Method return type                    |
 * | Custom keys (any string) | Any value you define                  |
 * ─────────────────────────────────────────────────────────────
 *
 * | Reflect API                              | Use              |
 * ─────────────────────────────────────────────────────────────
 * | Reflect.metadata(k, v)                   | Decorator factory|
 * | Reflect.defineMetadata(k, v, t, p?)      | Direct define    |
 * | Reflect.getMetadata(k, t, p?)            | Read (incl. proto)|
 * | Reflect.getOwnMetadata(k, t, p?)         | Read (no proto)  |
 * | Reflect.hasMetadata(k, t, p?)            | Check presence   |
 * | Reflect.getMetadataKeys(t, p?)           | List keys        |
 * | Reflect.deleteMetadata(k, t, p?)         | Remove           |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 SUMMARY
 *  - `reflect-metadata` enables runtime type inspection.
 *  - Built-in keys: design:type, design:paramtypes, design:returntype.
 *  - Use for validation, DI, serialization, ORM mapping, and more.
 *
 * 🧠 BEST PRACTICES
 *  - Import "reflect-metadata" exactly ONCE at app boot.
 *  - Enable BOTH experimentalDecorators and emitDecoratorMetadata.
 *  - Name custom keys with a namespace (e.g., "app:role").
 *  - Prefer `getOwnMetadata` when inheritance must not leak metadata.
 *  - For DI, key by class token or unique symbol — not raw strings.
 *  - Don't rely on design:type for arrays/generics — capture manually.
 *  - Prefer explicit custom metadata over magic strings.
 *  - For TS 5.0+ standard decorators, use `Symbol.metadata` instead.
 * ============================================================ */