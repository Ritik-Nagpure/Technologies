// 05_Classes_OOP/22_Iterator_Pattern.ts

/* ============================================================
 *  📘 THE ITERATOR PATTERN IN TYPESCRIPT
 *
 *  Iterator provides a way to access elements of an aggregate
 *  object SEQUENTIALLY without exposing its underlying
 *  representation.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Iterator solves
 *   4. Basic implementation (custom collection)
 *   5. Built-in JS iteration protocol (Symbol.iterator)
 *   6. Iterable vs Iterator vs IterableIterator
 *   7. Generators — the modern way
 *   8. Tree / composite iterators
 *   9. Reverse / filtered / paginated iterators
 *  10. Async iterators (for await...of)
 *  11. Real-world use cases
 *  12. Iterator vs Visitor vs Composite
 *  13. Pros & cons
 *  14. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Provide a UNIFORM way to traverse a collection without exposing
// how that collection stores its data.
//
//   Client → Iterator → Collection
//
// The client asks the iterator for the "next" element until there
// are none left. The collection's internals (array, tree, linked
// list, DB cursor) stay hidden.
//
// JS/TS has a BUILT-IN iteration protocol:
//   - `[Symbol.iterator]()` returns an iterator
//   - Iterator has `next(): { value, done }`
//   - `for...of`, spread, destructuring all use this protocol

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬────────────────────────────────────────┐
// │ Role                 │ Responsibility                          │
// ├──────────────────────┼────────────────────────────────────────┤
// │ Iterator             │ Interface: `next()` returns {value,done}│
// │ ConcreteIterator     │ Tracks position within the collection   │
// │ Iterable             │ Interface: `[Symbol.iterator]()`        │
// │ ConcreteAggregate    │ Collection that produces iterators      │
// │ Client               │ Uses for..of / spread / manual next()   │
// └──────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM ITERATOR SOLVES
 * ============================================================ */

// WITHOUT Iterator:
//
//   - Each collection exposes its internals (indexes, nodes, cursors)
//   - Client code needs a switch for each collection type
//   - Multiple concurrent traversals need manual state
//
// WITH Iterator:
//
//   for (const item of anything) { ... }
//
// Same loop works for arrays, trees, streams, DB cursors.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — CUSTOM COLLECTION
 * ============================================================ */

// ─── Iterator interface ───
interface MyIterator<T> {
  next(): { value: T; done: false } | { value: undefined; done: true };
  hasNext(): boolean;
}

// ─── Iterable interface ───
interface MyIterable<T> {
  createIterator(): MyIterator<T>;
}

// ─── Concrete Iterable — a simple number range ───
class NumberRange implements MyIterable<number> {
  constructor(private start: number, private end: number, private step = 1) {}

  createIterator(): MyIterator<number> {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      hasNext: () => current <= end,
      next: () => {
        if (current > end) {
          return { value: undefined, done: true } as const;
        }
        const value = current;
        current += step;
        return { value, done: false } as const;
      },
    };
  }
}

// ─── Client ───
const range = new NumberRange(1, 5);
const it = range.createIterator();
while (it.hasNext()) {
  const { value, done } = it.next();
  if (!done) console.log(value);   // 1 2 3 4 5
}

// 🧠 The client doesn't know how the range generates numbers.

/* ============================================================
 *  5️⃣ BUILT-IN JS ITERATION PROTOCOL (Symbol.iterator)
 * ============================================================ */

// Modern way — implement `[Symbol.iterator]` and you get:
//   - for...of
//   - spread [...x]
//   - destructuring
//   - Array.from
//   - yield* delegation

class LinkedList<T> implements Iterable<T> {
  private head: { value: T; next: Node | null } | null = null;
  private Node!: never;   // placeholder type reference
  private tail: { value: T; next: null } | null = null;

