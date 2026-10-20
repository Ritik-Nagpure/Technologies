// 04_Hashing_Maps_and_Sets.ts

/* ============================================================
 *  📘 HASHING, MAPS & SETS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A HASH TABLE maps keys to values via a HASH FUNCTION that
 *  turns arbitrary keys into array indices. JavaScript/TypeScript
 *  offers two hash-table primitives:
 *    • Map  — real hash table, any key type, ordered.
 *    • Set  — like Map without values.
 *  Plain objects ({} / Record<K,V>) also act as hash maps but
 *  with string-key-only semantics and hidden-class penalties.
 *
 *  This file covers: hash tables conceptually, Map vs Object,
 *  Set operations, WeakMap/WeakSet, common patterns (frequency
 *  counts, two-sum, grouping), collision theory, and pitfalls.
 *
 *  Sections:
 *   1. Why hashing matters
 *   2. What a hash table actually is
 *   3. Map — the real hash table
 *   4. Object as map (and why to avoid it)
 *   5. Set — the collection of uniques
 *   6. WeakMap and WeakSet
 *   7. Iteration patterns
 *   8. Common DSA patterns (frequency, two-sum, grouping)
 *   9. Collisions and worst-case behaviour
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHY HASHING MATTERS
 * ============================================================ */
// 🔹 `arr.includes(x)` is O(n) — slow for repeated lookups.
// 🔹 `set.has(x)` / `map.get(x)` is O(1) average.
// 🎯 Hashing converts O(n) problems into O(n) TOTAL (from O(n²))
//    by trading a bit of memory for speed.

// ❌ O(n²): nested loop membership
function hasDuplicatesSlow(xs: readonly number[]): boolean {
  for (let i = 0; i < xs.length; i++) {
    for (let j = i + 1; j < xs.length; j++) {
      if (xs[i] === xs[j]) return true;
    }
  }
  return false;
}

