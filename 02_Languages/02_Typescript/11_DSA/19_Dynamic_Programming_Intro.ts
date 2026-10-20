// 19_Dynamic_Programming_Intro.ts

/* ============================================================
 *  📘 DYNAMIC PROGRAMMING INTRO IN TYPESCRIPT
 *
 *  Dynamic Programming (DP) = recursion + memoisation, or
 *  equivalently, building a table bottom-up. DP solves problems
 *  with OVERLAPPING SUBPROBLEMS and OPTIMAL SUBSTRUCTURE by
 *  computing each subproblem ONCE. It converts exponential
 *  brute force into polynomial time.
 *
 *  This file covers: when DP applies, top-down (memo) vs
 *  bottom-up (tabulation), classic problems (fib, climbing
 *  stairs, knapsack, LIS, edit distance, coin change, LCS),
 *  space optimisation, and pattern recognition.
 *
 *  Sections:
 *   1. When DP applies
 *   2. Top-down memoisation vs bottom-up tabulation
 *   3. Fibonacci — the "hello world" of DP
 *   4. Climbing stairs
 *   5. 0/1 Knapsack
 *   6. Unbounded knapsack / coin change
 *   7. Longest Increasing Subsequence (LIS)
 *   8. Longest Common Subsequence (LCS)
 *   9. Edit distance (Levenshtein)
 *  10. Space optimisation (rolling arrays)
 *  11. Pattern recognition guide
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHEN DP APPLIES
 * ============================================================ */
// 🔹 Two conditions:
//     1. OVERLAPPING SUBPROBLEMS — same subproblem solved many times.
//     2. OPTIMAL SUBSTRUCTURE   — best answer built from best
//        answers to subproblems.
// 🔸 If both hold → DP turns exponential into polynomial.
// 🎯 Signal words: "count ways", "minimum/maximum cost",
//    "longest/shortest", "can we achieve", "subsequence",
//    "subarray", "partition".

// 🔸 Two flavours:
//     • Optimisation    → min/max some value
//     • Counting        → number of ways
//     • Decision        → True/False reachable

// 🧠 Steps to a DP solution:
//     1. Define the STATE (what parameters describe a subproblem).
//     2. Write the RECURRENCE (how state i depends on smaller).
//     3. Set BASE CASES.
//     4. Decide ORDER (bottom-up) or use memo (top-down).
//     5. Optimise SPACE if possible.


/* ============================================================
 *  2️⃣ TOP-DOWN MEMOISATION VS BOTTOM-UP TABULATION
 * ============================================================ */
// 🔹 TOP-DOWN (memoised recursion):
//     - Write the natural recurrence.
//     - Cache results by argument key.
//     - Only computes what's needed.
//     - Risk: recursion depth (V8 stack ~10k).
// 🔹 BOTTOM-UP (tabulation):
//     - Fill a table from smallest subproblem upward.
//     - Iterative, no recursion.
//     - Often optimisable to rolling variables.
//     - Risk: might compute unused states.

