// 25_Edge_Cases_and_Complexity_Recap.ts

/* ============================================================
 *  📘 DSA MASTER RECAP — EDGE CASES, COMPLEXITY & CHEAT SHEETS
 *
 *  This final file is a wrap-up of the whole TypeScript DSA
 *  series. It collects: master complexity tables for every data
 *  structure and algorithm, decision flowcharts, common edge
 *  cases to always check, JS/TS-specific performance gotchas,
 *  interview patterns, and a short list of "red flag" mistakes.
 *
 *  Sections:
 *   1. The DSA roadmap in one page
 *   2. Data structure complexity cheat sheet
 *   3. Algorithm complexity cheat sheet
 *   4. Sorting algorithms recap
 *   5. Graph algorithms recap
 *   6. DP, greedy, and backtracking recap
 *   7. JS/TS performance gotchas
 *   8. Universal edge-case checklist
 *   9. Interview patterns & signal words
 *  10. Master best-practices list
 * ============================================================ */


/* ============================================================
 *  1️⃣ THE DSA ROADMAP IN ONE PAGE
 * ============================================================ */
// 🔹 FOUNDATIONS
//     complexity → arrays/lists → strings → hashing → recursion
//
// 🔹 LINEAR STRUCTURES
//     stacks → queues/deques → linked lists
//
// 🔹 NON-LINEAR STRUCTURES
//     binary trees → BSTs → heaps → graphs → traversals → tries
//
// 🔹 ALGORITHMS
//     sorting → searching → two pointers → backtracking
//     → DP → greedy → bit manipulation → union-find
//     → shortest paths → topological sort
//
// 🧠 Learn in this order — each layer builds on the previous.
//    Master complexity first; everything else is pattern
//    recognition on top of it.


/* ============================================================
 *  2️⃣ DATA STRUCTURE COMPLEXITY CHEAT SHEET
 * ============================================================ */
