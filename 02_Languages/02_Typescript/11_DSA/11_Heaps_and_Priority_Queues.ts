// 11_Heaps_and_Priority_Queues.ts

/* ============================================================
 *  📘 HEAPS & PRIORITY QUEUES IN TYPESCRIPT
 *
 *  A HEAP is a complete binary tree stored in an array where each
 *  parent is ≤ (min-heap) or ≥ (max-heap) its children. Heaps give
 *  O(1) peek at the extremum and O(log n) push/pop.
 *
 *  JavaScript has NO built-in heap or priority queue (unlike
 *  Python's `heapq`). This file implements a MinHeap and a
 *  MaxHeap, covers the full API, and walks through the classic
 *  patterns (top-k, streaming median, k-way merge, Dijkstra).
 *
 *  Sections:
 *   1. What a heap is
 *   2. MinHeap implementation (from scratch)
 *   3. MaxHeap via comparator
 *   4. Heapify in O(n)
 *   5. heappushpop and heapreplace
 *   6. nlargest / nsmallest (without sorting)
 *   7. Heap of tuples (priority, value)
 *   8. Classic patterns (k-smallest, streaming median, k-way merge)
 *   9. Dijkstra preview
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A HEAP IS
 * ============================================================ */
// 🔹 Complete binary tree: filled left to right, no gaps.
// 🔸 Array layout:
//     parent(i)  = Math.floor((i - 1) / 2)
//     left(i)    = 2*i + 1
//     right(i)   = 2*i + 2
// 🔹 Min-heap: every parent ≤ its children → root is the min.
// 🔹 Max-heap: every parent ≥ its children → root is the max.
// 🎯 Heaps trade sorted order for fast extremum access.

// ── Complexity ───────────────────────────────────────────────
// | Operation          │ Cost        │ Notes                    |
// |--------------------|-------------|--------------------------|
// | peek (min)         │ O(1)        │ heap[0]                  |
// | push (heappush)    │ O(log n)    │ sift up                  |
// | pop (heappop)      │ O(log n)    │ sift down                |
// | push+pop combined  │ O(log n)    │ pushPop                  |
// | pop+push combined  │ O(log n)    │ replace                  |
// | build heap (heapify)│ O(n)       │ bottom-up sift           |
// | search arbitrary   │ O(n)        │ heap is not a search tree |
// | delete arbitrary   │ O(n) + log  │ find then sift           |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  2️⃣ MINHEAP IMPLEMENTATION (FROM SCRATCH)
 * ============================================================ */
// 🔹 Generic over T with a custom comparator.
// 🔸 Default comparator is numeric ascending — works for numbers.
// 🎯 Comparator convention: (a, b) => a - b for min-heap.
//    Negate it for max-heap: (a, b) => b - a.

type Comparator<T> = (a: T, b: T) => number;

class MinHeap<T> {
  private h: T[] = [];
  private readonly cmp: Comparator<T>;

  constructor(cmp: Comparator<T> = (a, b) => (a as any) - (b as any)) {
    this.cmp = cmp;
  }

  get size(): number {
    return this.h.length;
  }

  isEmpty(): boolean {
    return this.h.length === 0;
  }

  peek(): T | undefined {
    return this.h[0];
  }

  push(x: T): void {
    this.h.push(x);
    this.siftUp(this.h.length - 1);
  }

