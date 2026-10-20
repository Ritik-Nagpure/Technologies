# 23_Shortest_Paths_Dijkstra_BellmanFord.py

# ============================================================
#  📘 SHORTEST PATHS: DIJKSTRA, BELLMAN-FORD, FLOYD-WARSHALL
#
#  Shortest-path algorithms find the minimum-cost route between
#  nodes. The right choice depends on edge weights, graph size,
#  and how many sources/targets you need:
#    • BFS               → unweighted
#    • Dijkstra          → non-negative weights, single source
#    • Bellman-Ford      → may have negative weights, single source
#    • Floyd-Warshall    → all-pairs shortest paths
#    • A*                → Dijkstra + heuristic (targeted search)
#
#  Sections:
#   1. Algorithm comparison
#   2. BFS shortest path (unweighted)
#   3. Dijkstra (heap-based)
#   4. Dijkstra with path reconstruction
#   5. Bellman-Ford (negative weights)
#   6. Detecting negative cycles
#   7. Floyd-Warshall (all-pairs)
#   8. A* preview
#   9. Grid shortest path
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ ALGORITHM COMPARISON
# ============================================================
# ── Decision table ───────────────────────────────────────────
# | Algorithm      │ Weights       │ Source     │ Time          │ Space  │
# |----------------|---------------|------------|---------------|--------|
# | BFS            │ unweighted    │ single     │ O(V + E)      │ O(V)   |
# | 0-1 BFS        │ 0 or 1        │ single     │ O(V + E)      │ O(V)   |
# | Dijkstra       │ ≥ 0           │ single     │ O((V+E) log V)│ O(V)   |
# | Bellman-Ford   │ any (neg ok)  │ single     │ O(V · E)      │ O(V)   |
# | Floyd-Warshall │ any (no neg  │ all-pairs  │ O(V³)         │ O(V²)  |
# |                │ cycles)       │            │               │        |
# | A*             │ ≥ 0 + heuristic│ single   │ depends       │ O(V)   |
# ─────────────────────────────────────────────────────────────
#
# 🧠 Rules of thumb:
#    - Unweighted → BFS.
#    - Small + non-negative → Dijkstra.
#    - Negative edges → Bellman-Ford.
#    - Need ALL PAIRS → Floyd-Warshall (small V).
#    - Need single target + heuristic → A*.


# ============================================================
#  2️⃣ BFS SHORTEST PATH (UNWEIGHTED)
# ============================================================
# 🔹 BFS explores in order of edge-count.
# 🔸 First time you reach a node = shortest unweighted distance.

from collections import deque

def bfs_shortest(
    adj: dict[str, list[str]],
    src: str,
) -> dict[str, int]:
    dist: dict[str, int] = {src: 0}
    q: deque[str] = deque([src])
    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

g = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C", "E"],
    "E": ["D"],
}
print(bfs_shortest(g, "A"))
# {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 3}

# 🧠 BFS ignores weights — every edge is cost 1.
# 🔸 For 0/1-weighted graphs, use 0-1 BFS with a deque:
def bfs_01(adj: dict[str, list[tuple[str, int]]], src: str) -> dict[str, int]:
    INF = float("inf")
    dist: dict[str, float] = {src: 0}
    dq: deque[str] = deque([src])
    while dq:
        u = dq.popleft()
        for v, w in adj.get(u, []):
            nd = dist[u] + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                if w == 0:
                    dq.appendleft(v)         # 0-weight → front
                else:
                    dq.append(v)             # 1-weight → back
    return {k: int(v) for k, v in dist.items()}   # type: ignore

g01 = {
    "A": [("B", 0), ("C", 1)],
    "B": [("D", 1)],
    "C": [("D", 0)],
    "D": [],
}
print(bfs_01(g01, "A"))     # {'A': 0, 'B': 0, 'C': 1, 'D': 0}


# ============================================================
#  3️⃣ DIJKSTRA (HEAP-BASED)
# ============================================================
# 🔹 Greedy: always expand the closest unvisited node.
# 🔸 Uses a min-heap → O((V + E) log V).
# 🎯 Requires NON-NEGATIVE weights.

import heapq

def dijkstra(
    adj: dict[str, list[tuple[str, int]]],
    src: str,
) -> dict[str, int]:
    INF = float("inf")
    dist: dict[str, float] = {src: 0}
    heap: list[tuple[int, str]] = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, INF):
            continue                        # stale entry — skip
        for v, w in adj.get(u, []):
            nd = d + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    # convert to int for readability (values here are ints)
    return {k: int(v) for k, v in dist.items()}