// ── Array (JS Array) ─────────────────────────────────────────
// | Operation            │ Average       │ Notes               |
// |----------------------|---------------|---------------------|
// | arr[i]               │ O(1)          │ index               |
// | arr.push(x)          │ O(1) amort.   │ end                 |
// | arr.pop()            │ O(1)          │ from end            |
// | arr.unshift(x)       │ O(n)          │ shifts              |
// | arr.shift()          │ O(n)          │ shifts              |
// | arr.includes(x)      │ O(n)          │ linear scan         |
// | arr.indexOf(x)       │ O(n)          │ linear scan         |
// | arr.sort(cmp)        │ O(n log n)    │ Timsort             |
// | arr.slice(a, b)      │ O(b-a)        │ copy                |
// | arr.splice(i, k)     │ O(n)          │ shifts              |
// | arr.find(fn)         │ O(n)          │ linear scan         |
// | arr.map/filter       │ O(n)          │ new array           |
// | arr.reduce           │ O(n)          │ fold                |
// | arr.length           │ O(1)          │ cached              |
// ─────────────────────────────────────────────────────────────
//
// ── Map / Set ────────────────────────────────────────────────
// | Operation            │ Average       │ Notes               |
// |----------------------|---------------|---------------------|
// | map.get / map.set    │ O(1)          │ any key type        |
// | map.has / set.has    │ O(1)          │ —                   |
// | map.delete           │ O(1)          │ —                   |
// | iteration            │ O(n)          │ insertion order     |
// | map.size             │ O(1)          │ —                   |
// ─────────────────────────────────────────────────────────────
//
// ── Object as map (⚠️) ───────────────────────────────────────
// | Operation            │ Average       │ Notes               |
// |----------------------|---------------|---------------------|
// | obj[k] lookup        │ O(1)          │ key coerced to str  |
// | delete obj[k]        │ slow          │ hidden-class change |
// | iteration            │ O(n)          │ insertion order     |
// ─────────────────────────────────────────────────────────────
// 🧠 Prefer Map over Object for real hashmap work.
//
// ── String ───────────────────────────────────────────────────
// | Operation            │ Cost                                |
// |----------------------|-------------------------------------|
// | s + t                │ O(|s|+|t|) — copies!                |
// | s[i]                 │ O(1) — UTF-16 code unit             |
// | s.slice(a, b)        │ O(b-a)                              |
// | arr.join("")         │ O(total length) — preferred         |
// | s.replace(a, b)      │ O(n)                                |
// | s.split(sep)         │ O(n)                                |
// | s.includes(sub)      │ O(n·m) worst case                   |
// ─────────────────────────────────────────────────────────────
//
// ── Heap (via file 11 MinHeap / MaxHeap) ─────────────────────
// | Operation            │ Cost          │ Notes               |
// |----------------------|---------------|---------------------|
// | push (sift up)       │ O(log n)      │ —                   |
// | pop (sift down)      │ O(log n)      │ —                   |
// | peek                 │ O(1)          │ —                   |
// | heapify              │ O(n)          │ bulk build          |
// | pushPop / replace    │ O(log n)      │ combined ops        |
// ─────────────────────────────────────────────────────────────
//
// ── Trie ─────────────────────────────────────────────────────
// | Operation            │ Cost          │ Notes               |
// |----------------------|---------------|---------------------|
// | insert(word)         │ O(L)          │ L = word length     |
// | search(word)         │ O(L)          │ must end isWord     |
// | startsWith(prefix)   │ O(L)          │ path exists         |
// | delete(word)         │ O(L)          │ + prune             |
// ─────────────────────────────────────────────────────────────
//
// ── Union-Find (with PC + union by size) ─────────────────────
// | Operation            │ Cost          │ Notes               |
// |----------------------|---------------|---------------------|
// | find                 │ O(α(n)) ≈ O(1)│ near constant       |
// | union                │ O(α(n))       │ —                   |
// | connected            │ O(α(n))       │ —                   |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  3️⃣ ALGORITHM COMPLEXITY CHEAT SHEET
 * ============================================================ */
// ── Searching ────────────────────────────────────────────────
// | Algorithm              │ Pre-req         │ Time          |
// |------------------------|-----------------|---------------|
// | Linear search          │ none            │ O(n)          |
// | Binary search          │ sorted          │ O(log n)      |
// | Lower/upper bound      │ sorted          │ O(log n)      |
// | Rotated binary search  │ rotated sorted  │ O(log n)      |
// ─────────────────────────────────────────────────────────────
//
// ── Sorting ──────────────────────────────────────────────────
// | Algorithm      │ Best      │ Avg       │ Worst     │ Space   │ Stable |
// |----------------|-----------|-----------|-----------|---------|--------|
// | Bubble         │ O(n)      │ O(n²)     │ O(n²)     │ O(1)    │ Yes    |
// | Selection      │ O(n²)     │ O(n²)     │ O(n²)     │ O(1)    │ No     |
// | Insertion      │ O(n)      │ O(n²)     │ O(n²)     │ O(1)    │ Yes    |
// | Merge          │ O(nlogn)  │ O(nlogn)  │ O(nlogn)  │ O(n)    │ Yes    |
// | Quick          │ O(nlogn)  │ O(nlogn)  │ O(n²)     │ O(logn) │ No     |
// | Heap           │ O(nlogn)  │ O(nlogn)  │ O(nlogn)  │ O(1)    │ No     |
// | Counting       │ O(n+k)    │ O(n+k)    │ O(n+k)    │ O(k)    │ Yes    |
// | Radix          │ O(d(n+b)) │ O(d(n+b)) │ O(d(n+b)) │ O(n+b)  │ Yes    |
// | Timsort (V8)   │ O(n)      │ O(nlogn)  │ O(nlogn)  │ O(n)    │ Yes    |
// ─────────────────────────────────────────────────────────────
//
// ── String / Array patterns ──────────────────────────────────
// | Pattern              │ Time      │ Notes                     |
// |----------------------|-----------|---------------------------|
// | Two pointers (opp.)  │ O(n)      │ sorted pair, palindrome   |
// | Fast/slow pointers   │ O(n)      │ cycle, middle             |
// | Read/write pointers  │ O(n)      │ dedup, partition          |
// | Fixed window         │ O(n)      │ max sum of k              |
// | Variable window      │ O(n)      │ longest/shortest subarray |
// | Prefix sums          │ O(n) prep │ O(1) range query          |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  4️⃣ SORTING ALGORITHMS RECAP
 * ============================================================ */
