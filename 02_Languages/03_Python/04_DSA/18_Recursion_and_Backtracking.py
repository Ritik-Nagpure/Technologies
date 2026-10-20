# 18_Recursion_and_Backtracking.py

# ============================================================
#  📘 RECURSION & BACKTRACKING IN PYTHON — COMPLETE COVERAGE
#
#  BACKTRACKING is systematic trial-and-error: build a solution
#  one choice at a time; if a choice leads to a dead end, UNDO
#  it and try the next. It's DFS over the space of partial
#  solutions, with pruning. Backtracking solves constraint
#  problems: permutations, combinations, sudoku, N-queens,
#  word search, subset sums.
#
#  This file covers: backtracking template, permutations,
#  combinations, subsets, N-queens, sudoku, word search,
#  palindrome partitioning, and the pruning principles that
#  keep the search space manageable.
#
#  Sections:
#   1. Backtracking vs plain recursion
#   2. The universal template
#   3. Subsets (power set)
#   4. Permutations
#   5. Combinations (n choose k)
#   6. Combination sum (with pruning)
#   7. Palindrome partitioning
#   8. N-Queens (classic)
#   9. Sudoku solver (harder)
#  10. Word search in a grid
#  11. Pattern recognition & pruning guide
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ BACKTRACKING VS PLAIN RECURSION
# ============================================================
# 🔹 Plain recursion: solve a subproblem, return its answer.
# 🔹 Backtracking: EXPLORE choices, PRUNE, and UNDO.
# 🔸 Backtracking is recursion + a mutable "path" + undo step.
# 🎯 It's brute force with pruning — often exponential worst
#    case, but the early exit makes real cases tractable.

# 🧠 Every backtracking problem has:
#     - a CHOICE at each step (which element, which digit, ...)
#     - CONSTRAINTS that prune invalid choices
#     - a GOAL state (path is a valid complete solution)
#     - an UNDO step (restore state before returning)


# ============================================================
#  2️⃣ THE UNIVERSAL TEMPLATE
# ============================================================
# 🔹 Pattern (memorise this):

def backtrack_template(path: list, choices: list, result: list) -> None:
    if is_goal(path):                       # ✅ solution reached
        result.append(path[:])              # snapshot!
        return
    for c in choices:
        if not is_valid(path, c):           # pruning
            continue
        path.append(c)                      # choose
        backtrack_template(path, next_choices(c), result)  # explore
        path.pop()                          # UNCHOOSE (undo)

# 🔸 Non-mutating alternative: pass a new list down.

# ⚠️ ALWAYS snapshot `path[:]` when appending to results —
#    otherwise later mutations corrupt earlier entries.
# ⚠️ ALWAYS undo what you changed (append ↔ pop, mark ↔ unmark,
#    grid[r][c] = "#" ↔ restore).
# 🧠 Rule: "mutate before recurse, restore after recurse".

# ---------- Helper stubs (for the template to parse) ----------
def is_goal(path: list) -> bool: return False
def is_valid(path: list, c: object) -> bool: return True
def next_choices(c: object) -> list: return []


# ============================================================
#  3️⃣ SUBSETS (POWER SET)
# ============================================================
# 🔹 Every element is either IN or OUT.
# 🔸 Binary choice → 2^n subsets.
# 🎯 Foundation for subset-sum, partition, k-partition.

def subsets(xs: list[int]) -> list[list[int]]:
    result: list[list[int]] = []

    def backtrack(start: int, path: list[int]) -> None:
        result.append(path[:])              # every prefix is a subset
        for i in range(start, len(xs)):
            path.append(xs[i])
            backtrack(i + 1, path)          # i+1 = no reuse
            path.pop()

    backtrack(0, [])
    return result

print(subsets([1, 2, 3]))
# [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]

