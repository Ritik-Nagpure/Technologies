# 05_Recursion_Basics.py

# ============================================================
#  📘 RECURSION BASICS IN PYTHON — COMPLETE COVERAGE
#
#  Recursion is a function calling itself to solve smaller
#  instances of the same problem. Every recursion needs a BASE
#  CASE (stop condition) and a RECURSIVE CASE that moves toward
#  it. Once mastered, recursion unlocks trees, graphs, backtracking,
#  divide & conquer, and DP.
#
#  This file covers: the anatomy of recursion, call stack, base
#  cases, recursion vs iteration, tail recursion (and why Python
#  doesn't optimise it), the recursion limit, memoisation, and
#  the classic patterns (factorial, fibonacci, towers of Hanoi,
#  permutations, subsets, binary search).
#
#  Sections:
#   1. What recursion is
#   2. Anatomy: base case + recursive case
#   3. The call stack (visual)
#   4. Recursion vs iteration
#   5. Python's recursion limit
#   6. Tail recursion — and why it doesn't help
#   7. Divide & conquer pattern
#   8. Multiple recursion (branching)
#   9. Memoisation with lru_cache
#  10. Classic recursion problems
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT RECURSION IS
# ============================================================
# 🔹 A function that calls ITSELF on a smaller input.
# 🔹 Every recursion can be written iteratively (and vice versa).
# 🔸 Recursion shines when the problem is naturally self-similar.
# 🎯 Rule: solve f(n) by calling f(n-1) (or n/2, etc.).

# The classic: factorial
#   5! = 5 * 4 * 3 * 2 * 1 = 120
#   n! = n * (n-1)! ,  0! = 1

def factorial(n: int) -> int:
    if n <= 1:
        return 1                        # base case
    return n * factorial(n - 1)         # recursive case

print(factorial(5))                     # 120
print(factorial(0))                     # 1

# 🧠 Two rules ALWAYS:
#   1. There MUST be a base case that does not recurse.
#   2. Every recursive call MUST move toward the base case.


# ============================================================
#  2️⃣ ANATOMY: BASE CASE + RECURSIVE CASE
# ============================================================
# 🔹 Base case: the "smallest" input — return directly.
# 🔸 Recursive case: reduce the problem, call self, combine.
# 🎯 If either is missing → infinite recursion → RecursionError.

def sum_list(xs: list[int]) -> int:
    if not xs:
        return 0                        # base case
    return xs[0] + sum_list(xs[1:])     # recursive case

print(sum_list([1, 2, 3, 4, 5]))        # 15

# ⚠️ Multiple base cases are common:
def fib(n: int) -> int:
    if n < 2:
        return n                        # base cases: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2)

print(fib(10))                          # 55

# ⚠️ Wrong base case → wrong result or infinite recursion:
def broken(n: int) -> int:
    if n == 0:
        return 0
    return broken(n - 1)
# broken(-1) would recurse forever (never hits 0)

# 🧠 Write the base case FIRST. Then assume it works, and write
#    the recursive case ("leap of faith").


# ============================================================
#  3️⃣ THE CALL STACK (VISUAL)
# ============================================================
# 🔹 Each call pushes a frame onto the call stack.
# 🔸 When the base case returns, frames POP in reverse order.
# 🔸 Stack depth = recursion depth = memory cost.

def countdown(n: int) -> None:
    if n <= 0:
        print("done")
        return
    print(n)
    countdown(n - 1)

countdown(3)
# Output: 3
#         2
#         1
#         done

# 🔎 Trace for countdown(3):
#   countdown(3) → prints 3, calls countdown(2)
#     countdown(2) → prints 2, calls countdown(1)
#       countdown(1) → prints 1, calls countdown(0)
#         countdown(0) → prints "done", returns
#       returns
#     returns
#   returns

# 🧠 Draw the stack on paper. Every "return" pops one frame.


# ============================================================
#  4️⃣ RECURSION VS ITERATION
# ============================================================
# 🔹 Recursion : elegant, mirrors the math, uses stack memory.
# 🔹 Iteration : faster, less memory, sometimes less readable.
# 🔸 Python recursion has a hard limit (~1000 frames by default).

# Recursive factorial
def fact_rec(n: int) -> int:
    return 1 if n <= 1 else n * fact_rec(n - 1)

# Iterative factorial — same result, no stack risk
def fact_iter(n: int) -> int:
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(fact_rec(10), fact_iter(10))      # 3628800 3628800

