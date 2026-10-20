# 11_Heaps_and_Priority_Queues.py

# ============================================================
#  📘 HEAPS & PRIORITY QUEUES IN PYTHON — COMPLETE COVERAGE
#
#  A HEAP is a complete binary tree stored in an array where each
#  parent is ≤ (min-heap) or ≥ (max-heap) its children. Heaps give
#  O(1) peek at the extremum and O(log n) push/pop. Python's
#  `heapq` module implements a MIN-HEAP over a plain list.
#
#  A PRIORITY QUEUE is the abstract data type; a heap is its
#  standard implementation. Heaps power Dijkstra, A*, k-smallest,
#  streaming median, task schedulers, and top-k problems.
#
#  Sections:
#   1. What a heap is
#   2. heapq API — the essentials
#   3. Build-heap in O(n)
#   4. Max-heap via negation
#   5. Heap of tuples (priority, value)
#   6. Heapify vs push-loop
#   7. heappushpop and heapreplace
#   8. nlargest / nsmallest
#   9. Classic patterns (k-smallest, streaming median, k-way merge)
#  10. Manual heap from scratch (for interviews)
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A HEAP IS
# ============================================================
# 🔹 Complete binary tree: filled left to right, no gaps.
# 🔸 Array layout:
#     parent(i)  = (i - 1) // 2
#     left(i)    = 2*i + 1
#     right(i)   = 2*i + 2
# 🔹 Min-heap: every parent ≤ its children → root is the min.
# 🔹 Max-heap: every parent ≥ its children → root is the max.
# 🎯 Heaps trade sorted order for fast extremum access.

# ── Complexity ───────────────────────────────────────────────
# | Operation          │ Cost        │ Notes                   |
# |--------------------|-------------|-------------------------|
# | peek (min)         │ O(1)        │ heap[0]                 |
# | push (heappush)    │ O(log n)    │ sift up                 |
# | pop (heappop)      │ O(log n)    │ sift down               |
# | push+pop combined  │ O(log n)    │ heappushpop             |
# | pop+push combined  │ O(log n)    │ heapreplace             |
# | build heap (heapify)│ O(n)       │ bottom-up sift          |
# | search arbitrary   │ O(n)        │ heap is not a search tree |
# | delete arbitrary   │ O(n) + O(log n) | find then sift      |


# ============================================================
#  2️⃣ heapq API — THE ESSENTIALS
# ============================================================
# 🔹 Always import heapq — it works on plain lists.
# 🔸 ALL functions operate on a list that must satisfy the
#    heap invariant.

import heapq

h: list[int] = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
heapq.heappush(h, 2)

print(h[0])                 # 1  (peek = root)
print(heapq.heappop(h))     # 1
print(heapq.heappop(h))     # 2
print(heapq.heappop(h))     # 3
print(h)                    # [5]

# ✅ Combine
heapq.heappush(h, 10)
heapq.heappush(h, 4)
print(heapq.heappop(h))     # 4
print(h)                    # [5, 10]


# ============================================================
#  3️⃣ BUILD-HEAP IN O(n)
# ============================================================
# 🔹 heapq.heapify(list) turns an arbitrary list into a heap.
# 🔸 O(n) time (bottom-up sift-down), much faster than n pushes.

xs = [9, 4, 7, 1, 8, 2, 6]
heapq.heapify(xs)
print(xs[0])                # 1
print([heapq.heappop(xs) for _ in range(len(xs))])
# [1, 2, 4, 6, 7, 8, 9]

# ⚠️ heapify mutates the list in place; returns None.
# 🧠 Use heapify when you have all the data upfront. Use pushes
#    when data arrives incrementally.


# ============================================================
#  4️⃣ MAX-HEAP VIA NEGATION
# ============================================================
# 🔹 heapq is min-only. Negate values to get a max-heap.
# 🔸 Pop then negate to recover the value.

max_h: list[int] = []
for x in [5, 1, 3, 2]:
    heapq.heappush(max_h, -x)

print(-heapq.heappop(max_h))    # 5
print(-heapq.heappop(max_h))    # 3
print(-heapq.heappop(max_h))    # 2
print(-heapq.heappop(max_h))    # 1

# 🔸 Wrapper class for readability
class MaxHeap:
    def __init__(self, xs: list[int] | None = None) -> None:
        self._h = [-x for x in (xs or [])]
        heapq.heapify(self._h)

    def push(self, x: int) -> None:
        heapq.heappush(self._h, -x)

    def pop(self) -> int:
        return -heapq.heappop(self._h)

    def peek(self) -> int:
        return -self._h[0]

    def __len__(self) -> int:
        return len(self._h)

