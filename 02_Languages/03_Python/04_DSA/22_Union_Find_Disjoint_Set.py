# 22_Union_Find_Disjoint_Set.py

# ============================================================
#  📘 UNION-FIND (DISJOINT SET UNION) IN PYTHON
#
#  Union-Find (aka Disjoint Set Union / DSU) maintains a
#  collection of disjoint sets under two operations: FIND
#  (which set does an element belong to?) and UNION (merge two
#  sets). With two simple optimisations — PATH COMPRESSION and
#  UNION BY RANK/SIZE — both operations become nearly O(1)
#  amortised.
#
#  It's the go-to structure for dynamic connectivity: Kruskal's
#  MST, cycle detection, connected components, K-clustering,
#  and grid percolation.
#
#  Sections:
#   1. What Union-Find solves
#   2. Basic (naive) implementation
#   3. Path compression
#   4. Union by rank / size
#   5. Full optimised implementation
#   6. Number of connected components
#   7. Cycle detection in undirected graphs
#   8. Kruskal's MST
#   9. Grid problems (percolation / provinces)
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT UNION-FIND SOLVES
# ============================================================
# 🔹 Maintains a partition of N elements into disjoint sets.
# 🔸 Operations:
#     make_set(x)   → create a set containing only x
#     find(x)       → representative (root) of x's set
#     union(x, y)   → merge the sets containing x and y
#     connected(x,y)→ same set?
# 🎯 Perfect for: "are these two in the same group?" and
#    "merge these two groups" — answered nearly O(1) each.

# ── Complexity ───────────────────────────────────────────────
# | Version                    │ find / union          |
# |----------------------------|-----------------------|
# | Naive (no opts)            │ O(n)                  |
# | + path compression         │ O(log n) amortised    |
# | + union by rank            │ O(α(n)) ≈ O(1)        |
# ─────────────────────────────────────────────────────────────
# α(n) = inverse Ackermann — less than 5 for any practical n.
# 🧠 Once you add BOTH optimisations, operations are effectively
#    constant time.


# ============================================================
#  2️⃣ BASIC (NAIVE) IMPLEMENTATION
# ============================================================
# 🔹 parent[i] = i initially → each element is its own set.
# 🔸 find(x) walks parent pointers to the root.
# 🔸 union(x, y) points one root at the other.

class NaiveUF:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, x: int, y: int) -> None:
        rx, ry = self.find(x), self.find(y)
        if rx != ry:
            self.parent[rx] = ry

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)

# ⚠️ Worst case: chain-like structure → find() is O(n).
#    A degenerate sequence of unions can build a linked list.
uf = NaiveUF(5)
uf.union(0, 1)
uf.union(1, 2)
uf.union(2, 3)
uf.union(3, 4)
# parent = [0, 0, 1, 2, 3]  ← chain of length 4
# 🧠 The two optimisations below fix this.


# ============================================================
#  3️⃣ PATH COMPRESSION
# ============================================================
# 🔹 During find(x), make every node on the path point
#    directly to the root.
# 🔸 Flattens the tree over time → nearly flat after many ops.

def find_pc(parent: list[int], x: int) -> int:
    # Iterative version — avoids recursion depth issues
    root = x
    while parent[root] != root:
        root = parent[root]
    # Compress path
    while parent[x] != root:
        parent[x], x = root, parent[x]
    return root

# ✅ Recursive version (elegant but limited by recursion depth):
def find_pc_rec(parent: list[int], x: int) -> int:
    if parent[x] != x:
        parent[x] = find_pc_rec(parent, parent[x])
    return parent[x]

# 🧠 Path compression alone gives amortised O(log n).
# 🧠 It does NOT need to be perfect — partial compression
#    (path halving) also works:
def find_halving(parent: list[int], x: int) -> int:
    while parent[x] != x:
        parent[x] = parent[parent[x]]       # skip a generation
        x = parent[x]
    return x


# ============================================================
#  4️⃣ UNION BY RANK / SIZE
# ============================================================
# 🔹 Attach the SMALLER tree under the LARGER one's root.
# 🔸 Prevents the tree from getting tall.
# 🎯 Two variants:
#     - Union by rank: rank ≈ upper bound on height.
#     - Union by size: size = number of nodes.

def union_by_rank(
    parent: list[int],
    rank: list[int],
    x: int,
    y: int,
) -> bool:
    rx = find_pc(parent, x)
    ry = find_pc(parent, y)
    if rx == ry:
        return False                        # already same set
    if rank[rx] < rank[ry]:
        rx, ry = ry, rx
    parent[ry] = rx
    if rank[rx] == rank[ry]:
        rank[rx] += 1
    return True

