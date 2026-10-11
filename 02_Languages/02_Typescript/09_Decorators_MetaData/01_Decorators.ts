// 05_Classes_OOP/06_Class_Decorators.ts

/* ============================================================
 *  📘 CLASS DECORATORS — COMPLETE COVERAGE
 *
 *  Decorators are special declarations prefixed with `@` that
 *  modify or observe classes, methods, properties, accessors,
 *  and parameters.
 *
 *  Sections:
 *   1.  Enabling decorators in tsconfig
 *   2.  Class decorator
 *   3.  Property decorator
 *   4.  Accessor decorator
 *   5.  Method decorator
 *   6.  Parameter decorator
 *   7.  Decorator factories (configurable decorators)
 *   8.  Decorator composition & evaluation order
 *   9.  Real-world patterns (logging, validation, DI, ORM, caching)
 *  10.  Standard (TS 5.0) vs legacy decorators
 *  11.  Edge cases, pitfalls, version notes
 * ============================================================ */

// tsconfig.json:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true   // optional — used by DI frameworks
//   }
// }

/* ============================================================
 *  ────────────────  CLASS DECORATOR  ────────────────
 *
 *  🎯 Used to observe, modify, or replace a class definition.
 *  Receives the constructor. May return a new constructor.
 * ============================================================ */

function LogClass(constructor: Function) {
  console.log(`Class loaded: ${constructor.name}`);
}

@LogClass
class Example {
  // ────────────────  PROPERTY DECORATOR  ────────────────
  // 🧩 Applied to class properties; useful for validation, metadata.
  @LogProperty
  title: string = "TS Decorators";

  private _val: number = 0;

  // ────────────────  ACCESSOR DECORATOR  ────────────────
  // 🔍 Applied to getters/setters; can control access or log usage.
  @LogAccessor
  get value() {
    return this._val;
  }

  // ────────────────  METHOD DECORATOR  ────────────────
  // ⚙️ Wraps or modifies method behavior (e.g., logging, caching).
  @LogMethod
  update(@LogParam newVal: number) {
    this._val = newVal;
  }
}

/* ============================================================
 *  ────────────────  DECORATOR DEFINITIONS  ────────────────
 * ============================================================ */

// 🔸 Property decorator — receives (target, key)
//    Cannot change the property value directly — only metadata / prototype hooks.
function LogProperty(target: any, key: string) {
  console.log(`Property Decorator → ${key}`);
}

// 🔸 Accessor decorator — receives (target, key, descriptor)
//    Can override getter/setter logic.
function LogAccessor(target: any, key: string, desc: PropertyDescriptor) {
  console.log(`Accessor Decorator → ${key}`);
}

// 🔸 Method decorator — receives (target, key, descriptor)
//    Can wrap the original method.
function LogMethod(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  desc.value = function (...args: any[]) {
    console.log(`Method Decorator → ${key}, Args: ${args}`);
    return orig.apply(this, args);
  };
}

// 🔸 Parameter decorator — receives (target, key, index)
//    Cannot modify the parameter directly — used for DI metadata etc.
function LogParam(target: any, key: string, index: number) {
  console.log(`Parameter Decorator → ${key}, Index: ${index}`);
}

/* ============================================================
 *  1️⃣ ENABLING DECORATORS
 * ============================================================ */

// Legacy (experimental) decorators — the classic:
// tsconfig.json:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true   // optional
//   }
// }
//
// TS 5.0+ STANDARD decorators — Stage 3 TC39:
//   No `experimentalDecorators` flag needed if targeting ES2022+.
//   Different signature — receives (value, context) instead of
//   (target, key, descriptor).

/* ============================================================
 *  2️⃣ CLASS DECORATOR (DEEP DIVE)
 * ============================================================ */

// Receives the constructor function.
// Can extend, seal, or replace the class.

function Sealed<T extends { new (...args: any[]): {} }>(Ctor: T) {
  Object.seal(Ctor);
  Object.seal(Ctor.prototype);
  return Ctor;
}

@Sealed
class Service1 { run() {} }

// 🔸 Replace the class (return a subclass):
function Tagged<T extends { new (...args: any[]): {} }>(Ctor: T) {
  return class extends Ctor {
    tag = "tagged";
  };
}