// Top-down (memoised)
function fibTop(n: number, memo: Map<number, number> = new Map()): number {
  if (n < 2) return n;
  const cached = memo.get(n);
  if (cached !== undefined) return cached;
  const result = fibTop(n - 1, memo) + fibTop(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Bottom-up
function fibBottom(n: number): number {
  if (n < 2) return n;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return b;
}

console.log(fibTop(30), fibBottom(30));     // 832040 832040

// 🧠 Start with memoised recursion (easy to reason about), then
//    convert to bottom-up for speed / no recursion limits.
// ⚠️ JS numbers are float64 — safe integers up to 2^53. For
//    huge fib values, use BigInt:
function fibBig(n: bigint): bigint {
  if (n < 2n) return n;
  let a = 0n;
  let b = 1n;
  for (let i = 2n; i <= n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return b;
}

console.log(fibBig(100n).toString());       // huge integer


/* ============================================================
 *  3️⃣ FIBONACCI — THE HELLO WORLD OF DP
 * ============================================================ */
// 🔹 Naive recursion: O(2^n).
// 🔹 Memo / bottom-up: O(n).
// 🔹 Space-optimised: O(1).

// O(2^n) — for reference
function fibNaive(n: number): number {
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// O(n) time, O(n) space — bottom-up
function fibDp(n: number): number {
  if (n < 2) return n;
  const dp = new Array<number>(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] ?? 0) + (dp[i - 2] ?? 0);
  }
  return dp[n] ?? 0;
}

// O(n) time, O(1) space — rolling variables
function fibOpt(n: number): number {
  if (n < 2) return n;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return b;
}

console.log(fibDp(10), fibOpt(10));         // 55 55

// 🧠 DP mantra: "don't recompute what you've already computed".


/* ============================================================
 *  4️⃣ CLIMBING STAIRS
 * ============================================================ */
// 🔹 To reach step n, come from n-1 (1 step) or n-2 (2 steps).
// 🔸 dp[n] = dp[n-1] + dp[n-2] — same as Fibonacci.
// 🎯 Classic warm-up.

function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return b;
}

console.log(climbStairs(5));                // 8
console.log(climbStairs(1));                // 1

// 🔸 Variant: 1, 2, or 3 steps at a time
function climbStairs3(n: number): number {
  if (n <= 2) return n;
  if (n === 3) return 4;
  let a = 1;
  let b = 2;
  let c = 4;
  for (let i = 4; i <= n; i++) {
    const t = a + b + c;
    a = b;
    b = c;
    c = t;
  }
  return c;
}

console.log(climbStairs3(4));               // 7

// 🧠 Rule: "how many ways to reach n by steps of size X" →
//    dp[n] = Σ dp[n - step_i].


/* ============================================================
 *  5️⃣ 0/1 KNAPSACK
 * ============================================================ */
// 🔹 Choose items (each at most once) to maximise value with
//    capacity W.
// 🔸 dp[i][w] = best using first i items, capacity w.
// 🎯 The canonical "pick or skip" DP.

function knapsack01(
  weights: readonly number[],
  values: readonly number[],
  W: number,
): number {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(W + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    const wi = weights[i - 1];
    const vi = values[i - 1];
    if (wi === undefined || vi === undefined) continue;
    for (let w = 0; w <= W; w++) {
      const row = dp[i];
      const prevRow = dp[i - 1];
      if (!row || !prevRow) continue;
      row[w] = prevRow[w] ?? 0;         // skip item i
      if (wi <= w) {
        row[w] = Math.max(row[w] ?? 0, (prevRow[w - wi] ?? 0) + vi);
      }
    }
  }
  return dp[n]?.[W] ?? 0;
}

console.log(knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7));   // 9

// 🔸 Space-optimised 1D version (reverse iteration!)
function knapsack01_1d(
  weights: readonly number[],
  values: readonly number[],
  W: number,
): number {
  const dp = new Array<number>(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wi = weights[i];
    const vi = values[i];
    if (wi === undefined || vi === undefined) continue;
    for (let w = W; w >= wi; w--) {      // reverse → use old row
      dp[w] = Math.max(dp[w] ?? 0, (dp[w - wi] ?? 0) + vi);
    }
  }
  return dp[W] ?? 0;
}

console.log(knapsack01_1d([1, 3, 4, 5], [1, 4, 5, 7], 7));   // 9

// ⚠️ Reverse order matters! If iterating forward, item i can be
//    used more than once → becomes unbounded knapsack by mistake.
// 🧠 0/1 knapsack = "take or skip each item once".


/* ============================================================
 *  6️⃣ UNBOUNDED KNAPSACK / COIN CHANGE
 * ============================================================ */
// 🔹 Item can be used MULTIPLE times.
// 🔸 Coin change: min coins to make amount.
// 🎯 Same shape, different recurrence.

function coinChangeMin(coins: readonly number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;                              // 0 coins to make 0
  for (const c of coins) {
    for (let a = c; a <= amount; a++) {   // FORWARD → reuse allowed
      const via = (dp[a - c] ?? Infinity) + 1;
      if (via < (dp[a] ?? Infinity)) dp[a] = via;
    }
  }
  const res = dp[amount];
  return res === undefined || res === Infinity ? -1 : res;
}

