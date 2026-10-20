# 15_Sorting_Algorithms.py

# ============================================================
#  📘 SORTING ALGORITHMS IN PYTHON — COMPLETE COVERAGE
#
#  Sorting is the art of arranging data in order. Every sorting
#  algorithm trades off time, space, stability, and simplicity
#  differently. Python's built-in `sorted()` and `list.sort()`
#  use TIMSORT (a hybrid merge+insertion) — nearly always the
#  right choice. But interviews test whether you can implement
#  the classics and reason about their complexity.
#
#  This file covers: stability, comparison vs non-comparison,
#  bubble, selection, insertion, merge, quick, heap sort, and
#  the linear-time special cases (counting, radix, bucket).
#  Also Python-specific sorting with key=, sorted(), and the
#  Timsort guarantee.
#
#  Sections:
#   1. Sorting terminology (stability, in-place)
#   2. Comparison vs non-comparison sorts
#   3. Bubble sort — O(n²)
#   4. Selection sort — O(n²)
#   5. Insertion sort — O(n²) but great for small / nearly sorted
#   6. Merge sort — O(n log n), stable
#   7. Quick sort — O(n log n) avg, in-place
#   8. Heap sort — O(n log n), in-place, not stable
#   9. Counting / Radix / Bucket — linear time
#  10. Python's sorted() and sort() — Timsort + key=
#  11. When to use which — decision guide
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ SORTING TERMINOLOGY
# ============================================================
# 🔹 STABLE    : equal elements keep their original relative order.
# 🔹 IN-PLACE  : O(1) extra memory (or O(log n) for recursion).
# 🔹 ADAPTIVE  : faster on partially-sorted input.
# 🔹 COMPARISON: uses only pairwise comparisons (a < b).
# 🔹 NON-COMPARISON: uses value structure (digits, buckets).
# 🎯 Know which of these each algorithm gives you.

# ── Master complexity table ─────────────────────────────────
# | Algorithm      │ Best       │ Avg        │ Worst      │ Space    │ Stable │
# |----------------|------------|------------|------------|----------|--------|
# | Bubble         │ O(n)       │ O(n²)      │ O(n²)      │ O(1)     │ Yes    |
# | Selection      │ O(n²)      │ O(n²)      │ O(n²)      │ O(1)     │ No     |
# | Insertion      │ O(n)       │ O(n²)      │ O(n²)      │ O(1)     │ Yes    |
# | Merge          │ O(n log n) │ O(n log n) │ O(n log n) │ O(n)     │ Yes    |
# | Quick          │ O(n log n) │ O(n log n) │ O(n²)      │ O(log n) │ No     |
# | Heap           │ O(n log n) │ O(n log n) │ O(n log n) │ O(1)     │ No     |
# | Counting       │ O(n + k)   │ O(n + k)   │ O(n + k)   │ O(k)     │ Yes    |
# | Radix          │ O(d(n+b))  │ O(d(n+b))  │ O(d(n+b))  │ O(n+b)   │ Yes    |
# | Bucket         │ O(n + k)   │ O(n + k)   │ O(n²)      │ O(n)     │ Yes    |
# | Timsort (Py)   │ O(n)       │ O(n log n) │ O(n log n) │ O(n)     │ Yes    |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  2️⃣ COMPARISON VS NON-COMPARISON SORTS
# ============================================================
# 🔹 Comparison sorts: bubble, selection, insertion, merge,
#    quick, heap, Timsort.
#    → Lower bound: Ω(n log n). You cannot beat it.
#
# 🔹 Non-comparison sorts: counting, radix, bucket.
#    → Can be O(n) but require value constraints (integers in
#      a range, keys of bounded digits, uniform distribution).
# 🎯 When the problem says "0..k" or "n-digit numbers", think
#    non-comparison.

# 🧠 Rule: if the input has structure, exploit it. Otherwise
#    accept O(n log n).


# ============================================================
#  3️⃣ BUBBLE SORT — O(n²)
# ============================================================
# 🔹 Repeatedly swap adjacent out-of-order pairs.
# 🔸 Adaptive: early exit if a pass makes no swaps.
# 🎯 Educational; rarely used in real code.

def bubble_sort(xs: list[int]) -> None:
    n = len(xs)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if xs[j] > xs[j + 1]:
                xs[j], xs[j + 1] = xs[j + 1], xs[j]
                swapped = True
        if not swapped:
            break                       # already sorted → O(n) best

a = [5, 1, 4, 2, 8]
bubble_sort(a)
print(a)                                # [1, 2, 4, 5, 8]

