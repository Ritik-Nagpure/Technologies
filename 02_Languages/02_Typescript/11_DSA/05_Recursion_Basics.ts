// 05_Recursion_Basics.ts

/* ============================================================
 *  📘 RECURSION BASICS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Recursion is a function calling itself to solve smaller
 *  instances of the same problem. Every recursion needs a BASE
 *  CASE (stop condition) and a RECURSIVE CASE that moves toward
 *  it. Once mastered, recursion unlocks trees, graphs,
 *  backtracking, divide & conquer, and DP.
 *
 *  This file covers: the anatomy of recursion, call stack,
 *  recursion vs iteration, V8's stack limits, tail recursion
 *  (and why V8 doesn't optimise it), the divide & conquer
 *  pattern, branching recursion, memoisation, and the classic
 *  problems (factorial, fibonacci, towers of Hanoi,
 *  permutations, subsets, binary search).
 *
 *  Sections:
 *   1. What recursion is
 *   2. Anatomy: base case + recursive case
 *   3. The call stack (visual)
 *   4. Recursion vs iteration
 *   5. V8's stack limit and RangeError
 *   6. Tail recursion — and why it doesn't help
 *   7. Divide & conquer pattern
 *   8. Multiple recursion (branching)
 *   9. Memoisation with Map
 *  10. Classic recursion problems
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT RECURSION IS
 * ============================================================ */
// 🔹 A function that calls ITSELF on a smaller input.
// 🔹 Every recursion can be written iteratively (and vice versa).
// 🔸 Recursion shines when the problem is naturally self-similar.
// 🎯 Rule: solve f(n) by calling f(n-1) (or n/2, etc.).

// The classic: factorial
//   5! = 5 * 4 * 3 * 2 * 1 = 120
//   n! = n * (n-1)! ,  0! = 1

function factorial(n: number): number {
  if (n <= 1) return 1;             // base case
  return n * factorial(n - 1);      // recursive case
}

console.log(factorial(5));          // 120
console.log(factorial(0));          // 1

// 🧠 Two rules ALWAYS:
//   1. There MUST be a base case that does not recurse.
//   2. Every recursive call MUST move toward the base case.


/* ============================================================
 *  2️⃣ ANATOMY: BASE CASE + RECURSIVE CASE
 * ============================================================ */
// 🔹 Base case: the "smallest" input — return directly.
// 🔸 Recursive case: reduce the problem, call self, combine.
// 🎯 If either is missing → infinite recursion → RangeError.

function sumList(xs: readonly number[]): number {
  if (xs.length === 0) return 0;      // base case
  const first = xs[0];
  if (first === undefined) return 0;
  return first + sumList(xs.slice(1));// recursive case
}

console.log(sumList([1, 2, 3, 4, 5]));  // 15

// ⚠️ Multiple base cases are common:
function fib(n: number): number {
  if (n < 2) return n;                // base cases: fib(0)=0, fib(1)=1
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(10));                   // 55

// ⚠️ Wrong base case → wrong result or infinite recursion:
function broken(n: number): number {
  if (n === 0) return 0;
  return broken(n - 1);
}
// broken(-1);  would recurse forever (never hits 0)

// 🧠 Write the base case FIRST. Then assume it works, and write
//    the recursive case ("leap of faith").


/* ============================================================
 *  3️⃣ THE CALL STACK (VISUAL)
 * ============================================================ */
// 🔹 Each call pushes a frame onto the call stack.
// 🔸 When the base case returns, frames POP in reverse order.
// 🔸 Stack depth = recursion depth = memory cost.

