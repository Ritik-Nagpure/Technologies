// 01_Complexity_Analysis_BigO.ts

/* ============================================================
 *  📘 COMPLEXITY ANALYSIS & BIG-O IN TYPESCRIPT
 *
 *  Complexity analysis describes HOW an algorithm's resource
 *  usage (time, memory) grows as input size grows. Big-O is the
 *  asymptotic upper bound, ignoring constants. Every DSA
 *  interview, every performance decision, and every algorithm
 *  comparison rests on this foundation.
 *
 *  This file covers: Big-O / Θ / Ω definitions, common growth
 *  classes, how to analyse loops and recursion, amortised
 *  analysis, space complexity, JavaScript-specific costs
 *  (Array, Map, Set, Object operations), and measurement tools.
 *
 *  Sections:
 *   1. Why complexity matters
 *   2. Big-O, Big-Ω, Big-Θ — definitions
 *   3. The common growth classes
 *   4. Analysing loops
 *   5. Analysing recursion (Master Theorem intuition)
 *   6. Amortised analysis
 *   7. Space complexity
 *   8. JS/TS-specific costs (Array, Map, Set, Object)
 *   9. Measuring in practice (performance.now, console.time)
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHY COMPLEXITY MATTERS
 * ============================================================ */
// 🔹 Two algorithms that both "work" can differ by 1000x on
//    large inputs.
// 🔹 Big-O lets us reason about that difference WITHOUT running.
// 🎯 Interviewers use it to check you can predict cost.
// 🔸 TypeScript adds a layer of type-checking at compile time,
//    but it compiles to JS — the RUNTIME cost is JS's cost.

// ⚠️ Rule: don't optimise by guessing — measure, then reason.
//    But before measuring, know the asymptotic shape.


/* ============================================================
 *  2️⃣ BIG-O, BIG-Ω, BIG-Θ — DEFINITIONS
 * ============================================================ */
// 🔹 Big-O   : upper bound — "grows NO FASTER than"
// 🔹 Big-Ω   : lower bound — "grows AT LEAST as fast as"
// 🔹 Big-Θ   : tight bound — "grows EXACTLY like" (O and Ω match)
// 🔸 In practice we usually say "O" but mean "Θ".

// Example: f(n) = 3n² + 5n + 7
//   → O(n²)   (upper)
//   → Ω(n²)   (lower)
//   → Θ(n²)   (tight)

// 🧠 Drop constants and lower-order terms:
//    3n² + 5n + 7  ≈  n²

// ⚠️ Big-O does NOT tell you which is faster for SMALL n —
//    constants dominate there. It only describes GROWTH.


/* ============================================================
 *  3️⃣ THE COMMON GROWTH CLASSES
 * ============================================================ */
// 🔹 Ordered from fastest to slowest:
//    O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2^n) < O(n!)

// 🔸 O(1) — constant
function getFirst(xs: readonly number[]): number {
  const first = xs[0];
  if (first === undefined) throw new Error("empty array");
  return first;
}

// 🔸 O(log n) — halving each step
function binarySearchDemo(xs: readonly number[], target: number): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;      // note: JS numbers — safe for typical sizes
    const val = xs[mid];
    if (val === undefined) return -1;
    if (val === target) return mid;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// 🔸 O(n) — single pass
function sumAll(xs: readonly number[]): number {
  let total = 0;
  for (const x of xs) total += x;
  return total;
}

// 🔸 O(n log n) — sort
function sortedCopy(xs: readonly number[]): number[] {
  return [...xs].sort((a, b) => a - b);   // JS sort is O(n log n)
}

// 🔸 O(n²) — nested loops over same n
function allPairs(xs: readonly number[]): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < xs.length; i++) {
    for (let j = 0; j < xs.length; j++) {
      const a = xs[i];
      const b = xs[j];
      if (a !== undefined && b !== undefined) out.push([a, b]);
    }
  }
  return out;
}

