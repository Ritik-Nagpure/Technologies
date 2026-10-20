# 13_Graph_Traversals_BFS_DFS.py

# ============================================================
#  📘 GRAPH TRAVERSALS: BFS & DFS IN PYTHON — COMPLETE COVERAGE
#
#  BFS (Breadth-First Search) explores a graph LEVEL BY LEVEL
#  using a queue. DFS (Depth-First Search) explores as deep as
#  possible before backtracking, using a stack or recursion.
#  Together they are the foundation of almost every graph
#  algorithm: shortest paths, cycle detection, topological sort,
#  connected components, and more.
#
#  This file covers: BFS iterative, BFS levels, shortest path
#  (unweighted), DFS recursive + iterative, preorder/postorder
#  DFS, connected components, cycle detection (both directed and
#  undirected), grid BFS/DFS (islands), and complexity notes.
#
#  Sections:
#   1. BFS vs DFS at a glance
#   2. BFS — iterative with deque
#   3. BFS with levels (distance tracking)
#   4. Shortest path in an unweighted graph
#   5. Multi-source BFS
#   6. DFS — recursive
#   7. DFS — iterative with stack
#   8. Connected components (DFS + BFS)
#   9. Cycle detection — undirected
#  10. Cycle detection — directed (colors)
#  11. Grid BFS/DFS — number of islands
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ BFS VS DFS AT A GLANCE
# ============================================================
# ── Side-by-side ─────────────────────────────────────────────
# | Feature            │ BFS                │ DFS                |
# |--------------------|--------------------|--------------------|
# | Data structure     │ queue (deque)      │ stack / recursion  |
# | Order              │ level by level     │ deep first         |
# | Shortest path (uw) │ ✅ YES             │ ❌ NO              |
# | Memory             │ O(width)           │ O(depth)           |
# | Recursion risk     │ none (iterative)   │ high on deep graphs|
# | Uses               │ shortest path,     │ topo sort, cycle,  |
# |                    │ levels, min moves  │ components, LCA    |
# ─────────────────────────────────────────────────────────────
#
# 🧠 Rule of thumb:
#   - Need SHORTEST path / min steps → BFS.
#   - Need to explore/backtrack deep → DFS.
#   - Need level-order info → BFS.
#   - Need finishing order → DFS (postorder).


# ============================================================
#  2️⃣ BFS — ITERATIVE WITH DEQUE
# ============================================================
# 🔹 Visit start, enqueue it; pop from front, enqueue unvisited
#    neighbours; repeat.
# 🔸 O(V + E) time, O(V) space.

from collections import deque

def bfs(adj: dict[str, list[str]], start: str) -> list[str]:
    visited: set[str] = {start}
    order: list[str] = []
    q: deque[str] = deque([start])
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj.get(u, []):
            if v not in visited:
                visited.add(v)
                q.append(v)
    return order

g = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
print(bfs(g, "A"))              # ['A', 'B', 'C', 'D', 'E', 'F']

# ⚠️ Mark visited WHEN ENQUEUING, not when popping — otherwise
#    the same node can be enqueued twice.
# ❌ Wrong version:
#     q.append(v) → only mark visited on popleft
# 🧠 Always: visited.add(v) BEFORE q.append(v).


# ============================================================
#  3️⃣ BFS WITH LEVELS (DISTANCE TRACKING)
# ============================================================
# 🔹 Snapshot the queue size at the start of each level.
# 🔸 Or store (node, distance) tuples.
# 🎯 Used for "levels", "minimum steps", "min moves".

def bfs_levels(adj: dict[str, list[str]], start: str) -> dict[str, int]:
    dist: dict[str, int] = {start: 0}
    q: deque[str] = deque([start])
    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

print(bfs_levels(g, "A"))
# {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 2, 'F': 2}

# 🔸 Group by level (returns list of lists)
def bfs_by_level(adj: dict[str, list[str]], start: str) -> list[list[str]]:
    levels: list[list[str]] = []
    visited: set[str] = {start}
    q: deque[str] = deque([start])
    while q:
        size = len(q)                   # ← snapshot BEFORE inner loop
        level: list[str] = []
        for _ in range(size):
            u = q.popleft()
            level.append(u)
            for v in adj.get(u, []):
                if v not in visited:
                    visited.add(v)
                    q.append(v)
        levels.append(level)
    return levels

print(bfs_by_level(g, "A"))
# [['A'], ['B', 'C'], ['D', 'E', 'F']]

# 🧠 Snapshot len(q) at each level — that's the whole trick.


