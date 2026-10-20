# 20_Greedy_Algorithms.py

# ============================================================
#  📘 GREEDY ALGORITHMS IN PYTHON — COMPLETE COVERAGE
#
#  A GREEDY algorithm makes the LOCALLY OPTIMAL choice at each
#  step, hoping it leads to a globally optimal solution. Greedy
#  is simple and fast (usually O(n log n) or O(n)), but it
#  works only when the problem has the RIGHT structure:
#  greedy-choice property + optimal substructure.
#
#  This file covers: when greedy works vs fails, the classic
#  greedy problems (activity selection, interval scheduling,
#  Huffman coding, jump game, gas station, minimum platforms,
#  fractional knapsack), and how to PROVE a greedy is correct
#  via exchange arguments.
#
#  Sections:
#   1. Greedy vs DP vs brute force
#   2. When greedy works
#   3. Activity selection (interval scheduling)
#   4. Non-overlapping intervals / merge intervals
#   5. Fractional knapsack
#   6. Huffman coding (heap-based greedy)
#   7. Jump game I & II
#   8. Gas station
#   9. Minimum platforms / meeting rooms
#  10. Interval covering / partition labels
#  11. Pattern recognition guide
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ GREEDY VS DP VS BRUTE FORCE
# ============================================================
# 🔹 Brute force: try all possibilities → exponential.
# 🔹 DP         : compute optimal via overlapping subproblems.
# 🔹 Greedy     : commit to a locally-optimal choice.
# 🔸 Greedy is FASTER but works only for specific problems.
# 🎯 If greedy works, it beats DP. If not, DP saves you.

# ── Comparison table ─────────────────────────────────────────
# | Aspect          │ Greedy              │ DP                  |
# |-----------------│---------------------|---------------------|
# | Decision        │ one, final          │ consider all        |
# | Time            │ usually O(n log n)  │ often O(n²) / O(nW) |
# | Proof           │ exchange argument   │ optimal substructure|
# | Fails when      │ local ≠ global      │ rarely              |
# ─────────────────────────────────────────────────────────────

# 🧠 Rule: if you can PROVE the greedy choice is safe (exchange
#    argument), use greedy. Otherwise, DP.

# ⚠️ Famous greedy FAILURES:
#    - 0/1 Knapsack (greedy by value/weight ratio fails).
#    - Coin change with arbitrary denominations.
#    - Longest path in a graph.
# 🔸 For 0/1 knapsack, use DP (file 19).
# 🔸 Coin change with [1, 3, 4] and amount 6 → greedy [4,1,1] = 3
#    coins, but optimal is [3,3] = 2 coins.


# ============================================================
#  2️⃣ WHEN GREEDY WORKS
# ============================================================
# 🔹 Conditions (both needed):
#     1. GREEDY-CHOICE PROPERTY: a locally optimal choice is
#        part of SOME globally optimal solution.
#     2. OPTIMAL SUBSTRUCTURE: optimal solution to the whole
#        contains optimal solutions to subproblems.
# 🔸 Proof technique: EXCHANGE ARGUMENT — show that any optimal
#    solution can be transformed into the greedy one without
#    losing optimality.

# 🧠 Common greedy signals:
#    - "Maximum number of non-overlapping X"
#    - "Minimum number of intervals to cover Y"
#    - "Sort by end / start / ratio"
#    - "At each step pick the best available"


# ============================================================
#  3️⃣ ACTIVITY SELECTION (INTERVAL SCHEDULING)
# ============================================================
# 🔹 Pick max number of non-overlapping intervals.
# 🔸 Greedy: sort by END time, pick earliest-ending compatible.
# 🎯 Exchange argument: choosing the earliest-ending interval
#    leaves maximum room for the rest.

def activity_selection(intervals: list[tuple[int, int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[1])      # sort by END
    count = 1
    last_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start >= last_end:               # compatible
            count += 1
            last_end = end
    return count

print(activity_selection([(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]))
# 4  (e.g. (1,4), (5,7), (8,11), (12,16))

# 🧠 Sorting by END (not start) is the key — it's what makes the
#    greedy correct.
# ⚠️ Sorting by start or by length is a common mistake and
#    produces suboptimal answers.


# ============================================================
#  4️⃣ NON-OVERLAPPING INTERVALS / MERGE INTERVALS
# ============================================================
# 🔹 LeetCode classic: min removals to make intervals non-overlapping.
# 🔸 Equivalent to: total - max non-overlapping.

def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[1])      # sort by END
    count = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return len(intervals) - count

print(erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]))   # 1

# 🔸 Merge overlapping intervals
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])      # sort by START here
    merged: list[list[int]] = [intervals[0][:]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:          # overlap
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))
# [[1, 6], [8, 10], [15, 18]]

