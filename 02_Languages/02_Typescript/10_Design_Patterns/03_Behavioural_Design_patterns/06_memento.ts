// 05_Classes_OOP/26_Memento_Pattern.ts

/* ============================================================
 *  📘 THE MEMENTO PATTERN IN TYPESCRIPT
 *
 *  Memento captures and externalizes an object's INTERNAL STATE
 *  so it can be restored later — WITHOUT violating encapsulation.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Memento solves
 *   4. Basic implementation (text editor undo)
 *   5. Caretaker (history manager)
 *   6. Immutable mementos
 *   7. Generic memento
 *   8. Command + Memento (undoable actions)
 *   9. Deep vs shallow snapshots
 *  10. Real-world use cases
 *  11. Memento vs Command vs Snapshot vs Serialization
 *  12. Pros & cons
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Save an object's state into a SEPARATE "memento" object.
// The originator can later be restored from that memento.
// The memento is OPAQUE to the caretaker (history manager) —
// nobody outside the originator looks inside.
//
//   Originator → creates/restores → Memento
//   Caretaker  → stores mementos, never inspects them
//
// Result: undo/redo, snapshots, checkpoints — all without
// exposing the originator's private internals.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌─────────────────────┬────────────────────────────────────────┐
// │ Role                │ Responsibility                          │
// ├─────────────────────┼────────────────────────────────────────┤
// │ Originator          │ Creates a memento; restores from one    │
// │ Memento             │ Immutable snapshot of internal state    │
// │ Caretaker           │ Stores mementos; never inspects them    │
// │ Client              │ Coordinates originator + caretaker      │
// └─────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM MEMENTO SOLVES
 * ============================================================ */

// You need to add undo/redo to a text editor, drawing app, or
// workflow system. The naive approach exposes internals:
//
//   class Editor {
//     public content: string;      // exposed — anyone can mutate
//     public cursor: number;
//     public selection: [number, number];
//   }
//
//   history.push({ ...editor });   // fragile: shallow copy
//
// Memento keeps state PRIVATE:
//
//   const snap = editor.snapshot();      // opaque
//   editor.restore(snap);                // restores internals
//
// The caretaker just holds snapshots — it never sees the fields.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — TEXT EDITOR UNDO
 * ============================================================ */

// ─── Memento — immutable snapshot ───
class EditorMemento {
  // `readonly` + private constructor + no setters = immutable
  private constructor(
    public readonly content: string,
    public readonly cursor: number,
    public readonly timestamp: number
  ) {}

  // Factory — only the Originator (same module) should create these
  static create(content: string, cursor: number): EditorMemento {
    return new EditorMemento(content, cursor, Date.now());
  }
}

// ─── Originator ───
class TextEditor {
  private content = "";
  private cursor = 0;

  type(text: string): void {
    this.content = this.content.slice(0, this.cursor) + text + this.content.slice(this.cursor);
    this.cursor += text.length;
  }

  moveCursor(pos: number): void {
    this.cursor = Math.max(0, Math.min(pos, this.content.length));
  }

  // 🔸 Snapshot the CURRENT state into a memento
  snapshot(): EditorMemento {
    return EditorMemento.create(this.content, this.cursor);
  }

  // 🔸 Restore from a memento
  restore(m: EditorMemento): void {
    this.content = m.content;
    this.cursor = m.cursor;
  }

  // For display only
  toString(): string {
    return `"${this.content}" (cursor @${this.cursor})`;
  }
}

// ─── Caretaker — stores mementos, never inspects them ───
class History {
  private stack: EditorMemento[] = [];

  push(m: EditorMemento): void {
    this.stack.push(m);
  }

  undo(): EditorMemento | undefined {
    return this.stack.pop();      // remove current snapshot, return previous
  }

  size(): number { return this.stack.length; }
  isEmpty(): boolean { return this.stack.length === 0; }
}

// ─── Client ───
const editor = new TextEditor();
const history = new History();

history.push(editor.snapshot());       // save initial state
editor.type("Hello");
history.push(editor.snapshot());       // save after "Hello"
editor.type(", world");
history.push(editor.snapshot());

console.log(editor.toString());        // "Hello, world" (cursor @12)

const prev = history.undo();
if (prev) editor.restore(prev);
console.log(editor.toString());        // "Hello" (cursor @5)