# ============================================================
#  4️⃣ SHORTEST PATH IN AN UNWEIGHTED GRAPH
# ============================================================
# 🔹 BFS gives shortest path in EDGE COUNT.
# 🔸 Track parent to reconstruct the path.

def shortest_path(adj: dict[str, list[str]], start: str, goal: str) -> list[str] | None:
    if start == goal:
        return [start]
    parent: dict[str, str | None] = {start: None}
    q: deque[str] = deque([start])
    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in parent:
                parent[v] = u
                if v == goal:
                    # Reconstruct path by walking parents backward
                    path: list[str] = [v]
                    cur = u
                    while cur is not None:
                        path.append(cur)
                        cur = parent[cur]
                    return path[::-1]
                q.append(v)
    return None

print(shortest_path(g, "A", "F"))       # ['A', 'C', 'F']   (length 2)
print(shortest_path(g, "A", "D"))       # ['A', 'B', 'D']   (length 2)
print(shortest_path(g, "A", "Z"))       # None

# ⚠️ BFS gives shortest in UNWEIGHTED graphs only.
#    For weighted, use Dijkstra (file 23).
# 🧠 Parent map + backtrack = reconstruction pattern.


# ============================================================
#  5️⃣ MULTI-SOURCE BFS
# ============================================================
# 🔹 Start BFS from MANY sources at once.
# 🔸 Enqueue all sources with distance 0.
# 🎯 Use case: "distance to nearest 0 in a grid",
#    "rotting oranges", "walls and gates".

def multi_source_bfs(
    adj: dict[str, list[str]],
    sources: list[str],
) -> dict[str, int]:
    dist: dict[str, int] = {s: 0 for s in sources}
    q: deque[str] = deque(sources)
    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

g2 = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C", "E"],
    "E": ["D"],
}
print(multi_source_bfs(g2, ["A", "E"]))
# {'A': 0, 'E': 0, 'B': 1, 'C': 1, 'D': 1}

# 🧠 Multi-source BFS is just BFS with many starts in the queue.
#    Very common in grid problems.


# ============================================================
#  6️⃣ DFS — RECURSIVE
# ============================================================
# 🔹 Visit, recurse on unvisited neighbours, backtrack.
# 🔸 O(V + E) time, O(depth) stack space.
# ⚠️ Recursion limit ~1000 → prefer iterative for deep graphs.

def dfs_rec(adj: dict[str, list[str]], start: str) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    def go(u: str) -> None:
        visited.add(u)
        order.append(u)
        for v in adj.get(u, []):
            if v not in visited:
                go(v)
    go(start)
    return order

print(dfs_rec(g, "A"))          # ['A', 'B', 'D', 'E', 'F', 'C']  (order varies)

# 🔸 Classic DFS variants:
#    - PREORDER : append BEFORE recursing (above)
#    - POSTORDER: append AFTER recursing (children first)
def dfs_postorder(adj: dict[str, list[str]], start: str) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    def go(u: str) -> None:
        visited.add(u)
        for v in adj.get(u, []):
            if v not in visited:
                go(v)
        order.append(u)         # post-order push
    go(start)
    return order

print(dfs_postorder(g, "A"))    # ['D', 'B', 'E', 'F', 'C', 'A']  (varies)

# 🧠 Postorder is the basis of topological sort (file 24).


# ============================================================
#  7️⃣ DFS — ITERATIVE WITH STACK
# ============================================================
# 🔹 Explicit stack → no recursion depth limit.
# 🔸 Push right-to-left so left is popped first (order match).

def dfs_iter(adj: dict[str, list[str]], start: str) -> list[str]:
    visited: set[str] = set()
    order: list[str] = []
    stack: list[str] = [start]
    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        order.append(u)
        # Push neighbours in reverse order so left-most is popped first
        for v in reversed(adj.get(u, [])):
            if v not in visited:
                stack.append(v)
    return order

print(dfs_iter(g, "A"))         # ['A', 'B', 'D', 'E', 'F', 'C']

# ⚠️ Without the `if u in visited: continue` check, the same node
#    can be pushed multiple times. It's fine but wasteful —
#    skipping at pop keeps the order clean.
# 🧠 `reversed(...)` matches recursive DFS order when the
#    neighbour list is ordered.


# ============================================================
#  8️⃣ CONNECTED COMPONENTS (DFS + BFS)
# ============================================================
# 🔹 Count components, list members, or check connectivity.
# 🔸 Loop over all vertices, run DFS on unvisited ones.

def count_components(adj: dict[str, list[str]]) -> int:
    visited: set[str] = set()
    count = 0
    for start in adj:
        if start in visited:
            continue
        count += 1
        stack: list[str] = [start]
        while stack:
            u = stack.pop()
            if u in visited:
                continue
            visited.add(u)
            for v in adj.get(u, []):
                if v not in visited:
                    stack.append(v)
    return count

