// 05_Classes_OOP/28_Command_Pattern.ts

/* ============================================================
 *  📘 THE COMMAND PATTERN IN TYPESCRIPT
 *
 *  Command turns a REQUEST into a standalone OBJECT — allowing
 *  you to parameterize clients, queue requests, log them, and
 *  support undoable operations.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Command solves
 *   4. Basic implementation (smart home)
 *   5. Undo / redo with commands
 *   6. Command queue / scheduler
 *   7. Macro commands (composite)
 *   8. Generic typed command
 *   9. Functional commands (closures)
 *  10. Real-world use cases
 *  11. Command vs Strategy vs Memento vs Observer
 *  12. Pros & cons
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// A command OBJECT bundles:
//   - The RECEIVER (who does the work)
//   - The ACTION (what to do)
//   - Any PARAMETERS (how to do it)
//
//   Client → Command → Receiver
//
// Instead of calling methods directly, the client creates a
// command object and hands it to an Invoker. The Invoker decides
// WHEN to execute — immediately, later, in a queue, after undo.
//
// Benefits:
//   - Decouple sender from receiver
//   - Queue, schedule, log, undo commands
//   - Compose commands into macros
//   - First-class "operations" as data

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌────────────────────┬────────────────────────────────────────┐
// │ Role               │ Responsibility                          │
// ├────────────────────┼────────────────────────────────────────┤
// │ Command            │ Interface: `execute()` (+ optional undo)│
// │ ConcreteCommand    │ Binds receiver + action + params        │
// │ Receiver           │ Knows HOW to perform the action         │
// │ Invoker            │ Triggers commands (queue, history, etc) │
// │ Client             │ Creates commands, configures invoker    │
// └────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM COMMAND SOLVES
 * ============================================================ */

// WITHOUT Command — a smart-home app calls receiver methods directly:
//
//   if (action === "on")  light.on();
//   if (action === "off") light.off();
//   if (action === "dim") light.dim(50);
//
// You can't easily:
//   - Undo the last action
//   - Queue actions
//   - Log what happened
//   - Schedule actions
//   - Compose "turn off all lights + lock doors" as one operation
//
// WITH Command — each action is an object; the invoker manages them:
//
//   invoker.run(new TurnOn(light));
//   invoker.undo();

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — SMART HOME
 * ============================================================ */

// ─── Command interface ───
interface Command {
  execute(): void;
  undo(): void;
  readonly name: string;
}

// ─── Receiver: the "smart" device ───
class Light {
  constructor(public readonly room: string, private isOn = false) {}

  turnOn(): void {
    this.isOn = true;
    console.log(`💡 ${this.room} light ON`);
  }
  turnOff(): void {
    this.isOn = false;
    console.log(`💡 ${this.room} light OFF`);
  }
  state(): boolean { return this.isOn; }
}

// ─── ConcreteCommands ───
class TurnOnLight implements Command {
  readonly name: string;
  constructor(private light: Light) {
    this.name = `TurnOn(${light.room})`;
  }

  execute(): void { this.light.turnOn(); }
  undo(): void { this.light.turnOff(); }
}

class TurnOffLight implements Command {
  readonly name: string;
  constructor(private light: Light) {
    this.name = `TurnOff(${light.room})`;
  }

  execute(): void { this.light.turnOff(); }
  undo(): void { this.light.turnOn(); }
}

// ─── Invoker ───
class RemoteControl {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  press(cmd: Command): void {
    cmd.execute();
    this.history.push(cmd);
    this.redoStack = [];
  }

  undo(): void {
    const cmd = this.history.pop();
    if (!cmd) { console.log("Nothing to undo"); return; }
    console.log(`↶ Undo ${cmd.name}`);
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (!cmd) { console.log("Nothing to redo"); return; }
    console.log(`↷ Redo ${cmd.name}`);
    cmd.execute();
    this.history.push(cmd);
  }

  get historySize(): number { return this.history.length; }
}

// ─── Client ───
const livingRoom = new Light("Living room");
const kitchen = new Light("Kitchen");

const remote = new RemoteControl();
remote.press(new TurnOnLight(livingRoom));
remote.press(new TurnOnLight(kitchen));
remote.press(new TurnOffLight(livingRoom));

