// 07_Queues_and_Deques.ts

/* ============================================================
 *  📘 QUEUES & DEQUES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A QUEUE is FIFO (First-In, First-Out): enqueue at the back,
 *  dequeue from the front. A DEQUE (double-ended queue) allows
 *  O(1) push/pop at BOTH ends — the workhorse of sliding-window
 *  and BFS problems.
 *
 *  JavaScript's Array.shift / Array.unshift are O(n), so a
 *  proper queue needs either:
 *    • A head-pointer wrapper over an array, or
 *    • A doubly-linked list with head/tail pointers, or
 *    • A ring buffer with fixed capacity.
 *
 *  This file covers: FIFO semantics, why Array.shift is a trap,
 *  head-pointer queue, ring buffer, deque via linked list,
 *  monotonic deque for sliding-window min/max, and the classic
 *  problems (queue via two stacks, first non-repeating in a
 *  stream, BFS-ready interface).
 *
 *  Sections:
 *   1. What a queue is
 *   2. Why Array.shift is a bad queue
 *   3. Head-pointer queue (the pragmatic default)
 *   4. Ring buffer / circular queue (fixed capacity)
 *   5. Deque via doubly-linked list (O(1) both ends)
 *   6. Monotonic deque — sliding window maximum
 *   7. Sliding window minimum (symmetric)
 *   8. First non-repeating character in a stream
 *   9. Queue via two stacks (recap from stacks file)
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A QUEUE IS
 * ============================================================ */
// 🔹 FIFO — first item enqueued is first dequeued.
// 🔹 Core operations:
//     enqueue(x) → add to back
//     dequeue()  → remove & return front
//     front()    → look at front
//     isEmpty(), size()
// 🔸 All O(1) with the right implementation.
// 🎯 Analogy: checkout line — first in line gets served first.

// 🧠 Use a queue whenever the problem says:
//    "order preserved", "level by level", "shortest path (unweighted)",
//    "producer/consumer", "scheduling", "buffer".


/* ============================================================
 *  2️⃣ WHY Array.shift IS A BAD QUEUE
 * ============================================================ */
// 🔹 arr.shift() is O(n) — it shifts every element left.
// 🔸 Using Array as a queue in a loop → O(n²) total.

// ❌ Demonstrating the trap (do NOT do this in real code):
const badQueue: number[] = [];
for (let i = 0; i < 5; i++) badQueue.push(i);       // O(1) each
for (let i = 0; i < 5; i++) badQueue.shift();       // O(n) each → O(n²)

// 🔎 Even worse at scale — 1M items means ~500 billion pointer
//    moves in modern engines' queue implementations.

// 🧠 Rule: NEVER use Array.shift / Array.unshift for queues.
//    Use a head-pointer queue or a ring buffer.


/* ============================================================
 *  3️⃣ HEAD-POINTER QUEUE (THE PRAGMATIC DEFAULT)
 * ============================================================ */
// 🔹 Use an array + a head index. Never shift; just advance head.
// 🔸 Amortised O(1) enqueue/dequeue.
// 🔸 Periodic compaction prevents memory blowup.

class ArrayQueue<T> {
  private buf: T[] = [];
  private head = 0;

  enqueue(x: T): void {
    this.buf.push(x);
  }

  dequeue(): T | undefined {
    if (this.head >= this.buf.length) return undefined;
    const v = this.buf[this.head];
    this.head += 1;
    // 🔸 Periodic compaction: when head grows large, trim
    if (this.head > 1024 && this.head * 2 > this.buf.length) {
      this.buf = this.buf.slice(this.head);
      this.head = 0;
    }
    return v;
  }

  front(): T | undefined {
    return this.head < this.buf.length ? this.buf[this.head] : undefined;
  }