  add(value: T): this {
    const node = { value, next: null as any };
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      (this.tail as any).next = node;
      this.tail = node;
    }
    return this;
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

type Node = { value: unknown; next: Node | null };

// ─── Client — all the protocol goodies work ───
const list = new LinkedList<number>();
list.add(1).add(2).add(3);

for (const v of list) console.log(v);           // 1 2 3
console.log([...list]);                          // [1, 2, 3]
const [first, ...rest] = list;                   // first = 1, rest = [2,3]
console.log(Array.from(list));                   // [1, 2, 3]

/* ============================================================
 *  6️⃣ ITERABLE vs ITERATOR vs ITERABLEITERATOR
 * ============================================================ */

// Iterable          — has `[Symbol.iterator]()`
// Iterator          — has `next()`, returns { value, done }
// IterableIterator  — has BOTH (self-iterable iterators)
// AsyncIterator     — has `next(): Promise<{ value, done }>`
// AsyncIterable     — has `[Symbol.asyncIterator]()`

// TS built-in types (lib.es2015.iterable.d.ts):
//
//   interface Iterable<T> {
//     [Symbol.iterator](): Iterator<T>;
//   }
//
//   interface Iterator<T, TReturn = any, TNext = undefined> {
//     next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
//     return?(value?: TReturn): IteratorResult<T, TReturn>;
//     throw?(e?: any): IteratorResult<T, TReturn>;
//   }
//
//   interface IterableIterator<T> extends Iterator<T> {
//     [Symbol.iterator](): IterableIterator<T>;
//   }

/* ============================================================
 *  7️⃣ GENERATORS — THE MODERN WAY
 * ============================================================ */

// Generators give you `IterableIterator` for free.

function* countUpTo(n: number): Generator<number> {
  for (let i = 1; i <= n; i++) yield i;
}

for (const n of countUpTo(3)) console.log(n);   // 1 2 3

// 🔸 Generator methods — send values IN and get values OUT
function* echo(): Generator<string, string, string> {
  const a = yield "first?";
  const b = yield `got: ${a}`;
  return `done with ${b}`;
}

const gen = echo();
console.log(gen.next());                 // { value: "first?", done: false }
console.log(gen.next("hello"));          // { value: "got: hello", done: false }
console.log(gen.next("bye"));            // { value: "done with bye", done: true }

// 🔸 Infinite generators
function* naturals(): Generator<number> {
  let i = 0;
  while (true) yield i++;
}

const take = <T,>(n: number, src: Iterable<T>): T[] => {
  const out: T[] = [];
  for (const x of src) {
    if (out.length >= n) break;
    out.push(x);
  }
  return out;
};
console.log(take(5, naturals()));        // [0, 1, 2, 3, 4]

/* ============================================================
 *  8️⃣ TREE / COMPOSITE ITERATORS
 * ============================================================ */

// Iterate over a tree in a specific order WITHOUT exposing structure.

class TreeNode<T> {
  children: TreeNode<T>[] = [];
  constructor(public value: T) {}
  add(child: TreeNode<T>): this { this.children.push(child); return this; }

  // Depth-first pre-order
  *dfs(): Generator<T> {
    yield this.value;
    for (const child of this.children) yield* child.dfs();
  }

  // Breadth-first
  *bfs(): Generator<T> {
    const queue: TreeNode<T>[] = [this];
    while (queue.length > 0) {
      const node = queue.shift() as TreeNode<T>;
      yield node.value;
      for (const child of node.children) queue.push(child);
    }
  }
}

const tree = new TreeNode("root")
  .add(new TreeNode("A").add(new TreeNode("A1")).add(new TreeNode("A2")))
  .add(new TreeNode("B").add(new TreeNode("B1")));

console.log([...tree.dfs()]);   // ["root", "A", "A1", "A2", "B", "B1"]
console.log([...tree.bfs()]);   // ["root", "A", "B", "A1", "A2", "B1"]

/* ============================================================
 *  9️⃣ REVERSE / FILTERED / PAGINATED ITERATORS
 * ============================================================ */

// 🔸 Reverse iterator for arrays
function* reverse<T>(arr: readonly T[]): Generator<T> {
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i];
    if (v !== undefined) yield v;
  }
}
console.log([...reverse([1, 2, 3])]);   // [3, 2, 1]

// 🔸 Filtered iterator
function* filter<T>(src: Iterable<T>, pred: (v: T) => boolean): Generator<T> {
  for (const v of src) if (pred(v)) yield v;
}
console.log([...filter([1, 2, 3, 4], (n) => n % 2 === 0)]);   // [2, 4]

// 🔸 Mapped iterator
function* map<T, U>(src: Iterable<T>, fn: (v: T) => U): Generator<U> {
  for (const v of src) yield fn(v);
}
console.log([...map([1, 2, 3], (n) => n * 2)]);   // [2, 4, 6]

// 🔸 Paginated iterator (simulating DB cursor)
function* paginate<T>(items: readonly T[], pageSize: number): Generator<T[]> {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}
const pages = [...paginate([1, 2, 3, 4, 5, 6, 7], 3)];
console.log(pages);   // [[1,2,3], [4,5,6], [7]]

// 🧠 Iterators compose beautifully — chain filter → map → take.

/* ============================================================
 *  1️⃣0️⃣ ASYNC ITERATORS (for await...of)
 * ============================================================ */

// For streaming data: paginated APIs, WebSockets, files, DB cursors.

interface AsyncIterable2<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

class PaginatedApi<T> implements AsyncIterable2<T> {
  constructor(
    private pages: readonly T[][],
    private delayMs = 10
  ) {}

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const page of this.pages) {
      await new Promise((r) => setTimeout(r, this.delayMs));
      for (const item of page) yield item;
    }
  }
}

(async () => {
  const api = new PaginatedApi([["a", "b"], ["c"], ["d", "e"]]);
  for await (const item of api) {
    console.log(item);   // a b c d e (with delays)
  }
})();

// 🔸 Async generator helper
async function* asyncRange(start: number, end: number): AsyncGenerator<number> {
  for (let i = start; i <= end; i++) {
    await new Promise((r) => setTimeout(r, 1));
    yield i;
  }
}