  pop(): T | undefined {
    if (this.h.length === 0) return undefined;
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length > 0 && last !== undefined) {
      this.h[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  // 🔸 heappushpop — push x then pop min, in O(log n).
  //    Slight win over push + pop and avoids growth if x > top.
  pushPop(x: T): T | undefined {
    if (this.h.length === 0) return x;
    const top = this.h[0];
    if (top !== undefined && this.cmp(x, top) > 0) {
      this.h[0] = x;
      this.siftDown(0);
      return top;
    }
    return x;
  }

  // 🔸 heapreplace — pop min then push x. Heap must be non-empty.
  replace(x: T): T | undefined {
    if (this.h.length === 0) {
      this.h.push(x);
      return undefined;
    }
    const top = this.h[0];
    this.h[0] = x;
    this.siftDown(0);
    return top;
  }

  // 🔸 Build from array — heapify in O(n).
  static from<T>(xs: readonly T[], cmp?: Comparator<T>): MinHeap<T> {
    const heap = new MinHeap<T>(cmp);
    heap.h = [...xs];
    for (let i = Math.floor(heap.h.length / 2) - 1; i >= 0; i--) {
      heap.siftDown(i);
    }
    return heap;
  }

  toArray(): readonly T[] {
    return [...this.h];
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      const a = this.h[i];
      const b = this.h[parent];
      if (a === undefined || b === undefined) break;
      if (this.cmp(a, b) >= 0) break;
      this.h[i] = b;
      this.h[parent] = a;
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.h.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      const cur = this.h[smallest];
      const lv = left < n ? this.h[left] : undefined;
      const rv = right < n ? this.h[right] : undefined;
      if (cur !== undefined && lv !== undefined && this.cmp(lv, cur) < 0) {
        smallest = left;
      }
      const sVal = this.h[smallest];
      if (sVal !== undefined && rv !== undefined && this.cmp(rv, sVal) < 0) {
        smallest = right;
      }
      if (smallest === i) break;
      const a = this.h[i];
      const b = this.h[smallest];
      if (a === undefined || b === undefined) break;
      this.h[i] = b;
      this.h[smallest] = a;
      i = smallest;
    }
  }
}


/* ============================================================
 *  3️⃣ MAXHEAP VIA COMPARATOR
 * ============================================================ */
// 🔹 Use MinHeap with a negated comparator.
// 🔸 Or subclass and override — both fine.

class MaxHeap<T> extends MinHeap<T> {
  constructor(cmp: Comparator<T> = (a, b) => (b as any) - (a as any)) {
    super(cmp);
  }
}

// ✅ Demo: MinHeap
const minH = new MinHeap<number>();
minH.push(5);
minH.push(1);
minH.push(3);
minH.push(2);
console.log(minH.peek());               // 1
console.log(minH.pop());                // 1
console.log(minH.pop());                // 2
console.log(minH.pop());                // 3
console.log(minH.pop());                // 5

// ✅ Demo: MaxHeap
const maxH = new MaxHeap<number>();
maxH.push(5);
maxH.push(1);
maxH.push(3);
maxH.push(2);
console.log(maxH.pop());                // 5
console.log(maxH.pop());                // 3
console.log(maxH.pop());                // 2
console.log(maxH.pop());                // 1


/* ============================================================
 *  4️⃣ HEAPIFY IN O(n)
 * ============================================================ */
// 🔹 MinHeap.from(xs) builds in O(n) via bottom-up sift-down.
// 🔸 Much faster than n pushes (which is O(n log n)).

const xs = [9, 4, 7, 1, 8, 2, 6];
const h = MinHeap.from(xs);
console.log(h.peek());                  // 1

const sorted: number[] = [];
while (!h.isEmpty()) {
  const v = h.pop();
  if (v !== undefined) sorted.push(v);
}
console.log(sorted);                    // [1, 2, 4, 6, 7, 8, 9]

// ⚠️ MinHeap.from MUTATES the source via [...xs] — that's fine
//    but be aware.
// 🧠 Use heapify when you have all data upfront; pushes for
//    streaming data.


/* ============================================================
 *  5️⃣ heappushpop AND heapreplace
 * ============================================================ */
// 🔹 pushPop(x): push x, then pop the smallest — faster than
//    separate calls when x is often larger than the top.
// 🔹 replace(x): pop the smallest, then push x — heap must be
//    non-empty.

const heap = new MinHeap<number>();
heap.push(1);
heap.push(3);
heap.push(5);

console.log(heap.pushPop(2));           // 1  (2 pushed, 1 popped)
console.log(heap.toArray().sort((a,b)=>a-b)); // [2, 3, 5]

console.log(heap.replace(10));          // 2  (2 popped, 10 pushed)
console.log(heap.toArray().sort((a,b)=>a-b)); // [3, 5, 10]

// 🎯 Sliding window maximum via heap: pushPop keeps size fixed.
// ⚠️ replace on empty returns undefined — treat carefully.
// ⚠️ pushPop returns the SMALLEST element after push (which may
//    be the pushed value itself).


/* ============================================================
 *  6️⃣ nlargest / nsmallest (WITHOUT SORTING)
 * ============================================================ */
// 🔹 Extract the k largest/smallest WITHOUT sorting the whole list.
// 🔸 O(n log k) when k << n.

function kLargest<T>(xs: readonly T[], k: number, cmp: Comparator<T>): T[] {
  if (k <= 0) return [];
  const heap = new MinHeap<T>(cmp);
  for (const x of xs) {
    heap.push(x);
    if (heap.size > k) heap.pop();
  }
  const out: T[] = [];
  while (!heap.isEmpty()) {
    const v = heap.pop();
    if (v !== undefined) out.push(v);
  }
  return out.reverse();
}

function kSmallest<T>(xs: readonly T[], k: number, cmp: Comparator<T>): T[] {
  if (k <= 0) return [];
  const heap = new MaxHeap<T>(cmp);
  for (const x of xs) {
    heap.push(x);
    if (heap.size > k) heap.pop();
  }
  const out: T[] = [];
  while (!heap.isEmpty()) {
    const v = heap.pop();
    if (v !== undefined) out.push(v);
  }
  return out.reverse();
}

const nums = [9, 1, 8, 2, 7, 3, 6, 4, 5];
console.log(kLargest(nums, 3, (a, b) => a - b));   // [9, 8, 7]
console.log(kSmallest(nums, 3, (a, b) => a - b));  // [1, 2, 3]

// 🔸 With a key function (top-3 by length)
const words = ["cat", "elephant", "dog", "hippopotamus", "ox"];
console.log(kLargest(words, 2, (a, b) => a.length - b.length));
// ["hippopotamus", "elephant"]

// 🧠 For small k, heap-based top-k beats sorting O(n log n).
//    For k ≈ n, sorting is faster and simpler.


/* ============================================================
 *  7️⃣ HEAP OF TUPLES (PRIORITY, VALUE)
 * ============================================================ */
// 🔹 Use a comparator that looks at the first element (priority).
// 🔸 Add a tiebreaker index when values are not comparable.

type Task = [priority: number, tiebreak: number, label: string];

const tasks = new MinHeap<Task>((a, b) => {
  if (a[0] !== b[0]) return a[0] - b[0];   // priority first
  return a[1] - b[1];                       // then tiebreaker (FIFO)
});

let counter = 0;
for (const [priority, label] of [
  [2, "write report"] as [number, string],
  [1, "fix bug"] as [number, string],
  [3, "code review"] as [number, string],
  [1, "reply email"] as [number, string],   // same priority → FIFO
]) {
  tasks.push([priority, counter++, label]);
}

while (!tasks.isEmpty()) {
  const t = tasks.pop();
  if (t !== undefined) console.log(t[0], t[2]);
}
// 1 fix bug
// 1 reply email
// 2 write report
// 3 code review

// 🧠 The counter also gives FIFO for equal priorities — a very
//    handy idiom for schedulers and Dijkstra with ties.


/* ============================================================
 *  8️⃣ CLASSIC PATTERNS
 * ============================================================ */
// 🔹 K-SMALLEST — keep a max-heap of size k
function kSmallestArr(xs: readonly number[], k: number): number[] {
  return kSmallest(xs, k, (a, b) => a - b).sort((a, b) => a - b);
}

console.log(kSmallestArr([5, 1, 4, 2, 3, 9, 7], 3));   // [1, 2, 3]

// 🔹 K-LARGEST — keep a min-heap of size k
function kLargestArr(xs: readonly number[], k: number): number[] {
  return kLargest(xs, k, (a, b) => a - b).sort((a, b) => a - b);
}

console.log(kLargestArr([5, 1, 4, 2, 3, 9, 7], 3));    // [5, 7, 9]

// 🔹 STREAMING MEDIAN — two heaps: max-heap for lows, min-heap
//    for highs.
class MedianFinder {
  private low = new MaxHeap<number>((a, b) => a - b);   // max at top
  private high = new MinHeap<number>((a, b) => a - b);  // min at top

