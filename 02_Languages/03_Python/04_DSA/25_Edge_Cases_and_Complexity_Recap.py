# 25_Edge_Cases_and_Complexity_Recap.py

# ============================================================
#  📘 DSA MASTER RECAP — EDGE CASES, COMPLEXITY & CHEAT SHEETS
#
#  This final file is a wrap-up of the whole Python DSA series.
#  It collects: master complexity tables for every data
#  structure and algorithm, decision flowcharts, common edge
#  cases to always check, Python-specific performance gotchas,
#  interview patterns, and a short list of "red flag" mistakes.
#
#  Sections:
#   1. The DSA roadmap in one page
#   2. Data structure complexity cheat sheet
#   3. Algorithm complexity cheat sheet
#   4. Sorting algorithms recap
#   5. Graph algorithms recap
#   6. DP, greedy, and backtracking recap
#   7. Python performance gotchas
#   8. Universal edge-case checklist
#   9. Interview patterns & signal words
#  10. Master best-practices list
# ============================================================


# ============================================================
#  1️⃣ THE DSA ROADMAP IN ONE PAGE
# ============================================================
# 🔹 FOUNDATIONS
#     complexity → arrays/lists → strings → hashing → recursion
#
# 🔹 LINEAR STRUCTURES
#     stacks → queues/deques → linked lists
#
# 🔹 NON-LINEAR STRUCTURES
#     binary trees → BSTs → heaps → graphs → traversals → tries
#
# 🔹 ALGORITHMS
#     sorting → searching → two pointers → backtracking
#     → DP → greedy → bit manipulation → union-find
#     → shortest paths → topological sort
#
# 🧠 Learn in this order — each layer builds on the previous.
#    Master complexity first; everything else is pattern
#    recognition on top of it.


