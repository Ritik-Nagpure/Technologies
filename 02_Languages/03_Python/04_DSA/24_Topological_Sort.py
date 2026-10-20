# 24_Topological_Sort.py

# ============================================================
#  📘 TOPOLOGICAL SORT IN PYTHON — COMPLETE COVERAGE
#
#  A TOPOLOGICAL SORT orders the vertices of a DIRECTED ACYCLIC
#  GRAPH (DAG) so that for every edge u → v, u appears before v.
#  It's the mathematical model of "do X before Y": build
#  systems, course prerequisites, spreadsheet formulas, package
#  managers, and task schedulers all rely on it.
#
#  Sections:
#   1. What topological sort is
#   2. When it applies (DAG requirement)
#   3. Kahn's algorithm (BFS-based)
#   4. DFS postorder approach
#   5. Detecting cycles (no valid topo order)
#   6. Lexicographically smallest order
#   7. All topological orders (backtracking)
#   8. Longest path in a DAG
#   9. Course schedule & alien dictionary
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT TOPOLOGICAL SORT IS
# ============================================================
# 🔹 Linear ordering of vertices where every edge points forward.
# 🔸 Applies ONLY to DAGs — cycles make it impossible.
# 🎯 Signal phrases: "prerequisites", "dependencies", "build
#    order", "task scheduling", "before/after".

# ── Complexity ───────────────────────────────────────────────
# | Algorithm         │ Time      │ Space │ Notes             |
# |-------------------|-----------|-------|-------------------|
# | Kahn's (BFS)      │ O(V + E)  │ O(V)  │ natural cycle     |
# |                   │           │       │ detection         |
# | DFS postorder     │ O(V + E)  │ O(V)  │ recursion risk    |
# | Lexicographic     │ O(V log V │ O(V)  │ heap instead of   |
# |                   │ + E)      │       │ queue             |
# ─────────────────────────────────────────────────────────────
#
# 🧠 Kahn's is usually the safer default — iterative, and it
#    detects cycles for free (leftover nodes).


# ============================================================
#  2️⃣ WHEN IT APPLIES (DAG REQUIREMENT)
# ============================================================
# 🔹 A DAG has at least one vertex with no incoming edges
#    (in-degree 0) — that's the natural starting point.
# 🔸 Every DAG has at least one topological order (usually many).
# 🔸 A cycle → no valid order → some nodes never get in-degree 0.

# 🧠 Rule: if the graph might have cycles, use Kahn's or the
#    colour-DFS from file 13 to detect them BEFORE claiming a
#    topo order exists.

from collections import deque
import heapq


# ============================================================
#  3️⃣ KAHN'S ALGORITHM (BFS-BASED)
# ============================================================
# 🔹 Compute in-degree for every node.
# 🔸 Queue all in-degree-0 nodes.
# 🔸 Pop, append to order, decrement neighbours' in-degrees;
#    enqueue any that hit 0.
# 🎯 Detects cycles: if order length < V, there's a cycle.

def topological_sort_kahn(adj: dict[str, list[str]]) -> list[str] | None:
    # Ensure every vertex exists as a key
    vertices = set(adj.keys())
    for u in adj:
        for v in adj[u]:
            vertices.add(v)

    indegree: dict[str, int] = {v: 0 for v in vertices}
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1

    q: deque[str] = deque(v for v in vertices if indegree[v] == 0)
    order: list[str] = []

    while q:
        u = q.popleft()
        order.append(u)
        for v in adj.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    return order if len(order) == len(vertices) else None


graph = {
    "A": ["C", "D"],
    "B": ["D"],
    "C": ["E"],
    "D": ["E"],
    "E": [],
}
print(topological_sort_kahn(graph))
# e.g. ['A', 'B', 'C', 'D', 'E'] — one valid order

# 🔸 Cycle example — returns None
cycle = {
    "A": ["B"],
    "B": ["C"],
    "C": ["A"],
}
print(topological_sort_kahn(cycle))     # None

# 🧠 Order of equal in-degree-0 nodes is arbitrary (depends on
#    insertion). Use a heap for a deterministic (lexicographic)
#    order — see section 6.


# ============================================================
#  4️⃣ DFS POSTORDER APPROACH
# ============================================================
# 🔹 DFS each node; append to output AFTER visiting children.
# 🔸 Reverse the postorder to get topological order.

