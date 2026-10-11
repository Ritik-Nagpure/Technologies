// 05_Classes_OOP/19_Proxy_Pattern.ts

/* ============================================================
 *  📘 THE PROXY PATTERN IN TYPESCRIPT
 *
 *  Proxy provides a SURROGATE or placeholder for another object
 *  to CONTROL access to it.
 *
 *  ⚠️ NOT the same as JavaScript's built-in `Proxy` object —
 *     though that's one way to implement it. This file covers
 *     the GoF structural pattern, with a section on the JS
 *     `Proxy` API too.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. Types of proxies (virtual, protection, remote, logging, caching, smart)
 *   4. Basic implementation (image lazy loading)
 *   5. Protection proxy (access control)
 *   6. Caching proxy
 *   7. Logging / observability proxy
 *   8. Remote proxy
 *   9. Generic proxy (type-safe)
 *  10. JS built-in `Proxy` API
 *  11. Proxy vs Decorator vs Adapter vs Facade
 *  12. Real-world use cases
 *  13. Pros & cons
 *  14. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// The Proxy implements the SAME interface as the real object, but
// intercepts calls and decides what to do:
//
//   Client → Proxy → RealSubject
//
//   The proxy can:
//     - Defer creation (virtual proxy)
//     - Deny access (protection proxy)
//     - Cache results (caching proxy)
//     - Log calls (logging proxy)
//     - Talk to a remote system (remote proxy)
//     - Hold references (smart reference)
//
// Client code is UNAWARE — same interface either way.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────┬────────────────────────────────────────────┐
// │ Role             │ Responsibility                              │
// ├──────────────────┼────────────────────────────────────────────┤
// │ Subject          │ Common interface for proxy & real subject   │
// │ RealSubject      │ The actual object doing work                │
// │ Proxy            │ Holds a reference; intercepts calls         │
// │ Client           │ Uses only the Subject interface             │
// └──────────────────┴────────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ TYPES OF PROXIES
 * ============================================================ */

// ┌────────────────────┬───────────────────────────────────────────┐
// │ Type               │ Purpose                                    │
// ├────────────────────┼───────────────────────────────────────────┤
// │ Virtual            │ Lazy init — create heavy object on demand  │
// │ Protection         │ Access control / authz                     │
// │ Remote             │ Local stand-in for a remote service        │
// │ Caching            │ Store results, serve repeats               │
// │ Logging            │ Instrument calls, metrics, tracing         │
// │ Smart reference    │ Extra actions on access (refcount, locks)  │
// │ Copy-on-write      │ Delay cloning until mutation               │
// │ Firewall           │ Allow only listed methods / args           │
// └────────────────────┴───────────────────────────────────────────┘

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — VIRTUAL (LAZY) PROXY
 * ============================================================ */

// Scenario: rendering high-res images is expensive. Load only when needed.

interface Image {
  display(): void;
  getFilename(): string;
}

class RealImage implements Image {
  constructor(private filename: string) {
    // Simulated expensive disk read
    console.log(`Loading ${filename} from disk...`);
  }
  display(): void { console.log(`Displaying ${this.filename}`); }
  getFilename(): string { return this.filename; }
}

// ─── Virtual Proxy ───
class ImageProxy implements Image {
  private real: RealImage | null = null;

  constructor(private filename: string) {}

  private ensureLoaded(): RealImage {
    if (!this.real) this.real = new RealImage(this.filename);
    return this.real;
  }

  display(): void { this.ensureLoaded().display(); }
  getFilename(): string { return this.filename; }   // cheap — no load
}

// ─── Client ───
const img: Image = new ImageProxy("big-photo.png");
console.log(img.getFilename());   // no load — just returns name
img.display();                    // triggers load + display
img.display();                    // reuse cached RealImage

// 🧠 RealImage is only created on the FIRST display call.

/* ============================================================
 *  5️⃣ PROTECTION PROXY (ACCESS CONTROL)
 * ============================================================ */