# Performance note: recursion is usually SLOWER in Python due
# to function-call overhead. Prefer iteration when it's natural.

# 🧠 Rule of thumb:
#   - Trees/graphs/backtracking → recursion is natural.
#   - Simple counting/summing → iteration wins.
#   - Deep recursion (n > 500) → prefer iteration or BFS.


# ============================================================
#  5️⃣ PYTHON'S RECURSION LIMIT
# ============================================================
# 🔹 Default limit: ~1000 frames.
# 🔸 Exceeding it → RecursionError.
# 🔸 sys.setrecursionlimit(n) can raise it, but C stack may
#    overflow — use with care.

import sys
print(sys.getrecursionlimit())          # usually 1000

def deep(n: int) -> int:
    if n == 0:
        return 0
    return 1 + deep(n - 1)

print(deep(500))                        # 500 (OK)
# deep(2000)                            # ❌ RecursionError: maximum recursion depth exceeded

# ✅ Raise temporarily when needed
old_limit = sys.getrecursionlimit()
sys.setrecursionlimit(10_000)
print(deep(5_000))                      # 5000 (works)
sys.setrecursionlimit(old_limit)        # restore

# ⚠️ Deep recursion in Python may crash the interpreter (C stack).
# 🧠 If you NEED 10k+ depth, rewrite as an explicit stack or
#    convert to iterative/DP. Recursion isn't free.


# ============================================================
#  6️⃣ TAIL RECURSION — AND WHY IT DOESN'T HELP
# ============================================================
# 🔹 Tail recursion = the recursive call is the LAST action.
# 🔸 Some languages optimise this into a loop (TCO).
# 🔸 Python does NOT do TCO — every call still pushes a frame.

def tail_fact(n: int, acc: int = 1) -> int:
    if n <= 1:
        return acc
    return tail_fact(n - 1, n * acc)    # tail call — but no TCO in Python

print(tail_fact(5))                     # 120

# ⚠️ Even though this LOOKS tail-recursive, Python still hits
#    the same 1000-frame limit. Convert to a loop manually:
def loop_fact(n: int) -> int:
    acc = 1
    while n > 1:
        acc *= n
        n -= 1
    return acc

print(loop_fact(5))                     # 120

# 🧠 Rule: write tail recursion if it reads well, but don't
#    expect the interpreter to optimise it.


# ============================================================
#  7️⃣ DIVIDE & CONQUER PATTERN
# ============================================================
# 🔹 Split the problem in half, solve each half, combine.
# 🔸 Classic: binary search, merge sort, quick sort.
# 🎯 Complexity usually O(n log n) instead of O(n²).

def binary_search(xs: list[int], target: int) -> int:
    def _bs(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if xs[mid] == target:
            return mid
        if xs[mid] < target:
            return _bs(mid + 1, hi)
        return _bs(lo, mid - 1)
    return _bs(0, len(xs) - 1)

print(binary_search([1, 3, 5, 7, 9], 7))        # 3
print(binary_search([1, 3, 5, 7, 9], 4))        # -1

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

print(merge_sort([5, 2, 9, 1, 7]))      # [1, 2, 5, 7, 9]

# 🧠 Divide & conquer rule:
#   T(n) = a * T(n/b) + O(f(n))
#   → merge sort: 2 * T(n/2) + O(n) = O(n log n)
#   → binary search: T(n/2) + O(1) = O(log n)


# ============================================================
#  8️⃣ MULTIPLE RECURSION (BRANCHING)
# ============================================================
# 🔹 When a function calls itself MULTIPLE times per call.
# 🔸 Creates a recursion tree, not a chain.
# 🎯 Naive Fibonacci, subsets, permutations, tree traversals.

def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)  # TWO calls

# 🔎 Number of calls grows like O(2^n) — 40th fib = 300M+ calls.
# 🧠 FIX: memoise (see next section).

def subsets(xs: list[int]) -> list[list[int]]:
    if not xs:
        return [[]]
    first, rest = xs[0], xs[1:]
    without = subsets(rest)                     # branch 1
    with_ = [[first] + s for s in without]      # branch 2
    return without + with_

print(subsets([1, 2, 3]))
# [[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]

def permutations(xs: list[int]) -> list[list[int]]:
    if len(xs) <= 1:
        return [xs[:]]
    out: list[list[int]] = []
    for i, x in enumerate(xs):
        rest = xs[:i] + xs[i + 1:]
        for p in permutations(rest):
            out.append([x] + p)
    return out

print(permutations([1, 2, 3]))
# [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

