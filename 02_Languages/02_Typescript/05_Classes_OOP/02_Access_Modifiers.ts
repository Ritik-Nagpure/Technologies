// 05_Classes_OOP/02_Access_Modifiers.ts

/* ============================================================
 *  📘 ACCESS MODIFIERS IN TYPESCRIPT
 *
 *  Sections:
 *   1. public (default)
 *   2. private
 *   3. protected
 *   4. readonly
 *   5. Parameter-property modifiers
 *   6. Static + modifiers
 *   7. `#private` runtime-privacy fields
 *   8. Access modifier rules & inheritance
 *   9. Getter / setter with modifiers
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ PUBLIC (DEFAULT)
 * ============================================================ */

// `public` is the default — visible everywhere.
// Even if you don't write `public`, it's public.

class Book {
  public title: string;
  public author: string;

  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
  }
}

const b = new Book("TS in Depth", "Ravi");
b.title;  // ✅ accessible

/* ============================================================
 *  2️⃣ PRIVATE
 * ============================================================ */

// `private` — visible only within the declaring class.
// NOT visible to subclasses, NOT visible to consumers.

class Wallet {
  private balance = 0;

  deposit(n: number): void { this.balance += n; }
  get amount(): number { return this.balance; }
}

const w = new Wallet();
w.deposit(100);
// w.balance;               // ❌ private — error
console.log(w.amount);      // ✅ 100

// ⚠️ `private` is COMPILE-TIME ONLY — erased at runtime.
//     Bracket access still works: (w as any).balance → 100

/* ============================================================
 *  3️⃣ PROTECTED
 * ============================================================ */

// `protected` — visible within the class AND its subclasses.
// NOT visible to outside consumers.

class Vehicle {
  protected wheels = 4;
  protected start(): void { console.log("starting"); }
}

class Car extends Vehicle {
  describe(): string {
    return `Car with ${this.wheels} wheels`;   // ✅ access protected
  }
}

const c = new Car();
c.describe();               // ✅
// c.wheels;                // ❌ protected
// c.start();               // ❌ protected

/* ============================================================
 *  4️⃣ READONLY
 * ============================================================ */

// `readonly` — can be set ONLY in the declaration or the constructor.

class Config {
  readonly env: string;
  readonly version = "1.0.0";       // set at declaration
  static readonly MAX = 100;        // readonly static

  constructor(env: string) {
    this.env = env;                 // ✅ allowed in ctor
    // this.version = "2";          // ❌ already set at declaration
  }
}

const cfg = new Config("prod");
// cfg.env = "dev";                 // ❌

// ⚠️ `readonly` is SHALLOW — nested properties remain mutable.

class Nested {
  readonly data = { count: 0 };
}
new Nested().data.count = 5;        // ✅ allowed (shallow)

/* ============================================================
 *  5️⃣ PARAMETER-PROPERTY MODIFIERS
 * ============================================================ */

// Combine access modifier + parameter-property syntax.

class Account {
  constructor(
    public    owner: string,        // public
    private   balance: number,      // private
    protected tier: string,         // protected
    public readonly id: string      // public + readonly
  ) {}
}

const acc = new Account("Ravi", 1000, "gold", "A1");
acc.owner;                    // ✅
// acc.balance;               // ❌
// acc.tier;                  // ❌
// acc.id = "A2";             // ❌ readonly

/* ============================================================
 *  6️⃣ STATIC + MODIFIERS
 * ============================================================ */

class Registry {
  public    static count = 0;
  private   static secret = "s3cr3t";
  protected static base = 100;
  readonly  static readonly MAX = 1000;

  static increment(): void { Registry.count++; }
}

Registry.increment();
Registry.count;               // ✅
// Registry.secret;           // ❌
// Registry.MAX = 2000;       // ❌ readonly

/* ============================================================
 *  7️⃣ `#private` RUNTIME-PRIVACY FIELDS
 * ============================================================ */

// ES2022 `#name` fields are REAL runtime-private — enforced by JS itself.