# 🔸 Insert interval into a sorted non-overlapping list
def insert_interval(intervals: list[list[int]], new: list[int]) -> list[list[int]]:
    result: list[list[int]] = []
    i = 0
    n = len(intervals)
    # Add all intervals ending before new starts
    while i < n and intervals[i][1] < new[0]:
        result.append(intervals[i]); i += 1
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= new[1]:
        new[0] = min(new[0], intervals[i][0])
        new[1] = max(new[1], intervals[i][1])
        i += 1
    result.append(new)
    # Add remaining
    result.extend(intervals[i:])
    return result

print(insert_interval([[1,3],[6,9]], [2,5]))
# [[1, 5], [6, 9]]

# 🧠 Sort by END for "max non-overlapping"; sort by START for
#    "merge overlapping".


# ============================================================
#  5️⃣ FRACTIONAL KNAPSACK
# ============================================================
# 🔹 Like 0/1 knapsack, but you can take FRACTIONS of items.
# 🔸 Greedy: sort by value/weight ratio, take as much as fits.
# 🎯 Because you can take fractions, greedy is optimal.

def fractional_knapsack(
    weights: list[int],
    values: list[int],
    capacity: int,
) -> float:
    items = sorted(
        zip(weights, values),
        key=lambda t: t[1] / t[0],
        reverse=True,                       # highest ratio first
    )
    total = 0.0
    for w, v in items:
        if capacity <= 0:
            break
        take = min(w, capacity)
        total += v * (take / w)
        capacity -= take
    return total

print(fractional_knapsack([10, 20, 30], [60, 100, 120], 50))
# 240.0  (take all 10 & 20, then 2/3 of 30)

# ⚠️ This trick does NOT work for 0/1 knapsack — you can't take
#    fractions, so use DP.
# 🧠 "Fraction allowed" → greedy. "Take or skip" → DP.


# ============================================================
#  6️⃣ HUFFMAN CODING (HEAP-BASED GREEDY)
# ============================================================
# 🔹 Build an optimal prefix-free binary encoding.
# 🔸 Repeatedly merge the two LOWEST-frequency nodes.
# 🎯 Classic use of a min-heap as a greedy structure.

import heapq
from collections import Counter

class HuffmanNode:
    __slots__ = ("freq", "char", "left", "right")
    def __init__(self, freq: int, char: str | None = None,
                 left: "HuffmanNode | None" = None,
                 right: "HuffmanNode | None" = None) -> None:
        self.freq = freq
        self.char = char
        self.left = left
        self.right = right

    def __lt__(self, other: "HuffmanNode") -> bool:
        return self.freq < other.freq

def huffman_codes(text: str) -> dict[str, str]:
    if not text:
        return {}
    freq = Counter(text)
    heap: list[HuffmanNode] = [HuffmanNode(f, c) for c, f in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        a = heapq.heappop(heap)
        b = heapq.heappop(heap)
        parent = HuffmanNode(a.freq + b.freq, left=a, right=b)
        heapq.heappush(heap, parent)

    codes: dict[str, str] = {}
    def walk(node: HuffmanNode, prefix: str) -> None:
        if node.char is not None:
            codes[node.char] = prefix or "0"    # single-char case
            return
        if node.left:  walk(node.left,  prefix + "0")
        if node.right: walk(node.right, prefix + "1")

    walk(heap[0], "")
    return codes

codes = huffman_codes("aaabbc")
print(codes)
# {'a': '0', 'b': '10', 'c': '11'}  (or similar)

# 🔸 Total encoded length
def huffman_length(text: str) -> int:
    if not text:
        return 0
    freq = Counter(text)
    codes = huffman_codes(text)
    return sum(freq[ch] * len(code) for ch, code in codes.items())

print(huffman_length("aaabbc"))         # 9  (3*1 + 2*2 + 1*2)

# 🧠 Huffman is THE canonical example of a greedy algorithm with
#    a heap. The "merge two smallest" step is where greediness
#    shines.
# 🔸 Real-world: gzip, zip, JPEG, MP3 use variants of Huffman.


# ============================================================
#  7️⃣ JUMP GAME I & II
# ============================================================
# 🔹 I : Can you reach the last index?
# 🔸 II: Minimum jumps.

# Jump Game I — track the farthest index you can reach
def can_jump(nums: list[int]) -> bool:
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False                    # stuck before i
        farthest = max(farthest, i + jump)
    return True

print(can_jump([2, 3, 1, 1, 4]))            # True
print(can_jump([3, 2, 1, 0, 4]))            # False

# Jump Game II — greedy BFS-like
def jump(nums: list[int]) -> int:
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:                # end of current jump range
            jumps += 1
            current_end = farthest
            if current_end >= len(nums) - 1:
                break
    return jumps

print(jump([2, 3, 1, 1, 4]))                # 2
print(jump([2, 3, 0, 1, 4]))                # 2

# 🧠 Jump II is greedy at the "level" granularity — pick the
#    range that reaches farthest before committing to a jump.


# ============================================================
#  8️⃣ GAS STATION
# ============================================================
# 🔹 Circular route; find the starting station to complete it.
# 🔸 If total gas < total cost → impossible.
# 🔸 Otherwise, the start is the first station where running
#    total becomes non-negative after a negative dip.

def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    total = 0
    tank = 0
    start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1

print(can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]))    # 3
print(can_complete_circuit([2,3,4], [3,4,3]))            # -1