def union_by_size(parent: list[int], size: list[int], x: int, y: int) -> bool:
    rx = find_pc(parent, x)
    ry = find_pc(parent, y)
    if rx == ry:
        return False
    if size[rx] < size[ry]:
        rx, ry = ry, rx
    parent[ry] = rx
    size[rx] += size[ry]
    return True

# 🧠 Rank/size gives O(log n) find worst-case — but combined
#    with path compression, it's O(α(n)).


# ============================================================
#  5️⃣ FULL OPTIMISED IMPLEMENTATION
# ============================================================
# 🔹 Production-ready DSU class with both optimisations.

class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x: int) -> int:
        # Path halving — simple and fast
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, x: int, y: int) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        # Union by size
        if self.size[rx] < self.size[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        self.size[rx] += self.size[ry]
        self.components -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)

    def component_size(self, x: int) -> int:
        return self.size[self.find(x)]

    def add(self) -> int:
        """Dynamic add — returns index of the new element."""
        i = len(self.parent)
        self.parent.append(i)
        self.size.append(1)
        self.components += 1
        return i

uf = UnionFind(5)
uf.union(0, 1)
uf.union(2, 3)
uf.union(3, 4)
print(uf.connected(0, 1))           # True
print(uf.connected(0, 2))           # False
uf.union(1, 2)
print(uf.connected(0, 4))           # True
print(uf.components)                # 1

# 🧠 `components` counter saves a pass — updated during union.


# ============================================================
#  6️⃣ NUMBER OF CONNECTED COMPONENTS
# ============================================================
# 🔹 Trivial with DSU: start with n components; decrement per
#    successful union.
# 🎯 LeetCode classic: "number of provinces", "number of islands II".

def count_components(n: int, edges: list[tuple[int, int]]) -> int:
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.components

print(count_components(5, [(0,1),(2,3),(3,4)]))     # 2
print(count_components(5, [(0,1),(1,2),(2,3),(3,4)])) # 1
print(count_components(5, []))                       # 5

# 🔸 Alternative: count distinct roots after all unions.
def count_components_roots(n: int, edges: list[tuple[int, int]]) -> int:
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return len({uf.find(i) for i in range(n)})


# ============================================================
#  7️⃣ CYCLE DETECTION IN UNDIRECTED GRAPHS
# ============================================================
# 🔹 For each edge (u, v):
#     - If u and v are ALREADY in the same set → cycle.
#     - Else union them.
# 🔸 O(E α(V)) — near linear.

def has_cycle_undirected(n: int, edges: list[tuple[int, int]]) -> bool:
    uf = UnionFind(n)
    for u, v in edges:
        if uf.connected(u, v):
            return True
        uf.union(u, v)
    return False

# Tree (no cycle):
print(has_cycle_undirected(4, [(0,1),(1,2),(2,3)]))         # False
# Cycle: 0-1-2-0
print(has_cycle_undirected(3, [(0,1),(1,2),(2,0)]))         # True

# 🧠 Compare with DFS approach (file 13): DSU is simpler for
#    undirected graphs, but DFS is needed for DIRECTED graphs.
# 🧠 DSU also handles self-loops: (u, u) → connected → cycle.


# ============================================================
#  8️⃣ KRUSKAL'S MINIMUM SPANNING TREE
# ============================================================
# 🔹 Sort edges by weight.
# 🔸 Add edge if it doesn't create a cycle (DSU check).
# 🎯 The canonical DSU application.
#    Time: O(E log E) for sort + O(E α(V)) for DSU.

def kruskal(
    n: int,
    edges: list[tuple[int, int, int]],      # (u, v, weight)
) -> tuple[int, list[tuple[int, int, int]]]:
    edges = sorted(edges, key=lambda e: e[2])
    uf = UnionFind(n)
    mst: list[tuple[int, int, int]] = []
    total = 0
    for u, v, w in edges:
        if uf.union(u, v):                  # returns True if merged
            mst.append((u, v, w))
            total += w
            if len(mst) == n - 1:           # MST complete
                break
    return total, mst

edges = [
    (0, 1, 1),
    (1, 2, 2),
    (0, 2, 3),
    (2, 3, 4),
    (1, 3, 5),
]
total, mst = kruskal(4, edges)
print(total)            # 7  (edges 0-1, 1-2, 2-3)
print(mst)              # [(0,1,1), (1,2,2), (2,3,4)]

# ⚠️ If the graph is disconnected, MST doesn't exist — mst has
#    fewer than n-1 edges. Detect this:
def kruskal_forest(n, edges):
    total, mst = kruskal(n, edges)
    is_spanning = len(mst) == n - 1
    return total, mst, is_spanning

