// 02_Arrays_and_Lists.ts

/* ============================================================
 *  📘 ARRAYS & LISTS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A JavaScript array is a DYNAMIC ARRAY (usually implemented
 *  as a growable contiguous buffer, sometimes with hidden-class
 *  optimisations). It gives O(1) index access, amortised O(1)
 *  push/pop at the END, and O(n) insert/delete at the FRONT or
 *  MIDDLE. TypeScript layers a static type system on top.
 *
 *  This file covers: creation, indexing, slicing, mutation,
 *  built-in methods with complexity, array destructuring,
 *  tuples, readonly arrays, 2D arrays, shallow vs deep copy,
 *  and the classic patterns (prefix sums, two pointers,
 *  in-place reversal).
 *
 *  Sections:
 *   1. What an array actually is
 *   2. Creating and initialising arrays
 *   3. Indexing and access
 *   4. Slicing and copying
 *   5. Mutation methods and their complexity
 *   6. Iteration patterns
 *   7. Higher-order methods (map, filter, reduce)
 *   8. Tuples and readonly arrays
 *   9. 2D arrays and matrices
 *  10. Shallow vs deep copy
 *  11. Classic patterns (prefix sum, two-pointer, reverse)
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT AN ARRAY ACTUALLY IS
 * ============================================================ */
// 🔹 Arrays are objects with integer indices and a length
//    property. Modern V8 optimises PACKED arrays of numbers
//    into contiguous buffers.
// 🔸 push/pop at the end are amortised O(1).
// 🔸 shift/unshift at the front are O(n) — the whole buffer
//    slides.
// 🔸 TypeScript adds static types — no runtime cost.

// 🔎 Detecting the underlying shape (curiosity — V8-specific):
//    - "PACKED_SMI_ELEMENTS"   : small ints, fast
//    - "PACKED_DOUBLE_ELEMENTS": floats, fast
//    - "PACKED_ELEMENTS"       : mixed, slower
//    - "HOLEY_*"               : with holes (delete/skip), slower
//    Mixing types or using `delete arr[i]` de-optimises.

// 🧠 Rule of thumb: keep arrays homogeneous. Prefer slice over
//    delete. Use pop/shift rather than `delete`.


/* ============================================================
 *  2️⃣ CREATING AND INITIALISING ARRAYS
 * ============================================================ */
// 🔹 Literal                : [1, 2, 3]
// 🔹 Array.from({length:n}) : fill with generated values
// 🔹 new Array(n)           : n holes (NOT zeros!) — avoid
// 🔹 Array(n).fill(v)       : v repeated n times

const a: number[] = [1, 2, 3];
const b: number[] = Array.from({ length: 5 }, (_, i) => i); // [0,1,2,3,4]
const c: number[] = Array(5).fill(0);                        // [0,0,0,0,0]

console.log(a, b, c);

// ⚠️ new Array(5) creates 5 HOLES, not zeros. Common bug:
const holes: number[] = new Array(5) as unknown as number[];
console.log(holes.length);          // 5
console.log(0 in holes);            // false — hole, not value

// ✅ Always prefer Array.from or .fill for initialised arrays.

// 🔸 Typed arrays for numeric work (Float64Array, Int32Array, ...)
//    give contiguous memory and C-like semantics:
const typed: Int32Array = new Int32Array(5);
typed[0] = 42;
console.log(typed[0]);              // 42


/* ============================================================
 *  3️⃣ INDEXING AND ACCESS
 * ============================================================ */
// 🔹 0-based indexing; xs[i] is O(1).
// 🔸 .length is O(1).
// 🔸 Out-of-range access returns `undefined` (no error!).

const xs: number[] = [10, 20, 30, 40, 50];
console.log(xs[0], xs[2], xs[4]);       // 10 30 50
console.log(xs[10]);                    // undefined — no error!
console.log(xs.length);                 // 5

// ⚠️ With strict + noUncheckedIndexedAccess, xs[i] is T | undefined.
//    Always guard before use:
function safeGet(xs: readonly number[], i: number): number | undefined {
  if (i < 0 || i >= xs.length) return undefined;
  return xs[i];                          // still T | undefined
}

// ✅ Optional chaining and nullish coalescing for safe access:
const first = xs[0] ?? -1;
console.log(first);                     // 10

