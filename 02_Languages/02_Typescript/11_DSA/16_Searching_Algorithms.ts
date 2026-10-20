// 16_Searching_Algorithms.ts

/* ============================================================
 *  📘 SEARCHING ALGORITHMS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Searching = finding a target within a collection. The right
 *  algorithm depends entirely on whether the data is SORTED.
 *  Linear search is O(n) on anything; binary search is O(log n)
 *  but requires sorted input. This file covers both plus the
 *  variations that come up in interviews: lower/upper bound,
 *  rotated arrays, peak finding, first/last occurrence, and the
 *  binary-search-on-answer technique.
 *
 *  Sections:
 *   1. Linear search — O(n)
 *   2. Binary search — iterative
 *   3. Binary search — recursive
 *   4. Lower bound / upper bound (first/last occurrence)
 *   5. Search in a rotated sorted array
 *   6. Find peak element
 *   7. Binary search on the ANSWER
 *   8. Custom lower_bound (Array.prototype method doesn't exist)
 *   9. Comparison and decision guide
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ LINEAR SEARCH — O(n)
 * ============================================================ */
// 🔹 Scan the whole collection until you find the target.
// 🔸 Works on unsorted data.
// 🎯 Only correct choice when data is unsorted AND you search
//    just once (multiple searches → sort first).

function linearSearch(xs: readonly number[], target: number): number {
  for (let i = 0; i < xs.length; i++) {
    if (xs[i] === target) return i;
  }
  return -1;
}

console.log(linearSearch([5, 1, 4, 2, 8], 4));   // 2
console.log(linearSearch([5, 1, 4, 2, 8], 99));  // -1

// 🧠 Linear search is fine when:
//    - Data is small (n < ~50).
//    - You search ONCE and sorting is more expensive.
//    - Data changes constantly (sorting each time is O(n log n)).
//    Otherwise, sort once, then use binary search many times.

// 🔸 JS-native alternatives
const xs = [5, 1, 4, 2, 8];
console.log(xs.includes(4));            // true → O(n)
console.log(xs.indexOf(4));             // 2 → O(n)
console.log(xs.find((x) => x === 4));   // 4 → O(n)
console.log(xs.findIndex((x) => x === 4)); // 2 → O(n)
// All linear — same complexity as above.

// 🔸 For repeated membership tests, convert to a Set:
const set = new Set(xs);
console.log(set.has(4));                // true → O(1) average


/* ============================================================
 *  2️⃣ BINARY SEARCH — ITERATIVE
 * ============================================================ */
// 🔹 Requires SORTED input.
// 🔸 Halve the search space each iteration → O(log n).
// 🎯 Know this by heart — it's the most-asked search algorithm.

function binarySearch(xs: readonly number[], target: number): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);  // avoid overflow; >> 1 is /2
    const val = xs[mid];
    if (val === undefined) return -1;
    if (val === target) return mid;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sorted, 7));   // 3
console.log(binarySearch(sorted, 1));   // 0
console.log(binarySearch(sorted, 13));  // 6
console.log(binarySearch(sorted, 4));   // -1

// ⚠️ Classic infinite loop bug: `lo = mid` or `hi = mid` without
//    ±1. ALWAYS move past mid.
// ⚠️ Loop condition: `lo <= hi` (inclusive). Some variants use
//    `lo < hi` with a different invariant — pick one style and
//    stick with it.
// 🧠 `mid = Math.floor((lo + hi) / 2)` is fine for reasonable
//    sizes; use `lo + Math.floor((hi - lo) / 2)` for huge arrays.
// ⚠️ JS numbers are float64 — for arrays with length > 2^53
//    this breaks. That's 9e15 elements — never a real concern.


/* ============================================================
 *  3️⃣ BINARY SEARCH — RECURSIVE
 * ============================================================ */
// 🔹 Same idea, expressed with recursion.
// 🔸 O(log n) time, O(log n) stack space.

function binarySearchRec(xs: readonly number[], target: number): number {
  function go(lo: number, hi: number): number {
    if (lo > hi) return -1;
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined) return -1;
    if (val === target) return mid;
    if (val < target) return go(mid + 1, hi);
    return go(lo, mid - 1);
  }
  return go(0, xs.length - 1);
}