// 🔹 TS/JS code → ALWAYS use Array.prototype.sort with a
//    comparator (or toSorted for non-mutating).
// 🔸 Roll your own only for interviews or special structures.
//
// 🧠 Decision guide:
//   - Small / nearly sorted         → insertion sort
//   - General, stable, guaranteed   → merge sort (or Timsort)
//   - In-place, fast avg            → quick sort (random pivot)
//   - Guaranteed + O(1) space       → heap sort
//   - Integers in small range       → counting sort
//   - Fixed-width ints              → radix sort
//   - Uniform floats                → bucket sort
//
// ⚠️ Memory tool:
//   - "sort() returns the SAME array" — it mutates in place.
//     Use toSorted() if you need the original untouched.
//   - ALWAYS pass (a, b) => a - b for numbers — the default is
//     LEXICOGRAPHIC (string) order.
//   - Multi-key: chain comparisons inside one comparator.
//   - Intl.Collator for locale-aware string sorting.


/* ============================================================
 *  5️⃣ GRAPH ALGORITHMS RECAP
 * ============================================================ */
// | Problem                  │ Algorithm                       |
// |--------------------------|---------------------------------|
// | Traverse a graph         │ BFS (queue) / DFS (stack/rec)   |
// | Shortest (unweighted)    │ BFS                             |
// | Shortest (0/1 weights)   │ 0-1 BFS                         |
// | Shortest (≥0 weights)    │ Dijkstra                        |
// | Shortest (negative ok)   │ Bellman-Ford                    |
// | All-pairs shortest       │ Floyd-Warshall (small V)        |
// | Single target + heur.    │ A*                              |
// | Connected components     │ DFS / BFS / Union-Find          |
// | Cycle (undirected)       │ DFS parent / DSU                |
// | Cycle (directed)         │ DFS colours / Kahn's leftovers  |
// | Topological order        │ Kahn's / DFS postorder          |
// | MST                      │ Kruskal (DSU) / Prim (heap)     |
// | Bipartite check          │ BFS / DFS 2-colouring           |
// | Bridges / articulation   │ Tarjan's algorithm              |
// | SCCs                     │ Tarjan / Kosaraju               |
//
// 🧠 Complexity summary:
//   - BFS / DFS       → O(V + E)
//   - Dijkstra        → O((V + E) log V)
//   - Bellman-Ford    → O(V · E)
//   - Floyd-Warshall  → O(V³)
//   - Kahn's          → O(V + E)
//   - Kruskal         → O(E log E)
//   - Prim            → O(E log V)


/* ============================================================
 *  6️⃣ DP, GREEDY, AND BACKTRACKING RECAP
 * ============================================================ */
