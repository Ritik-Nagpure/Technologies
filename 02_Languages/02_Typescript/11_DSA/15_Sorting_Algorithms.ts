// 15_Sorting_Algorithms.ts

/* ============================================================
 *  📘 SORTING ALGORITHMS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Sorting is the art of arranging data in order. Every sorting
 *  algorithm trades off time, space, stability, and simplicity
 *  differently. JavaScript's Array.prototype.sort() uses
 *  TIMSORT (a hybrid merge + insertion) in V8 — nearly always
 *  the right choice. But interviews test whether you can
 *  implement the classics and reason about their complexity.
 *
 *  This file covers: stability, comparison vs non-comparison,
 *  bubble, selection, insertion, merge, quick, heap sort, and
 *  the linear-time special cases (counting, radix, bucket).
 *  Also JS-specific sorting with comparator, toSorted, and the
 *  Timsort guarantee.
 *
 *  Sections:
 *   1. Sorting terminology (stability, in-place)
 *   2. Comparison vs non-comparison sorts
 *   3. Bubble sort — O(n²)
 *   4. Selection sort — O(n²)
 *   5. Insertion sort — O(n²) but great for small / nearly sorted
 *   6. Merge sort — O(n log n), stable
 *   7. Quick sort — O(n log n) avg, in-place
 *   8. Heap sort — O(n log n), in-place, not stable
 *   9. Counting / Radix / Bucket — linear time
 *  10. JS sort() and toSorted() — Timsort + comparator
 *  11. When to use which — decision guide
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ SORTING TERMINOLOGY
 * ============================================================ */
// 🔹 STABLE    : equal elements keep their original relative order.
// 🔹 IN-PLACE  : O(1) extra memory (or O(log n) for recursion).
// 🔹 ADAPTIVE  : faster on partially-sorted input.
// 🔹 COMPARISON: uses only pairwise comparisons (a < b).
// 🔹 NON-COMPARISON: uses value structure (digits, buckets).
// 🎯 Know which of these each algorithm gives you.

// ── Master complexity table ─────────────────────────────────
// | Algorithm      │ Best       │ Avg        │ Worst      │ Space    │ Stable │
// |----------------|------------|------------|------------|----------|--------|
// | Bubble         │ O(n)       │ O(n²)      │ O(n²)      │ O(1)     │ Yes    │
// | Selection      │ O(n²)      │ O(n²)      │ O(n²)      │ O(1)     │ No     │
// | Insertion      │ O(n)       │ O(n²)      │ O(n²)      │ O(1)     │ Yes    │
// | Merge          │ O(n log n) │ O(n log n) │ O(n log n) │ O(n)     │ Yes    │
// | Quick          │ O(n log n) │ O(n log n) │ O(n²)      │ O(log n) │ No     │
// | Heap           │ O(n log n) │ O(n log n) │ O(n log n) │ O(1)     │ No     │
// | Counting       │ O(n + k)   │ O(n + k)   │ O(n + k)   │ O(k)     │ Yes    │
// | Radix          │ O(d(n+b))  │ O(d(n+b))  │ O(d(n+b))  │ O(n+b)   │ Yes    │
// | Bucket         │ O(n + k)   │ O(n + k)   │ O(n²)      │ O(n)     │ Yes    │
// | Timsort (V8)   │ O(n)       │ O(n log n) │ O(n log n) │ O(n)     │ Yes    │
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  2️⃣ COMPARISON VS NON-COMPARISON SORTS
 * ============================================================ */
// 🔹 Comparison sorts: bubble, selection, insertion, merge,
//    quick, heap, Timsort.
//    → Lower bound: Ω(n log n). You cannot beat it.
//
// 🔹 Non-comparison sorts: counting, radix, bucket.
//    → Can be O(n) but require value constraints (integers in
//      a range, keys of bounded digits, uniform distribution).
// 🎯 When the problem says "0..k" or "n-digit numbers", think
//    non-comparison.

// 🧠 Rule: if the input has structure, exploit it. Otherwise
//    accept O(n log n).


/* ============================================================
 *  3️⃣ BUBBLE SORT — O(n²)
 * ============================================================ */
// 🔹 Repeatedly swap adjacent out-of-order pairs.
// 🔸 Adaptive: early exit if a pass makes no swaps.
// 🎯 Educational; rarely used in real code.