function countdown(n: number): void {
  if (n <= 0) {
    console.log("done");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(3);
// Output: 3
//         2
//         1
//         done

// 🔎 Trace for countdown(3):
//   countdown(3) → prints 3, calls countdown(2)
//     countdown(2) → prints 2, calls countdown(1)
//       countdown(1) → prints 1, calls countdown(0)
//         countdown(0) → prints "done", returns
//       returns
//     returns
//   returns

// 🧠 Draw the stack on paper. Every "return" pops one frame.


/* ============================================================
 *  4️⃣ RECURSION VS ITERATION
 * ============================================================ */
// 🔹 Recursion : elegant, mirrors the math, uses stack memory.
// 🔹 Iteration : faster, less memory, sometimes less readable.
// 🔸 V8 has a hard stack limit (~10k–15k frames by default).

// Recursive factorial
function factRec(n: number): number {
  return n <= 1 ? 1 : n * factRec(n - 1);
}

// Iterative factorial — same result, no stack risk
function factIter(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

console.log(factRec(10), factIter(10));   // 3628800 3628800

// Performance note: recursion is usually SLOWER in JS due to
// function-call overhead and possibly deoptimised shapes.
// Prefer iteration when it's natural.

// 🧠 Rule of thumb:
//   - Trees/graphs/backtracking → recursion is natural.
//   - Simple counting/summing → iteration wins.
//   - Deep recursion (n > 5000) → prefer iteration or BFS.


/* ============================================================
 *  5️⃣ V8'S STACK LIMIT AND RangeError
 * ============================================================ */
// 🔹 Default limit in V8 (Node / Chrome): a few thousand frames.
//    Actual number depends on frame size and other factors.
// 🔸 Exceeding it → "RangeError: Maximum call stack size exceeded".

function deep(n: number): number {
  if (n === 0) return 0;
  return 1 + deep(n - 1);
}

console.log(deep(500));         // 500 (usually OK)
// console.log(deep(20_000));   // ❌ RangeError

// ✅ Rewrite as iteration to avoid the limit:
function deepIter(n: number): number {
  let count = 0;
  while (n > 0) {
    count += 1;
    n -= 1;
  }
  return count;
}

console.log(deepIter(1_000_000));   // 1000000

// ⚠️ There is NO reliable sys.setRecursionLimit in JS — V8 does
//    not expose one. You must rewrite or use a manual stack.
// 🧠 If recursion depth could exceed ~5000, plan an iterative
//    alternative BEFORE writing code.

// 🔸 Manual stack version of deep():
function deepStack(n: number): number {
  const stack: number[] = [n];
  let total = 0;
  while (stack.length > 0) {
    const cur = stack.pop();
    if (cur === undefined) break;
    if (cur === 0) continue;
    total += 1;
    stack.push(cur - 1);
  }
  return total;
}

console.log(deepStack(100_000));    // 100000


/* ============================================================
 *  6️⃣ TAIL RECURSION — AND WHY IT DOESN'T HELP
 * ============================================================ */
// 🔹 Tail recursion = the recursive call is the LAST action.
// 🔸 Some languages optimise this into a loop (TCO).
// 🔸 V8 does NOT do TCO — every call still pushes a frame.

function tailFact(n: number, acc: number = 1): number {
  if (n <= 1) return acc;
  return tailFact(n - 1, n * acc);   // tail call — but no TCO in V8
}

console.log(tailFact(5));            // 120

// ⚠️ Even though this LOOKS tail-recursive, V8 still hits the
//    same stack limit. Convert to a loop manually:
function loopFact(n: number): number {
  let acc = 1;
  while (n > 1) {
    acc *= n;
    n -= 1;
  }
  return acc;
}

console.log(loopFact(5));            // 120

// 🧠 Rule: write tail recursion if it reads well, but don't
//    expect the engine to optimise it. Safari/JSC used to have
//    TCO but removed it under spec pressure — do NOT rely on it.


/* ============================================================
 *  7️⃣ DIVIDE & CONQUER PATTERN
 * ============================================================ */
// 🔹 Split the problem in half, solve each half, combine.
// 🔸 Classic: binary search, merge sort, quick sort.
// 🎯 Complexity usually O(n log n) instead of O(n²).

function binarySearch(xs: readonly number[], target: number): number {
  function bs(lo: number, hi: number): number {
    if (lo > hi) return -1;
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined) return -1;
    if (val === target) return mid;
    if (val < target) return bs(mid + 1, hi);
    return bs(lo, mid - 1);
  }
  return bs(0, xs.length - 1);
}

console.log(binarySearch([1, 3, 5, 7, 9], 7));   // 3
console.log(binarySearch([1, 3, 5, 7, 9], 4));   // -1

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

console.log(mergeSort([5, 2, 9, 1, 7]));    // [1, 2, 5, 7, 9]

// 🧠 Divide & conquer rule:
//   T(n) = a * T(n/b) + O(f(n))
//   → merge sort: 2 * T(n/2) + O(n) = O(n log n)
//   → binary search: T(n/2) + O(1) = O(log n)


/* ============================================================
 *  8️⃣ MULTIPLE RECURSION (BRANCHING)
 * ============================================================ */
// 🔹 When a function calls itself MULTIPLE times per call.
// 🔸 Creates a recursion tree, not a chain.
// 🎯 Naive Fibonacci, subsets, permutations, tree traversals.

function fibNaive(n: number): number {
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);   // TWO calls
}

// 🔎 Number of calls grows like O(2^n) — 40th fib = 300M+ calls.
// 🧠 FIX: memoise (see next section).

function subsets(xs: readonly number[]): number[][] {
  if (xs.length === 0) return [[]];
  const [first, ...rest] = xs;
  if (first === undefined) return [[]];
  const without = subsets(rest);                  // branch 1
  const withFirst = without.map((s) => [first, ...s]); // branch 2
  return [...without, ...withFirst];
}

console.log(subsets([1, 2, 3]));
// [[], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]]

function permutations(xs: readonly number[]): number[][] {
  if (xs.length <= 1) return [[...xs]];
  const out: number[][] = [];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;
    const rest = [...xs.slice(0, i), ...xs.slice(i + 1)];
    for (const p of permutations(rest)) out.push([x, ...p]);
  }
  return out;
}

