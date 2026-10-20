// 22_Union_Find_Disjoint_Set.ts

/* ============================================================
 *  📘 UNION-FIND (DISJOINT SET UNION) IN TYPESCRIPT
 *
 *  Union-Find (aka Disjoint Set Union / DSU) maintains a
 *  collection of disjoint sets under two operations: FIND
 *  (which set does an element belong to?) and UNION (merge two
 *  sets). With two simple optimisations — PATH COMPRESSION and
 *  UNION BY RANK/SIZE — both operations become nearly O(1)
 *  amortised.
 *
 *  It's the go-to structure for dynamic connectivity: Kruskal's
 *  MST, cycle detection, connected components, K-clustering,
 *  and grid percolation.
 *
 *  Sections:
 *   1. What Union-Find solves
 *   2. Basic (naive) implementation
 *   3. Path compression
 *   4. Union by rank / size
 *   5. Full optimised implementation
 *   6. Number of connected components
 *   7. Cycle detection in undirected graphs
 *   8. Kruskal's MST
 *   9. Grid problems (percolation / provinces)
 *  10. Dict-based Union-Find for arbitrary keys
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT UNION-FIND SOLVES
 * ============================================================ */
// 🔹 Maintains a partition of N elements into disjoint sets.
// 🔸 Operations:
//     makeSet(x)    → create a set containing only x
//     find(x)       → representative (root) of x's set
//     union(x, y)   → merge the sets containing x and y
//     connected(x,y)→ same set?
// 🎯 Perfect for: "are these two in the same group?" and
//    "merge these two groups" — answered nearly O(1) each.

// ── Complexity ───────────────────────────────────────────────
// | Version                    │ find / union          |
// |----------------------------|-----------------------|
// | Naive (no opts)            │ O(n)                  |
// | + path compression         │ O(log n) amortised    |
// | + union by rank            │ O(α(n)) ≈ O(1)        |
// ─────────────────────────────────────────────────────────────
// α(n) = inverse Ackermann — less than 5 for any practical n.
// 🧠 Once you add BOTH optimisations, operations are effectively
//    constant time.


/* ============================================================
 *  2️⃣ BASIC (NAIVE) IMPLEMENTATION
 * ============================================================ */
// 🔹 parent[i] = i initially → each element is its own set.
// 🔸 find(x) walks parent pointers to the root.
// 🔸 union(x, y) points one root at the other.

class NaiveUF {
  parent: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x: number): number {
    let cur = x;
    while (this.parent[cur] !== cur) {
      cur = this.parent[cur] ?? cur;
    }
    return cur;
  }

  union(x: number, y: number): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx !== ry) this.parent[rx] = ry;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// ⚠️ Worst case: chain-like structure → find() is O(n).
//    A degenerate sequence of unions can build a linked list.
const nuf = new NaiveUF(5);
nuf.union(0, 1);
nuf.union(1, 2);
nuf.union(2, 3);
nuf.union(3, 4);
console.log(nuf.parent);                // [0, 0, 1, 2, 3]  ← chain of length 4
// 🧠 The two optimisations below fix this.


/* ============================================================
 *  3️⃣ PATH COMPRESSION
 * ============================================================ */
// 🔹 During find(x), make every node on the path point
//    directly to the root.
// 🔸 Flattens the tree over time → nearly flat after many ops.

function findPC(parent: number[], x: number): number {
  // Find root
  let root = x;
  while (parent[root] !== root) {
    root = parent[root] ?? root;
  }
  // Compress path
  let cur = x;
  while (parent[cur] !== root) {
    const next = parent[cur] ?? root;
    parent[cur] = root;
    cur = next;
  }
  return root;
}

// ✅ Recursive version (elegant but limited by V8 stack):
function findPCRec(parent: number[], x: number): number {
  const p = parent[x];
  if (p === undefined || p === x) return x;
  const root = findPCRec(parent, p);
  parent[x] = root;
  return root;
}

