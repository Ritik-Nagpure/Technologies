// 21_Bit_Manipulation.ts

/* ============================================================
 *  📘 BIT MANIPULATION IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  Bit manipulation treats integers as sequences of bits and
 *  uses bitwise operators to solve problems in O(1) time per
 *  operation. It's the ultimate constant-factor optimisation
 *  and the key to many interview problems: subsets via bitmask,
 *  XOR tricks, power-of-two checks, and DP over bitmasks.
 *
 *  ⚠️ IMPORTANT: JavaScript's bitwise operators coerce operands
 *  to 32-bit SIGNED integers. This limits bit tricks to values
 *  in [-2^31, 2^31 - 1]. For wider ranges use BigInt.
 *
 *  This file covers: binary representation, bitwise operators,
 *  common bit tricks, XOR magic, bitmasks for subsets, Brian
 *  Kernighan's popcount, power-of-two, single-number problems,
 *  and DP over bitmasks.
 *
 *  Sections:
 *   1. Binary representation and 32-bit limits
 *   2. Bitwise operators
 *   3. Common bit tricks (get/set/clear/toggle)
 *   4. Power of two & parity checks
 *   5. Brian Kernighan's popcount
 *   6. XOR magic
 *   7. Single number problems
 *   8. Bitmask subsets
 *   9. DP over bitmasks (bitmask DP)
 *  10. BigInt bitwise ops (for > 32-bit integers)
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ BINARY REPRESENTATION AND 32-BIT LIMITS
 * ============================================================ */
// 🔹 JS numbers are float64 — but bitwise operators COERCE to
//    32-bit signed integers (ToInt32).
// 🔸 So `a & b`, `a | b`, `a ^ b`, `~a`, `a << n`, `a >> n`
//    all operate on 32-bit signed ints.
// 🔸 Range: -2^31 .. 2^31 - 1  (-2147483648 .. 2147483647).
// 🔹 Values outside this range are truncated (mod 2^32) before
//    the op, and the RESULT is a 32-bit signed int.

console.log((5).toString(2));           // "101"
console.log((0).toString(2));           // "0"
console.log((-1).toString(2));          // "-1" (unusual — not two's complement)

// 🔸 To view as fixed-width unsigned:
function toBin(n: number, bits: number = 32): string {
  return (n >>> 0).toString(2).padStart(bits, "0");
}

console.log(toBin(42, 8));              // "00101010"
console.log(toBin(-1, 8));              // "11111111"

// 🔸 Bit count helpers
function bitLength(n: number): number {
  return n === 0 ? 0 : Math.floor(Math.log2(Math.abs(n))) + 1;
}

console.log(bitLength(42));             // 6
console.log(bitLength(0));              // 0

// 🔸 TypeScript numeric literal in binary: 0b1010
const b = 0b1010;
console.log(b);                         // 10

// 🔸 Hex literal: 0xFF
console.log(0xFF);                      // 255

// ⚠️ For values > 2^31, use BigInt (see section 10).
// 🧠 If you need true 64-bit bitwise ops, BigInt is the only way
//    in JS/TS — bitwise ops on `number` are always 32-bit.


/* ============================================================
 *  2️⃣ BITWISE OPERATORS
 * ============================================================ */
// 🔹 &   AND
// 🔹 |   OR
// 🔹 ^   XOR
// 🔹 ~   NOT (invert, as 32-bit signed)
// 🔹 <<  left shift  (×2ⁿ, keeps sign as 32-bit)
// 🔹 >>  signed right shift (arithmetic — preserves sign)
// 🔹 >>> unsigned right shift (fills with 0)
// 🔸 All O(1).

const a = 0b1100;                       // 12
const bb = 0b1010;                      // 10

console.log(a & bb);                    // 8     (0b1000)
console.log(a | bb);                    // 14    (0b1110)
console.log(a ^ bb);                    // 6     (0b0110)
console.log(~a);                        // -13   (-(a+1) in 32-bit)
console.log(a << 1);                    // 24    (×2)
console.log(a >> 1);                    // 6     (÷2 signed)
console.log(-8 >>> 1);                  // 2147483644