@Tagged
class UserService {}
// new UserService() now has `.tag`

/* ============================================================
 *  3️⃣ PROPERTY DECORATOR (DEEP DIVE)
 * ============================================================ */

// Receives (target, propertyKey).
// Cannot directly change the property — but can define hooks on the prototype.

// 🔸 Collect "required" fields as metadata
function Required(target: any, key: string) {
  const set: Set<string> = target.__required ?? new Set();
  set.add(key);
  Object.defineProperty(target, "__required", { value: set });
}

class Form {
  @Required name!: string;
  @Required email!: string;
}

// 🔸 Common real pattern: mark fields and validate at runtime.

/* ============================================================
 *  4️⃣ ACCESSOR DECORATOR (DEEP DIVE)
 * ============================================================ */

// Receives (target, key, descriptor).
// Same shape as method decorators — descriptor has get/set.

function Enumerable(target: any, key: string, desc: PropertyDescriptor) {
  desc.enumerable = true;
  return desc;
}

class Person1 {
  private _name = "";
  @Enumerable
  get name() { return this._name; }
  set name(v: string) { this._name = v; }
}

/* ============================================================
 *  5️⃣ METHOD DECORATOR (DEEP DIVE)
 * ============================================================ */

// Receives (target, key, descriptor).
// Return a modified descriptor to replace behavior.

// 🔸 Logging
function Log(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  desc.value = function (...args: any[]) {
    console.log(`[Log] ${key}(${args.join(", ")})`);
    return orig.apply(this, args);
  };
  return desc;
}

// 🔸 Benchmarking
function Measure(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  desc.value = function (...args: any[]) {
    const t0 = performance.now();
    const r = orig.apply(this, args);
    console.log(`${key} took ${(performance.now() - t0).toFixed(2)}ms`);
    return r;
  };
  return desc;
}

// 🔸 Memoization
function Memo(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  const cache = new Map<string, any>();
  desc.value = function (...args: any[]) {
    const k = JSON.stringify(args);
    if (!cache.has(k)) cache.set(k, orig.apply(this, args));
    return cache.get(k);
  };
  return desc;
}

class Calc1 {
  @Log
  @Measure
  @Memo
  fib(n: number): number {
    return n <= 1 ? n : this.fib(n - 1) + this.fib(n - 2);
  }
}

/* ============================================================
 *  6️⃣ PARAMETER DECORATOR (DEEP DIVE)
 * ============================================================ */

// Receives (target, methodKey | undefined, parameterIndex).
// Undefined `methodKey` → constructor parameter.

function Inject(token: string) {
  return (target: any, key: string | undefined, index: number) => {
    const meta: any[] = target.__inject ?? [];
    meta.push({ token, index, key });
    Object.defineProperty(target, "__inject", { value: meta });
  };
}

class UserController {
  constructor(@Inject("UserService") private svc: any) {}
}

// ⚠️ Parameter decorators cannot be used standalone — only on:
//    - constructor parameters
//    - method parameters

/* ============================================================
 *  7️⃣ DECORATOR FACTORIES
 * ============================================================ */

// A function that RETURNS a decorator — lets you configure it.

function Prefix(prefix: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const orig = desc.value;
    desc.value = function (...args: any[]) {
      return `${prefix}${orig.apply(this, args)}`;
    };
  };
}

class Greeter1 {
  @Prefix(">> ")
  hello(name: string) { return `Hello, ${name}`; }
}

console.log(new Greeter1().hello("Ravi"));   // ">> Hello, Ravi"

/* ============================================================
 *  8️⃣ DECORATOR COMPOSITION & ORDER
 * ============================================================ */

// Multiple decorators on the same declaration:
//   - Evaluate TOP-to-BOTTOM (decorator expressions)
//   - Call BOTTOM-to-TOP (decorator functions)

function A() { console.log("A eval"); return () => console.log("A call"); }
function B() { console.log("B eval"); return () => console.log("B call"); }

class Demo {
  @A()
  @B()
  method() {}
}

// Output:
//   A eval
//   B eval
//   B call
//   A call

// 🔸 Combined with method/accessor/property ordering:
//   1. Instance member decorators (properties/methods)
//   2. Parameter decorators
//   3. Constructor parameter decorators
//   4. Class decorators (LAST)

