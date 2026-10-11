// 05_Classes_OOP/06_Class_Decorators.ts

/* ============================================================
 *  📘 CLASS DECORATORS IN TYPESCRIPT
 *
 *  Decorators are functions that add behavior to classes, methods,
 *  properties, accessors, and parameters at design time.
 *
 *  Sections:
 *   1. Enabling decorators (tsconfig)
 *   2. Class decorator
 *   3. Method decorator
 *   4. Property decorator
 *   5. Accessor decorator
 *   6. Parameter decorator
 *   7. Decorator factories
 *   8. Decorator composition & order
 *   9. Real-world patterns
 *  10. TS 5.0 standard vs legacy experimental decorators
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ ENABLING DECORATORS
 * ============================================================ */

// Legacy (experimental) decorators — the classic TS behavior:
// tsconfig.json:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true   // optional — used by DI frameworks
//   }
// }
//
// TS 5.0+ standard decorators — no flag needed if targeting ES2022+
// and not using experimentalDecorators.

/* ============================================================
 *  2️⃣ CLASS DECORATOR
 * ============================================================ */

// Applied to a class constructor.
// Can replace or extend the class.

function Sealed<T extends { new (...args: any[]): {} }>(Ctor: T) {
  Object.seal(Ctor);
  Object.seal(Ctor.prototype);
  return Ctor;
}

@Sealed
class Service {
  run() {}
}

// 🔸 Decorator that REPLACES the class:
function Tagged<T extends { new (...args: any[]): {} }>(Ctor: T) {
  return class extends Ctor {
    tag = "tagged";
  };
}

@Tagged
class UserService {}

/* ============================================================
 *  3️⃣ METHOD DECORATOR
 * ============================================================ */

// Receives (target, propertyKey, descriptor).