// ✅ O(n): one pass with a Set
function hasDuplicatesFast(xs: readonly number[]): boolean {
  const seen = new Set<number>();
  for (const x of xs) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

// 🧠 Rule: whenever you write `x in collection` inside a loop,
//    ask if a Set / Map would be O(1) instead of O(n).


/* ============================================================
 *  2️⃣ WHAT A HASH TABLE ACTUALLY IS
 * ============================================================ */
// 🔹 A hash table is an array of "buckets".
// 🔸 Insert: hash(key) → bucket index → store (key, value).
// 🔸 Lookup: hash(key) → bucket → compare keys.
// 🔸 On collision, engines use chaining or probing.
// 🎯 Average O(1) because loads are kept low and hashes are
//    spread across buckets.

// 🔸 JS engines implement Map/Set as actual hash tables with
//    complex optimisations (V8: ordered hash table with
//    iteration in insertion order).

// ⚠️ There is NO built-in `hash()` function in JS. Primitives
//    (strings, numbers) are hashed internally; objects by
//    reference.
// ⚠️ Custom hash functions for objects require serialisation
//    (JSON.stringify) — slow and error-prone.

// 🧠 Two keys are considered "the same" iff:
//      a === b   (SameValueZero for Map/Set — NaN === NaN here!)
//    For object keys, === means REFERENCE equality.

// 🔎 SameValueZero:
const m = new Map<number, string>();
m.set(NaN, "not a number");
console.log(m.get(NaN));            // "not a number"  ← unlike === !

// 🧠 Set and Map use SameValueZero: NaN equals NaN, and +0 equals -0.


/* ============================================================
 *  3️⃣ MAP — THE REAL HASH TABLE
 * ============================================================ */
// 🔹 Map keys can be ANY value (object, function, NaN, etc.).
// 🔹 Map preserves INSERTION ORDER on iteration.
// 🔹 Map has a .size property (O(1)).
// 🎯 Use Map whenever you'd use a hashmap in other languages.

// ── Construction ─────────────────────────────────────────────
const emptyMap = new Map<string, number>();

const fromPairs = new Map<string, number>([
  ["a", 1],
  ["b", 2],
]);
console.log(fromPairs);             // Map(2) { 'a' => 1, 'b' => 2 }

// ── Core operations ──────────────────────────────────────────
const m1 = new Map<string, number>();
m1.set("a", 1);                     // O(1)
m1.set("b", 2);
m1.set("a", 10);                    // overwrites

console.log(m1.get("a"));           // 10
console.log(m1.get("c"));           // undefined — no throw
console.log(m1.has("a"));           // true — O(1)
console.log(m1.size);               // 2  — O(1)

m1.delete("b");                     // O(1) — returns boolean
console.log(m1.has("b"));           // false

m1.clear();                         // O(n)
console.log(m1.size);               // 0

// ── Non-string keys ──────────────────────────────────────────
type Point = { x: number; y: number };
const graph = new Map<Point, string[]>();
const p1: Point = { x: 0, y: 0 };
const p2: Point = { x: 1, y: 0 };
graph.set(p1, []);
graph.set(p2, []);
console.log(graph.get(p1));         // [] — same reference
console.log(graph.get({ x: 0, y: 0 })); // undefined — different object

// ⚠️ Object keys use REFERENCE identity, not structural equality.
//    For structural keys, use a serialised string form:
function keyOf(p: Point): string {
  return `${p.x},${p.y}`;
}
const grid = new Map<string, string>();
grid.set(keyOf(p1), "origin");
console.log(grid.get(keyOf({ x: 0, y: 0 })));   // "origin"

// ── Map vs plain Object: a quick comparison ──────────────────
// | Feature              │ Map                 │ Object           │
// |----------------------|---------------------|------------------|
// | Key types            │ any                 │ string / symbol  │
// | Ordered iteration    │ yes (insertion)     │ integer keys     │
// |                      │                     │ then insertion   │
// | .size property       │ yes (O(1))          │ no — Object.keys |
// | Prototype pollution  │ immune              │ has prototype    │
// | Frequent delete      │ optimized           │ deopts           │
// | Iteration            │ for...of entries()  │ for...in / keys  |
// | Performance (map ops)│ designed for it     │ slower           |
// ─────────────────────────────────────────────────────────────

// 🧠 Rule: use Map for any real hashmap work. Object is fine for
//    fixed-shape records (DTOs, configs), not for dynamic keys.


/* ============================================================
 *  4️⃣ OBJECT AS MAP (AND WHY TO AVOID IT)
 * ============================================================ */
// 🔹 Objects can serve as maps for STRING keys, with caveats.
// 🔸 They inherit from Object.prototype, so `in` sees inherited
//    keys — use Object.hasOwn (ES2022).
// 🔸 Keys are coerced to strings (or symbols).
// 🔸 Frequent `delete` causes hidden-class deoptimisation.

const obj: Record<string, number> = {};
obj["a"] = 1;
obj["b"] = 2;
console.log(obj["a"]);              // 1
console.log("a" in obj);            // true — but ALSO checks prototype
console.log(Object.hasOwn(obj, "a"));   // true — own-property only

// ⚠️ The prototype trap:
console.log("toString" in obj);             // true (inherited!)
console.log(Object.hasOwn(obj, "toString")); // false

// ⚠️ Numeric keys are coerced to strings:
const o2: Record<number, string> = {};
o2[1] = "one";
o2["1"] = "uno";                    // SAME key!
console.log(Object.keys(o2));       // ["1"]

// ⚠️ Deleting frequently deoptimises the object:
for (let i = 0; i < 1000; i++) {
  const key = `k${i}`;
  obj[key] = i;
  delete obj[key];                  // repeatedly creates new shapes
}

// ✅ Use Map instead:
const better = new Map<string, number>();
better.set("a", 1);
better.delete("a");

// 🔸 When to use Object as map:
//    - Fixed, known set of string keys (config, cache).
//    - JSON-serialisable data (Object serialises, Map does not).
//    - Very small counts where perf doesn't matter.
// 🧠 Otherwise: Map.


/* ============================================================
 *  5️⃣ SET — THE COLLECTION OF UNIQUES
 * ============================================================ */
// 🔹 Set is a Map without values — a bag of unique keys.
// 🔸 Preserves insertion order.
// 🎯 Use for membership, dedup, and set algebra.

const s = new Set<number>();
s.add(1);                           // O(1)
s.add(2);
s.add(2);                           // no-op (already present)
console.log(s.size);                // 2
console.log(s.has(1));              // true — O(1)
s.delete(1);                        // O(1) — returns boolean
console.log(s.has(1));              // false

// ── Deduplication ────────────────────────────────────────────
const dup = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(dup)];
console.log(unique);                // [1, 2, 3, 4]

// ── Set algebra ──────────────────────────────────────────────
function union<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  return new Set([...a, ...b]);
}

function intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const out = new Set<T>();
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (big.has(x)) out.add(x);
  return out;
}

function difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const out = new Set<T>();
  for (const x of a) if (!b.has(x)) out.add(x);
  return out;
}

function symmetricDifference<T>(
  a: ReadonlySet<T>,
  b: ReadonlySet<T>,
): Set<T> {
  const out = new Set<T>();
  for (const x of a) if (!b.has(x)) out.add(x);
  for (const x of b) if (!a.has(x)) out.add(x);
  return out;
}

const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5, 6]);
console.log([...union(A, B)]);              // [1,2,3,4,5,6]
console.log([...intersection(A, B)]);       // [3,4]
console.log([...difference(A, B)]);         // [1,2]
console.log([...symmetricDifference(A, B)]);// [1,2,5,6]

// ⚠️ ES2025 adds native set methods: union, intersection,
//    difference, symmetricDifference, isSubsetOf, isSupersetOf,
//    isDisjointFrom. Check your TS / runtime support.

// 🧠 Rule: use Set when you only need "have I seen this?".
//    Use Map when you also need to associate a value.


/* ============================================================
 *  6️⃣ WEAKMAP AND WEAKSET
 * ============================================================ */
// 🔹 WeakMap / WeakSet hold WEAK references to their keys.
// 🔸 Keys MUST be objects. Values can be anything.
// 🔸 Not iterable, no .size — designed for object metadata.
// 🎯 Used for private data, caches keyed by object identity.

const metadata = new WeakMap<object, string>();
const objKey: object = { id: 1 };
metadata.set(objKey, "some info");
console.log(metadata.get(objKey));  // "some info"
metadata.delete(objKey);            // O(1)

// 🔸 Typical use: attach hidden data to instances without
//    polluting them.

class Counter {
  private static counts = new WeakMap<Counter, number>();

  constructor() {
    Counter.counts.set(this, 0);
  }

  inc(): void {
    Counter.counts.set(this, (Counter.counts.get(this) ?? 0) + 1);
  }

  value(): number {
    return Counter.counts.get(this) ?? 0;
  }
}

const c = new Counter();
c.inc();
c.inc();
console.log(c.value());             // 2

// ⚠️ WeakMap is NOT a general-purpose hashmap — no iteration.
// 🧠 Use it when you want "extra data that disappears with the
//    object".


/* ============================================================
 *  7️⃣ ITERATION PATTERNS
 * ============================================================ */
// 🔹 for...of entries()   : [key, value]
// 🔹 for...of keys()      : keys
// 🔹 for...of values()    : values
// 🔹 forEach(cb)          : key, value (no early exit)
// 🔹 Set: for...of or forEach — no keys() / values() distinction

const scores = new Map<string, number>([
  ["Ravi", 92],
  ["Meera", 85],
  ["Arjun", 78],
]);

for (const [name, score] of scores) {
  console.log(name, score);
}

for (const name of scores.keys()) console.log(name);
for (const score of scores.values()) console.log(score);

scores.forEach((score, name) => {
  console.log(`${name}: ${score}`);
});

// 🔸 Convert to array
const entries: Array<[string, number]> = [...scores];
const arrFromMap = Array.from(scores);

// 🔸 Sort by value (need entries array)
const sortedByScore = [...scores].sort((a, b) => b[1] - a[1]);
console.log(sortedByScore);         // [["Ravi",92],["Meera",85],["Arjun",78]]

// 🔸 Set iteration
for (const v of A) console.log(v);

// 🔸 Map/Set are iterable — for...of works directly.
// 🔸 Object is NOT iterable — use Object.entries / keys / values.

// ⚠️ Do NOT modify a Map/Set while iterating — undefined behaviour.
//    Build a new structure or iterate over a snapshot:
for (const [k, v] of [...scores]) {
  if (v < 80) scores.delete(k);
}


/* ============================================================
 *  8️⃣ COMMON DSA PATTERNS
 * ============================================================ */
// 🔹 FREQUENCY MAP — count occurrences in one pass.
function charFreq(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return freq;
}

console.log(charFreq("banana"));    // Map { 'b' => 1, 'a' => 3, 'n' => 2 }

// 🔹 TWO-SUM — indices of two numbers summing to target.
function twoSum(xs: readonly number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();   // value → index
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;
    const need = target - x;
    const idx = seen.get(need);
    if (idx !== undefined) return [idx, i];
    seen.set(x, i);
  }
  return null;
}