// 🧠 Path compression alone gives amortised O(log n).
// 🧠 It does NOT need to be perfect — path halving also works:
function findHalving(parent: number[], x: number): number {
  let cur = x;
  while (parent[cur] !== cur) {
    const p = parent[cur] ?? cur;
    const gp = parent[p] ?? p;
    parent[cur] = gp;                   // skip a generation
    cur = gp;
  }
  return cur;
}


/* ============================================================
 *  4️⃣ UNION BY RANK / SIZE
 * ============================================================ */
// 🔹 Attach the SMALLER tree under the LARGER one's root.
// 🔸 Prevents the tree from getting tall.
// 🎯 Two variants:
//     - Union by rank: rank ≈ upper bound on height.
//     - Union by size: size = number of nodes.

function unionByRank(
  parent: number[],
  rank: number[],
  x: number,
  y: number,
): boolean {
  let rx = findPC(parent, x);
  let ry = findPC(parent, y);
  if (rx === ry) return false;          // already same set
  if ((rank[rx] ?? 0) < (rank[ry] ?? 0)) {
    [rx, ry] = [ry, rx];
  }
  parent[ry] = rx;
  if ((rank[rx] ?? 0) === (rank[ry] ?? 0)) {
    rank[rx] = (rank[rx] ?? 0) + 1;
  }
  return true;
}

function unionBySize(
  parent: number[],
  size: number[],
  x: number,
  y: number,
): boolean {
  let rx = findPC(parent, x);
  let ry = findPC(parent, y);
  if (rx === ry) return false;
  if ((size[rx] ?? 0) < (size[ry] ?? 0)) {
    [rx, ry] = [ry, rx];
  }
  parent[ry] = rx;
  size[rx] = (size[rx] ?? 0) + (size[ry] ?? 0);
  return true;
}

// 🧠 Rank/size gives O(log n) find worst-case — but combined
//    with path compression, it's O(α(n)).


/* ============================================================
 *  5️⃣ FULL OPTIMISED IMPLEMENTATION
 * ============================================================ */
// 🔹 Production-ready DSU class with both optimisations.

class UnionFind {
  parent: number[];
  size: number[];
  components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array<number>(n).fill(1);
    this.components = n;
  }

  find(x: number): number {
    // Iterative path compression
    let root = x;
    while (this.parent[root] !== root) {
      root = this.parent[root] ?? root;
    }
    let cur = x;
    while (this.parent[cur] !== root) {
      const next = this.parent[cur] ?? root;
      this.parent[cur] = root;
      cur = next;
    }
    return root;
  }

  union(x: number, y: number): boolean {
    let rx = this.find(x);
    let ry = this.find(y);
    if (rx === ry) return false;
    // Union by size
    if ((this.size[rx] ?? 0) < (this.size[ry] ?? 0)) {
      [rx, ry] = [ry, rx];
    }
    this.parent[ry] = rx;
    this.size[rx] = (this.size[rx] ?? 0) + (this.size[ry] ?? 0);
    this.components -= 1;
    return true;
  }

  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  componentSize(x: number): number {
    const r = this.find(x);
    return this.size[r] ?? 0;
  }

  add(): number {
    /** Dynamic add — returns index of the new element. */
    const i = this.parent.length;
    this.parent.push(i);
    this.size.push(1);
    this.components += 1;
    return i;
  }
}

const uf = new UnionFind(5);
uf.union(0, 1);
uf.union(2, 3);
uf.union(3, 4);
console.log(uf.connected(0, 1));        // true
console.log(uf.connected(0, 2));        // false
uf.union(1, 2);
console.log(uf.connected(0, 4));        // true
console.log(uf.components);             // 1

// 🧠 `components` counter saves a pass — updated during union.


/* ============================================================
 *  6️⃣ NUMBER OF CONNECTED COMPONENTS
 * ============================================================ */
