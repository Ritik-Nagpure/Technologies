// 20_Greedy_Algorithms.ts

/* ============================================================
 *  📘 GREEDY ALGORITHMS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A GREEDY algorithm makes the LOCALLY OPTIMAL choice at each
 *  step, hoping it leads to a globally optimal solution. Greedy
 *  is simple and fast (usually O(n log n) or O(n)), but it
 *  works only when the problem has the RIGHT structure:
 *  greedy-choice property + optimal substructure.
 *
 *  This file covers: when greedy works vs fails, the classic
 *  greedy problems (activity selection, interval scheduling,
 *  Huffman coding, jump game, gas station, minimum platforms,
 *  fractional knapsack), and how to PROVE a greedy is correct
 *  via exchange arguments.
 *
 *  Sections:
 *   1. Greedy vs DP vs brute force
 *   2. When greedy works
 *   3. Activity selection (interval scheduling)
 *   4. Non-overlapping intervals / merge intervals
 *   5. Fractional knapsack
 *   6. Huffman coding (heap-based greedy)
 *   7. Jump game I & II
 *   8. Gas station
 *   9. Minimum platforms / meeting rooms
 *  10. Interval covering / partition labels
 *  11. Pattern recognition guide
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ GREEDY VS DP VS BRUTE FORCE
 * ============================================================ */
// 🔹 Brute force: try all possibilities → exponential.
// 🔹 DP         : compute optimal via overlapping subproblems.
// 🔹 Greedy     : commit to a locally-optimal choice.
// 🔸 Greedy is FASTER but works only for specific problems.
// 🎯 If greedy works, it beats DP. If not, DP saves you.

// ── Comparison table ─────────────────────────────────────────
// | Aspect          │ Greedy              │ DP                  |
// |-----------------│---------------------|---------------------|
// | Decision        │ one, final          │ consider all        |
// | Time            │ usually O(n log n)  │ often O(n²) / O(nW) |
// | Proof           │ exchange argument   │ optimal substructure|
// | Fails when      │ local ≠ global      │ rarely              |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Rule: if you can PROVE the greedy choice is safe (exchange
//    argument), use greedy. Otherwise, DP.

// ⚠️ Famous greedy FAILURES:
//    - 0/1 Knapsack (greedy by value/weight ratio fails).
//    - Coin change with arbitrary denominations.
//    - Longest path in a graph.
// 🔸 For 0/1 knapsack, use DP (file 19).
// 🔸 Coin change with [1, 3, 4] and amount 6 → greedy [4,1,1] = 3
//    coins, but optimal is [3,3] = 2 coins.


/* ============================================================
 *  2️⃣ WHEN GREEDY WORKS
 * ============================================================ */
// 🔹 Conditions (both needed):
//     1. GREEDY-CHOICE PROPERTY: a locally optimal choice is
//        part of SOME globally optimal solution.
//     2. OPTIMAL SUBSTRUCTURE: optimal solution to the whole
//        contains optimal solutions to subproblems.
// 🔸 Proof technique: EXCHANGE ARGUMENT — show that any optimal
//    solution can be transformed into the greedy one without
//    losing optimality.

// 🧠 Common greedy signals:
//    - "Maximum number of non-overlapping X"
//    - "Minimum number of intervals to cover Y"
//    - "Sort by end / start / ratio"
//    - "At each step pick the best available"


/* ============================================================
 *  3️⃣ ACTIVITY SELECTION (INTERVAL SCHEDULING)
 * ============================================================ */
// 🔹 Pick max number of non-overlapping intervals.
// 🔸 Greedy: sort by END time, pick earliest-ending compatible.
// 🎯 Exchange argument: choosing the earliest-ending interval
//    leaves maximum room for the rest.