mh = MaxHeap([3, 1, 4, 1, 5, 9, 2])
print(mh.peek())            # 9
print(mh.pop())             # 9
print(mh.pop())             # 5

# ⚠️ With floating-point, watch -0.0 != 0.0 edge cases (rare).


# ============================================================
#  5️⃣ HEAP OF TUPLES (PRIORITY, VALUE)
# ============================================================
# 🔹 Tuples compare lexicographically: first by priority, then by
#    value. Great for task queues.
# 🔸 If values are not comparable, insert a tie-breaker index.

tasks: list[tuple[int, str]] = []
heapq.heappush(tasks, (2, "write report"))
heapq.heappush(tasks, (1, "fix bug"))
heapq.heappush(tasks, (3, "code review"))

while tasks:
    print(heapq.heappop(tasks))
# (1, 'fix bug')
# (2, 'write report')
# (3, 'code review')

# 🔸 Tie-breaker when values aren't comparable
counter = 0
h2: list[tuple[int, int, str]] = []
for priority, item in [(1, "b"), (1, "a"), (2, "c")]:
    heapq.heappush(h2, (priority, counter, item))
    counter += 1

while h2:
    _, _, item = heapq.heappop(h2)
    print(item)
# b
# a
# c

# 🧠 The counter also gives FIFO for equal priorities — a very
#    handy idiom for schedulers and Dijkstra with ties.


# ============================================================
#  6️⃣ HEAPIFY VS PUSH-LOOP
# ============================================================
# 🔹 Building by heapify: O(n).
# 🔹 Building by repeated heappush: O(n log n).
# 🎯 Prefer heapify when you already have the full list.

import timeit

data = list(range(1_000, 0, -1))        # descending — worst-case for pushes

t_heapify = timeit.timeit(lambda: heapq.heapify(data.copy()), number=100)
t_pushloop = timeit.timeit(
    lambda: [heapq.heappush(h, x) for x in data for h in [data.copy()]],
    number=100,
)

# 🔎 Typical result: heapify is 3–5x faster.

# 🧠 Rule: if you have all elements → heapify. If they stream
#    in → heappush each.


# ============================================================
#  7️⃣ heappushpop AND heapreplace
# ============================================================
# 🔹 heappushpop(h, x): push x then pop smallest — BUT faster
#    than doing both separately. Also avoids growing heap when
#    x is the new smallest.
# 🔹 heapreplace(h, x): pop smallest then push x — h must be
#    non-empty.

h = [1, 3, 5]
print(heapq.heappushpop(h, 2))      # 1  (2 pushed, 1 popped)
print(h)                            # [2, 3, 5]

h = [2, 3, 5]
print(heapq.heapreplace(h, 10))     # 2  (2 popped, 10 pushed)
print(h)                            # [3, 5, 10]

# 🎯 Sliding window maximum via heap: heappushpop keeps size
#    fixed.

# ⚠️ heapreplace on empty raises IndexError.
# ⚠️ heappushpop returns the SMALLEST element after push (which
#    may be the pushed value itself).


# ============================================================
#  8️⃣ nlargest / nsmallest
# ============================================================
# 🔹 Extract the k largest/smallest WITHOUT sorting the whole list.
# 🔸 O(n log k) when k << n.

xs = [9, 1, 8, 2, 7, 3, 6, 4, 5]
print(heapq.nlargest(3, xs))        # [9, 8, 7]
print(heapq.nsmallest(3, xs))       # [1, 2, 3]

# 🔸 With a key function (e.g., top-3 by length)
words = ["cat", "elephant", "dog", "hippopotamus", "ox"]
print(heapq.nlargest(2, words, key=len))
# ['hippopotamus', 'elephant']

# 🧠 nlargest/nsmallest beats sorted(xs)[:k] for small k.
#    For k ≈ n, sorted is faster.


# ============================================================
#  9️⃣ CLASSIC PATTERNS
# ============================================================
# 🔹 K-SMALLEST — keep a max-heap of size k
def k_smallest(xs: list[int], k: int) -> list[int]:
    if k <= 0:
        return []
    h: list[int] = []
    for x in xs:
        heapq.heappush(h, -x)
        if len(h) > k:
            heapq.heappop(h)            # remove largest of kept
    return [-x for x in h]

print(sorted(k_smallest([5, 1, 4, 2, 3, 9, 7], 3)))    # [1, 2, 3]

