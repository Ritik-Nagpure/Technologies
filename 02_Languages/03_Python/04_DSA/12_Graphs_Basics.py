# 12_Graphs_Basics.py

# ============================================================
#  📘 GRAPHS BASICS IN PYTHON — COMPLETE COVERAGE
#
#  A GRAPH is a set of vertices (nodes) connected by edges. It's
#  the most general data structure — trees, linked lists, and
#  DAGs are all special cases. Graphs model networks, maps,
#  dependencies, and relationships of every kind. Almost every
#  "real world" DSA problem is graph-shaped in disguise.
#
#  This file covers: graph terminology, representations
#  (adjacency list / matrix / edge list), directed vs undirected,
#  weighted vs unweighted, degree, connectivity, cycle detection
#  in undirected graphs, and building graph utilities.
#
#  Sections:
#   1. Graph terminology
#   2. Representations (list, matrix, edge list)
#   3. Directed vs undirected
#   4. Weighted graphs
#   5. Degree, in-degree, out-degree
#   6. Building a graph class
#   7. Connected components (undirected)
#   8. Cycle detection (undirected)
#   9. Bipartite check (2-colouring)
#  10. Common patterns & problem signals
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ GRAPH TERMINOLOGY
# ============================================================
# 🔹 Vertex / Node  : a point in the graph.
# 🔹 Edge           : a connection between two vertices.
# 🔹 Directed       : edges have direction (u → v).
# 🔹 Undirected     : edges are symmetric (u ↔ v).
# 🔹 Weighted       : edges carry a cost / distance.
# 🔹 Degree         : # of edges touching a vertex.
# 🔹 Path           : sequence of vertices connected by edges.
# 🔹 Cycle          : path that returns to its start.
# 🔹 Connected      : every vertex reachable from every other.
# 🔹 Component      : maximal connected subgraph.
# 🔹 DAG            : Directed Acyclic Graph.
# 🔹 Tree           : connected, acyclic, undirected graph.

# 🧠 If a problem mentions "network", "dependency", "route",
#    "friend-of-friend", "schedule" — it's a graph.


# ============================================================
#  2️⃣ REPRESENTATIONS
# ============================================================
# 🔹 ADJACENCY LIST  : dict / list of neighbours — preferred.
# 🔹 ADJACENCY MATRIX: 2D grid — fast edge lookup, O(V²) memory.
# 🔹 EDGE LIST        : list of (u, v) pairs — compact.

# ── Adjacency LIST (most common) ─────────────────────────────
# 🔸 Dict of vertex → list of neighbours
adj_list: dict[str, list[str]] = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}

print(adj_list["A"])            # ['B', 'C']

# 🔸 List-of-lists form (when vertices are 0..n-1)
adj_ll: list[list[int]] = [
    [1, 2],                     # neighbours of 0
    [0, 3],                     # neighbours of 1
    [0, 3],                     # neighbours of 2
    [1, 2],                     # neighbours of 3
]
print(adj_ll[3])                # [1, 2]

# ── Adjacency MATRIX ─────────────────────────────────────────
# 🔸 mat[u][v] == 1 if edge u→v, else 0. Weight stored as value.
n = 4
mat = [[0] * n for _ in range(n)]
edges = [(0, 1), (0, 2), (1, 3), (2, 3)]
for u, v in edges:
    mat[u][v] = 1
    mat[v][u] = 1               # undirected

for row in mat:
    print(row)
# [0, 1, 1, 0]
# [1, 0, 0, 1]
# [1, 0, 0, 1]
# [0, 1, 1, 0]

print(mat[1][3])                # 1 — O(1) edge check

# ── EDGE LIST ────────────────────────────────────────────────
edge_list: list[tuple[str, str]] = [
    ("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"),
]

# ── Comparison table ─────────────────────────────────────────
# | Representation    │ Space  │ Edge lookup │ Iterate neighbours |
# |-------------------|--------|-------------|--------------------|
# | Adjacency list    │ O(V+E) │ O(deg)      │ O(deg)             |
# | Adjacency matrix  │ O(V²)  │ O(1)        │ O(V)               |
# | Edge list         │ O(E)   │ O(E)        │ O(E) per query     |
#
# 🧠 Default to adjacency list. Use matrix for dense graphs or
#    O(1) edge queries. Use edge list for algorithms that only
#    iterate edges (Kruskal, Bellman-Ford).


# ============================================================
#  3️⃣ DIRECTED VS UNDIRECTED
# ============================================================
# 🔹 Undirected: each edge adds BOTH directions.
# 🔹 Directed  : edge u → v does NOT imply v → u.

