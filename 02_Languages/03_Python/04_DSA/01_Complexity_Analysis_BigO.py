# 01_Complexity_Analysis_BigO.py

# ============================================================
#  📘 COMPLEXITY ANALYSIS & BIG-O IN PYTHON
#
#  Complexity analysis describes HOW an algorithm's resource
#  usage (time, memory) grows as input size grows. Big-O is the
#  asymptotic upper bound, ignoring constants. Every DSA
#  interview, every performance decision, and every algorithm
#  comparison rests on this foundation.
#
#  This file covers: Big-O / Θ / Ω definitions, common growth
#  classes, how to analyse loops and recursion, amortised
#  analysis, space complexity, Python-specific costs (list vs
#  dict vs set operations), and measurement tools.
#
#  Sections:
#   1. Why complexity matters
#   2. Big-O, Big-Ω, Big-Θ — definitions
#   3. The common growth classes
#   4. Analysing loops
#   5. Analysing recursion (Master Theorem intuition)
#   6. Amortised analysis
#   7. Space complexity
#   8. Python-specific costs (list/dict/set)
#   9. Measuring in practice (timeit, cProfile)
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHY COMPLEXITY MATTERS
# ============================================================
# 🔹 Two algorithms that both "work" can differ by 1000x on
#    large inputs.
# 🔹 Big-O lets us reason about that difference WITHOUT running.
# 🎯 Interviewers use it to check you can predict cost.
# 🔸 Python's high-level primitives hide cost — you must know
#    what's O(1) vs O(n) under the hood.

# ⚠️ Rule: don't optimise by guessing — measure, then reason.
#    But before measuring, know the asymptotic shape.


# ============================================================
#  2️⃣ BIG-O, BIG-Ω, BIG-Θ — DEFINITIONS
# ============================================================
# 🔹 Big-O   : upper bound — "grows NO FASTER than"
# 🔹 Big-Ω   : lower bound — "grows AT LEAST as fast as"
# 🔹 Big-Θ   : tight bound — "grows EXACTLY like" (O and Ω match)
# 🔸 In practice we usually say "O" but mean "Θ".

# Example: f(n) = 3n² + 5n + 7
#   → O(n²)   (upper)
#   → Ω(n²)   (lower)
#   → Θ(n²)   (tight)

# 🧠 Drop constants and lower-order terms:
#    3n² + 5n + 7  ≈  n²

# ⚠️ Big-O does NOT tell you which is faster for SMALL n —
#    constants dominate there. It only describes GROWTH.


# ============================================================
#  3️⃣ THE COMMON GROWTH CLASSES
# ============================================================
# 🔹 Ordered from fastest to slowest:
#    O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2^n) < O(n!)

# 🔸 O(1)        — constant
def get_first(xs: list[int]) -> int:
    return xs[0]