// 🔸 O(2^n) — branching recursion (naive Fibonacci)
function fibNaive(n: number): number {
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// 🔸 O(n!) — permutations (not shown; too slow to demo)

// 🧠 Practical limit: modern JS engines run ~10^8–10^9 simple
//    ops/sec in tight numeric loops; object/dynamic work is
//    slower (~10^7/s).
//    n=20 → 2^n ≈ 1M    (ok)
//    n=50 → 2^n ≈ 10^15 (way too slow)


/* ============================================================
 *  4️⃣ ANALYSING LOOPS
 * ============================================================ */
// 🔹 Sequential loops → ADD complexities.
// 🔸 Nested loops → MULTIPLY complexities.
// 🔸 Loop that halves → log n.
// 🔸 Loop with arithmetic step → n/step.

// Sequential: O(n) + O(n) = O(n)
function twoPasses(xs: readonly number[]): number {
  let total = 0;
  for (const x of xs) total += x;
  for (const x of xs) total -= x;
  return total;
}

// Nested: O(n) * O(n) = O(n²)
function matrixSum(m: readonly (readonly number[])[]): number {
  let total = 0;
  for (const row of m) {
    for (const v of row) total += v;
  }
  return total;
}

// Halving loop: O(log n)
function countHalvings(n: number): number {
  let steps = 0;
  let x = n;
  while (x > 1) {
    x = Math.floor(x / 2);
    steps += 1;
  }
  return steps;
}

// Doubling loop: O(log n)
function countDoublings(n: number): number {
  let i = 1;
  let steps = 0;
  while (i < n) {
    i *= 2;
    steps += 1;
  }
  return steps;
}

// Triangular loop: O(n²)
function triangular(n: number): number {
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) count += 1;
  }
  return count;
}

// ⚠️ Two DIFFERENT inputs → use both:
//    for a in A: for b in B: → O(|A| * |B|)
function cross(A: readonly number[], B: readonly number[]): number {
  let count = 0;
  for (const _a of A) for (const _b of B) count += 1;
  return count;
}

// 🧠 Cheat: count the DEEPEST nesting whose size depends on n,
//    add up the exponent at that level.


/* ============================================================
 *  5️⃣ ANALYSING RECURSION (MASTER THEOREM INTUITION)
 * ============================================================ */
// 🔹 For recursion T(n) = a * T(n/b) + f(n):
//    - a = number of subproblems
//    - n/b = size of each subproblem
//    - f(n) = work done at each level

// Example: binary search
//   T(n) = T(n/2) + O(1)  → O(log n)
function bsearch(
  xs: readonly number[],
  lo: number,
  hi: number,
  target: number,
): number {
  if (lo > hi) return -1;
  const mid = (lo + hi) >> 1;
  const val = xs[mid];
  if (val === undefined) return -1;
  if (val === target) return mid;
  if (val < target) return bsearch(xs, mid + 1, hi, target);
  return bsearch(xs, lo, mid - 1, target);
}

// Example: merge sort
//   T(n) = 2 T(n/2) + O(n) → O(n log n)
function mergeSort(xs: readonly number[]): number[] {
  if (xs.length <= 1) return [...xs];
  const mid = xs.length >> 1;
  const left = mergeSort(xs.slice(0, mid));
  const right = mergeSort(xs.slice(mid));
  return merge(left, right);
}

function merge(a: readonly number[], b: readonly number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const av = a[i];
    const bv = b[j];
    if (av === undefined || bv === undefined) break;
    if (av <= bv) {
      out.push(av);
      i += 1;
    } else {
      out.push(bv);
      j += 1;
    }
  }
  while (i < a.length) {
    const v = a[i];
    if (v !== undefined) out.push(v);
    i += 1;
  }
  while (j < b.length) {
    const v = b[j];
    if (v !== undefined) out.push(v);
    j += 1;
  }
  return out;
}

// Example: naive Fibonacci
//   T(n) = T(n-1) + T(n-2) + O(1) → O(2^n)
function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

// ⚠️ Recursion tree gives you the intuition when the Master
//    Theorem doesn't directly apply.
// 🧠 Rule: if a subproblem shrinks by HALF → log factor appears.
//    If it shrinks by ONE → linear chain.


/* ============================================================
 *  6️⃣ AMORTISED ANALYSIS
 * ============================================================ */
// 🔹 Average cost per operation over a SEQUENCE of operations.
// 🔸 A single op may be expensive, but rare.

// JS Array.prototype.push is amortised O(1):
//   - Most pushes: O(1)
//   - Occasionally, the engine resizes: O(n)
//   - Over n pushes → total work O(n) → O(1) amortised

const xs: number[] = [];
for (let i = 0; i < 1_000_000; i++) {
  xs.push(i);                        // feels O(1)
}

// ⚠️ Array.prototype.shift / unshift are O(n) EVERY time.
//    Use a deque-like structure (index pointer, or a custom
//    ring buffer) for queue-like workloads.

// ✅ Manual queue via head pointer — O(1) amortised dequeue
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
    // Optional: compact when head grows large
    if (this.head > 1024 && this.head * 2 > this.buf.length) {
      this.buf = this.buf.slice(this.head);
      this.head = 0;
    }
    return v;
  }
}

// 🧠 Common amortised O(1) ops:
//    - Array.push, Array.pop
//    - Map.set / Map.get / Map.has (average)
//    - Set.add / Set.has (average)
//
// 🧠 Common NOT amortised:
//    - Array.shift / Array.unshift → O(n)
//    - Array.splice in the middle → O(n)