function activitySelection(
  intervals: ReadonlyArray<[start: number, end: number]>,
): number {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 1;
  let lastEnd = sorted[0]?.[1] ?? 0;
  for (let i = 1; i < sorted.length; i++) {
    const iv = sorted[i];
    if (!iv) continue;
    const [start, end] = iv;
    if (start >= lastEnd) {
      count += 1;
      lastEnd = end;
    }
  }
  return count;
}

console.log(
  activitySelection([
    [1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10],
    [8, 11], [8, 12], [2, 14], [12, 16],
  ]),
);                                      // 4  ((1,4), (5,7), (8,11), (12,16))

// 🧠 Sorting by END (not start) is the key — it's what makes the
//    greedy correct.
// ⚠️ Sorting by start or by length is a common mistake and
//    produces suboptimal answers.


/* ============================================================
 *  4️⃣ NON-OVERLAPPING INTERVALS / MERGE INTERVALS
 * ============================================================ */
// 🔹 LeetCode classic: min removals to make intervals non-overlapping.
// 🔸 Equivalent to: total - max non-overlapping.

function eraseOverlapIntervals(
  intervals: ReadonlyArray<[number, number]>,
): number {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const iv of sorted) {
    if (iv[0] >= lastEnd) {
      count += 1;
      lastEnd = iv[1];
    }
  }
  return intervals.length - count;
}

console.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]));   // 1

// 🔸 Merge overlapping intervals
function mergeIntervals(
  intervals: ReadonlyArray<[number, number]>,
): Array<[number, number]> {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  const first = sorted[0];
  if (!first) return [];
  merged.push([first[0], first[1]]);
  for (let i = 1; i < sorted.length; i++) {
    const iv = sorted[i];
    if (!iv) continue;
    const last = merged[merged.length - 1];
    if (!last) continue;
    if (iv[0] <= last[1]) {
      last[1] = Math.max(last[1], iv[1]);
    } else {
      merged.push([iv[0], iv[1]]);
    }
  }
  return merged;
}

console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));
// [[1, 6], [8, 10], [15, 18]]

// 🔸 Insert interval into a sorted non-overlapping list
function insertInterval(
  intervals: ReadonlyArray<[number, number]>,
  newInterval: [number, number],
): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  const n = intervals.length;
  let i = 0;
  const newIv: [number, number] = [newInterval[0], newInterval[1]];
  // Add all intervals ending before new starts
  while (i < n) {
    const iv = intervals[i];
    if (!iv || iv[1] >= newIv[0]) break;
    result.push([iv[0], iv[1]]);
    i += 1;
  }
  // Merge overlapping intervals
  while (i < n) {
    const iv = intervals[i];
    if (!iv || iv[0] > newIv[1]) break;
    newIv[0] = Math.min(newIv[0], iv[0]);
    newIv[1] = Math.max(newIv[1], iv[1]);
    i += 1;
  }
  result.push(newIv);
  // Add remaining
  while (i < n) {
    const iv = intervals[i];
    if (iv) result.push([iv[0], iv[1]]);
    i += 1;
  }
  return result;
}

console.log(insertInterval([[1,3],[6,9]], [2,5]));
// [[1, 5], [6, 9]]

// 🧠 Sort by END for "max non-overlapping"; sort by START for
//    "merge overlapping".


/* ============================================================
 *  5️⃣ FRACTIONAL KNAPSACK
 * ============================================================ */
// 🔹 Like 0/1 knapsack, but you can take FRACTIONS of items.
// 🔸 Greedy: sort by value/weight ratio, take as much as fits.
// 🎯 Because you can take fractions, greedy is optimal.

function fractionalKnapsack(
  weights: readonly number[],
  values: readonly number[],
  capacity: number,
): number {
  const items: Array<{ w: number; v: number; ratio: number }> = [];
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const v = values[i];
    if (w === undefined || v === undefined || w === 0) continue;
    items.push({ w, v, ratio: v / w });
  }
  items.sort((a, b) => b.ratio - a.ratio);

  let total = 0;
  let cap = capacity;
  for (const item of items) {
    if (cap <= 0) break;
    const take = Math.min(item.w, cap);
    total += item.v * (take / item.w);
    cap -= take;
  }
  return total;
}

