# 21_Bit_Manipulation.py

# ============================================================
#  📘 BIT MANIPULATION IN PYTHON — COMPLETE COVERAGE
#
#  Bit manipulation treats integers as sequences of bits and
#  uses bitwise operators to solve problems in O(1) time per
#  operation. It's the ultimate constant-factor optimisation
#  and the key to many interview problems: subsets via bitmask,
#  XOR tricks, power-of-two checks, and DP over bitmasks.
#
#  This file covers: bitwise operators, common bit tricks, XOR
#  magic, bitmasks for subsets, Brian Kernighan's popcount,
#  power-of-two, single-number problems, and DP over bitmasks.
#
#  Sections:
#   1. Binary representation in Python
#   2. Bitwise operators
#   3. Common bit tricks (get/set/clear/toggle)
#   4. Power of two & parity checks
#   5. Brian Kernighan's popcount
#   6. XOR magic
#   7. Single number problems
#   8. Bitmask subsets
#   9. DP over bitmasks (bitmask DP)
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ BINARY REPRESENTATION IN PYTHON
# ============================================================
# 🔹 Python ints are arbitrary precision (no fixed width).
# 🔸 Unlike C/Java, no overflow, no 32/64-bit limit.
# 🔸 Negative numbers behave like infinite two's complement.

print(bin(42))              # '0b101010'
print(bin(0))               # '0b0'
print(bin(-1))              # '-0b1'  ← no two's-complement zeros!
print(bin(255))             # '0b11111111'

# 🔸 To view as unsigned with fixed width:
def to_bin(n: int, bits: int = 8) -> str:
    return format(n & ((1 << bits) - 1), f"0{bits}b")

print(to_bin(42))           # '00101010'
print(to_bin(-1, 8))        # '11111111'  (two's complement)

# 🔸 Bit length and count
n = 42
print(n.bit_length())       # 6  (bits needed, excluding sign)
print(n.bit_count())        # 3  (popcount — number of 1s)

# 🕒 int.bit_count: Python 3.10+
# 🕒 int.bit_length: Python 2.7+ / 3.1+


# ============================================================
#  2️⃣ BITWISE OPERATORS
# ============================================================
# 🔹 &   AND
# 🔹 |   OR
# 🔹 ^   XOR
# 🔹 ~   NOT (invert)
# 🔹 <<  left shift  (×2ⁿ)
# 🔹 >>  right shift (÷2ⁿ, floor)
# 🔸 All are O(1) for fixed-size ints (Python's are O(width)).

a = 0b1100      # 12
b = 0b1010      # 10

print(a & b)    # 0b1000 = 8
print(a | b)    # 0b1110 = 14
print(a ^ b)    # 0b0110 = 6
print(~a)       # -13  (bitwise NOT: -(a + 1))
print(a << 1)   # 24   (×2)
print(a >> 1)   # 6    (÷2)
print(a << 3)   # 96   (×8)

# ⚠️ ~ in Python is -(a+1), not a fixed-width invert.
print(~0)       # -1
print(~5)       # -6

# 🔸 For 8-bit inverse: (~a) & 0xFF
print(~a & 0xFF)    # 0b11110011 = 243


# ============================================================
#  3️⃣ COMMON BIT TRICKS (GET/SET/CLEAR/TOGGLE)
# ============================================================
# 🔹 Get bit i      : (x >> i) & 1
# 🔹 Set bit i      : x | (1 << i)
# 🔹 Clear bit i    : x & ~(1 << i)
# 🔹 Toggle bit i   : x ^ (1 << i)
# 🔹 Test bit i     : (x >> i) & 1  (or x & (1 << i))
# 🔸 All O(1).

def get_bit(x: int, i: int) -> int:
    return (x >> i) & 1

def set_bit(x: int, i: int) -> int:
    return x | (1 << i)

def clear_bit(x: int, i: int) -> int:
    return x & ~(1 << i)