# 🔹 K-LARGEST — keep a min-heap of size k
def k_largest(xs: list[int], k: int) -> list[int]:
    if k <= 0:
        return []
    h: list[int] = []
    for x in xs:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h

print(sorted(k_largest([5, 1, 4, 2, 3, 9, 7], 3)))     # [5, 7, 9]

# 🔹 STREAMING MEDIAN — two heaps: max-heap for lows, min-heap for highs.
class MedianFinder:
    def __init__(self) -> None:
        self._low: list[int] = []       # max-heap (negated)
        self._high: list[int] = []      # min-heap

    def add(self, x: int) -> None:
        heapq.heappush(self._low, -x)
        # Move the largest of lows to highs
        heapq.heappush(self._high, -heapq.heappop(self._low))
        # Rebalance
        if len(self._high) > len(self._low):
            heapq.heappush(self._low, -heapq.heappop(self._high))

    def median(self) -> float:
        if len(self._low) > len(self._high):
            return -self._low[0]
        return (-self._low[0] + self._high[0]) / 2

mf = MedianFinder()
for x in [1, 5, 3, 2, 4]:
    mf.add(x)
    print(x, "→ median", mf.median())
# 1 → 1.0
# 5 → 3.0
# 3 → 3.0
# 2 → 2.5
# 4 → 3.0

# 🔹 K-WAY MERGE — merge k sorted lists
def merge_k_sorted(lists: list[list[int]]) -> list[int]:
    h: list[tuple[int, int, int]] = []  # (value, list index, pos)
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(h, (lst[0], i, 0))
    out: list[int] = []
    while h:
        val, i, pos = heapq.heappop(h)
        out.append(val)
        if pos + 1 < len(lists[i]):
            heapq.heappush(h, (lists[i][pos + 1], i, pos + 1))
    return out