// 🔹 Trivial with DSU: start with n components; decrement per
//    successful union.
// 🎯 LeetCode classic: "number of provinces", "number of islands II".

function countComponents(n: number, edges: ReadonlyArray<[number, number]>): number {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) uf.union(u, v);
  return uf.components;
}

console.log(countComponents(5, [[0,1],[2,3],[3,4]]));         // 2
console.log(countComponents(5, [[0,1],[1,2],[2,3],[3,4]]));   // 1
console.log(countComponents(5, []));                          // 5

// 🔸 Alternative: count distinct roots after all unions.
function countComponentsRoots(
  n: number,
  edges: ReadonlyArray<[number, number]>,
): number {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) uf.union(u, v);
  const roots = new Set<number>();
  for (let i = 0; i < n; i++) roots.add(uf.find(i));
  return roots.size;
}


/* ============================================================
 *  7️⃣ CYCLE DETECTION IN UNDIRECTED GRAPHS
 * ============================================================ */
// 🔹 For each edge (u, v):
//     - If u and v are ALREADY in the same set → cycle.
//     - Else union them.
// 🔸 O(E α(V)) — near linear.

function hasCycleUndirected(
  n: number,
  edges: ReadonlyArray<[number, number]>,
): boolean {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    if (uf.connected(u, v)) return true;
    uf.union(u, v);
  }
  return false;
}

// Tree (no cycle):
console.log(hasCycleUndirected(4, [[0,1],[1,2],[2,3]]));    // false
// Cycle: 0-1-2-0
console.log(hasCycleUndirected(3, [[0,1],[1,2],[2,0]]));    // true

// 🧠 Compare with DFS approach (file 13): DSU is simpler for
//    undirected graphs, but DFS is needed for DIRECTED graphs.
// 🧠 DSU also handles self-loops: (u, u) → connected → cycle.


/* ============================================================
 *  8️⃣ KRUSKAL'S MINIMUM SPANNING TREE
 * ============================================================ */
// 🔹 Sort edges by weight.
// 🔸 Add edge if it doesn't create a cycle (DSU check).
// 🎯 The canonical DSU application.
//    Time: O(E log E) for sort + O(E α(V)) for DSU.

type WeightedEdge = [u: number, v: number, weight: number];

function kruskal(
  n: number,
  edges: readonly WeightedEdge[],
): { total: number; mst: WeightedEdge[]; isSpanning: boolean } {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  const mst: WeightedEdge[] = [];
  let total = 0;
  for (const e of sorted) {
    const [u, v, w] = e;
    if (uf.union(u, v)) {
      mst.push(e);
      total += w;
      if (mst.length === n - 1) break;  // MST complete
    }
  }
  return { total, mst, isSpanning: mst.length === n - 1 };
}

const edges: WeightedEdge[] = [
  [0, 1, 1],
  [1, 2, 2],
  [0, 2, 3],
  [2, 3, 4],
  [1, 3, 5],
];
const result = kruskal(4, edges);
console.log(result.total);              // 7
console.log(result.mst);                // [[0,1,1],[1,2,2],[2,3,4]]
console.log(result.isSpanning);         // true

// 🧠 Kruskal vs Prim:
//    - Kruskal: sort + DSU — great for sparse graphs.
//    - Prim: heap + visited — great for dense graphs.
//    Both O(E log V).


/* ============================================================
 *  9️⃣ GRID PROBLEMS (PERCOLATION / PROVINCES)
 * ============================================================ */
// 🔹 Connect adjacent cells that satisfy a predicate.
// 🔸 DSU flattens the grid.
// 🎯 "Number of islands II" (dynamic add), "make network
//    connected", "regions cut by slashes".