def toggle_bit(x: int, i: int) -> int:
    return x ^ (1 << i)

def is_bit_set(x: int, i: int) -> bool:
    return bool(x & (1 << i))

x = 0b1010      # 10
print(get_bit(x, 1))            # 1
print(bin(set_bit(x, 0)))       # 0b1011
print(bin(clear_bit(x, 1)))     # 0b1000
print(bin(toggle_bit(x, 0)))    # 0b1011

# 🔸 Additional helpers:
def clear_lowest_set_bit(x: int) -> int:
    return x & (x - 1)

def isolate_lowest_set_bit(x: int) -> int:
    return x & -x

def clear_bits_through_i(x: int, i: int) -> int:
    """Clear bits 0..i (inclusive)."""
    return x & ~((1 << (i + 1)) - 1)

def clear_bits_above_i(x: int, i: int) -> int:
    """Clear bits above i (keep 0..i)."""
    return x & ((1 << (i + 1)) - 1)

def update_bit(x: int, i: int, v: int) -> int:
    return (x & ~(1 << i)) | (v << i)


# ============================================================
#  4️⃣ POWER OF TWO & PARITY CHECKS
# ============================================================
# 🔹 Power of two: n > 0 and (n & (n-1)) == 0.
# 🔸 Only one bit set → subtracting 1 flips it and all lower bits.

def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0

print(is_power_of_two(1))       # True
print(is_power_of_two(4))       # True
print(is_power_of_two(6))       # False
print(is_power_of_two(0))       # False
print(is_power_of_two(-4))      # False

# 🔸 Odd/even: n & 1
def is_odd(n: int) -> bool:
    return bool(n & 1)

# 🔸 Parity (count of 1s is odd):
def has_odd_parity(n: int) -> bool:
    return bool(n.bit_count() & 1)


# ============================================================
#  5️⃣ BRIAN KERNIGHAN'S POPCOUNT
# ============================================================
# 🔹 Count set bits by repeatedly clearing the LOWEST set bit.
# 🔸 O(k) where k = number of set bits.

def popcount(n: int) -> int:
    count = 0
    while n:
        n &= n - 1          # clear lowest set bit
        count += 1
    return count

print(popcount(0b1011))         # 3
print(popcount(0))              # 0

# ✅ Modern alternative (Python 3.10+):
print((0b1011).bit_count())     # 3

# ⚠️ For negative numbers, bit_count() returns the count of the
#    infinite two's-complement representation — nonsense for
#    most use cases. Guard with n & mask.

# 🔸 Related: enumerate set bit positions
def set_bit_positions(n: int) -> list[int]:
    positions: list[int] = []
    i = 0
    while n:
        if n & 1:
            positions.append(i)
        n >>= 1
        i += 1
    return positions

print(set_bit_positions(0b1011))    # [0, 1, 3]

# 🔸 Same via lowest-bit trick (faster for sparse numbers)
def set_bit_positions_fast(n: int) -> list[int]:
    positions: list[int] = []
    while n:
        lsb = n & -n
        positions.append(lsb.bit_length() - 1)
        n &= n - 1
    return positions

print(set_bit_positions_fast(0b1011))   # [0, 1, 3]


# ============================================================
#  6️⃣ XOR MAGIC
# ============================================================
# 🔹 XOR properties that make it powerful:
#     a ^ a = 0
#     a ^ 0 = a
#     a ^ b = b ^ a        (commutative)
#     (a ^ b) ^ c = a ^ (b ^ c)   (associative)
# 🔸 Used for finding unique elements, swapping, toggling.

def swap_xor(a: int, b: int) -> tuple[int, int]:
    a ^= b
    b ^= a
    a ^= b
    return a, b

print(swap_xor(3, 5))           # (5, 3)

# 🔸 Swap with tuple is more Pythonic — use that in real code:
def swap_pythonic(a: int, b: int) -> tuple[int, int]:
    a, b = b, a
    return a, b