weighted = {
    "A": [("B", 1), ("C", 4)],
    "B": [("C", 2), ("D", 5)],
    "C": [("D", 1)],
    "D": [],
}
print(dijkstra(weighted, "A"))
# {'A': 0, 'B': 1, 'C': 3, 'D': 4}

# ⚠️ NEGATIVE edges break Dijkstra — use Bellman-Ford.
# 🧠 The "stale entry" check (`d > dist[u]`) is required because
#    we push multiple entries per node — never remove old ones.

# 🔸 Without the stale check, correctness is preserved but you
#    do extra work.
# 🔸 A `visited` set can be used instead (skip if already popped):
def dijkstra_visited(
    adj: dict[str, list[tuple[str, int]]],
    src: str,
) -> dict[str, int]:
    INF = float("inf")
    dist: dict[str, float] = {src: 0}
    visited: set[str] = set()
    heap: list[tuple[int, str]] = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if u in visited:
            continue
        visited.add(u)
        for v, w in adj.get(u, []):
            nd = d + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return {k: int(v) for k, v in dist.items()}


# ============================================================
#  4️⃣ DIJKSTRA WITH PATH RECONSTRUCTION
# ============================================================
# 🔹 Track parent[] during relaxation.
# 🔸 Reconstruct by walking parents backward.

def dijkstra_path(
    adj: dict[str, list[tuple[str, int]]],
    src: str,
    dst: str,
) -> tuple[int, list[str]] | None:
    INF = float("inf")
    dist: dict[str, float] = {src: 0}
    parent: dict[str, str | None] = {src: None}
    heap: list[tuple[int, str]] = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, INF):
            continue
        if u == dst:                        # early exit — we found dst
            break
        for v, w in adj.get(u, []):
            nd = d + w
            if nd < dist.get(v, INF):
                dist[v] = nd
                parent[v] = u
                heapq.heappush(heap, (nd, v))
    if dst not in dist:
        return None
    # Reconstruct
    path: list[str] = []
    cur: str | None = dst
    while cur is not None:
        path.append(cur)
        cur = parent.get(cur)
    path.reverse()
    return int(dist[dst]), path

print(dijkstra_path(weighted, "A", "D"))     # (4, ['A', 'B', 'C', 'D'])
print(dijkstra_path(weighted, "D", "A"))     # None (unreachable)

# 🧠 Early exit at dst is safe — Dijkstra's first pop of dst IS
#    the shortest path.
# 🧠 parent map + reverse walk = standard path reconstruction.


# ============================================================
#  5️⃣ BELLMAN-FORD (NEGATIVE WEIGHTS)
# ============================================================
# 🔹 Relax ALL edges V-1 times.
# 🔸 Works with negative weights.
# 🔸 O(V · E) — slower than Dijkstra but more general.

def bellman_ford(
    n: int,
    edges: list[tuple[int, int, int]],      # (u, v, weight)
    src: int,
) -> dict[int, float]:
    INF = float("inf")
    dist: dict[int, float] = {i: INF for i in range(n)}
    dist[src] = 0
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break                           # early exit — no change
    return dist

edges = [
    (0, 1, 4),
    (0, 2, 5),
    (1, 2, -3),
    (2, 3, 2),
    (1, 3, 6),
]
print(bellman_ford(4, edges, 0))
# {0: 0, 1: 4, 2: 1, 3: 3}

# 🧠 Why V-1 iterations? The shortest path uses at most V-1 edges.
# 🔸 Early exit when a pass makes no update speeds up real inputs.


# ============================================================
#  6️⃣ DETECTING NEGATIVE CYCLES
# ============================================================
# 🔹 One more pass: if any relaxation still improves a distance,
#    a negative cycle exists (distances are unbounded below).
# 🎯 Classic application: currency arbitrage.

def has_negative_cycle(
    n: int,
    edges: list[tuple[int, int, int]],
    src: int,
) -> bool:
    INF = float("inf")
    dist: list[float] = [INF] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    # Extra pass to detect negative cycle
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return True
    return False

print(has_negative_cycle(4, edges, 0))      # False

neg_cycle_edges = [
    (0, 1, 1),
    (1, 2, -3),
    (2, 0, 1),
]
print(has_negative_cycle(3, neg_cycle_edges, 0))   # True

# 🔸 Set all dist to 0 to detect negative cycles reachable from
#    ANY node (not just a specific source):
def has_negative_cycle_anywhere(n: int, edges: list[tuple[int, int, int]]) -> bool:
    dist = [0] * n                          # all nodes start at 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return True
    return False

# 🧠 "Arbitrage detection": build graph from currency pairs,
#    edges = log rate. Negative cycle → arbitrage exists.