remote.undo();          // undo TurnOff(Living room) → light back on
remote.undo();          // undo TurnOn(Kitchen)       → kitchen off
remote.redo();          // redo TurnOn(Kitchen)

// 🧠 The RemoteControl doesn't know about lights — it knows Commands.

/* ============================================================
 *  5️⃣ UNDO / REDO WITH COMMANDS
 * ============================================================ */

// Robust undo/redo needs each command to store enough info to
// reverse its effect. Combining Command + Memento is common.

type DocumentState = { content: string; cursor: number };

class DocumentReceiver {
  state: DocumentState = { content: "", cursor: 0 };

  snapshot(): DocumentState { return { ...this.state }; }
  restore(s: DocumentState): void { this.state = { ...s }; }

  insert(text: string): void {
    const { content, cursor } = this.state;
    this.state = {
      content: content.slice(0, cursor) + text + content.slice(cursor),
      cursor: cursor + text.length,
    };
  }
}

class InsertTextCommand implements Command {
  readonly name: string;
  private before: DocumentState;

  constructor(
    private doc: DocumentReceiver,
    private text: string
  ) {
    this.before = doc.snapshot();       // save BEFORE executing
    this.name = `Insert("${text}")`;
  }

  execute(): void { this.doc.insert(this.text); }
  undo(): void { this.doc.restore(this.before); }   // restore snapshot
}

const doc = new DocumentReceiver();
const editorRemote = new RemoteControl();

editorRemote.press(new InsertTextCommand(doc, "Hello"));
editorRemote.press(new InsertTextCommand(doc, ", world"));
console.log(doc.state);      // { content: "Hello, world", cursor: 12 }

editorRemote.undo();
console.log(doc.state);      // { content: "Hello", cursor: 5 }

editorRemote.redo();
console.log(doc.state);      // { content: "Hello, world", cursor: 12 }

// 🧠 Each command stores what it needs to undo itself.

/* ============================================================
 *  6️⃣ COMMAND QUEUE / SCHEDULER
 * ============================================================ */

// Commands can be QUEUED and executed later — great for jobs,
// UI action batching, or network request orchestration.

class AsyncCommandQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = false;

  enqueue(job: () => Promise<void>): void {
    this.queue.push(job);
    void this.run();
  }

  private async run(): Promise<void> {
    if (this.running) return;
    this.running = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;
      try {
        await job();
      } catch (err) {
        console.error("Command failed:", err);
      }
    }
    this.running = false;
  }

  get size(): number { return this.queue.length; }
}

// ─── Async command ───
class SendEmailCommand implements Command {
  readonly name: string;
  constructor(private to: string, private body: string) {
    this.name = `SendEmail(${to})`;
  }
  async execute(): Promise<void> {
    await new Promise((r) => setTimeout(r, 10));
    console.log(`📧 Sent to ${this.to}: ${this.body}`);
  }
  undo(): void {
    console.log(`(undo) cannot unsend email to ${this.to}`);
  }
}

// ─── Usage ───
const emailQueue = new AsyncCommandQueue();
emailQueue.enqueue(async () => {
  await new SendEmailCommand("a@x.com", "hello").execute();
});
emailQueue.enqueue(async () => {
  await new SendEmailCommand("b@x.com", "hi").execute();
});

/* ============================================================
 *  7️⃣ MACRO COMMANDS (COMPOSITE)
 * ============================================================ */

// A command that runs OTHER commands — a "macro" or "composite".
// This is Command + Composite pattern.

class MacroCommand implements Command {
  readonly name: string;
  private children: Command[];

  constructor(name: string, ...commands: Command[]) {
    this.name = name;
    this.children = [...commands];
  }

  add(cmd: Command): this {
    this.children.push(cmd);
    return this;
  }

  execute(): void {
    console.log(`▶ Macro ${this.name} (${this.children.length} steps)`);
    for (const c of this.children) c.execute();
  }

  undo(): void {
    console.log(`↶ Undo Macro ${this.name}`);
    // Undo in REVERSE order — standard for composite undo
    for (let i = this.children.length - 1; i >= 0; i--) {
      const cmd = this.children[i];
      if (cmd) cmd.undo();
    }
  }
}