function bubbleSort(xs: number[]): void {
  const n = xs.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      const a = xs[j];
      const b = xs[j + 1];
      if (a === undefined || b === undefined) continue;
      if (a > b) {
        xs[j] = b;
        xs[j + 1] = a;
        swapped = true;
      }
    }
    if (!swapped) break;                 // already sorted → O(n) best
  }
}

const a = [5, 1, 4, 2, 8];
bubbleSort(a);
console.log(a);                         // [1, 2, 4, 5, 8]

// ⚠️ Without the `swapped` flag, even sorted input is O(n²).
// 🧠 Best case O(n) — only with the flag.


/* ============================================================
 *  4️⃣ SELECTION SORT — O(n²)
 * ============================================================ */
// 🔹 Find the min of the remaining, swap it into position.
// 🔸 Always O(n²); not adaptive.
// 🎯 Minimises swaps — O(n) swaps total. Useful when swap is
//    expensive.

function selectionSort(xs: number[]): void {
  const n = xs.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      const a = xs[j];
      const b = xs[minIdx];
      if (a === undefined || b === undefined) continue;
      if (a < b) minIdx = j;
    }
    if (minIdx !== i) {
      const tmp = xs[i];
      const mv = xs[minIdx];
      if (tmp !== undefined && mv !== undefined) {
        xs[i] = mv;
        xs[minIdx] = tmp;
      }
    }
  }
}

const b = [5, 1, 4, 2, 8];
selectionSort(b);
console.log(b);                         // [1, 2, 4, 5, 8]

// ⚠️ Not stable — equal elements may be reordered.
// 🧠 Use when swaps are expensive; otherwise skip.


/* ============================================================
 *  5️⃣ INSERTION SORT — O(n²) BUT GREAT ON SMALL / NEARLY SORTED
 * ============================================================ */
// 🔹 Build a sorted prefix by inserting each element into its
//    correct position.
// 🔸 Adaptive: nearly sorted input → close to O(n).
// 🎯 Used by Timsort for runs up to ~64 elements.

function insertionSort(xs: number[]): void {
  for (let i = 1; i < xs.length; i++) {
    const key = xs[i];
    if (key === undefined) continue;
    let j = i - 1;
    while (j >= 0) {
      const cur = xs[j];
      if (cur === undefined || cur <= key) break;
      xs[j + 1] = cur;
      j -= 1;
    }
    xs[j + 1] = key;
  }
}

const c = [5, 1, 4, 2, 8];
insertionSort(c);
console.log(c);                         // [1, 2, 4, 5, 8]

// 🧠 Insertion sort beats merge/quick for n ≤ ~16 — that's why
//    hybrid algorithms (Timsort, introsort) switch to it.


/* ============================================================
 *  6️⃣ MERGE SORT — O(n log n), STABLE
 * ============================================================ */
// 🔹 Divide in half, sort each half, merge.
// 🔸 Guaranteed O(n log n) regardless of input.
// 🔸 Stable but needs O(n) extra space.

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
    if (av <= bv) {                     // ≤ for stability
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

console.log(mergeSort([5, 1, 4, 2, 8]));    // [1, 2, 4, 5, 8]

// 🧠 Merge sort is the go-to when:
//    - You need GUARANTEED O(n log n).
//    - You need STABILITY.
//    - You're sorting a linked list.
//    - You need external sort (data > memory).


/* ============================================================
 *  7️⃣ QUICK SORT — O(n log n) AVG, IN-PLACE
 * ============================================================ */
// 🔹 Choose pivot, partition around it, recurse.
// 🔸 Fast in practice (great cache locality) but O(n²) worst.
// 🔸 Randomised pivot avoids the sorted-input worst case.

function quickSort(
  xs: number[],
  lo: number = 0,
  hi: number = xs.length - 1,
): void {
  if (lo >= hi) return;
  const pivotIdx = partition(xs, lo, hi);
  quickSort(xs, lo, pivotIdx - 1);
  quickSort(xs, pivotIdx + 1, hi);
}

function partition(xs: number[], lo: number, hi: number): number {
  // 🔸 Randomised pivot: swap a random index with hi
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  const rv = xs[r];
  const hv = xs[hi];
  if (rv !== undefined && hv !== undefined) {
    xs[r] = hv;
    xs[hi] = rv;
  }

  const pivot = xs[hi];
  if (pivot === undefined) return lo;
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    const v = xs[j];
    if (v === undefined) continue;
    if (v <= pivot) {
      i += 1;
      const a = xs[i];
      const b = xs[j];
      if (a !== undefined && b !== undefined) {
        xs[i] = b;
        xs[j] = a;
      }
    }
  }
  const a = xs[i + 1];
  const b = xs[hi];
  if (a !== undefined && b !== undefined) {
    xs[i + 1] = b;
    xs[hi] = a;
  }
  return i + 1;
}