/* ============================================================
 *  7️⃣ SPACE COMPLEXITY
 * ============================================================ */
// 🔹 Space complexity counts EXTRA memory used beyond input.
// 🔸 Recursion uses stack frames → O(depth) space.
// 🔸 In-place algorithms: O(1) extra.

// O(1) space — in-place reverse
function reverseInPlace(xs: number[]): void {
  let i = 0;
  let j = xs.length - 1;
  while (i < j) {
    const a = xs[i];
    const b = xs[j];
    if (a === undefined || b === undefined) break;
    xs[i] = b;
    xs[j] = a;
    i += 1;
    j -= 1;
  }
}

// O(n) space — build a new array
function reversedCopy(xs: readonly number[]): number[] {
  return [...xs].reverse();
}

// O(depth) stack space for recursion
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);       // depth = n → O(n) space
}

// 🧠 Rule: time and space trade off. Hashing trades space for
//    O(1) lookups. Memoisation trades space for time.


/* ============================================================
 *  8️⃣ JS/TS-SPECIFIC COSTS (ARRAY, MAP, SET, OBJECT)
 * ============================================================ */
// ── Array ────────────────────────────────────────────────────
// | Operation              │ Average      │ Notes                |
// |------------------------|--------------|----------------------|
// | xs[i]                  │ O(1)         │ index                |
// | xs.push(x)             │ O(1) amort.  │ end                  |
// | xs.pop()               │ O(1)         │ from end             |
// | xs.shift()             │ O(n)         │ shifts everything    |
// | xs.unshift(x)          │ O(n)         │ shifts               |
// | xs.includes(x)         │ O(n)         │ linear scan          |
// | xs.indexOf(x)          │ O(n)         │ linear scan          |
// | xs.sort(cmp)           │ O(n log n)   │ engine-dependent     |
// | xs.slice(a, b)         │ O(b-a)       │ copies               |
// | xs.splice(i, k, ...)   │ O(n)         │ shifts               |
// ─────────────────────────────────────────────────────────────
//
// ── Map / Set ────────────────────────────────────────────────
// | Operation              │ Average      │ Notes                |
// |------------------------|--------------|----------------------|
// | map.get / map.set      │ O(1)         │ key can be any value |
// | map.has / set.has      │ O(1)         │ —                    |
// | map.delete             │ O(1)         │ —                    |
// | iteration              │ O(n)         │ insertion order      |
// ─────────────────────────────────────────────────────────────
//
// ── Object as map (⚠️) ───────────────────────────────────────
// | Operation              │ Average      │ Notes                |
// |------------------------|--------------|----------------------|
// | obj[k] lookup          │ O(1)         │ but key is string    |
// | delete obj[k]          │ slow         │ hidden-class changes |
// | iteration              │ O(n)         │ —                    |
// ─────────────────────────────────────────────────────────────
// ⚠️ Use Map when keys are not strings, or when you delete often.
//    Prefer Map over Object for any real hashmap work.

// ── String ───────────────────────────────────────────────────
// | Operation              │ Cost                                |
// |------------------------|-------------------------------------|
// | s + t                  │ O(|s|+|t|) — copies!                |
// | s[i]                   │ O(1) — string index                 |
// | s.slice(a, b)          │ O(b-a)                              |
// | arr.join("")           │ O(total length) — preferred         |
// | s.replace(a, b)        │ O(n)                                |
// ⚠️ Building a string with += in a loop is O(n²).
//    Use an array + join("").

function badConcat(words: readonly string[]): string {
  let out = "";
  for (const w of words) out += w;   // O(n²)
  return out;
}

function goodConcat(words: readonly string[]): string {
  return words.join("");             // O(n)
}


/* ============================================================
 *  9️⃣ MEASURING IN PRACTICE
 * ============================================================ */
// 🔹 performance.now() — high-resolution timer
// 🔹 console.time / console.timeEnd — quick timing
// 🔹 Node: process.hrtime.bigint() for nanoseconds

function measure(label: string, fn: () => void): void {
  const t0 = performance.now();
  fn();
  const t1 = performance.now();
  console.log(`${label}: ${(t1 - t0).toFixed(2)} ms`);
}

// Micro-benchmark: push vs unshift
measure("push 100k", () => {
  const a: number[] = [];
  for (let i = 0; i < 100_000; i++) a.push(i);
});

measure("unshift 100k", () => {
  const a: number[] = [];
  for (let i = 0; i < 20_000; i++) a.unshift(i);   // fewer — it's slow
});

// 🔎 Practical rule:
//    - O(n²) becomes painful at n ≥ 5_000 in JS.
//    - O(n log n) is fine up to ~10^7.
//    - O(2^n) is fine only up to ~25.
//    - O(n!) is fine only up to ~10.

