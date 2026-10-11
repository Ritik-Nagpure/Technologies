// 05_Classes_OOP/27_Observer_Pattern.ts

/* ============================================================
 *  📘 THE OBSERVER PATTERN IN TYPESCRIPT
 *
 *  Observer defines a ONE-TO-MANY dependency: when ONE object
 *  (Subject) changes state, ALL its dependents (Observers) are
 *  notified automatically.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Observer solves
 *   4. Basic implementation (news agency)
 *   5. Push vs pull model
 *   6. Generic typed subject
 *   7. Event-emitter style (string events)
 *   8. Unsubscribe & memory safety
 *   9. Observer with RxJS-like operators
 *  10. Real-world use cases
 *  11. Observer vs Mediator vs Pub/Sub
 *  12. Pros & cons
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Subject holds a LIST of observers. When its state changes, it
// calls `notify()` which loops over observers and calls their
// `update()` method.
//
//   Subject ──notify──▶ Observer1
//          ──notify──▶ Observer2
//          ──notify──▶ Observer3
//
// The Subject doesn't know what observers DO — it only knows
// they have an `update` method. Observers subscribe/unsubscribe
// at runtime.
//
// This is the backbone of event-driven programming in JS/TS.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌────────────────────┬────────────────────────────────────────┐
// │ Role               │ Responsibility                          │
// ├────────────────────┼────────────────────────────────────────┤
// │ Subject            │ Maintains list of observers; notifies   │
// │ ConcreteSubject    │ Holds state; triggers notifications     │
// │ Observer           │ Interface with `update()`               │
// │ ConcreteObserver   │ Reacts to notifications                 │
// │ Client             │ Wires observers to subjects             │
// └────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM OBSERVER SOLVES
 * ============================================================ */

// WITHOUT Observer — a stock ticker needs to update a chart, a
// logger, and a mobile notifier. If the ticker knows them all:
//
//   class StockTicker {
//     price = 0;
//     setPrice(p: number) {
//       this.price = p;
//       chart.update(p);
//       logger.log(p);
//       notifier.push(p);
//     }
//   }
//
// Every new consumer = editing StockTicker. Coupling explodes.
//
// WITH Observer:
//
//   ticker.subscribe(chart);
//   ticker.subscribe(logger);
//   ticker.subscribe(notifier);
//   ticker.setPrice(150);   // all get notified
//
// Adding/removing consumers = subscribe/unsubscribe.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — NEWS AGENCY
 * ============================================================ */

// ─── Observer interface ───
interface Observer<T> {
  update(data: T): void;
}

// ─── Subject interface ───
interface Subject<T> {
  subscribe(observer: Observer<T>): () => void;   // returns unsubscribe
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

// ─── Concrete Subject ───
class NewsAgency implements Subject<string> {
  private observers: Set<Observer<string>> = new Set();
  private latest = "";

  subscribe(observer: Observer<string>): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);   // unsubscribe handle
  }

  unsubscribe(observer: Observer<string>): void {
    this.observers.delete(observer);
  }

  notify(news: string): void {
    for (const obs of this.observers) {
      obs.update(news);
    }
  }

  // Business method that triggers notification
  publish(news: string): void {
    this.latest = news;
    console.log(`📰 News published: ${news}`);
    this.notify(news);
  }

  getLatest(): string { return this.latest; }
}

// ─── Concrete Observers ───
class TVChannel implements Observer<string> {
  constructor(private name: string) {}
  update(news: string): void {
    console.log(`📺 [${this.name}] breaking: ${news}`);
  }
}

class Newspaper implements Observer<string> {
  constructor(private name: string) {}
  update(news: string): void {
    console.log(`📄 [${this.name}] printing: ${news}`);
  }
}

class Blogger implements Observer<string> {
  constructor(private handle: string) {}
  update(news: string): void {
    console.log(`✍️  @${this.handle} posts about: ${news}`);
  }
}