const q = [5, 1, 4, 2, 8];
quickSort(q);
console.log(q);                         // [1, 2, 4, 5, 8]

// 🔸 3-way partition (Dutch flag) handles duplicates efficiently.
function quickSort3Way(
  xs: number[],
  lo: number = 0,
  hi: number = xs.length - 1,
): void {
  if (lo >= hi) return;
  const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
  const pivot = xs[pivotIdx];
  if (pivot === undefined) return;
  let lt = lo;
  let i = lo;
  let gt = hi;
  while (i <= gt) {
    const v = xs[i];
    if (v === undefined) break;
    if (v < pivot) {
      const a = xs[lt];
      if (a !== undefined) {
        xs[lt] = v;
        xs[i] = a;
      }
      lt += 1;
      i += 1;
    } else if (v > pivot) {
      const a = xs[gt];
      if (a !== undefined) {
        xs[gt] = v;
        xs[i] = a;
      }
      gt -= 1;
    } else {
      i += 1;
    }
  }
  quickSort3Way(xs, lo, lt - 1);
  quickSort3Way(xs, gt + 1, hi);
}

const q3 = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
quickSort3Way(q3);
console.log(q3);                        // [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

// ⚠️ Quick sort is NOT stable.
// ⚠️ Sorted input + first/last pivot → O(n²). Randomise or
//    use median-of-three.
// 🧠 V8's `Array.sort` does NOT use quick sort — it uses Timsort.
//    Quick sort is mostly interview-only in JS.


/* ============================================================
 *  8️⃣ HEAP SORT — O(n log n), IN-PLACE, NOT STABLE
 * ============================================================ */
// 🔹 Build a max-heap, then repeatedly extract the max.
// 🔸 Guaranteed O(n log n), in-place, but not stable.
// 🎯 Used when you need guaranteed time AND O(1) extra space.

function siftDown(xs: number[], i: number, n: number): void {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    const lv = left < n ? xs[left] : undefined;
    const cur = xs[largest];
    if (lv !== undefined && cur !== undefined && lv > cur) largest = left;
    const rv = right < n ? xs[right] : undefined;
    const sv = xs[largest];
    if (rv !== undefined && sv !== undefined && rv > sv) largest = right;
    if (largest === i) return;
    const a = xs[i];
    const b = xs[largest];
    if (a === undefined || b === undefined) return;
    xs[i] = b;
    xs[largest] = a;
    i = largest;
  }
}

function heapSort(xs: number[]): void {
  const n = xs.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(xs, i, n);
  for (let end = n - 1; end > 0; end--) {
    const a = xs[0];
    const b = xs[end];
    if (a !== undefined && b !== undefined) {
      xs[0] = b;
      xs[end] = a;
    }
    siftDown(xs, 0, end);
  }
}

const h = [5, 1, 4, 2, 8];
heapSort(h);
console.log(h);                         // [1, 2, 4, 5, 8]

// 🧠 Heap sort guarantees O(n log n) time in O(1) space — the
//    only classic sort with that combination. Trade-off: not
//    stable, and cache performance is worse than quick sort.


/* ============================================================
 *  9️⃣ COUNTING / RADIX / BUCKET — LINEAR TIME
 * ============================================================ */
// 🔹 COUNTING SORT — for integers in a known range [0, k].
//    O(n + k) time, O(k) space. Stable when done right.

function countingSort(xs: readonly number[]): number[] {
  if (xs.length === 0) return [];
  let lo = Infinity;
  let hi = -Infinity;
  for (const x of xs) {
    if (x < lo) lo = x;
    if (x > hi) hi = x;
  }
  if (!isFinite(lo) || !isFinite(hi)) return [];
  const k = hi - lo + 1;
  const counts = new Array<number>(k).fill(0);
  for (const x of xs) counts[x - lo] = (counts[x - lo] ?? 0) + 1;
  for (let i = 1; i < k; i++) {
    counts[i] = (counts[i] ?? 0) + (counts[i - 1] ?? 0);
  }
  const out = new Array<number>(xs.length);
  for (let i = xs.length - 1; i >= 0; i--) {
    const x = xs[i];
    if (x === undefined) continue;
    const idx = (counts[x - lo] ?? 0) - 1;
    counts[x - lo] = idx;
    out[idx] = x;
  }
  return out;
}