  get size(): number {
    return this.buf.length - this.head;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  toArray(): readonly T[] {
    return this.buf.slice(this.head);
  }
}

const q = new ArrayQueue<number>();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
console.log(q.dequeue());               // 1
console.log(q.front());                 // 2
console.log(q.size);                    // 2
console.log(q.toArray());               // [2, 3]

// 🧠 This is the pragmatic default in TypeScript — no external
//    library, amortised O(1), and no O(n) shift cost.


/* ============================================================
 *  4️⃣ RING BUFFER / CIRCULAR QUEUE (FIXED CAPACITY)
 * ============================================================ */
// 🔹 Fixed-capacity FIFO with head/tail wrap-around.
// 🔸 O(1) enqueue/dequeue, no resizing, bounded memory.
// 🎯 Classic interview question — implement without libraries.

class CircularQueue<T> {
  private buf: (T | undefined)[];
  private head = 0;                     // next dequeue index
  private tail = 0;                     // next enqueue index
  private count = 0;
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("capacity must be positive");
    this.capacity = capacity;
    this.buf = new Array<T | undefined>(capacity).fill(undefined);
  }

  enqueue(x: T): boolean {
    if (this.count === this.capacity) return false;
    this.buf[this.tail] = x;
    this.tail = (this.tail + 1) % this.capacity;
    this.count += 1;
    return true;
  }

  dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const v = this.buf[this.head];
    this.buf[this.head] = undefined;    // help GC
    this.head = (this.head + 1) % this.capacity;
    this.count -= 1;
    return v;
  }

  front(): T | undefined {
    return this.count === 0 ? undefined : this.buf[this.head];
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }

  get size(): number {
    return this.count;
  }
}

const cq = new CircularQueue<number>(3);
cq.enqueue(1);
cq.enqueue(2);
cq.enqueue(3);
console.log(cq.enqueue(4));             // false (full)
console.log(cq.dequeue());              // 1
console.log(cq.enqueue(4));             // true
console.log(cq.front());                // 2

// 🧠 The modulo-wrap trick: (index + 1) % capacity.
//    Invariant: `count` distinguishes full from empty when
//    head === tail.


/* ============================================================
 *  5️⃣ DEQUE VIA DOUBLY-LINKED LIST (O(1) BOTH ENDS)
 * ============================================================ */
// 🔹 True O(1) push/pop at BOTH ends.
// 🔸 Useful when you need deque semantics with no amortisation
//    spikes.
// 🎯 Sliding window problems, work-stealing schedulers.

interface ListNode<T> {
  value: T;
  prev: ListNode<T> | null;
  next: ListNode<T> | null;
}

class Deque<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private count = 0;

  pushBack(x: T): void {
    const node: ListNode<T> = { value: x, prev: this.tail, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.count += 1;
  }

  pushFront(x: T): void {
    const node: ListNode<T> = { value: x, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.count += 1;
  }

  popBack(): T | undefined {
    if (!this.tail) return undefined;
    const v = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.head = null;
    this.count -= 1;
    return v;
  }

  popFront(): T | undefined {
    if (!this.head) return undefined;
    const v = this.head.value;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    else this.tail = null;
    this.count -= 1;
    return v;
  }

  front(): T | undefined {
    return this.head?.value;
  }

  back(): T | undefined {
    return this.tail?.value;
  }

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }
}

const dq = new Deque<number>();
dq.pushBack(1);
dq.pushBack(2);
dq.pushFront(0);
console.log(dq.front(), dq.back());     // 0 2
console.log(dq.popFront());             // 0
console.log(dq.popBack());              // 2
console.log(dq.size);                   // 1

// 🧠 Doubly-linked deque: O(1) both ends, but heavier per
//    element (two pointers). Use when amortised spikes hurt.
// 🔸 For most DSA problems, ArrayQueue or an array with a head
//    pointer is enough.


/* ============================================================
 *  6️⃣ MONOTONIC DEQUE — SLIDING WINDOW MAXIMUM
 * ============================================================ */
// 🔹 Classic hard problem: max of every window of size k.
// 🔸 Brute force O(n*k); monotonic deque → O(n).

function maxSlidingWindow(xs: readonly number[], k: number): number[] {
  if (k <= 0 || k > xs.length) return [];
  const result: number[] = [];
  const dq: number[] = [];              // indices, decreasing values

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;

    // Remove indices outside the window
    while (dq.length > 0) {
      const front = dq[0];
      if (front === undefined || front > i - k) break;
      dq.shift();                          // OK: deque is small (≤ k)
    }
    // Remove smaller values — they can never be the max again
    while (dq.length > 0) {
      const back = dq[dq.length - 1];
      if (back === undefined) break;
      const backVal = xs[back];
      if (backVal === undefined || backVal >= x) break;
      dq.pop();
    }
    dq.push(i);

    if (i >= k - 1) {
      const top = dq[0];
      if (top !== undefined) {
        const v = xs[top];
        if (v !== undefined) result.push(v);
      }
    }
  }
  return result;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]