console.log(coinChangeMin([1, 2, 5], 11));       // 3  (5 + 5 + 1)
console.log(coinChangeMin([2], 3));              // -1

// 🔸 Count number of ways (order doesn't matter)
function coinChangeWays(coins: readonly number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(0);
  dp[0] = 1;                              // 1 way to make 0
  for (const c of coins) {                // outer: coin
    for (let a = c; a <= amount; a++) {   // inner: amount
      dp[a] = (dp[a] ?? 0) + (dp[a - c] ?? 0);
    }
  }
  return dp[amount] ?? 0;
}

console.log(coinChangeWays([1, 2, 5], 5));       // 4

// 🔸 Order MATTERS version (permutations of coins count distinct)
function coinChangeWaysOrder(coins: readonly number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(0);
  dp[0] = 1;
  for (let a = 1; a <= amount; a++) {     // outer: amount
    for (const c of coins) {              // inner: coin
      if (c <= a) dp[a] = (dp[a] ?? 0) + (dp[a - c] ?? 0);
    }
  }
  return dp[amount] ?? 0;
}

console.log(coinChangeWaysOrder([1, 2, 5], 5));  // 9

// 🧠 The loop ORDER decides whether combinations or permutations
//    are counted. Coins OUTER → combinations. Coins INNER →
//    permutations.

// 🔸 Unbounded knapsack (max value)
function knapsackUnbounded(
  weights: readonly number[],
  values: readonly number[],
  W: number,
): number {
  const dp = new Array<number>(W + 1).fill(0);
  for (let w = 1; w <= W; w++) {
    for (let i = 0; i < weights.length; i++) {
      const wi = weights[i];
      const vi = values[i];
      if (wi === undefined || vi === undefined) continue;
      if (wi <= w) {
        dp[w] = Math.max(dp[w] ?? 0, (dp[w - wi] ?? 0) + vi);
      }
    }
  }
  return dp[W] ?? 0;
}

console.log(knapsackUnbounded([1, 3, 4, 5], [1, 4, 5, 7], 7));   // 9


/* ============================================================
 *  7️⃣ LONGEST INCREASING SUBSEQUENCE (LIS)
 * ============================================================ */
// 🔹 Longest subsequence strictly increasing.
// 🔸 O(n²) DP version — easy to reason.
// 🔸 O(n log n) patience sort version — classic.

// O(n²) — dp[i] = length of LIS ending at index i
function lisN2(xs: readonly number[]): number {
  if (xs.length === 0) return 0;
  const n = xs.length;
  const dp = new Array<number>(n).fill(1);
  for (let i = 1; i < n; i++) {
    const xi = xs[i];
    if (xi === undefined) continue;
    for (let j = 0; j < i; j++) {
      const xj = xs[j];
      if (xj !== undefined && xj < xi) {
        dp[i] = Math.max(dp[i] ?? 1, (dp[j] ?? 1) + 1);
      }
    }
  }
  return Math.max(...dp);
}

console.log(lisN2([10, 9, 2, 5, 3, 7, 101, 18]));   // 4

// O(n log n) — patience sorting with binary search
function lisNlogn(xs: readonly number[]): number {
  const tails: number[] = [];             // smallest tail of LIS of length i+1
  for (const x of xs) {
    // Find leftmost index where tails[i] >= x
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const v = tails[mid];
      if (v !== undefined && v < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return tails.length;
}

console.log(lisNlogn([10, 9, 2, 5, 3, 7, 101, 18]));   // 4

// 🔸 Strictly increasing: binary search for `>= x` (lower bound)
//    Non-decreasing:    binary search for `> x` (upper bound)
// 🧠 The tails array is NOT the actual LIS — just its length.
//    To reconstruct the sequence, store parent pointers.


/* ============================================================
 *  8️⃣ LONGEST COMMON SUBSEQUENCE (LCS)
 * ============================================================ */
// 🔹 Longest subsequence common to two strings.
// 🔸 dp[i][j] = LCS of a[:i] and b[:j].
// 🎯 Foundation for diff, edit distance, and DNA alignment.

function lcs(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const row = dp[i];
      const prev = dp[i - 1];
      if (!row || !prev) continue;
      if (a[i - 1] === b[j - 1]) {
        row[j] = (prev[j - 1] ?? 0) + 1;
      } else {
        row[j] = Math.max(prev[j] ?? 0, row[j - 1] ?? 0);
      }
    }
  }
  return dp[m]?.[n] ?? 0;
}