# 🧠 Branching recursion is powerful but expensive:
#   - subsets     → O(2^n)
#   - permutations→ O(n!)
#   - naive fib   → O(2^n) (or ~1.618^n)
#   Memoise or use DP when subproblems overlap.


# ============================================================
#  9️⃣ MEMOISATION WITH lru_cache
# ============================================================
# 🔹 Cache results of expensive recursive calls by argument.
# 🔸 Turns overlapping-subproblem recursions from exponential
#    to polynomial.
# 🎯 Standard tool: functools.lru_cache (or functools.cache).

from functools import lru_cache

@lru_cache(maxsize=None)                # cache ALL results
def fib_memo(n: int) -> int:
    if n < 2:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)

print(fib_memo(40))                     # 102334155 (instant)
print(fib_memo.cache_info())            # CacheInfo(hits=38, misses=41, ...)

# ✅ Python 3.9+ has functools.cache — same, simpler:
from functools import cache

@cache
def fib_cache(n: int) -> int:
    if n < 2:
        return n
    return fib_cache(n - 1) + fib_cache(n - 2)

print(fib_cache(40))                    # 102334155

# ⚠️ Args must be HASHABLE (no lists / dicts as args directly).
#    Workaround: convert lists to tuples.

@lru_cache(maxsize=None)
def count_paths(rows: int, cols: int) -> int:
    if rows == 1 or cols == 1:
        return 1
    return count_paths(rows - 1, cols) + count_paths(rows, cols - 1)

print(count_paths(3, 3))                # 6

# 🧠 Rule: if you see the SAME subproblem called twice, memoise.
#    Time drops from O(2^n) to O(states × cost per state).


# ============================================================
#  🔟 CLASSIC RECURSION PROBLEMS
# ============================================================
# 🔹 TOWERS OF HANOI — 3 pegs, move n disks from A to C.
#    Moves = 2^n - 1. Base case n=1.
def hanoi(n: int, src: str, dst: str, aux: str) -> None:
    if n == 1:
        print(f"move disk 1: {src} -> {dst}")
        return
    hanoi(n - 1, src, aux, dst)
    print(f"move disk {n}: {src} -> {dst}")
    hanoi(n - 1, aux, dst, src)

hanoi(3, "A", "C", "B")
# Output (7 lines): moves disk 1..3 through the pegs

# 🔹 GCD (Euclid's algorithm) — O(log min(a, b))
def gcd(a: int, b: int) -> int:
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(48, 18))                      # 6