console.log(twoSum([2, 7, 11, 15], 9));     // [0, 1]
console.log(twoSum([3, 3], 6));             // [0, 1]
console.log(twoSum([1, 2, 3], 100));        // null

// 🔹 GROUP ANAGRAMS — group words by sorted-char signature.
function groupAnagrams(words: readonly string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const w of words) {
    const key = [...w].sort().join("");
    const bucket = groups.get(key);
    if (bucket) bucket.push(w);
    else groups.set(key, [w]);
  }
  return [...groups.values()];
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]

// 🔹 DEDUP PRESERVING ORDER
function dedup<T>(xs: readonly T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of xs) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

console.log(dedup([1, 2, 1, 3, 2, 4]));     // [1, 2, 3, 4]

// 🔹 SUBARRAY SUM EQUALS K — prefix sum + hashmap.
function subarraySum(xs: readonly number[], k: number): number {
  let count = 0;
  let prefix = 0;
  const seen = new Map<number, number>([[0, 1]]);
  for (const x of xs) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}

console.log(subarraySum([1, 1, 1], 2));     // 2
console.log(subarraySum([1, 2, 3], 3));     // 2

// 🔹 FIRST NON-REPEATING CHARACTER
function firstUnique(s: string): string | null {
  const freq = charFreq(s);
  for (const ch of s) {
    if (freq.get(ch) === 1) return ch;
  }
  return null;
}

console.log(firstUnique("swiss"));          // "w"

// 🔹 INTERSECTION OF TWO ARRAYS (using Set)
function intersectionArray(a: readonly number[], b: readonly number[]): number[] {
  const setA = new Set(a);
  const setB = new Set(b);
  const out: number[] = [];
  for (const x of setA) if (setB.has(x)) out.push(x);
  return out;
}

console.log(intersectionArray([1, 2, 2, 3], [2, 2, 4]));    // [2]

// 🧠 Pattern recognition: "seen before", "count", "group by",
//    "pair up" → Map. "unique" → Set. "top-k" → Map + heap.


/* ============================================================
 *  9️⃣ COLLISIONS AND WORST-CASE BEHAVIOUR
 * ============================================================ */
// 🔹 Collisions happen when two keys hash to the same bucket.
// 🔸 JS engines use sophisticated schemes (V8: ordered hash
//    table with chaining on overflow).
// 🔸 Load factor is kept low by resizing (rehash) — amortised
//    O(1) insert.
// ⚠️ Worst case is theoretically O(n) per op — extremely rare
//    with engine-provided hashing of primitives.

// 🔸 You CANNOT define a custom hash for a Map key — reference
//    identity is used for objects.
// 🔸 If you need structural hashing for objects, serialise:
type User = { id: number; role: string };
function userKey(u: User): string {
  return `${u.id}|${u.role}`;
}
const byUser = new Map<string, number>();
byUser.set(userKey({ id: 1, role: "admin" }), 100);
console.log(byUser.get(userKey({ id: 1, role: "admin" })));  // 100

// 🧠 Rule: for objects as keys, serialise to string OR keep a
//    stable reference. SameValueZero only helps for primitives.

// 🔸 Map/Set rehashing is automatic — no manual tuning in JS.
//    If you're storing millions of keys, consider a specialised
//    data structure.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Objects as Map keys use REFERENCE identity, not value.
// ⚠️ Object literals as "maps" coerce keys to strings/symbols.
// ⚠️ `in` operator on objects sees inherited props — use
//    Object.hasOwn.
// ⚠️ Object.freeze is shallow — nested mutable values still
//    change.
// ⚠️ Map/Set iteration order is insertion order — relying on it
//    is fine but not for cross-runtime portability in some edge
//    cases (older engines).
// ⚠️ Map/Set do not JSON-serialise — convert to entries array
//    first.
const jsonSafe = JSON.stringify([...scores]);
console.log(jsonSafe);              // '[["Ravi",92],...]'