// 🔸 Example: extracting a byte
const word = 0xDEADBEEF;
console.log((word & 0xFF).toString(16));         // "ef"
console.log(((word >>> 8) & 0xFF).toString(16)); // "be"

// ⚠️ `>>>` on negative numbers produces a LARGE positive number
//    (interprets as unsigned 32-bit). Use it only when you want
//    that.
// ⚠️ `~n` in 32-bit is `-(n+1)`, NOT a fixed-width invert.
console.log(~0);                        // -1
console.log(~5);                        // -6
// 🔸 For 8-bit inverse: (~a) & 0xFF
console.log((~a & 0xFF).toString(2).padStart(8, "0"));   // "11110011"


/* ============================================================
 *  3️⃣ COMMON BIT TRICKS (GET/SET/CLEAR/TOGGLE)
 * ============================================================ */
// 🔹 Get bit i      : (x >>> i) & 1
// 🔹 Set bit i      : x | (1 << i)
// 🔹 Clear bit i    : x & ~(1 << i)
// 🔹 Toggle bit i   : x ^ (1 << i)
// 🔹 Test bit i     : (x & (1 << i)) !== 0
// 🔸 All O(1).

function getBit(x: number, i: number): number {
  return (x >>> i) & 1;
}

function setBit(x: number, i: number): number {
  return x | (1 << i);
}

function clearBit(x: number, i: number): number {
  return x & ~(1 << i);
}

function toggleBit(x: number, i: number): number {
  return x ^ (1 << i);
}

function isBitSet(x: number, i: number): boolean {
  return (x & (1 << i)) !== 0;
}

const x = 0b1010;                       // 10
console.log(getBit(x, 1));              // 1
console.log(setBit(x, 0).toString(2));  // "1011"
console.log(clearBit(x, 1).toString(2));// "1000"
console.log(toggleBit(x, 0).toString(2));// "1011"

// 🔸 Additional helpers:
function clearLowestSetBit(x: number): number {
  return x & (x - 1);
}

function isolateLowestSetBit(x: number): number {
  return x & -x;
}

function clearBitsThroughI(x: number, i: number): number {
  /** Clear bits 0..i (inclusive). */
  return x & ~((1 << (i + 1)) - 1);
}

function clearBitsAboveI(x: number, i: number): number {
  /** Keep bits 0..i, clear above. */
  return x & ((1 << (i + 1)) - 1);
}

function updateBit(x: number, i: number, v: 0 | 1): number {
  return (x & ~(1 << i)) | (v << i);
}

// ⚠️ `1 << i` overflows to negative for i >= 31 — beware.
// ⚠️ `x & -x` works for the 32-bit signed range; for values near
//    the signed boundary, behaviour is defined but tricky.
// 🧠 For >32-bit integers, use BigInt bitwise ops (section 10).


/* ============================================================
 *  4️⃣ POWER OF TWO & PARITY CHECKS
 * ============================================================ */
// 🔹 Power of two: n > 0 and (n & (n - 1)) === 0.
// 🔸 Only one bit set → subtracting 1 flips it and all lower bits.

function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

console.log(isPowerOfTwo(1));           // true
console.log(isPowerOfTwo(4));           // true
console.log(isPowerOfTwo(6));           // false
console.log(isPowerOfTwo(0));           // false
console.log(isPowerOfTwo(-4));          // false

// 🔸 Odd/even: n & 1
function isOdd(n: number): boolean {
  return (n & 1) !== 0;
}

// 🔸 Parity (count of 1s is odd):
function hasOddParity(n: number): boolean {
  return (popcount(n) & 1) !== 0;
}

// 🔸 Turn off the rightmost 1-bit
function turnOffRightmost(n: number): number {
  return n & (n - 1);
}