# ============================================================
#  2️⃣ DATA STRUCTURE COMPLEXITY CHEAT SHEET
# ============================================================
# ── List / Dynamic array ─────────────────────────────────────
# | Operation            │ Average       │ Notes               |
# |----------------------|---------------|---------------------|
# | xs[i]                │ O(1)          │ index               |
# | xs.append(x)         │ O(1) amort.   │ end                 |
# | xs.pop()             │ O(1)          │ from end            |
# | xs.insert(0, x)      │ O(n)          │ shifts              |
# | xs.pop(0)            │ O(n)          │ shifts              |
# | x in xs              │ O(n)          │ linear scan         |
# | xs.sort()            │ O(n log n)    │ Timsort             |
# | xs[a:b]              │ O(b-a)        │ slice copy          |
# ─────────────────────────────────────────────────────────────
#
# ── Dict / Set ───────────────────────────────────────────────
# | Operation            │ Average       │ Worst case          |
# |----------------------|---------------|---------------------|
# | d[k] / d[k] = v      │ O(1)          │ O(n) hash clash     |
# | k in d               │ O(1)          │ O(n)                |
# | del d[k]             │ O(1)          │ O(n)                |
# | iteration            │ O(n)          │ —                   |
# | s.add / s.discard    │ O(1)          │ O(n)                |
# | a | b / a & b        │ O(n + m)      │ —                   |
# ─────────────────────────────────────────────────────────────
#
# ── deque ────────────────────────────────────────────────────
# | Operation            │ Cost          │ Notes               |
# |----------------------|---------------|---------------------|
# | append / appendleft  │ O(1)          │ both ends           |
# | pop / popleft        │ O(1)          │ both ends           |
# | deque[i]             │ O(n)          │ NOT random access   |
# ─────────────────────────────────────────────────────────────
#
# ── Heap (heapq) ─────────────────────────────────────────────
# | Operation            │ Cost          │ Notes               |
# |----------------------|---------------|---------------------|
# | heappush             │ O(log n)      │                     |
# | heappop              │ O(log n)      │                     |
# | peek (h[0])          │ O(1)          │                     |
# | heapify              │ O(n)          │ bulk build          |
# | nlargest / nsmallest │ O(n log k)    │ k << n              |
# ─────────────────────────────────────────────────────────────
#
# ── Trie ─────────────────────────────────────────────────────
# | Operation            │ Cost          │ Notes               |
# |----------------------|---------------|---------------------|
# | insert(word)         │ O(L)          │ L = word length     |
# | search(word)         │ O(L)          │ must end is_word    |
# | startsWith(prefix)   │ O(L)          │ path exists         |
# ─────────────────────────────────────────────────────────────
#
# ── Union-Find ───────────────────────────────────────────────
# | Operation            │ Cost          │ Notes               |
# |----------------------|---------------|---------------------|
# | find (with PC+rank)  │ O(α(n)) ≈ O(1)│ near constant       |
# | union                │ O(α(n))       │                     |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  3️⃣ ALGORITHM COMPLEXITY CHEAT SHEET
# ============================================================
# ── Searching ────────────────────────────────────────────────
# | Algorithm              │ Pre-req         │ Time          |
# |------------------------|-----------------|---------------|
# | Linear search          │ none            │ O(n)          |
# | Binary search          │ sorted          │ O(log n)      |
# | Lower/upper bound      │ sorted          │ O(log n)      |
# | Rotated binary search  │ rotated sorted  │ O(log n)      |
# ─────────────────────────────────────────────────────────────
#
# ── Sorting ──────────────────────────────────────────────────
# | Algorithm      │ Best      │ Avg       │ Worst     │ Space   │ Stable |
# |----------------|-----------|-----------|-----------|---------|--------|
# | Bubble         │ O(n)      │ O(n²)     │ O(n²)     │ O(1)    │ Yes    |
# | Selection      │ O(n²)     │ O(n²)     │ O(n²)     │ O(1)    │ No     |
# | Insertion      │ O(n)      │ O(n²)     │ O(n²)     │ O(1)    │ Yes    |
# | Merge          │ O(nlogn)  │ O(nlogn)  │ O(nlogn)  │ O(n)    │ Yes    |
# | Quick          │ O(nlogn)  │ O(nlogn)  │ O(n²)     │ O(logn) │ No     |
# | Heap           │ O(nlogn)  │ O(nlogn)  │ O(nlogn)  │ O(1)    │ No     |
# | Counting       │ O(n+k)    │ O(n+k)    │ O(n+k)    │ O(k)    │ Yes    |
# | Radix          │ O(d(n+b)) │ O(d(n+b)) │ O(d(n+b)) │ O(n+b)  │ Yes    |
# | Timsort (Py)   │ O(n)      │ O(nlogn)  │ O(nlogn)  │ O(n)    │ Yes    |
# ─────────────────────────────────────────────────────────────
#
# ── String / Array patterns ──────────────────────────────────
# | Pattern              │ Time      │ Notes                     |
# |----------------------|-----------|---------------------------|
# | Two pointers (opp.)  │ O(n)      │ sorted pair, palindrome   |
# | Fast/slow pointers   │ O(n)      │ cycle, middle             |
# | Read/write pointers  │ O(n)      │ dedup, partition          |
# | Fixed window         │ O(n)      │ max sum of k              |
# | Variable window      │ O(n)      │ longest/shortest subarray |
# | Prefix sums          │ O(n) prep │ O(1) range query          |
# ─────────────────────────────────────────────────────────────


# ============================================================
#  4️⃣ SORTING ALGORITHMS RECAP
# ============================================================
# 🔹 Python code → ALWAYS use sorted() / list.sort() (Timsort).
# 🔸 Roll your own only for interviews or special structures.
#
# 🧠 Decision guide:
#   - Small / nearly sorted         → insertion sort
#   - General, stable, guaranteed   → merge sort (or Timsort)
#   - In-place, fast avg            → quick sort (random pivot)
#   - Guaranteed + O(1) space       → heap sort
#   - Integers in small range       → counting sort
#   - Fixed-width ints              → radix sort
#   - Uniform floats                → bucket sort
#
# ⚠️ Memory tool:
#   - "sort() returns None" — the classic bug.
#   - "sorted(xs)[::-1]" copies twice — use reverse=True.
#   - cmp_to_key for legacy comparisons; prefer key=.
#   - Multi-key: return a tuple from key=, negate numeric parts.