# 🔸 XOR is its own inverse:
x = 0b1010
key = 0b1111
encrypted = x ^ key
decrypted = encrypted ^ key
print(bin(decrypted))           # 0b1010


# ============================================================
#  7️⃣ SINGLE NUMBER PROBLEMS
# ============================================================
# 🔹 Find the one element that appears ONCE (others twice).
# 🔸 XOR everything — pairs cancel.

def single_number(xs: list[int]) -> int:
    result = 0
    for x in xs:
        result ^= x
    return result

print(single_number([4, 1, 2, 1, 2]))       # 4
print(single_number([2, 2, 1]))             # 1

# 🔸 Two numbers appear once, all others twice:
#    XOR everything → a ^ b. Split by any set bit.
def single_number_iii(xs: list[int]) -> tuple[int, int]:
    xor_all = 0
    for x in xs:
        xor_all ^= x
    # Find a bit where a and b differ
    diff = xor_all & -xor_all
    a = b = 0
    for x in xs:
        if x & diff:
            a ^= x
        else:
            b ^= x
    return a, b

print(single_number_iii([1, 2, 1, 3, 2, 5]))    # (3, 5) or (5, 3)

# 🔸 One number appears once, others three times:
#    Count bits modulo 3 across all numbers.
def single_number_ii(xs: list[int]) -> int:
    result = 0
    for i in range(32):
        bit_sum = sum((x >> i) & 1 for x in xs)
        if bit_sum % 3:
            result |= (1 << i)
    return result

print(single_number_ii([2, 2, 3, 2]))       # 3
print(single_number_ii([0, 1, 0, 1, 0, 1, 99]))  # 99

# 🔸 Missing number in [0..n]
def missing_number(xs: list[int]) -> int:
    n = len(xs)
    result = n
    for i, x in enumerate(xs):
        result ^= i ^ x
    return result

print(missing_number([3, 0, 1]))            # 2
print(missing_number([9,6,4,2,3,5,7,0,1]))  # 8

# 🧠 Pattern: single number / missing number → XOR everything.


# ============================================================
#  8️⃣ BITMASK SUBSETS
# ============================================================
# 🔹 Any subset of an n-element set = an n-bit integer.
# 🔸 Bit i is 1 → element i is in the subset.
# 🎯 Iterate all 2^n subsets with a single loop.

def all_subsets(xs: list[int]) -> list[list[int]]:
    n = len(xs)
    result: list[list[int]] = []
    for mask in range(1 << n):              # 0 .. 2^n - 1
        subset = [xs[i] for i in range(n) if mask & (1 << i)]
        result.append(subset)
    return result

print(all_subsets([1, 2, 3]))
# [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

# 🔸 Enumerate submasks of a given mask (a powerful DP trick)
def submasks(mask: int):
    sub = mask
    while True:
        yield sub
        if sub == 0:
            break
        sub = (sub - 1) & mask

print(list(submasks(0b101)))
# [5, 4, 1, 0]

# 🧠 Bitmask enumeration is O(2^n) total — fine for n ≤ ~20.

# 🔸 Classic: count subsets whose sum equals target
def count_subsets_sum(xs: list[int], target: int) -> int:
    n = len(xs)
    count = 0
    for mask in range(1 << n):
        s = 0
        for i in range(n):
            if mask & (1 << i):
                s += xs[i]
        if s == target:
            count += 1
    return count

print(count_subsets_sum([1, 2, 3, 4], 5))   # 2  ({1,4}, {2,3})


# ============================================================
#  9️⃣ DP OVER BITMASKS (BITMASK DP)
# ============================================================
# 🔹 State = (mask, other params). Mask encodes visited subset.
# 🔸 Common in TSP, assignment, set cover, Hamiltonian path.
# 🎯 Complexity usually O(2^n × n) — feasible up to n ≈ 20.