console.log(countingSort([4, 2, 2, 8, 3, 3, 1]));
// [1, 2, 2, 3, 3, 4, 8]

// 🔹 RADIX SORT — for non-negative integers, digit by digit.
//    O(d·(n + b)) — d digits, base b. Stable at each pass.

function radixSort(xs: readonly number[]): number[] {
  if (xs.length === 0) return [];
  let out = [...xs];
  let maxVal = -Infinity;
  for (const x of out) if (x > maxVal) maxVal = x;
  let exp = 1;
  while (Math.floor(maxVal / exp) > 0) {
    out = countingByDigit(out, exp);
    exp *= 10;
  }
  return out;
}

function countingByDigit(xs: readonly number[], exp: number): number[] {
  const counts = new Array<number>(10).fill(0);
  for (const x of xs) counts[(x / exp) % 10 | 0]! += 1;
  for (let i = 1; i < 10; i++) counts[i]! += counts[i - 1]!;
  const out = new Array<number>(xs.length);
  for (let i = xs.length - 1; i >= 0; i--) {
    const x = xs[i];
    if (x === undefined) continue;
    const digit = ((x / exp) | 0) % 10;
    counts[digit]! -= 1;
    out[counts[digit]!] = x;
  }
  return out;
}

console.log(radixSort([170, 45, 75, 90, 802, 24, 2, 66]));
// [2, 24, 45, 66, 75, 90, 170, 802]

// 🔹 BUCKET SORT — for uniformly distributed floats.
function bucketSort(xs: readonly number[]): number[] {
  if (xs.length === 0) return [];
  const n = xs.length;
  const buckets: number[][] = Array.from({ length: n }, () => []);
  for (const x of xs) {
    const idx = Math.min(Math.floor(x * n), n - 1);
    const b = buckets[idx];
    if (b) b.push(x);
  }
  const out: number[] = [];
  for (const b of buckets) {
    b.sort((p, q) => p - q);
    out.push(...b);
  }
  return out;
}

console.log(bucketSort([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]));
// [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52]

// 🧠 Rule: use non-comparison sorts only when the value domain
//    is bounded / structured. Otherwise use comparison sorts.

// ⚠️ Counting sort requires integer keys in a SMALL range —
//    otherwise k blows up.
// ⚠️ Radix sort only works on integers (or fixed-width strings).
// ⚠️ Bucket sort worst case is O(n²) if all values land in one
//    bucket.


/* ============================================================
 *  🔟 JS sort() AND toSorted() — TIMSORT + COMPARATOR
 * ============================================================ */
// 🔹 Array.prototype.sort()  → in-place, returns the array.
// 🔹 Array.prototype.toSorted() → new array (ES2023).
// 🔹 Both use TIMSORT in V8:
//     - Detects existing runs (nearly-sorted input is O(n)).
//     - Switches to insertion sort for small runs.
//     - Merges runs efficiently.
//     - O(n log n) worst, O(n) best, STABLE (per spec since ES2019).
// 🔸 comparator: (a, b) => number — negative if a < b, 0 if
//    equal, positive if a > b.
// 🔸 Without a comparator, elements are converted to STRINGS —
//    wrong for numbers!

const xs = [5, 1, 4, 2, 8];
xs.sort((a, b) => a - b);
console.log(xs);                        // [1, 2, 4, 5, 8]

const ys = [5, 1, 4, 2, 8].toSorted((a, b) => a - b);
console.log(ys);                        // [1, 2, 4, 5, 8] — new array

// ⚠️ THE DEFAULT COMPARATOR IS LEXICOGRAPHIC.
console.log([10, 2, 33, 4].sort());     // [10, 2, 33, 4] — WRONG!
console.log([10, 2, 33, 4].sort((a, b) => a - b)); // [2, 4, 10, 33]

// 🔸 Sort strings (default works but is code-unit order)
console.log(["banana", "Apple", "cherry"].sort());
// ["Apple", "banana", "cherry"]

// 🔸 Case-insensitive string sort
console.log(["banana", "Apple", "cherry"].sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase()),
));