interface Document {
  view(): string;
  edit(content: string): void;
}

class RealDocument implements Document {
  private content = "Top secret data";
  view(): string { return this.content; }
  edit(content: string): void { this.content = content; }
}

class DocumentProtectionProxy implements Document {
  constructor(private doc: Document, private userRole: "admin" | "user" | "guest") {}

  view(): string {
    if (this.userRole === "guest") throw new Error("Access denied");
    return this.doc.view();
  }

  edit(content: string): void {
    if (this.userRole !== "admin") throw new Error("Only admins can edit");
    this.doc.edit(content);
  }
}

const adminDoc = new DocumentProtectionProxy(new RealDocument(), "admin");
adminDoc.edit("New content");
console.log(adminDoc.view());

const guestDoc = new DocumentProtectionProxy(new RealDocument(), "guest");
try { guestDoc.view(); } catch (e) { console.log((e as Error).message); } // Access denied

/* ============================================================
 *  6️⃣ CACHING PROXY
 * ============================================================ */

interface WeatherService {
  getForecast(city: string): Promise<string>;
}

class RealWeatherService implements WeatherService {
  async getForecast(city: string): Promise<string> {
    console.log(`Calling API for ${city}...`);
    return `${city}: sunny, 25°C`;
  }
}

class CachedWeatherService implements WeatherService {
  private cache = new Map<string, { value: string; expires: number }>();

  constructor(private real: WeatherService, private ttlMs = 60_000) {}

  async getForecast(city: string): Promise<string> {
    const hit = this.cache.get(city);
    if (hit && hit.expires > Date.now()) {
      console.log(`Cache hit for ${city}`);
      return hit.value;
    }
    const value = await this.real.getForecast(city);
    this.cache.set(city, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}

// ─── Usage ───
(async () => {
  const svc: WeatherService = new CachedWeatherService(new RealWeatherService(), 5000);
  await svc.getForecast("Pune");   // API call
  await svc.getForecast("Pune");   // cache hit
})();

/* ============================================================
 *  7️⃣ LOGGING / OBSERVABILITY PROXY
 * ============================================================ */

interface PaymentGateway {
  charge(amount: number, currency: string): Promise<string>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number, currency: string) {
    return `charge_${amount}_${currency}`;
  }
}

class LoggingPaymentProxy implements PaymentGateway {
  constructor(private real: PaymentGateway, private log = console.log) {}

  async charge(amount: number, currency: string): Promise<string> {
    const start = performance.now();
    this.log(`→ charge(${amount}, ${currency})`);
    try {
      const result = await this.real.charge(amount, currency);
      this.log(`← charge → ${result} (${(performance.now() - start).toFixed(1)}ms)`);
      return result;
    } catch (e) {
      this.log(`✗ charge failed: ${(e as Error).message}`);
      throw e;
    }
  }
}

// ─── Usage ───
const pay: PaymentGateway = new LoggingPaymentProxy(new StripeGateway());
// pay.charge(99.99, "USD");

// 🧠 Same pattern powers OpenTelemetry, New Relic, Datadog SDKs.

/* ============================================================
 *  8️⃣ REMOTE PROXY
 * ============================================================ */

// Local object that represents a remote service.

interface UserAPI {
  getUser(id: number): Promise<{ id: number; name: string }>;
}

class RemoteUserAPI implements UserAPI {
  constructor(private baseUrl: string) {}

  async getUser(id: number) {
    const res = await fetch(`${this.baseUrl}/users/${id}`);
    return res.json();
  }
}

// A remote proxy that adds retries + timeout on top of RemoteUserAPI.
class ResilientUserAPIProxy implements UserAPI {
  constructor(private real: UserAPI, private retries = 3, private timeoutMs = 5000) {}