// ── DP quick reference ───────────────────────────────────────
// | Problem               │ State        │ Recurrence            |
// |-----------------------|--------------|-----------------------|
// | Fibonacci             │ dp[i]        │ dp[i-1]+dp[i-2]       |
// | Climbing stairs       │ dp[i]        │ dp[i-1]+dp[i-2]       |
// | 0/1 Knapsack          │ dp[i][w]     │ take/skip             |
// | Unbounded knapsack    │ dp[w]        │ forward iterate       |
// | Coin change (min)     │ dp[a]        │ min(dp[a-c]+1)        |
// | Coin change (ways)    │ dp[a]        │ Σ dp[a-c]             |
// | LIS (n²)              │ dp[i]        │ max dp[j]+1           |
// | LIS (n log n)         │ tails        │ binary search         |
// | LCS                   │ dp[i][j]     │ match diag+1          |
// | Edit distance         │ dp[i][j]     │ 1+min(del/ins/sub)    |
// | House robber          │ dp[i]        │ max(skip,take)        |
// | Partition (subset)    │ dp[w] bool   │ reachable             |
// ─────────────────────────────────────────────────────────────
//
// ── Greedy quick reference ───────────────────────────────────
// | Problem               │ Greedy key                       |
// |-----------------------|----------------------------------|
// | Activity selection    │ sort by END                      |
// | Merge intervals       │ sort by START                    |
// | Fractional knapsack   │ sort by value/weight desc        |
// | Huffman coding        │ merge two smallest (heap)        |
// | Jump game I/II        │ track farthest reach             |
// | Gas station           │ reset start when tank < 0        |
// | Min platforms         │ sort + two pointers              |
// ─────────────────────────────────────────────────────────────
//
// ── Backtracking template ────────────────────────────────────
//     function backtrack(path, choices) {
//       if (isGoal(path)) { result.push([...path]); return; }
//       for (const c of choices) {
//         if (!isValid(path, c)) continue;
//         path.push(c);
//         backtrack(path, nextChoices(c));
//         path.pop();
//       }
//     }
//
// 🧠 Snapshot ([...path]) + undo (path.pop) — the whole game.


/* ============================================================
 *  7️⃣ JS/TS PERFORMANCE GOTCHAS
 * ============================================================ */
// 🔹 The 12 things that slow JS/TS DSA code the most:
//   1. arr.shift() / arr.unshift() → O(n). Use head pointer.
//   2. "s += x" in a loop → O(n²). Use array.join("").
//   3. arr.includes() in a loop → O(n²). Use Set / Map.
//   4. Slicing big arrays in loops → O(n) copies.
//   5. Chained .map().filter().map() → multiple arrays.
//   6. Sorting without a numeric comparator → STRING sort.
//   7. Nested loops over objects with dynamic keys → hidden-
//      class churn. Use Map.
//   8. Recursion on deep structures → RangeError (V8 ~10k).
//   9. Deep recursion in backtracking → convert to iterative.
//  10. Reading arr.length every iteration — cache it.
//  11. Using list as a queue → head-pointer or ring buffer.
//  12. Sorting when you only need the k smallest/largest →
//      heap-based top-k.
//
// 🔹 Micro-tips:
//   - Local variables are faster than globals.
//   - `map.get(k) ?? default` beats try/except for lookups.
//   - for...of on arrays is close to classic for-loop speed.
//   - Typed arrays (Int32Array, Float64Array) for hot numeric
//     loops → big speedup + memory savings.
//   - BigInt is SLOW — use only when needed (> 2^53).
//   - Object.freeze is a shallow freeze — no deep immutability.
//   - JSON.parse(JSON.stringify(x)) is slow deep clone — use
//     structuredClone (Node 17+, modern browsers).
//   - Array.prototype.flatMap combines map + flat in one pass.
//   - Array destructuring `[a, b] = [b, a]` beats XOR swap.
//   - `arr.at(-1)` beats arr[arr.length - 1] (both O(1), but
//     clearer).
//   - Intl.Collator beats localeCompare in a loop.

// 🔸 Big-O in JS is about CALLS, not lines. A tight loop
//    calling built-ins is often faster than a shorter JS loop.


/* ============================================================
 *  8️⃣ UNIVERSAL EDGE-CASE CHECKLIST
 * ============================================================ */