console.log(fractionalKnapsack([10, 20, 30], [60, 100, 120], 50));
// 240  (take all 10 & 20, then 2/3 of 30)

// ⚠️ This trick does NOT work for 0/1 knapsack — you can't take
//    fractions, so use DP.
// 🧠 "Fraction allowed" → greedy. "Take or skip" → DP.


/* ============================================================
 *  6️⃣ HUFFMAN CODING (HEAP-BASED GREEDY)
 * ============================================================ */
// 🔹 Build an optimal prefix-free binary encoding.
// 🔸 Repeatedly merge the two LOWEST-frequency nodes.
// 🎯 Classic use of a min-heap as a greedy structure.

class HuffmanNode {
  freq: number;
  char: string | null;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(
    freq: number,
    char: string | null = null,
    left: HuffmanNode | null = null,
    right: HuffmanNode | null = null,
  ) {
    this.freq = freq;
    this.char = char;
    this.left = left;
    this.right = right;
  }
}

// Simple min-heap of HuffmanNodes by freq
function huffmanCodes(text: string): Map<string, string> {
  const codes = new Map<string, string>();
  if (text.length === 0) return codes;

  // Frequency count
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  // Build a min-heap manually (array of nodes sorted by freq)
  const heap: HuffmanNode[] = [];
  for (const [ch, f] of freq) heap.push(new HuffmanNode(f, ch));

  // Use a simple sorted-insertion heap (fine for demo; use a
  // real MinHeap from file 11 for production)
  heap.sort((a, b) => a.freq - b.freq);
  const push = (node: HuffmanNode) => {
    let lo = 0;
    let hi = heap.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const v = heap[mid];
      if (v && v.freq < node.freq) lo = mid + 1;
      else hi = mid;
    }
    heap.splice(lo, 0, node);
  };
  const pop = () => heap.shift();

  while (heap.length > 1) {
    const a = pop();
    const b = pop();
    if (!a || !b) break;
    const parent = new HuffmanNode(a.freq + b.freq, null, a, b);
    push(parent);
  }

  const root = heap[0];
  if (!root) return codes;

  function walk(node: HuffmanNode, prefix: string): void {
    if (node.char !== null) {
      codes.set(node.char, prefix || "0");   // single-char case
      return;
    }
    if (node.left) walk(node.left, prefix + "0");
    if (node.right) walk(node.right, prefix + "1");
  }

  walk(root, "");
  return codes;
}

console.log([...huffmanCodes("aaabbc").entries()]);
// [["a","0"], ["b","10"], ["c","11"]]  (or similar)

// 🔸 Total encoded length
function huffmanLength(text: string): number {
  if (text.length === 0) return 0;
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const codes = huffmanCodes(text);
  let total = 0;
  for (const [ch, code] of codes) {
    total += (freq.get(ch) ?? 0) * code.length;
  }
  return total;
}

console.log(huffmanLength("aaabbc"));   // 9  (3*1 + 2*2 + 1*2)

// 🧠 Huffman is THE canonical example of a greedy algorithm with
//    a heap. The "merge two smallest" step is where greediness
//    shines.
// 🔸 Real-world: gzip, zip, JPEG, MP3 use variants of Huffman.


/* ============================================================
 *  7️⃣ JUMP GAME I & II
 * ============================================================ */
// 🔹 I : Can you reach the last index?
// 🔸 II: Minimum jumps.

// Jump Game I — track the farthest index you can reach
function canJump(nums: readonly number[]): boolean {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;      // stuck before i
    const jump = nums[i];
    if (jump === undefined) continue;
    farthest = Math.max(farthest, i + jump);
  }
  return true;
}

console.log(canJump([2, 3, 1, 1, 4]));  // true
console.log(canJump([3, 2, 1, 0, 4]));  // false