# 🧠 Kruskal vs Prim:
#    - Kruskal: sort + DSU — great for sparse graphs.
#    - Prim: heap + visited — great for dense graphs.
#    Both O(E log V).


# ============================================================
#  9️⃣ GRID PROBLEMS (PERCOLATION / PROVINCES)
# ============================================================
# 🔹 Connect adjacent cells that satisfy a predicate.
# 🔸 DSU flattens the grid.
# 🎯 "Number of islands II" (dynamic add), "make network
#    connected", "regions cut by slashes".

# 🔸 Count islands in a static grid
def count_islands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    water = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "0":
                water += 1
                continue
            # Union with left and up neighbours
            for dr, dc in ((-1, 0), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":
                    uf.union(r * cols + c, nr * cols + nc)
    return uf.components - water

grid = [
    ["1","1","0","0"],
    ["1","1","0","0"],
    ["0","0","1","0"],
    ["0","0","0","1"],
]
print(count_islands(grid))          # 3

# 🔸 Number of islands II (positions added one at a time)
def num_islands_ii(rows: int, cols: int, positions: list[tuple[int, int]]) -> list[int]:
    uf = UnionFind(rows * cols)
    water = rows * cols                 # currently no land
    seen: set[int] = set()
    result: list[int] = []
    for r, c in positions:
        idx = r * cols + c
        if idx in seen:                 # duplicate position
            result.append(uf.components - water)
            continue
        seen.add(idx)
        water -= 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                nidx = nr * cols + nc
                if nidx in seen:
                    uf.union(idx, nidx)
        result.append(uf.components - water)
    return result

print(num_islands_ii(3, 3, [(0,0),(0,1),(1,2),(2,1)]))
# [1, 1, 2, 3]

# 🔸 LeetCode 547 — Number of Provinces
def find_circle_num(is_connected: list[list[int]]) -> int:
    n = len(is_connected)
    uf = UnionFind(n)
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j]:
                uf.union(i, j)
    return uf.components

print(find_circle_num([[1,1,0],[1,1,0],[0,0,1]]))    # 2
print(find_circle_num([[1,0,0],[0,1,0],[0,0,1]]))    # 3

# 🔸 Accounts merge (LeetCode 721) — group emails by account
def accounts_merge(accounts: list[list[str]]) -> list[list[str]]:
    from collections import defaultdict
    email_to_id: dict[str, int] = {}
    email_to_name: dict[str, str] = {}
    for acc in accounts:
        name = acc[0]
        for email in acc[1:]:
            if email not in email_to_id:
                email_to_id[email] = len(email_to_id)
                email_to_name[email] = name

    uf = UnionFind(len(email_to_id))
    for acc in accounts:
        first_email = acc[1]
        for email in acc[2:]:
            uf.union(email_to_id[first_email], email_to_id[email])

    groups: defaultdict[int, list[str]] = defaultdict(list)
    for email, idx in email_to_id.items():
        groups[uf.find(idx)].append(email)

    result: list[list[str]] = []
    for root, emails in groups.items():
        result.append([email_to_name[emails[0]]] + sorted(emails))
    return result

print(accounts_merge([
    ["John","john@m.com","john_newyork@m.com"],
    ["John","john@m.com","john00@m.com"],
    ["Mary","mary@m.com"],
]))
# [['John', 'john00@m.com', 'john@m.com', 'john_newyork@m.com'],
#  ['Mary', 'mary@m.com']]

# 🧠 Grid problems: map (r, c) → r * cols + c → DSU index.
#    Only union with LEFT and UP when possible to halve work.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Recursion depth in find(): chain of 10^5 → RecursionError.
#    Use iterative path compression / path halving.
# ⚠️ Union without rank/size → O(n) find in the worst case.
# ⚠️ Forgetting `parent[x] = x` init → wrong roots.
# ⚠️ Comparing values, not roots: always `find(x) == find(y)`,
#    never `parent[x] == parent[y]`.
# ⚠️ Counting components AFTER unions — use the `components`
#    counter or a set of roots, not the parent array directly.
# ⚠️ Kruskal: must SORT edges first.
# ⚠️ Kruskal on disconnected graph: MST incomplete — detect by
#    `len(mst) == n - 1`.
# ⚠️ Grid DSU: index formula `r * cols + c`. Guard bounds.
# ⚠️ Dynamic add: standard DSU is fixed-size; grow with `add()`
#    or allocate upfront (rows*cols).
# ⚠️ Path compression changes parent[] — don't rely on its
#    original values.
# ⚠️ `find` is not idempotent w.r.t. side effects — it MUTATES
#    the parent array. That's fine but be aware.
# ⚠️ Union by size vs rank — either works; size is easier to
#    reason about.
# ⚠️ DSU works only on UNDIRECTED connectivity. Directed
#    graphs need DFS + SCC (Tarjan / Kosaraju).
# ⚠️ For very large n with sparse unions, a dict-based DSU
#    works on arbitrary keys.