// 🔸 Count islands in a static grid
function countIslands(grid: readonly (readonly string[])[]): number {
  if (grid.length === 0 || !grid[0]?.length) return 0;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const uf = new UnionFind(rows * cols);
  let water = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]?.[c] === "0") {
        water += 1;
        continue;
      }
      // Union with up and left neighbours
      for (const [dr, dc] of [[-1, 0], [0, -1]] as Array<[number, number]>) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (grid[nr]?.[nc] === "1") uf.union(r * cols + c, nr * cols + nc);
        }
      }
    }
  }
  return uf.components - water;
}

const grid = [
  ["1","1","0","0"],
  ["1","1","0","0"],
  ["0","0","1","0"],
  ["0","0","0","1"],
];
console.log(countIslands(grid));        // 3

// 🔸 Number of islands II (positions added one at a time)
function numIslandsII(
  rows: number,
  cols: number,
  positions: ReadonlyArray<[number, number]>,
): number[] {
  const uf = new UnionFind(rows * cols);
  let water = rows * cols;              // initially all water
  const seen = new Set<number>();
  const result: number[] = [];
  for (const [r, c] of positions) {
    const idx = r * cols + c;
    if (seen.has(idx)) {
      result.push(uf.components - water);
      continue;
    }
    seen.add(idx);
    water -= 1;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const nidx = nr * cols + nc;
        if (seen.has(nidx)) uf.union(idx, nidx);
      }
    }
    result.push(uf.components - water);
  }
  return result;
}

console.log(numIslandsII(3, 3, [[0,0],[0,1],[1,2],[2,1]]));
// [1, 1, 2, 3]

// 🔸 LeetCode 547 — Number of Provinces
function findCircleNum(isConnected: readonly (readonly number[])[]): number {
  const n = isConnected.length;
  const uf = new UnionFind(n);
  for (let i = 0; i < n; i++) {
    const row = isConnected[i];
    if (!row) continue;
    for (let j = i + 1; j < n; j++) {
      if (row[j]) uf.union(i, j);
    }
  }
  return uf.components;
}

console.log(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]));      // 2
console.log(findCircleNum([[1,0,0],[0,1,0],[0,0,1]]));      // 3

// 🔸 Accounts merge (LeetCode 721) — group emails by account
function accountsMerge(accounts: readonly (readonly string[])[]): string[][] {
  const emailToId = new Map<string, number>();
  const emailToName = new Map<string, string>();
  for (const acc of accounts) {
    const name = acc[0];
    if (!name) continue;
    for (let i = 1; i < acc.length; i++) {
      const email = acc[i];
      if (!email) continue;
      if (!emailToId.has(email)) {
        emailToId.set(email, emailToId.size);
        emailToName.set(email, name);
      }
    }
  }

  const uf = new UnionFind(emailToId.size);
  for (const acc of accounts) {
    const firstEmail = acc[1];
    if (!firstEmail) continue;
    const firstId = emailToId.get(firstEmail);
    if (firstId === undefined) continue;
    for (let i = 2; i < acc.length; i++) {
      const email = acc[i];
      if (!email) continue;
      const id = emailToId.get(email);
      if (id !== undefined) uf.union(firstId, id);
    }
  }

  const groups = new Map<number, string[]>();
  for (const [email, id] of emailToId) {
    const root = uf.find(id);
    const bucket = groups.get(root);
    if (bucket) bucket.push(email);
    else groups.set(root, [email]);
  }

  const out: string[][] = [];
  for (const emails of groups.values()) {
    emails.sort();
    const name = emailToName.get(emails[0] ?? "") ?? "";
    out.push([name, ...emails]);
  }
  return out;
}

console.log(accountsMerge([
  ["John","john@m.com","john_newyork@m.com"],
  ["John","john@m.com","john00@m.com"],
  ["Mary","mary@m.com"],
]));
// [["John","john00@m.com","john@m.com","john_newyork@m.com"], ["Mary","mary@m.com"]]

// 🧠 Grid problems: map (r, c) → r * cols + c → DSU index.
//    Only union with LEFT and UP when possible to halve work.


/* ============================================================
 *  🔟 DICT-BASED UNION-FIND FOR ARBITRARY KEYS
 * ============================================================ */