def topological_sort_dfs(adj: dict[str, list[str]]) -> list[str] | None:
    vertices = set(adj.keys())
    for u in adj:
        for v in adj[u]:
            vertices.add(v)

    visited: set[str] = set()
    on_stack: set[str] = set()              # for cycle detection
    post: list[str] = []
    has_cycle = False

    def dfs(u: str) -> None:
        nonlocal has_cycle
        if has_cycle:
            return
        visited.add(u)
        on_stack.add(u)
        for v in adj.get(u, []):
            if v in on_stack:
                has_cycle = True            # back edge
                return
            if v not in visited:
                dfs(v)
        on_stack.discard(u)
        post.append(u)

    for v in vertices:
        if v not in visited:
            dfs(v)
            if has_cycle:
                return None
    post.reverse()
    return post


print(topological_sort_dfs(graph))
# e.g. ['B', 'A', 'D', 'C', 'E'] — one valid order
print(topological_sort_dfs(cycle))          # None

# ⚠️ Recursive DFS: risk of RecursionError on deep DAGs (chain
#    of length > 1000). Convert to iterative if needed.
# 🧠 Postorder + reverse is the classic "DFS topo sort".
#    on_stack = "currently in the current DFS path" = gray nodes.


# ============================================================
#  5️⃣ DETECTING CYCLES (NO VALID TOPO ORDER)
# ============================================================
# 🔹 Kahn's leaves leftover nodes if a cycle exists.
# 🔸 DFS uses three colours (white / gray / black) — see 13.

def has_cycle_and_toposort(adj: dict[str, list[str]]) -> tuple[bool, list[str] | None]:
    order = topological_sort_kahn(adj)
    if order is None:
        return (True, None)
    return (False, order)

print(has_cycle_and_toposort(graph))        # (False, [...])
print(has_cycle_and_toposort(cycle))        # (True, None)

# 🔸 Which nodes are in a cycle? After Kahn's, the leftovers
#    (still positive in-degree) are exactly the cyclic part.

def nodes_in_cycle(adj: dict[str, list[str]]) -> list[str]:
    vertices = set(adj.keys())
    for u in adj:
        for v in adj[u]:
            vertices.add(v)
    indegree: dict[str, int] = {v: 0 for v in vertices}
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1
    q: deque[str] = deque(v for v in vertices if indegree[v] == 0)
    visited: set[str] = set()
    while q:
        u = q.popleft()
        visited.add(u)
        for v in adj.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return list(vertices - visited)

print(nodes_in_cycle(cycle))                # ['A', 'B', 'C']

# 🧠 Kahn's naturally distinguishes DAG nodes from cyclic nodes.


# ============================================================
#  6️⃣ LEXICOGRAPHICALLY SMALLEST ORDER
# ============================================================
# 🔹 Replace the deque with a MIN-HEAP.
# 🔸 Always pick the smallest node among in-degree-0 candidates.

def topological_sort_lex(adj: dict[str, list[str]]) -> list[str] | None:
    vertices = set(adj.keys())
    for u in adj:
        for v in adj[u]:
            vertices.add(v)
    indegree: dict[str, int] = {v: 0 for v in vertices}
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1
    heap: list[str] = [v for v in vertices if indegree[v] == 0]
    heapq.heapify(heap)
    order: list[str] = []
    while heap:
        u = heapq.heappop(heap)
        order.append(u)
        for v in adj.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                heapq.heappush(heap, v)
    return order if len(order) == len(vertices) else None

print(topological_sort_lex(graph))
# ['A', 'B', 'C', 'D', 'E']  (deterministic)

# 🧠 Use this when the problem asks for the smallest order, or
#    when you want deterministic output for tests.


# ============================================================
#  7️⃣ ALL TOPOLOGICAL ORDERS (BACKTRACKING)
# ============================================================
# 🔹 Enumerate ALL valid orderings via backtracking.
# 🔸 Only feasible for small graphs (n ≤ ~10).

def all_topological_sorts(adj: dict[str, list[str]]) -> list[list[str]]:
    vertices = set(adj.keys())
    for u in adj:
        for v in adj[u]:
            vertices.add(v)
    indegree: dict[str, int] = {v: 0 for v in vertices}
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1
    result: list[list[str]] = []

    def backtrack(order: list[str], indeg: dict[str, int]) -> None:
        if len(order) == len(vertices):
            result.append(order[:])
            return
        for v in vertices:
            if indeg[v] == 0 and v not in order:
                order.append(v)
                # Temporarily mark as used
                indeg[v] = -1
                for w in adj.get(v, []):
                    indeg[w] -= 1
                backtrack(order, indeg)
                # Undo
                for w in adj.get(v, []):
                    indeg[w] += 1
                indeg[v] = 0
                order.pop()

    backtrack([], dict(indegree))
    return result

small = {"A": ["C"], "B": ["C"], "C": []}
for t in all_topological_sorts(small):
    print(t)
# ['A', 'B', 'C']
# ['B', 'A', 'C']

# 🧠 Exponential — use only for tiny graphs.
# ⚠️ `order` is used as a "visited" check via `v not in order` —
#    O(n) per check. Fine for small n.