// ─── Usage ───
const livingLight = new Light("Living");
const kitchenLight = new Light("Kitchen");
const bedroomLight = new Light("Bedroom");

const goodnightMacro = new MacroCommand(
  "Good Night",
  new TurnOffLight(livingLight),
  new TurnOffLight(kitchenLight),
  new TurnOffLight(bedroomLight)
);

const macroRemote = new RemoteControl();
macroRemote.press(goodnightMacro);
macroRemote.undo();       // undoes all three in reverse order

/* ============================================================
 *  8️⃣ GENERIC TYPED COMMAND
 * ============================================================ */

// A fully typed command interface — the receiver, input, and
// result are all captured generically.

interface Command2<TInput, TResult> {
  readonly name: string;
  execute(input: TInput): TResult;
  undo(input: TInput, result: TResult): void;
}

class CommandBus {
  private history: Array<{
    cmd: Command2<unknown, unknown>;
    input: unknown;
    result: unknown;
  }> = [];

  async execute<I, R>(cmd: Command2<I, R>, input: I): Promise<R> {
    const result = await Promise.resolve(cmd.execute(input));
    this.history.push({
      cmd: cmd as Command2<unknown, unknown>,
      input,
      result,
    });
    return result;
  }

  undoLast(): void {
    const entry = this.history.pop();
    if (!entry) return;
    entry.cmd.undo(entry.input, entry.result);
  }

  get size(): number { return this.history.length; }
}

// ─── Concrete typed command ───
class MultiplyCommand implements Command2<number, number> {
  readonly name = "Multiply";
  constructor(private factor: number) {}
  execute(input: number): number { return input * this.factor; }
  undo(_input: number, _result: number): void {
    console.log("(undo) multiply has no inverse unless factor ≠ 0");
  }
}

const bus = new CommandBus();
(async () => {
  const r = await bus.execute(new MultiplyCommand(3), 5);
  console.log(r);            // 15
  bus.undoLast();
})();

/* ============================================================
 *  9️⃣ FUNCTIONAL COMMANDS (CLOSURES)
 * ============================================================ */

// In JS/TS, a command is often just a closure. This is lighter
// than classes when you don't need receiver + parameters exposed.

type FnCommand = { run(): void; undo(): void; name: string };

// ─── Factory for a "type text" command ───
function makeInsertText(doc: DocumentReceiver, text: string): FnCommand {
  const before = doc.snapshot();
  return {
    name: `Insert("${text}")`,
    run() { doc.insert(text); },
    undo() { doc.restore(before); },
  };
}

// ─── Invoker that works with functional commands ───
class FnInvoker {
  private stack: FnCommand[] = [];

  run(cmd: FnCommand): void {
    cmd.run();
    this.stack.push(cmd);
  }

  undo(): void {
    const cmd = this.stack.pop();
    if (cmd) cmd.undo();
  }
}

const doc2 = new DocumentReceiver();
const fnInvoker = new FnInvoker();

fnInvoker.run(makeInsertText(doc2, "Hello"));
fnInvoker.run(makeInsertText(doc2, " world"));
console.log(doc2.state.content);   // "Hello world"

fnInvoker.undo();
console.log(doc2.state.content);   // "Hello"

// 🧠 Closures capture state naturally — often cleaner than classes.

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - Undo / redo stacks in editors, design tools, IDEs
// - Job queues (Celery, Bull, Bee-Queue, Sidekiq)
// - UI action batching (button press → command → invoker)
// - Network request orchestration (retry, cancel, batch)
// - Remote control / game input
// - Transaction scripting (DB, blockchain)
// - Macro recording in spreadsheets
// - Animation timelines (play, pause, reverse)
// - CI/CD pipelines (stages as commands)
// - Webhooks / event handlers (command = event)
// - CQRS / event sourcing (commands in, events out)
//
// Frameworks / libraries:
//   - Redux (actions + reducers = command-like)
//   - RxJS Subjects / queues
//   - BullMQ / Bull job queues
//   - VS Code commands (palette, keybindings)
//   - Angular CLI (schematic commands)
//   - NestJS CQRS module