console.log(binarySearchRec(sorted, 11));   // 5
console.log(binarySearchRec(sorted, 4));    // -1

// ⚠️ Recursive version is rarely needed — iterative avoids
//    stack depth issues (log₂ n is small anyway).
// 🧠 Use recursion only if the problem is naturally recursive
//    (divide & conquer variants).


/* ============================================================
 *  4️⃣ LOWER BOUND / UPPER BOUND (FIRST/LAST OCCURRENCE)
 * ============================================================ */
// 🔹 LOWER BOUND: first index where xs[i] >= target.
// 🔹 UPPER BOUND: first index where xs[i] > target.
// 🔸 Works even when target isn't present.
// 🎯 Foundation for "first occurrence", "last occurrence",
//    "count occurrences", "insert position".

function lowerBound(xs: readonly number[], target: number): number {
  let lo = 0;
  let hi = xs.length;                   // NOTE: hi = length, not len-1
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined || val < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(xs: readonly number[], target: number): number {
  let lo = 0;
  let hi = xs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val !== undefined && val <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const dupSorted = [1, 2, 2, 2, 3, 4, 5];
console.log(lowerBound(dupSorted, 2));  // 1  (first 2)
console.log(upperBound(dupSorted, 2));  // 4  (one past last 2)

function countOccurrences(xs: readonly number[], target: number): number {
  return upperBound(xs, target) - lowerBound(xs, target);
}
console.log(countOccurrences(dupSorted, 2));    // 3

function firstOccurrence(xs: readonly number[], target: number): number {
  const i = lowerBound(xs, target);
  return i < xs.length && xs[i] === target ? i : -1;
}

function lastOccurrence(xs: readonly number[], target: number): number {
  const i = upperBound(xs, target) - 1;
  return i >= 0 && xs[i] === target ? i : -1;
}

console.log(firstOccurrence(dupSorted, 2));     // 1
console.log(lastOccurrence(dupSorted, 2));      // 3

// 🧠 The KEY difference vs binarySearch:
//    - These use `lo < hi` (not `lo <= hi`).
//    - `hi = xs.length` (not len-1).
//    - Never return early — shrink to find the boundary.
// 🔸 These mirror Python's bisect_left / bisect_right.
// 🔸 JS has NO built-in lower_bound — implement it.

// 🔸 Insert position for sorted array (like Python's insort):
function sortedInsertIndex(xs: readonly number[], value: number): number {
  return upperBound(xs, value);         // after equal elements
}


/* ============================================================
 *  5️⃣ SEARCH IN A ROTATED SORTED ARRAY
 * ============================================================ */
// 🔹 Array was sorted, then rotated at some pivot.
// 🔸 Still do binary search — decide which half is sorted.

function searchRotated(xs: readonly number[], target: number): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined) return -1;
    if (val === target) return mid;

    const loVal = xs[lo];
    if (loVal === undefined) return -1;

    // Left half is sorted
    if (loVal <= val) {
      if (loVal <= target && target < val) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half is sorted
      const hiVal = xs[hi];
      if (hiVal === undefined) return -1;
      if (val < target && target <= hiVal) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

const rotated = [4, 5, 6, 7, 0, 1, 2];
console.log(searchRotated(rotated, 0)); // 4
console.log(searchRotated(rotated, 4)); // 0
console.log(searchRotated(rotated, 3)); // -1

// 🔸 Find minimum in a rotated sorted array
function findMinRotated(xs: readonly number[]): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const mv = xs[mid];
    const hv = xs[hi];
    if (mv === undefined || hv === undefined) return -1;
    if (mv > hv) lo = mid + 1;
    else hi = mid;
  }
  return xs[lo] ?? -1;
}

console.log(findMinRotated(rotated));   // 0

// 🧠 Pattern: at every step, at least one side is sorted.
//    Decide which, then check if target lies in that range.


/* ============================================================
 *  6️⃣ FIND PEAK ELEMENT
 * ============================================================ */