// ─── Client ───
const agency = new NewsAgency();
const cnn = new TVChannel("CNN");
const times = new Newspaper("The Times");
const blog = new Blogger("techguru");

agency.subscribe(cnn);
agency.subscribe(times);
agency.subscribe(blog);

agency.publish("TypeScript 6.0 released!");
// 📰 News published: TypeScript 6.0 released!
// 📺 [CNN] breaking: TypeScript 6.0 released!
// 📄 [The Times] printing: TypeScript 6.0 released!
// ✍️  @techguru posts about: TypeScript 6.0 released!

const unsubBlog = agency.subscribe(blog);   // add again — Set dedupes
unsubBlog();                                 // but this only removes once

/* ============================================================
 *  5️⃣ PUSH vs PULL MODEL
 * ============================================================ */

// 🔸 PUSH — Subject sends DATA to observers.
//    Simpler for small payloads; observers can't choose what they get.

// 🔸 PULL — Subject sends a REFERENCE; observers pull what they need.
//    Better when only some observers care about specific parts.

interface PullObserver<T> {
  update(subject: PullSubject<T>): void;
}

interface PullSubject<T> {
  subscribe(o: PullObserver<T>): () => void;
  getState(): T;
  notify(): void;
}

class StockTicker implements PullSubject<{ symbol: string; price: number }> {
  private observers = new Set<PullObserver<{ symbol: string; price: number }>>();
  private state = { symbol: "TSLA", price: 0 };

  subscribe(o: PullObserver<{ symbol: string; price: number }>): () => void {
    this.observers.add(o);
    return () => this.observers.delete(o);
  }

  getState() { return this.state; }

  notify(): void {
    for (const o of this.observers) o.update(this);
  }

  setPrice(price: number): void {
    this.state = { ...this.state, price };
    this.notify();
  }
}

class PriceChart implements PullObserver<{ symbol: string; price: number }> {
  update(subject: PullSubject<{ symbol: string; price: number }>): void {
    const { symbol, price } = subject.getState();     // pull
    console.log(`📈 Chart: ${symbol} = $${price}`);
  }
}

const ticker = new StockTicker();
ticker.subscribe(new PriceChart());
ticker.setPrice(250);
// 📈 Chart: TSLA = $250

/* ============================================================
 *  6️⃣ GENERIC TYPED SUBJECT
 * ============================================================ */

// A reusable, type-safe subject — no `any` leaks.

class TypedSubject<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  emit(data: T): void {
    for (const obs of this.observers) obs.update(data);
  }

  clear(): void { this.observers.clear(); }
  size(): number { return this.observers.size; }
}

// ─── Usage ───
type UserEvent = { id: string; name: string; at: Date };

const userSubject = new TypedSubject<UserEvent>();

const logger: Observer<UserEvent> = {
  update(e) { console.log(`[log] ${e.name} (${e.id})`); },
};

const welcome: Observer<UserEvent> = {
  update(e) { console.log(`[welcome] Hi ${e.name}!`); },
};

userSubject.subscribe(logger);
userSubject.subscribe(welcome);
userSubject.emit({ id: "u1", name: "Ravi", at: new Date() });

/* ============================================================
 *  7️⃣ EVENT-EMITTER STYLE (STRING EVENTS)
 * ============================================================ */

// Modern, DOM-like: subscribe to NAMED events rather than all updates.

type Listener<T> = (payload: T) => void;

class EventEmitter<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>): () => void {
    let set = this.listeners[event];
    if (!set) {
      set = new Set();
      this.listeners[event] = set as Set<Listener<Events[K]>>;
    }
    set.add(fn);
    return () => set!.delete(fn);
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>): void {
    this.listeners[event]?.delete(fn);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const set = this.listeners[event];
    if (!set) return;
    for (const fn of set) fn(payload);
  }

  once<K extends keyof Events>(event: K, fn: Listener<Events[K]>): void {
    const unsub = this.on(event, (p) => {
      unsub();
      fn(p);
    });
  }
}