// 🔸 .at(i) — supports negative indices (ES2022)
console.log(xs.at(-1));                 // 50
console.log(xs.at(-2));                 // 40

// 🧠 Rule: TypeScript's noUncheckedIndexedAccess treats arr[i]
//    as T | undefined. Narrow before use — that's the whole
//    point of strict mode.


/* ============================================================
 *  4️⃣ SLICING AND COPYING
 * ============================================================ */
// 🔹 slice(a, b)  : new array from index a up to (not incl.) b
// 🔹 slice()      : full SHALLOW copy
// 🔸 splice(a, n) : in-place removal — returns removed items
// ⚠️ slice vs splice — one letter, opposite semantics.

const ys: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(ys.slice(2, 5));            // [2, 3, 4]
console.log(ys.slice(-3));              // [7, 8, 9]
console.log(ys.slice());                // shallow copy

// ⚠️ splice mutates the original array!
const zs: number[] = [0, 1, 2, 3, 4];
const removed: number[] = zs.splice(1, 2);   // remove 2 items at index 1
console.log(removed, zs);               // [1, 2]   [0, 3, 4]

// 🔸 toReversed / toSorted / toSpliced — non-mutating versions
//    (ES2023):
const original: number[] = [3, 1, 2];
const sortedCopy: number[] = original.toSorted((a, b) => a - b);
console.log(original, sortedCopy);      // [3,1,2]  [1,2,3]

// 🧠 Prefer non-mutating methods when you can — clearer data flow.
// 🔸 slice is a SHALLOW copy: nested objects are still shared.


/* ============================================================
 *  5️⃣ MUTATION METHODS AND THEIR COMPLEXITY
 * ============================================================ */
// 🔹 Know the cost so you don't accidentally write O(n²).

const arr: number[] = [1, 2, 3];

arr.push(4);                            // O(1) amortised
arr.pop();                              // O(1)
arr.unshift(0);                         // O(n)  ← shifts
arr.shift();                            // O(n)  ← shifts
arr.splice(1, 1);                       // O(n)  ← shifts
arr.reverse();                          // O(n)  in place
arr.sort((a, b) => a - b);              // O(n log n) in place
arr.fill(0, 1, 2);                      // O(k)  set range to 0
arr.copyWithin(0, 1);                   // O(n)  copy range internally

// ⚠️ sort() converts to strings by default!
console.log([10, 2, 33, 4].sort());     // [10, 2, 33, 4] — WRONG!
console.log([10, 2, 33, 4].sort((a, b) => a - b)); // [2, 4, 10, 33]

// 🔸 The default sort is LEXICOGRAPHIC — always pass a comparator
//    for numbers.
// ⚠️ sort() is stable in modern engines (ES2019+ requires it).

// 🔸 reverse() MUTATES; for a copy:
const reversedCopy = [...original].reverse();

// 🔸 indexOf / lastIndexOf / includes are O(n):
arr.indexOf(2);                         // O(n)
arr.includes(2);                        // O(n)


/* ============================================================
 *  6️⃣ ITERATION PATTERNS
 * ============================================================ */
// 🔹 for...of         : values
// 🔹 for (i = 0; ...)  : index-based
// 🔹 for...in         : KEYS (indices for arrays) — avoid on arrays
// 🔹 arr.entries()    : [index, value] pairs
// 🔹 arr.keys()       : indices
// 🔹 arr.values()     : values (rarely used)

const nums: number[] = [10, 20, 30];

for (const x of nums) console.log(x);

for (let i = 0; i < nums.length; i++) {
  const v = nums[i];
  if (v !== undefined) console.log(i, v);
}

for (const [i, v] of nums.entries()) {
  console.log(i, v);
}

// ⚠️ for...in iterates INDICES as strings + inherited props.
//    Avoid for arrays — use for...of or forEach.
// for (const i in nums) console.log(i);   // '0', '1', '2'

// 🔸 forEach cannot break early — use for...of or `some`/`every`
//    for early exit:
nums.some((x) => {
  if (x === 20) return true;            // early exit
  return false;
});

// 🔸 Modifying while iterating is unsafe — build a new array.

// 🔎 Performance: classic for-loop is fastest; for...of is close;
//    forEach has callback overhead. For 99% of code, readability
//    wins. For hot loops, benchmark.


/* ============================================================
 *  7️⃣ HIGHER-ORDER METHODS (MAP, FILTER, REDUCE)
 * ============================================================ */