# ⚠️ Without the `swapped` flag, even sorted input is O(n²).
# 🧠 Best case O(n) — only with the flag.


# ============================================================
#  4️⃣ SELECTION SORT — O(n²)
# ============================================================
# 🔹 Find the min of the remaining, swap it into position.
# 🔸 Always O(n²); not adaptive.
# 🎯 Minimises swaps — O(n) swaps total. Useful when swap is
#    expensive.

def selection_sort(xs: list[int]) -> None:
    n = len(xs)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if xs[j] < xs[min_idx]:
                min_idx = j
        if min_idx != i:
            xs[i], xs[min_idx] = xs[min_idx], xs[i]

a = [5, 1, 4, 2, 8]
selection_sort(a)
print(a)                                # [1, 2, 4, 5, 8]

# ⚠️ Not stable — equal elements may be reordered.
# 🧠 Use when swaps are expensive; otherwise skip.


# ============================================================
#  5️⃣ INSERTION SORT — O(n²) BUT GREAT ON SMALL / NEARLY SORTED
# ============================================================
# 🔹 Build a sorted prefix by inserting each element into its
#    correct position.
# 🔸 Adaptive: nearly sorted input → close to O(n).
# 🎯 Used by Timsort for runs up to ~64 elements.

def insertion_sort(xs: list[int]) -> None:
    for i in range(1, len(xs)):
        key = xs[i]
        j = i - 1
        while j >= 0 and xs[j] > key:
            xs[j + 1] = xs[j]
            j -= 1
        xs[j + 1] = key

a = [5, 1, 4, 2, 8]
insertion_sort(a)
print(a)                                # [1, 2, 4, 5, 8]

# 🧠 Insertion sort beats merge/quick for n ≤ ~16 — that's why
#    hybrid algorithms (Timsort, introsort) switch to it.


# ============================================================
#  6️⃣ MERGE SORT — O(n log n), STABLE
# ============================================================
# 🔹 Divide in half, sort each half, merge.
# 🔸 Guaranteed O(n log n) regardless of input.
# 🔸 Stable but needs O(n) extra space.

def merge_sort(xs: list[int]) -> list[int]:
    if len(xs) <= 1:
        return xs[:]
    mid = len(xs) // 2
    left = merge_sort(xs[:mid])
    right = merge_sort(xs[mid:])
    return _merge(left, right)

def _merge(a: list[int], b: list[int]) -> list[int]:
    out: list[int] = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:                # ≤ for stability
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out

print(merge_sort([5, 1, 4, 2, 8]))      # [1, 2, 4, 5, 8]

# 🔸 In-place merge variant exists (O(n) space anyway).
# 🔸 For linked lists, merge sort is the natural choice — no
#    random access needed and stable.

# 🧠 Merge sort is the go-to when:
#    - You need GUARANTEED O(n log n).
#    - You need STABILITY.
#    - You're sorting a linked list.
#    - You need external sort (data > memory).


# ============================================================
#  7️⃣ QUICK SORT — O(n log n) AVG, IN-PLACE
# ============================================================
# 🔹 Choose pivot, partition around it, recurse.
# 🔸 Fast in practice (great cache locality) but O(n²) worst.
# 🔸 Randomised pivot avoids the sorted-input worst case.

import random

def quick_sort(xs: list[int], lo: int = 0, hi: int | None = None) -> None:
    if hi is None:
        hi = len(xs) - 1
    if lo >= hi:
        return
    pivot_idx = _partition(xs, lo, hi)
    quick_sort(xs, lo, pivot_idx - 1)
    quick_sort(xs, pivot_idx + 1, hi)

def _partition(xs: list[int], lo: int, hi: int) -> int:
    # 🔸 Randomised pivot: swap a random index with hi
    r = random.randint(lo, hi)
    xs[r], xs[hi] = xs[hi], xs[r]

    pivot = xs[hi]
    i = lo - 1
    for j in range(lo, hi):
        if xs[j] <= pivot:
            i += 1
            xs[i], xs[j] = xs[j], xs[i]
    xs[i + 1], xs[hi] = xs[hi], xs[i + 1]
    return i + 1

a = [5, 1, 4, 2, 8]
quick_sort(a)
print(a)                                # [1, 2, 4, 5, 8]

# 🔸 3-way partition (Dutch flag) handles duplicates efficiently:
def quick_sort_3way(xs: list[int], lo: int = 0, hi: int | None = None) -> None:
    if hi is None:
        hi = len(xs) - 1
    if lo >= hi:
        return
    pivot = xs[random.randint(lo, hi)]
    lt, i, gt = lo, lo, hi
    while i <= gt:
        if xs[i] < pivot:
            xs[lt], xs[i] = xs[i], xs[lt]
            lt += 1; i += 1
        elif xs[i] > pivot:
            xs[i], xs[gt] = xs[gt], xs[i]
            gt -= 1
        else:
            i += 1
    quick_sort_3way(xs, lo, lt - 1)
    quick_sort_3way(xs, gt + 1, hi)

b = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
quick_sort_3way(b)
print(b)                                # [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

# ⚠️ Quick sort is NOT stable.
# ⚠️ Sorted input + first/last pivot → O(n²). Randomise or
#    use median-of-three.
# 🧠 Python's `sorted()` does NOT use quick sort — it uses
#    Timsort. Quick sort is mostly interview-only in Python.


# ============================================================
#  8️⃣ HEAP SORT — O(n log n), IN-PLACE, NOT STABLE
# ============================================================
# 🔹 Build a max-heap, then repeatedly extract the max.
# 🔸 Guaranteed O(n log n), in-place, but not stable.
# 🎯 Used when you need guaranteed time AND O(1) extra space.

import heapq

def heap_sort(xs: list[int]) -> list[int]:
    # heapq is min-heap — negate for max-heap
    h = [-x for x in xs]
    heapq.heapify(h)
    return [-heapq.heappop(h) for _ in range(len(h))]

print(heap_sort([5, 1, 4, 2, 8]))       # [1, 2, 4, 5, 8]

# 🔸 Manual in-place version (classic interview answer):
def sift_down(xs: list[int], i: int, n: int) -> None:
    while True:
        left = 2 * i + 1
        right = 2 * i + 2
        largest = i
        if left < n and xs[left] > xs[largest]:
            largest = left
        if right < n and xs[right] > xs[largest]:
            largest = right
        if largest == i:
            return
        xs[i], xs[largest] = xs[largest], xs[i]
        i = largest