# 🔸 O(log n)    — halving each step
def binary_search_demo(xs: list[int], target: int) -> int:
    lo, hi = 0, len(xs) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if xs[mid] == target:
            return mid
        if xs[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# 🔸 O(n)        — single pass
def sum_all(xs: list[int]) -> int:
    total = 0
    for x in xs:
        total += x
    return total

# 🔸 O(n log n)  — sort
def sorted_copy(xs: list[int]) -> list[int]:
    return sorted(xs)                   # Timsort: O(n log n)

# 🔸 O(n²)       — nested loops over same n
def all_pairs(xs: list[int]) -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    for i in range(len(xs)):
        for j in range(len(xs)):
            out.append((xs[i], xs[j]))
    return out

# 🔸 O(2^n)      — branching recursion (naive Fibonacci)
def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# 🔸 O(n!)       — permutations
from itertools import permutations
def all_perms(xs: list[int]) -> list[tuple[int, ...]]:
    return list(permutations(xs))

# 🧠 Practical limit: on a modern machine, ~10^8 simple ops/sec
#    in Python (more like 10^7 for interpreted loops).
#    n=20 → 2^n ≈ 1M   (ok)
#    n=50 → 2^n ≈ 10^15 (way too slow)


# ============================================================
#  4️⃣ ANALYSING LOOPS
# ============================================================
# 🔹 Sequential loops → ADD complexities.
# 🔸 Nested loops → MULTIPLY complexities.
# 🔸 Loop that halves → log n.
# 🔸 Loop with arithmetic step → n/step.

# Sequential: O(n) + O(n) = O(n)
def two_passes(xs: list[int]) -> int:
    total = 0
    for x in xs:                        # O(n)
        total += x
    for x in xs:                        # O(n)
        total -= x
    return total

# Nested: O(n) * O(n) = O(n²)
def matrix_sum(m: list[list[int]]) -> int:
    total = 0
    for row in m:                       # n rows
        for v in row:                   # n cols each
            total += v
    return total                        # O(n²) total

# Halving loop: O(log n)
def count_halvings(n: int) -> int:
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps

# Loop with i *= 2 also → O(log n)
def count_doublings(n: int) -> int:
    i, steps = 1, 0
    while i < n:
        i *= 2
        steps += 1
    return steps

# Triangular loop: O(n²)
def triangular(n: int) -> int:
    count = 0
    for i in range(n):
        for j in range(i, n):           # n + (n-1) + ... = n(n+1)/2
            count += 1
    return count

# ⚠️ Two DIFFERENT inputs → use both:
#    for a in A: for b in B: → O(len(A) * len(B))
#    Do NOT simplify to O(n²) unless A and B are the same size.
def cross(A: list[int], B: list[int]) -> int:
    count = 0
    for _ in A:
        for _ in B:
            count += 1
    return count                        # O(|A| * |B|)

# 🧠 Cheat: count the DEEPEST nesting whose size depends on n,
#    add up the exponent at that level.


# ============================================================
#  5️⃣ ANALYSING RECURSION (MASTER THEOREM INTUITION)
# ============================================================
# 🔹 For recursion T(n) = a * T(n/b) + f(n):
#    - a = number of subproblems
#    - n/b = size of each subproblem
#    - f(n) = work done at each level
# 🔸 Master Theorem gives you T(n) directly for common cases.

# Example: binary search
#   T(n) = T(n/2) + O(1)  → O(log n)
def bsearch(xs: list[int], lo: int, hi: int, t: int) -> int:
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if xs[mid] == t: return mid
    if xs[mid] < t:  return bsearch(xs, mid + 1, hi, t)
    return bsearch(xs, lo, mid - 1, t)

# Example: merge sort
#   T(n) = 2 T(n/2) + O(n) → O(n log n)
def merge_sort(xs: list[int]) -> list[int]:
    if len(xs) <= 1:
        return xs
    mid = len(xs) // 2
    left = merge_sort(xs[:mid])
    right = merge_sort(xs[mid:])
    return _merge(left, right)

def _merge(a: list[int], b: list[int]) -> list[int]:
    out: list[int] = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:]); out.extend(b[j:])
    return out

# Example: naive Fibonacci
#   T(n) = T(n-1) + T(n-2) + O(1) → O(2^n) (actually ~1.6^n)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# ⚠️ Recursion tree gives you the intuition when the Master
#    Theorem doesn't directly apply.
# 🧠 Rule: if a subproblem shrinks by HALF → log factor appears.
#    If it shrinks by ONE → linear chain.


# ============================================================
#  6️⃣ AMORTISED ANALYSIS
# ============================================================
# 🔹 Average cost per operation over a SEQUENCE of operations.
# 🔸 A single op may be expensive, but rare.
# 🎯 Python's list.append is the classic example.

# list.append is O(1) AMORTISED:
#   - Most appends: O(1)
#   - Occasionally, resize copies N items: O(n)
#   - Resize happens after every doubling → total work O(n)
#   - Over n appends → O(n)/n = O(1) average

xs: list[int] = []
for i in range(1_000_000):
    xs.append(i)                        # feels O(1) despite occasional copies

# ⚠️ list.insert(0, x) is O(n) EVERY time — not amortised.
#    Prefer deque for prepend-heavy workloads.
from collections import deque

dq: deque[int] = deque()
for i in range(100_000):
    dq.appendleft(i)                    # O(1) each

# 🧠 Common amortised O(1) ops:
#    - list.append, list.pop() (from end)
#    - dict/set insert/lookup (amortised, with hashing caveats)
#    - dynamic array resizing
#
# 🧠 Common NOT amortised:
#    - list.insert(0, x) → O(n)
#    - list.pop(0) → O(n)
#    - deleting from dict while iterating


