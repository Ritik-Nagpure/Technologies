// 05_Classes_OOP/29_State_Pattern.ts

/* ============================================================
 *  📘 THE STATE PATTERN IN TYPESCRIPT
 *
 *  State lets an object ALTER its behavior when its internal
 *  state changes — it appears to change its class.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem State solves
 *   4. Basic implementation (traffic light)
 *   5. State transitions (order workflow)
 *   6. State with context (shared data)
 *   7. Generic typed state machine
 *   8. Functional state (state objects without classes)
 *   9. Real-world use cases
 *  10. State vs Strategy vs Command
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// An object's behavior depends on its STATE, and it must switch
// behavior at runtime. Instead of a big if/switch on `this.state`,
// delegate to a STATE OBJECT that knows how to behave.
//
//   Context → State (interface) ← ConcreteStateA/B/C
//
// The Context holds a reference to the CURRENT state. Each state
// decides what to do AND can transition the context to another state.
//
// Looks similar to Strategy — but intent differs:
//   Strategy: CLIENT chooses the algorithm (external).
//   State:    Object TRANSITIONS itself (internal, event-driven).

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌─────────────────────┬────────────────────────────────────────┐
// │ Role                │ Responsibility                          │
// ├─────────────────────┼────────────────────────────────────────┤
// │ Context             │ Holds the current State                 │
// │ State               │ Interface with `handle()`               │
// │ ConcreteState       │ Implements one state; may transition    │
// │ Client              │ Triggers events; reads the context      │
// └─────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM STATE SOLVES
 * ============================================================ */

// WITHOUT State — an order with statuses grows into a nightmare:
//
//   class Order {
//     status: "new" | "paid" | "shipped" | "delivered" | "cancelled";
//     pay() {
//       if (this.status === "new") this.status = "paid";
//       else if (this.status === "paid") throw new Error("Already paid");
//       else throw new Error("Cannot pay");
//     }
//     ship() {
//       if (this.status === "paid") this.status = "shipped";
//       else if (this.status === "shipped") throw new Error("Already shipped");
//       else throw new Error("Cannot ship");
//     }
//     // ...grows with every new state × every action
//   }
//
// WITH State:
//   Each state is a class implementing the same interface.
//   Adding a state = new class; no edits to existing states.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — TRAFFIC LIGHT
 * ============================================================ */

// ─── State interface ───
interface TrafficLightState {
  readonly name: string;
  go(context: TrafficLight): void;
  stop(context: TrafficLight): void;
  next(context: TrafficLight): void;
  canDrive(): boolean;
}

// ─── Context ───
class TrafficLight {
  private state: TrafficLightState;

  constructor(initial: TrafficLightState) {
    this.state = initial;
  }

  setState(state: TrafficLightState): void {
    console.log(`🚦 ${this.state.name} → ${state.name}`);
    this.state = state;
  }

  getStateName(): string { return this.state.name; }
  canDrive(): boolean { return this.state.canDrive(); }

  // Delegate to current state
  go(): void { this.state.go(this); }
  stop(): void { this.state.stop(this); }
  next(): void { this.state.next(this); }
}

// ─── Concrete States ───
class RedState implements TrafficLightState {
  readonly name = "RED";
  go(_c: TrafficLight): void { console.log("⛔ Can't go on red"); }
  stop(_c: TrafficLight): void { console.log("Already stopped"); }
  next(c: TrafficLight): void { c.setState(new GreenState()); }
  canDrive(): boolean { return false; }
}

class YellowState implements TrafficLightState {
  readonly name = "YELLOW";
  go(_c: TrafficLight): void { console.log("⚠️  Slow down"); }
  stop(_c: TrafficLight): void { console.log("Stopping"); }
  next(c: TrafficLight): void { c.setState(new RedState()); }
  canDrive(): boolean { return false; }
}

class GreenState implements TrafficLightState {
  readonly name = "GREEN";
  go(_c: TrafficLight): void { console.log("✅ Go!"); }
  stop(_c: TrafficLight): void { console.log("Stopping now"); }
  next(c: TrafficLight): void { c.setState(new YellowState()); }
  canDrive(): boolean { return true; }
}

// ─── Client ───
const light = new TrafficLight(new RedState());
console.log(light.getStateName(), light.canDrive());   // RED false

light.next();                                          // RED → GREEN
console.log(light.getStateName(), light.canDrive());   // GREEN true

light.go();                                            // ✅ Go!
light.next();                                          // GREEN → YELLOW
light.next();                                          // YELLOW → RED

// 🧠 Each state KNOWS what comes next — the transitions live in the states.

/* ============================================================
 *  5️⃣ STATE TRANSITIONS — ORDER WORKFLOW
 * ============================================================ */