// 🔸 Locale-aware sort (numbers with letters)
const collator = new Intl.Collator("en", { numeric: true });
console.log(["file10", "file2", "file1"].sort(collator.compare));
// ["file1", "file2", "file10"]

// 🔸 Multi-key sort: primary ascending, secondary descending
type Person = { name: string; age: number };
const people: Person[] = [
  { name: "Ravi", age: 30 },
  { name: "Meera", age: 25 },
  { name: "Ravi", age: 22 },
];
people.sort((a, b) => {
  if (a.name !== b.name) return a.name < b.name ? -1 : 1;
  return b.age - a.age;                 // descending on age
});
console.log(people);
// [{name:"Meera",age:25},{name:"Ravi",age:30},{name:"Ravi",age:22}]

// 🔸 Sort by derived value (key function pattern)
const words = ["banana", "apple", "fig", "kiwi"];
words.sort((a, b) => a.length - b.length);
console.log(words);                     // ["fig", "kiwi", "apple", "banana"]

// 🔸 Sort entries of a Map
const counts = new Map<string, number>([
  ["a", 3], ["b", 1], ["c", 2],
]);
const sortedEntries = [...counts.entries()].sort((a, b) => a[1] - b[1]);
console.log(sortedEntries);             // [["b",1],["c",2],["a",3]]

// 🧠 Rules:
//   - Use sort() when you own the array.
//   - Use toSorted() when you need the original untouched.
//   - ALWAYS pass a comparator for numbers.
//   - Comparator must return a number, not a boolean.
//   - For multi-key, chain comparisons in the comparator.
//   - Cache expensive keys via a Map if the comparator is hot.
//   - For locale-aware sorting, use Intl.Collator.

// ⚠️ Don't use `arr.sort().reverse()` — reverse mutates and
//    destroys stability. Instead, negate the comparator:
//    arr.sort((a, b) => b - a)


/* ============================================================
 *  1️⃣1️⃣ WHEN TO USE WHICH
 * ============================================================ */
// 🔹 Small n (< ~16)                        → insertion sort
// 🔹 Nearly sorted                          → insertion / Timsort
// 🔹 General purpose, need stable           → merge / Timsort
// 🔹 General purpose, in-place, fast        → quick sort
// 🔹 Need guaranteed O(n log n) + O(1) space → heap sort
// 🔹 Integers in a small range              → counting sort
// 🔹 Integers with many digits              → radix sort
// 🔹 Uniform floats                         → bucket sort
// 🔹 JS/TS code (99% of the time)           → Array.sort + comparator

// 🧠 Default to JS's Array.sort. Roll your own only when
//    interview asks or when the input has special structure.


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ sort() returns the SAME array (mutated) — not a copy.
//    Use toSorted() if you need the original untouched.
// ⚠️ Without a comparator, elements are sorted as STRINGS.
//    This is the #1 sorting bug in JS.
// ⚠️ Comparator must return a NUMBER (negative/zero/positive).
//    Returning booleans coerces to 0/1, breaking the order.
// ⚠️ Comparator must be CONSISTENT — otherwise sort may throw
//    or produce undefined order.
// ⚠️ `arr.sort((a, b) => a > b)` is WRONG — returns boolean.
//    Use `arr.sort((a, b) => a - b)`.
// ⚠️ `arr.sort((a, b) => a - b)` works for numbers but NOT
//    for strings with non-numeric content.
// ⚠️ Quick sort pivot choice matters — always randomise.
// ⚠️ Quick sort is not stable — if you need stability, use
//    merge sort or add index tie-breakers.
// ⚠️ Merge sort uses O(n) extra space.
// ⚠️ Counting sort blows up if k (range) is huge.
// ⚠️ Radix sort only works on non-negative integers by default —
//    handle negatives by sign split or offset.
// ⚠️ Bucket sort worst case is O(n²) if distribution is skewed.
// ⚠️ V8's Timsort is stable (since ES2019 the spec requires it).
// ⚠️ Sorting mixed types with a numeric comparator yields NaN —
//    define a total order or pre-filter.
// ⚠️ Sorting strings: default is code-unit order; use
//    localeCompare for linguistic order.
// ⚠️ `Array.prototype.sort` on a huge array can throw
//    RangeError if the comparator is inconsistent.
// ⚠️ `Infinity - Infinity` is NaN — comparator returns NaN.
//    Handle Infinity separately.
// ⚠️ For very large arrays, consider radix sort for integers —
//    it's often faster than Timsort despite same O(n) claims.