/* ============================================================
 *  1️⃣1️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Traversing collections without exposing internals
// - Tree / graph traversal (DFS, BFS, inorder, postorder)
// - Streaming data (files, sockets, Kafka)
// - Paginated API iterators (Twitter, GitHub, Stripe)
// - Database cursors
// - Combinators (map/filter/take/zip) for lazy sequences
// - Infinite sequences (Fibonacci, naturals)
// - Parsing token streams
// - AsyncIterator for stream processing
//
// JS/TS built-ins using iterators:
//   - Array, Map, Set, String
//   - for...of loops, spread, destructuring
//   - Generators
//   - Node.js streams (Readable) — async iteration
//   - Web Streams API

/* ============================================================
 *  1️⃣2️⃣ ITERATOR vs VISITOR vs COMPOSITE
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                          │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Iterator     │ SEQUENTIAL access without exposing structure  │
// │ Visitor      │ OPERATIONS on elements, kept outside them     │
// │ Composite    │ TREE structure; uniform treatment             │
// └──────────────┴──────────────────────────────────────────────┘
//
// 🧠 Iterator = HOW to walk.
//    Visitor = WHAT to do at each step.
//    Composite = the SHAPE being walked.

/* ============================================================
 *  1️⃣3️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Uniform traversal for different structures
//  - Hides internal representation
//  - Multiple concurrent traversals (each iterator has state)
//  - Composable via generators / combinator functions
//  - Native support via `for...of`, spread, destructuring
//  - Lazy evaluation — memory-efficient for large/infinite sequences
//
// ❌ Cons
//  - Slightly more code than directly looping an array
//  - Iterators are STATEFUL — reuse requires a fresh iterator
//  - Async iterators add complexity (errors, cleanup, backpressure)
//  - Cannot easily do random access or rewind
//  - Deep recursion in some iterators (e.g., DFS) can blow the stack

/* ============================================================
 *  1️⃣4️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Iterators are ONE-SHOT — once `done: true`, further `next()`
//     calls keep returning `{ value: undefined, done: true }`.
//     To iterate twice, create a NEW iterator.
// ⚠️ Generators are NOT re-iterable — same one-shot rule.
// ⚠️ `[...gen()]` consumes the generator; a second spread yields [].
// ⚠️ Under `noUncheckedIndexedAccess`, `arr[i]` is `T | undefined` —
//     guard before yielding (see `reverse` above).
// ⚠️ `next()` must return `done: true` eventually or `for...of`
//     will loop forever.
// ⚠️ Under `strict`, `Iterator<T>`'s `next()` return type should be
//     `IteratorResult<T>` — TS's built-in unions are:
//         { value: T; done: false } | { value: TReturn; done: true }
// ⚠️ Async iterators: ALWAYS close resources in a `finally` block.
//     Use `return()` on early break to release resources.
// ⚠️ `yield*` delegates to another iterable — equivalent to
//     `for (const x of inner) yield x`.
// ⚠️ Errors thrown inside a generator propagate to the consumer
//     on the next `next()` call.
// ⚠️ Infinite generators are safe with `for...of` + `break`, but
//     NOT with spread / `Array.from` — they'll never terminate.
// ⚠️ Implement `[Symbol.iterator]` as a GENERATOR FUNCTION (`*[]`)
//     so `IterableIterator` is returned — TS infers the right type.

// 🕒 Version notes
// - Generators / iterables: ES2015 / TS 2.3
// - `for...of`: ES2015 / TS 1.5
// - Async iterators / `for await...of`: ES2018 / TS 2.3
// - `noUncheckedIndexedAccess`: TS 4.1

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept             │ Notes                                    │
 * ─────────────────────────────────────────────────────────────
 * | Iterator            │ `next(): { value, done }`                │
 * | Iterable            │ `[Symbol.iterator](): Iterator<T>`       │
 * | IterableIterator    │ Iterator + Iterable (self)               │
 * | AsyncIterator       │ `next(): Promise<IteratorResult>`        │
 * | AsyncIterable       │ `[Symbol.asyncIterator]()`               │
 * | Generator function  │ `function*` returns IterableIterator     │
 * | Yield               │ Pauses and returns a value               │
 * | yield*              │ Delegates to another iterable            │
 * ─────────────────────────────────────────────────────────────
 *
 * | Protocol          │ Enables                                     │
 * ─────────────────────────────────────────────────────────────
 * | Symbol.iterator   │ for...of, spread, destructuring, Array.from │
 * | Symbol.asyncIterator │ for await...of                           │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer GENERATORS over hand-rolled iterator classes.
 *  - Implement `[Symbol.iterator]` so `for...of` works.
 *  - Remember: iterators are ONE-SHOT — create fresh per traversal.
 *  - Guard array access under `noUncheckedIndexedAccess`.
 *  - Use `yield*` for delegation over manual loops.
 *  - Provide combinators (`map`, `filter`, `take`) for laziness.
 *  - For async, close resources in `finally`.
 *  - For infinite sequences, always pair with `break`/`take`.
 *  - Keep iterator logic SIMPLE — complex iterators hide bugs.
 *  - Type iterators explicitly when returning from factories.
 * ============================================================ */