// 🔹 For EVERY problem, mentally test:
//     ☐ Empty input         ([], "", new Map(), 0, null, undefined)
//     ☐ Single element      ([1], "a", node alone)
//     ☐ Two elements        (smallest interesting case)
//     ☐ All elements equal  (duplicates, ties)
//     ☐ Sorted input        (worst/best case for some algorithms)
//     ☐ Reverse-sorted      (worst case for some algorithms)
//     ☐ Very large n        (check complexity)
//     ☐ Negative / zero     (if numeric)
//     ☐ NaN / Infinity      (comparisons break!)
//     ☐ Boundary indices    (i=0, i=n-1, i=n)
//     ☐ Disconnected input  (graph with isolated nodes)
//     ☐ Cycle present       (graph / linked list)
//     ☐ Sparse arrays       (holes from `delete arr[i]`)
//     ☐ null vs undefined   (both are falsy, differently)
//
// 🔹 For strings specifically:
//     ☐ Unicode / emoji (code points vs code units)
//     ☐ Whitespace / empty tokens
//     ☐ Case sensitivity
//     ☐ Multiple spaces between words
//     ☐ Leading / trailing whitespace
//     ☐ split("") on emoji → breaks surrogate pairs
//
// 🔹 For graphs specifically:
//     ☐ Directed or undirected?
//     ☐ Weighted or unweighted?
//     ☐ Negative weights?
//     ☐ Self-loops?
//     ☐ Multi-edges?
//     ☐ Isolated vertices?
//
// 🔹 For TypeScript specifically:
//     ☐ `T | undefined` from indexed access — narrow before use.
//     ☐ Map.get returns `V | undefined` — handle it.
//     ☐ Strict null checks catch most, but not all, bugs.
//     ☐ Don't use `!` unless you've PROVEN non-null with a guard.
//     ☐ `readonly T[]` is compile-time only — no runtime cost.


/* ============================================================
 *  9️⃣ INTERVIEW PATTERNS & SIGNAL WORDS
 * ============================================================ */
// | Signal in question                │ Likely pattern         |
// |------------------------------------|------------------------|
// | "sorted"                           │ binary search / two-pt |
// | "contiguous subarray / substring"  │ sliding window         |
// | "seen before" / "count"            │ Map / Set              |
// | "unique"                           │ Set                    |
// | "top k"                            │ heap                   |
// | "min/max in window"                │ deque (monotonic)      |
// | "levels" / "shortest path (uw)"    │ BFS                    |
// | "depth-first" / "backtrack"        │ DFS / recursion        |
// | "before / after / depends"         │ topological sort       |
// | "connected groups"                 │ Union-Find / DFS       |
// | "minimum cost path"                │ Dijkstra               |
// | "negative weights"                 │ Bellman-Ford           |
// | "optimal / min / max"              │ DP or greedy           |
// | "count ways"                       │ DP                     |
// | "all permutations / subsets"       │ backtracking           |
// | "cyclic / repeated"                │ Floyd's / cycle detect |
// | "prefix"                           │ trie                   |
// | "single number"                    │ XOR                    |
// | "minimise maximum" / "max min"     │ binary search on answer|
// | "in place, O(1) space"             │ two pointers           |
// | "stream / online"                  │ Map + queue            |
//
// 🧠 Recognition matters more than memorisation. If you can name
//    the pattern in the first 30 seconds, the code writes itself.


/* ============================================================
 *  🔟 MASTER BEST-PRACTICES LIST
 * ============================================================ */
