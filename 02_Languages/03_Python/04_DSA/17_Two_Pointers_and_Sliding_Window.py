# 17_Two_Pointers_and_Sliding_Window.py

# ============================================================
#  📘 TWO POINTERS & SLIDING WINDOW IN PYTHON
#
#  TWO POINTERS: use two indices moving through a sequence to
#  replace a nested loop with a single pass. SLIDING WINDOW: a
#  special two-pointer pattern that maintains a window [l, r]
#  and expands/shrinks it. Both convert O(n²) brute-force into
#  O(n) and are the most common interview pattern after hashing.
#
#  This file covers: opposite-direction two pointers, fast/slow,
#  same-direction, fixed-size window, variable-size window,
#  substring / subarray problems, and the reasoning behind when
#  a window is valid.
#
#  Sections:
#   1. What the two-pointer pattern is
#   2. Opposite-direction two pointers
#   3. Fast/slow pointers
#   4. Same-direction two pointers (read/write)
#   5. Fixed-size sliding window
#   6. Variable-size sliding window
#   7. Longest substring without repeat (classic)
#   8. Minimum window substring (hard)
#   9. Pattern recognition guide
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT THE TWO-POINTER PATTERN IS
# ============================================================
# 🔹 Two indices i, j move through the data.
# 🔸 Their relationship encodes the state you care about.
# 🎯 Convert O(n²) "for each i, scan all j" → O(n) "one pass".

# ── Common patterns ──────────────────────────────────────────
# | Pattern                    │ Typical use                    |
# |----------------------------|--------------------------------|
# | Opposite-direction (i,j)   │ sorted pair sum, palindrome    |
# | Fast/slow (i, 2i)          │ cycle detect, middle of list   |
# | Same-direction (read/write)│ dedup, partition, remove       |
# | Sliding window (l, r)      │ substring / subarray           |
# ─────────────────────────────────────────────────────────────

# 🧠 Signal words: "sorted", "pair", "subarray", "substring",
#    "window", "contiguous", "longest", "smallest".


# ============================================================
#  2️⃣ OPPOSITE-DIRECTION TWO POINTERS
# ============================================================
# 🔹 Start at both ends, move toward each other.
# 🔸 Requires SORTED input for pair-sum.
# 🎯 Palindrome check, sorted two-sum, container with most water.

# 🔸 Sorted two-sum: find pair summing to target
def two_sum_sorted(xs: list[int], target: int) -> tuple[int, int] | None:
    i, j = 0, len(xs) - 1
    while i < j:
        s = xs[i] + xs[j]
        if s == target:
            return (i, j)
        if s < target:
            i += 1                      # need bigger → move left up
        else:
            j -= 1                      # need smaller → move right down
    return None

print(two_sum_sorted([1, 2, 3, 4, 6], 6))    # (1, 3)  2+4
print(two_sum_sorted([1, 2, 3, 4, 6], 100))  # None

# 🔸 Palindrome check
def is_palindrome(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1; j -= 1
    return True

print(is_palindrome("racecar"))             # True
print(is_palindrome("hello"))               # False

# 🔸 Reverse in place
def reverse_in_place(xs: list[int]) -> None:
    i, j = 0, len(xs) - 1
    while i < j:
        xs[i], xs[j] = xs[j], xs[i]
        i += 1; j -= 1

# 🔸 Container with most water (classic hard)
def max_area(heights: list[int]) -> int:
    i, j = 0, len(heights) - 1
    best = 0
    while i < j:
        h = min(heights[i], heights[j])
        best = max(best, h * (j - i))
        # Move the SHORTER side inward
        if heights[i] < heights[j]:
            i += 1
        else:
            j -= 1
    return best

print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))    # 49

# 🧠 Why "move the shorter side"? Because moving the taller
#    side never increases the min-height — only reduces width.


# ============================================================
#  3️⃣ FAST/SLOW POINTERS
# ============================================================
# 🔹 Two pointers at different speeds.
# 🔸 Fast moves 2x, slow moves 1x.
# 🎯 Cycle detection, middle of a linked list, "happy number".

# 🔸 Middle of a linked list
class ListNode:
    __slots__ = ("value", "next")
    def __init__(self, value: int, nxt: "ListNode | None" = None) -> None:
        self.value = value
        self.next = nxt

def middle_node(head: ListNode | None) -> ListNode | None:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

# 🔸 Cycle detection (Floyd's)
def has_cycle(head: ListNode | None) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# 🔸 Find duplicate number in an array (0..n) using Floyd's
def find_duplicate(xs: list[int]) -> int:
    slow = fast = xs[0]
    while True:
        slow = xs[slow]
        fast = xs[xs[fast]]
        if slow == fast:
            break
    # Find the entry point of the cycle (the duplicate)
    slow = xs[0]
    while slow != fast:
        slow = xs[slow]
        fast = xs[fast]
    return slow

