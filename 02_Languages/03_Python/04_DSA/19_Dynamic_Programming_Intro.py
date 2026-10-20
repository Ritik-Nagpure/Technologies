# 19_Dynamic_Programming_Intro.py

# ============================================================
#  📘 DYNAMIC PROGRAMMING INTRO IN PYTHON — COMPLETE COVERAGE
#
#  Dynamic Programming (DP) = recursion + memoisation, or
#  equivalently, building a table bottom-up. DP solves problems
#  with OVERLAPPING SUBPROBLEMS and OPTIMAL SUBSTRUCTURE by
#  computing each subproblem ONCE. It converts exponential
#  brute force into polynomial time.
#
#  This file covers: when DP applies, top-down (memo) vs
#  bottom-up (tabulation), classic problems (fib, climbing
#  stairs, knapsack, LIS, edit distance, coin change, LCS),
#  space optimisation, and pattern recognition.
#
#  Sections:
#   1. When DP applies
#   2. Top-down memoisation vs bottom-up tabulation
#   3. Fibonacci — the "hello world" of DP
#   4. Climbing stairs
#   5. 0/1 Knapsack
#   6. Unbounded knapsack / coin change
#   7. Longest Increasing Subsequence (LIS)
#   8. Longest Common Subsequence (LCS)
#   9. Edit distance (Levenshtein)
#  10. Space optimisation (rolling arrays)
#  11. Pattern recognition guide
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHEN DP APPLIES
# ============================================================
# 🔹 Two conditions:
#     1. OVERLAPPING SUBPROBLEMS — same subproblem solved many times.
#     2. OPTIMAL SUBSTRUCTURE   — best answer built from best
#        answers to subproblems.
# 🔸 If both hold → DP turns exponential into polynomial.
# 🎯 Signal words: "count ways", "minimum/maximum cost",
#    "longest/shortest", "can we achieve", "subsequence",
#    "subarray", "partition".

# 🔸 Two flavours:
#     • Optimisation    → min/max some value
#     • Counting        → number of ways
#     • Decision        → True/False reachable

# 🧠 Steps to a DP solution:
#     1. Define the STATE (what parameters describe a subproblem).
#     2. Write the RECURRENCE (how state i depends on smaller).
#     3. Set BASE CASES.
#     4. Decide ORDER (bottom-up) or use memo (top-down).
#     5. Optimise SPACE if possible.


# ============================================================
#  2️⃣ TOP-DOWN MEMOISATION VS BOTTOM-UP TABULATION
# ============================================================
# 🔹 TOP-DOWN (memoised recursion):
#     - Write the natural recurrence.
#     - Cache results by argument tuple.
#     - Only computes what's needed.
#     - Risk: recursion depth.
# 🔹 BOTTOM-UP (tabulation):
#     - Fill a table from smallest subproblem upward.
#     - Iterative, no recursion.
#     - Often optimisable to rolling variables.
#     - Risk: might compute unused states.

from functools import lru_cache

# Top-down
@lru_cache(maxsize=None)
def fib_top(n: int) -> int:
    if n < 2:
        return n
    return fib_top(n - 1) + fib_top(n - 2)

# Bottom-up
def fib_bottom(n: int) -> int:
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b

print(fib_top(30), fib_bottom(30))      # 832040 832040

# 🧠 Start with memoised recursion (easy to reason about), then
#    convert to bottom-up for speed / no recursion limits.


# ============================================================
#  3️⃣ FIBONACCI — THE HELLO WORLD OF DP
# ============================================================
# 🔹 Naive recursion: O(2^n).
# 🔹 Memo / bottom-up: O(n).
# 🔹 Space-optimised: O(1).

# O(2^n) — for reference
def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# O(n) time, O(n) space — bottom-up
def fib_dp(n: int) -> int:
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# O(n) time, O(1) space — rolling variables
def fib_opt(n: int) -> int:
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

print(fib_dp(10), fib_opt(10))          # 55 55