// 🔹 Peak = element greater than both neighbours.
// 🔸 Binary search on the slope: move toward the higher neighbour.
// 🎯 O(log n) — much better than scanning.

function findPeak(xs: readonly number[]): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const mv = xs[mid];
    const next = xs[mid + 1];
    if (mv === undefined || next === undefined) return -1;
    if (mv < next) lo = mid + 1;        // rising → peak on right
    else hi = mid;                      // falling → peak on left
  }
  return lo;
}

console.log(findPeak([1, 2, 3, 1]));    // 2  (value 3)
console.log(findPeak([1, 2, 1, 3, 5, 6, 4]));  // 5 (value 6)
console.log(findPeak([1]));             // 0

// 🧠 Binary search isn't only for sorted arrays — it works
//    whenever you can discard HALF the space based on a
//    monotonic property.


/* ============================================================
 *  7️⃣ BINARY SEARCH ON THE ANSWER
 * ============================================================ */
// 🔹 Search over the RANGE OF ANSWERS, not the input array.
// 🔸 Requires a monotonic predicate: "isAnswer(x) is True for
//    all x >= threshold?" (or ≤).
// 🎯 Classic: "minimum capacity to ship in D days", "koko
//    eating bananas", "split array largest sum".

function minCapacity(weights: readonly number[], days: number): number {
  function feasible(cap: number): boolean {
    let d = 1;
    let cur = 0;
    for (const w of weights) {
      if (cur + w > cap) {
        d += 1;
        cur = 0;
      }
      cur += w;
    }
    return d <= days;
  }

  let lo = 0;
  let hi = 0;
  for (const w of weights) {
    if (w > lo) lo = w;
    hi += w;
  }
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(minCapacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5));   // 15
console.log(minCapacity([3, 2, 2, 4, 1, 4], 3));                // 6