print(find_duplicate([1, 3, 4, 2, 2]))      # 2
print(find_duplicate([3, 1, 3, 4, 2]))      # 3

# 🧠 Fast/slow shines when the array/linked list has an implicit
#    "index → value" graph structure.


# ============================================================
#  4️⃣ SAME-DIRECTION TWO POINTERS (READ/WRITE)
# ============================================================
# 🔹 One pointer writes, one reads.
# 🔸 Compacts or partitions in place.
# 🎯 Remove duplicates, remove element, move zeros, partition.

# 🔸 Remove duplicates from a SORTED array in place
def remove_duplicates_sorted(xs: list[int]) -> int:
    if not xs:
        return 0
    write = 1
    for read in range(1, len(xs)):
        if xs[read] != xs[write - 1]:
            xs[write] = xs[read]
            write += 1
    return write

xs = [1, 1, 2, 2, 3]
k = remove_duplicates_sorted(xs)
print(xs[:k])                               # [1, 2, 3]

# 🔸 Move all zeros to the end (stable order of non-zeros)
def move_zeros(xs: list[int]) -> None:
    write = 0
    for read in range(len(xs)):
        if xs[read] != 0:
            xs[write], xs[read] = xs[read], xs[write]
            write += 1

ys = [0, 1, 0, 3, 12]
move_zeros(ys)
print(ys)                                   # [1, 3, 12, 0, 0]

# 🔸 Remove an element in place, return new length
def remove_element(xs: list[int], val: int) -> int:
    write = 0
    for read in range(len(xs)):
        if xs[read] != val:
            xs[write] = xs[read]
            write += 1
    return write

# 🧠 Read/write pointers = in-place filters.
#    Both pointers move LEFT-TO-RIGHT, but read is always ahead.


# ============================================================
#  5️⃣ FIXED-SIZE SLIDING WINDOW
# ============================================================
# 🔹 Window of exactly k elements; slide by 1 each step.
# 🔸 Reuse previous computation (subtract the leaving element).
# 🎯 "Max sum of k consecutive", "average of k", "contains dup
#    within k distance".

def max_sum_window(xs: list[int], k: int) -> int:
    if k <= 0 or k > len(xs):
        return 0
    window = sum(xs[:k])
    best = window
    for i in range(k, len(xs)):
        window += xs[i] - xs[i - k]         # add new, drop old
        best = max(best, window)
    return best

print(max_sum_window([1, 3, -1, -3, 5, 3, 6, 7], 3))    # 16

# 🔸 Fixed window with a deque (for max/min)
from collections import deque

def max_sliding_window(xs: list[int], k: int) -> list[int]:
    dq: deque[int] = deque()                # indices, decreasing values
    out: list[int] = []
    for i, x in enumerate(xs):
        while dq and dq[0] <= i - k:
            dq.popleft()                    # out of window
        while dq and xs[dq[-1]] < x:
            dq.pop()                        # remove smaller
        dq.append(i)
        if i >= k - 1:
            out.append(xs[dq[0]])
    return out

print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [3, 3, 5, 5, 6, 7]

# 🧠 Fixed window = O(n) — you never re-scan the whole window.


# ============================================================
#  6️⃣ VARIABLE-SIZE SLIDING WINDOW
# ============================================================
# 🔹 Expand r while window is valid; shrink l until valid.
# 🔸 Both pointers move monotonically → O(n) total.
# 🎯 "Longest / shortest subarray where <condition>".

# 🔸 Smallest subarray with sum ≥ target
def min_subarray_len(xs: list[int], target: int) -> int:
    left = 0
    total = 0
    best = float("inf")
    for right, x in enumerate(xs):
        total += x
        while total >= target:
            best = min(best, right - left + 1)
            total -= xs[left]
            left += 1
    return 0 if best == float("inf") else int(best)

print(min_subarray_len([2, 3, 1, 2, 4, 3], 7))    # 2  (subarray [4,3])
print(min_subarray_len([1, 4, 4], 4))             # 1

# 🔸 Longest substring without repeating characters
def longest_unique_substring(s: str) -> int:
    last: dict[str, int] = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique_substring("abcabcbb"))       # 3
print(longest_unique_substring("bbbbb"))          # 1
print(longest_unique_substring("pwwkew"))         # 3