console.log(lcs("abcde", "ace"));       // 3  ("ace")
console.log(lcs("abc", "def"));         // 0

// 🔸 Space-optimised (rolling rows)
function lcs1d(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = (prev[j - 1] ?? 0) + 1;
      } else {
        cur[j] = Math.max(prev[j] ?? 0, cur[j - 1] ?? 0);
      }
    }
    prev = cur;
  }
  return prev[n] ?? 0;
}

console.log(lcs1d("abcde", "ace"));     // 3

// 🧠 Recurrence intuition: match → 1 + diagonal; mismatch →
//    max(drop from a, drop from b).


/* ============================================================
 *  9️⃣ EDIT DISTANCE (LEVENSHTEIN)
 * ============================================================ */
// 🔹 Min insert/delete/substitute ops to turn a into b.
// 🔸 dp[i][j] = edit distance of a[:i] → b[:j].

function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  // Base cases: converting to/from empty string
  for (let i = 0; i <= m; i++) dp[i]![0] = i;      // delete all of a[:i]
  for (let j = 0; j <= n; j++) dp[0]![j] = j;      // insert all of b[:j]

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const row = dp[i];
      const prev = dp[i - 1];
      if (!row || !prev) continue;
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev[j - 1] ?? 0;
      } else {
        row[j] =
          1 +
          Math.min(
            prev[j] ?? 0,         // delete
            row[j - 1] ?? 0,      // insert
            prev[j - 1] ?? 0,     // substitute
          );
      }
    }
  }
  return dp[m]?.[n] ?? 0;
}

console.log(editDistance("horse", "ros"));              // 3
console.log(editDistance("intention", "execution"));    // 5
console.log(editDistance("", "abc"));                   // 3

// 🔸 Space-optimised
function editDistance1d(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1).fill(0);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1] ?? 0;
      } else {
        cur[j] = 1 + Math.min(prev[j] ?? 0, cur[j - 1] ?? 0, prev[j - 1] ?? 0);
      }
    }
    prev = cur;
  }
  return prev[n] ?? 0;
}

console.log(editDistance1d("horse", "ros"));            // 3

// 🧠 Edit distance = LCS + insert/delete; also used in spell
//    check, diff, and DNA alignment.


/* ============================================================
 *  🔟 SPACE OPTIMISATION (ROLLING ARRAYS)
 * ============================================================ */
// 🔹 Many DPs only need the PREVIOUS row (or two).
// 🔸 Rolling variables reduce O(n²) space to O(n).
// 🎯 Rule: if dp[i][j] depends only on dp[i-1][...], keep one row.

// Example: 0/1 knapsack rolling row
function knapsackRolling(
  weights: readonly number[],
  values: readonly number[],
  W: number,
): number {
  const dp = new Array<number>(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wi = weights[i];
    const vi = values[i];
    if (wi === undefined || vi === undefined) continue;
    for (let w = W; w >= wi; w--) {       // reverse for 0/1
      dp[w] = Math.max(dp[w] ?? 0, (dp[w - wi] ?? 0) + vi);
    }
  }
  return dp[W] ?? 0;
}

// Example: LCS rolling row
function lcsRolling(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = (prev[j - 1] ?? 0) + 1;
      } else {
        cur[j] = Math.max(prev[j] ?? 0, cur[j - 1] ?? 0);
      }
    }
    prev = cur;
  }
  return prev[n] ?? 0;
}