# 🔸 Subsets WITHOUT duplicates (input may have dupes)
def subsets_with_dup(xs: list[int]) -> list[list[int]]:
    xs = sorted(xs)
    result: list[list[int]] = []

    def backtrack(start: int, path: list[int]) -> None:
        result.append(path[:])
        for i in range(start, len(xs)):
            if i > start and xs[i] == xs[i - 1]:
                continue                    # skip duplicate branch
            path.append(xs[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result

print(subsets_with_dup([1, 2, 2]))
# [[], [1], [1,2], [1,2,2], [2], [2,2]]

# 🧠 Dedup trick: "if i > start and xs[i] == xs[i-1]: continue".
#    Used everywhere in backtracking with duplicates.


# ============================================================
#  4️⃣ PERMUTATIONS
# ============================================================
# 🔹 Order matters; choose from remaining elements.
# 🔸 n! permutations.
# 🎯 Anagram groups, next-permutation, scheduling.

def permutations(xs: list[int]) -> list[list[int]]:
    result: list[list[int]] = []

    def backtrack(path: list[int], used: list[bool]) -> None:
        if len(path) == len(xs):
            result.append(path[:])
            return
        for i, x in enumerate(xs):
            if used[i]:
                continue
            used[i] = True
            path.append(x)
            backtrack(path, used)
            path.pop()
            used[i] = False                 # UNDO

    backtrack([], [False] * len(xs))
    return result

print(permutations([1, 2, 3]))
# [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

# 🔸 Permutations with duplicates (input may have dupes)
def permutations_unique(xs: list[int]) -> list[list[int]]:
    xs = sorted(xs)
    result: list[list[int]] = []
    used = [False] * len(xs)

    def backtrack(path: list[int]) -> None:
        if len(path) == len(xs):
            result.append(path[:])
            return
        for i, x in enumerate(xs):
            if used[i]:
                continue
            # Skip duplicate element at the same level
            if i > 0 and xs[i] == xs[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            path.append(x)
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result

print(permutations_unique([1, 1, 2]))
# [[1,1,2],[1,2,1],[2,1,1]]

# 🧠 `used` array tracks which elements are already in the path.
#    Dedup trick: skip duplicate at the same level if the
#    previous identical wasn't used yet.


# ============================================================
#  5️⃣ COMBINATIONS (N CHOOSE K)
# ============================================================
# 🔹 Order does NOT matter; choose k from n.
# 🔸 C(n, k) results.
# 🎯 Lottery, grouping, k-sums.

def combinations(n: int, k: int) -> list[list[int]]:
    result: list[list[int]] = []

    def backtrack(start: int, path: list[int]) -> None:
        if len(path) == k:
            result.append(path[:])
            return
        # Pruning: not enough numbers left
        remaining = k - len(path)
        for i in range(start, n - remaining + 2):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()

    backtrack(1, [])
    return result

print(combinations(4, 2))
# [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

# 🧠 The range bound `n - remaining + 2` prunes branches that
#    can't possibly reach k elements. Small change, big speedup.
#    Without it: still correct, but ~30% more work in tight cases.


# ============================================================
#  6️⃣ COMBINATION SUM (WITH PRUNING)
# ============================================================
# 🔹 Find all combos that sum to target.
# 🔸 Variant 1: elements reusable (unbounded).
# 🔸 Variant 2: each element used once.

# 🔸 Unbounded: candidates may be reused
def combination_sum_unbounded(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    result: list[list[int]] = []

    def backtrack(start: int, remaining: int, path: list[int]) -> None:
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:               # pruned: sorted!
                break
            path.append(c)
            backtrack(i, remaining - c, path)   # i (reuse allowed)
            path.pop()

    backtrack(0, target, [])
    return result

print(combination_sum_unbounded([2, 3, 6, 7], 7))
# [[2,2,3], [7]]

# 🔸 Each element used at most once
def combination_sum_unique(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    result: list[list[int]] = []

    def backtrack(start: int, remaining: int, path: list[int]) -> None:
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue                    # dedup at same level
            c = candidates[i]
            if c > remaining:               # prune
                break
            path.append(c)
            backtrack(i + 1, remaining - c, path)   # i+1: no reuse
            path.pop()

    backtrack(0, target, [])
    return result

print(combination_sum_unique([10, 1, 2, 7, 6, 1, 5], 8))
# [[1,1,6], [1,2,5], [1,7], [2,6]]

# 🧠 Pruning is EVERYTHING in combination sum:
#    - Sort first.
#    - If c > remaining → break (nothing bigger will fit).
#    - Dedup with the "i > start and same as previous" rule.


# ============================================================
#  7️⃣ PALINDROME PARTITIONING
# ============================================================
# 🔹 Split a string into all possible palindrome substrings.
# 🔸 Backtracking over cut positions.

def palindrome_partition(s: str) -> list[list[str]]:
    result: list[list[str]] = []

    def is_pal(l: int, r: int) -> bool:
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1; r -= 1
        return True

    def backtrack(start: int, path: list[str]) -> None:
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start, len(s)):
            if not is_pal(start, end):
                continue                    # prune: not a palindrome
            path.append(s[start:end + 1])
            backtrack(end + 1, path)
            path.pop()

    backtrack(0, [])
    return result

print(palindrome_partition("aab"))
# [['a','a','b'], ['aa','b']]
print(palindrome_partition("a"))
# [['a']]

# 🧠 Nice example of pruning: skip non-palindrome prefixes so
#    the branching factor stays small.


# ============================================================
#  8️⃣ N-QUEENS (CLASSIC)
# ============================================================
# 🔹 Place N queens on an N×N board so no two attack each other.
# 🔸 Backtrack row by row; track columns and both diagonals.
# 🎯 The canonical "hard" backtracking problem.

def solve_n_queens(n: int) -> list[list[str]]:
    result: list[list[str]] = []
    cols: set[int] = set()
    diag1: set[int] = set()                 # r - c
    diag2: set[int] = set()                 # r + c

    def backtrack(row: int, board: list[list[str]]) -> None:
        if row == n:
            result.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue                    # attacked → prune
            # Place
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            board[row][col] = "Q"
            backtrack(row + 1, board)
            # Undo
            board[row][col] = "."
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)

    empty = [["."] * n for _ in range(n)]
    backtrack(0, empty)
    return result

solutions = solve_n_queens(4)
for sol in solutions:
    for r in sol:
        print(r)
    print()
# .Q..
# ...Q
# Q...
# ..Q.
#
# ..Q.
# Q...
# ...Q
# .Q..

print(len(solve_n_queens(8)))               # 92

# 🧠 Diagonal hashing: r - c constant on ↘ diagonal; r + c
#    constant on ↙ diagonal. Set membership = O(1) check.
# 🔸 Pruning via O(1) attack checks is what makes N-Queens fast
#    up to N ≈ 15.


# ============================================================
#  9️⃣ SUDOKU SOLVER
# ============================================================
# 🔹 Fill a 9×9 grid with 1–9, respecting row/col/box constraints.
# 🔸 Backtracking with validity check — finds one solution.

def solve_sudoku(board: list[list[str]]) -> bool:
    def valid(r: int, c: int, ch: str) -> bool:
        for i in range(9):
            if board[r][i] == ch: return False       # row
            if board[i][c] == ch: return False       # col
        br, bc = 3 * (r // 3), 3 * (c // 3)
        for i in range(br, br + 3):
            for j in range(bc, bc + 3):
                if board[i][j] == ch: return False   # box
        return True

    def backtrack() -> bool:
        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    for ch in "123456789":
                        if valid(r, c, ch):
                            board[r][c] = ch
                            if backtrack():
                                return True
                            board[r][c] = "."        # undo
                    return False                     # no digit works
        return True                                  # nothing empty

    return backtrack()

puzzle = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"],
]
solve_sudoku(puzzle)
for row in puzzle:
    print(" ".join(row))
# 5 3 4 6 7 8 9 1 2
# 6 7 2 1 9 5 3 4 8
# 1 9 8 3 4 2 5 6 7
# 8 5 9 7 6 1 4 2 3
# 4 2 6 8 5 3 7 9 1
# 7 1 3 9 2 4 8 5 6
# 9 6 1 5 3 7 2 8 4
# 2 8 7 4 1 9 6 3 5
# 3 4 5 2 8 6 1 7 9

# 🧠 Optimisation: pick the cell with the FEWEST options
#    (MRV heuristic). Turns seconds into milliseconds for
#    hard puzzles.
# 🔸 Constraint propagation (box/row/col elimination) helps too.


# ============================================================
#  🔟 WORD SEARCH IN A GRID
# ============================================================
# 🔹 Given a grid and a word, is the word formable by adjacent
#    (up/down/left/right) cells without reusing a cell?
# 🔸 Classic DFS + backtracking.

def word_search(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])

    def dfs(r: int, c: int, i: int) -> bool:
        if i == len(word):
            return True                     # matched all letters
        if not (0 <= r < rows and 0 <= c < cols):
            return False
        if board[r][c] != word[i]:
            return False
        # Mark visited
        saved = board[r][c]
        board[r][c] = "#"
        # Explore all 4 directions
        found = (dfs(r + 1, c, i + 1) or
                 dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or
                 dfs(r, c - 1, i + 1))
        board[r][c] = saved                 # UNDO
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False

grid = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
]
print(word_search(grid, "ABCCED"))          # True
print(word_search(grid, "SEE"))             # True
print(word_search(grid, "ABCB"))            # False

# 🧠 Snapshot the cell, mark "#", recurse, then RESTORE. That's
#    the backtracking undo in action.
# ⚠️ Don't forget the restore, or subsequent searches fail.


# ============================================================
#  1️⃣1️⃣ PATTERN RECOGNITION & PRUNING GUIDE
# ============================================================
# 🔹 "Generate all ..."                → backtracking.
# 🔹 "All permutations / subsets"      → backtrack with used[].
# 🔹 "All combinations of size k"      → backtrack with start.
# 🔹 "Constraint satisfaction"         → backtrack + prune.
# 🔹 "Find one valid solution"         → DFS + early return True.
# 🔹 "Grid path search"                → DFS + mark/restore.
# 🔹 "Split into parts"                → backtrack on cut points.

# 🔸 Pruning checklist:
#    1. Sort input → break early when too big.
#    2. Skip duplicates: "i > start and xs[i]==xs[i-1]".
#    3. Bounds: stop when partial sum exceeds target.
#    4. Constraint checks (N-Queens, Sudoku): O(1) sets.
#    5. Ordering heuristic (MRV): pick most constrained first.
#    6. Memoise when subproblems overlap.

# ── Complexity reference ─────────────────────────────────────
# | Problem                 │ Output size  │ Notes             |
# |-------------------------|--------------|-------------------|
# | Subsets                 │ 2^n          │ O(n) per subset   |
# | Permutations            │ n!           │ used[] tracking   |
# | Combinations C(n,k)     │ C(n,k)       │ pruning helps     |
# | Combination sum         │ varies       │ sort + prune      |
# | Palindrome partition    │ O(2^n) worst │ palindrome check  |
# | N-Queens (N=8)          │ 92 solutions │ O(N!) worst       |
# | Sudoku                  │ 1 solution   │ backtrack + MRV   |
# | Word search             │ bool         │ DFS + undo        |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Forgetting `path.pop()` → results contain wrong prefixes.
# ⚠️ Forgetting to append `path[:]` (copy) → all results are
#    the SAME (empty) list. Snapshot every time.
# ⚠️ Forgetting to reset `used[i] = False` → later paths skip
#    valid elements.
# ⚠️ Grid: forgetting to restore the cell → subsequent DFS
#    corrupted.
# ⚠️ Pruning with sort: if the array isn't sorted, `break` on
#    `c > remaining` is WRONG.
# ⚠️ Dedup: `i > start and xs[i] == xs[i-1]` only works when
#    the array is sorted.
# ⚠️ Empty input: subsets([[]]) returns [[]]; permutations([])
#    returns [[]]; combinations(n, 0) returns [[]].
# ⚠️ Deep recursion: backtracking hits the recursion limit on
#    large inputs. Python's default ~1000 is usually fine for
#    n ≤ ~15; use iterative for larger.
# ⚠️ Exponential blow-up: n=20 subsets = 1M; n=25 ≈ 33M. Too
#    big for Python. Recognise when the problem is not meant
#    to be brute-forced.
# ⚠️ `used` array vs set — for indices, list[bool] is faster.
# ⚠️ N-Queens diagonal hashes: r+c and r-c uniquely identify
#    diagonals.
# ⚠️ Sudoku: MRV heuristic (fewest options first) makes a huge
#    difference on hard puzzles.
# ⚠️ Word search: `saved = board[r][c]` before overwriting with
#    "#", then restore. Don't skip the restore.
# ⚠️ Result ordering matters for tests: match the problem's
#    expected order (lexicographic, input order, etc.).
# ⚠️ Memory: results list of lists of size 2^n can exhaust
#    memory for large n. Consider a generator (yield).

# 🕒 Version notes
# - Generators (yield) for backtracking: Python 2.2+
# - Nonlocal keyword for closures: Python 3.0+
# - PEP 604 unions: Python 3.10+
#   For 3.9 and below, use Optional[...] / List[...]
# - f-strings help debug printable paths: Python 3.6+
# - `itertools.permutations` / `combinations` / `product` are
#   C-speed shortcuts when you don't need custom pruning
# - `functools.lru_cache` for memoised backtracking: 3.2+
# - `functools.cache`: Python 3.9+
# - Recursion limit default ~1000; use sys.setrecursionlimit
#   with care

# 🔎 Python stdlib shortcut — when pruning isn't needed:
from itertools import permutations as perms, combinations as combos, product

print(list(perms([1, 2, 3])))               # all 6 permutations
print(list(combos([1, 2, 3], 2)))           # [(1,2),(1,3),(2,3)]
print(list(product([1, 2], repeat=2)))      # [(1,1),(1,2),(2,1),(2,2)]

# 🧠 Use itertools when you DON'T need to prune per-branch.
#    Roll your own only when the search tree must be pruned.


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Problem               │ Path tracking       │ Prune trick    |
# ─────────────────────────────────────────────────────────────
# | Subsets               │ path list           │ start index    |
# | Subsets (dup input)   │ path list           │ skip dup level |
# | Permutations          │ used[] array        │ —              |
# | Permutations (dup)    │ used[] array        │ skip if prev   |
# |                       │                     │ not used       |
# | Combinations          │ start index         │ range bound    |
# | Combination sum       │ start + remaining   │ sort + break   |
# | Palindrome partition  │ cut pointer         │ palindrome test|
# | N-Queens              │ board + sets        │ O(1) attack    |
# | Sudoku                │ board               │ MRV heuristic  |
# | Word search           │ grid + mark         │ restore cell   |
# ─────────────────────────────────────────────────────────────
# | Step                  │ Meaning                             |
# ─────────────────────────────────────────────────────────────
# | choose                │ path.append(c) / board[r][c]=ch     |
# | explore               │ backtrack(recurse)                  |
# | unchoose (undo)       │ path.pop() / board[r][c]=saved      |
# | prune                 │ `continue` on invalid / break on   |
# |                       │ sorted bound                        |
# | snapshot              │ result.append(path[:])              |
# ─────────────────────────────────────────────────────────────
# | Pitfall                       │ Why it bites                 |
# ─────────────────────────────────────────────────────────────
# | path.pop() forgotten          │ Wrong results appended       |
# | path[:] copy forgotten        │ All results are the same list|
# | used[i] not reset             │ Wrong permutations           |
# | grid not restored             │ Broken later searches        |
# | Dedup without sorting         │ Duplicates still appear      |
# | Break without sorted input    │ Miss valid combos            |
# | Recursion depth too high      │ RecursionError               |
# | Expecting 2^n for n=30        │ Memory/time blowup           |
# | Result order mismatch         │ Fails hidden tests           |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Memorise the template: choose → explore → unchoose.
#  - Always snapshot `path[:]` when appending to results.
#  - Always UNDO state before returning from a branch.
#  - Sort input before dedup; use the "skip same at same level"
#    rule.
#  - Prune early: bounds check, remaining sum check, constraint
#    sets.
#  - For N-Queens and Sudoku, O(1) checks via sets are crucial.
#  - For grid DFS, mark visited with a sentinel, restore after.
#  - Use itertools when you don't need custom pruning.
#  - Recognise exponential problems — don't bruteforce n=25.
#  - Watch the recursion limit; use sys.setrecursionlimit
#    carefully, or convert to iterative stack.
#  - Test: empty input, single element, duplicates, all-same,
#    and no-solution cases.
#  - Order results the way the problem expects (usually input
#    order or lexicographic).
# ============================================================