# ============================================================
#  5️⃣ GRAPH ALGORITHMS RECAP
# ============================================================
# | Problem                  │ Algorithm                       |
# |--------------------------|---------------------------------|
# | Traverse a graph         │ BFS (queue) / DFS (stack/rec)   |
# | Shortest (unweighted)    │ BFS                             |
# | Shortest (0/1 weights)   │ 0-1 BFS (deque)                 |
# | Shortest (≥0 weights)    │ Dijkstra                        |
# | Shortest (negative ok)   │ Bellman-Ford                    |
# | All-pairs shortest       │ Floyd-Warshall (small V)        |
# | Single target + heur.    │ A*                              |
# | Connected components     │ DFS / BFS / Union-Find          |
# | Cycle (undirected)       │ DFS parent / DSU                |
# | Cycle (directed)         │ DFS colours / Kahn's leftovers  |
# | Topological order        │ Kahn's / DFS postorder          |
# | MST                      │ Kruskal (DSU) / Prim (heap)     |
# | Bipartite check          │ BFS / DFS 2-colouring           |
# | Bridges / articulation   │ Tarjan's algorithm              |
# | SCCs                     │ Tarjan / Kosaraju               |
#
# 🧠 Complexity summary:
#   - BFS / DFS       → O(V + E)
#   - Dijkstra        → O((V + E) log V)
#   - Bellman-Ford    → O(V · E)
#   - Floyd-Warshall  → O(V³)
#   - Kahn's          → O(V + E)
#   - Kruskal         → O(E log E)
#   - Prim            → O(E log V)


# ============================================================
#  6️⃣ DP, GREEDY, AND BACKTRACKING RECAP
# ============================================================
# ── DP quick reference ───────────────────────────────────────
# | Problem               │ State        │ Recurrence            |
# |-----------------------|--------------|-----------------------|
# | Fibonacci             │ dp[i]        │ dp[i-1]+dp[i-2]       |
# | Climbing stairs       │ dp[i]        │ dp[i-1]+dp[i-2]       |
# | 0/1 Knapsack          │ dp[i][w]     │ take/skip             |
# | Unbounded knapsack    │ dp[w]        │ forward iterate       |
# | Coin change (min)     │ dp[a]        │ min(dp[a-c]+1)        |
# | Coin change (ways)    │ dp[a]        │ Σ dp[a-c]             |
# | LIS (n²)              │ dp[i]        │ max dp[j]+1           |
# | LIS (n log n)         │ tails        │ bisect_left           |
# | LCS                   │ dp[i][j]     │ match diag+1          |
# | Edit distance         │ dp[i][j]     │ 1+min(del/ins/sub)    |
# | House robber          │ dp[i]        │ max(skip,take)        |
# | Partition (subset)    │ dp[w] bool   │ reachable             |
# ─────────────────────────────────────────────────────────────
#
# ── Greedy quick reference ───────────────────────────────────
# | Problem               │ Greedy key                       |
# |-----------------------|----------------------------------|
# | Activity selection    │ sort by END                      |
# | Merge intervals       │ sort by START                    |
# | Fractional knapsack   │ sort by value/weight desc        |
# | Huffman coding        │ merge two smallest (heap)        |
# | Jump game I/II        │ track farthest reach             |
# | Gas station           │ reset start when tank < 0        |
# | Min platforms         │ sort + two pointers              |
# ─────────────────────────────────────────────────────────────
#
# ── Backtracking template ────────────────────────────────────
#     def backtrack(path, choices):
#         if is_goal(path): result.append(path[:]); return
#         for c in choices:
#             if not valid(path, c): continue
#             path.append(c)
#             backtrack(path, next_choices(c))
#             path.pop()
#
# 🧠 Snapshot (path[:]) + undo (path.pop) — the whole game.