// 🔹 General
//    - State complexity in your head BEFORE you write code.
//    - Prefer simple, readable solutions first; optimise later.
//    - Know your built-ins and their costs.
//    - Fail fast: validate inputs early.
//    - Test with edge cases every time.
//
// 🔹 Data structures
//    - Set / Map for membership and counts.
//    - Head-pointer queue for FIFO.
//    - Heap (from file 11) for priority / top-k.
//    - Counter pattern via Map for frequency.
//    - Union-Find for dynamic connectivity.
//    - Trie for prefix operations.
//
// 🔹 Algorithms
//    - BFS for unweighted shortest paths.
//    - Dijkstra for non-negative weights.
//    - Bellman-Ford for negative weights.
//    - Floyd-Warshall for all-pairs (small V).
//    - Kahn's or DFS-colours for topological order.
//    - Binary search on the answer for "minimise max".
//    - DP when greedy fails; greedy when provable.
//    - Backtracking for "all X" with pruning.
//
// 🔹 JS/TS idioms
//    - array.join("") not += for strings.
//    - arr.filter().map() or flatMap for transformations.
//    - for...of over index loops when possible.
//    - Use `??` instead of `||` for defaults.
//    - Use optional chaining `?.` for null-safe access.
//    - Use Map for hash-maps — Object is not designed for it.
//    - Always pass a comparator to sort() for numbers.
//    - Use structuredClone for deep copies (Node 17+).
//    - Prefer typed arrays for numeric hot loops.
//    - Use BigInt only when 32-bit / 53-bit limits are hit.
//
// 🔹 Mindset
//    - Every problem is a graph, a DP, or a two-pointer in
//      disguise.
//    - If you're tempted to write nested loops over indices,
//      ask: "can hashing / two pointers / a heap do this in
//      one pass?"
//    - If recursion feels natural but data is huge, convert
//      to iterative or DP.
//    - When stuck, brute force first — then optimise.
//    - Explain your reasoning — interviewers grade thinking,
//      not just code.


/* ============================================================
 *  📌 FINAL RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Topic                │ Delivered in file                       |
 * ─────────────────────────────────────────────────────────────
 * | Big-O & complexity   │ 01_Complexity_Analysis_BigO             |
 * | Arrays & lists       │ 02_Arrays_and_Lists                     |
 * | Strings              │ 03_Strings                              |
 * | Hashing              │ 04_Hashing_Maps_and_Sets                |
 * | Recursion basics     │ 05_Recursion_Basics                     |
 * | Stacks               │ 06_Stacks                               |
 * | Queues & deques      │ 07_Queues_and_Deques                    |
 * | Linked lists         │ 08_Linked_Lists                         |
 * | Binary trees         │ 09_Binary_Trees                         |
 * | BSTs                 │ 10_Binary_Search_Trees                  |
 * | Heaps                │ 11_Heaps_and_Priority_Queues            |
 * | Graphs (basics)      │ 12_Graphs_Basics                        |
 * | BFS / DFS            │ 13_Graph_Traversals_BFS_DFS             |
 * | Tries                │ 14_Tries                                |
 * | Sorting              │ 15_Sorting_Algorithms                   |
 * | Searching            │ 16_Searching_Algorithms                 |
 * | Two pointers/window  │ 17_Two_Pointers_and_Sliding_Window      |
 * | Backtracking         │ 18_Recursion_and_Backtracking           |
 * | Dynamic Programming  │ 19_Dynamic_Programming_Intro            |
 * | Greedy               │ 20_Greedy_Algorithms                    |
 * | Bit manipulation     │ 21_Bit_Manipulation                     |
 * | Union-Find           │ 22_Union_Find_Disjoint_Set              |
 * | Shortest paths       │ 23_Shortest_Paths_Dijkstra_BellmanFord  |
 * | Topological sort     │ 24_Topological_Sort                     |
 * | Recap (this file)    │ 25_Edge_Cases_and_Complexity_Recap      |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 FINAL WORDS
 *  - You now have a complete DSA toolkit in TypeScript.
 *  - Revisit each file, but don't memorise code — memorise
 *    PATTERNS.
 *  - Practise on LeetCode / HackerRank / Codeforces.
 *  - Aim for: read a problem → recognise the pattern → code
 *    it in one pass → validate edge cases.
 *  - Comfort with complexity analysis separates juniors from
 *    seniors. Lean into it.
 *  - Remember: JS's 32-bit bitwise limits, float64 numbers,
 *    no built-in heap, and O(n) Array.shift are the four
 *    biggest "gotchas" for newcomers from Python/C++.
 * ============================================================ */