console.log(permutations([1, 2, 3]));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

// 🧠 Branching recursion is powerful but expensive:
//   - subsets     → O(2^n)
//   - permutations→ O(n!)
//   - naive fib   → O(2^n) (or ~1.618^n)
//   Memoise or use DP when subproblems overlap.


/* ============================================================
 *  9️⃣ MEMOISATION WITH MAP
 * ============================================================ */
// 🔹 Cache results of expensive recursive calls by argument.
// 🔸 Turns overlapping-subproblem recursions from exponential
//    to polynomial.
// 🎯 Standard tool: a Map inside the function (or closure).

function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n < 2) return n;
  const cached = memo.get(n);
  if (cached !== undefined) return cached;
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fibMemo(40));               // 102334155 (instant)

// ✅ Cleaner: closure-scoped memo
function makeFib(): (n: number) => number {
  const memo = new Map<number, number>();
  return function fib(n: number): number {
    if (n < 2) return n;
    const cached = memo.get(n);
    if (cached !== undefined) return cached;
    const r = fib(n - 1) + fib(n - 2);
    memo.set(n, r);
    return r;
  };
}

const fastFib = makeFib();
console.log(fastFib(40));               // 102334155

// 🔸 Multi-arg memoisation: key by a serialised string
function countPaths(
  rows: number,
  cols: number,
  memo: Map<string, number> = new Map(),
): number {
  if (rows === 1 || cols === 1) return 1;
  const key = `${rows},${cols}`;
  const cached = memo.get(key);
  if (cached !== undefined) return cached;
  const result =
    countPaths(rows - 1, cols, memo) + countPaths(rows, cols - 1, memo);
  memo.set(key, result);
  return result;
}

console.log(countPaths(3, 3));          // 6

// ⚠️ Memo keys must uniquely identify the subproblem — object
//    arguments need serialisation.
// ⚠️ Beware unbounded memo growth — consider a size cap.
// ⚠️ For methods, `this` isn't part of the key — wrap carefully.

// 🧠 Rule: if you see the SAME subproblem called twice, memoise.
//    Time drops from O(2^n) to O(states × cost per state).


/* ============================================================
 *  🔟 CLASSIC RECURSION PROBLEMS
 * ============================================================ */
