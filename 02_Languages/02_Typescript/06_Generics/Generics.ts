// 06_Generics/Generics.ts

/* ============================================================
 *  📘 GENERICS — COMBINED PATTERNS & REAL-WORLD USAGE
 *
 *  This file ties together everything from:
 *    - 01_Generic_Types.ts
 *    - 02_Generic_Interfaces.ts
 *    - 03_Generic_Constraints.ts
 *
 *  Sections:
 *   1. Building utility types from scratch
 *   2. Generic data structures
 *   3. Type-safe event emitters
 *   4. Generic API clients
 *   5. Generic reducers / state containers
 *   6. Generic builders (fluent APIs)
 *   7. Generic factory functions
 *   8. Generic dependency injection
 *   9. Advanced inference with `infer`
 *  10. Composing utilities
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ BUILDING UTILITY TYPES FROM SCRATCH
 * ============================================================ */

// Every built-in utility type is a mapped/conditional type. Let's rebuild them.

type MyPartial<T>   = { [K in keyof T]?: T[K] };
type MyRequired<T>  = { [K in keyof T]-?: T[K] };
type MyReadonly<T>  = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends keyof any, V> = { [P in K]: V };
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyReturnType<F extends (...a: any) => any> =
  F extends (...a: any) => infer R ? R : never;
type MyParameters<F extends (...a: any) => any> =
  F extends (...a: infer P) => any ? P : never;
type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T;

// 🔸 Deep variants
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// 🔸 Nullable wrapper
type Nullable<T> = T | null;

/* ============================================================
 *  2️⃣ GENERIC DATA STRUCTURES
 * ============================================================ */

// Stack
class Stack2<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  get size(): number { return this.items.length; }
}

// Queue
class Queue2<T> {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
}

// Linked List
class LinkedList<T> {
  head: { value: T; next: LinkedList<T>["head"] } | null = null;
  add(value: T): void {
    this.head = { value, next: this.head };
  }
}

// Binary Search Tree
class BST<T> {
  private root: { value: T; left?: BST<T>["root"]; right?: BST<T>["root"] } | null = null;

  insert(value: T, cmp: (a: T, b: T) => number): void {
    const node = { value };
    if (!this.root) { this.root = node; return; }
    let cur: any = this.root;
    while (true) {
      const c = cmp(value, cur.value);
      if (c < 0) { if (!cur.left) { cur.left = node; return; } cur = cur.left; }
      else       { if (!cur.right) { cur.right = node; return; } cur = cur.right; }
    }
  }
}

/* ============================================================
 *  3️⃣ TYPE-SAFE EVENT EMITTER
 * ============================================================ */

type EventMap = Record<string, unknown>;

class Emitter<Events extends EventMap> {
  private handlers: Partial<{
    [K in keyof Events]: ((payload: Events[K]) => void)[]
  }> = {};

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void {
    const list = (this.handlers[event] ??= [] as any);
    list.push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.handlers[event]?.forEach(h => h(payload));
  }
}

const emitter = new Emitter<{
  click: { x: number; y: number };
  key: { code: string };
}>();

emitter.on("click", (e) => e.x.toFixed());       // e typed as { x, y }
emitter.emit("key", { code: "Enter" });
// emitter.emit("key", { x: 1 });                // ❌ wrong payload

/* ============================================================
 *  4️⃣ GENERIC API CLIENT
 * ============================================================ */

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  req?: unknown;
  res: unknown;
}

type ApiSchema = Record<string, Endpoint>;

class ApiClient<Schema extends ApiSchema> {
  constructor(private baseUrl: string) {}

  async call<K extends keyof Schema>(
    endpoint: K,
    body?: Schema[K]["req"]
  ): Promise<Schema[K]["res"]> {
    const { method, path } = {} as Schema[K];   // illustrative
    return fetch(`${this.baseUrl}${path}`, {
      method,
      body: JSON.stringify(body),
    }).then(r => r.json() as Promise<Schema[K]["res"]>);
  }
}