/* 🕒 Version notes
 * - Array.prototype.sort: always; stable since ES2019
 * - Comparator parameter: always
 * - Array.prototype.toSorted / toReversed: ES2023
 * - Timsort in V8: since V8 7.0 (Chrome 70 / Node 11)
 * - Intl.Collator for locale-aware sorting: ES2015+
 * - BigInt sorting requires a comparator: ES2020
 * - structuredClone: Node 17+ / modern browsers
 * - No built-in stableSort type in TS — use custom comparator
 * - TypeScript target ES2015+ recommended for sort stability
 * - For very large datasets, consider WebAssembly / C++ bindings
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Algorithm      │ Best       │ Avg        │ Worst      │ Stable │
 * ─────────────────────────────────────────────────────────────
 * | Bubble         │ O(n)       │ O(n²)      │ O(n²)      │ Yes    │
 * | Selection      │ O(n²)      │ O(n²)      │ O(n²)      │ No     │
 * | Insertion      │ O(n)       │ O(n²)      │ O(n²)      │ Yes    │
 * | Merge          │ O(n log n) │ O(n log n) │ O(n log n) │ Yes    │
 * | Quick          │ O(n log n) │ O(n log n) │ O(n²)      │ No     │
 * | Heap           │ O(n log n) │ O(n log n) │ O(n log n) │ No     │
 * | Counting       │ O(n + k)   │ O(n + k)   │ O(n + k)   │ Yes    │
 * | Radix          │ O(d(n+b))  │ O(d(n+b))  │ O(d(n+b))  │ Yes    │
 * | Bucket         │ O(n + k)   │ O(n + k)   │ O(n²)      │ Yes    │
 * | Timsort (V8)   │ O(n)       │ O(n log n) │ O(n log n) │ Yes    │
 * ─────────────────────────────────────────────────────────────
 * | Use case                   │ Best choice                   |
 * ─────────────────────────────────────────────────────────────
 * | General purpose, JS/TS     │ Array.sort(cmp) / toSorted()  |
 * | Guaranteed O(n log n)      │ merge sort, heap sort         |
 * | In-place, fast average     │ quick sort                    |
 * | Stability required         │ merge sort, Timsort           |
 * | Small / nearly sorted      │ insertion sort                |
 * | Integers in small range    │ counting sort                 |
 * | Fixed-width integers       │ radix sort                    |
 * | Uniform floats             │ bucket sort                   |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | sort() with no comparator  │ Lexicographic — wrong for nums |
 * | Comparator returns bool    │ Coerced to 0/1 → broken order  |
 * | Comparator returns NaN     │ Undefined sort behaviour       |
 * | arr.sort() mutates         │ Surprise for callers           |
 * | sort().reverse()           │ Loses stability, mutates       |
 * | Quick sort worst case      │ O(n²) on sorted input          |
 * | Merge sort memory          │ O(n) extra                     |
 * | Counting sort huge range   │ k memory blowup                |
 * | Radix with negatives       │ Breaks without sign split      |
 * | Bucket skew                │ Degrades to O(n²)              |
 * | "Z" < "a" (code order)     │ Not locale-aware               |
 * | Infinity - Infinity = NaN  │ Comparator broken              |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - In JS/TS: use Array.sort / toSorted — Timsort is excellent.
 *  - ALWAYS pass a comparator for numbers — `(a, b) => a - b`.
 *  - Comparator must return a number — negative/zero/positive.
 *  - Comparator must be consistent (a total order).
 *  - Use toSorted() for non-mutating sorts.
 *  - Know the four key properties: time, space, stable, in-place.
 *  - Merge sort = stable + guaranteed; quick sort = fast average.
 *  - Quick sort: RANDOMISE the pivot to avoid O(n²).
 *  - Counting / radix / bucket are for structured inputs only.
 *  - Insertion sort is the go-to for tiny arrays (< 16).
 *  - Multi-key sort: chain comparisons inside one comparator.
 *  - For locale-aware sorting, use Intl.Collator.
 *  - Handle Infinity / NaN in your comparator.
 *  - Test with: empty, single element, all equal, sorted input,
 *    reversed input, duplicates, and large n.
 *  - Interview expectation: implement merge + quick confidently,
 *    discuss trade-offs.
 * ============================================================ */