// ⚠️ Array.shift on the deque is OK because the deque size is
//    bounded by k — the total shift work is O(n). For huge k,
//    use a real Deque class.
// 🧠 Every index enters/leaves the deque at most once → O(n).


/* ============================================================
 *  7️⃣ SLIDING WINDOW MINIMUM (SYMMETRIC)
 * ============================================================ */
// 🔹 Same pattern, flip the comparison.

function minSlidingWindow(xs: readonly number[], k: number): number[] {
  if (k <= 0 || k > xs.length) return [];
  const result: number[] = [];
  const dq: number[] = [];              // indices, increasing values

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;

    while (dq.length > 0) {
      const front = dq[0];
      if (front === undefined || front > i - k) break;
      dq.shift();
    }
    while (dq.length > 0) {
      const back = dq[dq.length - 1];
      if (back === undefined) break;
      const backVal = xs[back];
      if (backVal === undefined || backVal <= x) break;
      dq.pop();
    }
    dq.push(i);

    if (i >= k - 1) {
      const top = dq[0];
      if (top !== undefined) {
        const v = xs[top];
        if (v !== undefined) result.push(v);
      }
    }
  }
  return result;
}

console.log(minSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [-1, -3, -3, -3, 3, 3]

// 🧠 Monotonic deque = monotonic stack with two ends. Same idea,
//    but you also expire items from the front.


/* ============================================================
 *  8️⃣ FIRST NON-REPEATING CHARACTER IN A STREAM
 * ============================================================ */
// 🔹 Read characters one by one; after each, print the first
//    char that has appeared exactly once so far.
// 🔸 Combine a frequency Map with a queue for O(n) total.

function firstNonRepeatingStream(s: string): Array<string | null> {
  const counts = new Map<string, number>();
  const q: string[] = [];                // queue of candidates
  const out: Array<string | null> = [];
  let head = 0;                          // head pointer for O(1) dequeue

  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    q.push(ch);
    // Drop chars from the front that are no longer unique
    while (head < q.length) {
      const front = q[head];
      if (front === undefined) break;
      if ((counts.get(front) ?? 0) > 1) head += 1;
      else break;
    }
    const front = q[head];
    out.push(front !== undefined ? front : null);
  }
  return out;
}

console.log(firstNonRepeatingStream("aabcbd"));
// ["a", null, "b", "b", "c", "c", "d"]

// 🔎 This is the classic "queue + hashmap" pattern: the queue
//    keeps ORDER of arrival, the map keeps freshness.
// 🧠 When the problem says "stream" or "online", think
//    hashmap + queue.


/* ============================================================
 *  9️⃣ QUEUE VIA TWO STACKS (RECAP FROM STACKS FILE)
 * ============================================================ */
// 🔹 Classic interview: FIFO from two LIFOs.
// 🔸 push → input stack; pop → transfer to output stack once.

class QueueViaStacks<T> {
  private inStack: T[] = [];
  private outStack: T[] = [];

  push(x: T): void {
    this.inStack.push(x);
  }

  pop(): T | undefined {
    this.shift();
    return this.outStack.pop();
  }

  peek(): T | undefined {
    this.shift();
    return this.outStack[this.outStack.length - 1];
  }

  private shift(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        const v = this.inStack.pop();
        if (v !== undefined) this.outStack.push(v);
      }
    }
  }

  isEmpty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

const qs = new QueueViaStacks<number>();
qs.push(1); qs.push(2); qs.push(3);
console.log(qs.pop());                  // 1
console.log(qs.peek());                 // 2
console.log(qs.pop());                  // 2
console.log(qs.isEmpty());              // false