const prev2 = history.undo();
if (prev2) editor.restore(prev2);
console.log(editor.toString());        // "" (cursor @0)

// 🧠 The History knows NOTHING about content/cursor — just holds mementos.

/* ============================================================
 *  5️⃣ CARETAKER (HISTORY MANAGER)
 * ============================================================ */

// A more realistic caretaker with redo + bounded history.

class UndoRedoManager<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  constructor(private readonly limit = 100) {}

  // Save a new snapshot — clears redo history
  save(snapshot: T): void {
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(): T | undefined {
    const top = this.undoStack.pop();
    if (top === undefined) return undefined;
    this.redoStack.push(top);
    return top;
  }

  redo(): T | undefined {
    const top = this.redoStack.pop();
    if (top === undefined) return undefined;
    this.undoStack.push(top);
    return top;
  }

  canUndo(): boolean { return this.undoStack.length > 0; }
  canRedo(): boolean { return this.redoStack.length > 0; }
}

// ─── Usage with the editor ───
const editor2 = new TextEditor();
const history2 = new UndoRedoManager<EditorMemento>();

editor2.type("A");
history2.save(editor2.snapshot());
editor2.type("B");
history2.save(editor2.snapshot());
editor2.type("C");
history2.save(editor2.snapshot());

console.log(editor2.toString());       // "ABC" (cursor @3)

const u = history2.undo();
if (u) editor2.restore(u);
console.log(editor2.toString());       // "AB"  (cursor @2)

const r = history2.redo();
if (r) editor2.restore(r);
console.log(editor2.toString());       // "ABC" (cursor @3)

/* ============================================================
 *  6️⃣ IMMUTABLE MEMENTOS
 * ============================================================ */

// Mementos should be IMMUTABLE — nobody (including the originator)
// should be able to mutate a saved snapshot.

// Approach 1: `readonly` fields + private constructor (§4)
//
// Approach 2: `Object.freeze` for runtime immutability
//
// Approach 3: deep-copy nested structures

class DocumentMemento {
  readonly content: string;
  readonly tags: readonly string[];

  constructor(content: string, tags: string[]) {
    this.content = content;
    this.tags = Object.freeze([...tags]);   // copy + freeze
    Object.freeze(this);
  }
}

const m = new DocumentMemento("hello", ["a", "b"]);
// m.content = "x";        // ❌ readonly (compile time)
// m.tags.push("c");       // ❌ readonly array (compile time)
// (m as any).content = "x"; // runtime: Object.freeze blocks this (in strict mode)

/* ============================================================
 *  7️⃣ GENERIC MEMENTO
 * ============================================================ */

// A generic, reusable memento wrapper — the originator is
// responsible for what state goes in.

interface Snapshot<T> {
  readonly data: T;
  readonly createdAt: number;
  readonly label?: string;
}

class SnapshotStore<T> {
  private snapshots: Snapshot<T>[] = [];

  capture(data: T, label?: string): Snapshot<T> {
    const snap: Snapshot<T> = Object.freeze({
      data,
      createdAt: Date.now(),
      label,
    });
    this.snapshots.push(snap);
    return snap;
  }

  latest(): Snapshot<T> | undefined {
    return this.snapshots[this.snapshots.length - 1];
  }

  all(): readonly Snapshot<T>[] {
    return this.snapshots;
  }

  clear(): void { this.snapshots = []; }
}

// ─── Usage ───
type GameState = { hp: number; level: number; gold: number };

class Game {
  state: GameState = { hp: 100, level: 1, gold: 0 };

  damage(n: number): void { this.state.hp = Math.max(0, this.state.hp - n); }
  levelUp(): void { this.state.level += 1; }
  earnGold(n: number): void { this.state.gold += n; }

  snapshot(): GameState { return { ...this.state }; }         // shallow copy
  restore(s: GameState): void { this.state = { ...s }; }
}

const game = new Game();
const saves = new SnapshotStore<GameState>();

saves.capture(game.snapshot(), "start");
game.damage(30);
game.earnGold(50);
saves.capture(game.snapshot(), "after battle");

game.damage(80);
console.log(game.state);                                     // { hp: 0, level: 1, gold: 50 }

