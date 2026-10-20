# 02_Arrays_and_Lists.py

# ============================================================
#  📘 ARRAYS & LISTS IN PYTHON — COMPLETE COVERAGE
#
#  A list in Python is a DYNAMIC ARRAY: contiguous memory,
#  O(1) index access, amortised O(1) append, and O(n) insert/
#  delete in the middle. Understanding its internals tells you
#  exactly WHICH operations are cheap and which are traps.
#
#  This file covers: creation, indexing, slicing, mutation,
#  common built-in methods with their complexity, list
#  comprehensions, 2D arrays, copying (shallow vs deep), the
#  array module, and interview-standard patterns like prefix
#  sums and in-place reversal.
#
#  Sections:
#   1. What a list actually is
#   2. Creating and initialising lists
#   3. Indexing and negative indices
#   4. Slicing — the most underrated tool
#   5. Mutation methods and their complexity
#   6. Iteration patterns
#   7. List comprehensions
#   8. 2D lists and matrices
#   9. Copying: shallow vs deep
#  10. array module and numpy preview
#  11. Classic patterns (prefix sum, two-pointer, reverse)
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A LIST ACTUALLY IS
# ============================================================
# 🔹 A list is a dynamic array of POINTERS to objects.
# 🔸 It grows by DOUBLING when full → amortised O(1) append.
# 🔸 Index access is O(1) because elements sit at fixed offsets.
# 🎯 Practically: contiguous O(1) reads, expensive middle edits.

# 🔎 Under the hood (CPython):
#    - capacity grows roughly 0 → 4 → 8 → 16 → 25 → 35 → ...
#    - len(xs) is O(1) (stored)
#    - inserts/removes in the middle shift all following elements

import sys

xs: list[int] = []
prev_size = sys.getsizeof(xs)
for i in range(10):
    xs.append(i)
    size = sys.getsizeof(xs)
    if size != prev_size:
        print(f"len={len(xs):2d}  bytes={size}")
        prev_size = size
# Output shows jumps (not every append) — the resizing pattern.

# 🧠 Rule of thumb: list = fast reads, fast end-ops, slow middle.


# ============================================================
#  2️⃣ CREATING AND INITIALISING LISTS
# ============================================================
# 🔹 Literal                : [1, 2, 3]
# 🔹 list(range(n))         : [0, 1, ..., n-1]
# 🔹 [expr for x in it]     : comprehension
# 🔹 [default] * n          : repeat (⚠️ same object!)
# 🔹 list(generator)        : materialise a generator

a = [1, 2, 3]
b = list(range(5))                      # [0, 1, 2, 3, 4]
c = [0] * 5                             # [0, 0, 0, 0, 0]
d = [x * x for x in range(5)]           # [0, 1, 4, 9, 16]
e = list("hello")                       # ['h', 'e', 'l', 'l', 'o']

print(a, b, c, d, e)

# ⚠️ [obj] * n repeats the SAME reference — mutation leaks.
row = [[0] * 3] * 2                     # ❌ both rows are same list
row[0][0] = 9
print(row)                              # [[9, 0, 0], [9, 0, 0]]  ← BUG

# ✅ Correct: build rows independently
row_ok = [[0] * 3 for _ in range(2)]
row_ok[0][0] = 9
print(row_ok)                           # [[9, 0, 0], [0, 0, 0]]

# 🧠 NEVER use [mutable] * n for a 2D structure. Always comprehension.


# ============================================================
#  3️⃣ INDEXING AND NEGATIVE INDICES
# ============================================================
# 🔹 xs[i]       : i-th element (0-based)
# 🔹 xs[-1]      : last element
# 🔹 xs[-k]      : k-th from the end
# 🔸 Out-of-range access raises IndexError.

xs = [10, 20, 30, 40, 50]
print(xs[0], xs[2], xs[-1], xs[-2])     # 10 30 50 40

# ⚠️ IndexError on out-of-range
# print(xs[10])                         # ❌ IndexError

# 🔎 Safe access with bounds check or try/except
def safe_get(xs: list[int], i: int) -> int | None:
    if 0 <= i < len(xs):
        return xs[i]
    return None

print(safe_get(xs, 2))                  # 30
print(safe_get(xs, 99))                 # None

# 🧠 Negative indices are pure sugar: xs[-1] == xs[len(xs)-1].