// A more realistic example: order lifecycle.

interface OrderState {
  readonly name: string;
  pay(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
}

class Order {
  private state: OrderState;
  total = 0;
  isPaid = false;
  isShipped = false;
  isCancelled = false;

  constructor(initial: OrderState) { this.state = initial; }

  setState(s: OrderState): void {
    console.log(`[order] ${this.state.name} → ${s.name}`);
    this.state = s;
  }
  getStateName(): string { return this.state.name; }

  pay(): void { this.state.pay(this); }
  ship(): void { this.state.ship(this); }
  deliver(): void { this.state.deliver(this); }
  cancel(): void { this.state.cancel(this); }
}

// ─── Concrete States ───
class NewOrder implements OrderState {
  readonly name = "NEW";
  pay(o: Order): void {
    o.isPaid = true;
    console.log("💰 Payment received");
    o.setState(new PaidOrder());
  }
  ship(_o: Order): void { console.log("❌ Cannot ship unpaid order"); }
  deliver(_o: Order): void { console.log("❌ Not shipped yet"); }
  cancel(o: Order): void {
    o.isCancelled = true;
    console.log("🗑️  Order cancelled");
    o.setState(new CancelledOrder());
  }
}

class PaidOrder implements OrderState {
  readonly name = "PAID";
  pay(_o: Order): void { console.log("❌ Already paid"); }
  ship(o: Order): void {
    o.isShipped = true;
    console.log("📦 Order shipped");
    o.setState(new ShippedOrder());
  }
  deliver(_o: Order): void { console.log("❌ Not shipped yet"); }
  cancel(o: Order): void {
    o.isCancelled = true;
    console.log("↩️  Refund issued, order cancelled");
    o.setState(new CancelledOrder());
  }
}

class ShippedOrder implements OrderState {
  readonly name = "SHIPPED";
  pay(_o: Order): void { console.log("❌ Already paid"); }
  ship(_o: Order): void { console.log("❌ Already shipped"); }
  deliver(o: Order): void {
    console.log("📬 Order delivered");
    o.setState(new DeliveredOrder());
  }
  cancel(_o: Order): void { console.log("❌ Cannot cancel shipped order"); }
}

class DeliveredOrder implements OrderState {
  readonly name = "DELIVERED";
  pay(_o: Order): void { console.log("❌ Order complete"); }
  ship(_o: Order): void { console.log("❌ Already delivered"); }
  deliver(_o: Order): void { console.log("❌ Already delivered"); }
  cancel(_o: Order): void { console.log("❌ Cannot cancel delivered order"); }
}

class CancelledOrder implements OrderState {
  readonly name = "CANCELLED";
  pay(_o: Order): void { console.log("❌ Order cancelled"); }
  ship(_o: Order): void { console.log("❌ Order cancelled"); }
  deliver(_o: Order): void { console.log("❌ Order cancelled"); }
  cancel(_o: Order): void { console.log("❌ Already cancelled"); }
}

// ─── Client ───
const order = new Order(new NewOrder());
order.ship();          // ❌ Cannot ship unpaid order
order.pay();           // 💰 Payment received (NEW → PAID)
order.ship();          // 📦 Order shipped (PAID → SHIPPED)
order.cancel();        // ❌ Cannot cancel shipped order
order.deliver();       // 📬 Order delivered (SHIPPED → DELIVERED)

// 🧠 Notice: no if/switch on status. Each state knows its rules.

/* ============================================================
 *  6️⃣ STATE WITH CONTEXT (SHARED DATA)
 * ============================================================ */

// States often need to read/write shared context data — the
// Context object is passed to each handler.

interface PlayerState {
  readonly name: string;
  takeDamage(player: Player, amount: number): void;
  heal(player: Player, amount: number): void;
  update(player: Player, dt: number): void;
}

class Player {
  hp = 100;
  maxHp = 100;
  alive = true;
  private state: PlayerState;

  constructor(initial: PlayerState) { this.state = initial; }

  setState(s: PlayerState): void {
    console.log(`[player] ${this.state.name} → ${s.name}`);
    this.state = s;
  }
  getStateName(): string { return this.state.name; }