  add(x: number): void {
    // Push to low (max-heap)
    this.low.push(x);
    // Move the largest of lows to highs
    const top = this.low.pop();
    if (top !== undefined) this.high.push(top);
    // Rebalance
    if (this.high.size > this.low.size) {
      const h = this.high.pop();
      if (h !== undefined) this.low.push(h);
    }
  }

  median(): number {
    if (this.low.size > this.high.size) {
      return this.low.peek() ?? 0;
    }
    const l = this.low.peek() ?? 0;
    const h = this.high.peek() ?? 0;
    return (l + h) / 2;
  }
}

const mf = new MedianFinder();
for (const x of [1, 5, 3, 2, 4]) {
  mf.add(x);
  console.log(x, "→ median", mf.median());
}
// 1 → 1
// 5 → 3
// 3 → 3
// 2 → 2.5
// 4 → 3

// 🔹 K-WAY MERGE — merge k sorted arrays
function mergeKSorted(lists: readonly (readonly number[])[]): number[] {
  type Entry = [value: number, listIdx: number, pos: number];
  const heap = new MinHeap<Entry>((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  for (let i = 0; i < lists.length; i++) {
    const lst = lists[i];
    if (lst && lst.length > 0) {
      const v = lst[0];
      if (v !== undefined) heap.push([v, i, 0]);
    }
  }
  const out: number[] = [];
  while (!heap.isEmpty()) {
    const e = heap.pop();
    if (e === undefined) break;
    const [val, i, pos] = e;
    out.push(val);
    const list = lists[i];
    if (list && pos + 1 < list.length) {
      const nextVal = list[pos + 1];
      if (nextVal !== undefined) heap.push([nextVal, i, pos + 1]);
    }
  }
  return out;
}

console.log(mergeKSorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]));
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 🧠 Pattern: "top k" → fixed-size heap. "Streaming" → two
//    heaps. "K sorted inputs" → k-way merge.


/* ============================================================
 *  9️⃣ DIJKSTRA PREVIEW
 * ============================================================ */
// 🔹 Min-heap of (distance, node) is the core of Dijkstra.
// 🔸 Full treatment in file 23.

type WeightedAdj<T extends string | number> = Map<T, Array<[T, number]>>;

function dijkstra<T extends string | number>(
  graph: WeightedAdj<T>,
  src: T,
): Map<T, number> {
  const dist = new Map<T, number>();
  dist.set(src, 0);
  const heap = new MinHeap<[number, T]>((a, b) => a[0] - b[0]);
  heap.push([0, src]);
  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (top === undefined) break;
    const [d, u] = top;
    const cur = dist.get(u);
    if (cur !== undefined && d > cur) continue;   // stale
    const neighbours = graph.get(u) ?? [];
    for (const [v, w] of neighbours) {
      const nd = d + w;
      const old = dist.get(v);
      if (old === undefined || nd < old) {
        dist.set(v, nd);
        heap.push([nd, v]);
      }
    }
  }
  return dist;
}

