# 07_Queues_and_Deques.py

# ============================================================
#  📘 QUEUES & DEQUES IN PYTHON — COMPLETE COVERAGE
#
#  A QUEUE is FIFO (First-In, First-Out): enqueue at the back,
#  dequeue from the front. A DEQUE (double-ended queue) allows
#  O(1) push/pop at BOTH ends — the workhorse of sliding-window
#  and BFS problems. Python's `collections.deque` is the
#  idiomatic, thread-safe implementation.
#
#  This file covers: FIFO semantics, why list-as-queue is a trap,
#  collections.deque, queue.Queue, PriorityQueue, circular
#  queues, and the classic problems (BFS-ready interface,
#  sliding window maximum, first non-repeating character stream,
#  implement queue using stacks).
#
#  Sections:
#   1. What a queue is
#   2. Why list is a BAD queue
#   3. collections.deque — the right tool
#   4. queue.Queue — thread-safe queue
#   5. Priority queue (heapq preview)
#   6. Circular queue (fixed size)
#   7. Sliding window maximum (monotonic deque)
#   8. First non-repeating character in a stream
#   9. Implement queue using two stacks
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A QUEUE IS
# ============================================================
# 🔹 FIFO — first item enqueued is first dequeued.
# 🔹 Core operations:
#     enqueue(x) → add to back
#     dequeue()  → remove & return front
#     front()    → look at front
#     is_empty(), size()
# 🔸 All O(1) with the right implementation.
# 🎯 Analogy: checkout line — first in line gets served first.

# 🧠 Use a queue whenever the problem says:
#    "order preserved", "level by level", "shortest path (unweighted)",
#    "producer/consumer", "scheduling", "buffer".


# ============================================================
#  2️⃣ WHY LIST IS A BAD QUEUE
# ============================================================
# 🔹 list.pop(0) is O(n) — shifts every element.
# 🔸 Using a list as a queue in a loop → O(n²) total.
# ❌ Demonstrating the trap (do NOT do this):

bad_queue: list[int] = []
for i in range(5):
    bad_queue.append(i)                 # O(1)
for _ in range(5):
    bad_queue.pop(0)                    # ❌ O(n) each → O(n²) total

# 🔎 Even worse at scale — 1M items in a queue means ~500 billion
#    pointer moves.

# 🧠 Rule: NEVER use list.pop(0) or list.insert(0, x) for queues.
#    Use collections.deque.


# ============================================================
#  3️⃣ collections.deque — THE RIGHT TOOL
# ============================================================
# 🔹 deque = doubly-linked list of blocks, O(1) at both ends.
# 🔸 Ideal for queues, stacks, sliding windows, and BFS.

from collections import deque

q: deque[int] = deque()

# Enqueue at the back
q.append(1)
q.append(2)
q.append(3)
print(list(q))                          # [1, 2, 3]

# Dequeue from the front
front = q.popleft()
print(front, list(q))                   # 1 [2, 3]

# Peek
print(q[0], q[-1])                      # 2 3

# Enqueue at the FRONT (not usual for a queue, but O(1))
q.appendleft(0)
print(list(q))                          # [0, 2, 3]

# Rotate (O(k))
q.rotate(1)                             # shift right by 1
print(list(q))                          # [3, 0, 2]
q.rotate(-1)                            # shift left by 1
print(list(q))                          # [0, 2, 3]

# Bounded deque — auto-drops oldest
bounded: deque[int] = deque(maxlen=3)
for i in range(5):
    bounded.append(i)
print(list(bounded))                    # [2, 3, 4]

# Empty/size checks
print(len(q), bool(q))                  # 3 True

# ⚠️ Indexing deque[i] is O(n) for large deques — deques are
#    optimised for ENDS, not random access. Use a list if you
#    need fast random access.

# 🧠 Mental model: deque = list with fast ops at BOTH ends.


# ============================================================
#  4️⃣ queue.Queue — THREAD-SAFE QUEUE
# ============================================================
# 🔹 Designed for producer/consumer with MULTIPLE THREADS.
# 🔸 Slower than deque but safe across threads.
# 🎯 Use when you need blocking get / put with size limits.