# 🔹 POWER (fast exponentiation)
def power(base: int, exp: int) -> int:
    if exp == 0:
        return 1
    if exp % 2 == 0:
        half = power(base, exp // 2)
        return half * half
    return base * power(base, exp - 1)

print(power(2, 10))                     # 1024

# 🔹 FLATTEN NESTED LIST
def flatten(xs: list) -> list[int]:
    out: list[int] = []
    for x in xs:
        if isinstance(x, list):
            out.extend(flatten(x))
        else:
            out.append(x)
    return out

print(flatten([1, [2, [3, 4]], 5]))     # [1, 2, 3, 4, 5]

# 🔹 REVERSE A STRING
def reverse_str(s: str) -> str:
    if len(s) <= 1:
        return s
    return reverse_str(s[1:]) + s[0]

print(reverse_str("hello"))             # olleh

# 🔹 COUNT OCCURRENCES
def count_occurrences(xs: list[int], target: int) -> int:
    if not xs:
        return 0
    return (1 if xs[0] == target else 0) + count_occurrences(xs[1:], target)

print(count_occurrences([1, 2, 1, 3, 1], 1))    # 3

# 🔹 TREE-STYLE recursion — sum of nested structure
def nested_sum(data: int | list) -> int:
    if isinstance(data, int):
        return data
    return sum(nested_sum(x) for x in data)

print(nested_sum([1, [2, [3, 4]], 5]))          # 15

# 🧠 Pattern: "solve for n using answer for n-1 / n/2" → recursion.


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Missing base case → RecursionError.
# ⚠️ Base case that never triggers → RecursionError.
# ⚠️ Recursive call must SHRINK the input toward the base case.
# ⚠️ Python's default recursion limit ~1000 — plan around it.
# ⚠️ Setting recursion limit very high can crash the interpreter.
# ⚠️ Python does NOT do tail-call optimisation.
# ⚠️ Branching recursion without memoisation explodes fast.
# ⚠️ Slicing a list inside recursion (xs[1:]) copies — O(n²)
#    total. Pass indices instead when it matters.
def sum_indices(xs: list[int], i: int = 0) -> int:
    if i == len(xs):
        return 0
    return xs[i] + sum_indices(xs, i + 1)   # ✅ O(n)

# ⚠️ Mutable default argument in recursion is a classic bug:
def collect_bad(n: int, acc: list[int] = []) -> list[int]:  # ❌ shared
    if n == 0:
        return acc
    acc.append(n)
    return collect_bad(n - 1, acc)

# ✅ Fix: pass None and create inside
def collect_ok(n: int, acc: list[int] | None = None) -> list[int]:
    if acc is None:
        acc = []
    if n == 0:
        return acc
    acc.append(n)
    return collect_ok(n - 1, acc)

# ⚠️ lru_cache keeps arguments alive → memory leak for large n.
#    Use maxsize or functools.cache with care.
# ⚠️ lru_cache requires hashable args — no lists/dicts.
# ⚠️ Exceptions thrown inside a cached call are NOT cached —
#    they'll re-raise on next call.
# ⚠️ Do NOT decorate a method with @lru_cache without care —
#    `self` becomes part of the key. Use functools.cache on
#    a plain function, or a manual dict cache.
# ⚠️ RecursionError inside generators can be confusing —
#    tracebacks get truncated.

# 🕒 Version notes
# - functools.lru_cache: Python 3.2+
# - functools.cache (simpler, unbounded): Python 3.9+
# - lru_cache(maxsize=None) equivalent to cache()
# - `sys.setrecursionlimit`: always available — use cautiously
# - Python does NOT implement TCO — no version adds it
# - `math.perm` / `math.comb`: Python 3.8+ (useful for
#   combinatorics without hand-written recursion)
# - `functools.cached_property` (recursive properties): 3.8+
# - `functools.reduce` is often better than tail recursion


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Concept              │ Notes                              |
# ─────────────────────────────────────────────────────────────
# | Base case            │ Stops recursion                    |
# | Recursive case       │ Shrinks input toward base          |
# | Call stack depth     │ = recursion depth = memory         |
# | Python limit         │ ~1000 frames default               |
# | Tail recursion       │ NOT optimised in Python            |
# | Memoisation          │ Cache results by args              |
# | Divide & conquer     │ Split in halves, combine           |
# | Branching recursion  │ Explodes without memoisation       |
# ─────────────────────────────────────────────────────────────
# | Common problem        │ Complexity                         |
# ─────────────────────────────────────────────────────────────
# | Factorial (rec)       │ O(n) time, O(n) space              |
# | Fibonacci (naive)     │ O(2^n)                             |
# | Fibonacci (memo)      │ O(n) time, O(n) space              |
# | Merge sort            │ O(n log n) time, O(n) space        |
# | Binary search (rec)   │ O(log n) time, O(log n) space      |
# | Subsets               │ O(2^n)                             |
# | Permutations          │ O(n!)                              |
# | Towers of Hanoi       │ O(2^n) moves                       |
# ─────────────────────────────────────────────────────────────
# | Tool                    │ Purpose                          |
# ─────────────────────────────────────────────────────────────
# | functools.lru_cache     │ Memoise by args                  |
# | functools.cache         │ Simpler memoisation (3.9+)       |
# | sys.getrecursionlimit() │ Current limit                    |
# | sys.setrecursionlimit() │ Raise limit (careful)            |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Missing base case           │ RecursionError                 |
# | Base case never hit         │ RecursionError                 |
# | Tail recursion expectation  │ No TCO in Python               |
# | Slicing xs[1:] inside       │ O(n²) copies                   |
# | Mutable default in recursion│ Shared across calls            |
# | Unmemoised branching        │ Exponential blow-up             |
# | lru_cache on methods        │ self in key → cache miss       |
# | lru_cache args unhashable   │ TypeError                      |
# | Raising limit too high      │ Interpreter crash              |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Always write the base case FIRST.
#  - Verify every recursive call moves toward the base case.
#  - Draw the recursion tree for branching problems.
#  - Memoise whenever subproblems repeat (fib, paths, DP).
#  - Prefer indices over slices to avoid O(n²) copying.
#  - Convert deep recursion (n > 500) to iteration/BFS.
#  - Don't expect tail-call optimisation in Python.
#  - Use functools.cache for plain functions, not for methods.
#  - Use `sys.setrecursionlimit` sparingly and restore it.
#  - Remember: recursion costs memory, not just time.
#  - Test with edge cases: n=0, n=1, empty input, single element.
# ============================================================