const lastSave = saves.latest();
if (lastSave) game.restore(lastSave.data);
console.log(game.state);                                     // { hp: 70, level: 1, gold: 50 }

/* ============================================================
 *  8️⃣ COMMAND + MEMENTO (UNDOABLE ACTIONS)
 * ============================================================ */

// Command pattern tells us WHAT to do; Memento tells us HOW to
// undo it. Together they implement robust undo/redo.

interface Command {
  execute(): void;
  undo(): void;
  readonly name: string;
}

class InsertTextCommand implements Command {
  readonly name = "InsertText";
  private memento: EditorMemento;

  constructor(
    private editor: TextEditor,
    private text: string
  ) {
    this.memento = editor.snapshot();      // save BEFORE
  }

  execute(): void { this.editor.type(this.text); }
  undo(): void { this.editor.restore(this.memento); }
}

class CommandInvoker {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  run(cmd: Command): void {
    cmd.execute();
    this.history.push(cmd);
    this.redoStack = [];
  }

  undo(): void {
    const cmd = this.history.pop();
    if (!cmd) return;
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    cmd.execute();
    this.history.push(cmd);
  }
}

// ─── Usage ───
const editor3 = new TextEditor();
const invoker = new CommandInvoker();

invoker.run(new InsertTextCommand(editor3, "Hello"));
invoker.run(new InsertTextCommand(editor3, " world"));
console.log(editor3.toString());           // "Hello world" (cursor @11)

invoker.undo();
console.log(editor3.toString());           // "Hello" (cursor @5)

invoker.redo();
console.log(editor3.toString());           // "Hello world" (cursor @11)

// 🧠 Each command stores its OWN memento — perfect for undo/redo.

/* ============================================================
 *  9️⃣ DEEP vs SHALLOW SNAPSHOTS
 * ============================================================ */

// ⚠️ `{ ...obj }` is SHALLOW — nested objects remain SHARED.

type State = { user: { name: string; prefs: { theme: string } }; score: number };

const s: State = { user: { name: "A", prefs: { theme: "dark" } }, score: 10 };
const shallow = { ...s };
shallow.user.prefs.theme = "light";
console.log(s.user.prefs.theme);           // "light" — mutated original!

// ✅ Deep snapshot with `structuredClone` (ES2022 / Node 17+ / modern browsers)
const deep = structuredClone(s);
deep.user.prefs.theme = "dark";
console.log(s.user.prefs.theme);           // "light" — original untouched

// ✅ Alternative deep clone
const deep2 = JSON.parse(JSON.stringify(s));   // ⚠️ loses Date/Map/Set/undefined/functions

// ✅ Custom deep clone for known shapes
function deepCopy<T>(v: T): T {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(deepCopy) as unknown as T;
  if (v instanceof Date) return new Date(v.getTime()) as unknown as T;
  if (v instanceof Map) return new Map(v) as unknown as T;
  if (v instanceof Set) return new Set(v) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(v as Record<string, unknown>)) {
    out[k] = deepCopy((v as Record<string, unknown>)[k]);
  }
  return out as T;
}

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - Text editors / IDEs (undo/redo)
// - Drawing / design tools (Canvas undo stacks)
// - Games (save states, replay, time travel debugging)
// - Form wizards (back to previous step without losing data)
// - Spreadsheet macros (undo each operation)
// - Database transaction snapshots
// - Redux DevTools time-travel debugging
// - Git-style VCS checkpoints
// - Workflow engines (rollback partial progress)
// - Collaborative editors (CRDTs / snapshots for sync)
// - Testing frameworks (setup/teardown with state restore)
//
// Frameworks / libraries:
//   - Redux DevTools (state snapshots + time travel)
//   - Immer (immutable updates via drafts)
//   - Git (commit history)
//   - Photoshop / Figma (undo history)
//   - VS Code (undo/redo, settings backups)

/* ============================================================
 *  1️⃣1️⃣ MEMENTO vs COMMAND vs SNAPSHOT vs SERIALIZATION
 * ============================================================ */