// 🧠 Do the 2D version first for clarity, then roll.
// ⚠️ For 0/1 problems, iterate the reduced dimension in REVERSE
//    so each item is used at most once.
// ⚠️ For unbounded problems, iterate FORWARD so items can be
//    reused.


/* ============================================================
 *  1️⃣1️⃣ PATTERN RECOGNITION GUIDE
 * ============================================================ */
// 🔹 "Count ways to reach n by steps"         → Fibonacci style
// 🔹 "Pick items to maximise value"           → knapsack
// 🔹 "Coin change, min coins"                 → unbounded knapsack
// 🔹 "Count coin combinations"                → coin change ways
// 🔹 "Longest increasing subsequence"         → LIS (n² or n log n)
// 🔹 "Longest common subsequence"             → LCS
// 🔹 "Edit distance / diff"                   → Levenshtein
// 🔹 "Can we partition / subset sum"          → 0/1 knapsack
// 🔹 "Maximum subarray sum"                   → Kadane (file 20)
// 🔹 "Paths in a grid"                        → 2D DP

// ── Complexity reference ─────────────────────────────────────
// | Problem              │ States       │ Time          │ Space  |
// |----------------------|--------------|---------------|--------|
// | Fibonacci            │ n            │ O(n)          │ O(1)*  |
// | Climbing stairs      │ n            │ O(n)          │ O(1)*  |
// | 0/1 Knapsack         │ n × W        │ O(nW)         │ O(W)*  |
// | Unbounded knapsack   │ n × W        │ O(nW)         │ O(W)*  |
// | Coin change (min)    │ n × A        │ O(nA)         │ O(A)   |
// | Coin change (ways)   │ n × A        │ O(nA)         │ O(A)   |
// | LIS (n²)             │ n            │ O(n²)         │ O(n)   |
// | LIS (n log n)        │ n            │ O(n log n)    │ O(n)   |
// | LCS                  │ m × n        │ O(mn)         │ O(min) |
// | Edit distance        │ m × n        │ O(mn)         │ O(min) |
// * after space optimisation
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Recursion depth for top-down memo — V8 stack limit ~10k.
//    For large n, switch to bottom-up or an explicit stack.
// ⚠️ Memo keys: use a Map for single-number keys, or a string
//    composite key for multi-dimensional states.
// ⚠️ Don't forget BASE CASES. Most bugs are missing dp[0] or
//    dp[i][0].
// ⚠️ 0/1 knapsack: iterate reduced dimension REVERSE.
//    Unbounded: FORWARD.
// ⚠️ Coin change combos vs permutations: coin OUTER → combos;
//    coin INNER → permutations.
// ⚠️ LIS: strictly increasing uses `lower bound` on tails;
//    non-decreasing uses `upper bound`.
// ⚠️ LCS: compare characters, not indices.
// ⚠️ Edit distance: base row/col = i / j (not 0).
// ⚠️ JS numbers are float64 — safe integers up to 2^53. For
//    huge DP values, use BigInt (slower).
// ⚠️ Infinity arithmetic: Infinity + 1 = Infinity, but
//    Infinity - Infinity = NaN. Be careful with sentinel values.
// ⚠️ Rolling arrays: when a value depends on the CURRENT row's
//    earlier value (like dp[i][j-1]), you must keep `cur`, not
//    reuse `prev` in place.
// ⚠️ Distinguish "subsequence" (not contiguous) from "subarray"
//    (contiguous). Different DPs.
// ⚠️ For counting problems, beware of numeric overflow —
//    use BigInt or modulo (10^9 + 7) in competitive programming.
// ⚠️ Memoisation on arrays / objects requires serialisation for
//    the key. Pass an index instead.
// ⚠️ Some "DP" problems are actually greedy — recognise them
//    before writing DP.
// ⚠️ Test with: empty input, single element, all-equal, target
//    not achievable, and maximum-size inputs.
// ⚠️ TypeScript: `T | undefined` from array indexing — narrow
//    with `?? 0` or explicit guards.