# Undirected — add both ways
def add_undirected(adj: dict[str, list[str]], u: str, v: str) -> None:
    adj.setdefault(u, []).append(v)
    adj.setdefault(v, []).append(u)

# Directed — add one way only
def add_directed(adj: dict[str, list[str]], u: str, v: str) -> None:
    adj.setdefault(u, []).append(v)
    adj.setdefault(v, [])       # ensure v key exists with empty list

g: dict[str, list[str]] = {}
add_undirected(g, "A", "B")
add_directed(g, "B", "C")
print(g)                        # {'A': ['B'], 'B': ['A', 'C'], 'C': []}

# ⚠️ Forgetting to add both directions for undirected graphs is
#    the #1 bug. Double-check your input format.


# ============================================================
#  4️⃣ WEIGHTED GRAPHS
# ============================================================
# 🔹 Store (neighbour, weight) tuples.
# 🔸 Same representations, just richer values.

weighted: dict[str, list[tuple[str, int]]] = {
    "A": [("B", 1), ("C", 4)],
    "B": [("C", 2), ("D", 5)],
    "C": [("D", 1)],
    "D": [],
}

# 🔸 Iterate edges with weights
for u, neighbours in weighted.items():
    for v, w in neighbours:
        print(f"{u} -> {v} (cost {w})")

# 🔸 Weighted adjacency matrix
n = 4
INF = float("inf")
wmat = [[INF] * n for _ in range(n)]
for i in range(n):
    wmat[i][i] = 0              # distance to self = 0
for u, v, w in [(0, 1, 3), (1, 2, 2), (2, 3, 4)]:
    wmat[u][v] = w
    wmat[v][u] = w
print(wmat[0][1])               # 3

# 🧠 Weighted graph problems: Dijkstra, Bellman-Ford, Floyd-Warshall,
#    MST (Kruskal, Prim). See files 22–24.


# ============================================================
#  5️⃣ DEGREE, IN-DEGREE, OUT-DEGREE
# ============================================================
# 🔹 Undirected: degree = len(neighbours).
# 🔹 Directed  : out-degree = len(neighbours);
#               in-degree  = count of edges pointing IN.

def degrees_undirected(adj: dict[str, list[str]]) -> dict[str, int]:
    return {u: len(nbrs) for u, nbrs in adj.items()}

print(degrees_undirected(adj_list))     # {'A': 2, 'B': 2, 'C': 2, 'D': 2}

def in_out_degrees(adj: dict[str, list[str]]) -> tuple[dict[str, int], dict[str, int]]:
    out = {u: len(nbrs) for u, nbrs in adj.items()}
    indeg: dict[str, int] = {u: 0 for u in adj}
    for u, nbrs in adj.items():
        for v in nbrs:
            indeg[v] = indeg.get(v, 0) + 1
    return out, indeg

out, indeg = in_out_degrees({
    "A": ["B", "C"],
    "B": ["C"],
    "C": [],
})
print(out)     # {'A': 2, 'B': 1, 'C': 0}
print(indeg)   # {'A': 0, 'B': 1, 'C': 2}

# 🧠 Handshake lemma (undirected): Σ degree = 2 × |E|.
#    Sum of out-degrees = sum of in-degrees = |E| (directed).


# ============================================================
#  6️⃣ BUILDING A GRAPH CLASS
# ============================================================
# 🔹 A reusable wrapper with common helpers.

class Graph:
    def __init__(self, directed: bool = False) -> None:
        self.adj: dict[str, list[str]] = {}
        self.directed = directed

    def add_edge(self, u: str, v: str) -> None:
        self.adj.setdefault(u, []).append(v)
        if self.directed:
            self.adj.setdefault(v, [])
        else:
            self.adj.setdefault(v, []).append(u)

    def neighbours(self, u: str) -> list[str]:
        return self.adj.get(u, [])

    def vertices(self) -> list[str]:
        return list(self.adj)

    def edges(self) -> list[tuple[str, str]]:
        out: list[tuple[str, str]] = []
        for u, nbrs in self.adj.items():
            for v in nbrs:
                if self.directed or u < v:      # avoid duplicates
                    out.append((u, v))
        return out

    def __repr__(self) -> str:
        return f"Graph(directed={self.directed}, adj={self.adj})"