# 🔸 Travelling Salesman Problem (TSP) — min tour length
def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    if n <= 1:
        return 0
    INF = float("inf")
    # dp[mask][i] = min cost to visit set `mask` ending at node i
    dp = [[INF] * n for _ in range(1 << n)]
    for i in range(n):
        dp[1 << i][i] = 0                   # start at any node, cost 0

    for mask in range(1 << n):
        for u in range(n):
            if not (mask & (1 << u)):
                continue
            if dp[mask][u] == INF:
                continue
            for v in range(n):
                if mask & (1 << v):
                    continue
                new_mask = mask | (1 << v)
                new_cost = dp[mask][u] + dist[u][v]
                if new_cost < dp[new_mask][v]:
                    dp[new_mask][v] = new_cost

    full = (1 << n) - 1
    return min(dp[full][u] + dist[u][0] for u in range(n) if u != 0 or n == 1)

dist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
]
print(tsp(dist))            # 80  (0→1→3→2→0: 10+25+30+15)

# 🔸 Count ways to assign tasks (assignment problem, small n)
def count_assignments(cost: list[list[int]]) -> int:
    n = len(cost)
    # dp[mask] = number of ways to assign first popcount(mask) tasks
    #            to workers indicated by mask with valid cost
    dp = [0] * (1 << n)
    dp[0] = 1
    for mask in range(1 << n):
        person = mask.bit_count()           # next task to assign
        if person >= n:
            continue
        for task in range(n):
            if not (mask & (1 << task)) and cost[person][task] > 0:
                dp[mask | (1 << task)] += dp[mask]
    return dp[(1 << n) - 1]

# 🧠 Bitmask DP "shape":
#    - mask represents a SET (visited, used, available)
#    - transitions add one bit
#    - final answer at full mask (1 << n) - 1

# 🔸 Space optimisation: often only need dp[mask] with the
#    smaller-side masks; or use dict for sparse masks.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Python has no fixed-width ints — masks, shifts, and ~ all
#    behave differently than in C/Java.
# ⚠️ Right shift on negative ints is arithmetic (floor):
print(-3 >> 1)              # -2
# ⚠️ ~x is -(x+1), not a fixed-width invert.
# ⚠️ bin() shows '0b' prefix; use format(x, 'b') for a bare
#    binary string.
# ⚠️ x.bit_length() for 0 is 0; for 1 is 1.
# ⚠️ x.bit_count() on negative numbers is the count of 1s in
#    the infinite two's-complement representation — usually NOT
#    what you want.
# ⚠️ Bitmask DP is O(2^n · n) or worse — only feasible for
#    n ≤ ~20.
# ⚠️ Loop order in TSP matters — outer mask, inner state.
# ⚠️ Submask enumeration: (sub - 1) & mask, stop when sub == 0.
#    Do NOT miss the special case of mask == 0.
# ⚠️ `x & -x` works because of two's-complement semantics in
#    Python for finite-width ints; for very large ints, still
#    works because Python implements arbitrary two's complement.
# ⚠️ Shift by a huge amount creates a huge int — memory hit.
#    Cap shifts when possible.
# ⚠️ XOR swap fails if a == b when using references — but works
#    for plain ints.
# ⚠️ Bit tricks help only with integers; floats and strings are
#    different games.
# ⚠️ Clear intent with helper functions (set_bit, is_bit_set) —
#    inline bit twiddling is error-prone.

# 🕒 Version notes
# - int.bit_length(): Python 2.7+ / 3.1+
# - int.bit_count(): Python 3.10+ (also called popcount)
# - int.to_bytes / int.from_bytes: Python 3.2+
# - Arbitrary-precision ints: from the start
# - `math.log2(x).is_integer()` (power-of-two alt): Python 3.5+
# - `math.comb`, `math.perm`: Python 3.8+ (for combinatorics)
# - `int.bit_count` replaces `bin(x).count('1')` for speed
# - Python 3.11+ faster for large int arithmetic