# ============================================================
#  8️⃣ LONGEST PATH IN A DAG
# ============================================================
# 🔹 Topological order lets you DP the longest path in O(V + E).
# 🔸 For general graphs, longest path is NP-hard; DAG is the
#    tractable special case.

def longest_path_dag(
    adj: dict[str, list[tuple[str, int]]],
    src: str,
) -> dict[str, int]:
    # Topological order (Kahn)
    vertices = set(adj.keys())
    for u in adj:
        for v, _ in adj[u]:
            vertices.add(v)
    indegree: dict[str, int] = {v: 0 for v in vertices}
    for u in adj:
        for v, _ in adj[u]:
            indegree[v] += 1
    q: deque[str] = deque(v for v in vertices if indegree[v] == 0)
    order: list[str] = []
    while q:
        u = q.popleft()
        order.append(u)
        for v, _ in adj.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    # DP: dist[v] = max distance from src to v
    NEG_INF = float("-inf")
    dist: dict[str, float] = {v: NEG_INF for v in vertices}
    dist[src] = 0
    for u in order:
        if dist[u] == NEG_INF:
            continue
        for v, w in adj.get(u, []):
            if dist[u] + w > dist[v]:
                dist[v] = dist[u] + w
    return {k: (int(v) if v != NEG_INF else -1) for k, v in dist.items()}

wadj = {
    "A": [("B", 3), ("C", 6)],
    "B": [("C", 4), ("D", 4)],
    "C": [("D", 8)],
    "D": [],
}
print(longest_path_dag(wadj, "A"))
# {'A': 0, 'B': 3, 'C': 7, 'D': 15}

# 🧠 Pattern: topological order + DP. Works for ANY DAG.
# 🔸 Shortest path in a DAG is the same code with `min` — works
#    even with NEGATIVE weights (unlike Dijkstra).


# ============================================================
#  9️⃣ COURSE SCHEDULE & ALIEN DICTIONARY
# ============================================================
# 🔹 Course Schedule I: can you finish all courses? (No cycle)
# 🔹 Course Schedule II: return order. (Topo sort)

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    adj: dict[int, list[int]] = {i: [] for i in range(num_courses)}
    for course, pre in prerequisites:
        adj[pre].append(course)
    indegree = [0] * num_courses
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1
    q: deque[int] = deque(i for i in range(num_courses) if indegree[i] == 0)
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return seen == num_courses

print(can_finish(2, [[1, 0]]))              # True
print(can_finish(2, [[1, 0], [0, 1]]))      # False

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    adj: dict[int, list[int]] = {i: [] for i in range(num_courses)}
    for course, pre in prerequisites:
        adj[pre].append(course)
    indegree = [0] * num_courses
    for u in adj:
        for v in adj[u]:
            indegree[v] += 1
    q: deque[int] = deque(i for i in range(num_courses) if indegree[i] == 0)
    order: list[int] = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return order if len(order) == num_courses else []