# 🕒 Version notes
# - Union-Find (DSU) is algorithm-agnostic — no version matters
# - PEP 604 unions (list[tuple[...]]): Python 3.10+
#   For 3.9 and below use List[Tuple[...]]
# - Path compression and union by rank are 1970s classics
# - `sys.setrecursionlimit` if you insist on recursive find
# - Python's `int.bit_length` unused here
# - `defaultdict(list)` for grouping roots: always
# - Modern alternative for dynamic connectivity in streams:
#   Euler tour trees / link-cut trees (advanced)

# 🔸 Dict-based DSU for arbitrary keys:
class DictUF:
    def __init__(self) -> None:
        self.parent: dict[str, str] = {}
        self.size: dict[str, int] = {}

    def add(self, x: str) -> None:
        if x not in self.parent:
            self.parent[x] = x
            self.size[x] = 1

    def find(self, x: str) -> str:
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, x: str, y: str) -> bool:
        self.add(x); self.add(y)
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.size[rx] < self.size[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        self.size[rx] += self.size[ry]
        return True

# 🧠 Use this when elements aren't 0..n-1 integers (emails,
#    strings, custom IDs).


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation            │ Naive  │ +PC      │ +PC+rank/size |
# ─────────────────────────────────────────────────────────────
# | find(x)              │ O(n)   │ O(log n) │ O(α(n)) ≈ O(1)|
# | union(x, y)          │ O(n)   │ O(log n) │ O(α(n))       |
# | connected(x, y)      │ O(n)   │ O(log n) │ O(α(n))       |
# | component_size(x)    │ O(n)   │ O(log n) │ O(α(n))       |
# | Space                │ O(n)   │ O(n)     │ O(n)          |
# ─────────────────────────────────────────────────────────────
# | Task                      │ Approach                        |
# ─────────────────────────────────────────────────────────────
# | Connected components      │ Start n, decrement per union    |
# | Cycle in undirected graph │ Union edges, detect same root   |
# | MST (Kruskal)             │ Sort edges + union              |
# | Dynamic connectivity      │ Union + find                    |
# | Grid regions              │ Index cells, union neighbours   |
# | Provinces / friends       │ Union pairs, count roots        |
# | Accounts merge            │ Union by shared email           |
# | Number of islands II      │ Dynamic add + neighbour union   |
# ─────────────────────────────────────────────────────────────
# | Optimisation        │ Effect                              |
# ─────────────────────────────────────────────────────────────
# | Path compression    │ Flattens tree over time             |
# | Path halving        │ Cheaper variant of compression      |
# | Union by size       │ Smaller tree → larger tree          |
# | Union by rank       │ Attach shallower → deeper           |
# | Both                │ O(α(n)) amortised — near O(1)       |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                  |
# ─────────────────────────────────────────────────────────────
# | No rank/size                │ O(n) find worst case          |
# | Recursive find              │ RecursionError on deep chains |
# | Comparing values not roots  │ Wrong "connected" answer      |
# | Forgetting parent init      │ Wrong root                    |
# | Not sorting Kruskal edges   │ Wrong MST                     |
# | Grid index formula          │ Off-by-one, out of bounds     |
# | DSU on directed graph       │ Wrong connectivity            |
# | Mutating parent during find │ Unexpected if you cache — OK  |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Always combine PATH COMPRESSION with UNION BY SIZE (or RANK).
#  - Prefer iterative find to avoid recursion depth issues.
#  - Track `components` counter — free decrement on successful
#    union.
#  - Compare via `find(x) == find(y)`, never parent values.
#  - Kruskal: sort edges by weight; union merges; stop at n-1.
#  - Grid: index = r * cols + c; only check LEFT and UP when
#    scanning to halve work.
#  - Use a dict-based DSU for non-integer keys.
#  - DSU works on UNDIRECTED connectivity; directed needs SCC.
#  - For dynamic graphs (add edges over time), DSU is perfect.
#  - Test with: n=1, isolated elements, self-loops, disconnected
#    graph, and cycle-heavy input.
#  - Combine with other structures: DSU + heap (Kruskal), DSU +
#    map (accounts merge), DSU + grid.
# ============================================================