// Jump Game II — greedy BFS-like
function jump(nums: readonly number[]): number {
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    const n = nums[i];
    if (n === undefined) continue;
    farthest = Math.max(farthest, i + n);
    if (i === currentEnd) {              // end of current jump range
      jumps += 1;
      currentEnd = farthest;
      if (currentEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}

console.log(jump([2, 3, 1, 1, 4]));     // 2
console.log(jump([2, 3, 0, 1, 4]));     // 2

// 🧠 Jump II is greedy at the "level" granularity — pick the
//    range that reaches farthest before committing to a jump.


/* ============================================================
 *  8️⃣ GAS STATION
 * ============================================================ */
// 🔹 Circular route; find the starting station to complete it.
// 🔸 If total gas < total cost → impossible.
// 🔸 Otherwise, the start is the first station where running
//    total becomes non-negative after a negative dip.

function canCompleteCircuit(
  gas: readonly number[],
  cost: readonly number[],
): number {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const g = gas[i];
    const c = cost[i];
    if (g === undefined || c === undefined) continue;
    const diff = g - c;
    total += diff;
    tank += diff;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}

console.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]));  // 3
console.log(canCompleteCircuit([2,3,4], [3,4,3]));          // -1

// 🧠 Why "reset start when tank < 0"? Because no station in the
//    interval [old_start..i] could have succeeded either — the
//    running deficit guarantees it.
// 🧠 The proof is the greedy-exchange argument. Elegant and
//    O(n).


/* ============================================================
 *  9️⃣ MINIMUM PLATFORMS / MEETING ROOMS
 * ============================================================ */
// 🔹 Given arrival/departure times, how many platforms needed?
// 🔸 Sort both arrays, use two pointers.

function minPlatforms(
  arrivals: readonly number[],
  departures: readonly number[],
): number {
  const a = [...arrivals].sort((x, y) => x - y);
  const d = [...departures].sort((x, y) => x - y);
  let i = 0;
  let j = 0;
  let platforms = 0;
  let maxPlatforms = 0;
  while (i < a.length) {
    const av = a[i];
    const dv = d[j];
    if (av === undefined) break;
    if (dv === undefined || av <= dv) {
      platforms += 1;
      i += 1;
      maxPlatforms = Math.max(maxPlatforms, platforms);
    } else {
      platforms -= 1;
      j += 1;
    }
  }
  return maxPlatforms;
}

console.log(
  minPlatforms(
    [900, 940, 950, 1100, 1500, 1800],
    [910, 1200, 1120, 1130, 1900, 2000],
  ),
);                                      // 3

// 🔸 Alternative with a heap (event-based):
//    Use a MinHeap<number> from file 11 for production.
//    Here we use a sorted-insert array to keep dependencies local.
function minMeetingRooms(
  intervals: ReadonlyArray<[number, number]>,
): number {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const heap: number[] = [];              // end times, min at heap[0]

  const push = (x: number) => {
    let lo = 0;
    let hi = heap.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const v = heap[mid];
      if (v !== undefined && v < x) lo = mid + 1;
      else hi = mid;
    }
    heap.splice(lo, 0, x);
  };
  const replaceTop = (x: number) => {
    heap[0] = x;
    heap.sort((p, q) => p - q);          // small heaps — fine for demo
  };

  for (const iv of sorted) {
    const [start, end] = iv;
    const top = heap[0];
    if (top !== undefined && top <= start) {
      replaceTop(end);                    // reuse room
    } else {
      push(end);                          // need a new room
    }
  }
  return heap.length;
}

console.log(minMeetingRooms([[0,30],[5,10],[15,20]]));   // 2
console.log(minMeetingRooms([[7,10],[2,4]]));            // 1

// 🧠 Two-pointer approach: O(n log n) time, O(1) extra space
//    (after sorting).
// 🧠 Heap approach: also O(n log n), conceptually cleaner for
//    "reuse the earliest-ending room".