/* 🕒 Version notes
 * - Map for memoisation: ES2015
 * - BigInt: ES2020
 * - Array.from with mapper: ES2015
 * - Optional chaining / nullish coalescing: ES2020
 * - Object.hasOwn: ES2022
 * - structuredClone: Node 17+ (for copying DP tables if needed)
 * - noUncheckedIndexedAccess: TS 4.1+
 * - No built-in DP library — write it yourself
 * - For very large tables, consider typed arrays (Int32Array,
 *   Float64Array) for speed and memory
 * - For parallel / GPU DP, use WebGL / WebGPU or WebAssembly
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Problem               │ State            │ Recurrence        |
 * ─────────────────────────────────────────────────────────────
 * | Fibonacci             │ dp[i]            │ dp[i-1]+dp[i-2]   |
 * | Climbing stairs       │ dp[i]            │ dp[i-1]+dp[i-2]   |
 * | 0/1 Knapsack          │ dp[i][w]         │ take / skip       |
 * | Unbounded knapsack    │ dp[w]            │ forward iterate   |
 * | Coin change (min)     │ dp[a]            │ min(dp[a-c]+1)    |
 * | Coin change (ways)    │ dp[a]            │ Σ dp[a-c]         |
 * | LIS (n²)              │ dp[i]            │ max dp[j]+1       |
 * | LIS (n log n)         │ tails            │ binary search     |
 * | LCS                   │ dp[i][j]         │ match → diag+1    |
 * | Edit distance         │ dp[i][j]         │ 1+min(del/ins/sub)|
 * ─────────────────────────────────────────────────────────────
 * | Approach        │ Pros                        │ Cons        |
 * ─────────────────────────────────────────────────────────────
 * | Top-down memo   │ natural recurrence, sparse  │ stack depth |
 * | Bottom-up       │ iterative, easy to optimise │ full table  |
 * | Space-optimised │ minimal memory              │ less clear  |
 * ─────────────────────────────────────────────────────────────
 * | Pattern signal         │ Likely DP shape              |
 * ─────────────────────────────────────────────────────────────
 * | Count ways              │ sum of transitions          |
 * | Min/max value           │ min/max of transitions      |
 * | Pick or skip item       │ knapsack                    |
 * | Subsequence             │ 1D or 2D DP                 |
 * | Two-string comparison   │ 2D DP (LCS / edit)          |
 * | Grid path               │ 2D DP                       |
 * | Partition / subset sum  │ 0/1 knapsack on bool        |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                 |
 * ─────────────────────────────────────────────────────────────
 * | Missing base case           │ Wrong / negative results     |
 * | Forward iteration 0/1       │ Becomes unbounded            |
 * | Reverse unbounded           │ Becomes 0/1                  |
 * | Coins inner vs outer        │ Combos vs permutations       |
 * | Recursion depth             │ RangeError (stack)           |
 * | Using prev in place         │ Needs current row's prior    |
 * | LIS strict vs non-strict    │ Off-by-one wrong length      |
 * | Edit distance base row/col  │ Wrong count on empty str     |
 * | T|undefined not narrowed    │ TypeScript errors            |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Write the naive recursion FIRST, then memoise, then convert
 *    to bottom-up.
 *  - State definition is 90% of the problem — be explicit.
 *  - Draw the DP table for 2D problems.
 *  - 0/1 vs unbounded: reverse vs forward iteration.
 *  - Combos vs permutations: coin outer vs inner.
 *  - Space-optimise only after the 2D version is correct.
 *  - Use a Map for top-down memo — clean and fast.
 *  - Recognise subarray (contiguous) vs subsequence (not).
 *  - Check if a greedy solution exists before writing DP.
 *  - Test with: empty input, single item, zero-capacity,
 *    unreachable targets.
 *  - Watch out for MOD in counting problems with huge outputs.
 *  - Draw the recursion tree for small n to sanity-check.
 *  - Use BigInt for values that exceed 2^53 - 1.
 * ============================================================ */