/* ============================================================
 *  9️⃣ REAL-WORLD PATTERNS
 * ============================================================ */

// 🔸 Dependency Injection (NestJS / Angular style)
// @Injectable()
// class UserService {
//   constructor(@Inject("Repo") private repo: Repo) {}
// }

// 🔸 ORM Entity Mapping (TypeORM style)
// @Entity()
// class User {
//   @PrimaryGeneratedColumn() id!: number;
//   @Column() name!: string;
// }

// 🔸 Validation (class-validator style)
// class DTO {
//   @IsString() @MinLength(1) name!: string;
//   @IsEmail() email!: string;
// }

// 🔸 HTTP route decorators (Express-decorators style)
// function Get(path: string) {
//   return (target: any, key: string, desc: PropertyDescriptor) => {
//     Reflect.defineMetadata("route", { method: "GET", path }, target, key);
//   };
// }

// 🔸 Class-level logging
// @LogClass
// class App {}

/* ============================================================
 *  🔟 STANDARD (TS 5.0) vs LEGACY DECORATORS
 * ============================================================ */

// Legacy (experimental):
//   - Needs `experimentalDecorators: true`
//   - Signature: (target, key, descriptor)
//   - Used by NestJS, Angular, TypeORM
//   - Runs at class-DEFINITION time

// Standard (TS 5.0+ / TC39 Stage 3):
//   - No `experimentalDecorators` flag needed
//   - Signature: (value, context)
//   - Cleaner, forward-compatible, works natively with JS
//   - Cannot mix with legacy on the same declaration

// 🔸 Standard method decorator example:
function log<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    console.log(`Calling ${String(context.name)}`);
    return target.call(this, ...args);
  };
}

class StdDemo {
  @log
  hello(name: string) { return `Hello, ${name}`; }
}

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Legacy decorators require `experimentalDecorators: true`.
// ⚠️ Standard decorators require TS 5.0+ AND target ES2022+.
// ⚠️ Cannot mix standard + legacy on the same declaration.
// ⚠️ Property decorators CANNOT modify the property value — only metadata/hooks.
// ⚠️ Decorators run ONCE at class-DEFINITION time — not per instantiation.
// ⚠️ Evaluation order: expressions top→bottom; calls bottom→top.
// ⚠️ Class decorators run LAST.
// ⚠️ `emitDecoratorMetadata` emits design types via `reflect-metadata` — needed by NestJS etc.
// ⚠️ Parameter decorators are standalone illegal — always on a method/constructor.
// ⚠️ Method decorators can return a NEW descriptor to fully replace behavior.
// ⚠️ Decorators on static members receive the constructor as `target` instead
//    of the prototype — code carefully.
// ⚠️ `useDefineForClassFields: true` changes how properties behave with decorators.

// 🕒 Version notes
// - `experimentalDecorators`: TS 1.5
// - `emitDecoratorMetadata`: TS 1.5
// - Standard TC39 decorators: TS 5.0
// - Both supported from TS 5.0 onwards

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Decorator type     | Signature                                    |
 * ─────────────────────────────────────────────────────────────
 * | Class              | (Ctor) => Ctor \| void                       |
 * | Method             | (target, key, descriptor) => descriptor\|void|
 * | Property           | (target, key) => void                        |
 * | Accessor           | (target, key, descriptor) => descriptor\|void|
 * | Parameter          | (target, key, index) => void                 |
 * | Factory            | (...args) => decorator                       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 SUMMARY (from the original file)
 *  - Class     → modifies or observes class constructor
 *  - Property  → attaches metadata or validation to fields
 *  - Accessor  → controls getter/setter logic
 *  - Method    → wraps method logic (e.g., logging)
 *  - Parameter → tracks or validates method arguments
 *
 * 🧠 BEST PRACTICES
 *  - Use decorator factories to make decorators configurable.
 *  - Keep decorators FOCUSED — one responsibility each.
 *  - Document evaluation order when stacking decorators.
 *  - Prefer STANDARD decorators for new TS 5.0+ projects.
 *  - Use LEGACY decorators for framework integration (NestJS, Angular, TypeORM).
 *  - Avoid heavy reflection unless necessary.
 *  - Remember: decorators run ONCE at class-definition time.
 * ============================================================ */