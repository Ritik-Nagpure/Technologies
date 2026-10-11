// 05_Classes_OOP/23_Mediator_Pattern.ts

/* ============================================================
 *  📘 THE MEDIATOR PATTERN IN TYPESCRIPT
 *
 *  Mediator reduces chaotic dependencies between objects by
 *  forcing them to communicate through a MEDIATOR object
 *  instead of referring to each other directly.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Mediator solves
 *   4. Basic implementation (chat room)
 *   5. Air traffic control example
 *   6. Event-bus mediator (decoupled)
 *   7. Generic typed mediator
 *   8. Real-world use cases
 *   9. Mediator vs Observer vs Facade
 *  10. Pros & cons
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Without Mediator: N objects → up to N × (N-1) direct references.
// Complexity grows quadratically; every object knows every other.
//
// With Mediator: each object only knows the MEDIATOR.
//
//   Without:  A ↔ B ↔ C ↔ D  (many-to-many)
//   With:     A → M ← B
//             C → M ← D      (hub-and-spoke)
//
// The mediator centralizes COMMUNICATION LOGIC, so participants
// stay decoupled and focused on their own concerns.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬────────────────────────────────────────┐
// │ Role                 │ Responsibility                          │
// ├──────────────────────┼────────────────────────────────────────┤
// │ Mediator             │ Interface for communication             │
// │ ConcreteMediator     │ Coordinates colleagues                  │
// │ Colleague            │ Participants; hold a mediator reference │
// │ ConcreteColleague    │ Business logic; talk via mediator       │
// └──────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM MEDIATOR SOLVES
 * ============================================================ */

// WITHOUT Mediator — UI form with 5 fields where each change
// triggers updates in others:
//
//   inputA.onChange(() => { inputB.update(); inputC.validate(); selectD.reset(); })
//   inputB.onChange(() => { inputA.update(); ... })
//   ...N × N coupling...
//
// Adding a new field requires touching every other field.
//
// WITH Mediator — each field only talks to the mediator:
//
//   inputA.onChange(() => mediator.notify("A", value));
//
// The mediator decides what happens next.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — CHAT ROOM
 * ============================================================ */

// ─── Mediator interface ───
interface ChatMediator {
  register(user: ChatUser): void;
  send(message: string, from: ChatUser): void;
  sendDirect(message: string, from: ChatUser, to: string): void;
}

// ─── Colleague ───
class ChatUser {
  constructor(
    public readonly name: string,
    private mediator: ChatMediator
  ) {
    this.mediator.register(this);
  }

  send(message: string): void {
    console.log(`[${this.name}] sends: ${message}`);
    this.mediator.send(message, this);
  }

  sendTo(message: string, recipient: string): void {
    console.log(`[${this.name}] → ${recipient}: ${message}`);
    this.mediator.sendDirect(message, this, recipient);
  }

  receive(message: string, from: ChatUser): void {
    console.log(`  [${this.name}] receives from ${from.name}: ${message}`);
  }
}

// ─── Concrete Mediator ───
class ChatRoom implements ChatMediator {
  private users = new Map<string, ChatUser>();

  register(user: ChatUser): void {
    this.users.set(user.name, user);
  }

  send(message: string, from: ChatUser): void {
    for (const user of this.users.values()) {
      if (user !== from) user.receive(message, from);
    }
  }

  sendDirect(message: string, from: ChatUser, to: string): void {
    const target = this.users.get(to);
    if (!target) throw new Error(`User "${to}" not found`);
    target.receive(message, from);
  }
}

// ─── Client ───
const room = new ChatRoom();
const alice = new ChatUser("Alice", room);
const bob = new ChatUser("Bob", room);
const carol = new ChatUser("Carol", room);

alice.send("Hello everyone!");
// [Alice] sends: Hello everyone!
//   [Bob] receives from Alice: Hello everyone!
//   [Carol] receives from Alice: Hello everyone!

bob.sendTo("Hi Alice!", "Alice");
// [Bob] → Alice: Hi Alice!
//   [Alice] receives from Bob: Hi Alice!

// 🧠 Users don't hold references to each other — only to the mediator.

/* ============================================================
 *  5️⃣ AIR TRAFFIC CONTROL EXAMPLE
 * ============================================================ */

interface AirTrafficControl {
  requestLanding(flight: Flight): boolean;
  requestTakeoff(flight: Flight): boolean;
  notifyLanded(flight: Flight): void;
  notifyTakenOff(flight: Flight): void;
}

class Flight {
  constructor(
    public readonly id: string,
    private atc: AirTrafficControl
  ) {}

  land(): void {
    if (this.atc.requestLanding(this)) {
      console.log(`✈️  ${this.id} is landing...`);
      this.atc.notifyLanded(this);
    } else {
      console.log(`⛔ ${this.id} denied landing (runway busy)`);
    }
  }