# ============================================================
#  7️⃣ FLOYD-WARSHALL (ALL-PAIRS)
# ============================================================
# 🔹 DP over intermediate vertices.
# 🔸 dist[i][j] = min over k of dist[i][k] + dist[k][j].
# 🎯 O(V³) time, O(V²) space — use for small V (≤ ~500).
# 🔸 Handles negative weights (but not negative cycles).

def floyd_warshall(n: int, edges: list[tuple[int, int, int]]) -> list[list[float]]:
    INF = float("inf")
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = min(dist[u][v], w)     # handle multi-edges
        dist[v][u] = min(dist[v][u], w)     # remove for directed
    for k in range(n):
        for i in range(n):
            if dist[i][k] == INF:
                continue
            for j in range(n):
                via_k = dist[i][k] + dist[k][j]
                if via_k < dist[i][j]:
                    dist[i][j] = via_k
    return dist

edges_fw = [
    (0, 1, 3),
    (0, 2, 10),
    (1, 2, 4),
    (2, 3, 1),
]
d = floyd_warshall(4, edges_fw)
for row in d:
    print([int(x) if x != float("inf") else "inf" for x in row])
# [0, 3, 7, 8]
# [3, 0, 4, 5]
# [7, 4, 0, 1]
# [8, 5, 1, 0]

# 🔸 Detect negative cycle with Floyd-Warshall:
def fw_has_negative_cycle(dist: list[list[float]]) -> bool:
    n = len(dist)
    return any(dist[i][i] < 0 for i in range(n))

# 🧠 Floyd-Warshall is dead simple and hard to get wrong.
#    Use it when V ≤ 500 and you need all-pairs distances.


# ============================================================
#  8️⃣ A* PREVIEW
# ============================================================
# 🔹 Dijkstra + heuristic: prioritise nodes likely near target.
# 🔸 Priority = g(n) + h(n) — cost-so-far + heuristic.
# 🎯 Heuristic must be ADMISSIBLE (never overestimates).
# 🔸 Common heuristic: Manhattan / Euclidean distance on grids.

def astar(
    adj: dict[str, list[tuple[str, int]]],
    src: str,
    dst: str,
    heuristic: dict[str, int],
) -> tuple[int, list[str]] | None:
    INF = float("inf")
    g: dict[str, float] = {src: 0}
    parent: dict[str, str | None] = {src: None}
    heap: list[tuple[int, str]] = [(heuristic.get(src, 0), src)]
    closed: set[str] = set()
    while heap:
        _, u = heapq.heappop(heap)
        if u in closed:
            continue
        closed.add(u)
        if u == dst:
            path: list[str] = []
            cur: str | None = dst
            while cur is not None:
                path.append(cur)
                cur = parent.get(cur)
            return int(g[dst]), path[::-1]
        for v, w in adj.get(u, []):
            ng = g[u] + w
            if ng < g.get(v, INF):
                g[v] = ng
                parent[v] = u
                heapq.heappush(heap, (ng + heuristic.get(v, 0), v))
    return None

# 🧠 A* is widely used in games, maps, path planning.
#    On a uniform grid with Manhattan heuristic, it's often much
#    faster than Dijkstra.


# ============================================================
#  9️⃣ GRID SHORTEST PATH
# ============================================================
# 🔹 Grid = implicit graph; each cell has neighbours.
# 🔸 Use Dijkstra when edge weights vary; BFS when uniform.

def dijkstra_grid(
    grid: list[list[int]],
    src: tuple[int, int],
    dst: tuple[int, int],
) -> int:
    rows, cols = len(grid), len(grid[0])
    INF = float("inf")
    dist = [[INF] * cols for _ in range(rows)]
    sr, sc = src
    dr, dc = dst
    dist[sr][sc] = grid[sr][sc]
    heap: list[tuple[int, int, int]] = [(grid[sr][sc], sr, sc)]
    while heap:
        d, r, c = heapq.heappop(heap)
        if (r, c) == (dr, dc):
            return d
        if d > dist[r][c]:
            continue
        for nrd, ncd in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + nrd, c + ncd
            if 0 <= nr < rows and 0 <= nc < cols:
                nd = d + grid[nr][nc]
                if nd < dist[nr][nc]:
                    dist[nr][nc] = nd
                    heapq.heappush(heap, (nd, nr, nc))
    return -1

cost_grid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
]
print(dijkstra_grid(cost_grid, (0, 0), (2, 2)))    # 7

# 🔸 Uniform grid + obstacles → BFS with deque (file 13).