// 🔸 Turn on the rightmost 0-bit
function turnOnRightmostZero(n: number): number {
  return n | (n + 1);
}

// 🔸 Isolate the rightmost 1-bit AND rightmost 0-bit
function rightmostOneMask(n: number): number {
  return n & -n;
}
function rightmostZeroMask(n: number): number {
  return ~n & (n + 1);
}


/* ============================================================
 *  5️⃣ BRIAN KERNIGHAN'S POPCOUNT
 * ============================================================ */
// 🔹 Count set bits by repeatedly clearing the LOWEST set bit.
// 🔸 O(k) where k = number of set bits.

function popcount(n: number): number {
  let count = 0;
  let x = n >>> 0;                      // treat as unsigned 32-bit
  while (x !== 0) {
    x &= x - 1;                         // clear lowest set bit
    count += 1;
  }
  return count;
}

console.log(popcount(0b1011));          // 3
console.log(popcount(0));               // 0

// 🔸 Alternative: bit-by-bit (slower, but simple)
function popcountNaive(n: number): number {
  let x = n >>> 0;
  let count = 0;
  while (x !== 0) {
    count += x & 1;
    x >>>= 1;
  }
  return count;
}

// 🔸 Modern alternative: BigInt has no popcount — implement
//    via the above loop on BigInt chunks.

// 🔸 Enumerate set bit positions
function setBitPositions(n: number): number[] {
  const positions: number[] = [];
  let x = n >>> 0;
  let i = 0;
  while (x !== 0) {
    if (x & 1) positions.push(i);
    x >>>= 1;
    i += 1;
  }
  return positions;
}

console.log(setBitPositions(0b1011));   // [0, 1, 3]

// 🔸 Fast version: clear lowest bit and note its position
function setBitPositionsFast(n: number): number[] {
  const positions: number[] = [];
  let x = n >>> 0;
  while (x !== 0) {
    const lsb = x & -x;
    positions.push(Math.log2(lsb) | 0);
    x &= x - 1;
  }
  return positions;
}

console.log(setBitPositionsFast(0b1011));   // [0, 1, 3]


/* ============================================================
 *  6️⃣ XOR MAGIC
 * ============================================================ */
// 🔹 XOR properties that make it powerful:
//     a ^ a = 0
//     a ^ 0 = a
//     a ^ b = b ^ a        (commutative)
//     (a ^ b) ^ c = a ^ (b ^ c)   (associative)
// 🔸 Used for finding unique elements, swapping, toggling.

function swapXor(a: number, b: number): [number, number] {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}

console.log(swapXor(3, 5));             // [5, 3]

// 🔸 Swap with destructuring is more idiomatic in JS:
function swapJS(a: number, b: number): [number, number] {
  [a, b] = [b, a];
  return [a, b];
}

// 🔸 XOR is its own inverse (toy encryption):
const plain = 0b1010;
const key = 0b1111;
const cipher = plain ^ key;
const decoded = cipher ^ key;
console.log(decoded.toString(2));       // "1010"


/* ============================================================
 *  7️⃣ SINGLE NUMBER PROBLEMS
 * ============================================================ */
// 🔹 Find the one element that appears ONCE (others twice).
// 🔸 XOR everything — pairs cancel.

function singleNumber(xs: readonly number[]): number {
  let result = 0;
  for (const x of xs) result ^= x;
  return result;
}

console.log(singleNumber([4, 1, 2, 1, 2]));     // 4
console.log(singleNumber([2, 2, 1]));           // 1

// 🔸 Two numbers appear once, all others twice:
//    XOR everything → a ^ b. Split by any set bit.
function singleNumberIII(xs: readonly number[]): [number, number] {
  let xorAll = 0;
  for (const x of xs) xorAll ^= x;
  // Find a bit where a and b differ
  const diff = xorAll & -xorAll;
  let a = 0;
  let b = 0;
  for (const x of xs) {
    if ((x & diff) !== 0) a ^= x;
    else b ^= x;
  }
  return [a, b];
}