  takeOff(): void {
    if (this.atc.requestTakeoff(this)) {
      console.log(`✈️  ${this.id} is taking off...`);
      this.atc.notifyTakenOff(this);
    } else {
      console.log(`⛔ ${this.id} denied takeoff (runway busy)`);
    }
  }
}

class ControlTower implements AirTrafficControl {
  private runwayBusy = false;
  private queue: Flight[] = [];

  requestLanding(flight: Flight): boolean {
    if (this.runwayBusy) {
      this.queue.push(flight);
      return false;
    }
    this.runwayBusy = true;
    return true;
  }

  requestTakeoff(flight: Flight): boolean {
    if (this.runwayBusy) {
      this.queue.push(flight);
      return false;
    }
    this.runwayBusy = true;
    return true;
  }

  notifyLanded(): void { this.freeRunway(); }
  notifyTakenOff(): void { this.freeRunway(); }

  private freeRunway(): void {
    this.runwayBusy = false;
    const next = this.queue.shift();
    if (next) {
      console.log(`→ Tower grants next clearance to ${next.id}`);
    }
  }
}

// ─── Client ───
const tower = new ControlTower();
const f1 = new Flight("AI-101", tower);
const f2 = new Flight("BA-202", tower);

f1.land();
f2.land();      // denied — queued
f1.takeOff();   // frees runway; grants next

/* ============================================================
 *  6️⃣ EVENT-BUS MEDIATOR (DECOUPLED)
 * ============================================================ */

// The modern, fully decoupled form: colleagues don't even know
// the mediator interface — they publish/subscribe by event name.

type Handler<T> = (payload: T) => void;

class EventBus {
  private handlers = new Map<string, Set<Handler<any>>>();

  on<T>(event: string, handler: Handler<T>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler);
    return () => set!.delete(handler);   // unsubscribe
  }

  emit<T>(event: string, payload: T): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of set) {
      handler(payload);
    }
  }
}

// ─── Colleagues — completely unaware of each other ───
class Logger {
  constructor(bus: EventBus) {
    bus.on<{ userId: string }>("user:login", (p) => {
      console.log(`[log] user logged in: ${p.userId}`);
    });
  }
}

class Analytics {
  constructor(bus: EventBus) {
    bus.on<{ userId: string }>("user:login", (p) => {
      console.log(`[analytics] tracked login for ${p.userId}`);
    });
  }
}

class Mailer {
  constructor(bus: EventBus) {
    bus.on<{ userId: string }>("user:login", (p) => {
      console.log(`[mailer] welcome email sent to ${p.userId}`);
    });
  }
}

class AuthService {
  constructor(private bus: EventBus) {}
  login(userId: string): void {
    console.log(`[auth] login successful: ${userId}`);
    this.bus.emit("user:login", { userId });
  }
}

// ─── Client ───
const bus = new EventBus();
new Logger(bus);
new Analytics(bus);
new Mailer(bus);

const auth = new AuthService(bus);
auth.login("u-42");
// [auth] login successful: u-42
// [log] user logged in: u-42
// [analytics] tracked login for u-42
// [mailer] welcome email sent to u-42

// 🧠 AuthService only knows the event name and the bus — nothing else.

/* ============================================================
 *  7️⃣ GENERIC TYPED MEDIATOR
 * ============================================================ */

// A fully typed event bus — event name → payload type safety.

type EventMap = Record<string, unknown>;

class TypedMediator<Events extends EventMap> {
  private handlers: {
    [K in keyof Events]?: Set<Handler<Events[K]>>
  } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    let set = this.handlers[event];
    if (!set) {
      set = new Set();
      this.handlers[event] = set as any;
    }
    set.add(handler);
    return () => set!.delete(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const set = this.handlers[event];
    if (!set) return;
    for (const handler of set) handler(payload);
  }
}

// ─── Typed usage ───
type AppEvents = {
  "user:login": { userId: string };
  "user:logout": { userId: string };
  "cart:add": { productId: string; qty: number };
};

const mediator = new TypedMediator<AppEvents>();

mediator.on("user:login", (p) => {
  console.log(p.userId);        // ✅ typed as string
});

mediator.on("cart:add", (p) => {
  console.log(p.productId, p.qty);   // ✅ typed
});

mediator.emit("user:login", { userId: "u-1" });     // ✅
// mediator.emit("user:login", { qty: 1 });         // ❌ wrong payload
// mediator.emit("nope", {});                        // ❌ unknown event