// ─── Usage ───
type AppEvents = {
  login: { userId: string };
  logout: { userId: string };
  cartAdd: { productId: string; qty: number };
};

const bus = new EventEmitter<AppEvents>();

bus.on("login", (p) => console.log(`login: ${p.userId}`));       // ✅ typed
bus.once("cartAdd", (p) => console.log(`added ${p.qty}`));        // fires once

bus.emit("login", { userId: "u1" });
bus.emit("cartAdd", { productId: "p1", qty: 2 });
bus.emit("cartAdd", { productId: "p2", qty: 1 });                 // once — no output

// bus.emit("login", { wrong: 1 });   // ❌ wrong payload
// bus.emit("unknown", {});           // ❌ unknown event

/* ============================================================
 *  8️⃣ UNSUBSCRIBE & MEMORY SAFETY
 * ============================================================ */

// ⚠️ Forgotten subscriptions leak memory. Always return an unsubscribe
//    function and call it when the observer no longer cares.

class Chart {
  private unsub: () => void;

  constructor(private subject: TypedSubject<number>) {
    // Save the unsubscribe handle so we can call it later
    this.unsub = subject.subscribe({ update: (n) => console.log(`chart: ${n}`) });
  }

  dispose(): void { this.unsub(); }
}

// 🔸 Auto-unsubscribe on GC via WeakRef (advanced)
//    A common pattern for DOM subscriptions is to keep a WeakMap.

// 🔸 "Once" listener — auto-remove after first call
class Subject2<T> {
  private observers = new Set<Observer<T>>();

  subscribeOnce(observer: Observer<T>): void {
    const wrapper: Observer<T> = {
      update: (data) => {
        this.observers.delete(wrapper);
        observer.update(data);
      },
    };
    this.observers.add(wrapper);
  }
}

/* ============================================================
 *  9️⃣ OBSERVER WITH RXJS-LIKE OPERATORS
 * ============================================================ */

// A minimal RxJS-inspired observable — demonstrates how operators
// like map/filter compose on top of Observer.

type Subscriber<T> = (value: T) => void;

class Observable<T> {
  constructor(private producer: (sub: Subscriber<T>) => () => void) {}

  subscribe(sub: Subscriber<T>): () => void {
    return this.producer(sub);
  }

  map<U>(fn: (v: T) => U): Observable<U> {
    return new Observable<U>((sub) => {
      return this.subscribe((v) => sub(fn(v)));
    });
  }

  filter(pred: (v: T) => boolean): Observable<T> {
    return new Observable<T>((sub) => {
      return this.subscribe((v) => { if (pred(v)) sub(v); });
    });
  }
}

// ─── Usage ───
const source = new Observable<number>((sub) => {
  let i = 0;
  const id = setInterval(() => sub(i++), 20);
  return () => clearInterval(id);         // teardown
});

const unsub = source
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .subscribe((v) => console.log(v));      // 0, 20, 40, ...

setTimeout(unsub, 110);                   // stop after ~5 emissions

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - UI state management (React state, Redux subscriptions)
// - DOM events (addEventListener = observer pattern)
// - Reactive programming (RxJS, MobX, Vue reactivity)
// - Pub/Sub messaging systems (Kafka, Redis Pub/Sub, RabbitMQ)
// - Node.js EventEmitter
// - WebSocket / SSE streams
// - Real-time dashboards (live data feeds)
// - Model-View-Controller (Model notifies Views)
// - Configuration change watchers
// - Plugin systems (plugins subscribe to lifecycle events)
// - Testing frameworks (jest.fn() spies)
//
// Frameworks / libraries:
//   - RxJS Observables
//   - Node.js `EventEmitter`
//   - Vue 3 reactivity (`watchEffect`)
//   - Redux `store.subscribe`
//   - MobX `autorun`
//   - Angular EventEmitter
//   - Socket.IO
//   - Firebase Realtime DB `onValue`