# 🔸 Bonus: enumerate set bits of a mask (already covered)
def bits_of(mask: int):
    while mask:
        bit = mask & -mask
        yield bit.bit_length() - 1
        mask &= mask - 1

print(list(bits_of(0b1011010)))     # [1, 3, 4, 6]


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation           │ Expression                │ Effect      |
# ─────────────────────────────────────────────────────────────
# | AND                 │ a & b                     │ both 1s     |
# | OR                  │ a | b                     │ any 1       |
# | XOR                 │ a ^ b                     │ differ      |
# | NOT                 │ ~a                        │ -(a+1)      |
# | Left shift          │ a << n                    │ ×2ⁿ         |
# | Right shift         │ a >> n                    │ ÷2ⁿ floor   |
# ─────────────────────────────────────────────────────────────
# | Task                │ Expression                             |
# ─────────────────────────────────────────────────────────────
# | Get bit i           │ (x >> i) & 1                           |
# | Set bit i           │ x | (1 << i)                           |
# | Clear bit i         │ x & ~(1 << i)                          |
# | Toggle bit i        │ x ^ (1 << i)                           |
# | Clear lowest set bit│ x & (x - 1)                            |
# | Isolate lowest set  │ x & -x                                 |
# | Power of two        │ x > 0 and x & (x-1) == 0               |
# | Popcount            │ x.bit_count()  (3.10+) or Kernighan    |
# | Lowest bit position │ (x & -x).bit_length() - 1              |
# | Is odd              │ x & 1                                  |
# ─────────────────────────────────────────────────────────────
# | XOR trick             │ Result                                |
# ─────────────────────────────────────────────────────────────
# | a ^ a                 │ 0                                     |
# | a ^ 0                 │ a                                     |
# | a ^ b ^ a             │ b                                     |
# | Single number         │ XOR all                               |
# | Missing number 0..n   │ XOR all indices + values              |
# ─────────────────────────────────────────────────────────────
# | Bitmask DP             │ Notes                                |
# ─────────────────────────────────────────────────────────────
# | State = (mask, ...)    │ mask encodes visited subset          |
# | Transitions            │ add one bit at a time                |
# | Full mask              │ (1 << n) - 1                         |
# | Feasibility            │ n ≤ ~20 (2^20 = 1M states)           |
# | Common problems        │ TSP, assignment, set cover,          |
# |                        │ Hamiltonian path, subset sum          |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                  |
# ─────────────────────────────────────────────────────────────
# | ~x expected as fixed width  │ Python gives -(x+1)           |
# | Right shift on negative     │ Arithmetic (floor)            |
# | bit_count on negative       │ Infinite-two's-complement     |
# | Shift by huge amount        │ Memory blowup                 |
# | Bitmask DP for n > 25       │ Time blowup                   |
# | Wrong mask after XOR swap   │ Works for values, not refs    |
# | Bit tricks on floats        │ TypeError                     |
# | Forgetting popcount fallback│ Pre-3.10 needs manual         |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use helper functions (get_bit / set_bit) for clarity — bit
#    twiddling inline is bug-prone.
#  - Remember ~ and >> semantics differ from C/Java in Python.
#  - Use `x & (x-1)` for "clear lowest set bit" — the workhorse.
#  - Power of two: `n > 0 and n & (n-1) == 0`.
#  - `x & -x` isolates the lowest set bit — great for
#    enumerating positions.
#  - XOR is king for "single number" and "missing number".
#  - Bitmask DP: n ≤ ~20, iterate masks in increasing order.
#  - Use `mask.bit_count()` (3.10+) instead of `bin(mask).count('1')`.
#  - Guard bit_count() on negatives with an explicit mask.
#  - Submask enumeration: `sub = (sub-1) & mask` until 0.
#  - Combine bit tricks with DP or subsets for exponential
#    problems with small n.
#  - Test with: 0, 1, all-ones, alternating bits, and negatives.
# ============================================================