/* ============================================================
 *  8️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Chat rooms / messaging hubs
// - Air traffic control systems
// - UI form widgets coordinating via a form controller
// - Event buses (frontend + backend)
// - Workflow orchestration (steps communicating via a coordinator)
// - Microservice request aggregator
// - Game event systems (player, enemies, environment)
// - Dialog/dialogue systems between multiple NPCs
// - Component communication in frameworks (Vue 2 event bus, Redux)
// - Mediator pattern in RxJS Subjects
//
// Frameworks / libraries using mediator-like ideas:
//   - Redux (store as a central mediator of actions)
//   - Vuex / Pinia (central store)
//   - RxJS Subject / BehaviorSubject
//   - Vue 2's event bus
//   - Socket.IO rooms
//   - Kubernetes apiserver (mediation between controllers)

/* ============================================================
 *  9️⃣ MEDIATOR vs OBSERVER vs FACADE
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                          │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Mediator     │ CENTRALIZED coordination of colleagues        │
// │ Observer     │ ONE publisher → MANY subscribers (1:N)        │
// │ Facade       │ SIMPLIFY a subsystem (no coordination)        │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 Mediator is often IMPLEMENTED with Observer — colleagues
//    subscribe to the mediator. Mediator = coordination policy;
//    Observer = notification mechanism.
//    Facade = simplify; Mediator = coordinate.

/* ============================================================
 *  1️⃣0️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Reduces coupling between colleagues (many-to-many → hub)
//  - Centralizes communication logic — easier to reason about
//  - Colleagues become reusable — they don't know each other
//  - Follows Single Responsibility: coordination lives in mediator
//  - Follows Open/Closed: add colleagues without editing others
//  - Enables event-driven architectures naturally
//
// ❌ Cons
//  - The mediator can become a "god object" if it does too much
//  - A single point of failure — if the mediator dies, everything stops
//  - Adds an indirection layer (harder to trace call flows)
//  - Debugging asynchronous event chains gets tricky
//  - Potential for circular notifications if not disciplined

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ The mediator MUST NOT grow unbounded — split into multiple
//     mediators when it starts handling too many concerns.
// ⚠️ Watch for CIRCULAR events (A → mediator → B → mediator → A).
//     Add guards or reentrancy limits.
// ⚠️ Unsubscribe! In event-bus style mediators, forgotten handlers
//     leak memory. Always return an unsubscribe function.
// ⚠️ Typed mediators scale: use a generic `EventMap` for safety.
//     Losing type safety here is the biggest long-term cost.
// ⚠️ Order of handlers matters — Set preserves insertion order, but
//     document it explicitly if behavior depends on it.
// ⚠️ Errors in one handler can break the loop for others. Decide
//     whether the mediator isolates errors per handler.
// ⚠️ Async handlers: decide if `emit` is fire-and-forget or awaits.
//     Awaiting all handlers requires returning `Promise[]`.
// ⚠️ Do NOT use a mediator to hide what should be a direct call —
//     premature decoupling adds indirection with no benefit.
// ⚠️ Under strict mode, avoid `any` in handler maps — use generics
//     + `keyof Events` to keep types precise.
// ⚠️ The `Set` iteration during mutation is undefined behavior if
//     a handler unsubscribes itself — snapshot if needed.
// ⚠️ Beware of `this` binding when storing methods as handlers —
//     use arrow functions or `.bind(this)`.

// 🕒 Version notes
// - Mediator pattern: GoF, 1994
// - Map / Set: ES2015 / TS 2.0
// - Generics with mapped types for EventMap: TS 2.1+
// - Template literal event names + `keyof Events`: TS 4.1+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role               │ Notes                                    │
 * ─────────────────────────────────────────────────────────────
 * | Mediator           │ Interface for communication              │
 * | ConcreteMediator   │ Coordinates colleagues                   │
 * | Colleague          │ Participant; holds mediator reference    │
 * | ConcreteColleague  │ Business logic; talks via mediator       │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                  │ Notes                                   │
 * ─────────────────────────────────────────────────────────────
 * | Direct mediator       │ Colleagues call mediator methods        │
 * | Event bus             │ Publish/subscribe by event name         │
 * | Typed mediator        │ Generic EventMap for type safety        │
 * | Async mediator        │ `emit` returns Promise / awaits handlers│
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer a TYPED mediator (EventMap generics) for compile safety.
 *  - Always return an unsubscribe function from `on()`.
 *  - Guard against circular events (A → M → B → M → A).
 *  - Split into multiple mediators when concerns diverge.
 *  - Keep the mediator SMALL — coordination only, no business logic.
 *  - Decide error handling: isolate per-handler or fail fast.
 *  - Decide sync vs async emit — document the contract.
 *  - Avoid `any` in handler maps — use `keyof Events`.
 *  - Don't overuse — direct calls are fine when coupling is natural.
 *  - Remember: Mediator = coordination; Observer = notification;
 *    Facade = simplification.
 * ============================================================ */