# 🧠 Recognise problems:
#    "minimum cost path in grid" → Dijkstra
#    "minimum STEPS in grid"     → BFS
#    "fewest moves for a knight" → BFS
#    "cheapest flight with k stops" → Bellman-Ford variant / DP


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Dijkstra is WRONG with negative weights — use Bellman-Ford.
# ⚠️ Dijkstra stale-entry check: `if d > dist[u]: continue`.
#    Without it: extra work (but still correct).
# ⚠️ Dijkstra with `visited` set: skip if node already popped.
# ⚠️ Bellman-Ford: relax ALL edges each iteration; stop early
#    when no update.
# ⚠️ Bellman-Ford detects negative cycles with one extra pass.
# ⚠️ Floyd-Warshall: `k` is the OUTER loop. Don't reorder.
# ⚠️ Floyd-Warshall: handle multi-edges with min().
# ⚠️ Floyd-Warshall: `dist[i][i] = 0` before k-loop; negative
#    self-loop → negative cycle.
# ⚠️ Disconnected graph: distances remain INF.
# ⚠️ A* heuristic MUST be admissible (never overestimate) or
#    the result can be wrong.
# ⚠️ Priority queue entries: use (distance, counter, node) when
#    node labels are uncomparable.
# ⚠️ Graph repr: adjacency list of (neighbour, weight) tuples
#    is the standard; matrix for dense small graphs.
# ⚠️ Recursion-free: all these algorithms are iterative.
# ⚠️ For very dense graphs, use the O(V²) Dijkstra with an
#    array-scan instead of a heap.
# ⚠️ K shortest paths is a different problem — use Yen's or
#    Eppstein's algorithm.

# 🕒 Version notes
# - heapq: Python 2.3+
# - math.inf: Python 3.5+ (use float('inf') for older)
# - PEP 604 unions: Python 3.10+
#   For 3.9 and below, use Optional / Union / Tuple
# - Python 3.11+ improves heapq / int operations
# - For very large weighted graphs, use scipy.sparse.csgraph.
#   dijkstra / floyd_warshall for C-speed
# - `networkx` provides all of these in Python (slower but
#   feature-rich)
# - No stdlib for shortest paths — write it yourself


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Algorithm      │ Weight       │ Weights         │ Time          |
# |----------------|--------------|-----------------|---------------|
# | BFS            │ unweighted   │ single source   │ O(V + E)      |
# | 0-1 BFS        │ 0 or 1       │ single source   │ O(V + E)      |
# | Dijkstra       │ ≥ 0          │ single source   │ O((V+E)log V) │
# | Bellman-Ford   │ any          │ single source   │ O(V · E)      |
# | Floyd-Warshall │ any (no neg  │ all pairs       │ O(V³)         |
# |                │ cycle)       │                 │               |
# | A*             │ ≥ 0 + h      │ single target   │ heuristic     |
# ─────────────────────────────────────────────────────────────
# | Need                             │ Use                        |
# ─────────────────────────────────────────────────────────────
# | Shortest path in unweighted      │ BFS                        |
# | Shortest path with 0/1 weights   │ 0-1 BFS (deque)            |
# | Shortest path with weights ≥ 0   │ Dijkstra                   |
# | Shortest path with negative      │ Bellman-Ford               |
# | Detect negative cycle            │ Bellman-Ford extra pass    |
# | All-pairs shortest paths         │ Floyd-Warshall (small V)   |
# | Grid min cost                    │ Dijkstra on grid           |
# | Grid min steps                   │ BFS on grid                |
# | Single target + heuristic        │ A*                         |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                  |
# ─────────────────────────────────────────────────────────────
# | Dijkstra with negative edges│ Wrong results                 |
# | Stale entry no skip         │ Extra work                    |
# | Floyd-Warshall reordered k  │ Wrong answer                  |
# | A* non-admissible heuristic │ Wrong answer                  |
# | Bellman-Ford no early exit  │ Slower on easy inputs         |
# | Multi-edges ignored         │ Wrong minimum                 |
# | Disconnected graph          │ INF values in output          |
# | Sorting tuples with ties    │ TypeError if uncomparable     |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - BFS for unweighted; Dijkstra for non-negative; Bellman-Ford
#    for anything goes.
#  - Always skip stale heap entries (`d > dist[u]`).
#  - Track parent[] for path reconstruction.
#  - Floyd-Warshall: outer loop k, inner i, j — order matters.
#  - Negative weights → Bellman-Ford; extra pass for detection.
#  - Priority queue tuples: add a counter to break ties.
#  - Dense graphs → O(V²) Dijkstra with linear scan.
#  - Grid problems: choose BFS (uniform) vs Dijkstra (costs).
#  - A* heuristic must be admissible — Manhattan on 4-dir grid,
#    Euclidean on 8-dir.
#  - Recognise which algorithm fits BEFORE coding.
#  - Test with: single node, disconnected graph, multi-edges,
#    negative cycle (detection), and ties in priority.
# ============================================================