// 🔸 Koko eating bananas — minimum speed to finish in h hours.
function kokoSpeed(piles: readonly number[], h: number): number {
  function can(speed: number): boolean {
    let total = 0;
    for (const p of piles) total += Math.ceil(p / speed);
    return total <= h;
  }
  let lo = 1;
  let hi = 0;
  for (const p of piles) if (p > hi) hi = p;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(kokoSpeed([3, 6, 7, 11], 8));       // 4

// 🧠 Rule: when the problem says "minimise the maximum" or
//    "maximise the minimum", think binary search on the answer.
// 🔸 Range is usually [lower_bound, upper_bound] derived from
//    the input.
// 🔸 Predicate is O(n) typically → total O(n log(range)).


/* ============================================================
 *  8️⃣ CUSTOM LOWER_BOUND (NO STDLIB EQUIVALENT)
 * ============================================================ */
// 🔹 JavaScript has no `bisect` module — implement your own
//    helpers for reusable binary-search machinery.
// 🔸 Generic over T with a comparator.

function lowerBoundG<T>(xs: readonly T[], target: T, cmp: (a: T, b: T) => number): number {
  let lo = 0;
  let hi = xs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined || cmp(val, target) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBoundG<T>(xs: readonly T[], target: T, cmp: (a: T, b: T) => number): number {
  let lo = 0;
  let hi = xs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const val = xs[mid];
    if (val === undefined || cmp(val, target) <= 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// ✅ Reuse for numbers
const nums = [1, 2, 2, 2, 3, 4, 5];
const numCmp = (a: number, b: number) => a - b;
console.log(lowerBoundG(nums, 2, numCmp));      // 1
console.log(upperBoundG(nums, 2, numCmp));      // 4

// ✅ Reuse for strings (lexicographic)
const strings = ["apple", "banana", "banana", "cherry"];
const strCmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
console.log(lowerBoundG(strings, "banana", strCmp));   // 1
console.log(upperBoundG(strings, "banana", strCmp));   // 3

// ✅ Reuse for objects (by key)
type Person = { name: string; age: number };
const people: Person[] = [
  { name: "A", age: 20 },
  { name: "B", age: 30 },
  { name: "C", age: 30 },
  { name: "D", age: 40 },
];
const byAge = (a: Person, b: Person) => a.age - b.age;
console.log(lowerBoundG(people, { name: "", age: 30 }, byAge));  // 1
console.log(upperBoundG(people, { name: "", age: 30 }, byAge));  // 3


/* ============================================================
 *  9️⃣ COMPARISON AND DECISION GUIDE
 * ============================================================ */
// 🔹 Linear search   : unsorted OR n small OR one-off query.
// 🔹 Binary search    : sorted + many queries.
// 🔹 Lower/upper bound: first/last occurrence, insert position.
// 🔹 Rotated search   : sorted then rotated.
// 🔹 Peak finding     : monotonic slope property.
// 🔹 BS on answer     : monotonic predicate over a numeric range.

// ── Complexity table ─────────────────────────────────────────
// | Algorithm              │ Pre-req        │ Time    │ Space   |
// |------------------------|----------------|---------|---------|
// | Linear search          │ none           │ O(n)    │ O(1)    |
// | Binary search          │ sorted         │ O(log n)│ O(1)    |
// | Recursive binary search│ sorted         │ O(log n)│ O(log n)|
// | Lower/upper bound      │ sorted         │ O(log n)│ O(1)    |
// | Rotated search         │ rotated-sorted │ O(log n)│ O(1)    |
// | Peak finding           │ unimodal       │ O(log n)│ O(1)    |
// | BS on answer           │ monotonic pred │ O(log R * cost(pred)) | O(1) |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Decision flow:
//    1. Is data sorted?          → binary search family.
//    2. Sorted but rotated?      → rotated binary search.
//    3. Multiple queries?        → sort once + binary search.
//    4. Searching over a range?  → BS on answer.
//    5. Otherwise                 → linear scan.
//    6. Repeated membership?     → Set / Map for O(1).


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Binary search MUST run on sorted data — otherwise garbage.
// ⚠️ Infinite loop: `lo = mid` or `hi = mid` without ±1.
// ⚠️ Off-by-one: decide on `lo <= hi` vs `lo < hi` up front.
//    Two safe templates:
//      a) `lo <= hi`, hi = len-1, return mid on match.
//      b) `lo < hi`,  hi = len,   no early return.
// ⚠️ JS has no integer overflow for typical sizes — but for
//    consistency and code review, write `lo + ((hi - lo) >> 1)`.
// ⚠️ Empty list → binarySearch returns -1; lowerBound returns 0.
// ⚠️ Duplicates: plain binarySearch returns "some" index, not
//    the FIRST or LAST. Use lower/upper bound.
// ⚠️ Rotated array with duplicates: searchRotated above assumes
//    unique values. With duplicates, worst case becomes O(n).
// ⚠️ BS on answer requires a MONOTONIC predicate. If it's not
//    monotonic, BS is wrong.
// ⚠️ Comparator must return a NUMBER, not a boolean.
// ⚠️ Comparator must be consistent for a total order.
// ⚠️ Array.prototype.findIndex is O(n) — not binary search.
// ⚠️ Array.prototype.includes on sorted arrays is O(n) — use
//    binarySearch for O(log n).
// ⚠️ For string searches, use localeCompare or a code-unit
//    comparator — both work but produce different orders.
// ⚠️ For object arrays, binary search requires sorting by the
//    SAME comparator used in search.
// ⚠️ NaN breaks comparison: NaN < x, NaN > x, NaN === x are all
//    false. Filter NaN before sorting / searching.
// ⚠️ `Math.ceil(p / speed)` for Koko is O(1) but sum in a loop
//    is O(n) — that's the cost of the predicate.
// ⚠️ Beware very large ranges in BS on the answer — `hi` can be
//    sum(weights) which can be 10^10+. O(log R) is fine, but
//    the initialization loop is O(n).

/* 🕒 Version notes
 * - Array.prototype.findIndex: ES2015
 * - Array.prototype.includes: ES2016
 * - Array.prototype.at(-1): ES2022
 * - No built-in binary search in JS / TS stdlib
 * - No bisect module — implement lower/upper bound yourself
 * - localeCompare for locale-aware string comparison: ES2015+
 * - Intl.Collator: ES2015+ (better for repeated comparisons)
 * - Array.prototype.toSorted: ES2023
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - Generic binary search with comparator: TS 2.0+
 * - BigInt: ES2020 (for very large numeric keys)
 * - For very large sorted data, consider a B-tree library
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Algorithm              │ Pre-req        │ Complexity       |
 * ─────────────────────────────────────────────────────────────
 * | Linear search          │ unsorted       │ O(n) time, O(1)  |
 * | Binary search (iter)   │ sorted         │ O(log n), O(1)   |
 * | Binary search (rec)    │ sorted         │ O(log n), O(log n)|
 * | Lower bound            │ sorted         │ O(log n), O(1)   |
 * | Upper bound            │ sorted         │ O(log n), O(1)   |
 * | First/last occurrence  │ sorted         │ O(log n), O(1)   |
 * | Count occurrences      │ sorted         │ O(log n), O(1)   |
 * | Rotated search         │ rotated        │ O(log n), O(1)   |
 * | Find peak              │ unimodal       │ O(log n), O(1)   |
 * | BS on answer           │ monotonic      │ O(log R * pred)  |
 * ─────────────────────────────────────────────────────────────
 * | JS tools           │ Use for                                  |
 * ─────────────────────────────────────────────────────────────
 * | arr.includes       │ O(n) membership                          |
 * | set.has            │ O(1) membership                          |
 * | arr.indexOf        │ O(n) first index                         |
 * | arr.findIndex      │ O(n) first index by predicate            |
 * | Lower/upper bound  │ O(log n) — implement yourself            |
 * | sortedInsertIndex  │ Insert into sorted array in O(log n) find|
 * |                    │   + O(n) copy                            |
 * ─────────────────────────────────────────────────────────────
 * | Template                     │ When to use                    |
 * ─────────────────────────────────────────────────────────────
 * | lo=0, hi=len-1, lo<=hi       │ Simple search; return on match |
 * | lo=0, hi=len,   lo<hi        │ First/last boundary problems   |
 * | lo=0, hi=len-1, lo<hi        │ Find peak / min / max          |
 * | lo=min, hi=max, lo<hi        │ BS on numeric answer range     |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                    |
 * ─────────────────────────────────────────────────────────────
 * | lo=mid or hi=mid without ±1│ Infinite loop                  |
 * | Unsorted input to BS       │ Silent wrong answer             |
 * | Plain BS for first/last    │ Any occurrence, not the one     |
 * | Duplicates in rotated array│ O(n) worst case                 |
 * | Non-monotonic predicate    │ BS on answer gives garbage      |
 * | indexOf vs binary search   │ O(n) vs O(log n)                |
 * | Comparator returns boolean │ Coerced → wrong order           |
 * | Comparator returns NaN     │ Undefined sort / BS behaviour   |
 * | Empty array edge           │ Return -1 vs 0 — be explicit    |
 * | NaN in data                │ Breaks comparisons              |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - No stdlib binary search in JS — implement lower/upper bound.
 *  - Memorise the two safe templates: `lo<=hi` and `lo<hi`.
 *  - Always compute `mid = lo + ((hi - lo) >> 1)` (portable).
 *  - For first/last occurrence, use lower/upper bound, not
 *    plain binary search.
 *  - Rotated array: check which half is sorted before branching.
 *  - "Peak" and "min in rotated array" use the slope trick with
 *    `lo < hi`.
 *  - Recognise "minimise maximum" / "maximise minimum" → binary
 *    search on the answer.
 *  - Predicate in BS-on-answer MUST be monotonic.
 *  - Sort once, search many times — O(n log n + q log n).
 *  - For membership in unsorted data, use a Set / Map for O(1).
 *  - Use a comparator for object arrays consistently — same
 *    comparator for sort and search.
 *  - Test with: empty, single element, all-equal, target at
 *    ends, duplicates, and rotated pivots at both edges.
 *  - For string searches, decide code-unit vs locale-aware
 *    comparison up front.
 * ============================================================ */