print(merge_k_sorted([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 🧠 Pattern: "top k" → fixed-size heap. "Streaming" → two
#    heaps. "K sorted inputs" → k-way merge.

# 🔹 DIJKSTRA PREVIEW — heap of (distance, node)
# (Full treatment in file 23.)
def dijkstra_preview(graph: dict[str, dict[str, int]], src: str) -> dict[str, int]:
    dist: dict[str, int] = {src: 0}
    h: list[tuple[int, str]] = [(0, src)]
    while h:
        d, u = heapq.heappop(h)
        if d > dist.get(u, float("inf")):
            continue                    # stale entry
        for v, w in graph.get(u, {}).items():
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(h, (nd, v))
    return dist

graph = {
    "A": {"B": 1, "C": 4},
    "B": {"C": 2, "D": 5},
    "C": {"D": 1},
    "D": {},
}
print(dijkstra_preview(graph, "A"))     # {'A': 0, 'B': 1, 'C': 3, 'D': 4}


# ============================================================
#  🔟 MANUAL HEAP FROM SCRATCH (FOR INTERVIEWS)
# ============================================================
# 🔹 Interviewers sometimes want "implement a min-heap".
# 🔸 Standard: array + sift_up (push) + sift_down (pop).

class MinHeap:
    def __init__(self) -> None:
        self._h: list[int] = []

    def push(self, x: int) -> None:
        self._h.append(x)
        self._sift_up(len(self._h) - 1)

    def pop(self) -> int:
        if not self._h:
            raise IndexError("pop from empty heap")
        top = self._h[0]
        last = self._h.pop()
        if self._h:
            self._h[0] = last
            self._sift_down(0)
        return top

    def peek(self) -> int:
        if not self._h:
            raise IndexError("peek from empty heap")
        return self._h[0]

    def _sift_up(self, i: int) -> None:
        while i > 0:
            parent = (i - 1) // 2
            if self._h[parent] <= self._h[i]:
                break
            self._h[parent], self._h[i] = self._h[i], self._h[parent]
            i = parent

    def _sift_down(self, i: int) -> None:
        n = len(self._h)
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            smallest = i
            if left < n and self._h[left] < self._h[smallest]:
                smallest = left
            if right < n and self._h[right] < self._h[smallest]:
                smallest = right
            if smallest == i:
                break
            self._h[i], self._h[smallest] = self._h[smallest], self._h[i]
            i = smallest

    def __len__(self) -> int:
        return len(self._h)

    def __repr__(self) -> str:
        return f"MinHeap({self._h})"

mh = MinHeap()
for x in [5, 3, 8, 1, 4]:
    mh.push(x)
print(mh)                                   # MinHeap([1, 3, 8, 5, 4])
print(mh.pop())                             # 1
print(mh.pop())                             # 3
print(mh)                                   # MinHeap([4, 5, 8])

# 🧠 _sift_up  → used after append
#    _sift_down → used after removing root


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ heapq is MIN-only. Negate for max-heap (careful with 0).
# ⚠️ heappop on empty raises IndexError — guard.
# ⚠️ heapreplace on empty raises IndexError — guard.
# ⚠️ Modifying heap[i] directly breaks the invariant — use the API.
# ⚠️ Heap is NOT sorted. Iterating gives no order.
# ⚠️ Searching for arbitrary element is O(n) — heaps are not
#    search trees.
# ⚠️ Tuples: uncomparable values cause TypeError; add a counter.
# ⚠️ Deleting by value: linear search + sift — O(n). Rare.
# ⚠️ heapify mutates the list in place and returns None.
# ⚠️ nlargest/nsmallest: if k is close to n, sorted() is faster.
# ⚠️ Dijkstra stale entries: check `if d > dist[u]: continue`.
# ⚠️ Don't build a heap by pushing one item at a time if you
#    already have the list — heapify is O(n).
# ⚠️ heapq is not thread-safe; use queue.PriorityQueue for threads.
# ⚠️ Priority queue with custom comparison: use a wrapper class
#    with __lt__, or tuples with a counter.

# 🕒 Version notes
# - heapq module: Python 2.3+
# - heapq.heapify: Python 2.3+
# - heapq.nlargest / nsmallest: Python 2.4+
# - heapq.merge for k sorted iterables: Python 3.5+
# - queue.PriorityQueue: always available (thread-safe)
# - No built-in max-heap — always negate or wrap
# - For performance-critical priority queues, consider 3rd-party
#   libs or C-backed `heapq` (already C in CPython)
# - `math.inf` as sentinel for Dijkstra: Python 3.5+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation               │ Cost       │ Function          |
# ─────────────────────────────────────────────────────────────
# | Build from list         │ O(n)       │ heapq.heapify     |
# | Push                    │ O(log n)   │ heapq.heappush    |
# | Pop min                 │ O(log n)   │ heapq.heappop     |
# | Peek min                │ O(1)       │ h[0]              |
# | Push + pop              │ O(log n)   │ heapq.heappushpop |
# | Pop + push              │ O(log n)   │ heapq.heapreplace |
# | k largest               │ O(n log k) │ heapq.nlargest    |
# | k smallest              │ O(n log k) │ heapq.nsmallest   |
# | Merge k sorted          │ O(n log k) │ heapq.merge / manual |
# | Arbitrary search        │ O(n)       │ —                 |
# ─────────────────────────────────────────────────────────────
# | Pattern              │ Technique                            |
# ─────────────────────────────────────────────────────────────
# | Top-k smallest       │ max-heap of size k (negate)          |
# | Top-k largest        │ min-heap of size k                   |
# | Streaming median     │ two heaps (max + min)                |
# | K-way merge          │ heap of (value, list, pos)           |
# | Dijkstra             │ heap of (dist, node)                 |
# | Task scheduler       │ heap of (priority, counter, task)    |
# | Sliding window max   │ max-heap + lazy delete               |
# | Fixed-size buffer    │ heappushpop / heapreplace            |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Max-heap with raw values   │ heapq is min-only              |
# | heappop on empty           │ IndexError                     |
# | Direct h[i] mutation       │ Breaks invariant               |
# | Assuming heap is sorted    │ It isn't                       |
# | Search in heap             │ O(n), not O(log n)             |
# | Uncomparable tuple values  │ TypeError                      |
# | heapify return value       │ None, mutates in place         |
# | nlargest when k ≈ n        │ Slower than sorted             |
# | Dijkstra stale entries     │ Wrong distances                |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use heapq — it's C-optimised and idiomatic.
#  - Build with heapify when you have all items.
#  - Negate for max-heap, or wrap in a class.
#  - Use (priority, counter, value) tuples for tie-breaking.
#  - For top-k, use a FIXED-SIZE heap — don't heap the whole
#    list.
#  - Streaming median = max-heap (lows) + min-heap (highs).
#  - Dijkstra: push (distance, node), skip stale pops.
#  - Guard against empty heap before heappop / heapreplace.
#  - Never modify the internal list directly — use heapq API.
#  - Remember: heaps are NOT sorted; only the root is guaranteed.
#  - For thread-safe priority queues, use queue.PriorityQueue.
#  - Choose heapify for bulk, heappush for streaming.
# ============================================================