// 17_Two_Pointers_and_Sliding_Window.ts

/* ============================================================
 *  📘 TWO POINTERS & SLIDING WINDOW IN TYPESCRIPT
 *
 *  TWO POINTERS: use two indices moving through a sequence to
 *  replace a nested loop with a single pass. SLIDING WINDOW: a
 *  special two-pointer pattern that maintains a window [l, r]
 *  and expands/shrinks it. Both convert O(n²) brute-force into
 *  O(n) and are the most common interview pattern after hashing.
 *
 *  This file covers: opposite-direction two pointers, fast/slow,
 *  same-direction, fixed-size window, variable-size window,
 *  substring / subarray problems, and the reasoning behind when
 *  a window is valid.
 *
 *  Sections:
 *   1. What the two-pointer pattern is
 *   2. Opposite-direction two pointers
 *   3. Fast/slow pointers
 *   4. Same-direction two pointers (read/write)
 *   5. Fixed-size sliding window
 *   6. Variable-size sliding window
 *   7. Longest substring without repeat (classic)
 *   8. Minimum window substring (hard)
 *   9. Pattern recognition guide
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT THE TWO-POINTER PATTERN IS
 * ============================================================ */
// 🔹 Two indices i, j move through the data.
// 🔸 Their relationship encodes the state you care about.
// 🎯 Convert O(n²) "for each i, scan all j" → O(n) "one pass".

// ── Common patterns ──────────────────────────────────────────
// | Pattern                    │ Typical use                    |
// |----------------------------|--------------------------------|
// | Opposite-direction (i,j)   │ sorted pair sum, palindrome    |
// | Fast/slow (i, 2i)          │ cycle detect, middle of list   |
// | Same-direction (read/write)│ dedup, partition, remove       |
// | Sliding window (l, r)      │ substring / subarray           |
// ─────────────────────────────────────────────────────────────

// 🧠 Signal words: "sorted", "pair", "subarray", "substring",
//    "window", "contiguous", "longest", "smallest".


/* ============================================================
 *  2️⃣ OPPOSITE-DIRECTION TWO POINTERS
 * ============================================================ */
// 🔹 Start at both ends, move toward each other.
// 🔸 Requires SORTED input for pair-sum.
// 🎯 Palindrome check, sorted two-sum, container with most water.

// 🔸 Sorted two-sum: find pair summing to target
function twoSumSorted(
  xs: readonly number[],
  target: number,
): [number, number] | null {
  let i = 0;
  let j = xs.length - 1;
  while (i < j) {
    const a = xs[i];
    const b = xs[j];
    if (a === undefined || b === undefined) return null;
    const s = a + b;
    if (s === target) return [i, j];
    if (s < target) i += 1;             // need bigger → move left up
    else j -= 1;                        // need smaller → move right down
  }
  return null;
}

console.log(twoSumSorted([1, 2, 3, 4, 6], 6));     // [1, 3]  2+4
console.log(twoSumSorted([1, 2, 3, 4, 6], 100));   // null

// 🔸 Palindrome check
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
console.log(isPalindrome("hello"));     // false

// 🔸 Reverse in place
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

// 🔸 Container with most water (classic hard)
function maxArea(heights: readonly number[]): number {
  let i = 0;
  let j = heights.length - 1;
  let best = 0;
  while (i < j) {
    const hi = heights[i];
    const hj = heights[j];
    if (hi === undefined || hj === undefined) break;
    const h = Math.min(hi, hj);
    best = Math.max(best, h * (j - i));
    // Move the SHORTER side inward
    if (hi < hj) i += 1;
    else j -= 1;
  }
  return best;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));  // 49

// 🧠 Why "move the shorter side"? Because moving the taller
//    side never increases the min-height — only reduces width.


/* ============================================================
 *  3️⃣ FAST/SLOW POINTERS
 * ============================================================ */
// 🔹 Two pointers at different speeds.
// 🔸 Fast moves 2x, slow moves 1x.
// 🎯 Cycle detection, middle of a linked list, "happy number".