# 🔸 Longest substring with at most k distinct chars
def longest_k_distinct(s: str, k: int) -> int:
    counts: dict[str, int] = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        counts[ch] = counts.get(ch, 0) + 1
        while len(counts) > k:
            counts[s[left]] -= 1
            if counts[s[left]] == 0:
                del counts[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best

print(longest_k_distinct("eceba", 2))             # 3  ("ece")
print(longest_k_distinct("aa", 1))                # 2

# 🔸 Longest subarray with sum ≤ k (positive numbers)
def longest_subarray_sum_le(xs: list[int], k: int) -> int:
    left = 0
    total = 0
    best = 0
    for right, x in enumerate(xs):
        total += x
        while total > k:
            total -= xs[left]
            left += 1
        best = max(best, right - left + 1)
    return best

print(longest_subarray_sum_le([1, 2, 1, 0, 1, 1, 1], 4))     # 5

# 🧠 Variable window template:
#     left = 0
#     for right, x in enumerate(xs):
#         add x to window
#         while window is INVALID:
#             remove xs[left]; left += 1
#         update best (or count) with current window size
#     return best


# ============================================================
#  7️⃣ LONGEST SUBSTRING WITHOUT REPEAT (DEEP DIVE)
# ============================================================
# 🔹 Multiple correct approaches:
#     a) set + sliding window        → O(n) time, O(k) space
#     b) dict of last index          → O(n) time, O(k) space
# 🔸 The dict version can "jump" left forward in O(1) instead
#    of shrinking one char at a time.

def length_of_longest_substring(s: str) -> int:
    last: dict[str, int] = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(length_of_longest_substring("dvdf"))    # 3
print(length_of_longest_substring(""))        # 0
print(length_of_longest_substring(" "))       # 1

# 🧠 The `last[ch] >= left` guard is crucial — otherwise you
#    might move left BACKWARD past a valid position.


# ============================================================
#  8️⃣ MINIMUM WINDOW SUBSTRING (HARD)
# ============================================================
# 🔹 Find the smallest substring of s that contains all chars of t.
# 🔸 Sliding window + Counter for required frequencies.
# 🎯 The quintessential "hard" sliding window problem.

from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t or len(t) > len(s):
        return ""
    need = Counter(t)
    missing = len(t)
    left = 0
    best_len = float("inf")
    best_start = 0

    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if right - left + 1 < best_len:
                best_len = right - left + 1
                best_start = left
            # Shrink from left
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1

    return "" if best_len == float("inf") else s[best_start:best_start + best_len]

print(min_window("ADOBECODEBANC", "ABC"))       # "BANC"
print(min_window("a", "a"))                     # "a"
print(min_window("a", "aa"))                    # ""

# 🧠 Pattern: track "how many characters still missing". Once
#    missing == 0, shrink from the left — that's the "collect
#    then shrink" sliding window.

# 🔸 Permutation in string (same idea, simpler)
def check_inclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
    need = Counter(s1)
    missing = len(s1)
    for i, ch in enumerate(s2):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        if i >= len(s1):
            old = s2[i - len(s1)]
            need[old] += 1
            if need[old] > 0:
                missing += 1
        if missing == 0:
            return True
    return False

print(check_inclusion("ab", "eidbaooo"))        # True
print(check_inclusion("ab", "eidboaoo"))        # False


# ============================================================
#  9️⃣ PATTERN RECOGNITION GUIDE
# ============================================================
# 🔹 "Sorted array, find pair"                → opposite two-ptr
# 🔹 "Palindrome"                             → opposite two-ptr
# 🔹 "Cycle / middle in linked list"          → fast/slow
# 🔹 "Remove duplicates / partition in place" → read/write two-ptr
# 🔹 "Fixed k, sum / max / min over window"   → fixed sliding window
# 🔹 "Longest / shortest subarray where ..."  → variable window
# 🔹 "Substring with chars from t"            → variable window +
#                                                Counter
# 🔹 "Contains all of t"                      → variable window
#                                                with missing count

# 🧠 Decision flow:
#    1. Contiguous subarray/substring? → SLIDING WINDOW.
#    2. Sorted array + pair/palindrome? → OPPOSITE TWO-POINTERS.
#    3. In-place transform of array?   → READ/WRITE TWO-POINTERS.
#    4. Linked list cycle / middle?     → FAST/SLOW.

# ── Complexity snapshot ──────────────────────────────────────
# | Pattern             │ Time     │ Space                     |
# |---------------------|----------|---------------------------|
# | Opposite two-ptr    │ O(n)     │ O(1)                      |
# | Fast/slow           │ O(n)     │ O(1)                      |
# | Read/write          │ O(n)     │ O(1)                      |
# | Fixed window        │ O(n)     │ O(k) with deque else O(1) |
# | Variable window     │ O(n)     │ O(k) distinct chars       |
# | Min window substr   │ O(n)     │ O(k)                      |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Sliding window with NEGATIVE numbers is tricky:
#    - "smallest subarray sum ≥ k" with negatives → not monotonic
#      → sliding window invalid, use prefix sum + monotonic deque.
#    - Sliding window with positive numbers is safe.
# ⚠️ Fixed-size window: guard k <= 0 or k > len(xs).
# ⚠️ Variable window: always move left forward, never backward.
# ⚠️ `last[ch] >= left` guard in longest-unique prevents left
#    from moving backwards past valid chars.
# ⚠️ Two-sum two-pointer requires SORTED input — otherwise use
#    hash map (file 04).
# ⚠️ Palindrome: compare lowercase / alphanumeric if the problem
#    asks (skip non-alnum).
# ⚠️ Container with most water: move the SHORTER side, not the
#    taller one.
# ⚠️ Fast/slow: check `fast and fast.next` before advancing fast.
# ⚠️ Read/write dedup: only works on SORTED arrays; for unsorted,
#    use a set or a hash.
# ⚠️ "At most k distinct" — use a dict of counts, not a set,
#    because you need to know when a count drops to 0.
# ⚠️ Counter mutation: `need[ch] -= 1` will create negative
#    counts; guard with `if need[ch] > 0` when decrementing
#    missing.
# ⚠️ Empty input: return 0 / "" / None explicitly.
# ⚠️ Unicode strings: dict-based counting works; but `s[i]` may
#    be a surrogate pair in some encodings — Python handles it
#    at code-point level, not grapheme.

# 🕒 Version notes
# - deque for fixed windows: Python 2.4+
# - Counter for window counts: Python 2.7+ / 3.1+
# - PEP 604 unions (tuple | None): Python 3.10+
#   For 3.9 and below use Optional[tuple]
# - f-strings help readability in debugging: Python 3.6+
# - `math.inf` as sentinel: Python 3.5+
# - `str.casefold()` for case-insensitive comparisons: Python 3.3+
# - Sliding window is algorithm-agnostic — no version matters


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Pattern                │ Example problem                     |
# ─────────────────────────────────────────────────────────────
# | Opposite two-ptr       │ Two-sum sorted, palindrome,         |
# |                        │ container with most water           |
# | Fast/slow              │ Cycle detect, middle node,          |
# |                        │ find duplicate number               |
# | Read/write             │ Remove duplicates, move zeros,      |
# |                        │ remove element, partition           |
# | Fixed window           │ Max sum of k, sliding max (deque),  |
# |                        │ contains dup within k               |
# | Variable window        │ Longest unique substring, min       |
# |                        │ subarray sum ≥ k, longest k         |
# |                        │ distinct, min window substring      |
# ─────────────────────────────────────────────────────────────
# | Template element       │ Purpose                              |
# ─────────────────────────────────────────────────────────────
# | left = 0               │ Window start                        |
# | for right, x in enum   │ Window end grows each step          |
# | while INVALID: shrink  │ Restore window invariant            |
# | update best            │ After window is valid               |
# | return best / count    │ Final answer                        |
# ─────────────────────────────────────────────────────────────
# | Pitfall                       │ Why it bites                 |
# ─────────────────────────────────────────────────────────────
# | Sliding window with negatives │ Non-monotonic → invalid      |
# | Two-sum on unsorted           │ Wrong pair                   |
# | Container moves taller side   │ Misses optimum               |
# | Fast/slow without next check  │ AttributeError               |
# | Read/write on unsorted        │ Wrong output                 |
# | Set instead of Counter        │ Can't tell when 0 distinct   |
# | Missing `>= left` guard       │ Left moves backward          |
# | No `missing == 0` reset       │ Window shrinks incorrectly   |
# | Overlooking empty input       │ Wrong return type            |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Recognise patterns early: contiguous → window; sorted
#    pair → opposite pointers; in-place → read/write.
#  - Use the variable-window template every time — it's uniform.
#  - For fixed windows, prefer deque for max/min problems.
#  - Guard against negatives when sliding (window pattern does
#    not apply).
#  - Move the SHORTER side inward in max-area type problems.
#  - Use dict of last-index when you can jump instead of
#    shrink-one-at-a-time.
#  - Always test: empty, single element, all-same, no match.
#  - Complexities: two-pointer is O(n), sliding window is O(n)
#    total because left + right each move ≤ n steps.
#  - If you find yourself writing a nested loop over indices,
#    ask: "can two pointers do this in one pass?"
#  - Prefer Counter over manual dicts for frequency problems.
# ============================================================