from queue import Queue, Empty, Full

q: Queue[int] = Queue(maxsize=10)

q.put(1)
q.put(2)
q.put(3)
print(q.qsize())                        # 3

print(q.get())                          # 1
print(q.get())                          # 2

# Non-blocking get
try:
    while True:
        item = q.get_nowait()
        print("got", item)
except Empty:
    print("queue empty")                # Output: got 3
                                        #         queue empty

# 🔸 Blocking get with timeout
try:
    q.get(timeout=0.1)
except Empty:
    print("timed out")                  # Output: timed out

# 🔸 Bounded put blocks when full
q2: Queue[int] = Queue(maxsize=2)
q2.put(1); q2.put(2)
try:
    q2.put(3, block=False)
except Full:
    print("full")                       # Output: full

# ⚠️ queue.Queue has overhead (locks) — don't use it in
#    single-threaded code. Use deque.
# 🧠 queue.Queue = "safe but slow"; deque = "fast but not
#    thread-safe".


# ============================================================
#  5️⃣ PRIORITY QUEUE (HEAPQ PREVIEW)
# ============================================================
# 🔹 A priority queue returns the SMALLEST (by default) item first.
# 🔸 Python's `heapq` gives a min-heap over a list.
# 🎯 Used in Dijkstra, A*, scheduling, k-smallest, etc.

import heapq

pq: list[int] = []
heapq.heappush(pq, 5)
heapq.heappush(pq, 1)
heapq.heappush(pq, 3)

print(heapq.heappop(pq))                # 1
print(heapq.heappop(pq))                # 3
print(heapq.heappop(pq))                # 5

# Max-heap via negation
max_pq: list[int] = []
for x in [5, 1, 3]:
    heapq.heappush(max_pq, -x)
print(-heapq.heappop(max_pq))           # 5

# 🔸 Priority queue of tuples: (priority, item)
pq2: list[tuple[int, str]] = []
heapq.heappush(pq2, (2, "medium"))
heapq.heappush(pq2, (1, "high"))
heapq.heappush(pq2, (3, "low"))
while pq2:
    print(heapq.heappop(pq2))
# Output: (1, 'high')  (2, 'medium')  (3, 'low')

# 🔸 queue.PriorityQueue is the thread-safe variant of the same.
from queue import PriorityQueue
pqq: PriorityQueue[int] = PriorityQueue()
pqq.put(3); pqq.put(1); pqq.put(2)
print(pqq.get(), pqq.get(), pqq.get())  # 1 2 3

# 🧠 Full heap treatment in file 11. Here just know the API.


# ============================================================
#  6️⃣ CIRCULAR QUEUE (FIXED SIZE)
# ============================================================
# 🔹 Fixed-capacity FIFO with head/tail wrap-around.
# 🔸 Classic interview question — implement without libraries.
# 🎯 O(1) ops, uses O(capacity) memory.

class CircularQueue:
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self._buf: list[int | None] = [None] * capacity
        self._cap = capacity
        self._size = 0
        self._head = 0                  # next pop index
        self._tail = 0                  # next push index

    def enqueue(self, x: int) -> bool:
        if self._size == self._cap:
            return False                # full
        self._buf[self._tail] = x
        self._tail = (self._tail + 1) % self._cap
        self._size += 1
        return True

    def dequeue(self) -> int | None:
        if self._size == 0:
            return None
        x = self._buf[self._head]
        self._buf[self._head] = None    # help GC
        self._head = (self._head + 1) % self._cap
        self._size -= 1
        return x

    def front(self) -> int | None:
        return self._buf[self._head] if self._size else None

    def is_full(self) -> bool:
        return self._size == self._cap

    def __len__(self) -> int:
        return self._size

cq = CircularQueue(3)
cq.enqueue(1); cq.enqueue(2); cq.enqueue(3)
print(cq.enqueue(4))                    # False (full)
print(cq.dequeue())                     # 1
print(cq.enqueue(4))                    # True
print(cq.front())                       # 2