print(find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
# [0, 1, 2, 3] (or [0, 2, 1, 3])
print(find_order(2, [[1, 0], [0, 1]]))      # []

# 🔸 Alien Dictionary: derive character order from sorted words.
def alien_order(words: list[str]) -> str:
    # Build char graph
    adj: dict[str, set[str]] = {ch: set() for w in words for ch in w}
    indegree: dict[str, int] = {ch: 0 for ch in adj}

    for i in range(len(words) - 1):
        a, b = words[i], words[i + 1]
        # Edge case: b is a prefix of a → invalid order
        if len(a) > len(b) and a.startswith(b):
            return ""
        for x, y in zip(a, b):
            if x != y:
                if y not in adj[x]:
                    adj[x].add(y)
                    indegree[y] += 1
                break

    q: deque[str] = deque(c for c in indegree if indegree[c] == 0)
    # Use a heap for lexicographic determinism
    heap = list(q)
    heapq.heapify(heap)
    order: list[str] = []
    while heap:
        u = heapq.heappop(heap)
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                heapq.heappush(heap, v)
    return "".join(order) if len(order) == len(adj) else ""

print(alien_order(["wrt", "wrf", "er", "ett", "rftt"]))
# "wertf"

# 🧠 Alien Dictionary combines topo sort with lexicographic
#    tie-breaking (heap) — hence the two techniques.
# ⚠️ The prefix edge case ("abc", "ab") is subtle and often
#    forgotten — it's an invalid input → return "".
# 🧠 Course Schedule uses Kahn's: `seen == n` means no cycle.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Topological sort only works on DAGs — cycle → no valid order.
# ⚠️ Kahn's: after the queue empties, if len(order) < V → cycle.
# ⚠️ DFS topo: forgetting `on_stack.discard(u)` breaks cycle
#    detection.
# ⚠️ DFS topo: recursion depth limit — convert to iterative for
#    large graphs.
# ⚠️ Disconnected DAG: multiple in-degree-0 starting points.
# ⚠️ Isolated nodes: still part of the order — include them.
# ⚠️ Multiple valid orders: don't compare against a single
#    "expected" order in tests unless the problem specifies
#    tie-breaking.
# ⚠️ Kahn's order depends on dict / set iteration order — use a
#    heap for deterministic output.
# ⚠️ Self-loops: indegree never reaches 0 → cycle detected.
# ⚠️ Multi-edges: count them properly in indegree (or dedup).
# ⚠️ Alien dictionary: the prefix case is a hidden test.
# ⚠️ `heapq` requires comparable items — chars / ints are fine.
# ⚠️ Node labels: ensure every node appears as a key even if it
#    has no outgoing edges.
# ⚠️ "All topological orders" is exponential — don't try on n=20.
# ⚠️ Longest path in a DAG uses topological order + DP — much
#    faster than DFS-memo for dense graphs.
# ⚠️ `float('-inf')` sentinel: check `dist[u] != NEG_INF` before
#    relaxing from u.

# 🕒 Version notes
# - deque for BFS: Python 2.4+
# - heapq for deterministic topo: Python 2.3+
# - PEP 604 unions (list[str] | None): Python 3.10+
#   For 3.9 and below use Optional[List[str]]
# - `math.inf` / `float('-inf')`: Python 3.5+
# - Python 3.11+ faster interpreter helps dense-graph loops
# - No stdlib topological sort — write it yourself
# - `networkx.topological_sort` available if you allow deps


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Algorithm        │ Data structure │ Cycle detection  │ Time   |
# ─────────────────────────────────────────────────────────────
# | Kahn's           │ deque (BFS)    │ order < V        │ O(V+E) |
# | Kahn's lexical   │ heap           │ order < V        │ O(V+   │
# |                  │                │                  │ E logV)|
# | DFS postorder    │ recursion      │ gray node (stack)│ O(V+E) |
# ─────────────────────────────────────────────────────────────
# | Steps of Kahn's algorithm                                   │
# ─────────────────────────────────────────────────────────────
# | 1. Compute in-degree for every vertex                       │
# | 2. Enqueue all with in-degree 0                             │
# | 3. Pop, append to order, decrement neighbours               │
# | 4. Push new in-degree-0 to queue                            │
# | 5. Repeat until empty                                       │
# | 6. If len(order) < V → cycle exists                         │
# ─────────────────────────────────────────────────────────────
# | Problem                       │ Technique                   │
# ─────────────────────────────────────────────────────────────
# | Any topo order                │ Kahn's / DFS postorder      │
# | Lexicographically smallest    │ Kahn's + min-heap           │
# | Detect cycle                  │ Kahn's leftover count       │
# | Nodes in cycle                │ Kahn's leftovers            │
# | Course schedule I / II        │ Kahn's                      │
# | Alien dictionary              │ Kahn's + heap + prefix test │
# | Longest path in DAG           │ Topo order + DP             │
# | Shortest path in DAG (neg ok) │ Topo order + DP             │
# | All valid orders              │ Backtracking (small n)      │
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                  |
# ─────────────────────────────────────────────────────────────
# | Cycles                      │ No valid topo order           |
# | Missing keys                │ KeyError on sink nodes        |
# | Recursive DFS depth         │ RecursionError                |
# | Non-deterministic order     │ Tests fail if unchecked       |
# | Self-loop unaccounted       │ Wrong indegree → cycle missed |
# | Multi-edges double-counted  │ Wrong indegree                |
# | Alien prefix edge           │ "" expected but not returned  |
# | All orders for large n      │ Exponential blowup            |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Prefer Kahn's algorithm — iterative, cycle-safe, easy.
#  - Include ISOLATED vertices — every node in the graph must
#    appear in the topological order.
#  - Use min-heap (not deque) for a DETERMINISTIC or smallest
#    order.
#  - Detect cycles via leftover count in Kahn's, or gray nodes
#    in DFS.
#  - Never claim a topo order exists without checking for cycles.
#  - Longest/shortest path in DAG = topo order + DP — beats
#    Dijkstra and works with negative weights.
#  - Alien dictionary: remember the "b is prefix of a" invalid
#    case → return "".
#  - For "all topological orders", backtracking only for n ≤ 10.
#  - Test with: empty graph, single node, self-loop, disconnect,
#    multi-edges, and a "prefix" invalid input.
#  - Tie-breaking matters: if the problem gives a deterministic
#    expected output, use a heap.
#  - Draw the DAG by hand for tricky cases to sanity-check.
# ============================================================