def heap_sort_inplace(xs: list[int]) -> None:
    n = len(xs)
    for i in range(n // 2 - 1, -1, -1):     # build max-heap
        sift_down(xs, i, n)
    for end in range(n - 1, 0, -1):
        xs[0], xs[end] = xs[end], xs[0]     # move max to end
        sift_down(xs, 0, end)

c = [5, 1, 4, 2, 8]
heap_sort_inplace(c)
print(c)                                # [1, 2, 4, 5, 8]

# 🧠 Heap sort guarantees O(n log n) time in O(1) space — the
#    only classic sort with that combination. Trade-off: not
#    stable, and cache performance is worse than quick sort.


# ============================================================
#  9️⃣ COUNTING / RADIX / BUCKET — LINEAR TIME
# ============================================================
# 🔹 COUNTING SORT — for integers in a known range [0, k].
#    O(n + k) time, O(k) space. Stable when done right.

def counting_sort(xs: list[int]) -> list[int]:
    if not xs:
        return []
    lo, hi = min(xs), max(xs)
    k = hi - lo + 1
    counts = [0] * k
    for x in xs:
        counts[x - lo] += 1
    # Prefix sums → positions
    for i in range(1, k):
        counts[i] += counts[i - 1]
    out = [0] * len(xs)
    # Iterate right-to-left for stability
    for x in reversed(xs):
        counts[x - lo] -= 1
        out[counts[x - lo]] = x
    return out

print(counting_sort([4, 2, 2, 8, 3, 3, 1]))
# [1, 2, 2, 3, 3, 4, 8]

# 🔹 RADIX SORT — for non-negative integers, digit by digit.
#    O(d·(n + b)) — d digits, base b. Stable at each pass.

def radix_sort(xs: list[int]) -> list[int]:
    if not xs:
        return []
    out = xs[:]
    max_val = max(out)
    exp = 1
    while max_val // exp > 0:
        out = _counting_by_digit(out, exp)
        exp *= 10
    return out

def _counting_by_digit(xs: list[int], exp: int) -> list[int]:
    counts = [0] * 10
    for x in xs:
        counts[(x // exp) % 10] += 1
    for i in range(1, 10):
        counts[i] += counts[i - 1]
    out = [0] * len(xs)
    for x in reversed(xs):
        digit = (x // exp) % 10
        counts[digit] -= 1
        out[counts[digit]] = x
    return out

print(radix_sort([170, 45, 75, 90, 802, 24, 2, 66]))
# [2, 24, 45, 66, 75, 90, 170, 802]

# 🔹 BUCKET SORT — for uniformly distributed floats.
#    Distribute into k buckets, sort each, concatenate.

def bucket_sort(xs: list[float]) -> list[float]:
    if not xs:
        return []
    n = len(xs)
    buckets: list[list[float]] = [[] for _ in range(n)]
    for x in xs:
        idx = min(int(x * n), n - 1)
        buckets[idx].append(x)
    out: list[float] = []
    for b in buckets:
        out.extend(sorted(b))
    return out

print(bucket_sort([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]))
# [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52]

# 🧠 Rule: use non-comparison sorts only when the value domain
#    is bounded / structured. Otherwise use comparison sorts.

# ⚠️ Counting sort requires integer keys in a SMALL range —
#    otherwise k blows up.
# ⚠️ Radix sort only works on integers (or fixed-width strings).
# ⚠️ Bucket sort worst case is O(n²) if all values land in one
#    bucket.


# ============================================================
#  🔟 PYTHON'S sorted() AND sort() — TIMSORT + key=
# ============================================================
# 🔹 list.sort()  → in-place, returns None.
# 🔹 sorted(xs)   → returns a new sorted list.
# 🔹 Both use TIMSORT:
#     - Detects existing runs (nearly-sorted input is O(n)).
#     - Switches to insertion sort for small runs.
#     - Merges runs efficiently.
#     - O(n log n) worst, O(n) best, STABLE.
# 🔸 key= lets you sort by a derived value.
# 🔸 reverse=True for descending.

xs = [5, 1, 4, 2, 8]
xs.sort()
print(xs)                       # [1, 2, 4, 5, 8]

ys = sorted([5, 1, 4, 2, 8])
print(ys)                       # [1, 2, 4, 5, 8]

# Sort strings by length
words = ["banana", "apple", "fig", "kiwi"]
print(sorted(words, key=len))   # ['fig', 'kiwi', 'apple', 'banana']

# Sort tuples by second element
pairs = [(1, 3), (2, 1), (3, 2)]
print(sorted(pairs, key=lambda p: p[1]))    # [(2,1), (3,2), (1,3)]

# Multi-key sort: primary ascending, secondary descending
people = [("Ravi", 30), ("Meera", 25), ("Ravi", 22)]
print(sorted(people, key=lambda t: (t[0], -t[1])))
# [('Meera', 25), ('Ravi', 30), ('Ravi', 22)]

# Sort dict by value
counts = {"a": 3, "b": 1, "c": 2}
print(sorted(counts.items(), key=lambda kv: kv[1]))
# [('b', 1), ('c', 2), ('a', 3)]

# reverse=True for descending
print(sorted([3, 1, 2], reverse=True))      # [3, 2, 1]

# 🧠 Rules:
#   - Use sort() when you own the list and don't need the original.
#   - Use sorted() when you need the original untouched.
#   - Use key= instead of cmp= (Python 3 removed cmp).
#   - For custom comparison, use functools.cmp_to_key.
#   - key functions are called EXACTLY ONCE per element.
#   - Use STABLE sort for multi-pass sorting.

# 🔸 functools.cmp_to_key for legacy comparison functions
import functools
def cmp_len(a: str, b: str) -> int:
    return len(a) - len(b)
print(sorted(words, key=functools.cmp_to_key(cmp_len)))
# ['fig', 'kiwi', 'apple', 'banana']

# ⚠️ Don't use `sorted(xs)[::-1]` for reverse — it copies twice.
#    Use `sorted(xs, reverse=True)` or `list.sort(reverse=True)`.
# ⚠️ `sort(key=lambda x: (a, b))` builds a tuple per element —
#    memory-efficient but sorting by multiple keys is a common
#    trick.
# ⚠️ Sorting floats with NaN is undefined — normalise first.


# ============================================================
#  1️⃣1️⃣ WHEN TO USE WHICH
# ============================================================
# 🔹 Small n (< ~16)                        → insertion sort
# 🔹 Nearly sorted                          → insertion / Timsort
# 🔹 General purpose, need stable           → merge / Timsort
# 🔹 General purpose, in-place, fast        → quick sort
# 🔹 Need guaranteed O(n log n) + O(1) space → heap sort
# 🔹 Integers in a small range              → counting sort
# 🔹 Integers with many digits              → radix sort
# 🔹 Uniform floats                         → bucket sort
# 🔹 Python code (99% of the time)          → sorted() / list.sort()

# 🧠 Default to Python's Timsort. Roll your own only when
#    interview asks or when the input has special structure.


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ list.sort() returns None — assigning is a common bug.
# ⚠️ sorted(xs)[::-1] copies twice — use reverse=True.
# ⚠️ Comparing mixed types (int + str) raises TypeError.
# ⚠️ Quick sort pivot choice matters — always randomise.
# ⚠️ Quick sort is not stable — if you need stability, use
#    merge sort or add index tie-breakers.
# ⚠️ Merge sort uses O(n) extra space — avoid in memory-limited
#    contexts, or use a linked-list variant.
# ⚠️ Counting sort blows up if k (range) is huge.
# ⚠️ Radix sort only works on non-negative integers by default —
#    handle negatives by sign split or offset.
# ⚠️ Bucket sort worst case is O(n²) if distribution is skewed.
# ⚠️ Timsort is stable but not in-place — O(n) extra space.
# ⚠️ Sorting strings is lexicographic by code point:
print(sorted(["banana", "Apple", "cherry"]))
# ['Apple', 'banana', 'cherry']
# ⚠️ For case-insensitive sort, use key=str.lower.
# ⚠️ Sorting None values requires a key= that handles them.
# ⚠️ heapq-based sorting is min-heap — negate for descending.

# 🕒 Version notes
# - Timsort (Python's built-in sort): Python 2.3+
# - `key=` argument (replacing cmp): Python 2.4+ for sorted(),
#   3.0+ removed cmp entirely
# - functools.cmp_to_key: Python 2.7+ / 3.2+
# - `sorted` and `list.sort` fully stable: always in Python 3
# - heapq.merge for multiple sorted iterables: Python 3.5+
# - `math.isqrt` for bucket-boundary clean-up: 3.8+
# - `int.bit_length` (radix bit-counting): always
# - Python 3.11+ has faster sorted() due to interpreter
#   improvements, but the algorithm is still Timsort


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Algorithm      │ Best       │ Avg        │ Worst      │ Stable │
# ─────────────────────────────────────────────────────────────
# | Bubble         │ O(n)       │ O(n²)      │ O(n²)      │ Yes    |
# | Selection      │ O(n²)      │ O(n²)      │ O(n²)      │ No     |
# | Insertion      │ O(n)       │ O(n²)      │ O(n²)      │ Yes    |
# | Merge          │ O(n log n) │ O(n log n) │ O(n log n) │ Yes    |
# | Quick          │ O(n log n) │ O(n log n) │ O(n²)      │ No     |
# | Heap           │ O(n log n) │ O(n log n) │ O(n log n) │ No     |
# | Counting       │ O(n + k)   │ O(n + k)   │ O(n + k)   │ Yes    |
# | Radix          │ O(d(n+b))  │ O(d(n+b))  │ O(d(n+b))  │ Yes    |
# | Bucket         │ O(n + k)   │ O(n + k)   │ O(n²)      │ Yes    |
# | Timsort        │ O(n)       │ O(n log n) │ O(n log n) │ Yes    |
# ─────────────────────────────────────────────────────────────
# | Use case                   │ Best choice                   |
# ─────────────────────────────────────────────────────────────
# | General purpose, Python    │ sorted() / list.sort()        |
# | Guaranteed O(n log n)      │ merge sort, heap sort         |
# | In-place, fast average     │ quick sort                    |
# | Stability required         │ merge sort, Timsort           |
# | Small / nearly sorted      │ insertion sort                |
# | Integers in small range    │ counting sort                 |
# | Fixed-width integers       │ radix sort                    |
# | Uniform floats             │ bucket sort                   |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | sort() assigned            │ Returns None                   |
# | sorted(xs)[::-1]           │ Copies twice                   |
# | Mixed-type sort            │ TypeError (Py3)                |
# | Quick sort worst case      │ O(n²) on sorted input          |
# | Merge sort memory          │ O(n) extra                     |
# | Counting sort huge range   │ k memory blowup                |
# | Radix with negatives       │ Breaks without sign split      |
# | Bucket skew                │ Degrades to O(n²)              |
# | Case-sensitive string sort │ Uppercase before lowercase     |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - In Python: use sorted() / list.sort() — Timsort is excellent.
#  - Know the four key properties: time, space, stable, in-place.
#  - Merge sort = stable + guaranteed; quick sort = fast average.
#  - Quick sort: RANDOMISE the pivot to avoid O(n²).
#  - Counting / radix / bucket are for structured inputs only.
#  - Insertion sort is the go-to for tiny arrays (< 16).
#  - Use key= instead of cmp_to_key; key is called once per item.
#  - Multi-key sort: return a tuple from key=, negate numbers
#    for descending on a per-key basis.
#  - For case-insensitive: key=str.lower (or casefold).
#  - Use reverse=True instead of reversing after sorting.
#  - Test with: empty, single element, all equal, sorted input,
#    reversed input, duplicates, and large n.
#  - Interview expectation: implement merge + quick confidently,
#    discuss trade-offs.
# ============================================================