console.log(singleNumberIII([1, 2, 1, 3, 2, 5]));  // [3, 5] or [5, 3]

// 🔸 One number appears once, others three times:
//    Count bits modulo 3 across all numbers.
function singleNumberII(xs: readonly number[]): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    let bitSum = 0;
    for (const x of xs) bitSum += (x >>> i) & 1;
    if (bitSum % 3 !== 0) result |= 1 << i;
  }
  // Interpret as signed 32-bit
  return result | 0;
}

console.log(singleNumberII([2, 2, 3, 2]));              // 3
console.log(singleNumberII([0, 1, 0, 1, 0, 1, 99]));    // 99

// 🔸 Missing number in [0..n]
function missingNumber(xs: readonly number[]): number {
  let result = xs.length;
  for (let i = 0; i < xs.length; i++) {
    const v = xs[i];
    if (v !== undefined) result ^= i ^ v;
  }
  return result;
}

console.log(missingNumber([3, 0, 1]));                  // 2
console.log(missingNumber([9,6,4,2,3,5,7,0,1]));        // 8

// 🧠 Pattern: single number / missing number → XOR everything.


/* ============================================================
 *  8️⃣ BITMASK SUBSETS
 * ============================================================ */
// 🔹 Any subset of an n-element set = an n-bit integer.
// 🔸 Bit i is 1 → element i is in the subset.
// 🎯 Iterate all 2^n subsets with a single loop.

function allSubsets(xs: readonly number[]): number[][] {
  const n = xs.length;
  const result: number[][] = [];
  const total = 1 << n;
  for (let mask = 0; mask < total; mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        const v = xs[i];
        if (v !== undefined) subset.push(v);
      }
    }
    result.push(subset);
  }
  return result;
}

console.log(allSubsets([1, 2, 3]));
// [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

// 🔸 Enumerate submasks of a given mask (a powerful DP trick)
function* submasks(mask: number): Generator<number> {
  let sub = mask;
  while (true) {
    yield sub;
    if (sub === 0) break;
    sub = (sub - 1) & mask;
  }
}

console.log([...submasks(0b101)]);      // [5, 4, 1, 0]

// 🧠 Bitmask enumeration is O(2^n) total — fine for n ≤ ~20.

// 🔸 Count subsets whose sum equals target
function countSubsetsSum(xs: readonly number[], target: number): number {
  const n = xs.length;
  const total = 1 << n;
  let count = 0;
  for (let mask = 0; mask < total; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) s += xs[i] ?? 0;
    }
    if (s === target) count += 1;
  }
  return count;
}

console.log(countSubsetsSum([1, 2, 3, 4], 5));      // 2  ({1,4}, {2,3})


/* ============================================================
 *  9️⃣ DP OVER BITMASKS (BITMASK DP)
 * ============================================================ */
// 🔹 State = (mask, other params). Mask encodes visited subset.
// 🔸 Common in TSP, assignment, set cover, Hamiltonian path.
// 🎯 Complexity usually O(2^n × n) — feasible up to n ≈ 20.