g = Graph(directed=False)
for u, v in [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D")]:
    g.add_edge(u, v)
print(g)
print(g.edges())                # [('A','B'), ('A','C'), ('B','D'), ('C','D')]


# ============================================================
#  7️⃣ CONNECTED COMPONENTS (UNDIRECTED)
# ============================================================
# 🔹 DFS/BFS from each unvisited vertex.
# 🔸 Each fresh start = one new component.
# 🎯 O(V + E).

def connected_components(adj: dict[str, list[str]]) -> list[list[str]]:
    visited: set[str] = set()
    components: list[list[str]] = []

    def dfs(u: str, comp: list[str]) -> None:
        visited.add(u)
        comp.append(u)
        for v in adj.get(u, []):
            if v not in visited:
                dfs(v, comp)

    for u in adj:
        if u not in visited:
            comp: list[str] = []
            dfs(u, comp)
            components.append(comp)
    return components

g = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"],
    "D": ["E"],
    "E": ["D"],
    "F": [],
}
print(connected_components(g))
# [['A','B','C'], ['D','E'], ['F']]

# 🧠 One DFS call visits exactly one connected component.


# ============================================================
#  8️⃣ CYCLE DETECTION (UNDIRECTED)
# ============================================================
# 🔹 DFS with parent tracking: if we reach a visited neighbour
#    that ISN'T our parent → cycle.
# 🔸 O(V + E).

def has_cycle_undirected(adj: dict[str, list[str]]) -> bool:
    visited: set[str] = set()

    def dfs(u: str, parent: str | None) -> bool:
        visited.add(u)
        for v in adj.get(u, []):
            if v not in visited:
                if dfs(v, u):
                    return True
            elif v != parent:
                return True         # back edge → cycle
        return False

    for u in adj:
        if u not in visited:
            if dfs(u, None):
                return True
    return False

g_cycle = {"A": ["B"], "B": ["A", "C"], "C": ["B", "A"]}    # A-B-C-A
print(has_cycle_undirected(g_cycle))    # True

g_tree = {"A": ["B", "C"], "B": ["A"], "C": ["A"]}          # tree
print(has_cycle_undirected(g_tree))     # False

# ⚠️ In multigraphs (parallel edges), this check misreports —
#    track edge IDs instead of parent vertex.
# 🧠 Cycle detection in DIRECTED graphs uses a different
#    approach (white/gray/black colouring) — see file 24.


# ============================================================
#  9️⃣ BIPARTITE CHECK (2-COLOURING)
# ============================================================
# 🔹 A graph is bipartite if its vertices can be split into two
#    sets with no edge within a set.
# 🔸 Equivalent: 2-colourable, no odd-length cycle.
# 🎯 BFS/DFS with 2-colouring; O(V + E).

from collections import deque

def is_bipartite(adj: dict[str, list[str]]) -> bool:
    colour: dict[str, int] = {}
    for start in adj:
        if start in colour:
            continue
        colour[start] = 0
        q: deque[str] = deque([start])
        while q:
            u = q.popleft()
            for v in adj.get(u, []):
                if v not in colour:
                    colour[v] = 1 - colour[u]       # opposite
                    q.append(v)
                elif colour[v] == colour[u]:
                    return False
    return True

# Even cycle → bipartite
even = {"A": ["B"], "B": ["A", "C"], "C": ["B", "D"], "D": ["C", "A"]}
print(is_bipartite(even))               # True

# Triangle → NOT bipartite
triangle = {"A": ["B", "C"], "B": ["A", "C"], "C": ["A", "B"]}
print(is_bipartite(triangle))           # False

# 🧠 Bipartite ↔ no odd cycle. Used in matching, scheduling,
#    and 2-colouring problems.


# ============================================================
#  🔟 COMMON PATTERNS & PROBLEM SIGNALS
# ============================================================
# 🔹 "Shortest path" (unweighted) → BFS.
# 🔹 "Shortest path" (weighted, non-negative) → Dijkstra.
# 🔹 "Negative weights" → Bellman-Ford.
# 🔹 "All pairs shortest paths" → Floyd-Warshall.
# 🔹 "Ordering with dependencies" → Topological Sort (DAG).
# 🔹 "Cycle in directed graph" → DFS with colours / Kahn's.
# 🔹 "Connected groups" → DFS / Union-Find.
# 🔹 "Minimum cost to connect" → MST (Kruskal / Prim).
# 🔹 "Reachability" → DFS / BFS.
# 🔹 "Bipartite / matching" → 2-colour / Hungarian / Hopcroft-Karp.