g3 = {
    "A": ["B"],
    "B": ["A"],
    "C": [],
    "D": ["E"],
    "E": ["D"],
}
print(count_components(g3))     # 3

# 🔸 Same via BFS
def count_components_bfs(adj: dict[str, list[str]]) -> int:
    visited: set[str] = set()
    count = 0
    for start in adj:
        if start in visited:
            continue
        count += 1
        q: deque[str] = deque([start])
        visited.add(start)
        while q:
            u = q.popleft()
            for v in adj.get(u, []):
                if v not in visited:
                    visited.add(v)
                    q.append(v)
    return count

print(count_components_bfs(g3)) # 3

# 🧠 Each fresh start = one new component.


# ============================================================
#  9️⃣ CYCLE DETECTION — UNDIRECTED
# ============================================================
# 🔹 DFS with parent tracking.
# 🔸 If we see a visited node that isn't the parent → cycle.

def has_cycle_undirected(adj: dict[str, list[str]]) -> bool:
    visited: set[str] = set()

    def dfs(u: str, parent: str | None) -> bool:
        visited.add(u)
        for v in adj.get(u, []):
            if v not in visited:
                if dfs(v, u):
                    return True
            elif v != parent:
                return True
        return False

    for start in adj:
        if start not in visited:
            if dfs(start, None):
                return True
    return False

print(has_cycle_undirected({"A": ["B"], "B": ["A", "C"], "C": ["B", "A"]}))   # True
print(has_cycle_undirected({"A": ["B"], "B": ["A"]}))                          # False

# 🧠 Parent check avoids flagging the edge you just came from.


# ============================================================
#  🔟 CYCLE DETECTION — DIRECTED (COLORS)
# ============================================================
# 🔹 Three colours:
#     WHITE (0) = unvisited
#     GRAY  (1) = in current DFS path
#     BLACK (2) = fully processed
# 🔸 An edge to a GRAY node = back edge = cycle.
# 🎯 O(V + E) — the standard for directed graphs.

WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle_directed(adj: dict[str, list[str]]) -> bool:
    colour: dict[str, int] = {u: WHITE for u in adj}

    def dfs(u: str) -> bool:
        colour[u] = GRAY
        for v in adj.get(u, []):
            if colour[v] == GRAY:
                return True             # back edge
            if colour[v] == WHITE and dfs(v):
                return True
        colour[u] = BLACK
        return False

    for u in adj:
        if colour[u] == WHITE:
            if dfs(u):
                return True
    return False

dag = {"A": ["B"], "B": ["C"], "C": []}                 # DAG
cycle = {"A": ["B"], "B": ["C"], "C": ["A"]}            # cycle
print(has_cycle_directed(dag))          # False
print(has_cycle_directed(cycle))        # True

# 🧠 Cycle in directed graphs ≠ undirected cycle logic.
#    Colors (white/gray/black) is the classic, correct way.


# ============================================================
#  1️⃣1️⃣ GRID BFS/DFS — NUMBER OF ISLANDS
# ============================================================
# 🔹 Grid = implicit graph; each cell has up to 4 neighbours.
# 🔸 Standard 4-directional DFS flood-fill.

def num_islands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r: int, c: int) -> None:
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != "1":
            return
        grid[r][c] = "0"                # mark visited IN PLACE
        dfs(r + 1, c); dfs(r - 1, c)
        dfs(r, c + 1); dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count

grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
]
print(num_islands(grid))        # 3