# ============================================================
#  4️⃣ SLICING — THE MOST UNDERRATED TOOL
# ============================================================
# 🔹 xs[a:b]   : elements from a up to (not including) b
# 🔹 xs[:b]    : from start
# 🔹 xs[a:]    : to end
# 🔹 xs[:]     : full SHALLOW copy
# 🔹 xs[a:b:s] : with step s (s can be negative → reverse)
# 🔸 Slicing NEVER raises IndexError — it clamps.

xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(xs[2:5])                          # [2, 3, 4]
print(xs[:4])                           # [0, 1, 2, 3]
print(xs[6:])                           # [6, 7, 8, 9]
print(xs[::2])                          # [0, 2, 4, 6, 8]
print(xs[::-1])                         # [9, 8, ..., 0]  (reverse)
print(xs[8:2:-1])                       # [8, 7, 6, 5, 4, 3]
print(xs[100:200])                      # []  (clamped, no error)

# ✅ Slice assignment
xs[1:3] = [99, 98]
print(xs)                               # [0, 99, 98, 3, 4, 5, 6, 7, 8, 9]

# ⚠️ Slicing creates a NEW list — modifying the slice does NOT
#    affect the original.
sub = xs[2:5]
sub[0] = -1
print(xs[2:5], sub)                     # [98, 3, 4] [-1, 3, 4]

# 🧠 Reversing in one line: xs[::-1]. Copy in one line: xs[:].


# ============================================================
#  5️⃣ MUTATION METHODS AND THEIR COMPLEXITY
# ============================================================
# 🔹 Know the cost so you don't write accidentally O(n²) code.

xs = [1, 2, 3]

xs.append(4)                            # O(1) amortised
xs.extend([5, 6])                       # O(k)
xs.insert(0, 0)                         # O(n)  ← shifts
xs.remove(3)                            # O(n)  ← search + shift
popped_end = xs.pop()                   # O(1)
popped_front = xs.pop(0)                # O(n)  ← shifts
xs.reverse()                            # O(n)
xs.sort()                               # O(n log n)
idx = xs.index(4)                       # O(n)
xs.clear()                              # O(n) frees references
print(xs)

# 🔸 sort vs sorted
unsorted = [3, 1, 2]
unsorted.sort()                         # in-place, returns None
ordered = sorted([3, 1, 2])             # returns a new list

# 🔸 sort with key
words = ["banana", "apple", "cherry"]
words.sort(key=len)
print(words)                            # ['apple', 'banana', 'cherry']

words.sort(key=lambda w: w[-1])
print(words)                            # sorts by last char

# ⚠️ sort() returns None (a common bug):
# x = [3, 1, 2].sort()                  # ❌ x is None
# 🧠 Use sorted() when you need the result assigned.


# ============================================================
#  6️⃣ ITERATION PATTERNS
# ============================================================
# 🔹 for x in xs             : by value
# 🔹 for i, x in enumerate(xs): index + value
# 🔹 for a, b in zip(A, B)   : parallel
# 🔹 reversed(xs)            : reverse iterator, O(1) extra
# 🔸 Never use `for i in range(len(xs))` unless you NEED i.

xs = [10, 20, 30]

for x in xs:                            # ✅ Pythonic
    print(x)

for i, x in enumerate(xs, start=1):     # ✅ index + value
    print(i, x)

names = ["a", "b", "c"]
scores = [10, 20, 30]
for n, s in zip(names, scores):         # ✅ parallel
    print(n, s)

for x in reversed(xs):                  # ✅ reverse iteration
    print(x)

# ⚠️ Modifying a list while iterating → skips / duplicates
def remove_evens_buggy(xs: list[int]) -> None:
    for x in xs:
        if x % 2 == 0:
            xs.remove(x)                # ❌ unsafe

def remove_evens_safe(xs: list[int]) -> list[int]:
    return [x for x in xs if x % 2 != 0]  # ✅ build new

# 🧠 Rule: iterate to READ; build a NEW list to transform.


# ============================================================
#  7️⃣ LIST COMPREHENSIONS
# ============================================================
# 🔹 [expr for x in it if cond] — fast, readable, Pythonic.
# 🔸 Roughly 1.5–2x faster than the equivalent for-loop.
# 🔸 Nested comprehensions exist but reduce readability fast.