# ============================================================
#  7️⃣ PYTHON PERFORMANCE GOTCHAS
# ============================================================
# 🔹 The 10 things that slow Python DSA code the most:
#   1. list.pop(0) / list.insert(0, x) → O(n). Use deque.
#   2. "s += x" in a loop → O(n²). Use "".join(list).
#   3. `x in list` in a loop → O(n²). Use set/dict.
#   4. Slicing big lists in loops → O(n) copies.
#   5. Nested list comprehensions past 2 levels → readability.
#   6. Recursive DFS on deep graphs → RecursionError.
#   7. Deep recursion in backtracking → use sys.setrecursionlimit
#      carefully, or convert.
#   8. Reading list length every iteration → cache it.
#   9. Using list as a queue → deque.
#  10. Sorting when you only need the k smallest/largest →
#      heapq.nsmallest/nlargest.
#
# 🔹 Micro-tips:
#   - Local variables are faster than globals.
#   - dict.get(k, default) beats try/except for one-off lookups.
#   - enumerate + zip beat range(len(x)).
#   - `math.inf` for sentinel, never a huge int like 10**9.
#   - `int.bit_count()` (3.10+) beats bin(x).count('1').
#   - `functools.lru_cache` for memo — free speedup.
#   - `functools.cached_property` for expensive class properties.
#   - `collections.Counter` for counting — C-speed.
#   - `collections.defaultdict` for grouping — cleaner code.
#   - `heapq.nlargest/nsmallest` when k << n.

# 🔸 Big-O in Python is about CALLS, not lines. A tight loop
#    calling built-ins is often faster than a shorter Python loop.


# ============================================================
#  8️⃣ UNIVERSAL EDGE-CASE CHECKLIST
# ============================================================
# 🔹 For EVERY problem, mentally test:
#     ☐ Empty input         ([], "", {}, 0, None)
#     ☐ Single element      ([1], "a", node alone)
#     ☐ Two elements        (smallest interesting case)
#     ☐ All elements equal  (duplicates, ties)
#     ☐ Sorted input        (worst/best case for some algorithms)
#     ☐ Reverse-sorted      (worst case for some algorithms)
#     ☐ Very large n        (check complexity)
#     ☐ Negative / zero     (if numeric)
#     ☐ Boundary indices    (i=0, i=n-1, i=n)
#     ☐ Disconnected input  (graph with isolated nodes)
#     ☐ Cycle present       (graph / linked list)
#     ☐ Overflow not a thing in Python — but negative vs positive
#
# 🔹 For strings specifically:
#     ☐ Unicode / emoji
#     ☐ Whitespace / empty tokens
#     ☐ Case sensitivity
#     ☐ Multiple spaces between words
#     ☐ Leading / trailing whitespace
#
# 🔹 For graphs specifically:
#     ☐ Directed or undirected?
#     ☐ Weighted or unweighted?
#     ☐ Negative weights?
#     ☐ Self-loops?
#     ☐ Multi-edges?
#     ☐ Isolated vertices?


# ============================================================
#  9️⃣ INTERVIEW PATTERNS & SIGNAL WORDS
# ============================================================
# | Signal in question                │ Likely pattern         |
# |------------------------------------|------------------------|
# | "sorted"                           │ binary search / two-pt |
# | "contiguous subarray / substring"  │ sliding window         |
# | "seen before" / "count"            │ hashmap / set          |
# | "unique"                           │ set                    |
# | "top k"                            │ heap                   |
# | "min/max in window"                │ deque (monotonic)      |
# | "levels" / "shortest path (uw)"    │ BFS                    |
# | "depth-first" / "backtrack"        │ DFS / recursion        |
# | "before / after / depends"         │ topological sort       |
# | "connected groups"                 │ Union-Find / DFS       |
# | "minimum cost path"                │ Dijkstra               |
# | "negative weights"                 │ Bellman-Ford           |
# | "optimal / min / max"              │ DP or greedy           |
# | "count ways"                       │ DP                     |
# | "all permutations / subsets"       │ backtracking           |
# | "cyclic / repeated"                │ Floyd's / cycle detect |
# | "prefix"                           │ trie                   |
# | "single number"                    │ XOR                    |
# | "minimise maximum" / "max min"     │ binary search on answer|
# | "in place, O(1) space"             │ two pointers           |
# | "stream / online"                  │ hashmap + queue        |
#
# 🧠 Recognition matters more than memorisation. If you can name
#    the pattern in the first 30 seconds, the code writes itself.