// 🔹 map     : transform each element → new array (same length)
// 🔹 filter  : keep elements matching predicate → new array
// 🔹 reduce  : fold into a single value
// 🔹 flat    : flatten one level
// 🔹 flatMap : map + flatten one level
// 🔹 some    : any matches? (early exit)
// 🔹 every   : all match? (early exit)
// 🔹 find    : first matching element (or undefined)
// 🔹 findIndex: index of first match (or -1)

const values: number[] = [1, 2, 3, 4, 5];

const doubled: number[] = values.map((x) => x * 2);
const evens: number[] = values.filter((x) => x % 2 === 0);
const total: number = values.reduce((acc, x) => acc + x, 0);

console.log(doubled, evens, total);     // [2,4,6,8,10] [2,4] 15

const nested: number[][] = [[1, 2], [3], [4, 5]];
console.log(nested.flat());             // [1, 2, 3, 4, 5]
console.log(values.flatMap((x) => [x, -x]));  // [1,-1,2,-2,...]

console.log(values.some((x) => x > 4)); // true
console.log(values.every((x) => x > 0));// true
console.log(values.find((x) => x > 3)); // 4
console.log(values.findIndex((x) => x > 3)); // 3

// 🔸 reduce is the most flexible — can build maps, arrays, etc.
const freq: Map<number, number> = values.reduce((acc, x) => {
  acc.set(x, (acc.get(x) ?? 0) + 1);
  return acc;
}, new Map<number, number>());

// 🧠 Rule: prefer map/filter/reduce over manual loops for
//    transformations. Use for-loops for hot paths or early exit.

// ⚠️ Chaining map/filter creates intermediate arrays. For very
//    large inputs, a single for-loop is faster.
// ⚠️ reduce without initial value uses arr[0] and throws on
//    empty arrays. Always pass an initial value.


/* ============================================================
 *  8️⃣ TUPLES AND READONLY ARRAYS
 * ============================================================ */
// 🔹 Tuples   : fixed-length arrays with per-position types.
// 🔹 readonly : prevents mutation (compile-time only).

let point: [number, number] = [3, 4];
// point = [3, 4, 5];                   // ❌ error — length 2
// point[0] = 5;                        // ✅ ok
// point[2] = 9;                        // ❌ error

const pair: readonly [number, string] = [1, "one"];
// pair[0] = 2;                         // ❌ readonly

// 🔸 readonly arrays
const frozen: readonly number[] = [1, 2, 3];
// frozen.push(4);                      // ❌ readonly

// 🔸 readonly accepts both tuple and array forms
function sum(xs: readonly number[]): number {
  let total = 0;
  for (const x of xs) total += x;
  return total;
}

console.log(sum([1, 2, 3]));            // 6
console.log(sum(frozen));               // 6

// 🧠 Prefer `readonly T[]` for function params — signals "I won't
//    mutate this". Widens accepted inputs and prevents accidental
//    bugs.

// 🔸 Named tuple members (TS 4.0+)
type Point = [x: number, y: number];
const p: Point = [1, 2];


/* ============================================================
 *  9️⃣ 2D ARRAYS AND MATRICES
 * ============================================================ */
// 🔹 A matrix is an array of arrays: m[i][j].
// 🔸 Build with Array.from — never Array(n).fill(sameArray).

const matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(matrix[1]?.[2]);            // 6 — optional chaining

// ⚠️ THE CLASSIC BUG: same inner array shared across rows
const badRow: number[][] = Array(3).fill([0, 0, 0]);
badRow[0]![0] = 9;
console.log(badRow);                    // [[9,0,0],[9,0,0],[9,0,0]] — BUG!

// ✅ Correct: build rows independently
const goodRow: number[][] = Array.from({ length: 3 }, () => [0, 0, 0]);
goodRow[0]![0] = 9;
console.log(goodRow);                   // [[9,0,0],[0,0,0],[0,0,0]]

// 🔸 Transpose
function transpose(m: readonly (readonly number[])[]): number[][] {
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  const out: number[][] = Array.from({ length: cols }, () =>
    Array(rows).fill(0),
  );
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const row = m[i];
      if (row === undefined) continue;
      const v = row[j];
      if (v === undefined) continue;
      out[j]![i] = v;
    }
  }
  return out;
}

console.log(transpose(matrix));         // [[1,4,7],[2,5,8],[3,6,9]]