// ┌────────────────────┬───────────────────────────────────────────┐
// │ Concept            │ Distinguishing trait                       │
// ├────────────────────┼───────────────────────────────────────────┤
// │ Memento            │ Opaque STATE snapshot for restore          │
// │ Command            │ Do/undo OPERATION with intent              │
// │ Snapshot           │ Generic term for "state at a point in time"│
// │ Serialization      │ Persisting state to a durable format       │
// └────────────────────┴───────────────────────────────────────────┘
//
// 🧠 Command stores HOW to undo (operation).
//    Memento stores WHAT the state was (data).
//    They often work together (see §8).

/* ============================================================
 *  1️⃣2️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Encapsulation preserved — memento is opaque to the caretaker
//  - Clean undo/redo, checkpoints, rollbacks
//  - Decouples state storage from state ownership
//  - Works with Command for time-travel
//  - Simple mental model
//
// ❌ Cons
//  - Memory-heavy for large states — each memento stores a copy
//  - Deep copy can be expensive (use structural sharing to mitigate)
//  - Historic state can be stale — you must be careful about
//    what's included vs what's re-derived
//  - Mementos can leak sensitive data if logged / serialized
//  - In JS, private fields can't be "read" by the caretaker —
//    that's the point, but it forces the originator to expose
//    snapshot/restore APIs

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ SHALLOW copies leak state — always deep copy nested data.
//     Use `structuredClone`, a custom copier, or an immutability
//     library (Immer, Immutable.js).
// ⚠️ Mementos should be IMMUTABLE — `readonly` + `Object.freeze`
//     prevent accidental mutation of history.
// ⚠️ The caretaker should NEVER inspect memento internals.
//     If it does, encapsulation is broken and you've built a
//     generic snapshot, not the GoF Memento.
// ⚠️ Bound the history size — unlimited undo stacks leak memory.
//     Use a `limit` + `shift()` on overflow (see §5).
// ⚠️ Redo stack must be cleared when a NEW action happens after undo.
// ⚠️ Deep-cloning sensitive data (tokens, PII) into mementos is a
//     security risk — exclude or redact.
// ⚠️ Serialization ≠ Memento: serializing to JSON for storage is
//     an EXTRA step, not the pattern itself.
// ⚠️ Memento for very large state (e.g., huge documents) can be
//     prohibitive — prefer incremental / delta-based snapshots.
// ⚠️ Under strict mode, `structuredClone` requires a modern target
//     (`target: "ES2022"+` and DOM/Node libs).
// ⚠️ `private` fields in classes are NOT enforced at runtime —
//     use `#field` if you need true encapsulation.
// ⚠️ Mementos created by `Object.freeze` still expose data via
//     `JSON.stringify` unless you also block that (or avoid putting
//     sensitive fields in).

// 🕒 Version notes
// - Memento pattern: GoF, 1994
// - `readonly` properties: TS 2.0
// - `Object.freeze` / `Readonly<T>`: TS 2.1 (typing) / runtime native
// - `structuredClone`: ES2022 / Node 17+ / modern browsers
// - `#private` fields: TS 3.8

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role        │ Notes                                          │
 * ─────────────────────────────────────────────────────────────
 * | Originator  │ Creates mementos; restores from them            │
 * | Memento     │ Immutable, opaque state snapshot                │
 * | Caretaker   │ Stores mementos; never inspects them            │
 * | Client      │ Coordinates save/restore                        │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                   │ When to prefer                         │
 * ─────────────────────────────────────────────────────────────
 * | Class-based memento    │ Encapsulation matters                  │
 * | Generic Snapshot<T>    │ Simple, data-only state                │
 * | Command + Memento      │ Undo/redo of actions                   │
 * | Deep clone             │ Nested mutable state                   │
 * | Delta snapshots        │ Very large state, incremental changes  │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Mementos MUST be IMMUTABLE (`readonly` + `Object.freeze`).
 *  - Deep-copy nested state — never store a shared reference.
 *  - Bound history size (`limit` + `shift()` on overflow).
 *  - Clear the redo stack after a new action.
 *  - Keep mementos OPAQUE to the caretaker — that's the point.
 *  - Use `structuredClone` for reliable deep copies (ES2022+).
 *  - Combine with Command for robust undo/redo pipelines.
 *  - Redact sensitive data before storing in mementos.
 *  - Consider delta snapshots for very large state.
 *  - Prefer immutability libraries (Immer) for complex state trees.
 *  - Remember: Memento = state data; Command = operations.
 * ============================================================ */