# 🧠 DP mantra: "don't recompute what you've already computed".


# ============================================================
#  4️⃣ CLIMBING STAIRS
# ============================================================
# 🔹 To reach step n, come from n-1 (1 step) or n-2 (2 steps).
# 🔸 dp[n] = dp[n-1] + dp[n-2] — same as Fibonacci.
# 🎯 Classic warm-up.

def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

print(climb_stairs(5))                  # 8
print(climb_stairs(1))                  # 1

# 🔸 Variant: 1, 2, or 3 steps at a time
def climb_stairs_3(n: int) -> int:
    if n <= 2:
        return n
    if n == 3:
        return 4
    a, b, c = 1, 2, 4
    for _ in range(4, n + 1):
        a, b, c = b, c, a + b + c
    return c

print(climb_stairs_3(4))                # 7

# 🧠 Rule: "how many ways to reach n by steps of size X" →
#    dp[n] = Σ dp[n - step_i].


# ============================================================
#  5️⃣ 0/1 KNAPSACK
# ============================================================
# 🔹 Choose items (each at most once) to maximise value with
#    capacity W.
# 🔸 dp[i][w] = best using first i items, capacity w.
# 🎯 The canonical "pick or skip" DP.

def knapsack_01(weights: list[int], values: list[int], W: int) -> int:
    n = len(weights)
    # dp[i][w] = max value using first i items and capacity w
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        wi, vi = weights[i - 1], values[i - 1]
        for w in range(W + 1):
            # Option 1: skip item i
            dp[i][w] = dp[i - 1][w]
            # Option 2: take item i (if it fits)
            if wi <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - wi] + vi)
    return dp[n][W]

print(knapsack_01([1, 3, 4, 5], [1, 4, 5, 7], 7))    # 9