  takeDamage(amount: number): void { this.state.takeDamage(this, amount); }
  heal(amount: number): void { this.state.heal(this, amount); }
  update(dt: number): void { this.state.update(this, dt); }
}

class AliveState implements PlayerState {
  readonly name = "ALIVE";
  takeDamage(p: Player, n: number): void {
    p.hp = Math.max(0, p.hp - n);
    console.log(`💥 took ${n} → hp ${p.hp}`);
    if (p.hp === 0) {
      p.alive = false;
      p.setState(new DeadState());
    }
  }
  heal(p: Player, n: number): void {
    p.hp = Math.min(p.maxHp, p.hp + n);
    console.log(`💚 healed ${n} → hp ${p.hp}`);
  }
  update(_p: Player, _dt: number): void { /* normal tick */ }
}

class DeadState implements PlayerState {
  readonly name = "DEAD";
  takeDamage(_p: Player, _n: number): void { console.log("❌ already dead"); }
  heal(p: Player, n: number): void {
    p.hp = n;
    p.alive = true;
    console.log(`🔄 revived with ${n} hp`);
    p.setState(new AliveState());
  }
  update(_p: Player, _dt: number): void { /* skip normal tick */ }
}

const player = new Player(new AliveState());
player.takeDamage(60);   // hp 40
player.takeDamage(60);   // hp 0 → dead
player.heal(50);         // revived with 50 hp

/* ============================================================
 *  7️⃣ GENERIC TYPED STATE MACHINE
 * ============================================================ */

// A generic state machine typed by state names, events, and
// context data. Robust and type-safe.

type TransitionTable<S extends string, E extends string, Ctx> = {
  [K in S]: {
    on: Partial<{
      [Ev in E]: {
        to: S;
        action?: (ctx: Ctx) => void;
      };
    }>;
  };
};

class StateMachine<S extends string, E extends string, Ctx> {
  private current: S;

  constructor(
    initial: S,
    private table: TransitionTable<S, E, Ctx>,
    private ctx: Ctx
  ) {
    this.current = initial;
  }

  getState(): S { return this.current; }

  can(event: E): boolean {
    const stateDef = this.table[this.current];
    return Boolean(stateDef.on[event]);
  }