// 🔸 Travelling Salesman Problem (TSP) — min tour length
function tsp(dist: readonly (readonly number[])[]): number {
  const n = dist.length;
  if (n <= 1) return 0;
  const INF = Infinity;
  const size = 1 << n;
  // dp[mask][i] = min cost to visit set `mask` ending at node i
  const dp: number[][] = Array.from({ length: size }, () =>
    new Array<number>(n).fill(INF),
  );
  for (let i = 0; i < n; i++) {
    const row = dp[1 << i];
    if (row) row[i] = 0;
  }

  for (let mask = 0; mask < size; mask++) {
    for (let u = 0; u < n; u++) {
      if ((mask & (1 << u)) === 0) continue;
      const row = dp[mask];
      if (!row) continue;
      const cur = row[u];
      if (cur === undefined || cur === INF) continue;
      for (let v = 0; v < n; v++) {
        if ((mask & (1 << v)) !== 0) continue;
        const duv = dist[u]?.[v];
        if (duv === undefined) continue;
        const newMask = mask | (1 << v);
        const newRow = dp[newMask];
        if (!newRow) continue;
        const nc = cur + duv;
        if (nc < (newRow[v] ?? INF)) newRow[v] = nc;
      }
    }
  }

  const full = (1 << n) - 1;
  let best = INF;
  const row = dp[full];
  if (!row) return 0;
  for (let u = 0; u < n; u++) {
    if (u === 0 && n > 1) continue;
    const cost = row[u];
    const back = dist[u]?.[0];
    if (cost !== undefined && cost !== INF && back !== undefined) {
      best = Math.min(best, cost + back);
    }
  }
  return best === INF ? -1 : best;
}

const dist = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
];
console.log(tsp(dist));                 // 80  (0→1→3→2→0)

// 🔸 Count ways to assign tasks (assignment problem, small n)
function countAssignments(cost: readonly (readonly number[])[]): number {
  const n = cost.length;
  const size = 1 << n;
  const dp = new Array<number>(size).fill(0);
  dp[0] = 1;
  for (let mask = 0; mask < size; mask++) {
    let person = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) person += 1;
    if (person >= n) continue;
    for (let task = 0; task < n; task++) {
      if ((mask & (1 << task)) === 0 && (cost[person]?.[task] ?? 0) > 0) {
        dp[mask | (1 << task)] = (dp[mask | (1 << task)] ?? 0) + (dp[mask] ?? 0);
      }
    }
  }
  return dp[size - 1] ?? 0;
}

// 🧠 Bitmask DP "shape":
//    - mask represents a SET (visited, used, available)
//    - transitions add one bit
//    - final answer at full mask (1 << n) - 1

// 🔸 Space optimisation: often only need dp[mask] with the
//    smaller-side masks; or use Map for sparse masks.
// ⚠️ n must be ≤ ~20 (2^20 = 1M states) for JS/TS to be feasible.
//    Larger n needs a different algorithm.


/* ============================================================
 *  🔟 BIGINT BITWISE OPS (FOR > 32-BIT INTEGERS)
 * ============================================================ */
// 🔹 BigInt bitwise ops work on ARBITRARY width.
// 🔸 Use when values exceed 32-bit signed range.
// 🔸 Slower than number bitwise ops — but correct.

const bigA = 0b1010n;
const bigB = 0b1100n;
console.log((bigA & bigB).toString(2));         // "1000"
console.log((bigA | bigB).toString(2));         // "1110"
console.log((bigA ^ bigB).toString(2));         // "110"
console.log((bigA << 10n).toString(2));         // "10100000000000"

// 🔸 BigInt literals end with `n`
const veryBig = (1n << 60n) + 123n;
console.log(veryBig.toString());

// 🔸 Popcount for BigInt (not built-in)
function popcountBig(n: bigint): number {
  let x = n < 0n ? -n : n;
  let count = 0;
  while (x > 0n) {
    x &= x - 1n;                        // clear lowest set bit
    count += 1;
  }
  return count;
}

console.log(popcountBig((1n << 60n) | 1n));      // 2

// 🔸 Bitmask DP with BigInt for n > 20 (very rare)
//    2^n for n=40 needs 40-bit masks — beyond 32-bit int.
//    Use BigInt keys for state.

// ⚠️ Mixing BigInt and number throws TypeError:
// 1n + 1  // ❌ TypeError
// 1n + 1n // ✅
// ⚠️ BigInt doesn't work with Math.* functions.
// ⚠️ `>>>` (unsigned shift) does NOT exist for BigInt.
//    BigInt >> is arithmetic and works for negatives too.

// 🧠 Use number bitwise ops (fast, 32-bit) whenever values fit.
//    Use BigInt (slower, arbitrary precision) only when needed.