# 🧠 Why "reset start when tank < 0"? Because no station in the
#    interval [old_start..i] could have succeeded either — the
#    running deficit guarantees it.
# 🧠 The proof is the greedy-exchange argument. Elegant and
#    O(n).


# ============================================================
#  9️⃣ MINIMUM PLATFORMS / MEETING ROOMS
# ============================================================
# 🔹 Given arrival/departure times, how many platforms needed?
# 🔸 Sort both arrays, use two pointers.

def min_platforms(arrivals: list[int], departures: list[int]) -> int:
    arrivals = sorted(arrivals)
    departures = sorted(departures)
    i = j = 0
    platforms = 0
    max_platforms = 0
    while i < len(arrivals):
        if arrivals[i] <= departures[j]:
            platforms += 1
            i += 1
            max_platforms = max(max_platforms, platforms)
        else:
            platforms -= 1
            j += 1
    return max_platforms

print(min_platforms([900, 940, 950, 1100, 1500, 1800],
                    [910, 1200, 1120, 1130, 1900, 2000]))   # 3

# 🔸 Alternative with a heap (event-based):
def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])      # sort by start
    heap: list[int] = []                    # min-heap of end times
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)    # reuse the room
        else:
            heapq.heappush(heap, end)       # need a new room
    return len(heap)

print(min_meeting_rooms([[0,30],[5,10],[15,20]]))   # 2
print(min_meeting_rooms([[7,10],[2,4]]))            # 1

# 🧠 Two-pointer approach: O(n log n) time, O(1) extra space
#    (after sorting).
# 🧠 Heap approach: also O(n log n), conceptually cleaner for
#    "reuse the earliest-ending room".


# ============================================================
#  🔟 INTERVAL COVERING / PARTITION LABELS
# ============================================================
# 🔹 Minimum arrows to burst balloons (interval covering).
# 🔸 Sort by END, shoot at each end.

def find_min_arrows(points: list[list[int]]) -> int:
    if not points:
        return 0
    points.sort(key=lambda x: x[1])         # sort by END
    arrows = 1
    last = points[0][1]
    for start, end in points[1:]:
        if start > last:                    # no overlap with last arrow
            arrows += 1
            last = end
    return arrows

print(find_min_arrows([[10,16],[2,8],[1,6],[7,12]]))    # 2
print(find_min_arrows([[1,2],[3,4],[5,6],[7,8]]))       # 4

# 🔸 Partition Labels (split string into chunks of unique chars)
def partition_labels(s: str) -> list[int]:
    last: dict[str, int] = {}
    for i, ch in enumerate(s):
        last[ch] = i
    result: list[int] = []
    start = 0
    end = 0
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    return result

print(partition_labels("ababcbacadefegdehijhklij"))
# [9, 7, 8]

# 🧠 Greedy on "farthest reach so far" — same idea as Jump Game.


# ============================================================
#  1️⃣1️⃣ PATTERN RECOGNITION GUIDE
# ============================================================
# 🔹 "Max non-overlapping X"        → sort by END
# 🔹 "Merge overlapping X"          → sort by START
# 🔹 "Min arrows / min points"      → sort by END
# 🔹 "Reach last index"             → track farthest
# 🔹 "Min steps to reach end"       → BFS-like greedy
# 🔹 "Fraction allowed"             → greedy by ratio
# 🔹 "Take or skip"                 → NOT greedy → DP
# 🔹 "Repeatedly pick two smallest" → heap + greedy
# 🔹 "Best start for circular"      → running sum trick