// 🧠 Use the browser devtools profiler or Node's --prof flag to
//    find hot spots BEFORE micro-optimising.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Nested loops do NOT always mean O(n²) — depends on bounds.
// ⚠️ Big-O hides constants — O(n) with constant 1000 loses to
//    O(n log n) for small n.
// ⚠️ Two different inputs (A, B) require O(|A|*|B|), not O(n²).
// ⚠️ Array.includes is O(n); Set.has is O(1) — pick wisely.
// ⚠️ String concatenation in loops is O(n²) — always join.
// ⚠️ Array.shift / unshift are O(n) — use a head pointer.
// ⚠️ Object as map has hidden-class penalties on delete — use Map.
// ⚠️ Numbers in JS are float64 — no integer overflow until 2^53.
// ⚠️ Bitwise ops coerce to 32-bit ints — beware with big values.
// ⚠️ Recursion depth in Node is limited (~10k–15k by default) —
//    use iterative versions for deep recursion.
// ⚠️ `Array.prototype.sort` converts to strings by default —
//    ALWAYS pass a comparator for numbers.
// ⚠️ TypeScript `readonly` is compile-time only — no runtime cost.
// ⚠️ TypeScript interfaces disappear at runtime — no runtime overhead.

/* 🕒 Version notes
 * - Map / Set: ES2015 (ES6)
 * - Array.prototype.includes: ES2016
 * - Async / await: ES2017
 * - BigInt: ES2020 (for integers beyond 2^53)
 * - Array.prototype.at: ES2022
 * - Array.prototype.findLast: ES2023
 * - Object.groupBy / Map.groupBy: ES2024
 * - TypeScript strict mode: TS 2.3+
 * - No native PriorityQueue in JS/TS — implement via heap
 * - Node ≥ 14 recommended for modern JS features
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Class         │ Name           │ Example                     |
 * ─────────────────────────────────────────────────────────────
 * | O(1)          │ Constant       │ arr[0], map.get(k)          |
 * | O(log n)      │ Logarithmic    │ binary search, halving      |
 * | O(n)          │ Linear         │ single pass                 |
 * | O(n log n)    │ Linearithmic   │ sort, merge sort            |
 * | O(n²)         │ Quadratic      │ nested loops                |
 * | O(n³)         │ Cubic          │ triple nested loops         |
 * | O(2^n)        │ Exponential    │ subsets, naive fib          |
 * | O(n!)         │ Factorial      │ permutations                |
 * ─────────────────────────────────────────────────────────────
 * | Loop pattern          │ Complexity                         |
 * ─────────────────────────────────────────────────────────────
 * | for (let i=0; i<n; i++)│ O(n)                              |
 * | nested i,j            │ O(n²)                              |
 * | while (n > 1) n >>= 1 │ O(log n)                           |
 * | i *= 2 until n        │ O(log n)                           |
 * | for a in A; for b in B│ O(|A|·|B|)                         |
 * ─────────────────────────────────────────────────────────────
 * | JS cost sheet         │ Cost                               |
 * ─────────────────────────────────────────────────────────────
 * | arr[i] / push / pop   │ O(1) / O(1) amort. / O(1)          |
 * | arr.shift / unshift   │ O(n)                               |
 * | arr.includes          │ O(n)                               |
 * | set.has / map.get     │ O(1) average                       |
 * | arr.join("")          │ O(total length)                    |
 * | s += t in loop        │ O(n²) total                        |
 * | arr.sort(cmp)         │ O(n log n)                         |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Drop constants blindly     │ small n behaviour differs      |
 * | Two-input loops as O(n²)   │ wrong when sizes differ        |
 * | arr.includes in loop       │ O(n) each → O(n²) total        |
 * | String concat in loop      │ O(n²)                          |
 * | shift/unshift              │ O(n) → use head pointer        |
 * | sort() without comparator  │ lexical sort for numbers       |
 * | Deep recursion             │ RangeError: stack overflow     |
 * | Object instead of Map      │ slow deletes, string keys only |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - State complexity for EVERY algorithm you write.
 *  - Analyse before you optimise; measure before you rewrite.
 *  - Prefer Set/Map for membership over Array.includes.
 *  - Use array.join() to build strings, never +=.
 *  - Use a head pointer (or class) instead of Array.shift.
 *  - Watch recursion depth; iterate when depth may exceed ~5000.
 *  - Always pass a comparator to sort() for numbers.
 *  - Prefer Map over plain Object for real hashmap work.
 *  - Big-O is about GROWTH, not absolute speed.
 *  - Trade space for time (memoisation, hashing) when it helps.
 *  - Profile with performance.now() or devtools; don't guess.
 * ============================================================ */