/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ JS bitwise ops coerce to 32-bit SIGNED integers.
//    Values >= 2^31 wrap around.
console.log((1 << 31));                 // -2147483648
console.log((1 << 32));                 // 1  (shift wraps modulo 32!)
console.log((1 << 33));                 // 2

// ⚠️ `>>>` differs from `>>` for negative numbers:
console.log(-8 >> 1);                   // -4  (arithmetic shift)
console.log(-8 >>> 1);                  // 2147483644

// ⚠️ `~x` in JS is 32-bit signed invert (NOT arbitrary width).
// ⚠️ `x & -x` works because two's complement on 32-bit.
//    For BigInt, same trick works: `x & -x`.
// ⚠️ `popcount` must handle negative numbers — the naive
//    loop over `x & 1` on a negative number NEVER terminates
//    because arithmetic right shift sign-extends.
//    ALWAYS cast to unsigned with `x >>> 0` first.
function popcountSafe(n: number): number {
  let x = n >>> 0;                      // force unsigned 32-bit
  let count = 0;
  while (x !== 0) {
    x &= x - 1;
    count += 1;
  }
  return count;
}

// ⚠️ Bitmask DP is O(2^n · n) or worse — only feasible for
//    n ≤ ~20 (number) or n ≤ ~25 (BigInt, much slower).
// ⚠️ Loop order in TSP matters — outer mask, inner state.
// ⚠️ Submask enumeration: (sub - 1) & mask, stop when sub === 0.
//    Do NOT miss the special case of mask === 0.
// ⚠️ `1 << 31` becomes negative — use `(1 << 31) >>> 0` or
//    bit 31 carefully.
// ⚠️ Shift by a huge amount: JS shifts are modulo 32.
//    `1 << 100` == `1 << 4` == 16. NOT what you want!
//    For large shifts use multiplication or BigInt.
// ⚠️ XOR swap fails if a === b when using references — but works
//    for plain numbers.
// ⚠️ Bit tricks help only with integers; floats are coerced
//    to 32-bit ints (fractions truncated).
console.log(3.9 | 0);                   // 3  (truncation)
console.log(-3.9 | 0);                  // -3
// ⚠️ `| 0` is a common fast truncation idiom but only works
//    within 32-bit range. For larger, use Math.trunc.
// ⚠️ Clear intent with helper functions (setBit, isBitSet) —
//    inline bit twiddling is error-prone.
// ⚠️ Prefer `x & 1` for odd check over `x % 2` when speed
//    matters — same result for integers.