function Log(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[Log] ${key}(${args.join(", ")})`);
    return original.apply(this, args);
  };
  return descriptor;
}

class Calc {
  @Log
  add(a: number, b: number) { return a + b; }
}

new Calc().add(1, 2);   // [Log] add(1, 2) → 3

/* ============================================================
 *  4️⃣ PROPERTY DECORATOR
 * ============================================================ */

// Receives (target, propertyKey).
// Cannot directly modify the property value — only metadata or prototype hooks.

function Required(target: any, key: string) {
  const set = new Set<string>(target.__required ?? []);
  set.add(key);
  Object.defineProperty(target, "__required", { value: set });
}

class Form {
  @Required name!: string;
  @Required email!: string;
}

/* ============================================================
 *  5️⃣ ACCESSOR DECORATOR
 * ============================================================ */

// Applied to getters/setters.
// Receives (target, key, descriptor) like method decorators.

function Enumerable(target: any, key: string, descriptor: PropertyDescriptor) {
  descriptor.enumerable = true;
  return descriptor;
}

class Person {
  private _name = "";
  @Enumerable
  get name() { return this._name; }
  set name(v: string) { this._name = v; }
}

/* ============================================================
 *  6️⃣ PARAMETER DECORATOR
 * ============================================================ */

// Applied to constructor or method parameters.
// Receives (target, key, parameterIndex).

function Inject(token: string) {
  return (target: any, key: string | undefined, index: number) => {
    const existing: any[] = target.__inject ?? [];
    existing.push({ token, index, key });
    Object.defineProperty(target, "__inject", { value: existing });
  };
}

class UserController {
  constructor(@Inject("UserService") private svc: any) {}
}

/* ============================================================
 *  7️⃣ DECORATOR FACTORIES
 * ============================================================ */

// A function that RETURNS a decorator — lets you configure the decorator.

function Prefix(prefix: string) {
  return function (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return `${prefix}${original.apply(this, args)}`;
    };
  };
}

class Greeter {
  @Prefix(">> ")
  hello(name: string) { return `Hello, ${name}`; }
}

console.log(new Greeter().hello("Ravi"));   // ">> Hello, Ravi"

/* ============================================================
 *  8️⃣ DECORATOR COMPOSITION & ORDER
 * ============================================================ */

// Multiple decorators on the same declaration evaluate:
//   - top-to-bottom for the DECORATOR EXPRESSIONS
//   - bottom-to-top for the DECORATOR CALLS

function A() { console.log("A eval"); return () => console.log("A call"); }
function B() { console.log("B eval"); return () => console.log("B call"); }

class Demo {
  @A()
  @B()
  method() {}
}

// Output order:
//   A eval
//   B eval
//   B call
//   A call

/* ============================================================
 *  9️⃣ REAL-WORLD PATTERNS
 * ============================================================ */

// 🔸 Dependency injection (Angular, NestJS-style)
// @Injectable()
// class UserService {
//   constructor(@Inject("Repo") private repo: Repo) {}
// }

// 🔸 ORM entity mapping (TypeORM-style)
// @Entity()
// class User {
//   @PrimaryGeneratedColumn()
//   id!: number;
//   @Column()
//   name!: string;
// }

// 🔸 Validation (class-validator-style)
// class DTO {
//   @IsString() @MinLength(1) name!: string;
//   @IsEmail() email!: string;
// }

// 🔸 Logging & benchmarking
// function Measure(target: any, key: string, desc: PropertyDescriptor) {
//   const original = desc.value;
//   desc.value = function (...args: any[]) {
//     const t = performance.now();
//     const r = original.apply(this, args);
//     console.log(`${key} took ${(performance.now() - t).toFixed(2)}ms`);
//     return r;
//   };
// }

/* ============================================================
 *  🔟 TS 5.0 STANDARD vs LEGACY DECORATORS
 * ============================================================ */

// Legacy (experimental) decorators — the classic:
//   - Need `experimentalDecorators: true`
//   - Method decorator receives (target, key, descriptor)
//   - Cannot be used with `useDefineForClassFields` cleanly
//   - This is what NestJS, Angular, TypeORM use today.

// Standard (TS 5.0+) decorators — Stage 3 TC39:
//   - No flag needed (may still need `experimentalDecorators: false`)
//   - Use `ClassMethodDecoratorContext` etc.
//   - Cleaner, standardized, forward-compatible
//   - Different signature — receives (value, context)

// Standard decorator example:
function standardLog<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    console.log(`Calling ${String(context.name)}`);
    return target.call(this, ...args);
  };
}

class StdDemo {
  @standardLog
  hello(name: string) { return `Hello, ${name}`; }
}

// ⚠️ You cannot mix standard and legacy decorators on the same declaration.

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Experimental decorators need `experimentalDecorators: true`.
// ⚠️ Standard decorators need TS 5.0+ and target ES2022+.
// ⚠️ Cannot mix standard & legacy on the same declaration.
// ⚠️ Property decorators CANNOT modify the property — only metadata/hooks.
// ⚠️ Decorators run ONCE when the class is DEFINED — not per instantiation.
// ⚠️ Decorator factories return a decorator — configure behavior.
// ⚠️ Decorator evaluation order: expressions top→bottom, calls bottom→top.
// ⚠️ `emitDecoratorMetadata` emits design-time types — used by DI frameworks.
// ⚠️ Parameter decorators cannot be used standalone — only with methods/ctors.
// ⚠️ Method decorators may return a NEW descriptor to replace behavior.

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
 * | Class              | (Ctor) => Ctor | void                        |
 * | Method             | (target, key, descriptor) => descriptor|void |
 * | Property           | (target, key) => void                        |
 * | Accessor           | (target, key, descriptor) => descriptor|void |
 * | Parameter          | (target, key, index) => void                 |
 * | Factory            | (...args) => decorator                       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use decorator factories to make decorators configurable.
 *  - Keep decorators FOCUSED — one responsibility per decorator.
 *  - Document evaluation order when stacking decorators.
 *  - Prefer STANDARD decorators for new projects (TS 5.0+).
 *  - Use LEGACY decorators when integrating with frameworks (NestJS, TypeORM).
 *  - Avoid heavy reflection/metadata unless needed.
 *  - Remember: decorators run ONCE at class-definition time.
 * ============================================================ */