# 🧠 The modulo-wrap trick: (index + 1) % capacity.
#    Invariant: _size distinguishes full from empty when
#    head == tail.


# ============================================================
#  7️⃣ SLIDING WINDOW MAXIMUM (MONOTONIC DEQUE)
# ============================================================
# 🔹 Classic hard problem: max of every window of size k.
# 🔸 Brute force O(n*k); monotonic deque → O(n).

def max_sliding_window(xs: list[int], k: int) -> list[int]:
    if k <= 0 or k > len(xs):
        return []
    result: list[int] = []
    dq: deque[int] = deque()            # indices, decreasing values

    for i, x in enumerate(xs):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        # Remove smaller values — they can never be the max again
        while dq and xs[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        # Record result once we have a full window
        if i >= k - 1:
            result.append(xs[dq[0]])
    return result

print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [3, 3, 5, 5, 6, 7]

# 🔸 Symmetric: sliding window MINIMUM — flip the comparison.
def min_sliding_window(xs: list[int], k: int) -> list[int]:
    result: list[int] = []
    dq: deque[int] = deque()            # indices, increasing values

    for i, x in enumerate(xs):
        while dq and dq[0] <= i - k:
            dq.popleft()
        while dq and xs[dq[-1]] > x:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(xs[dq[0]])
    return result

print(min_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [-1, -3, -3, -3, 3, 3]

# 🧠 Every index enters/leaves the deque at most once → O(n).
#    The deque is SORTED (monotonically) at all times.


# ============================================================
#  8️⃣ FIRST NON-REPEATING CHARACTER IN A STREAM
# ============================================================
# 🔹 Read characters one by one; after each, print the first
#    char that has appeared exactly once so far.
# 🔸 Combine a Counter with a deque for O(n) total.

from collections import Counter

def first_non_repeating_stream(s: str) -> list[str | None]:
    counts: Counter[str] = Counter()
    q: deque[str] = deque()
    out: list[str | None] = []

    for ch in s:
        counts[ch] += 1
        q.append(ch)
        # Drop chars from the front that are no longer unique
        while q and counts[q[0]] > 1:
            q.popleft()
        out.append(q[0] if q else None)
    return out

print(first_non_repeating_stream("aabcbd"))
# ['a', None, 'b', 'b', 'c', 'c', 'd']

# 🔎 This is the classic "queue + hashmap" pattern: the queue
#    keeps ORDER of arrival, the map keeps freshness.

# 🧠 When the problem says "stream" or "online", think
#    hashmap + queue.


# ============================================================
#  9️⃣ IMPLEMENT QUEUE USING TWO STACKS
# ============================================================
# 🔹 Classic interview: FIFO from two LIFOs.
# 🔸 push → input stack; pop → transfer to output stack once.

class QueueViaStacks:
    def __init__(self) -> None:
        self._in: list[int] = []
        self._out: list[int] = []

    def push(self, x: int) -> None:
        self._in.append(x)

    def pop(self) -> int:
        self._shift()
        if not self._out:
            raise IndexError("pop from empty queue")
        return self._out.pop()

    def peek(self) -> int:
        self._shift()
        if not self._out:
            raise IndexError("peek from empty queue")
        return self._out[-1]

    def _shift(self) -> None:
        # Move all items from _in to _out only when _out is empty
        if not self._out:
            while self._in:
                self._out.append(self._in.pop())

    def empty(self) -> bool:
        return not self._in and not self._out

q = QueueViaStacks()
q.push(1); q.push(2); q.push(3)
print(q.pop())                          # 1
print(q.peek())                         # 2
print(q.pop())                          # 2
print(q.empty())                        # False

# 🧠 Amortised O(1) per operation — each item moves at most once.
#    The reverse problem (stack via two queues) is also common.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ list.pop(0) is O(n) — the #1 queue mistake. Use deque.
# ⚠️ deque indexing is O(n) — don't use as a random-access list.
# ⚠️ queue.Queue is thread-safe but slower; use only when
#    multiple threads touch it.
# ⚠️ deque is thread-safe for append/pop on either END, but NOT
#    for iteration while modifying.
# ⚠️ PriorityQueue is thread-safe; heapq is not.
# ⚠️ Circular queue: buffer size stays fixed — good for bounded
#    streaming.
# ⚠️ Monotonic deque uses `<` vs `<=` — matters for duplicates
#    in sliding-window problems.
# ⚠️ In BFS, use deque, not list — the difference is O(n) vs O(n²).
# ⚠️ deque(maxlen=k) auto-drops oldest on append; useful for
#    sliding windows where you want the last k items only.
# ⚠️ `len(deque)` is O(1) but `len(Queue())` is not exposed as
#    len() — use .qsize().
# ⚠️ Empty pop on deque raises IndexError; guard with `if q`.
# ⚠️ Two-stack queue: transfer ONLY when output stack is empty —
#    otherwise order breaks.

# 🕒 Version notes
# - collections.deque: Python 2.4+
# - deque(maxlen=n): Python 2.6+
# - queue.Queue: always available (renamed from Queue in 3.0)
# - heapq: always available (min-heap semantics)
# - queue.PriorityQueue: always available
# - deque.appendleft / popleft: Python 2.4+
# - deque.rotate(n): Python 2.4+
# - deque copy / pickling: Python 3.5+ (better performance)
# - heapq.merge for multiple sorted iterables: Python 3.5+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Structure       │ Enqueue       │ Dequeue        │ Notes    |
# ─────────────────────────────────────────────────────────────
# | list (bad)      │ append O(1)   │ pop(0) O(n)    │ ❌ O(n²) |
# | deque (good)    │ append O(1)   │ popleft O(1)   │ ✅ stdlib|
# | deque (bounded) │ append O(1)   │ auto-drop old  │ maxlen   |
# | queue.Queue     │ put O(1)      │ get O(1)       │ thread-safe |
# | PriorityQueue   │ put O(log n)  │ get O(log n)   │ thread-safe |
# | heapq list      │ heappush      │ heappop        │ not thread-safe |
# | Circular queue  │ enqueue O(1)  │ dequeue O(1)   │ fixed size |
# ─────────────────────────────────────────────────────────────
# | Classic problem               │ Technique                 |
# ─────────────────────────────────────────────────────────────
# | Sliding window maximum        │ Monotonic deque           |
# | Sliding window minimum        │ Monotonic deque (flipped) |
# | First non-repeating in stream │ Counter + deque           |
# | BFS                           │ deque as queue            |
# | Queue using two stacks        │ Amortised O(1) transfer   |
# | Rate limiting                 │ deque(maxlen=k)           |
# | Producer/consumer             │ queue.Queue               |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | list.pop(0)                │ O(n) → O(n²) queue             |
# | deque indexing in loop     │ O(n) random access             |
# | Non-thread-safe heapq      │ Race conditions under threads  |
# | Monotonic `<` vs `<=`      │ Duplicates handled differently |
# | Two-stack transfer rule    │ Order breaks if done eagerly   |
# | Using len(Queue())         │ Not defined — use .qsize()     |
# | Iterating deque + mutate   │ RuntimeError                   |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use collections.deque for queues — never list.pop(0).
#  - Use queue.Queue only when multiple threads need it.
#  - Use heapq / PriorityQueue for ordered extraction.
#  - Monotonic deque solves sliding-window min/max in O(n).
#  - For BFS, deque is the default queue.
#  - Use deque(maxlen=k) for fixed-size sliding buffers.
#  - Two-stack queue: transfer lazily (only when out is empty).
#  - Handle empty-queue cases explicitly; deque.pop/popleft
#    raise IndexError.
#  - When the problem says "stream" or "level-by-level" →
#    think queue.
#  - In sliding-window problems, decide strict `<` vs `<=`
#    based on duplicate handling.
# ============================================================