/* 🕒 Version notes
 * - Bitwise operators: always available
 * - BigInt: ES2020
 * - BigInt bitwise ops (& | ^ ~ << >>): ES2020
 * - BigInt does NOT support >>> (unsigned shift)
 * - Number.MAX_SAFE_INTEGER = 2^53 - 1 (precision limit for
 *   arithmetic, but bitwise is limited to 32-bit)
 * - Typed arrays (Int32Array, Uint32Array): ES2015
 *   - Uint32Array has 32-bit unsigned semantics — often clearer
 *     than Number bitwise ops
 * - Math.clz32 (count leading zeros in 32-bit): ES2015
 * - Math.imul (32-bit multiply): ES2015
 * - No built-in popcount for number or BigInt
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - Array.prototype.at(-1): ES2022
 * - structuredClone: Node 17+ (not needed for numbers, useful
 *   for cloning typed arrays)
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation           │ Expression                │ Effect      |
 * ─────────────────────────────────────────────────────────────
 * | AND                 │ a & b                     │ both 1s     |
 * | OR                  │ a | b                     │ any 1       |
 * | XOR                 │ a ^ b                     │ differ      |
 * | NOT                 │ ~a                        │ -(a+1)      |
 * | Left shift          │ a << n                    │ ×2ⁿ (mod 32)|
 * | Signed right shift  │ a >> n                    │ ÷2ⁿ sign    |
 * | Unsigned right sh.  │ a >>> n                   │ ÷2ⁿ zero    |
 * ─────────────────────────────────────────────────────────────
 * | Task                │ Expression                             |
 * ─────────────────────────────────────────────────────────────
 * | Get bit i           │ (x >>> i) & 1                          |
 * | Set bit i           │ x | (1 << i)                           |
 * | Clear bit i         │ x & ~(1 << i)                          |
 * | Toggle bit i        │ x ^ (1 << i)                           |
 * | Clear lowest set bit│ x & (x - 1)                            |
 * | Isolate lowest set  │ x & -x                                 |
 * | Power of two        │ x > 0 && (x & (x-1)) === 0             |
 * | Popcount            │ Kernighan or naive loop (x >>> 0)      |
 * | Lowest bit position │ Math.log2(x & -x) | 0                  |
 * | Is odd              │ (x & 1) === 1                          |
 * ─────────────────────────────────────────────────────────────
 * | XOR trick             │ Result                                |
 * ─────────────────────────────────────────────────────────────
 * | a ^ a                 │ 0                                     |
 * | a ^ 0                 │ a                                     |
 * | a ^ b ^ a             │ b                                     |
 * | Single number         │ XOR all                               |
 * | Missing number 0..n   │ XOR all indices + values              |
 * ─────────────────────────────────────────────────────────────
 * | Bitmask DP             │ Notes                                |
 * ─────────────────────────────────────────────────────────────
 * | State = (mask, ...)    │ mask encodes visited subset          |
 * | Transitions            │ add one bit at a time                |
 * | Full mask              │ (1 << n) - 1                         |
 * | Feasibility (number)   │ n ≤ 20 (2^20 = 1M states)            |
 * | Feasibility (BigInt)   │ n ≤ ~25 (slow but possible)          |
 * | Common problems        │ TSP, assignment, set cover,          |
 * |                        │ Hamiltonian path, subset sum          |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                  |
 * ─────────────────────────────────────────────────────────────
 * | Values >= 2^31              │ Wraps to negative 32-bit      |
 * | Shift by >= 32              │ Modulo 32 — wrong result      |
 * | `>>>` on negative           │ Large positive number         |
 * | `~x` is 32-bit only         │ -(x+1), not fixed width       |
 * | popcount on negative        │ Infinite loop without >>> 0   |
 * | Bitmask DP for n > 25       │ Time blowup                   |
 * | Wrong mask after XOR swap   │ Works for values, not refs    |
 * | Bit tricks on floats        │ Truncated to 32-bit int       |
 * | Mixing BigInt and number    │ TypeError                     |
 * | `>>>` on BigInt             │ SyntaxError                   |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use helper functions (getBit / setBit) for clarity — bit
 *    twiddling inline is bug-prone.
 *  - Remember JS bitwise ops are 32-bit signed — cast to
 *    unsigned with `>>> 0` when needed.
 *  - Use `x & (x-1)` for "clear lowest set bit" — the workhorse.
 *  - Power of two: `n > 0 && (n & (n-1)) === 0`.
 *  - `x & -x` isolates the lowest set bit.
 *  - XOR is king for "single number" and "missing number".
 *  - Bitmask DP: n ≤ ~20, iterate masks in increasing order.
 *  - Guard popcount on negatives with `x >>> 0`.
 *  - Submask enumeration: `sub = (sub - 1) & mask` until 0.
 *  - Use BigInt only when 32-bit is insufficient.
 *  - Prefer Uint32Array for unsigned 32-bit semantics when the
 *    arithmetic is heavy.
 *  - Test with: 0, 1, all-ones (0xFFFFFFFF), alternating bits,
 *    negative values, and 2^31.
 *  - Never trust shift counts ≥ 32 without checking.
 *  - Combine bit tricks with DP or subsets for exponential
 *    problems with small n.
 * ============================================================ */