const wg: WeightedAdj<string> = new Map();
wg.set("A", [["B", 1], ["C", 4]]);
wg.set("B", [["C", 2], ["D", 5]]);
wg.set("C", [["D", 1]]);
wg.set("D", []);
console.log(dijkstra(wg, "A"));
// Map { 'A' => 0, 'B' => 1, 'C' => 3, 'D' => 4 }


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ There is NO built-in heap/priority queue in JS or TS.
//    You must implement one (as above) or use a library.
// ⚠️ Comparator convention: (a, b) => a - b returns negative if
//    a < b — that's a MIN-heap. Reverse for max-heap.
// ⚠️ Comparator must be CONSISTENT — otherwise the heap property
//    can be silently violated.
// ⚠️ Comparator must return a number, not a boolean.
//    (a, b) => a < b is wrong — returns boolean, coerced to 0/1.
// ⚠️ peek on empty heap → undefined.
// ⚠️ pop on empty heap → undefined (no throw).
// ⚠️ replace on empty → undefined.
// ⚠️ Modifying h[] directly breaks the invariant — use the API.
// ⚠️ Heap is NOT sorted. Iterating gives no order.
// ⚠️ Searching for arbitrary element is O(n) — heaps are not
//    search trees.
// ⚠️ Dijkstra stale entries: check `if (d > dist[u]) continue`.
// ⚠️ For objects as elements, provide a comparator that uses
//    a scalar key (e.g., object.distance).
// ⚠️ Recursion-free — all heap operations are iterative.