// 🧠 In TS strict + noUncheckedIndexedAccess, matrix[i][j] is
//    T | undefined — guard or use ! only when you've bounded
//    indices yourself.


/* ============================================================
 *  🔟 SHALLOW VS DEEP COPY
 * ============================================================ */
// 🔹 Shallow: [...xs], xs.slice() — inner objects shared.
// 🔸 Deep   : structuredClone(xs) (Node 17+ / modern browsers).

const outer: number[][] = [[1, 2], [3, 4]];

const shallow = [...outer];
shallow[0]![0] = 99;
console.log(outer[0]![0]);              // 99 — inner shared!

// ✅ structuredClone — deep copy (built-in, ES2022+)
const deep = structuredClone(outer);
deep[0]![0] = -1;
console.log(outer[0]![0], deep[0]![0]); // 99 -1

// 🔸 For JSON-safe data, JSON.parse(JSON.stringify(x)) works but
//    loses Date / Map / Set / undefined. Prefer structuredClone.

// ⚠️ `const b = a` aliases — modifying b modifies a.
// 🧠 Use structuredClone only when needed — it's relatively slow.


/* ============================================================
 *  1️⃣1️⃣ CLASSIC PATTERNS
 * ============================================================ */
// 🔹 PREFIX SUMS — O(1) range-sum queries after O(n) build.
function prefixSums(xs: readonly number[]): number[] {
  const ps = new Array<number>(xs.length + 1).fill(0);
  for (let i = 0; i < xs.length; i++) {
    ps[i + 1] = (ps[i] ?? 0) + (xs[i] ?? 0);
  }
  return ps;
}

function rangeSum(ps: readonly number[], l: number, r: number): number {
  return (ps[r + 1] ?? 0) - (ps[l] ?? 0);
}

const src = [3, 1, 4, 1, 5, 9];
const ps = prefixSums(src);
console.log(rangeSum(ps, 1, 3));        // 1 + 4 + 1 = 6

// 🔹 TWO POINTERS — palindrome, sorted pair-sum, reverse.
function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i += 1;
    j -= 1;
  }
  return true;
}

console.log(isPalindrome("racecar"));   // true

// 🔹 IN-PLACE REVERSAL
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

const r = [1, 2, 3, 4, 5];
reverseInPlace(r);
console.log(r);                         // [5,4,3,2,1]

// 🔹 DUTCH NATIONAL FLAG — 3-way partition (0s, 1s, 2s)
function sort012(xs: number[]): void {
  let lo = 0;
  let mid = 0;
  let hi = xs.length - 1;
  while (mid <= hi) {
    const v = xs[mid];
    if (v === 0) {
      const a = xs[lo];
      if (a !== undefined) xs[mid] = a;
      xs[lo] = 0;
      lo += 1;
      mid += 1;
    } else if (v === 1) {
      mid += 1;
    } else {
      const h = xs[hi];
      if (h !== undefined) xs[mid] = h;
      xs[hi] = 2;
      hi -= 1;
    }
  }
}

const arr012 = [2, 0, 1, 2, 1, 0];
sort012(arr012);
console.log(arr012);                    // [0,0,1,1,2,2]


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ new Array(n) creates holes, not zeros.
// ⚠️ Array.fill with an array fills with the SAME reference.
// ⚠️ arr.sort() is lexicographic by default — always pass a cmp.
// ⚠️ arr.shift() / unshift() are O(n) — use a head pointer.
// ⚠️ arr.includes is O(n) — use Set for repeated membership.
// ⚠️ arr[i] is T | undefined with noUncheckedIndexedAccess.
// ⚠️ delete arr[i] creates a hole (and deoptimises) — use splice.
// ⚠️ slice is a copy; splice mutates. Different meanings.
// ⚠️ for...in iterates indices as strings — avoid for arrays.
// ⚠️ forEach cannot break — use for...of / some / every.
// ⚠️ reduce() on empty array without initial value throws.
// ⚠️ Spread of large arrays is a real copy; watch memory.
// ⚠️ structuredClone is available Node 17+ / modern browsers.
// ⚠️ TS `readonly` is compile-time only — no runtime freeze.
// ⚠️ `Object.freeze` freezes shallowly, not deeply.
// ⚠️ Sparse arrays (holes) behave differently in map/filter —
//    callbacks skip holes.
// ⚠️ Number arrays use float64 — safe integers up to 2^53 - 1.
//    Use BigInt beyond that.
// ⚠️ Typed arrays (Int32Array, Float64Array) are faster for
//    numeric work but don't have map/filter returning same type.