// 🔸 Middle of a linked list
class ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  constructor(value: T, next: ListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

function middleNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// 🔸 Cycle detection (Floyd's)
function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 🔸 Find duplicate number in an array (0..n) using Floyd's
function findDuplicate(xs: readonly number[]): number {
  let slow = xs[0] ?? 0;
  let fast = xs[0] ?? 0;
  // Phase 1: find meeting point
  while (true) {
    slow = xs[slow] ?? 0;
    fast = xs[xs[fast] ?? 0] ?? 0;
    if (slow === fast) break;
  }
  // Phase 2: find cycle entry
  slow = xs[0] ?? 0;
  while (slow !== fast) {
    slow = xs[slow] ?? 0;
    fast = xs[fast] ?? 0;
  }
  return slow;
}

console.log(findDuplicate([1, 3, 4, 2, 2]));    // 2
console.log(findDuplicate([3, 1, 3, 4, 2]));    // 3

// 🧠 Fast/slow shines when the array/linked list has an implicit
//    "index → value" graph structure.


/* ============================================================
 *  4️⃣ SAME-DIRECTION TWO POINTERS (READ/WRITE)
 * ============================================================ */
// 🔹 One pointer writes, one reads.
// 🔸 Compacts or partitions in place.
// 🎯 Remove duplicates, remove element, move zeros, partition.

// 🔸 Remove duplicates from a SORTED array in place
function removeDuplicatesSorted(xs: number[]): number {
  if (xs.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < xs.length; read++) {
    const r = xs[read];
    const w = xs[write - 1];
    if (r === undefined || w === undefined) continue;
    if (r !== w) {
      xs[write] = r;
      write += 1;
    }
  }
  return write;
}

const dup = [1, 1, 2, 2, 3];
const k = removeDuplicatesSorted(dup);
console.log(dup.slice(0, k));           // [1, 2, 3]

// 🔸 Move all zeros to the end (stable order of non-zeros)
function moveZeros(xs: number[]): void {
  let write = 0;
  for (let read = 0; read < xs.length; read++) {
    const r = xs[read];
    if (r === undefined) continue;
    if (r !== 0) {
      const w = xs[write];
      if (w !== undefined) {
        xs[write] = r;
        xs[read] = w;
      }
      write += 1;
    }
  }
}

const zs = [0, 1, 0, 3, 12];
moveZeros(zs);
console.log(zs);                        // [1, 3, 12, 0, 0]

// 🔸 Remove an element in place, return new length
function removeElement(xs: number[], val: number): number {
  let write = 0;
  for (let read = 0; read < xs.length; read++) {
    const r = xs[read];
    if (r === undefined) continue;
    if (r !== val) {
      xs[write] = r;
      write += 1;
    }
  }
  return write;
}

// 🧠 Read/write pointers = in-place filters.
//    Both pointers move LEFT-TO-RIGHT, but read is always ahead.


/* ============================================================
 *  5️⃣ FIXED-SIZE SLIDING WINDOW
 * ============================================================ */
// 🔹 Window of exactly k elements; slide by 1 each step.
// 🔸 Reuse previous computation (subtract the leaving element).
// 🎯 "Max sum of k consecutive", "average of k", "contains dup
//    within k distance".

function maxSumWindow(xs: readonly number[], k: number): number {
  if (k <= 0 || k > xs.length) return 0;
  let window = 0;
  for (let i = 0; i < k; i++) window += xs[i] ?? 0;
  let best = window;
  for (let i = k; i < xs.length; i++) {
    const entering = xs[i] ?? 0;
    const leaving = xs[i - k] ?? 0;
    window += entering - leaving;       // add new, drop old
    best = Math.max(best, window);
  }
  return best;
}

console.log(maxSumWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));   // 16

// 🔸 Fixed window with a monotonic deque (for max/min)
function maxSlidingWindow(xs: readonly number[], k: number): number[] {
  if (k <= 0 || k > xs.length) return [];
  const out: number[] = [];
  const dq: number[] = [];              // indices, decreasing values
  let head = 0;                         // head pointer (avoid shift)
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;
    // Pop out-of-window indices from front
    while (head < dq.length) {
      const front = dq[head];
      if (front === undefined || front > i - k) break;
      head += 1;
    }
    // Pop smaller values from back
    while (dq.length > head) {
      const back = dq[dq.length - 1];
      if (back === undefined) break;
      const backVal = xs[back];
      if (backVal === undefined || backVal >= x) break;
      dq.pop();
    }
    dq.push(i);
    if (i >= k - 1) {
      const front = dq[head];
      if (front !== undefined) {
        const v = xs[front];
        if (v !== undefined) out.push(v);
      }
    }
  }
  return out;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]