  async getUser(id: number) {
    for (let i = 0; i < this.retries; i++) {
      try {
        return await withTimeout(this.real.getUser(id), this.timeoutMs);
      } catch (e) {
        if (i === this.retries - 1) throw e;
      }
    }
    throw new Error("unreachable");
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

/* ============================================================
 *  9️⃣ GENERIC PROXY (TYPE-SAFE)
 * ============================================================ */

// A generic logging proxy that works with ANY interface.

function createLoggingProxy<T extends object>(target: T, log = console.log): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value === "function") {
        return (...args: unknown[]) => {
          log(`Calling ${String(prop)}(${args.map((a) => JSON.stringify(a)).join(", ")})`);
          return (value as Function).apply(obj, args);
        };
      }
      return value;
    },
  });
}

// 🔸 Generic caching proxy
function createCachingProxy<T extends object>(target: T): T {
  const cache = new WeakMap<object, Map<string, unknown>>();
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value !== "function") return value;

      return (...args: unknown[]) => {
        let perTarget = cache.get(obj);
        if (!perTarget) { perTarget = new Map(); cache.set(obj, perTarget); }
        const key = `${String(prop)}:${JSON.stringify(args)}`;
        if (!perTarget.has(key)) {
          perTarget.set(key, (value as Function).apply(obj, args));
        }
        return perTarget.get(key);
      };
    },
  });
}

// 🔸 Usage
class Calculator {
  add(a: number, b: number) { return a + b; }
}
const loggedCalc = createLoggingProxy(new Calculator());
loggedCalc.add(1, 2);

/* ============================================================
 *  🔟 JS BUILT-IN `Proxy` API
 * ============================================================ */

// JavaScript ships a native `Proxy` constructor with TRAPS.

const target = { name: "Ravi", age: 25 };
const handler: ProxyHandler<typeof target> = {
  get(obj, prop, receiver) {
    if (prop === "age") return (obj.age as number) + 1;   // virtual override
    return Reflect.get(obj, prop, receiver);
  },
  set(obj, prop, value) {
    if (prop === "age" && (value as number) < 0) throw new Error("Negative age");
    return Reflect.set(obj, prop, value);
  },
  has(obj, prop) { return prop === "name" || prop in obj; },
  deleteProperty(obj, prop) { console.log(`delete ${String(prop)}`); return Reflect.deleteProperty(obj, prop); },
};

const proxied = new Proxy(target, handler);
proxied.age;               // 26 (get trap intercepts)
proxied.age = 30;          // set trap

// Common traps:
//   get, set, has, deleteProperty
//   ownKeys, getOwnPropertyDescriptor
//   apply (for callable targets), construct (for `new`)
//
// Frameworks using `Proxy`:
//   - Vue 3 reactivity
//   - MobX
//   - Immer
//   - React (some internals)
//   - Testing libraries (Sinon, Jest mocks)

