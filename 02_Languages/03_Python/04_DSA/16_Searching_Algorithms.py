# 16_Searching_Algorithms.py

# ============================================================
#  📘 SEARCHING ALGORITHMS IN PYTHON — COMPLETE COVERAGE
#
#  Searching = finding a target within a collection. The right
#  algorithm depends entirely on whether the data is SORTED.
#  Linear search is O(n) on anything; binary search is O(log n)
#  but requires sorted input. This file covers both plus the
#  variations that come up in interviews: lower/upper bound,
#  rotated arrays, peak finding, first/last occurrence, and the
#  binary-search-on-answer technique.
#
#  Sections:
#   1. Linear search — O(n)
#   2. Binary search — iterative
#   3. Binary search — recursive
#   4. Bisect module (Python's built-in)
#   5. Lower bound / upper bound (first/last occurrence)
#   6. Search in a rotated sorted array
#   7. Find peak element
#   8. Binary search on the ANSWER
#   9. Comparison and decision guide
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ LINEAR SEARCH — O(n)
# ============================================================
# 🔹 Scan the whole collection until you find the target.
# 🔸 Works on unsorted data.
# 🎯 Only correct choice when data is unsorted AND you search
#    just once (multiple searches → sort first).

def linear_search(xs: list[int], target: int) -> int:
    for i, x in enumerate(xs):
        if x == target:
            return i
    return -1

print(linear_search([5, 1, 4, 2, 8], 4))     # 2
print(linear_search([5, 1, 4, 2, 8], 99))    # -1

# 🧠 Linear search is fine when:
#    - Data is small (n < ~50).
#    - You search ONCE and sorting is more expensive.
#    - Data changes constantly (sorting each time is O(n log n)).
#    Otherwise, sort once, then use binary search many times.

# 🔸 Python-native alternatives
xs = [5, 1, 4, 2, 8]
print(4 in xs)                  # True  → O(n)
print(xs.index(4))              # 2     → O(n)
# `in` and `.index()` are both linear — same complexity as above.


# ============================================================
#  2️⃣ BINARY SEARCH — ITERATIVE
# ============================================================
# 🔹 Requires SORTED input.
# 🔸 Halve the search space each iteration → O(log n).
# 🎯 Know this by heart — it's the most-asked search algorithm.

def binary_search(xs: list[int], target: int) -> int:
    lo, hi = 0, len(xs) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2       # avoid overflow in other langs
        if xs[mid] == target:
            return mid
        if xs[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

xs = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(xs, 7))         # 3
print(binary_search(xs, 1))         # 0
print(binary_search(xs, 13))        # 6
print(binary_search(xs, 4))         # -1

# ⚠️ Classic infinite loop bug: `lo = mid` or `hi = mid` without
#    ±1. ALWAYS move past mid.
# ⚠️ Loop condition: `lo <= hi` (inclusive). Some variants use
#    `lo < hi` with a different invariant — pick one style and
#    stick with it.
# 🧠 `mid = (lo + hi) // 2` is fine in Python (no overflow), but
#    `lo + (hi - lo) // 2` is the portable form.


# ============================================================
#  3️⃣ BINARY SEARCH — RECURSIVE
# ============================================================
# 🔹 Same idea, expressed with recursion.
# 🔸 O(log n) time, O(log n) stack space.