/* 🕒 Version notes
 * - Array spread / destructuring: ES2015
 * - Array.prototype.includes: ES2016
 * - Array.prototype.flat / flatMap: ES2019
 * - Array.prototype.at: ES2022
 * - Array.prototype.findLast / findLastIndex: ES2023
 * - toReversed / toSorted / toSpliced / with: ES2023
 * - structuredClone: global, Node 17+, modern browsers
 * - Object.groupBy / Map.groupBy: ES2024
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - Typed arrays: ES2015 (some older in browsers)
 * - No built-in immutable array library in JS — use immer if
 *   needed
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation              │ Average cost    │ Notes           |
 * ─────────────────────────────────────────────────────────────
 * | arr[i]                 │ O(1)            │ index           |
 * | arr[i] = v             │ O(1)            │ assign          |
 * | arr.push(v)            │ O(1) amort.     │ end             |
 * | arr.pop()              │ O(1)            │ from end        |
 * | arr.shift()            │ O(n)            │ shifts          |
 * | arr.unshift(v)         │ O(n)            │ shifts          |
 * | arr.splice(i, k, ...)  │ O(n)            │ shifts          |
 * | arr.includes(v)        │ O(n)            │ linear scan     |
 * | arr.indexOf(v)         │ O(n)            │ linear scan     |
 * | arr.slice(a, b)        │ O(b-a)          │ new array       |
 * | arr.sort(cmp)          │ O(n log n)      │ in place        |
 * | arr.toSorted(cmp)      │ O(n log n)      │ new (ES2023)    |
 * | arr.reverse()          │ O(n)            │ in place        |
 * | arr.toReversed()       │ O(n)            │ new (ES2023)    |
 * | arr.length             │ O(1)            │ cached          |
 * | arr.map(fn)            │ O(n)            │ new array       |
 * | arr.filter(fn)         │ O(n)            │ new array       |
 * | arr.reduce(fn, init)   │ O(n)            │ single value    |
 * ─────────────────────────────────────────────────────────────
 * | Pattern               │ Recipe                             |
 * ─────────────────────────────────────────────────────────────
 * | Reverse               │ [...xs].reverse() or toReversed()  |
 * | Copy (shallow)        │ xs.slice() or [...xs]              |
 * | Copy (deep)           │ structuredClone(xs)                |
 * | Index + value         │ xs.entries()                       |
 * | Parallel              │ zip via map((x, i) => [x, ys[i]])  |
 * | Filter + map          │ xs.filter(p).map(f) or flatMap     |
 * | 2D build              │ Array.from({length:r}, () => [...])|
 * | Transpose             │ nested loops / matrix lib          |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | new Array(n) holes         │ Not zeros; skips in map/filter |
 * | Array.fill(arr)            │ Shared reference               |
 * | sort() no comparator       │ Lexicographic — wrong for nums |
 * | shift/unshift              │ O(n) each → O(n²) loop         |
 * | Mutate while iterating     │ Skips elements                 |
 * | arr[i] T | undefined       │ Must narrow in strict mode     |
 * | delete arr[i]              │ Creates hole, deoptimises      |
 * | slice vs splice            │ One copies, one mutates        |
 * | for...in on arrays         │ String indices + inherited     |
 * | reduce empty no init       │ TypeError                      |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer readonly T[] for function parameters.
 *  - Use Array.from({length: n}, fn) — never new Array(n) alone.
 *  - Build 2D arrays with Array.from, never Array(n).fill(row).
 *  - Always pass a comparator to sort for numbers.
 *  - Use slice() / spread for shallow copy; structuredClone for
 *    deep.
 *  - Prefer for...of over for...in on arrays.
 *  - Use Set for repeated membership, not includes().
 *  - Cache arr.length in hot loops.
 *  - Prefer map/filter/reduce for transformations; for-loops
 *    for hot paths.
 *  - Beware holes — avoid creating sparse arrays.
 *  - Use typed arrays for numeric-heavy work (Int32Array, etc.).
 *  - Test with: empty, single element, all-same, sparse,
 *    negative indices, and large n.
 * ============================================================ */