type MyApi = {
  getUser: { method: "GET"; path: "/users/1"; res: { id: number; name: string } };
  createUser: { method: "POST"; path: "/users"; req: { name: string }; res: { id: number } };
};

const api = new ApiClient<MyApi>("https://api.example.com");
// const u = await api.call("getUser");            // u: { id: number; name: string }
// const c = await api.call("createUser", { name: "Ravi" }); // c: { id: number }

/* ============================================================
 *  5️⃣ GENERIC REDUCER / STATE CONTAINER
 * ============================================================ */

type Action<T extends string = string, P = unknown> = { type: T; payload: P };
type Reducer<S, A> = (state: S, action: A) => S;
type Dispatch<A> = (action: A) => void;

function createStore<S, A extends Action>(
  reducer: Reducer<S, A>,
  initial: S
): { getState: () => S; dispatch: Dispatch<A>; subscribe: (fn: (s: S) => void) => void } {
  let state = initial;
  const listeners = new Set<(s: S) => void>();
  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(fn => fn(state));
    },
    subscribe: (fn) => { listeners.add(fn); },
  };
}

// 🔸 Strongly typed action union
type CounterAction =
  | { type: "inc" }
  | { type: "dec" }
  | { type: "set"; payload: number };

const counter = createStore<number, CounterAction>(
  (state, action) => {
    switch (action.type) {
      case "inc": return state + 1;
      case "dec": return state - 1;
      case "set": return action.payload;
    }
  },
  0
);

counter.dispatch({ type: "set", payload: 10 });
// counter.dispatch({ type: "set" });               // ❌ payload required
// counter.dispatch({ type: "reset" });             // ❌ not in union

/* ============================================================
 *  6️⃣ GENERIC BUILDER (FLUENT API)
 * ============================================================ */

class QueryBuilder<Selected extends string = never> {
  private parts: string[] = [];
  private selected: string = "";

  select<K extends string>(cols: K): QueryBuilder<Selected | K> {
    this.selected = cols;
    this.parts.push(`SELECT ${cols}`);
    return this as unknown as QueryBuilder<Selected | K>;
  }
  from(table: string): this {
    this.parts.push(`FROM ${table}`);
    return this;
  }
  where(clause: string): this {
    this.parts.push(`WHERE ${clause}`);
    return this;
  }
  build(): string { return this.parts.join(" "); }
}

const q = new QueryBuilder().select("id").from("users").where("active = 1").build();

/* ============================================================
 *  7️⃣ GENERIC FACTORY FUNCTIONS
 * ============================================================ */

// A factory that takes a constructor and returns instances.
function factory<T extends new (...args: any[]) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new Ctor(...args);
}

class Point { constructor(public x: number, public y: number) {} }
const p = factory(Point, 1, 2);          // Point

// 🔸 Factory with registry
class Container3 {
  private factories = new Map<string, () => unknown>();
  register<K extends string, T>(key: K, fn: () => T): void {
    this.factories.set(key, fn);
  }
  resolve<T>(key: string): T {
    const f = this.factories.get(key);
    if (!f) throw new Error(`No factory for ${key}`);
    return f() as T;
  }
}

/* ============================================================
 *  8️⃣ GENERIC DEPENDENCY INJECTION
 * ============================================================ */

// Token-based DI with generics
class Token<T> {
  constructor(public readonly name: string) {}
}

class DIContainer {
  private registrations = new Map<Token<any>, () => any>();

  register<T>(token: Token<T>, factory: () => T): void {
    this.registrations.set(token, factory);
  }
  resolve<T>(token: Token<T>): T {
    const f = this.registrations.get(token);
    if (!f) throw new Error(`No registration for ${token.name}`);
    return f();
  }
}

const LoggerToken = new Token<{ log: (s: string) => void }>("Logger");
const di = new DIContainer();
di.register(LoggerToken, () => ({ log: console.log }));
const logger = di.resolve(LoggerToken);   // { log: (s) => void }