// 🧠 Amortised O(1) per operation — each item moves at most once.
//    The reverse (stack via two queues) is also a common problem.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Array.shift is O(n) — the #1 queue mistake.
// ⚠️ Array.unshift is also O(n) — symmetric trap.
// ⚠️ For a bounded-size deque (k ≤ ~1e5), Array.shift on the
//    deque is fine because total work is O(n). For huge k, use
//    a real ring buffer or linked-list deque.
// ⚠️ Ring buffer: use `count` (not head vs tail) to distinguish
//    full from empty.
// ⚠️ Ring buffer: set buf[head] = undefined after dequeue to
//    help GC.
// ⚠️ Monotonic deque uses < vs <= — matters for duplicates in
//    sliding-window problems.
// ⚠️ In BFS, use a queue, NOT an array-as-stack — order matters.
// ⚠️ ArrayQueue compaction threshold: tune based on workload.
// ⚠️ Iterating a queue while enqueuing is fine; while dequeuing
//    the same structure is risky.
// ⚠️ The "stream" pattern (first non-repeating) works on
//    characters or numbers; queue order gives freshness.
// ⚠️ Array-based deque with shift on BOTH ends is O(n) — don't
//    use it for large sliding windows.
// ⚠️ TypeScript noUncheckedIndexedAccess: buf[i] is T|undefined.
//    Narrow before use.
// ⚠️ Never use for...in on a queue to iterate — use for...of or
//    an index loop.

/* 🕒 Version notes
 * - No built-in Queue/Deque in JS — implement or use array
 * - Array.prototype.push/pop: always
 * - Array.prototype.shift/unshift: always, but O(n)
 * - Array.prototype.at(-1) for peek: ES2022
 * - Doubly-linked list with generic types: TS-friendly since TS 1.5
 * - "noUncheckedIndexedAccess": TS 4.1+
 * - Generators (function*) make lazy queues easy: ES2015
 * - TextEncoder / TextDecoder useful for stream char handling: Node 11+
 * - structuredClone: Node 17+, modern browsers
 * - Not part of ECMAScript: Queue / Deque / RingBuffer
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Structure       │ Enqueue      │ Dequeue      │ Notes       |
 * ─────────────────────────────────────────────────────────────
 * | Array (bad)     │ push O(1)    │ shift O(n)   │ ❌ O(n²)    |
 * | ArrayQueue      │ push O(1)    │ head ptr O(1)│ ✅ default  |
 * | Ring buffer     │ O(1)         │ O(1)         │ fixed size  |
 * | Deque (LL)      │ pushBack O(1)│ popFront O(1)│ both ends   |
 * | QueueViaStacks  │ push O(1)    │ amort. O(1)  │ FIFO via LIFO|
 * ─────────────────────────────────────────────────────────────
 * | Classic problem               │ Technique                 |
 * ─────────────────────────────────────────────────────────────
 * | Sliding window maximum        │ Monotonic deque           |
 * | Sliding window minimum        │ Monotonic deque (flipped) |
 * | First non-repeating in stream │ Map + queue               |
 * | BFS                           │ queue (head pointer)      |
 * | Queue using two stacks        │ Amortised O(1) transfer   |
 * | Rate limiting / ring buffer   │ Fixed-capacity circular   |
 * | Producer/consumer             │ Ring buffer / deque       |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Array.shift as queue       │ O(n) → O(n²) queue             |
 * | Array.unshift as queue     │ O(n)                           |
 * | Ring buffer count missing  │ Full vs empty ambiguous        |
 * | Not clearing buf[head]     │ Memory leak (holds refs)       |
 * | Monotonic < vs <=          │ Duplicates handled differently |
 * | BFS with stack (DFS)       │ Wrong order                    |
 * | Deque via array.shift/pop  │ O(n) per op for large k        |
 * | No compaction              │ ArrayQueue grows unbounded     |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use an ArrayQueue with head pointer for general queues.
 *  - Use a ring buffer for fixed-capacity / streaming.
 *  - Use a linked-list Deque when you need true O(1) both ends.
 *  - Monotonic deque solves sliding-window min/max in O(n).
 *  - For BFS, head-pointer queue is idiomatic and fast.
 *  - For "stream" problems, pair a Map with a queue.
 *  - Two-stack queue: transfer lazily (only when out is empty).
 *  - Guard empty-queue cases explicitly; return undefined.
 *  - Always narrow indexed access in strict TypeScript.
 *  - Compact ArrayQueue periodically to bound memory.
 *  - Test with: empty queue, single element, full ring buffer,
 *    duplicate values, and large k in sliding window.
 *  - When the problem says "stream" or "level-by-level" →
 *    think queue.
 *  - In sliding-window problems, decide strict `<` vs `<=`
 *    based on duplicate handling.
 * ============================================================ */