def binary_search_rec(xs: list[int], target: int) -> int:
    def go(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if xs[mid] == target:
            return mid
        if xs[mid] < target:
            return go(mid + 1, hi)
        return go(lo, mid - 1)
    return go(0, len(xs) - 1)

print(binary_search_rec(xs, 11))     # 5
print(binary_search_rec(xs, 4))      # -1

# ⚠️ Recursive version is rarely needed — iterative avoids
#    stack depth issues.
# 🧠 Use recursion only if the problem is naturally recursive
#    (divide & conquer variants).


# ============================================================
#  4️⃣ BISECT MODULE (PYTHON'S BUILT-IN)
# ============================================================
# 🔹 `bisect` gives you binary search in C — prefer it.
# 🔸 bisect_left  : leftmost insertion index
# 🔸 bisect_right : rightmost insertion index
# 🔸 insort_left / insort_right : insert maintaining order.

import bisect

xs = [1, 3, 5, 7, 9, 11, 13]

# Where would 7 go?
print(bisect.bisect_left(xs, 7))    # 3  (index of the 7)
print(bisect.bisect_right(xs, 7))   # 4  (just after the 7)

# For non-present values:
print(bisect.bisect_left(xs, 4))    # 2
print(bisect.bisect_right(xs, 4))   # 2

# Membership check with bisect:
def contains(xs: list[int], target: int) -> bool:
    i = bisect.bisect_left(xs, target)
    return i < len(xs) and xs[i] == target

print(contains(xs, 7))              # True
print(contains(xs, 4))              # False

# Insert maintaining sorted order (O(n) due to list shift, but
# O(log n) search + O(n) copy)
ys = [1, 3, 5, 7]
bisect.insort(ys, 4)
print(ys)                           # [1, 3, 4, 5, 7]

# 🧠 Rule: use bisect instead of writing binary search — it's
#    faster (C), well-tested, and has clean semantics.
# ⚠️ insort is O(n) due to list shifting — it's not for tight
#    loops unless n is small.


# ============================================================
#  5️⃣ LOWER BOUND / UPPER BOUND (FIRST/LAST OCCURRENCE)
# ============================================================
# 🔹 LOWER BOUND: first index where xs[i] >= target.
# 🔹 UPPER BOUND: first index where xs[i] > target.
# 🔸 Works even when target isn't present.
# 🎯 Foundation for "first occurrence", "last occurrence",
#    "count occurrences", "insert position".

def lower_bound(xs: list[int], target: int) -> int:
    lo, hi = 0, len(xs)               # NOTE: hi = len(xs), not len-1
    while lo < hi:
        mid = (lo + hi) // 2
        if xs[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

def upper_bound(xs: list[int], target: int) -> int:
    lo, hi = 0, len(xs)
    while lo < hi:
        mid = (lo + hi) // 2
        if xs[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo

xs = [1, 2, 2, 2, 3, 4, 5]
print(lower_bound(xs, 2))           # 1  (first 2)
print(upper_bound(xs, 2))           # 4  (one past last 2)

def count_occurrences(xs: list[int], target: int) -> int:
    return upper_bound(xs, target) - lower_bound(xs, target)

print(count_occurrences(xs, 2))     # 3

def first_occurrence(xs: list[int], target: int) -> int:
    i = lower_bound(xs, target)
    return i if i < len(xs) and xs[i] == target else -1

def last_occurrence(xs: list[int], target: int) -> int:
    i = upper_bound(xs, target) - 1
    return i if i >= 0 and xs[i] == target else -1

print(first_occurrence(xs, 2))      # 1
print(last_occurrence(xs, 2))       # 3

# 🧠 The KEY difference vs binary_search:
#    - These use `lo < hi` (not `lo <= hi`).
#    - `hi = len(xs)` (not len-1).
#    - Never return early — shrink to find the boundary.
# 🔸 bisect_left == lower_bound, bisect_right == upper_bound.

# ✅ Same via bisect
print(bisect.bisect_left(xs, 2))    # 1
print(bisect.bisect_right(xs, 2))   # 4


# ============================================================
#  6️⃣ SEARCH IN A ROTATED SORTED ARRAY
# ============================================================
# 🔹 Array was sorted, then rotated at some pivot.
# 🔸 Still do binary search — decide which half is sorted.

def search_rotated(xs: list[int], target: int) -> int:
    lo, hi = 0, len(xs) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if xs[mid] == target:
            return mid
        # Left half is sorted
        if xs[lo] <= xs[mid]:
            if xs[lo] <= target < xs[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            # Right half is sorted
            if xs[mid] < target <= xs[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

rotated = [4, 5, 6, 7, 0, 1, 2]
print(search_rotated(rotated, 0))   # 4
print(search_rotated(rotated, 4))   # 0
print(search_rotated(rotated, 3))   # -1

# 🔸 Find minimum in a rotated sorted array
def find_min_rotated(xs: list[int]) -> int:
    lo, hi = 0, len(xs) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if xs[mid] > xs[hi]:
            lo = mid + 1
        else:
            hi = mid
    return xs[lo]

print(find_min_rotated(rotated))    # 0

# 🧠 Pattern: at every step, at least one side is sorted.
#    Decide which, then check if target lies in that range.


# ============================================================
#  7️⃣ FIND PEAK ELEMENT
# ============================================================
# 🔹 Peak = element greater than both neighbours.
# 🔸 Binary search on the slope: move toward the higher neighbour.
# 🎯 O(log n) — much better than scanning.

def find_peak(xs: list[int]) -> int:
    lo, hi = 0, len(xs) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if xs[mid] < xs[mid + 1]:
            lo = mid + 1                # rising → peak on right
        else:
            hi = mid                    # falling → peak on left
    return lo

print(find_peak([1, 2, 3, 1]))      # 2  (value 3)
print(find_peak([1, 2, 1, 3, 5, 6, 4]))     # 5  (value 6)
print(find_peak([1]))               # 0

# 🧠 Binary search isn't only for sorted arrays — it works
#    whenever you can discard HALF the space based on a
#    monotonic property.


# ============================================================
#  8️⃣ BINARY SEARCH ON THE ANSWER
# ============================================================
# 🔹 Search over the RANGE OF ANSWERS, not the input array.
# 🔸 Requires a monotonic predicate: "is_answer(x) is True for
#    all x >= threshold?" (or ≤).
# 🎯 Classic: "minimum capacity to ship in D days", "koko
#    eating bananas", "split array largest sum".

def min_capacity(weights: list[int], days: int) -> int:
    """Minimum daily capacity to ship all weights in `days` days."""
    def feasible(cap: int) -> bool:
        d = 1
        cur = 0
        for w in weights:
            if cur + w > cap:
                d += 1
                cur = 0
            cur += w
        return d <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo

print(min_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))  # 15
print(min_capacity([3, 2, 2, 4, 1, 4], 3))                # 6

# 🔸 Predicate must be MONOTONIC:
#    "if cap X works, cap X+1 also works" → search for smallest
#    X that works.

def koko_speed(piles: list[int], h: int) -> int:
    """Koko eating bananas — minimum speed to finish in h hours."""
    import math
    def can(speed: int) -> bool:
        return sum(math.ceil(p / speed) for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo

print(koko_speed([3, 6, 7, 11], 8))     # 4

# 🧠 Rule: when the problem says "minimise the maximum" or
#    "maximise the minimum", think binary search on the answer.
# 🔸 Range is usually [lower_bound, upper_bound] derived from
#    the input.
# 🔸 Predicate is O(n) typically → total O(n log(range)).


# ============================================================
#  9️⃣ COMPARISON AND DECISION GUIDE
# ============================================================
# 🔹 Linear search   : unsorted OR n small OR one-off query.
# 🔹 Binary search    : sorted + many queries.
# 🔹 Bisect module    : same, but C-speed + clean API.
# 🔹 Lower/upper bound: first/last occurrence, insert position.
# 🔹 Rotated search   : sorted then rotated.
# 🔹 Peak finding     : monotonic slope property.
# 🔹 BS on answer     : monotonic predicate over a numeric range.

# ── Complexity table ─────────────────────────────────────────
# | Algorithm              │ Pre-req        │ Time    │ Space   |
# |------------------------|----------------|---------|---------|
# | Linear search          │ none           │ O(n)    │ O(1)    |
# | Binary search          │ sorted         │ O(log n)│ O(1)    |
# | Bisect                 │ sorted         │ O(log n)│ O(1)    |
# | Lower/upper bound      │ sorted         │ O(log n)│ O(1)    |
# | Rotated search         │ rotated-sorted │ O(log n)│ O(1)    |
# | Peak finding           │ unimodal       │ O(log n)│ O(1)    |
# | BS on answer           │ monotonic pred │ O(log R) * cost(pred) | O(1) |
# ─────────────────────────────────────────────────────────────

# 🧠 Decision flow:
#    1. Is data sorted?          → binary search family.
#    2. Sorted but rotated?      → rotated binary search.
#    3. Multiple queries?        → sort once + binary search.
#    4. Searching over a range?  → BS on answer.
#    5. Otherwise                 → linear scan.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Binary search MUST run on sorted data — otherwise garbage.
# ⚠️ Infinite loop: `lo = mid` or `hi = mid` without ±1.
# ⚠️ Off-by-one: decide on `lo <= hi` vs `lo < hi` up front.
#    Two safe templates:
#      a) `lo <= hi`, hi = len-1, return mid on match.
#      b) `lo < hi`,  hi = len,   no early return.
# ⚠️ Integer overflow in C/Java: use lo + (hi - lo) // 2. In
#    Python it's fine, but write it the safe way anyway.
# ⚠️ Empty list → binary_search returns -1; lower_bound returns 0.
# ⚠️ Duplicates: plain binary_search returns "some" index, not
#    the FIRST or LAST. Use lower_bound / upper_bound.
# ⚠️ Rotated array with duplicates: search_rotated above assumes
#    unique values. With duplicates, worst case becomes O(n).
# ⚠️ BS on answer requires a MONOTONIC predicate. If it's not
#    monotonic, BS is wrong.
# ⚠️ bisect_left vs bisect_right: left = first insertion point,
#    right = last. Choose based on which side of equal elements
#    you want.
# ⚠️ Bisect requires the list to be SORTED — silently wrong
#    otherwise.
# ⚠️ `xs.index(x)` is O(n) — don't use it thinking it's a
#    binary search.
# ⚠️ For strings: use `bisect` on a list of sorted strings — it
#    works because strings are comparable.
# ⚠️ For objects: define __lt__ or use key= (via functools.
#    cmp_to_key, or sort by a derived list).
# ⚠️ Matrix search: "row-sorted and column-sorted" can be done
#    in O(m + n) from a corner, not O(log). Only "fully sorted
#    flattened" matrix supports true binary search.

# 🕒 Version notes
# - bisect module: Python 2.2+
# - bisect.insort_left / insort_right: Python 2.3+
# - bisect works on any sequence supporting __getitem__: always
# - `math.ceil` for BS on answer predicates: Python 3.0+
# - `statistics.median_low/high`: Python 3.4+ (rarely relevant)
# - Python 3.10+ has `bisect` in CPython with minor perf
#   improvements
# - `sortedcontainers` (3rd-party) gives O(log n) sorted lists


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Algorithm              │ Pre-req        │ Complexity       |
# ─────────────────────────────────────────────────────────────
# | Linear search          │ unsorted       │ O(n) time, O(1)  |
# | Binary search (iter)   │ sorted         │ O(log n), O(1)   |
# | Binary search (rec)    │ sorted         │ O(log n), O(log n)|
# | bisect_left/right      │ sorted         │ O(log n), O(1)   |
# | lower_bound / upper    │ sorted         │ O(log n), O(1)   |
# | First/last occurrence  │ sorted         │ O(log n), O(1)   |
# | Count occurrences      │ sorted         │ O(log n), O(1)   |
# | Rotated search         │ rotated        │ O(log n), O(1)   |
# | Find peak              │ unimodal       │ O(log n), O(1)   |
# | BS on answer           │ monotonic      │ O(log R * pred)  |
# ─────────────────────────────────────────────────────────────
# | Python tools        │ Use for                                 |
# ─────────────────────────────────────────────────────────────
# | x in xs             │ O(n) membership (list)                  |
# | set / dict          │ O(1) membership                         |
# | xs.index(x)         │ O(n) first index                        |
# | bisect.bisect_left  │ First insertion point (lower bound)     |
# | bisect.bisect_right │ Last insertion point (upper bound)      |
# | bisect.insort       │ Insert + keep sorted (O(n) shift)       |
# ─────────────────────────────────────────────────────────────
# | Template                     │ When to use                    |
# ─────────────────────────────────────────────────────────────
# | lo=0, hi=len-1, lo<=hi       │ Simple search; return on match |
# | lo=0, hi=len,   lo<hi        │ First/last boundary problems   |
# | lo=0, hi=len-1, lo<hi        │ Find peak / min / max          |
# | lo=min, hi=max, lo<hi        │ BS on numeric answer range     |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                    |
# ─────────────────────────────────────────────────────────────
# | lo=mid or hi=mid without ±1│ Infinite loop                  |
# | Unsorted input to BS       │ Silent wrong answer             |
# | Plain BS for first/last    │ Any occurrence, not the one     |
# | Duplicates in rotated array│ O(n) worst case                 |
# | Non-monotonic predicate    │ BS on answer gives garbage      |
# | xs.index vs binary search  │ O(n) vs O(log n)                |
# | Bisect on unsorted list    │ Wrong index, no error           |
# | Empty list edge            │ Return -1 vs 0 — be explicit    |
# | Matrix corner search vs BS │ Different complexity            |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use Python's `bisect` module — don't hand-roll binary search.
#  - Memorise the two safe templates: `lo<=hi` and `lo<hi`.
#  - Always compute `mid = lo + (hi - lo) // 2` (portable).
#  - For first/last occurrence, use lower/upper bound, not
#    plain binary search.
#  - Rotated array: check which half is sorted before branching.
#  - "Peak" and "min in rotated array" use the slope trick with
#    `lo < hi`.
#  - Recognise "minimise maximum" / "maximise minimum" → binary
#    search on the answer.
#  - Predicate in BS-on-answer MUST be monotonic.
#  - Sort once, search many times — O(n log n + q log n).
#  - For membership in unsorted data, use a set / dict for O(1).
#  - Test with: empty, single element, all-equal, target at
#    ends, duplicates, and rotated pivots at both edges.
# ============================================================