// 🔹 TOWERS OF HANOI — 3 pegs, move n disks from A to C.
//    Moves = 2^n - 1. Base case n=1.
function hanoi(n: number, src: string, dst: string, aux: string): void {
  if (n === 1) {
    console.log(`move disk 1: ${src} -> ${dst}`);
    return;
  }
  hanoi(n - 1, src, aux, dst);
  console.log(`move disk ${n}: ${src} -> ${dst}`);
  hanoi(n - 1, aux, dst, src);
}

hanoi(3, "A", "C", "B");
// Output (7 lines): moves disk 1..3 through the pegs

// 🔹 GCD (Euclid's algorithm) — O(log min(a, b))
function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

console.log(gcd(48, 18));               // 6

// 🔹 POWER (fast exponentiation) — O(log exp)
function power(base: number, exp: number): number {
  if (exp === 0) return 1;
  if (exp % 2 === 0) {
    const half = power(base, exp / 2);
    return half * half;
  }
  return base * power(base, exp - 1);
}

console.log(power(2, 10));              // 1024

// 🔹 FLATTEN NESTED ARRAY
type Nested = number | Nested[];
function flatten(xs: readonly Nested[]): number[] {
  const out: number[] = [];
  for (const x of xs) {
    if (Array.isArray(x)) out.push(...flatten(x));
    else out.push(x);
  }
  return out;
}

console.log(flatten([1, [2, [3, 4]], 5]));   // [1, 2, 3, 4, 5]

// 🔹 REVERSE A STRING
function reverseStr(s: string): string {
  if (s.length <= 1) return s;
  return reverseStr(s.slice(1)) + s[0];
}

console.log(reverseStr("hello"));       // "olleh"

// 🔹 COUNT OCCURRENCES
function countOccurrences(xs: readonly number[], target: number): number {
  if (xs.length === 0) return 0;
  const first = xs[0];
  if (first === undefined) return 0;
  return (first === target ? 1 : 0) + countOccurrences(xs.slice(1), target);
}

console.log(countOccurrences([1, 2, 1, 3, 1], 1));  // 3

// 🔹 TREE-STYLE recursion — sum of nested structure
function nestedSum(data: Nested): number {
  if (typeof data === "number") return data;
  let total = 0;
  for (const x of data) total += nestedSum(x);
  return total;
}

console.log(nestedSum([1, [2, [3, 4]], 5]));    // 15

// 🧠 Pattern: "solve for n using answer for n-1 / n/2" → recursion.


/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Missing base case → RangeError (stack overflow).
// ⚠️ Base case that never triggers → RangeError.
// ⚠️ Recursive call must SHRINK the input toward the base case.
// ⚠️ V8's default recursion limit is ~10k frames but depends on
//    frame size. DON'T rely on a specific number.
// ⚠️ No TCO in V8 — tail recursion still uses stack frames.
// ⚠️ Branching recursion without memoisation explodes fast.
// ⚠️ Slicing an array inside recursion (xs.slice(1)) copies —
//    O(n²) total. Pass indices instead when it matters.
function sumIndices(xs: readonly number[], i: number = 0): number {
  if (i === xs.length) return 0;
  const v = xs[i];
  if (v === undefined) return 0;
  return v + sumIndices(xs, i + 1);     // O(n) time, no slices
}
console.log(sumIndices([1, 2, 3, 4, 5]));   // 15

// ⚠️ Mutable default argument in recursion is a classic bug:
function collectBad(n: number, acc: number[] = []): number[] {   // ❌ shared
  if (n === 0) return acc;
  acc.push(n);
  return collectBad(n - 1, acc);
}
// ✅ Fix: pass null and create inside, or explicitly pass fresh arrays
function collectOk(n: number, acc: number[] | null = null): number[] {
  const a = acc ?? [];
  if (n === 0) return a;
  a.push(n);
  return collectOk(n - 1, a);
}
console.log(collectOk(3));              // [3, 2, 1]