/* ============================================================
 *  1️⃣1️⃣ PROXY vs DECORATOR vs ADAPTER vs FACADE
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Intent (all keep SAME interface except)      │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Proxy        │ CONTROL access                                │
// │ Decorator    │ ADD behavior                                  │
// │ Adapter      │ CONVERT interface (different!)                │
// │ Facade       │ SIMPLIFY many (different!)                    │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 Proxy vs Decorator: same STRUCTURE, different INTENT.
//    Proxy often creates the real subject itself;
//    Decorator usually receives the wrapped object.

/* ============================================================
 *  1️⃣2️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Lazy loading heavy resources (images, modules, DB connections)
// - Access control (auth, RBAC, tenancy)
// - Caching (HTTP, DB, API responses)
// - Observability (logging, metrics, tracing)
// - Remote services (RPC, gRPC client, tRPC)
// - Retry / timeout / circuit breaker wrappers
// - Copy-on-write data structures
// - Virtual DOM / reactivity systems (JS `Proxy`)
// - Dependency injection lazy resolution
// - Test doubles (mocks, spies) — same interface, controlled behavior
//
// Frameworks:
//   - Vue 3 (reactivity via `Proxy`)
//   - Immer (immutable updates)
//   - React Query (caching proxy over fetches)
//   - tRPC (remote proxy over HTTP)
//   - Class-validator / class-transformer (property access proxies)

/* ============================================================
 *  1️⃣3️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Control access without changing the real subject
//  - Encapsulate cross-cutting concerns (cache, log, auth)
//  - Client code unaware — same interface
//  - Open/Closed — add behavior without editing RealSubject
//  - Natural fit for lazy loading and remote services
//
// ❌ Cons
//  - Extra indirection — debugging is harder
//  - Latency added per call (though usually negligible)
//  - Can hide performance costs if the proxy does heavy work
//  - Overuse leads to "everything is a proxy" complexity
//  - Must carefully re-delegate every method (boilerplate)
//  - JS `Proxy` traps can be tricky (invariants, `this` binding)

/* ============================================================
 *  1️⃣4️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Proxy MUST implement the SAME interface as the real subject —
//     otherwise it's an Adapter.
// ⚠️ If the proxy adds BEHAVIOR (not just access control), it starts
//     overlapping with Decorator. Intent matters.
// ⚠️ Delegation boilerplate is real — TS has no automatic delegation.
//     For big interfaces, generate with a helper or use JS `Proxy`.
// ⚠️ `this` binding: when delegating, call methods with the REAL
//     subject as `this` — `this.real.method(...)`.
// ⚠️ In JS `Proxy`, careful with `Reflect` and prototypes —
//     `receiver` matters for getters/setters.
// ⚠️ Traps must respect invariants (e.g., non-configurable props).
// ⚠️ Async: prefer delegating async signatures (Promise) and NOT
//     changing sync/async across the boundary.
// ⚠️ Caching proxies must define invalidation — TTL, LRU, or explicit.
// ⚠️ Protection proxies should fail CLOSED (deny by default).
// ⚠️ Logging proxies should never silently swallow errors.

// 🕒 Version notes
// - GoF Proxy pattern: 1994
// - JS `Proxy` API: ES2015 / TS 2.0
// - `Reflect` API: ES2015 / TS 2.0
// - Generic proxy factories: TS 1.0+
// - `WeakMap` for caches: ES2015 / TS 2.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role          │ Notes                                         │
 * ─────────────────────────────────────────────────────────────
 * | Subject       │ Common interface for proxy + real              │
 * | RealSubject   │ The actual object doing work                   │
 * | Proxy         │ Holds a reference; controls access             │
 * | Client        │ Uses only Subject interface                    │
 * ─────────────────────────────────────────────────────────────
 *
 * | Proxy type       │ Common use                                │
 * ─────────────────────────────────────────────────────────────
 * | Virtual          │ Lazy init heavy objects                    │
 * | Protection       │ Auth, RBAC, tenancy                        │
 * | Caching          │ HTTP, DB, API results                      │
 * | Logging          │ Metrics, tracing, observability            │
 * | Remote           │ RPC, gRPC, HTTP clients                    │
 * | Smart reference  │ Refcounts, locks, auto-free                │
 * | Copy-on-write    │ Delay clone until mutation                 │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Keep the SAME interface as the RealSubject.
 *  - Make the proxy's INTENT clear: control vs add behavior.
 *  - Prefer composition over inheritance.
 *  - Cache with explicit TTL or invalidation policy.
 *  - Fail closed in protection proxies.
 *  - Never swallow errors in logging proxies — rethrow after logging.
 *  - Bind delegated calls correctly: `this.real.method(...)`.
 *  - Use generic `Proxy`-based factories for HOF-style wrapping.
 *  - Use the NATIVE JS `Proxy` when you need dynamic intercepts.
 *  - Document which proxy type you're implementing (virtual, etc.).
 *  - Consider Decorator if you're truly ADDING behavior.
 *  - Consider Adapter if the interface differs.
 * ============================================================ */