/* ============================================================
 *  🔟 INTERVAL COVERING / PARTITION LABELS
 * ============================================================ */
// 🔹 Minimum arrows to burst balloons (interval covering).
// 🔸 Sort by END, shoot at each end.

function findMinArrows(points: ReadonlyArray<[number, number]>): number {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let last = sorted[0]?.[1] ?? 0;
  for (let i = 1; i < sorted.length; i++) {
    const iv = sorted[i];
    if (!iv) continue;
    if (iv[0] > last) {                  // no overlap with last arrow
      arrows += 1;
      last = iv[1];
    }
  }
  return arrows;
}

console.log(findMinArrows([[10,16],[2,8],[1,6],[7,12]]));   // 2
console.log(findMinArrows([[1,2],[3,4],[5,6],[7,8]]));      // 4

// 🔸 Partition Labels (split string into chunks of unique chars)
function partitionLabels(s: string): number[] {
  const last = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch !== undefined) last.set(ch, i);
  }
  const result: number[] = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === undefined) continue;
    end = Math.max(end, last.get(ch) ?? i);
    if (i === end) {
      result.push(end - start + 1);
      start = i + 1;
    }
  }
  return result;
}

console.log(partitionLabels("ababcbacadefegdehijhklij"));
// [9, 7, 8]

// 🧠 Greedy on "farthest reach so far" — same idea as Jump Game.


/* ============================================================
 *  1️⃣1️⃣ PATTERN RECOGNITION GUIDE
 * ============================================================ */
// 🔹 "Max non-overlapping X"        → sort by END
// 🔹 "Merge overlapping X"          → sort by START
// 🔹 "Min arrows / min points"      → sort by END
// 🔹 "Reach last index"             → track farthest
// 🔹 "Min steps to reach end"       → BFS-like greedy
// 🔹 "Fraction allowed"             → greedy by ratio
// 🔹 "Take or skip"                 → NOT greedy → DP
// 🔹 "Repeatedly pick two smallest" → heap + greedy
// 🔹 "Best start for circular"      → running sum trick

// ── Complexity reference ─────────────────────────────────────
// | Problem                │ Approach          │ Time          |
// |------------------------|-------------------|---------------|
// | Activity selection     │ sort by end       │ O(n log n)    |
// | Merge intervals        │ sort by start     │ O(n log n)    |
// | Fractional knapsack    │ sort by ratio     │ O(n log n)    |
// | Huffman coding         │ heap              │ O(n log n)    |
// | Jump game I            │ track farthest    │ O(n)          |
// | Jump game II           │ greedy levels     │ O(n)          |
// | Gas station            │ running sum       │ O(n)          |
// | Min platforms          │ two pointers      │ O(n log n)    |
// | Min meeting rooms      │ heap              │ O(n log n)    |
// | Partition labels       │ last-index map    │ O(n)          |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Greedy FAILS for 0/1 knapsack — must use DP.
// ⚠️ Greedy FAILS for coin change with arbitrary denominations.
// ⚠️ Sorting by START for non-overlapping problems is WRONG —
//    always sort by END.
// ⚠️ Sorting by END for merge problems is WRONG — always sort by
//    START.
// ⚠️ Jump Game II: the "end of current jump range" trigger is
//    subtle; forgetting it produces wrong count.
// ⚠️ Gas station: reset to i+1 when tank < 0, not i.
// ⚠️ Huffman: single-character input → code must still be "0"
//    (empty prefix is invalid).
// ⚠️ Fractional knapsack with zero-weight items → division by
//    zero. Guard or skip zero-weight items.
// ⚠️ Intervals with equal boundaries: decide if endpoints count
//    as overlapping (LeetCode problems differ).
// ⚠️ Greedy proofs are often skipped in interviews — be ready
//    to explain the exchange argument in words.
// ⚠️ Some problems LOOK greedy but need DP (e.g., House Robber,
//    0/1 Knapsack, Longest Increasing Subsequence).
// ⚠️ Two-pointer interval approach: arrival === departure is
//    ambiguous — check problem statement.
// ⚠️ Sort stability matters for ties — sort by a secondary key.
// ⚠️ JS default Array.sort converts to STRING — always pass
//    a numeric comparator for numeric intervals.
// ⚠️ TypeScript tuple types: [start: number, end: number] helps
//    catch mistakes at compile time.