# ============================================================
#  7️⃣ SPACE COMPLEXITY
# ============================================================
# 🔹 Space complexity counts EXTRA memory used beyond input.
# 🔸 Recursion uses stack frames → O(depth) space.
# 🔸 In-place algorithms: O(1) extra.
# 🔸 Out-of-place algorithms: O(n) or more.

# O(1) space — in-place reverse
def reverse_in_place(xs: list[int]) -> None:
    i, j = 0, len(xs) - 1
    while i < j:
        xs[i], xs[j] = xs[j], xs[i]
        i += 1; j -= 1

# O(n) space — build a new list
def reversed_copy(xs: list[int]) -> list[int]:
    return xs[::-1]

# O(depth) stack space for recursion
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)         # depth = n → O(n) space

# 🧠 Rule: time and space trade off. Hashing trades space for
#    O(1) lookups. Memoisation trades space for time.


# ============================================================
#  8️⃣ PYTHON-SPECIFIC COSTS (LIST / DICT / SET)
# ============================================================
# 🔹 Know the average cost of built-ins — they are NOT all O(1).

# ── LIST ─────────────────────────────────────────────────────
# | Operation              | Average      | Notes                |
# |------------------------|--------------|----------------------|
# | xs[i]                  | O(1)         | index                |
# | xs.append(x)           | O(1) amort.  | end                  |
# | xs.pop()               | O(1)         | from end             |
# | xs.insert(0, x)        | O(n)         | shifts everything    |
# | xs.pop(0)              | O(n)         | shifts               |
# | x in xs                | O(n)         | linear scan          |
# | xs.sort()              | O(n log n)   | Timsort              |
# | len(xs)                | O(1)         | cached               |
# | xs[a:b]                | O(b-a)       | copies               |

# ── DICT / SET ───────────────────────────────────────────────
# | Operation              | Average      | Worst case           |
# |------------------------|--------------|----------------------|
# | d[k] lookup            | O(1)         | O(n) (hash clash)    |
# | d[k] = v               | O(1)         | O(n)                 |
# | k in d                 | O(1)         | O(n)                 |
# | del d[k]               | O(1)         | O(n)                 |
# | iteration              | O(n)         | —                    |

# 🔸 Worst-case O(n) for dict/set requires crafted hash collisions.
#    Real-world: effectively O(1).

# ── STRING ───────────────────────────────────────────────────
# | Operation              | Cost                                |
# |------------------------|-------------------------------------|
# | s + t                  | O(len(s) + len(t)) — copies!        |
# | s[i]                   | O(1)                                |
# | s[a:b]                 | O(b-a)                              |
# | "".join(iterable)      | O(total length) — preferred         |
# | s.replace(x, y)        | O(n)                                |

# ⚠️ Building a string with `+=` in a loop is O(n²).
#    Use a list + "".join(...) instead.

def bad_concat(words: list[str]) -> str:
    out = ""
    for w in words:                     # O(n²) total
        out += w
    return out

def good_concat(words: list[str]) -> str:
    return "".join(words)               # O(n)


# ============================================================
#  9️⃣ MEASURING IN PRACTICE
# ============================================================
# 🔹 timeit   — micro-benchmarks
# 🔹 cProfile — function-level profiling
# 🔹 Empirical curve vs theoretical curve → sanity check

import timeit

# Micro-benchmark: list.append vs insert(0)
append_time = timeit.timeit(
    "xs.append(1)",
    setup="xs = []",
    number=100_000,
)
insert_time = timeit.timeit(
    "xs.insert(0, 1)",
    setup="xs = []",
    number=100_000,
)
print(f"append: {append_time:.4f}s")    # ~0.005s
print(f"insert: {insert_time:.4f}s")    # ~1.5s  (much slower)

# ✅ Empirical check: double n, does time double (linear), quadruple
#    (quadratic), or grow slightly (log)?
def time_something(fn, n: int) -> float:
    start = timeit.default_timer()
    fn(list(range(n)))
    return timeit.default_timer() - start

# 🔎 Practical rule:
#    - O(n²) becomes painful at n ≥ 5_000 in Python.
#    - O(n log n) is fine up to ~10^7.
#    - O(2^n) is fine only up to ~25.
#    - O(n!) is fine only up to ~10.