# 🔸 Space-optimised 1D version (reverse iteration!)
def knapsack_01_1d(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for wi, vi in zip(weights, values):
        for w in range(W, wi - 1, -1):      # reverse → use old row
            dp[w] = max(dp[w], dp[w - wi] + vi)
    return dp[W]

print(knapsack_01_1d([1, 3, 4, 5], [1, 4, 5, 7], 7))    # 9

# ⚠️ Reverse order matters! If iterating forward, item i can be
#    used more than once → becomes unbounded knapsack by mistake.
# 🧠 0/1 knapsack = "take or skip each item once".


# ============================================================
#  6️⃣ UNBOUNDED KNAPSACK / COIN CHANGE
# ============================================================
# 🔹 Item can be used MULTIPLE times.
# 🔸 Coin change: min coins to make amount.
# 🎯 Same shape, different recurrence.

def coin_change_min(coins: list[int], amount: int) -> int:
    INF = float("inf")
    dp = [INF] * (amount + 1)
    dp[0] = 0                               # 0 coins to make 0
    for c in coins:
        for a in range(c, amount + 1):      # FORWARD → reuse allowed
            if dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return -1 if dp[amount] == INF else dp[amount]

print(coin_change_min([1, 2, 5], 11))       # 3  (5 + 5 + 1)
print(coin_change_min([2], 3))              # -1

# 🔸 Count number of ways (order doesn't matter)
def coin_change_ways(coins: list[int], amount: int) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1                               # 1 way to make 0
    for c in coins:                         # outer: coin
        for a in range(c, amount + 1):      # inner: amount
            dp[a] += dp[a - c]
    return dp[amount]

print(coin_change_ways([1, 2, 5], 5))       # 4  (5, 2+2+1, 2+1+1+1, 1*5)

# 🔸 Order MATTERS version (permutations of coins count as
#    distinct)
def coin_change_ways_order(coins: list[int], amount: int) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for a in range(1, amount + 1):          # outer: amount
        for c in coins:                     # inner: coin
            if c <= a:
                dp[a] += dp[a - c]
    return dp[amount]

print(coin_change_ways_order([1, 2, 5], 5)) # 9

# 🧠 The loop ORDER decides whether combinations or permutations
#    are counted. Coins OUTER → combinations. Coins INNER →
#    permutations.

# 🔸 Unbounded knapsack (max value)
def knapsack_unbounded(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for w in range(1, W + 1):
        for wi, vi in zip(weights, values):
            if wi <= w:
                dp[w] = max(dp[w], dp[w - wi] + vi)
    return dp[W]

print(knapsack_unbounded([1, 3, 4, 5], [1, 4, 5, 7], 7))  # 9


# ============================================================
#  7️⃣ LONGEST INCREASING SUBSEQUENCE (LIS)
# ============================================================
# 🔹 Longest subsequence strictly increasing.
# 🔸 O(n²) DP version — easy to reason.
# 🔸 O(n log n) patience sort version — classic.

# O(n²) — dp[i] = length of LIS ending at index i
def lis_n2(xs: list[int]) -> int:
    if not xs:
        return 0
    n = len(xs)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if xs[j] < xs[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

print(lis_n2([10, 9, 2, 5, 3, 7, 101, 18]))    # 4  (2,3,7,101)

# O(n log n) — patience sorting with bisect
import bisect

def lis_nlogn(xs: list[int]) -> int:
    tails: list[int] = []                   # smallest tail of LIS of length i+1
    for x in xs:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

print(lis_nlogn([10, 9, 2, 5, 3, 7, 101, 18]))  # 4

# 🔸 Strictly increasing: bisect_left
#    Non-decreasing:    bisect_right
# 🧠 The tails array is NOT the actual LIS — just its length.
#    To reconstruct the sequence, store parent pointers.


# ============================================================
#  8️⃣ LONGEST COMMON SUBSEQUENCE (LCS)
# ============================================================
# 🔹 Longest subsequence common to two strings.
# 🔸 dp[i][j] = LCS of a[:i] and b[:j].
# 🎯 Foundation for diff, edit distance, and DNA alignment.

def lcs(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"))              # 3  ("ace")
print(lcs("abc", "def"))                # 0

# 🔸 Space-optimised (rolling rows)
def lcs_1d(a: str, b: str) -> int:
    m, n = len(a), len(b)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        cur = [0] * (n + 1)
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev = cur
    return prev[n]

print(lcs_1d("abcde", "ace"))           # 3

# 🧠 Recurrence intuition: match → 1 + diagonal; mismatch →
#    max(drop from a, drop from b).


# ============================================================
#  9️⃣ EDIT DISTANCE (LEVENSHTEIN)
# ============================================================
# 🔹 Min insert/delete/substitute ops to turn a into b.
# 🔸 dp[i][j] = edit distance of a[:i] → b[:j].

def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i                    # delete all of a[:i]
    for j in range(n + 1):
        dp[0][j] = j                    # insert all of b[:j]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],           # delete
                    dp[i][j - 1],           # insert
                    dp[i - 1][j - 1],       # substitute
                )
    return dp[m][n]

print(edit_distance("horse", "ros"))    # 3
print(edit_distance("intention", "execution"))  # 5
print(edit_distance("", "abc"))         # 3

# 🔸 Space-optimised
def edit_distance_1d(a: str, b: str) -> int:
    m, n = len(a), len(b)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        cur = [i] + [0] * n
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    return prev[n]

print(edit_distance_1d("horse", "ros")) # 3

# 🧠 Edit distance = LCS + insert/delete; also used in spell
#    check, diff, and DNA alignment.


# ============================================================
#  🔟 SPACE OPTIMISATION (ROLLING ARRAYS)
# ============================================================
# 🔹 Many DPs only need the PREVIOUS row (or two).
# 🔸 Rolling variables reduce O(n²) space to O(n).
# 🎯 Rule: if dp[i][j] depends only on dp[i-1][...], keep one row.

# Example: 0/1 knapsack rolling row
def knapsack_rolling(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for wi, vi in zip(weights, values):
        for w in range(W, wi - 1, -1):      # reverse for 0/1
            dp[w] = max(dp[w], dp[w - wi] + vi)
    return dp[W]

# Example: LCS rolling row
def lcs_rolling(a: str, b: str) -> int:
    m, n = len(a), len(b)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        cur = [0] * (n + 1)
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev = cur
    return prev[n]

# 🧠 Do the 2D version first for clarity, then roll.
# ⚠️ For 0/1 problems, iterate the reduced dimension in REVERSE
#    so each item is used at most once.
# ⚠️ For unbounded problems, iterate FORWARD so items can be
#    reused.


# ============================================================
#  1️⃣1️⃣ PATTERN RECOGNITION GUIDE
# ============================================================
# 🔹 "Count ways to reach n by steps"         → Fibonacci style
# 🔹 "Pick items to maximise value"           → knapsack
# 🔹 "Coin change, min coins"                 → unbounded knapsack
# 🔹 "Count coin combinations"                → coin change ways
# 🔹 "Longest increasing subsequence"         → LIS (n² or n log n)
# 🔹 "Longest common subsequence"             → LCS
# 🔹 "Edit distance / diff"                   → Levenshtein
# 🔹 "Can we partition / subset sum"          → 0/1 knapsack
# 🔹 "Maximum subarray sum"                   → Kadane (file 20)
# 🔹 "Paths in a grid"                        → 2D DP

# ── Complexity reference ─────────────────────────────────────
# | Problem              │ States       │ Time          │ Space  |
# |----------------------|--------------|---------------|--------|
# | Fibonacci            │ n            │ O(n)          │ O(1)*  |
# | Climbing stairs      │ n            │ O(n)          │ O(1)*  |
# | 0/1 Knapsack         │ n × W        │ O(nW)         │ O(W)*  |
# | Unbounded knapsack   │ n × W        │ O(nW)         │ O(W)*  |
# | Coin change (min)    │ n × A        │ O(nA)         │ O(A)   |
# | Coin change (ways)   │ n × A        │ O(nA)         │ O(A)   |
# | LIS (n²)             │ n            │ O(n²)         │ O(n)   |
# | LIS (n log n)        │ n            │ O(n log n)    │ O(n)   |
# | LCS                  │ m × n        │ O(mn)         │ O(min) |
# | Edit distance        │ m × n        │ O(mn)         │ O(min) |
# * after space optimisation
# ─────────────────────────────────────────────────────────────


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Recursion depth for top-down memo — use sys.setrecursionlimit
#    or switch to bottom-up for large n.
# ⚠️ lru_cache args must be HASHABLE — pass tuples, not lists.
# ⚠️ Don't forget BASE CASES. Most bugs are missing dp[0] or
#    dp[i][0].
# ⚠️ 0/1 knapsack: iterate reduced dimension REVERSE.
#    Unbounded: FORWARD.
# ⚠️ Coin change combos vs permutations: coin OUTER → combos;
#    coin INNER → permutations.
# ⚠️ LIS: strictly increasing uses bisect_left; non-decreasing
#    uses bisect_right.
# ⚠️ LCS: compare characters, not indices.
# ⚠️ Edit distance: base row/col = i / j (not 0).
# ⚠️ Beware of integer overflow in other languages — Python
#    integers are unbounded.
# ⚠️ Rolling arrays: when a value depends on the CURRENT row's
#    earlier value (like dp[i][j-1]), you must keep `cur`, not
#    reuse `prev` in place (except with tricks).
# ⚠️ Distinguish "subsequence" (not contiguous) from "subarray"
#    (contiguous). Different DPs.
# ⚠️ For counting problems, beware of MOD (10^9 + 7) overflow
#    requirements in competitive programming.
# ⚠️ Memoisation on mutable args (e.g., a list slice) can be
#    slow. Pass an index instead.
# ⚠️ Some "DP" problems are actually greedy — recognise them
#    before writing DP.
# ⚠️ Test with: empty input, single element, all-equal, target
#    not achievable, and maximum-size inputs.

# 🕒 Version notes
# - functools.lru_cache: Python 3.2+
# - functools.cache (simpler, unbounded): Python 3.9+
# - bisect module for LIS: Python 2.2+
# - PEP 604 unions: Python 3.10+
#   For 3.9 and below, use Optional[T] / List[T]
# - `math.inf` as sentinel: Python 3.5+
# - `math.comb` / `math.perm`: Python 3.8+ (for combinatorics)
# - `sys.setrecursionlimit` — use carefully for deep memo
# - No built-in DP library — write it yourself

# 🔎 Memoisation decorator gotcha: methods get `self` in the key.
#    Use `@lru_cache` on a nested function, or pass only
#    immutable args.


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Problem               │ State            │ Recurrence        |
# ─────────────────────────────────────────────────────────────
# | Fibonacci             │ dp[i]            │ dp[i-1]+dp[i-2]   |
# | Climbing stairs       │ dp[i]            │ dp[i-1]+dp[i-2]   |
# | 0/1 Knapsack          │ dp[i][w]         │ take / skip       |
# | Unbounded knapsack    │ dp[w]            │ forward iterate   |
# | Coin change (min)     │ dp[a]            │ min(dp[a-c]+1)    |
# | Coin change (ways)    │ dp[a]            │ Σ dp[a-c]         |
# | LIS (n²)              │ dp[i]            │ max dp[j]+1       |
# | LIS (n log n)         │ tails            │ bisect_left       |
# | LCS                   │ dp[i][j]         │ match → diag+1    |
# | Edit distance         │ dp[i][j]         │ 1+min(del/ins/sub)|
# ─────────────────────────────────────────────────────────────
# | Approach        │ Pros                        │ Cons        |
# ─────────────────────────────────────────────────────────────
# | Top-down memo   │ natural recurrence, sparse  │ stack depth |
# | Bottom-up       │ iterative, easy to optimise │ full table  |
# | Space-optimised │ minimal memory              │ less clear  |
# ─────────────────────────────────────────────────────────────
# | Pattern signal         │ Likely DP shape              |
# ─────────────────────────────────────────────────────────────
# | Count ways              │ sum of transitions          |
# | Min/max value           │ min/max of transitions      |
# | Pick or skip item       │ knapsack                    |
# | Subsequence             │ 1D or 2D DP                 |
# | Two-string comparison   │ 2D DP (LCS / edit)          |
# | Grid path               │ 2D DP                       |
# | Partition / subset sum  │ 0/1 knapsack on bool        |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                 |
# ─────────────────────────────────────────────────────────────
# | Missing base case           │ Wrong / negative results     |
# | Forward iteration 0/1       │ Becomes unbounded            |
# | Reverse unbounded           │ Becomes 0/1                  |
# | Coins inner vs outer        │ Combos vs permutations       |
# | lru_cache with list arg     │ TypeError unhashable         |
# | Recursion depth             │ RecursionError               |
# | Using prev in place         │ Needs current row's prior    |
# | LIS strict vs non-strict    │ Off-by-one wrong length      |
# | Edit distance base row/col  │ Wrong count on empty str     |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Write the naive recursion FIRST, then memoise, then convert
#    to bottom-up.
#  - State definition is 90% of the problem — be explicit.
#  - Draw the DP table for 2D problems.
#  - 0/1 vs unbounded: reverse vs forward iteration.
#  - Combos vs permutations: coin outer vs inner.
#  - Space-optimise only after the 2D version is correct.
#  - Use lru_cache / cache for top-down memo — free and fast.
#  - Recognise subarray (contiguous) vs subsequence (not).
#  - Check if a greedy solution exists before writing DP.
#  - Test with: empty input, single item, zero-capacity,
#    unreachable targets.
#  - Watch out for MOD in counting problems with huge outputs.
#  - Draw the recursion tree for small n to sanity-check.
# ============================================================