# 🔸 BFS version (safer for very large grids)
def num_islands_bfs(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                q: deque[tuple[int, int]] = deque([(r, c)])
                grid[r][c] = "0"
                while q:
                    x, y = q.popleft()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                            grid[nx][ny] = "0"
                            q.append((nx, ny))
    return count

grid2 = [row[:] for row in grid]
print(num_islands_bfs(grid2))   # 3

# 🧠 Grid DFS/BFS patterns:
#    - "flood fill"        → DFS/BFS from any start cell
#    - "shortest path"     → BFS with distance
#    - "count regions"     → iterate + flood each region
#    - "number of islands" → above
#    - "rotten oranges"    → multi-source BFS
#    - "walls and gates"   → multi-source BFS
# Direction arrays:
#    dirs = [(1,0), (-1,0), (0,1), (0,-1)]        # 4-way
#    dirs += [(1,1), (1,-1), (-1,1), (-1,-1)]     # +diagonals


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ BFS: mark visited when ENQUEUING (not when popping).
#    Otherwise the same node can be enqueued multiple times.
# ⚠️ DFS recursive: mark visited BEFORE recursion. Otherwise
#    infinite loop on cycles.
# ⚠️ Undirected graph: parent check avoids false cycle detection.
# ⚠️ Directed graph: use color (white/gray/black), NOT parent.
# ⚠️ Recursion depth for DFS on chain of 10^5 → RecursionError.
#    Use iterative stack.
# ⚠️ Grid problems: check bounds BEFORE indexing.
# ⚠️ Grid mutation vs a separate visited set — pick one and stick
#    with it. Mutating input is O(1) space but destroys data.
# ⚠️ Neighbour order affects the traversal order but not the set
#    of visited nodes.
# ⚠️ BFS shortest path only works on UNWEIGHTED graphs (or all
#    edges equal weight).
# ⚠️ Multi-source BFS: initialise ALL sources to dist 0.
# ⚠️ For huge graphs, avoid `list(adj[u])` copies in tight loops.
# ⚠️ Cycles in directed graphs are NOT the same as undirected —
#    a two-edge pair (A→B, B→A) is a cycle in directed but not
#    in undirected sense (in undirected it's just an edge).

# 🕒 Version notes
# - deque for BFS: Python 2.4+
# - set() for visited: always available
# - PEP 604 unions (str | None): Python 3.10+
#   For 3.9 and below use Optional[str]
# - `math.inf` for large distances: Python 3.5+
# - `collections.defaultdict(list)` for adjacency: always
# - Recursion limit ~1000 by default: plan iterative DFS for
#   large graphs
# - Python 3.11+ has faster interpreter — practical speedups
#   for large BFS/DFS loops


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Traversal  │ Data structure      │ Order           │ Notes   |
# ─────────────────────────────────────────────────────────────
# | BFS        │ deque               │ level by level  │ shortest path (uw) |
# | DFS (rec)  │ call stack          │ depth-first     │ simple, risky deep |
# | DFS (iter) │ explicit stack      │ depth-first     │ no recursion limit |
# ─────────────────────────────────────────────────────────────
# | Task                     │ Best choice                  |
# ─────────────────────────────────────────────────────────────
# | Shortest path (unweighted)│ BFS with parent map         |
# | Levels / min moves        │ BFS with level snapshot     |
# | Multi-source distance     │ Multi-source BFS            |
# | Connectivity / components │ DFS or BFS from each start  |
# | Cycle (undirected)        │ DFS with parent tracking    |
# | Cycle (directed)          │ DFS with 3 colours          |
# | Topological order (DAG)   │ DFS postorder (reverse)     |
# | Grid flood fill           │ DFS or BFS (4 dirs)         |
# | Rotting / walls           │ Multi-source BFS            |
# ─────────────────────────────────────────────────────────────
# | Complexity          │ Time      │ Space                     |
# ─────────────────────────────────────────────────────────────
# | BFS                 │ O(V+E)    │ O(V)                      |
# | DFS                 │ O(V+E)    │ O(V) (stack/recursion)    |
# | Grid BFS/DFS        │ O(R*C)    │ O(R*C)                    |
# ─────────────────────────────────────────────────────────────
# | Pitfall                        │ Why it bites             |
# ─────────────────────────────────────────────────────────────
# | Mark visited on pop            │ Duplicate queue entries  |
# | Recursion DFS without visited  │ Infinite loop on cycles  |
# | Undirected cycle via colours   │ Wrong tool               |
# | Directed cycle via parent      │ Misses back edges        |
# | BFS for weighted               │ Wrong shortest path      |
# | Grid without bounds check      │ IndexError               |
# | Deep recursion DFS             │ RecursionError           |
# | Multi-source with one start    │ Wrong distances          |
# | Modifying grid vs visited set  │ Destroys input / dupes   |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - BFS: use deque; mark visited BEFORE enqueue.
#  - BFS: snapshot len(q) for level-by-level processing.
#  - DFS: prefer iterative with explicit stack for large graphs.
#  - DFS: mark visited BEFORE recursing.
#  - Cycle (undirected): DFS with parent tracking.
#  - Cycle (directed): DFS with WHITE/GRAY/BLACK colours.
#  - Grid problems: bounds-check first, then check cell value.
#  - Shortest path (unweighted): BFS + parent map.
#  - Multi-source BFS: seed queue with all sources at dist 0.
#  - Never use BFS to find shortest path on weighted graphs.
#  - Cache `adj.get(u, [])` in tight loops if needed.
#  - Test: empty graph, single node, self-loop, disconnected
#    components, and deep chain.
#  - Draw the graph on paper for tricky stateful traversals.
# ============================================================