# ── Complexity reference ─────────────────────────────────────
# | Problem                │ Approach          │ Time          |
# |------------------------|-------------------|---------------|
# | Activity selection     │ sort by end       │ O(n log n)    |
# | Merge intervals        │ sort by start     │ O(n log n)    |
# | Fractional knapsack    │ sort by ratio     │ O(n log n)    |
# | Huffman coding         │ heap              │ O(n log n)    |
# | Jump game I            │ track farthest    │ O(n)          |
# | Jump game II           │ greedy levels     │ O(n)          |
# | Gas station            │ running sum       │ O(n)          |
# | Min platforms          │ two pointers      │ O(n log n)    |
# | Min meeting rooms      │ heap              │ O(n log n)    |
# | Partition labels       │ last-index map    │ O(n)          |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Greedy FAILS for 0/1 knapsack — must use DP.
# ⚠️ Greedy FAILS for coin change with arbitrary denominations.
# ⚠️ Sorting by START for non-overlapping problems is WRONG —
#    always sort by END.
# ⚠️ Sorting by END for merge problems is WRONG — always sort by
#    START.
# ⚠️ Jump Game II: the "end of current jump range" trigger is
#    subtle; forgetting it produces wrong count.
# ⚠️ Gas station: reset to i+1 when tank < 0, not i.
# ⚠️ Huffman: single-character input → code must still be "0"
#    (empty prefix is invalid).
# ⚠️ Fractional knapsack with zero-weight items → division by
#    zero. Guard or skip zero-weight items.
# ⚠️ Intervals with equal boundaries: decide if endpoints count
#    as overlapping (LeetCode problems differ).
# ⚠️ Greedy proofs are often skipped in interviews — be ready
#    to explain the exchange argument in words.
# ⚠️ Some problems LOOK greedy but need DP (e.g., House Robber,
#    0/1 Knapsack, Longest Increasing Subsequence).
# ⚠️ Two-pointer interval approach: arrival == departure is
#    ambiguous — check problem statement.
# ⚠️ Sort stability matters for ties — sort by a secondary key.

# 🕒 Version notes
# - heapq-based greedy (Huffman, meeting rooms): Python 2.4+
# - `functools.cmp_to_key` for custom sorts: 2.7+ / 3.2+
# - `math.inf` for sentinel: Python 3.5+
# - PEP 604 unions (str | None): Python 3.10+
#   For 3.9 and below use Optional[str]
# - `bisect` for interval coverage: Python 2.2+
# - No stdlib for Huffman — write your own
# - `heapq.heapreplace` (pop+push): Python 2.3+
# - Python 3.11+ has faster sort / interpreter for larger inputs


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Problem              │ Greedy key                      |
# ─────────────────────────────────────────────────────────────
# | Activity selection   │ sort by END, pick earliest      |
# | Non-overlap          │ sort by END                     |
# | Merge intervals      │ sort by START, extend end       |
# | Insert interval      │ scan + merge overlap            |
# | Fractional knapsack  │ sort by value/weight descending |
# | Huffman coding       │ merge two smallest via heap     |
# | Jump game I          │ track farthest reach            |
# | Jump game II         │ greedy on level ranges          |
# | Gas station          │ reset start when tank < 0       |
# | Min platforms        │ two-pointer over sorted times   |
# | Min meeting rooms    │ heap of end times               |
# | Min arrows (points)  │ sort by END, shoot at end       |
# | Partition labels     │ last index + farthest reach     |
# ─────────────────────────────────────────────────────────────
# | Greedy works          │ Greedy FAILS — use DP           |
# ─────────────────────────────────────────────────────────────
# | Fractional knapsack   │ 0/1 knapsack                     |
# | Activity selection    │ Longest path in DAG              |
# | Huffman coding        │ Coin change (arbitrary coins)    |
# | Interval scheduling   │ House robber                     |
# | Jump game             │ Longest Increasing Subsequence   |
# | Gas station           │ Edit distance                    |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Sort by start for overlap  │ Wrong count of non-overlap     |
# | Sort by end for merge      │ Merge misses nested intervals  |
# | Greedy for 0/1 knapsack    │ Suboptimal value               |
# | Greedy for coin change     │ Suboptimal coin count          |
# | Jump II off-by-one         │ Wrong jump count               |
# | Gas station reset          │ Wrong start index              |
# | Huffman single char        │ Empty code                     |
# | Equal boundaries ambiguity │ Off-by-one answers             |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Before writing greedy, ask: is the greedy choice provably
#    safe? Exchange argument in one sentence.
#  - Sort by END for non-overlap; by START for merge.
#  - Use a heap when "repeatedly pick smallest / largest".
#  - Track "farthest reach" for problems with jumps / reach.
#  - Use running sums (Kadane-style) for gas-station-like
#    circular problems.
#  - If greedy fails, fall back to DP — no shame in it.
#  - Test with: empty input, single item, ties, no solution,
#    and full solution.
#  - Interviewers value the exchange argument — practice
#    explaining WHY greedy works.
#  - Split "sort + scan" patterns from "heap + scan" patterns:
#    both are O(n log n) but conceptually different.
#  - Prefer fractional greedy only when fractions are allowed.
# ============================================================