class Secure {
  private tsPrivate = 1;         // compile-time only
  #runtimePrivate = 2;           // runtime private (hard privacy)
  static #counter = 0;           // static private

  reveal(): number {
    Secure.#counter++;
    return this.#runtimePrivate;
  }
}

const s = new Secure();
s.reveal();                      // ✅
// s.tsPrivate;                  // ❌ TS error (but works via `as any`)
// s.#runtimePrivate;            // ❌ SyntaxError — no way to access from outside

// 🔸 Rules
// - `#` fields cannot be accessed via `this["#field"]`.
// - `#` fields are NOT inherited the way regular fields are —
//   subclass cannot access parent's #fields.
// - Mixing `private` and `#` in the same class is fine but confusing.

/* ============================================================
 *  8️⃣ ACCESS MODIFIER RULES & INHERITANCE
 * ============================================================ */

// 🔸 You can WIDEN visibility in a subclass, but not NARROW it.

class Base {
  protected x = 1;
  public y = 2;
}

class Child extends Base {
  public x = 10;                  // ✅ widen protected → public
  // protected y = 20;            // ❌ cannot narrow public → protected
}

// 🔸 Overriding with `readonly` in subclass — no change to visibility rules
class Child2 extends Base {
  readonly x = 100;               // ✅ wider + readonly
}

// 🔸 `private` members are NOT inherited by subclasses.
//     (They exist on instances, but subclass code cannot access them.)

/* ============================================================
 *  9️⃣ GETTER / SETTER WITH MODIFIERS
 * ============================================================ */

class Temp {
  private _c = 0;

  public get celsius(): number { return this._c; }
  public set celsius(v: number) { this._c = v; }

  // Protected accessor — subclasses can read but not write
  protected get fahrenheit(): number { return this._c * 9/5 + 32; }
}

class SmartTemp extends Temp {
  report(): string { return `${this.fahrenheit}°F`; }   // ✅
}

// ⚠️ If a setter is private, a getter can still be public (and vice versa),
//    but the READONLY rule applies: external code can only read.

/* ============================================================
 *  1️⃣0️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ `private` is compile-time only — cast away with `as any` at runtime.
// ⚠️ Use `#` for real runtime privacy.
// ⚠️ `readonly` blocks reassignment — but not mutation of the referenced value.
// ⚠️ Subclasses can widen but NOT narrow access modifiers.
// ⚠️ `private` members are not accessible from subclasses (unlike protected).
// ⚠️ Access modifiers on getters/setters must be compatible:
//     you cannot have `public get` + `private set` with different key... actually
//     TS 4.3+ allows different accessor visibility, but treat carefully.
// ⚠️ `static readonly` fields can be initialized in the class body but not
//     reassigned after that.
// ⚠️ `abstract` + `protected` combinations work — subclasses must implement.

// 🕒 Version notes
// - Access modifiers: TS 1.0+
// - `readonly` on properties: TS 2.0
// - `readonly` on arrays: TS 3.4
// - `#private` fields: TS 3.8 (ES2022 runtime)
// - `override` keyword: TS 4.3
// - Different accessor visibility: TS 4.3

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Modifier       | Class | Subclass | Outside | Runtime enforced |
 * ─────────────────────────────────────────────────────────────
 * | public         | ✅    | ✅       | ✅      | ❌               |
 * | protected      | ✅    | ✅       | ❌      | ❌               |
 * | private        | ✅    | ❌       | ❌      | ❌ (compile-time)|
 * | #private       | ✅    | ❌       | ❌      | ✅ (real privacy)|
 * | readonly       | set   | set      | read    | ❌ (compile-time)|
 * | static         | class | class    | class   | ✅               |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Default to `public`; use the narrowest modifier possible.
 *  - Use `#private` when you truly need runtime encapsulation.
 *  - Prefer `readonly` for immutable fields — documents intent.
 *  - Use `protected` for extension points in abstract/base classes.
 *  - Combine `static` + `readonly` for constants on the class.
 *  - Avoid `as any` casts to peek at `private` members.
 *  - Don't rely on `private` for security — it's a design tool, not a lock.
 * ============================================================ */