/* ============================================================
 *  9️⃣ ADVANCED INFERENCE WITH `infer`
 * ============================================================ */

// Extract element type of an array
type ElementOf<T> = T extends (infer U)[] ? U : never;

// Unwrap Promise recursively
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;

// Function composition typed
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
  return (a) => f(g(a));
}

// Typed curry
type Curry<F> =
  F extends (a: infer A, ...rest: infer R) => infer Ret
    ? R extends []
      ? (a: A) => Ret
      : (a: A) => Curry<(...args: R) => Ret>
    : never;

function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  return ((...args: any[]) =>
    args.length >= fn.length ? fn(...args) : (...rest: any[]) => curry(fn)(...args, ...rest)
  ) as Curry<F>;
}

// Extract keys whose values match a type
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T];

/* ============================================================
 *  1️⃣0️⃣ COMPOSING UTILITIES
 * ============================================================ */

// Convert entity to DTO: omit server-only + make readonly
type User = { id: string; name: string; password: string; createdAt: Date };
type UserDTO = Readonly<Omit<User, "password" | "createdAt">>;
// { readonly id: string; readonly name: string }

// Patch type: all optional except id
type UserPatch = Partial<Omit<User, "id">> & Pick<User, "id">;

// Form state: some required, some optional
type UserForm = Required<Pick<User, "name">> & Partial<Pick<User, "id">>;

// API response: success or failure, generic in both
type ApiResult<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

// Recursive JSON
type JSONValue =
  | string | number | boolean | null
  | JSONValue[]
  | { [k: string]: JSONValue };

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Deep recursive utilities can hit compiler depth limits — keep them shallow.
// ⚠️ Conditional types DISTRIBUTE over unions — wrap in `[T] extends [U]` to
//    prevent when needed.
// ⚠️ `keyof any` = `string | number | symbol` — used in generic key constraints.
// ⚠️ Factory patterns using `ConstructorParameters<T>` need T constrained to
//    `new (...args) => any` first.
// ⚠️ Generic classes with static helpers can't reference class type params —
//    statics have their own generics.
// ⚠️ DI tokens should be `unique symbol` or class references for reliability.
// ⚠️ `Record<string, unknown>` for EventMap is flexible; narrowing needs care.
// ⚠️ Currying types get very complex quickly — prefer simple HOFs.
// ⚠️ Compose chains longer than 3 lose inference quality.
// ⚠️ Inference from return-only generics requires explicit args.

// 🕒 Version notes
// - `infer`: TS 2.8
// - Variadic tuple generics: TS 4.0
// - Template literal + generic key remap: TS 4.1
// - `const T`: TS 5.0
// - `NoInfer<T>`: TS 5.4

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Pattern                    | Tools used                        |
 * ─────────────────────────────────────────────────────────────
 * | Utility types from scratch | mapped, keyof, conditional        |
 * | Data structures            | generic classes                   |
 * | Event emitter              | generic + K extends keyof Events  |
 * | API client                 | generic + indexed access          |
 * | Reducers/store             | generic + discriminated unions    |
 * | Builders                   | generic + `this` return           |
 * | Factory                    | generic + `new (...)` constraint  |
 * | DI                         | generic + token classes           |
 * | Advanced inference         | infer, conditional, distributive  |
 * | Composition                | Pick/Omit/Partial/Readonly + &    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Rebuild utilities once to truly understand them.
 *  - Prefer built-in utilities in real code — they're well-optimized.
 *  - Constrain generics to the MINIMUM needed.
 *  - Prefer `keyof T` + `T[K]` over `any` in generic accessors.
 *  - Use discriminated unions with generics for state.
 *  - Keep recursion shallow in mapped/conditional types.
 *  - Prevent distribution with `[T] extends [U]` when needed.
 *  - Use `const T` to preserve literal inference.
 *  - Use `NoInfer<T>` to control inference direction.
 *  - Avoid generics when a union, overload, or interface will do.
 * ============================================================ */