// 🧠 Fixed window = O(n) — you never re-scan the whole window.
// 🧠 Monotonic deque with a head pointer avoids O(n) shift.


/* ============================================================
 *  6️⃣ VARIABLE-SIZE SLIDING WINDOW
 * ============================================================ */
// 🔹 Expand r while window is valid; shrink l until valid.
// 🔸 Both pointers move monotonically → O(n) total.
// 🎯 "Longest / shortest subarray where <condition>".

// 🔸 Smallest subarray with sum ≥ target (positive numbers)
function minSubarrayLen(xs: readonly number[], target: number): number {
  let left = 0;
  let total = 0;
  let best = Infinity;
  for (let right = 0; right < xs.length; right++) {
    total += xs[right] ?? 0;
    while (total >= target) {
      best = Math.min(best, right - left + 1);
      total -= xs[left] ?? 0;
      left += 1;
    }
  }
  return best === Infinity ? 0 : best;
}

console.log(minSubarrayLen([2, 3, 1, 2, 4, 3], 7));    // 2  ([4,3])
console.log(minSubarrayLen([1, 4, 4], 4));             // 1

// 🔸 Longest substring without repeating characters
function longestUniqueSubstring(s: string): number {
  const last = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (ch === undefined) continue;
    const prev = last.get(ch);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(longestUniqueSubstring("abcabcbb"));    // 3
console.log(longestUniqueSubstring("bbbbb"));       // 1
console.log(longestUniqueSubstring("pwwkew"));      // 3

// 🔸 Longest substring with at most k distinct chars
function longestKDistinct(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (ch === undefined) continue;
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
    while (counts.size > k) {
      const lc = s[left];
      if (lc !== undefined) {
        const c = counts.get(lc) ?? 0;
        if (c === 1) counts.delete(lc);
        else counts.set(lc, c - 1);
      }
      left += 1;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(longestKDistinct("eceba", 2));          // 3  ("ece")
console.log(longestKDistinct("aa", 1));             // 2

// 🔸 Longest subarray with sum ≤ k (positive numbers)
function longestSubarraySumLe(xs: readonly number[], k: number): number {
  let left = 0;
  let total = 0;
  let best = 0;
  for (let right = 0; right < xs.length; right++) {
    total += xs[right] ?? 0;
    while (total > k) {
      total -= xs[left] ?? 0;
      left += 1;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(longestSubarraySumLe([1, 2, 1, 0, 1, 1, 1], 4));    // 5

// 🧠 Variable window template:
//     let left = 0;
//     for (let right = 0; right < xs.length; right++) {
//       add xs[right] to window;
//       while (window is INVALID) { remove xs[left]; left += 1; }
//       update best with (right - left + 1);
//     }
//     return best;


/* ============================================================
 *  7️⃣ LONGEST SUBSTRING WITHOUT REPEAT (DEEP DIVE)
 * ============================================================ */
// 🔹 Multiple correct approaches:
//     a) Set + sliding window        → O(n) time, O(k) space
//     b) Map of last index           → O(n) time, O(k) space
// 🔸 The Map version can "jump" left forward in O(1) instead
//    of shrinking one char at a time.

function lengthOfLongestSubstring(s: string): number {
  const last = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (ch === undefined) continue;
    const prev = last.get(ch);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(lengthOfLongestSubstring("dvdf"));  // 3
console.log(lengthOfLongestSubstring(""));      // 0
console.log(lengthOfLongestSubstring(" "));     // 1

// 🧠 The `prev >= left` guard is crucial — otherwise you
//    might move left BACKWARD past a valid position.


/* ============================================================
 *  8️⃣ MINIMUM WINDOW SUBSTRING (HARD)
 * ============================================================ */
// 🔹 Find the smallest substring of s that contains all chars of t.
// 🔸 Sliding window + Map for required frequencies.
// 🎯 The quintessential "hard" sliding window problem.

function minWindow(s: string, t: string): string {
  if (s.length === 0 || t.length === 0 || t.length > s.length) return "";

  const need = new Map<string, number>();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);

  let missing = t.length;
  let left = 0;
  let bestLen = Infinity;
  let bestStart = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (ch === undefined) continue;
    const needCh = need.get(ch) ?? 0;
    if (needCh > 0) missing -= 1;
    need.set(ch, needCh - 1);

    while (missing === 0) {
      const winLen = right - left + 1;
      if (winLen < bestLen) {
        bestLen = winLen;
        bestStart = left;
      }
      // Shrink from left
      const lch = s[left];
      if (lch !== undefined) {
        const newCount = (need.get(lch) ?? 0) + 1;
        need.set(lch, newCount);
        if (newCount > 0) missing += 1;
      }
      left += 1;
    }
  }

  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}

console.log(minWindow("ADOBECODEBANC", "ABC"));   // "BANC"
console.log(minWindow("a", "a"));                 // "a"
console.log(minWindow("a", "aa"));                // ""

// 🧠 Pattern: track "how many characters still missing". Once
//    missing === 0, shrink from the left — that's the "collect
//    then shrink" sliding window.

// 🔸 Permutation in string (same idea, simpler)
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const need = new Map<string, number>();
  for (const ch of s1) need.set(ch, (need.get(ch) ?? 0) + 1);

  let missing = s1.length;
  for (let i = 0; i < s2.length; i++) {
    const ch = s2[i];
    if (ch === undefined) continue;
    const nch = need.get(ch) ?? 0;
    if (nch > 0) missing -= 1;
    need.set(ch, nch - 1);

    if (i >= s1.length) {
      const old = s2[i - s1.length];
      if (old !== undefined) {
        const nc = (need.get(old) ?? 0) + 1;
        need.set(old, nc);
        if (nc > 0) missing += 1;
      }
    }
    if (missing === 0) return true;
  }
  return false;
}

console.log(checkInclusion("ab", "eidbaooo"));    // true
console.log(checkInclusion("ab", "eidboaoo"));    // false


/* ============================================================
 *  9️⃣ PATTERN RECOGNITION GUIDE
 * ============================================================ */
// 🔹 "Sorted array, find pair"                → opposite two-ptr
// 🔹 "Palindrome"                             → opposite two-ptr
// 🔹 "Cycle / middle in linked list"          → fast/slow
// 🔹 "Remove duplicates / partition in place" → read/write two-ptr
// 🔹 "Fixed k, sum / max / min over window"   → fixed sliding window
// 🔹 "Longest / shortest subarray where ..."  → variable window
// 🔹 "Substring with chars from t"            → variable window +
//                                                Map counts
// 🔹 "Contains all of t"                      → variable window
//                                                with missing count

// 🧠 Decision flow:
//    1. Contiguous subarray/substring? → SLIDING WINDOW.
//    2. Sorted array + pair/palindrome? → OPPOSITE TWO-POINTERS.
//    3. In-place transform of array?   → READ/WRITE TWO-POINTERS.
//    4. Linked list cycle / middle?     → FAST/SLOW.

// ── Complexity snapshot ──────────────────────────────────────
// | Pattern             │ Time     │ Space                     |
// |---------------------|----------|---------------------------|
// | Opposite two-ptr    │ O(n)     │ O(1)                      |
// | Fast/slow           │ O(n)     │ O(1)                      |
// | Read/write          │ O(n)     │ O(1)                      |
// | Fixed window        │ O(n)     │ O(k) with deque else O(1) |
// | Variable window     │ O(n)     │ O(k) distinct chars       |
// | Min window substr   │ O(n)     │ O(k)                      |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Sliding window with NEGATIVE numbers is tricky:
//    - "smallest subarray sum ≥ k" with negatives → not monotonic
//      → sliding window invalid, use prefix sum + monotonic deque.
//    - Sliding window with positive numbers is safe.
// ⚠️ Fixed-size window: guard k <= 0 or k > xs.length.
// ⚠️ Variable window: always move left forward, never backward.
// ⚠️ `prev >= left` guard in longest-unique prevents left
//    from moving backwards past valid chars.
// ⚠️ Two-sum two-pointer requires SORTED input — otherwise use
//    a Map (file 04).
// ⚠️ Palindrome: compare lowercase / alphanumeric if the problem
//    asks (skip non-alnum).
// ⚠️ Container with most water: move the SHORTER side, not the
//    taller one.
// ⚠️ Fast/slow: check `fast !== null && fast.next !== null`
//    before advancing fast.
// ⚠️ Read/write dedup: only works on SORTED arrays; for unsorted,
//    use a Set or a Map.
// ⚠️ "At most k distinct" — use a Map of counts, not a Set,
//    because you need to know when a count drops to 0.
// ⚠️ Map mutation: need.set(ch, needCh - 1) can go negative;
//    guard with `if (needCh > 0) missing -= 1` when decrementing
//    missing.
// ⚠️ Empty input: return 0 / "" / null explicitly.
// ⚠️ Unicode strings: Map-based counting works; for emoji,
//    iterate by code point via [...s] if using for...of.
// ⚠️ TypeScript noUncheckedIndexedAccess: xs[i] is T|undefined.
//    Narrow with `?? 0` or explicit guard.
// ⚠️ Fixed-window sum overflow: JS numbers are float64; fine up
//    to 2^53. For huge sums, use BigInt.

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - for...of loop: ES2015
 * - Sliding window has no stdlib helper — write your own
 * - Array.prototype.at(-1): ES2022
 * - Optional chaining / nullish coalescing: ES2020
 * - noUncheckedIndexedAccess: TS 4.1+
 * - BigInt for huge sums: ES2020
 * - Intl.Segmenter for grapheme-aware strings: ES2022
 * - String.prototype.replaceAll: ES2021
 * - structuredClone: Node 17+ (rarely needed here)
 * - V8 iterates code points with for...of — use that for
 *   emoji-safe iteration
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Pattern                │ Example problem                     |
 * ─────────────────────────────────────────────────────────────
 * | Opposite two-ptr       │ Two-sum sorted, palindrome,         |
 * |                        │ container with most water           |
 * | Fast/slow              │ Cycle detect, middle node,          |
 * |                        │ find duplicate number               |
 * | Read/write             │ Remove duplicates, move zeros,      |
 * |                        │ remove element, partition           |
 * | Fixed window           │ Max sum of k, sliding max (deque),  |
 * |                        │ contains dup within k               |
 * | Variable window        │ Longest unique substring, min       |
 * |                        │ subarray sum ≥ k, longest k         |
 * |                        │ distinct, min window substring      |
 * ─────────────────────────────────────────────────────────────
 * | Template element       │ Purpose                              |
 * ─────────────────────────────────────────────────────────────
 * | left = 0               │ Window start                        |
 * | for right = 0..n       │ Window end grows each step          |
 * | while INVALID: shrink  │ Restore window invariant            |
 * | update best            │ After window is valid               |
 * | return best / count    │ Final answer                        |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                       │ Why it bites                 |
 * ─────────────────────────────────────────────────────────────
 * | Sliding window with negatives │ Non-monotonic → invalid      |
 * | Two-sum on unsorted           │ Wrong pair                   |
 * | Container moves taller side   │ Misses optimum               |
 * | Fast/slow without next check  │ TypeError                    |
 * | Read/write on unsorted        │ Wrong output                 |
 * | Set instead of Map counts     │ Can't tell when 0 distinct   |
 * | Missing `>= left` guard       │ Left moves backward          |
 * | No `missing === 0` reset      │ Window shrinks incorrectly   |
 * | Overlooking empty input       │ Wrong return type            |
 * | T|undefined not narrowed      │ TypeScript compile error     |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Recognise patterns early: contiguous → window; sorted
 *    pair → opposite pointers; in-place → read/write.
 *  - Use the variable-window template every time — it's uniform.
 *  - For fixed windows, use a monotonic deque with a head
 *    pointer.
 *  - Guard against negatives when sliding (window pattern does
 *    not apply).
 *  - Move the SHORTER side inward in max-area type problems.
 *  - Use Map of last-index when you can jump instead of
 *    shrink-one-at-a-time.
 *  - Always test: empty, single element, all-same, no match.
 *  - Complexities: two-pointer is O(n), sliding window is O(n)
 *    total because left + right each move ≤ n steps.
 *  - If you find yourself writing a nested loop over indices,
 *    ask: "can two pointers do this in one pass?"
 *  - Prefer Map-based counts over manual arrays for
 *    frequency problems.
 *  - Narrow `T | undefined` from indexed access with `?? 0` or
 *    explicit guards in strict TypeScript.
 *  - For huge sums, consider BigInt.
 * ============================================================ */