  send(event: E): boolean {
    const stateDef = this.table[this.current];
    const transition = stateDef.on[event];
    if (!transition) {
      console.log(`❌ [${this.current}] cannot handle "${event}"`);
      return false;
    }
    console.log(`→ [${this.current}] "${event}" → [${transition.to}]`);
    transition.action?.(this.ctx);
    this.current = transition.to;
    return true;
  }
}

// ─── Usage: a document lifecycle ───
type DocState = "draft" | "review" | "published" | "archived";
type DocEvent = "submit" | "approve" | "reject" | "archive" | "unarchive";

type DocCtx = { reviewedBy?: string; publishedAt?: Date };

const docTable: TransitionTable<DocState, DocEvent, DocCtx> = {
  draft: {
    on: {
      submit: { to: "review" },
      archive: { to: "archived" },
    },
  },
  review: {
    on: {
      approve: {
        to: "published",
        action: (ctx) => { ctx.publishedAt = new Date(); },
      },
      reject: { to: "draft" },
    },
  },
  published: {
    on: {
      archive: { to: "archived" },
    },
  },
  archived: {
    on: {
      unarchive: { to: "draft" },
    },
  },
};

const docMachine = new StateMachine<DocState, DocEvent, DocCtx>(
  "draft",
  docTable,
  {}
);

docMachine.send("submit");    // draft → review
docMachine.send("approve");   // review → published
docMachine.send("archive");   // published → archived
docMachine.send("submit");    // ❌ archived can't "submit"

/* ============================================================
 *  8️⃣ FUNCTIONAL STATE (STATE OBJECTS WITHOUT CLASSES)
 * ============================================================ */

// Modern TS often uses discriminated unions + switch, or plain
// objects with function fields — lighter than classes.

// 🔸 Discriminated union approach
type StateUnion =
  | { kind: "idle" }
  | { kind: "loading"; progress: number }
  | { kind: "success"; data: string }
  | { kind: "error"; message: string };

function describe(s: StateUnion): string {
  switch (s.kind) {
    case "idle":     return "Waiting";
    case "loading":  return `Loading ${s.progress}%`;
    case "success":  return `Loaded: ${s.data}`;
    case "error":    return `Error: ${s.message}`;
  }
}

console.log(describe({ kind: "loading", progress: 42 }));

// 🔸 Function-field state — like a "fluent" state object
type FnState = {
  name: string;
  next(): FnState;
  describe(): string;
};

function createRedState(): FnState {
  return {
    name: "RED",
    next: createGreenState,
    describe: () => "⛔ stop",
  };
}
function createGreenState(): FnState {
  return {
    name: "GREEN",
    next: createYellowState,
    describe: () => "✅ go",
  };
}
function createYellowState(): FnState {
  return {
    name: "YELLOW",
    next: createRedState,
    describe: () => "⚠️  slow",
  };
}

let s: FnState = createRedState();
for (let i = 0; i < 3; i++) {
  console.log(s.name, s.describe());
  s = s.next();
}

// 🧠 Function-field state = state pattern without classes.

/* ============================================================
 *  9️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Order workflows (new → paid → shipped → delivered)
// - Document lifecycles (draft → review → published → archived)
// - Game character states (idle → walking → jumping → dead)
// - Media players (playing / paused / stopped / buffering)
// - Connection states (disconnected → connecting → connected)
// - Form wizards (step1 → step2 → step3 → complete)
// - Traffic lights, vending machines, elevators
// - Authentication flows (logged-out → logging-in → logged-in)
// - UI component states (loading / success / error / empty)
// - Workflow engines / state machines (XState)
//
// Frameworks / libraries using State:
//   - XState (formal state machines)
//   - React `useReducer` (implicit state machine)
//   - Redux (state transitions via reducers)
//   - Angular component states (loading/error)
//   - Node.js streams (readable/writable states)

/* ============================================================
 *  1️⃣0️⃣ STATE vs STRATEGY vs COMMAND
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                          │
// ├──────────────┼──────────────────────────────────────────────┤
// │ State        │ Object TRANSITIONS itself; internal events    │
// │ Strategy     │ CLIENT picks the algorithm; external choice   │
// │ Command      │ Encapsulates an ACTION; queue/undo friendly   │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 State and Strategy look the same structurally. The intent differs:
//    - State: the object's OWN behavior changes based on internal state.
//    - Strategy: an external algorithm is plugged in.
//
//    In State, transitions are internal.
//    In Strategy, the client decides which strategy to use.
//
//    Command focuses on "what to DO" — often for undo/queue.
//    State focuses on "how to BEHAVE NOW" — driven by state.

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Removes massive if/switch blocks
//  - Follows Open/Closed: add states without editing others
//  - Follows Single Responsibility: one state per class
//  - Transitions and rules are explicit and testable
//  - Great fit for state machines and workflows
//  - Each state's behavior is isolated — easy to reason about
//
// ❌ Cons
//  - More classes / objects than a simple switch
//  - Circular dependencies if states import each other
//  - Transition logic can scatter across state classes
//  - Not great for VERY simple state (2-3 states, 1 event)
//  - Debugging can be harder — state changes are implicit

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ State classes should be STATELESS whenever possible — the
//     CONTEXT holds the data.
// ⚠️ Beware of TRANSITION TABLES spread across many classes — the
//     flow becomes invisible. Consider a table-based state machine.
// ⚠️ Guard against ILLEGAL transitions — throw or log clearly.
//     Silent ignores lead to subtle bugs.
// ⚠️ Under strict mode, use `readonly name` for state labels.
// ⚠️ Circular imports: state A imports state B, B imports A. Use a
//     factory registration OR transition-table approach.
// ⚠️ For many states (10+), prefer a TABLE-DRIVEN state machine
//     over a class per state (see §7).
// ⚠️ For very simple 2–3 state cases, a discriminated union +
//     switch is often cleaner than the full pattern.
// ⚠️ Distinguish from Strategy: State transitions internally;
//     Strategy is chosen externally.
// ⚠️ Async state: prefer async methods on states with clear error paths.
// ⚠️ Serialization: states are often serialized (persisted). Keep
//     state names stable and backward-compatible.
// ⚠️ Formal verification: for critical workflows, use XState or a
//     similar library that validates transitions.

// 🕒 Version notes
// - State pattern: GoF, 1994
// - Discriminated unions: TS 2.0
// - Exhaustive `switch` with `never`: TS 2.0+
// - XState: third-party, TS 3.0+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role              │ Notes                                     │
 * ─────────────────────────────────────────────────────────────
 * | Context           │ Holds the current State                   │
 * | State             │ Interface with state-specific behavior    │
 * | ConcreteState     │ Behavior for one state; may transition    │
 * | Client            │ Triggers events on Context                │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                     │ When to prefer                      │
 * ─────────────────────────────────────────────────────────────
 * | Class per state          │ Many behaviors per state            │
 * | Discriminated union      │ Modern TS; fewer classes; switch    │
 * | Function-field state     │ Closures; light states              │
 * | Transition table         │ Many states/events; data-driven     │
 * | XState-like machine      │ Complex workflows; formal rules     │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Keep states STATELESS — context holds the data.
 *  - Guard illegal transitions explicitly (throw or log).
 *  - Use a transition TABLE for 10+ states.
 *  - Prefer discriminated unions for small state sets (2–4).
 *  - Keep state names SERIALIZABLE and stable.
 *  - Avoid circular imports — use factories or a table.
 *  - Document the transition diagram somewhere.
 *  - Type events generically (`StateMachine<S, E, Ctx>`).
 *  - Distinguish from Strategy: State = internal transitions.
 *  - Consider XState for complex, verifiable workflows.
 * ============================================================ */