// ⚠️ Map-based memo can grow unboundedly — cap it if needed.
// ⚠️ Memo key collisions: use `${a},${b}` with separator that
//    cannot occur in inputs, or JSON.stringify.
// ⚠️ Do NOT memoise functions with side effects.
// ⚠️ For methods with `this`, memoise on a closure, not the
//    method itself — `this` isn't part of the key.
// ⚠️ Recursion over huge trees (filesystem, deep JSON) can
//    overflow — use an explicit stack.
// ⚠️ `console.log` inside deep recursion adds overhead — log
//    sparingly.

/* 🕒 Version notes
 * - No TCO in V8 (Chrome / Node). Safari had it, removed it.
 * - Tail call proposal (ES2015) never shipped broadly.
 * - WeakMap-based memo caches: ES2015+
 * - Spread operators in recursion (permutations): ES2015+
 * - Array.prototype.flat for flatten: ES2019
 * - Array.prototype.flatMap: ES2019
 * - structuredClone: Node 17+
 * - Intl.Segmenter: ES2022
 * - No built-in memoisation primitive — write your own Map cache
 * - "use strict" mode improves stack traces but doesn't raise limits
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept              │ Notes                              |
 * ─────────────────────────────────────────────────────────────
 * | Base case            │ Stops recursion                    |
 * | Recursive case       │ Shrinks input toward base          |
 * | Call stack depth     │ = recursion depth = memory         |
 * | V8 limit             │ ~10k frames (depends on frame size)|
 * | Tail recursion       │ NOT optimised in V8                |
 * | Memoisation          │ Cache results by args (Map)        |
 * | Divide & conquer     │ Split in halves, combine           |
 * | Branching recursion  │ Explodes without memoisation       |
 * ─────────────────────────────────────────────────────────────
 * | Common problem        │ Complexity                         |
 * ─────────────────────────────────────────────────────────────
 * | Factorial (rec)       │ O(n) time, O(n) space              |
 * | Fibonacci (naive)     │ O(2^n)                             |
 * | Fibonacci (memo)      │ O(n) time, O(n) space              |
 * | Merge sort            │ O(n log n) time, O(n) space        |
 * | Binary search (rec)   │ O(log n) time, O(log n) space      |
 * | Subsets               │ O(2^n)                             |
 * | Permutations          │ O(n!)                              |
 * | Towers of Hanoi       │ O(2^n) moves                       |
 * ─────────────────────────────────────────────────────────────
 * | Tool                    │ Purpose                          |
 * ─────────────────────────────────────────────────────────────
 * | Map<key, value>         │ Memoisation cache                |
 * | WeakMap<obj, value>     │ Memo keyed by object identity    |
 * | closure                 │ Encapsulate memo                 |
 * | explicit stack (arr)    │ Convert recursion → iteration    |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Missing base case           │ RangeError: stack overflow     |
 * | Base case never hit         │ RangeError                     |
 * | Tail recursion expectation  │ No TCO in V8                   |
 * | Slicing xs.slice(1) inside  │ O(n²) copies                   |
 * | Mutable default in recursion│ Shared across calls            |
 * | Unmemoised branching        │ Exponential blow-up            |
 * | Memo key collisions         │ Wrong cached result            |
 * | Deep recursion on trees     │ Stack overflow                 |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Always write the base case FIRST.
 *  - Verify every recursive call moves toward the base case.
 *  - Draw the recursion tree for branching problems.
 *  - Memoise whenever subproblems repeat (fib, paths, DP).
 *  - Prefer indices over slices to avoid O(n²) copying.
 *  - Convert deep recursion (n > 5000) to iteration/BFS.
 *  - Don't expect tail-call optimisation in V8.
 *  - Use Map for memoisation; WeakMap for object-keyed caches.
 *  - Watch out for mutable defaults in recursive functions.
 *  - Use explicit stack when you need to control order or
 *    avoid overflow.
 *  - Test with edge cases: n=0, n=1, empty input, single element,
 *    negative input (if applicable), and deep chains.
 *  - Prefer iteration when depth could be unbounded.
 * ============================================================ */