// 🔹 Use when elements aren't 0..n-1 integers (emails, strings,
//    custom IDs).
// 🔸 Backed by Map for parent/size.

class DictUnionFind<K> {
  parent: Map<K, K> = new Map();
  size: Map<K, number> = new Map();

  add(x: K): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.size.set(x, 1);
    }
  }

  find(x: K): K {
    this.add(x);
    let root = x;
    while (this.parent.get(root) !== root) {
      const next = this.parent.get(root);
      if (next === undefined) break;
      root = next;
    }
    // Path compression
    let cur = x;
    while (this.parent.get(cur) !== root) {
      const next = this.parent.get(cur);
      if (next === undefined) break;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }

  union(x: K, y: K): boolean {
    let rx = this.find(x);
    let ry = this.find(y);
    if (rx === ry) return false;
    const sx = this.size.get(rx) ?? 0;
    const sy = this.size.get(ry) ?? 0;
    if (sx < sy) [rx, ry] = [ry, rx];
    this.parent.set(ry, rx);
    this.size.set(rx, (this.size.get(rx) ?? 0) + (this.size.get(ry) ?? 0));
    return true;
  }

  connected(x: K, y: K): boolean {
    return this.find(x) === this.find(y);
  }
}

// ✅ Example: group emails
const emailUF = new DictUnionFind<string>();
emailUF.union("a@x.com", "b@x.com");
emailUF.union("b@x.com", "c@x.com");
console.log(emailUF.connected("a@x.com", "c@x.com"));   // true
console.log(emailUF.connected("a@x.com", "z@x.com"));   // false

// ✅ Example: group tuples (serialise to string key)
const cellUF = new DictUnionFind<string>();
const key = (r: number, c: number) => `${r},${c}`;
cellUF.union(key(0, 0), key(0, 1));
cellUF.union(key(0, 1), key(1, 1));
console.log(cellUF.connected(key(0, 0), key(1, 1)));    // true

// 🧠 Use DictUnionFind when elements aren't integers.
//    For 0..n-1, the array-based UnionFind is faster.


/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Recursion depth in find(): chain of 10^5 → RangeError.
//    Use iterative path compression / path halving.
// ⚠️ Union without rank/size → O(n) find in the worst case.
// ⚠️ Forgetting `parent[x] = x` init → wrong roots.
// ⚠️ Comparing values, not roots: always `find(x) === find(y)`,
//    never `parent[x] === parent[y]`.
// ⚠️ Counting components AFTER unions — use the `components`
//    counter or a Set of roots, not the parent array directly.
// ⚠️ Kruskal: must SORT edges first.
// ⚠️ Kruskal on disconnected graph: MST incomplete — detect by
//    `mst.length === n - 1`.
// ⚠️ Grid DSU: index formula `r * cols + c`. Guard bounds.
// ⚠️ Dynamic add: standard DSU is fixed-size; grow with `add()`
//    or allocate upfront (rows*cols).
// ⚠️ Path compression changes parent[] — don't rely on its
//    original values.
// ⚠️ `find` is not idempotent w.r.t. side effects — it MUTATES
//    the parent array. That's fine but be aware.
// ⚠️ Union by size vs rank — either works; size is easier to
//    reason about.
// ⚠️ DSU works only on UNDIRECTED connectivity. Directed
//    graphs need DFS + SCC (Tarjan / Kosaraju).
// ⚠️ For very large n with sparse unions, a dict-based DSU
//    works on arbitrary keys.
// ⚠️ TypeScript: Map<K, K> requires K to be hashable. For
//    tuples / objects, serialise to string OR use the array-
//    based DSU with numeric indices.
// ⚠️ Numbers as Map keys — Map uses SameValueZero: NaN equals
//    NaN. Beware when using NaN as a key (rare but notable).