# ============================================================
#  🔟 MASTER BEST-PRACTICES LIST
# ============================================================
# 🔹 General
#    - State complexity in your head BEFORE you write code.
#    - Prefer simple, readable solutions first; optimise later.
#    - Know your built-ins and their costs.
#    - Fail fast: validate inputs early.
#    - Test with edge cases every time.
#
# 🔹 Data structures
#    - set / dict for membership and counts.
#    - deque for queues and monotonic stacks.
#    - heapq for priority / top-k.
#    - Counter for frequency.
#    - defaultdict for grouping.
#    - Union-Find for dynamic connectivity.
#    - Trie for prefix operations.
#
# 🔹 Algorithms
#    - BFS for unweighted shortest paths.
#    - Dijkstra for non-negative weights.
#    - Bellman-Ford for negative weights.
#    - Floyd-Warshall for all-pairs (small V).
#    - Kahn's or DFS-colours for topological order.
#    - Binary search on the answer for "minimise max".
#    - DP when greedy fails; greedy when provable.
#    - Backtracking for "all X" with pruning.
#
# 🔹 Python idioms
#    - "".join(list) not += for strings.
#    - [x for x in xs if ...] not manual append loops.
#    - enumerate / zip not range(len(xs)).
#    - Use heapq.nlargest for top-k.
#    - Use bisect for binary search on sorted lists.
#    - Use lru_cache for memoisation.
#    - Use f-strings for debugging output.
#
# 🔹 Mindset
#    - Every problem is a graph, a DP, or a two-pointer in
#      disguise.
#    - If you're tempted to write nested loops over indices,
#      ask: "can hashing / two pointers / a heap do this in
#      one pass?"
#    - If recursion feels natural but data is huge, convert
#      to iterative or DP.
#    - When stuck, brute force first — then optimise.
#    - Explain your reasoning — interviewers grade thinking,
#      not just code.


# ============================================================
#  📌 FINAL RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Topic                │ Delivered in file                  |
# ─────────────────────────────────────────────────────────────
# | Big-O & complexity   │ 01_Complexity_Analysis_BigO        |
# | Arrays & lists       │ 02_Arrays_and_Lists                |
# | Strings              │ 03_Strings                         |
# | Hashing              │ 04_Hashing_Dicts_and_Sets          |
# | Recursion basics     │ 05_Recursion_Basics                |
# | Stacks               │ 06_Stacks                          |
# | Queues & deques      │ 07_Queues_and_Deques               |
# | Linked lists         │ 08_Linked_Lists                    |
# | Binary trees         │ 09_Binary_Trees                    |
# | BSTs                 │ 10_Binary_Search_Trees             |
# | Heaps                │ 11_Heaps_and_Priority_Queues       |
# | Graphs (basics)      │ 12_Graphs_Basics                   |
# | BFS / DFS            │ 13_Graph_Traversals_BFS_DFS        |
# | Tries                │ 14_Tries                           |
# | Sorting              │ 15_Sorting_Algorithms              |
# | Searching            │ 16_Searching_Algorithms            |
# | Two pointers/window  │ 17_Two_Pointers_and_Sliding_Window |
# | Backtracking         │ 18_Recursion_and_Backtracking      |
# | Dynamic Programming  │ 19_Dynamic_Programming_Intro       |
# | Greedy               │ 20_Greedy_Algorithms               |
# | Bit manipulation     │ 21_Bit_Manipulation                |
# | Union-Find           │ 22_Union_Find_Disjoint_Set         |
# | Shortest paths       │ 23_Shortest_Paths_Dijkstra_Bellman |
# | Topological sort     │ 24_Topological_Sort                |
# | Recap (this file)    │ 25_Edge_Cases_and_Complexity_Recap |
# ─────────────────────────────────────────────────────────────
#
# 🧠 FINAL WORDS
#  - You now have a complete DSA toolkit in Python.
#  - Revisit each file, but don't memorise code — memorise
#    PATTERNS.
#  - Practise on LeetCode / HackerRank / Codeforces.
#  - Aim for: read a problem → recognise the pattern → code
#    it in one pass → validate edge cases.
#  - Comfort with complexity analysis separates juniors from
#    seniors. Lean into it.
# ============================================================