/* ============================================================
 *  1️⃣1️⃣ COMMAND vs STRATEGY vs MEMENTO vs OBSERVER
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                          │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Command      │ Encapsulates an ACTION as an object           │
// │ Strategy     │ Encapsulates an ALGORITHM (interchangeable)   │
// │ Memento      │ Captures STATE for restore                    │
// │ Observer     │ NOTIFIES subscribers about changes            │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 Command = an action you can store, queue, undo.
//    Strategy = a behavior you can swap in the same context.
//    They look similar; the intent differs.
//    Command + Memento → powerful undo/redo.

/* ============================================================
 *  1️⃣2️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Decouple sender from receiver
//  - First-class operations: queue, log, undo, schedule
//  - Compose via macros (Composite + Command)
//  - Follows Open/Closed — new commands = new classes
//  - Great fit for event sourcing, CQRS
//  - Enables distributed / remote execution (serialize commands)
//
// ❌ Cons
//  - More classes / boilerplate than direct method calls
//  - Overkill for simple one-off actions
//  - Undo often requires Memento or careful reversal logic
//  - Serialization across processes needs careful design
//  - Command history grows unboundedly unless bounded

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Not every action has a natural undo — define explicitly what
//     `undo` means (no-op, inverse, compensate).
// ⚠️ Undo order for MACROS must be REVERSE of execution.
// ⚠️ Bounded history is essential — unlimited undo stacks leak memory.
//     Use a `limit` and `shift()` on overflow.
// ⚠️ Commands should be IMMUTABLE once created — otherwise redo
//     semantics break.
// ⚠️ Async commands: standardize on `Promise<T>` return so the
//     invoker can await uniformly.
// ⚠️ Idempotency matters if commands may be retried (network, queue).
// ⚠️ Under strict mode, avoid `any` — use generics for input/output.
// ⚠️ If a command needs to notify many listeners when done, use
//     Observer — not a callback soup.
// ⚠️ For SERIALIZABLE commands (queues, distributed), plan serialization
//     carefully — closures don't serialize.
// ⚠️ Prefer FUNCTIONAL commands (closures) for small, local actions.
//     Prefer CLASSES for polymorphic, serializable, or undoable commands.
// ⚠️ `Command` vs `Strategy`: if you're storing commands in a history
//     and replaying them, it's Command. If you're swapping algorithms
//     in a context, it's Strategy.

// 🕒 Version notes
// - Command pattern: GoF, 1994
// - Closures: JS native
// - Generics for typed commands: TS 1.0+
// - Async commands: ES2017 / TS 2.1
// - `AbortController` for cancellable commands: ES2018 / TS 2.6+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role              │ Notes                                     │
 * ─────────────────────────────────────────────────────────────
 * | Command           │ `execute()` (+ optional `undo`)           │
 * | ConcreteCommand   │ Binds receiver + args                     │
 * | Receiver          │ Knows how to do the work                  │
 * | Invoker           │ Queues/history/schedules commands         │
 * | Client            │ Creates commands and wires invoker        │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                 │ When to prefer                         │
 * ─────────────────────────────────────────────────────────────
 * | Class-based          │ Polymorphic, serializable, undoable    │
 * | Functional (closure) │ Small, local actions; less boilerplate │
 * | Macro                │ Composite of commands                  │
 * | Queue / scheduler    │ Async jobs, batching                   │
 * | Command + Memento    │ Robust undo/redo                       │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Make commands IMMUTABLE once created.
 *  - Bound history size (`limit` + `shift()` on overflow).
 *  - Undo macros in REVERSE order of execution.
 *  - Standardize async commands on `Promise<T>`.
 *  - Prefer CLOSURES for small local commands.
 *  - Prefer CLASSES for serializable, polymorphic commands.
 *  - Combine with Memento for robust undo/redo.
 *  - Isolate command errors in queues — don't crash the pipeline.
 *  - Type generically (`Command<I, R>`) — no `any` leaks.
 *  - Distinguish from Strategy by INTENT: action to store vs
 *    algorithm to swap.
 * ============================================================ */