# 🔸 Graph model checklist before coding:
#     1. Directed or undirected?
#     2. Weighted or not?
#     3. Dense or sparse? (matrix vs list)
#     4. Vertices labelled how? (int / str / coordinates)
#     5. Self loops or multi-edges?


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Always handle isolated vertices (present in dict with empty
#    list) — otherwise they're silently dropped.
# ⚠️ Undirected: add BOTH directions. Forgetting breaks everything.
# ⚠️ Directed: ensure every vertex exists as a key, even with no
#    outgoing edges.
# ⚠️ Use `visited` sets — without them, DFS/BFS loops forever on
#    cycles.
# ⚠️ Matrix form: remember O(V²) memory — fine for V ≤ a few
#    thousand.
# ⚠️ Adjacency list neighbours are usually stored as sets if you
#    need dedup or fast membership.
# ⚠️ Weight may be negative — BFS + weighted does NOT work,
#    use Bellman-Ford.
# ⚠️ Multi-edges: adjacency list will contain duplicates; dedup
#    with a set if needed.
# ⚠️ Self loops: check for u == v in cycle detection.
# ⚠️ Recursion depth in DFS: for V > ~500, use iterative stack
#    or raise the limit.
# ⚠️ Bipartite check: a graph with no edges is trivially bipartite.
# ⚠️ Order of iteration over dict keys is insertion order (3.7+),
#    not sorted — if the problem needs a specific order, sort
#    explicitly.

# 🕒 Version notes
# - dict preserves insertion order: Python 3.7+
# - set / dict comprehensions for building adjacency: 2.7+ / 3.0+
# - deque for BFS: Python 2.4+
# - recursion limit ~1000: use iterative DFS for large graphs
# - `collections.defaultdict(list)` for adjacency: always available
# - `dataclass`-based Edge class: Python 3.7+
# - PEP 604 unions (str | None): Python 3.10+
# - `int.bit_count()` useful for bitmask DP over graphs: 3.10+

# 🔎 Build adjacency via defaultdict (idiomatic)
from collections import defaultdict

def build_adj(edges: list[tuple[str, str]], directed: bool = False):
    adj: defaultdict[str, list[str]] = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        if not directed:
            adj[v].append(u)
        else:
            adj[v]                        # ensure key exists
    return dict(adj)

print(build_adj([("A", "B"), ("B", "C")]))
# {'A': ['B'], 'B': ['A', 'C'], 'C': ['B']}


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Representation    │ Best for          │ Space  │ Edge lookup |
# ─────────────────────────────────────────────────────────────
# | Adjacency list    │ Sparse graphs     │ O(V+E) │ O(deg)      |
# | Adjacency matrix  │ Dense / O(1) check│ O(V²)  │ O(1)        |
# | Edge list         │ Kruskal, BF       │ O(E)   │ O(E)        |
# ─────────────────────────────────────────────────────────────
# | Graph variant     │ Add edges how?                          |
# ─────────────────────────────────────────────────────────────
# | Undirected        │ add both (u,v) and (v,u)                |
# | Directed          │ add only (u,v); ensure v key exists     |
# | Weighted          │ store (v, w) tuples                     |
# | Multigraph        │ dedup with set if needed                |
# ─────────────────────────────────────────────────────────────
# | Problem signal        │ Algorithm to reach for             |
# ─────────────────────────────────────────────────────────────
# | Connected components  │ DFS / BFS / Union-Find             |
# | Cycle (undirected)    │ DFS with parent tracking           |
# | Cycle (directed)      │ DFS colours / Kahn's algorithm     |
# | Bipartite / 2-colour  │ BFS colouring                      |
# | Shortest path (BFS)   │ BFS with distance array            |
# | Shortest path (w ≥ 0) │ Dijkstra                           |
# | Negative weights      │ Bellman-Ford                       |
# | All pairs shortest    │ Floyd-Warshall                     |
# | DAG ordering          │ Topological sort                   |
# | MST                   │ Kruskal / Prim                     |
# | Matching              │ Hopcroft-Karp / Hungarian          |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Undirected missing reverse │ Edge unreachable from v        |
# | No visited set             │ Infinite loop on cycles        |
# | Isolated vertex dropped    │ Missing key in dict            |
# | Weighted treated as BFS    │ Wrong shortest-path results    |
# | Recursion depth            │ RecursionError on large V      |
# | Duplicate edges unhandled  │ Extra work / wrong counts      |
# | Self-loops ignored         │ Wrong cycle detection          |
# | Matrix for huge V          │ Memory blowup                  |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Default to adjacency list; switch to matrix only for dense
#    graphs or O(1) edge lookups.
#  - Always maintain a `visited` set in traversals.
#  - Ensure isolated vertices appear as keys with empty neighbours.
#  - Undirected = add both directions; directed = add one.
#  - For weighted edges, store (neighbour, weight).
#  - Prefer iterative DFS/BFS for large graphs (recursion limit).
#  - Build adjacency with defaultdict(list) for clean code.
#  - Identify graph problems early: "network", "route", "depends",
#    "friend", "path", "cluster" — all graph signals.
#  - Match algorithm to weights and direction (BFS / Dijkstra /
#    Bellman-Ford / Floyd-Warshall).
#  - Test with edge cases: single vertex, empty graph, self-loop,
#    multi-edge, disconnected components.
# ============================================================