squares = [x * x for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Multiple loops (cartesian product)
pairs = [(x, y) for x in range(2) for y in range(2)]
print(pairs)                            # [(0,0),(0,1),(1,0),(1,1)]

# Comprehension with if/else
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
print(labels)                           # ['even', 'odd', ...]

# 🧠 Rule: if it doesn't fit on ONE line, use a normal for-loop.
# ⚠️ Don't use comprehensions for SIDE EFFECTS — they should
#    return a value.
# [print(x) for x in xs]                # ❌ abuse


# ============================================================
#  8️⃣ 2D LISTS AND MATRICES
# ============================================================
# 🔹 A matrix is a list of lists: rows[i][j].
# 🔸 Build with nested comprehension, never with [row] * n.

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

# 🔸 Access
print(matrix[1][2])                     # 6

# 🔸 Iterate rows then cols
for row in matrix:
    for v in row:
        pass

# 🔸 Transpose (rows become columns)
transposed = [list(row) for row in zip(*matrix)]
print(transposed)                       # [[1,4,7],[2,5,8],[3,6,9]]

# 🔸 Build a zero matrix
rows, cols = 3, 4
zeros = [[0] * cols for _ in range(rows)]   # ✅ safe

# ⚠️ Common mistake — see section 2 for the shared-reference bug.
bad = [[0] * cols] * rows               # ❌ shared rows


# ============================================================
#  9️⃣ COPYING: SHALLOW VS DEEP
# ============================================================
# 🔹 Shallow copy: new list, same inner objects.
# 🔸 Deep copy   : recursive new objects (copy.deepcopy).
# 🔸 Slicing and list() are shallow.

original = [[1, 2], [3, 4]]

shallow = original[:]                   # or original.copy()
shallow[0][0] = 99
print(original[0][0])                   # 99  ← inner list shared!

import copy
deep = copy.deepcopy(original)
deep[0][0] = -1
print(original[0][0], deep[0][0])       # 99 -1  ← independent

# ⚠️ `a = b` does NOT copy — both names point to the SAME list.
# 🧠 Use copy.deepcopy only when you truly need nested isolation;
#    it's slow. Prefer building new structures functionally.


# ============================================================
#  🔟 array MODULE AND NUMPY PREVIEW
# ============================================================
# 🔹 array.array — typed, compact, single-type storage.
# 🔸 numpy.ndarray — the real workhorse for numerical DSA.
# 🎯 Use array when you want raw memory efficiency with pure Python.

from array import array

nums = array("i", [1, 2, 3, 4])         # 'i' = signed int
nums.append(5)
print(nums, nums[0])                    # array('i', [1,2,3,4,5]) 1
print(nums.itemsize)                    # 4 bytes per element (platform-dependent)

# 🔎 numpy preview (install separately):
# import numpy as np
# a = np.array([1, 2, 3])
# print(a * 2)                          # vectorised → [2, 4, 6]
# Vectorised ops run in C, not Python loops — 10–100x faster.

# 🧠 For algorithm courses, plain lists are standard. Use array /
#    numpy when memory or speed becomes the bottleneck.


# ============================================================
#  1️⃣1️⃣ CLASSIC PATTERNS
# ============================================================
# 🔹 PREFIX SUMS — O(1) range-sum queries after O(n) build.
def prefix_sums(xs: list[int]) -> list[int]:
    ps = [0] * (len(xs) + 1)
    for i, x in enumerate(xs):
        ps[i + 1] = ps[i] + x
    return ps

def range_sum(ps: list[int], l: int, r: int) -> int:
    # sum of xs[l..r] inclusive
    return ps[r + 1] - ps[l]

xs = [3, 1, 4, 1, 5, 9]
ps = prefix_sums(xs)
print(range_sum(ps, 1, 3))              # 1 + 4 + 1 = 6

# 🔹 TWO POINTERS — reverse, palindrome, pair-sum on sorted list.
def is_palindrome(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1; j -= 1
    return True

print(is_palindrome("racecar"))         # True

# 🔹 IN-PLACE REVERSAL
def reverse_in_place(xs: list[int]) -> None:
    i, j = 0, len(xs) - 1
    while i < j:
        xs[i], xs[j] = xs[j], xs[i]
        i += 1; j -= 1

xs = [1, 2, 3, 4, 5]
reverse_in_place(xs)
print(xs)                               # [5, 4, 3, 2, 1]

# 🔹 DUTCH NATIONAL FLAG — 3-way partition (0s, 1s, 2s)
def sort_012(xs: list[int]) -> None:
    lo, mid, hi = 0, 0, len(xs) - 1
    while mid <= hi:
        if xs[mid] == 0:
            xs[lo], xs[mid] = xs[mid], xs[lo]
            lo += 1; mid += 1
        elif xs[mid] == 1:
            mid += 1
        else:
            xs[mid], xs[hi] = xs[hi], xs[mid]
            hi -= 1

xs = [2, 0, 1, 2, 1, 0]
sort_012(xs)
print(xs)                               # [0, 0, 1, 1, 2, 2]


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ [x] * n shares references — never for mutable elements.
# ⚠️ xs.insert(0, v) and xs.pop(0) are O(n) — use deque.
# ⚠️ Removing while iterating corrupts the loop.
# ⚠️ xs.sort() returns None — do NOT assign.
# ⚠️ `a = b` aliases; use a[:] or list(a) for a shallow copy.
# ⚠️ Shallow copies still share inner mutables.
# ⚠️ Slicing creates a copy — expensive in a loop.
# ⚠️ `in` on a list is O(n) — convert to set for repeated tests.
# ⚠️ Nested list comprehensions past two levels are hard to read.
# ⚠️ Reading list length in a while-loop each iteration is fine
#    (O(1)) but caching helps in hot paths.
# ⚠️ "sort key" is evaluated ONCE per element (good) but the
#    key function itself can be slow.
# ⚠️ `xs.index(x)` raises ValueError if not found — use `in`
#    or try/except.
# ⚠️ Sorting mixed types (int + str) raises TypeError in Py3.

# 🕒 Version notes
# - list.sort() stable Timsort: Python 2.3+
# - Slicing with step: Python 2.3+
# - list comprehensions (with `if`): Python 2.0+
# - Dict/set comprehensions: Python 2.7+ / 3.0+
# - `list.copy()` method: Python 3.3+
# - `sort(key=..., reverse=...)` unchanged — stable API
# - `int.bit_length`, `math.prod`: Python 3.8+ (convenient helpers)
# - `itertools.batched(xs, n)`: Python 3.12+
# - Array module unchanged — still typed but limited (no sort key)


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation              │ Average cost    │ Notes           |
# ─────────────────────────────────────────────────────────────
# | xs[i]                  │ O(1)            │ index           |
# | xs[i] = v              │ O(1)            │ assign          |
# | xs.append(v)           │ O(1) amort.     │ end             |
# | xs.pop()               │ O(1)            │ from end        |
# | xs.pop(0)              │ O(n)            │ shifts          |
# | xs.insert(0, v)        │ O(n)            │ shifts          |
# | xs.remove(v)           │ O(n)            │ search + shift  |
# | v in xs                │ O(n)            │ linear scan     |
# | xs.index(v)            │ O(n)            │ ValueError if none |
# | xs[a:b]                │ O(b-a)          │ new list        |
# | xs.sort()              │ O(n log n)      │ in-place        |
# | sorted(xs)             │ O(n log n)      │ new list        |
# | xs.reverse()           │ O(n)            │ in-place        |
# | len(xs)                │ O(1)            │ cached          |
# | xs * k                 │ O(n * k)        │ new list        |
# ─────────────────────────────────────────────────────────────
# | Pattern               │ Recipe                             |
# ─────────────────────────────────────────────────────────────
# | Reverse               │ xs[::-1] or xs.reverse()           |
# | Copy (shallow)        │ xs[:] or list(xs) or xs.copy()     |
# | Copy (deep)           │ copy.deepcopy(xs)                  |
# | Index + value         │ enumerate(xs)                      |
# | Parallel              │ zip(A, B)                          |
# | Filter + map          │ [f(x) for x in xs if cond]         |
# | 2D build              │ [[0]*c for _ in range(r)]          |
# | Transpose             │ [list(r) for r in zip(*m)]         |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | [obj] * n                  │ Shared references              |
# | insert(0)/pop(0)           │ O(n) each → O(n²) loop         |
# | Mutate while iterating     │ Skips elements                 |
# | xs.sort() assigned         │ None                           |
# | Shallow copy on nested     │ Inner still shared             |
# | `in` on list in hot loop   │ O(n²) — use set                |
# | Slicing in a loop          │ Copies add up                  |
# | Mixed-type sort            │ TypeError in Py3               |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Prefer [x for x in xs if ...] over manual loops + append.
#  - Use enumerate / zip instead of range(len(xs)).
#  - Build 2D lists with comprehensions, never [row] * n.
#  - Use set/dict for repeated membership checks.
#  - Slice when you need a copy; slice-free when you need speed.
#  - Never mutate a list while iterating — build a new one.
#  - Know that insert(0) / pop(0) are O(n) — use deque.
#  - Cache len(xs) in tight loops if you re-check it often.
#  - Prefer sorted(xs) when you want the result; xs.sort() in place.
#  - Use copy.deepcopy only when nested isolation is required.
# ============================================================