/* ============================================================
 *  1️⃣1️⃣ OBSERVER vs MEDIATOR vs PUB/SUB
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                          │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Observer     │ Subject KNOWS its observers (direct list)     │
// │ Pub/Sub      │ Broker in between — publishers don't know subs│
// │ Mediator     │ Centralizes COMMUNICATION between colleagues  │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 Observer: subject.notify() loops over subscribers.
//    Pub/Sub: broker.emit("event", data) — decoupled entirely.
//    Mediator: coordinates COMPLEX interactions; often uses Observer.

/* ============================================================
 *  1️⃣2️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Decouples subject from its observers
//  - Add/remove observers at runtime
//  - Open/Closed — new observers don't touch the subject
//  - Natural fit for event-driven architectures
//  - Works with push or pull models
//  - Foundation for reactive programming
//
// ❌ Cons
//  - Memory leaks if observers forget to unsubscribe
//  - Order of notification is not guaranteed (unless documented)
//  - Errors in one observer can break the loop (unless isolated)
//  - Debugging async event chains is tricky
//  - Can hide complexity — "who's listening?" becomes hard to answer
//  - Subject can become a bottleneck for high-frequency events

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ ALWAYS return an unsubscribe handle — otherwise subscriptions leak.
// ⚠️ Snapshot the observer set before notifying if observers may
//     subscribe/unsubscribe during notification.
// ⚠️ Isolate errors per-observer (try/catch around each `update`) so
//     one faulty observer doesn't stop others.
// ⚠️ Document whether notification is SYNC or ASYNC.
// ⚠️ For high-frequency events, consider debouncing or batching.
// ⚠️ `Set` preserves insertion order — rely on it for deterministic
//     delivery, but document it.
// ⚠️ Avoid `Set<Observer>` if you need identity-based lookup by
//     name — use a `Map<string, Observer>` instead.
// ⚠️ Under strict mode, type `Events` generically with `keyof Events`
//     so payloads are precise.
// ⚠️ Watch for reentrancy: an observer that triggers another emit
//     can cause infinite loops — add a guard or use a queue.
// ⚠️ Don't confuse with Pub/Sub — if a broker sits between emitters
//     and listeners, call it Pub/Sub.
// ⚠️ For DOM listeners, use `AbortController` + `{ signal }` to
//     auto-unsubscribe.

// 🕒 Version notes
// - Observer pattern: GoF, 1994
// - `Set` / `Map`: ES2015 / TS 2.0
// - `Object.freeze` for immutable mementos (sibling pattern): TS 2.1+
// - `AbortController` for DOM cleanup: ES2018 / TS 2.6+
// - RxJS operators: RxJS 5+, TS 2.x+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role              │ Notes                                     │
 * ─────────────────────────────────────────────────────────────
 * | Subject           │ Holds observers; calls notify             │
 * | ConcreteSubject   │ Holds state; triggers notifications       │
 * | Observer          │ `update(data)` interface                  │
 * | ConcreteObserver  │ Reacts to updates                         │
 * | Client            │ Wires subscriptions                       │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                    │ When to prefer                       │
 * ─────────────────────────────────────────────────────────────
 * | Push (payload)          │ Simple data, small observers         │
 * | Pull (subject ref)      │ Observers pick what they need        │
 * | EventEmitter (named)    │ Multiple event types per subject     │
 * | Observable + operators  │ Composable streams (RxJS-style)      │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Return an unsubscribe function from `subscribe`.
 *  - Snapshot the observer list before notifying.
 *  - Isolate errors per observer (try/catch).
 *  - Document sync vs async notification.
 *  - Use `Set` for dedupe + insertion order.
 *  - Type events generically (`EventEmitter<Events>`).
 *  - Add `once()` for one-shot listeners.
 *  - Consider backpressure for high-frequency sources.
 *  - Use `AbortController` for DOM cleanup.
 *  - Distinguish from Pub/Sub: presence of a broker changes the name.
 * ============================================================ */