/* 🕒 Version notes
 * - Array.prototype.sort with comparator: always; stable since ES2019
 * - Map / Set: ES2015
 * - Array spread: ES2015
 * - BigInt for very large values: ES2020
 * - Array.prototype.at(-1) for last element: ES2022
 * - Optional chaining / nullish coalescing: ES2020
 * - Intl.Collator for locale-aware sorting of strings: ES2015+
 * - No built-in heap in JS / TS — implement or use file 11's MinHeap
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - No stdlib for Huffman / interval algorithms — write your own
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Problem              │ Greedy key                      |
 * ─────────────────────────────────────────────────────────────
 * | Activity selection   │ sort by END, pick earliest      |
 * | Non-overlap          │ sort by END                     |
 * | Merge intervals      │ sort by START, extend end       |
 * | Insert interval      │ scan + merge overlap            |
 * | Fractional knapsack  │ sort by value/weight descending |
 * | Huffman coding       │ merge two smallest via heap     |
 * | Jump game I          │ track farthest reach            |
 * | Jump game II         │ greedy on level ranges          |
 * | Gas station          │ reset start when tank < 0       |
 * | Min platforms        │ two-pointer over sorted times   |
 * | Min meeting rooms    │ heap of end times               |
 * | Min arrows (points)  │ sort by END, shoot at end       |
 * | Partition labels     │ last index + farthest reach     |
 * ─────────────────────────────────────────────────────────────
 * | Greedy works          │ Greedy FAILS — use DP           |
 * ─────────────────────────────────────────────────────────────
 * | Fractional knapsack   │ 0/1 knapsack                     |
 * | Activity selection    │ Longest path in DAG              |
 * | Huffman coding        │ Coin change (arbitrary coins)    |
 * | Interval scheduling   │ House robber                     |
 * | Jump game             │ Longest Increasing Subsequence   |
 * | Gas station           │ Edit distance                    |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Sort by start for overlap  │ Wrong count of non-overlap     |
 * | Sort by end for merge      │ Merge misses nested intervals  |
 * | Greedy for 0/1 knapsack    │ Suboptimal value               |
 * | Greedy for coin change     │ Suboptimal coin count          |
 * | Jump II off-by-one         │ Wrong jump count               |
 * | Gas station reset          │ Wrong start index              |
 * | Huffman single char        │ Empty code                     |
 * | Equal boundaries ambiguity │ Off-by-one answers             |
 * | JS default sort (string)   │ Wrong order for numbers        |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Before writing greedy, ask: is the greedy choice provably
 *    safe? Exchange argument in one sentence.
 *  - Sort by END for non-overlap; by START for merge.
 *  - Use a heap when "repeatedly pick smallest / largest".
 *  - Track "farthest reach" for problems with jumps / reach.
 *  - Use running sums (Kadane-style) for gas-station-like
 *    circular problems.
 *  - If greedy fails, fall back to DP — no shame in it.
 *  - Test with: empty input, single item, ties, no solution,
 *    and full solution.
 *  - Interviewers value the exchange argument — practice
 *    explaining WHY greedy works.
 *  - Split "sort + scan" patterns from "heap + scan" patterns:
 *    both are O(n log n) but conceptually different.
 *  - Prefer fractional greedy only when fractions are allowed.
 *  - ALWAYS pass a numeric comparator to Array.sort.
 *  - Use tuple types in TypeScript for interval [start, end] to
 *    catch mistakes at compile time.
 * ============================================================ */