/* 🕒 Version notes
 * - Union-Find (DSU) is algorithm-agnostic — no version matters
 * - Map / Set: ES2015
 * - Array spread: ES2015
 * - Array.from with mapper: ES2015
 * - Typed arrays (Uint32Array) for DSU over large n: ES2015
 *   (can significantly cut memory)
 * - BigInt for > 2^53 nodes: ES2020 (rarely needed)
 * - noUncheckedIndexedAccess: TS 4.1+
 * - Optional chaining / nullish coalescing: ES2020
 * - Modern alternative for dynamic connectivity in streams:
 *   Euler tour trees / link-cut trees (advanced)
 * - No built-in DSU in JS / TS stdlib
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation            │ Naive  │ +PC      │ +PC+rank/size |
 * ─────────────────────────────────────────────────────────────
 * | find(x)              │ O(n)   │ O(log n) │ O(α(n)) ≈ O(1)|
 * | union(x, y)          │ O(n)   │ O(log n) │ O(α(n))       |
 * | connected(x, y)      │ O(n)   │ O(log n) │ O(α(n))       |
 * | component_size(x)    │ O(n)   │ O(log n) │ O(α(n))       |
 * | Space                │ O(n)   │ O(n)     │ O(n)          |
 * ─────────────────────────────────────────────────────────────
 * | Task                      │ Approach                        |
 * ─────────────────────────────────────────────────────────────
 * | Connected components      │ Start n, decrement per union    |
 * | Cycle in undirected graph │ Union edges, detect same root   |
 * | MST (Kruskal)             │ Sort edges + union              |
 * | Dynamic connectivity      │ Union + find                    |
 * | Grid regions              │ Index cells, union neighbours   |
 * | Provinces / friends       │ Union pairs, count roots        |
 * | Accounts merge            │ Union by shared email           |
 * | Number of islands II      │ Dynamic add + neighbour union   |
 * ─────────────────────────────────────────────────────────────
 * | Optimisation        │ Effect                              |
 * ─────────────────────────────────────────────────────────────
 * | Path compression    │ Flattens tree over time             |
 * | Path halving        │ Cheaper variant of compression      |
 * | Union by size       │ Smaller tree → larger tree          |
 * | Union by rank       │ Attach shallower → deeper           |
 * | Both                │ O(α(n)) amortised — near O(1)       |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                  |
 * ─────────────────────────────────────────────────────────────
 * | No rank/size                │ O(n) find worst case          |
 * | Recursive find              │ RangeError on deep chains     |
 * | Comparing values not roots  │ Wrong "connected" answer      |
 * | Forgetting parent init      │ Wrong root                    |
 * | Not sorting Kruskal edges   │ Wrong MST                     |
 * | Grid index formula          │ Off-by-one, out of bounds     |
 * | DSU on directed graph       │ Wrong connectivity            |
 * | Mutating parent during find │ Unexpected if you cache — OK  |
 * | Array-based DSU on strings  │ Need DictUnionFind instead    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Always combine PATH COMPRESSION with UNION BY SIZE (or RANK).
 *  - Prefer iterative find to avoid recursion depth issues.
 *  - Track `components` counter — free decrement on successful
 *    union.
 *  - Compare via `find(x) === find(y)`, never parent values.
 *  - Kruskal: sort edges by weight; union merges; stop at n-1.
 *  - Grid: index = r * cols + c; only check LEFT and UP when
 *    scanning to halve work.
 *  - Use a dict-based DSU for non-integer keys.
 *  - DSU works on UNDIRECTED connectivity; directed needs SCC.
 *  - For dynamic graphs (add edges over time), DSU is perfect.
 *  - Use typed arrays (Uint32Array) for parent/size when n is
 *    large — significant memory savings.
 *  - Test with: n=1, isolated elements, self-loops, disconnected
 *    graph, and cycle-heavy input.
 *  - Combine with other structures: DSU + heap (Kruskal), DSU +
 *    map (accounts merge), DSU + grid.
 * ============================================================ */