/* 🕒 Version notes
 * - No built-in heap in ES* or TypeScript
 * - Array-based implementation works in all JS runtimes
 * - Generators for lazy heap iteration: ES2015
 * - Map iteration order is insertion order — useful for tie-break
 * - BigInt for very large values: ES2020
 * - PriorityQueue is NOT part of the JS standard — implement
 *   or use a library (e.g., @datastructures-js/priority-queue)
 * - For huge workloads, consider WASM or C++ bindings
 * - Node.js: p-limit, p-queue for promise scheduling, not
 *   priority queues
 * - structuredClone: Node 17+ / modern browsers (not for heaps
 *   directly — but for cloning source arrays)
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation               │ Cost       │ Function            |
 * ─────────────────────────────────────────────────────────────
 * | Build from array        │ O(n)       │ MinHeap.from        |
 * | Push                    │ O(log n)   │ push                |
 * | Pop min                 │ O(log n)   │ pop                 |
 * | Peek min                │ O(1)       │ peek                |
 * | Push + pop              │ O(log n)   │ pushPop             |
 * | Pop + push              │ O(log n)   │ replace             |
 * | k largest               │ O(n log k) │ kLargest            |
 * | k smallest              │ O(n log k) │ kSmallest           |
 * | Merge k sorted          │ O(n log k) │ mergeKSorted        |
 * | Arbitrary search        │ O(n)       │ —                   |
 * ─────────────────────────────────────────────────────────────
 * | Pattern              │ Technique                            |
 * ─────────────────────────────────────────────────────────────
 * | Top-k smallest       │ max-heap of size k                   |
 * | Top-k largest        │ min-heap of size k                   |
 * | Streaming median     │ two heaps (max + min)                |
 * | K-way merge          │ heap of (value, list, pos)           |
 * | Dijkstra             │ heap of (dist, node)                 |
 * | Task scheduler       │ heap of (priority, counter, task)    |
 * | Sliding window max   │ max-heap + lazy delete               |
 * | Fixed-size buffer    │ pushPop / replace                    |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | No built-in heap           │ Must implement yourself         |
 * | Wrong comparator direction │ Min/Max confusion               |
 * | Comparator returns boolean │ Coerced to 0/1 → broken order   |
 * | Inconsistent comparator    │ Heap invariant silently broken  |
 * | pop on empty               │ undefined — handle it           |
 * | replace on empty           │ undefined — handle it           |
 * | Direct h[i] mutation       │ Breaks invariant                |
 * | Assuming heap is sorted    │ It isn't                        |
 * | Search in heap             │ O(n), not O(log n)              |
 * | Object without comparator  │ Wrong order                     |
 * | Dijkstra stale entries     │ Wrong distances                 |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Implement a typed Heap class once — reuse everywhere.
 *  - Use a comparator function; keep it pure and consistent.
 *  - Always return a number from the comparator.
 *  - Build with MinHeap.from(xs) when you have all items.
 *  - For top-k, use a FIXED-SIZE heap — don't heap the whole
 *    list.
 *  - Streaming median = max-heap (lows) + min-heap (highs).
 *  - Dijkstra: push (distance, node), skip stale pops.
 *  - Guard against empty heap before pop / replace.
 *  - Never modify the internal array directly — use the API.
 *  - Remember: heaps are NOT sorted; only the root is guaranteed.
 *  - For priority queue with ties, add a counter as tiebreaker.
 *  - For object elements, wrap in a tuple with an explicit
 *    comparator key.
 *  - Test with: empty heap, single element, all equal, sorted
 *    input, reverse-sorted, and negative numbers.
 * ============================================================ */