# 🧠 Use cProfile to find hot spots BEFORE micro-optimising:
#    python -m cProfile -s cumtime script.py


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Nested loops do NOT always mean O(n²) — depends on bounds.
# ⚠️ Big-O hides constants — O(n) with constant 1000 loses to
#    O(n log n) for small n.
# ⚠️ Two different inputs (A, B) require O(|A|*|B|), not O(n²).
# ⚠️ `x in list` is O(n); `x in set` is O(1) — pick wisely.
# ⚠️ String concatenation in loops is O(n²) — always join.
# ⚠️ `list.insert(0, x)` and `list.pop(0)` are O(n) — use deque.
# ⚠️ Recursion depth in Python is limited (~1000 by default):
#    sys.setrecursionlimit() is a band-aid, not a fix.
# ⚠️ dict/set worst case is O(n) — rare but real with hostile
#    hash functions.
# ⚠️ Amortised O(1) ≠ worst-case O(1): a single append may
#    cost O(n) during resize.
# ⚠️ Sorting is O(n log n) TIME but typically O(n) or O(log n)
#    extra SPACE (Timsort uses O(n) worst case).

import sys
print(sys.getrecursionlimit())          # Output: 1000 (usually)

# 🕒 Version notes
# - list.sort() stable Timsort: Python 2.3+
# - dict insertion order guaranteed: Python 3.7+
# - dict comprehensions: Python 2.7+ / 3.0+
# - set literals {1, 2, 3}: Python 2.7+ / 3.0+
# - `math.comb`, `math.perm`, `math.isqrt`: Python 3.8+
# - `functools.lru_cache` (memoisation): Python 3.2+
# - `functools.cache` (simpler, unbounded): Python 3.9+
# - `int.bit_count()` (popcount): Python 3.10+
# - `math.sumprod` (faster dot product): Python 3.12+
# - `itertools.batched`: Python 3.12+
# - `sys.setrecursionlimit` — keep modest; large values crash.


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Class         │ Name           │ Example                     |
# ─────────────────────────────────────────────────────────────
# | O(1)          │ Constant       │ xs[0], dict lookup          |
# | O(log n)      │ Logarithmic    │ binary search, halving      |
# | O(n)          │ Linear         │ single pass                 |
# | O(n log n)    │ Linearithmic   │ sort, merge sort            |
# | O(n²)         │ Quadratic      │ nested loops, bubble sort   |
# | O(n³)         │ Cubic          │ triple nested loops         |
# | O(2^n)        │ Exponential    │ subsets, naive fib          |
# | O(n!)         │ Factorial      │ permutations                |
# ─────────────────────────────────────────────────────────────
# | Loop pattern          │ Complexity                         |
# ─────────────────────────────────────────────────────────────
# | for i in range(n)     │ O(n)                               |
# | nested i,j            │ O(n²)                              |
# | while n > 1: n //= 2  │ O(log n)                           |
# | i *= 2 until n        │ O(log n)                           |
# | for a in A: for b in B│ O(|A|·|B|)                         |
# ─────────────────────────────────────────────────────────────
# | Python cost sheet     │ Cost                               |
# ─────────────────────────────────────────────────────────────
# | list[i] / append / pop│ O(1) / O(1) amort. / O(1)          |
# | list.insert(0, x)     │ O(n)                               |
# | x in list             │ O(n)                               |
# | x in set / dict       │ O(1) average                       |
# | "".join(list)         │ O(total length)                    |
# | s += t in loop        │ O(n²) total                        |
# | sort                  │ O(n log n) time                    |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Drop constants blindly     │ small n behaviour differs      |
# | Two-input loops as O(n²)   │ wrong when sizes differ        |
# | x in list for lookups      │ O(n) each → O(n²) total        |
# | String concat in loop      │ O(n²)                          |
# | insert(0)/pop(0)           │ O(n) → use deque               |
# | Deep recursion             │ RecursionError                 |
# | Trusting average only      │ worst case O(n) for hashes     |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - State complexity for EVERY algorithm you write.
#  - Analyse before you optimise; measure before you rewrite.
#  - Prefer sets/dicts for membership tests over lists.
#  - Use "".join() to build strings, never +=.
#  - Use deque for head insertions/removals.
#  - Watch recursion depth; iterative when depth may exceed ~1000.
#  - Know the amortised cost of built-ins (append, dict ops).
#  - Remember: Big-O is about GROWTH, not absolute speed.
#  - Trade space for time (memoisation, hashing) when it helps.
#  - Profile with timeit / cProfile; don't guess.
# ============================================================