// ⚠️ Deleting from a Map/Set while iterating is unsafe.
// ⚠️ WeakMap keys must be OBJECTS (not primitives).
// ⚠️ WeakMap/WeakSet are not enumerable — no iteration.
// ⚠️ SameValueZero means NaN === NaN and +0 === -0 in Map/Set.
// ⚠️ Object.keys returns string keys only; integer keys are
//    sorted ascending on iteration (JS spec).
// ⚠️ Don't use `arr` as key — every array is a distinct object.
// ⚠️ Set of arrays / objects deduplicates by REFERENCE, not by
//    value.
const s1 = new Set<number[]>([[1, 2], [1, 2]]);
console.log(s1.size);               // 2 — different array refs
// ✅ For value dedup, serialise:
const s2 = new Set<number[]>().add([1, 2]);
const keySet = new Set<string>();
for (const arr of [[1, 2], [1, 2]]) keySet.add(JSON.stringify(arr));
console.log(keySet.size);           // 1

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - WeakMap / WeakSet: ES2015
 * - Map.prototype.forEach / entries: ES2015
 * - Object.hasOwn: ES2022 (replaces hasOwnProperty.call)
 * - Object.entries / values: ES2017
 * - Set.prototype.union / intersection / difference / etc.:
 *   ES2025 (recently standardised; check TS lib target)
 * - Object.groupBy / Map.groupBy: ES2024
 * - structuredClone: global in Node 17+ / modern browsers
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - Map iteration order: insertion order, guaranteed by spec
 * - Record<K, V> in TS is a type-level alias for objects with
 *   K-typed keys — no runtime guarantee
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation             │ Map/Set       │ Object/Record       |
 * ─────────────────────────────────────────────────────────────
 * | get / has             │ O(1) average  │ O(1) average        |
 * | set / add             │ O(1) average  │ O(1) average        |
 * | delete                │ O(1)          │ slow (deopt)        |
 * | size / count          │ O(1) .size    │ Object.keys().length|
 * | iterate               │ O(n) insertion│ O(n) int-then-ins   |
 * | key types             │ any           │ string / symbol     |
 * | Prototype pollution   │ immune        │ possible            |
 * | JSON serialisable     │ no (by default│ yes                 |
 * |                       │ — spread first)│                    |
 * ─────────────────────────────────────────────────────────────
 * | Data Structure        │ Use for                             |
 * ─────────────────────────────────────────────────────────────
 * | Map<K,V>              │ key → value mapping, counting,      |
 * |                       │ grouping                            |
 * | Set<T>                │ membership, dedup, set algebra      |
 * | WeakMap<K,V>          │ object metadata, private data,      |
 * |                       │ caches keyed by object identity     |
 * | WeakSet<T>            │ marks on objects (visited flags)    |
 * | Record<K,V> / {}      │ fixed-shape records, JSON-friendly  |
 * ─────────────────────────────────────────────────────────────
 * | Pattern              │ Recipe                              |
 * ─────────────────────────────────────────────────────────────
 * | Frequency map        │ Map with count, `m.get(k) ?? 0 + 1` |
 * | Dedup (ordered)      │ Set + Array                         |
 * | Two-sum              │ seen: Map<number, index>            |
 * | Group anagrams       │ key = sorted chars                  |
 * | Subarray sum = k     │ prefix sum + Map<number, count>     |
 * | First unique         │ Map + second pass                   |
 * | Intersection         │ Set.has over small set              |
 * | Union / diff         │ Set iteration                       |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Object key reference        │ Map treats as distinct keys    |
 * | `in` on object              │ Sees inherited props           |
 * | Coerced number keys         │ o[1] === o["1"]                |
 * | Frequent delete on Object   │ Hidden-class deopt             |
 * | Set of arrays               │ Dedups by reference, not value |
 * | JSON.stringify(new Map())   │ "{}" — no serialisation        |
 * | WeakMap non-object keys     │ TypeError                      |
 * | Modifying during iteration  │ Undefined behaviour            |
 * | NaN !== NaN expectation     │ SameValueZero: NaN === NaN     |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Default to Map/Set for hashmap work — designed for it.
 *  - Use Object/Record only for fixed-shape or JSON data.
 *  - Use Object.hasOwn instead of `in` for own-property checks.
 *  - Use Set for dedup and membership.
 *  - Use Map for frequency, grouping, two-sum.
 *  - Serialise object keys to strings when you need structural
 *    hashing.
 *  - Convert Map to array ([...map]) before JSON.stringify.
 *  - Never mutate a Map/Set while iterating — build a new one.
 *  - Use WeakMap for private metadata keyed by object identity.
 *  - Beware SameValueZero for NaN and ±0 in Map/Set.
 *  - Prefer [...new Set(arr)] for dedup, but only for primitives
 *    or reference-dedup.
 *  - Test with: empty, single key, NaN, ±0, object keys, and
 *    large sizes.
 *  - Don't rely on `for...in` for Map/Set — use `for...of`.
 * ============================================================ */