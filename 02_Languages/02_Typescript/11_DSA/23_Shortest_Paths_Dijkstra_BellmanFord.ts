// 23_Shortest_Paths_Dijkstra_BellmanFord.ts

/* ============================================================
 *  📘 SHORTEST PATHS: DIJKSTRA, BELLMAN-FORD, FLOYD-WARSHALL
 *
 *  Shortest-path algorithms find the minimum-cost route between
 *  nodes. The right choice depends on edge weights, graph size,
 *  and how many sources/targets you need:
 *    • BFS               → unweighted
 *    • Dijkstra          → non-negative weights, single source
 *    • Bellman-Ford      → may have negative weights, single source
 *    • Floyd-Warshall    → all-pairs shortest paths
 *    • A*                → Dijkstra + heuristic (targeted search)
 *
 *  Sections:
 *   1. Algorithm comparison
 *   2. BFS shortest path (unweighted)
 *   3. Dijkstra (heap-based)
 *   4. Dijkstra with path reconstruction
 *   5. Bellman-Ford (negative weights)
 *   6. Detecting negative cycles
 *   7. Floyd-Warshall (all-pairs)
 *   8. A* preview
 *   9. Grid shortest path
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ ALGORITHM COMPARISON
 * ============================================================ */
// ── Decision table ───────────────────────────────────────────
// | Algorithm      │ Weights       │ Source     │ Time          │
// |----------------|---------------|------------|---------------|
// | BFS            │ unweighted    │ single     │ O(V + E)      │
// | 0-1 BFS        │ 0 or 1        │ single     │ O(V + E)      │
// | Dijkstra       │ ≥ 0           │ single     │ O((V+E) log V)│
// | Bellman-Ford   │ any (neg ok)  │ single     │ O(V · E)      │
// | Floyd-Warshall │ any (no neg   │ all-pairs  │ O(V³)         │
// |                │ cycles)       │            │               │
// | A*             │ ≥ 0 + heuristic│ single   │ depends       │
// ─────────────────────────────────────────────────────────────
//
// 🧠 Rules of thumb:
//    - Unweighted → BFS.
//    - Small + non-negative → Dijkstra.
//    - Negative edges → Bellman-Ford.
//    - Need ALL PAIRS → Floyd-Warshall (small V).
//    - Need single target + heuristic → A*.


/* ============================================================
 *  2️⃣ BFS SHORTEST PATH (UNWEIGHTED)
 * ============================================================ */
// 🔹 BFS explores in order of edge-count.
// 🔸 First time you reach a node = shortest unweighted distance.

function bfsShortest<T>(adj: Map<T, T[]>, src: T): Map<T, number> {
  const dist = new Map<T, number>([[src, 0]]);
  const q: T[] = [src];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    const du = dist.get(u) ?? 0;
    for (const v of adj.get(u) ?? []) {
      if (!dist.has(v)) {
        dist.set(v, du + 1);
        q.push(v);
      }
    }
  }
  return dist;
}

const g = new Map<string, string[]>([
  ["A", ["B", "C"]],
  ["B", ["A", "D"]],
  ["C", ["A", "D"]],
  ["D", ["B", "C", "E"]],
  ["E", ["D"]],
]);
console.log([...bfsShortest(g, "A").entries()]);
// [ ["A",0], ["B",1], ["C",1], ["D",2], ["E",3] ]

// 🧠 BFS ignores weights — every edge is cost 1.
// 🔸 For 0/1-weighted graphs, use 0-1 BFS with a deque.
//    (Simple version using an array + unshift/push; use a real
//    deque class in production.)
function bfs01(adj: Map<string, Array<[string, number]>>, src: string): Map<string, number> {
  const INF = Infinity;
  const dist = new Map<string, number>([[src, 0]]);
  const dq: string[] = [src];             // use unshift for front
  while (dq.length > 0) {
    const u = dq.shift();
    if (u === undefined) break;
    const du = dist.get(u) ?? INF;
    for (const [v, w] of adj.get(u) ?? []) {
      const nd = du + w;
      const old = dist.get(v);
      if (old === undefined || nd < old) {
        dist.set(v, nd);
        if (w === 0) dq.unshift(v);       // 0-weight → front
        else dq.push(v);                  // 1-weight → back
      }
    }
  }
  return dist;
}

const g01 = new Map<string, Array<[string, number]>>([
  ["A", [["B", 0], ["C", 1]]],
  ["B", [["D", 1]]],
  ["C", [["D", 0]]],
  ["D", []],
]);
console.log([...bfs01(g01, "A").entries()]);
// [ ["A",0], ["B",0], ["C",1], ["D",0] ]


/* ============================================================
 *  3️⃣ DIJKSTRA (HEAP-BASED)
 * ============================================================ */
// 🔹 Greedy: always expand the closest unvisited node.
// 🔸 Uses a min-heap → O((V + E) log V).
// 🎯 Requires NON-NEGATIVE weights.
// 🔸 No built-in heap in JS — use MinHeap from file 11, or a
//    simple sorted-insertion array (fine for small graphs).

class SimpleMinHeap<T> {
  private h: T[] = [];
  private readonly cmp: (a: T, b: T) => number;

  constructor(cmp: (a: T, b: T) => number) {
    this.cmp = cmp;
  }

  get size(): number {
    return this.h.length;
  }

  isEmpty(): boolean {
    return this.h.length === 0;
  }

  push(x: T): void {
    // Sorted insertion — O(n) for demo; use a real heap (file 11)
    // for production.
    let lo = 0;
    let hi = this.h.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const v = this.h[mid];
      if (v !== undefined && this.cmp(v, x) < 0) lo = mid + 1;
      else hi = mid;
    }
    this.h.splice(lo, 0, x);
  }

  pop(): T | undefined {
    return this.h.shift();
  }
}

function dijkstra(
  adj: Map<string, Array<[string, number]>>,
  src: string,
): Map<string, number> {
  const INF = Infinity;
  const dist = new Map<string, number>([[src, 0]]);
  const heap = new SimpleMinHeap<[number, string]>((a, b) => a[0] - b[0]);
  heap.push([0, src]);
  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (!top) break;
    const [d, u] = top;
    const cur = dist.get(u) ?? INF;
    if (d > cur) continue;                // stale entry — skip
    for (const [v, w] of adj.get(u) ?? []) {
      const nd = d + w;
      const old = dist.get(v);
      if (old === undefined || nd < old) {
        dist.set(v, nd);
        heap.push([nd, v]);
      }
    }
  }
  return dist;
}

const weighted = new Map<string, Array<[string, number]>>([
  ["A", [["B", 1], ["C", 4]]],
  ["B", [["C", 2], ["D", 5]]],
  ["C", [["D", 1]]],
  ["D", []],
]);
console.log([...dijkstra(weighted, "A").entries()]);
// [ ["A",0], ["B",1], ["C",3], ["D",4] ]

// ⚠️ NEGATIVE edges break Dijkstra — use Bellman-Ford.
// 🧠 The "stale entry" check (`d > dist[u]`) is required because
//    we push multiple entries per node — never remove old ones.
// 🧠 Replace SimpleMinHeap with the real MinHeap from file 11
//    for O((V + E) log V).


/* ============================================================
 *  4️⃣ DIJKSTRA WITH PATH RECONSTRUCTION
 * ============================================================ */
// 🔹 Track parent[] during relaxation.
// 🔸 Reconstruct by walking parents backward.

function dijkstraPath(
  adj: Map<string, Array<[string, number]>>,
  src: string,
  dst: string,
): { distance: number; path: string[] } | null {
  const INF = Infinity;
  const dist = new Map<string, number>([[src, 0]]);
  const parent = new Map<string, string | null>([[src, null]]);
  const heap = new SimpleMinHeap<[number, string]>((a, b) => a[0] - b[0]);
  heap.push([0, src]);

  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (!top) break;
    const [d, u] = top;
    const cur = dist.get(u) ?? INF;
    if (d > cur) continue;
    if (u === dst) break;                 // early exit — found dst
    for (const [v, w] of adj.get(u) ?? []) {
      const nd = d + w;
      const old = dist.get(v);
      if (old === undefined || nd < old) {
        dist.set(v, nd);
        parent.set(v, u);
        heap.push([nd, v]);
      }
    }
  }

  const finalDist = dist.get(dst);
  if (finalDist === undefined) return null;
  const path: string[] = [];
  let cur: string | null = dst;
  while (cur !== null) {
    path.push(cur);
    cur = parent.get(cur) ?? null;
  }
  path.reverse();
  return { distance: finalDist, path };
}

const result = dijkstraPath(weighted, "A", "D");
console.log(result);                    // { distance: 4, path: ["A","B","C","D"] }
console.log(dijkstraPath(weighted, "D", "A"));  // null (unreachable)

// 🧠 Early exit at dst is safe — Dijkstra's first pop of dst IS
//    the shortest path.
// 🧠 parent map + reverse walk = standard path reconstruction.


/* ============================================================
 *  5️⃣ BELLMAN-FORD (NEGATIVE WEIGHTS)
 * ============================================================ */
// 🔹 Relax ALL edges V-1 times.
// 🔸 Works with negative weights.
// 🔸 O(V · E) — slower than Dijkstra but more general.

type Edge = [u: number, v: number, weight: number];

function bellmanFord(n: number, edges: readonly Edge[], src: number): number[] {
  const INF = Infinity;
  const dist = new Array<number>(n).fill(INF);
  dist[src] = 0;
  for (let iter = 0; iter < n - 1; iter++) {
    let updated = false;
    for (const [u, v, w] of edges) {
      const du = dist[u];
      if (du === undefined || du === INF) continue;
      const cand = du + w;
      if (cand < (dist[v] ?? INF)) {
        dist[v] = cand;
        updated = true;
      }
    }
    if (!updated) break;                  // early exit — no change
  }
  return dist;
}

const edges: Edge[] = [
  [0, 1, 4],
  [0, 2, 5],
  [1, 2, -3],
  [2, 3, 2],
  [1, 3, 6],
];
console.log(bellmanFord(4, edges, 0));
// [0, 4, 1, 3]

// 🧠 Why V-1 iterations? The shortest path uses at most V-1 edges.
// 🔸 Early exit when a pass makes no update speeds up real inputs.


/* ============================================================
 *  6️⃣ DETECTING NEGATIVE CYCLES
 * ============================================================ */
// 🔹 One more pass: if any relaxation still improves a distance,
//    a negative cycle exists (distances are unbounded below).
// 🎯 Classic application: currency arbitrage.

function hasNegativeCycle(n: number, edges: readonly Edge[], src: number): boolean {
  const INF = Infinity;
  const dist = new Array<number>(n).fill(INF);
  dist[src] = 0;
  for (let iter = 0; iter < n - 1; iter++) {
    for (const [u, v, w] of edges) {
      const du = dist[u];
      if (du === undefined || du === INF) continue;
      const cand = du + w;
      if (cand < (dist[v] ?? INF)) dist[v] = cand;
    }
  }
  // Extra pass to detect negative cycle
  for (const [u, v, w] of edges) {
    const du = dist[u];
    if (du === undefined || du === INF) continue;
    if (du + w < (dist[v] ?? INF)) return true;
  }
  return false;
}

console.log(hasNegativeCycle(4, edges, 0));         // false

const negCycleEdges: Edge[] = [
  [0, 1, 1],
  [1, 2, -3],
  [2, 0, 1],
];
console.log(hasNegativeCycle(3, negCycleEdges, 0)); // true

// 🔸 Set all dist to 0 to detect negative cycles reachable from
//    ANY node (not just a specific source):
function hasNegativeCycleAnywhere(n: number, edges: readonly Edge[]): boolean {
  const dist = new Array<number>(n).fill(0);          // all start at 0
  for (let iter = 0; iter < n - 1; iter++) {
    for (const [u, v, w] of edges) {
      const du = dist[u];
      if (du === undefined) continue;
      if (du + w < (dist[v] ?? Infinity)) dist[v] = du + w;
    }
  }
  for (const [u, v, w] of edges) {
    const du = dist[u];
    if (du === undefined) continue;
    if (du + w < (dist[v] ?? Infinity)) return true;
  }
  return false;
}

// 🧠 "Arbitrage detection": build graph from currency pairs,
//    edges = log rate. Negative cycle → arbitrage exists.


/* ============================================================
 *  7️⃣ FLOYD-WARSHALL (ALL-PAIRS)
 * ============================================================ */
// 🔹 DP over intermediate vertices.
// 🔸 dist[i][j] = min over k of dist[i][k] + dist[k][j].
// 🎯 O(V³) time, O(V²) space — use for small V (≤ ~500).
// 🔸 Handles negative weights (but not negative cycles).

function floydWarshall(n: number, edges: readonly Edge[]): number[][] {
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(INF),
  );
  for (let i = 0; i < n; i++) dist[i]![i] = 0;
  for (const [u, v, w] of edges) {
    const rowU = dist[u];
    const rowV = dist[v];
    if (!rowU || !rowV) continue;
    rowU[v] = Math.min(rowU[v] ?? INF, w);      // handle multi-edges
    rowV[u] = Math.min(rowV[u] ?? INF, w);      // remove for directed
  }
  for (let k = 0; k < n; k++) {
    const rowK = dist[k];
    if (!rowK) continue;
    for (let i = 0; i < n; i++) {
      const rowI = dist[i];
      if (!rowI) continue;
      const viaIK = rowI[k] ?? INF;
      if (viaIK === INF) continue;
      for (let j = 0; j < n; j++) {
        const via = viaIK + (rowK[j] ?? INF);
        if (via < (rowI[j] ?? INF)) rowI[j] = via;
      }
    }
  }
  return dist;
}

const fwEdges: Edge[] = [
  [0, 1, 3],
  [0, 2, 10],
  [1, 2, 4],
  [2, 3, 1],
];
const dist = floydWarshall(4, fwEdges);
for (const row of dist) console.log(row.map((x) => (x === Infinity ? "∞" : x)));
// [0, 3, 7, 8]
// [3, 0, 4, 5]
// [7, 4, 0, 1]
// [8, 5, 1, 0]

// 🔸 Detect negative cycle with Floyd-Warshall:
function fwHasNegativeCycle(dist: readonly (readonly number[])[]): boolean {
  for (let i = 0; i < dist.length; i++) {
    if ((dist[i]?.[i] ?? 0) < 0) return true;
  }
  return false;
}

// 🧠 Floyd-Warshall is dead simple and hard to get wrong.
//    Use it when V ≤ 500 and you need all-pairs distances.


/* ============================================================
 *  8️⃣ A* PREVIEW
 * ============================================================ */
// 🔹 Dijkstra + heuristic: prioritise nodes likely near target.
// 🔸 Priority = g(n) + h(n) — cost-so-far + heuristic.
// 🎯 Heuristic must be ADMISSIBLE (never overestimates).
// 🔸 Common heuristic: Manhattan / Euclidean distance on grids.

function astar(
  adj: Map<string, Array<[string, number]>>,
  src: string,
  dst: string,
  heuristic: Map<string, number>,
): { distance: number; path: string[] } | null {
  const INF = Infinity;
  const g = new Map<string, number>([[src, 0]]);
  const parent = new Map<string, string | null>([[src, null]]);
  const heap = new SimpleMinHeap<[number, string]>((a, b) => a[0] - b[0]);
  heap.push([heuristic.get(src) ?? 0, src]);
  const closed = new Set<string>();

  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (!top) break;
    const [, u] = top;
    if (closed.has(u)) continue;
    closed.add(u);
    if (u === dst) {
      const path: string[] = [];
      let cur: string | null = dst;
      while (cur !== null) {
        path.push(cur);
        cur = parent.get(cur) ?? null;
      }
      return { distance: g.get(dst) ?? 0, path: path.reverse() };
    }
    const gu = g.get(u) ?? INF;
    for (const [v, w] of adj.get(u) ?? []) {
      const ng = gu + w;
      if (ng < (g.get(v) ?? INF)) {
        g.set(v, ng);
        parent.set(v, u);
        heap.push([ng + (heuristic.get(v) ?? 0), v]);
      }
    }
  }
  return null;
}

// 🧠 A* is widely used in games, maps, path planning.
//    On a uniform grid with Manhattan heuristic, it's often much
//    faster than Dijkstra.


/* ============================================================
 *  9️⃣ GRID SHORTEST PATH
 * ============================================================ */
// 🔹 Grid = implicit graph; each cell has neighbours.
// 🔸 Use Dijkstra when edge weights vary; BFS when uniform.

function dijkstraGrid(
  grid: readonly (readonly number[])[],
  src: readonly [number, number],
  dst: readonly [number, number],
): number {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(cols).fill(INF),
  );
  const sr = src[0];
  const sc = src[1];
  const dr = dst[0];
  const dc = dst[1];
  const startDist = grid[sr]?.[sc] ?? 0;
  if (dist[sr]) dist[sr]![sc] = startDist;

  const heap = new SimpleMinHeap<[number, number, number]>((a, b) => a[0] - b[0]);
  heap.push([startDist, sr, sc]);

  while (!heap.isEmpty()) {
    const top = heap.pop();
    if (!top) break;
    const [d, r, c] = top;
    if (r === dr && c === dc) return d;
    if (d > (dist[r]?.[c] ?? INF)) continue;
    for (const [nrd, ncd] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
      const nr = r + nrd;
      const nc = c + ncd;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const cellCost = grid[nr]?.[nc] ?? 0;
      const nd = d + cellCost;
      const row = dist[nr];
      if (!row) continue;
      if (nd < (row[nc] ?? INF)) {
        row[nc] = nd;
        heap.push([nd, nr, nc]);
      }
    }
  }
  return -1;
}

const costGrid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];
console.log(dijkstraGrid(costGrid, [0, 0], [2, 2]));   // 7

// 🔸 Uniform grid + obstacles → BFS with deque (file 13).

// 🧠 Recognise problems:
//    "minimum cost path in grid" → Dijkstra
//    "minimum STEPS in grid"     → BFS
//    "fewest moves for a knight" → BFS
//    "cheapest flight with k stops" → Bellman-Ford variant / DP


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Dijkstra is WRONG with negative weights — use Bellman-Ford.
// ⚠️ Dijkstra stale-entry check: `if (d > dist[u]) continue`.
//    Without it: extra work (but still correct).
// ⚠️ Dijkstra with `visited` set: skip if node already popped.
// ⚠️ Bellman-Ford: relax ALL edges each iteration; stop early
//    when no update.
// ⚠️ Bellman-Ford detects negative cycles with one extra pass.
// ⚠️ Floyd-Warshall: `k` is the OUTER loop. Don't reorder.
// ⚠️ Floyd-Warshall: handle multi-edges with Math.min().
// ⚠️ Floyd-Warshall: `dist[i][i] = 0` before k-loop; negative
//    self-loop → negative cycle.
// ⚠️ Disconnected graph: distances remain Infinity.
// ⚠️ A* heuristic MUST be admissible (never overestimate) or
//    the result can be wrong.
// ⚠️ Priority queue entries: use [distance, counter, node] when
//    node labels are uncomparable — JS arrays are comparable
//    lexicographically but tie-breaking on second element is
//    useful.
// ⚠️ JS Map/object keys: use a string or number key; Map is best
//    for arbitrary key types.
// ⚠️ TypeScript strict null checks: dist.get(v) is T | undefined.
//    Narrow with `?? Infinity`.
// ⚠️ Infinity arithmetic: Infinity + w = Infinity.
//    Infinity - Infinity = NaN (avoid sentinel subtraction).
// ⚠️ For very dense graphs, use the O(V²) Dijkstra with an
//    array-scan instead of a heap.
// ⚠️ K shortest paths is a different problem — use Yen's or
//    Eppstein's algorithm.
// ⚠️ Bellman-Ford with unreachable source: distances stay
//    Infinity (correct).
// ⚠️ Beware of float precision for weighted graphs with non-
//    integer weights — prefer integer weights when possible.

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - Spread of Map entries: ES2015
 * - Array.from with mapper: ES2015
 * - BigInt for very large weights: ES2020
 * - Optional chaining (?.) / nullish coalescing (??): ES2020
 * - noUncheckedIndexedAccess: TS 4.1+
 * - No built-in priority queue in JS / TS — implement or use
 *   file 11's MinHeap
 * - For very large graphs, WASM or C++ bindings recommended
 * - `structuredClone`: Node 17+ (not needed for shortest paths)
 * - Number.MAX_SAFE_INTEGER = 2^53 - 1 — sums beyond this lose
 *   precision. Use BigInt for combinatorial weights.
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Algorithm      │ Weight       │ Weights         │ Time          |
 * |----------------|--------------|-----------------|---------------|
 * | BFS            │ unweighted   │ single source   │ O(V + E)      |
 * | 0-1 BFS        │ 0 or 1       │ single source   │ O(V + E)      |
 * | Dijkstra       │ ≥ 0          │ single source   │ O((V+E)log V) │
 * | Bellman-Ford   │ any          │ single source   │ O(V · E)      |
 * | Floyd-Warshall │ any (no neg  │ all pairs       │ O(V³)         |
 * |                │ cycle)       │                 │               |
 * | A*             │ ≥ 0 + h      │ single target   │ heuristic     |
 * ─────────────────────────────────────────────────────────────
 * | Need                             │ Use                        |
 * ─────────────────────────────────────────────────────────────
 * | Shortest path in unweighted      │ BFS                        |
 * | Shortest path with 0/1 weights   │ 0-1 BFS                    |
 * | Shortest path with weights ≥ 0   │ Dijkstra                   |
 * | Shortest path with negative      │ Bellman-Ford               |
 * | Detect negative cycle            │ Bellman-Ford extra pass    |
 * | All-pairs shortest paths         │ Floyd-Warshall (small V)   |
 * | Grid min cost                    │ Dijkstra on grid           |
 * | Grid min steps                   │ BFS on grid                |
 * | Single target + heuristic        │ A*                         |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                  |
 * ─────────────────────────────────────────────────────────────
 * | Dijkstra with negative edges│ Wrong results                 |
 * | Stale entry no skip         │ Extra work                    |
 * | Floyd-Warshall reordered k  │ Wrong answer                  |
 * | A* non-admissible heuristic │ Wrong answer                  |
 * | Bellman-Ford no early exit  │ Slower on easy inputs         |
 * | Multi-edges ignored         │ Wrong minimum                 |
 * | Disconnected graph          │ Infinity in output            |
 * | Infinity - Infinity         │ NaN — sentinel subtraction    |
 * | No priority queue stdlib    │ Must implement or use file 11 |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - BFS for unweighted; Dijkstra for non-negative; Bellman-Ford
 *    for anything goes.
 *  - Always skip stale heap entries (`d > dist[u]`).
 *  - Track parent map for path reconstruction.
 *  - Floyd-Warshall: outer loop k, inner i, j — order matters.
 *  - Negative weights → Bellman-Ford; extra pass for detection.
 *  - Priority queue tuples: add a counter to break ties.
 *  - Dense graphs → O(V²) Dijkstra with linear scan.
 *  - Grid problems: choose BFS (uniform) vs Dijkstra (costs).
 *  - A* heuristic must be admissible — Manhattan on 4-dir grid,
 *    Euclidean on 8-dir.
 *  - Recognise which algorithm fits BEFORE coding.
 *  - Reuse MinHeap from file 11 for the priority queue.
 *  - Use BigInt for weights that exceed 2^53 - 1.
 *  - Test with: single node, disconnected graph, multi-edges,
 *    negative cycle (detection), and ties in priority.
 *  - Handle Infinity carefully — never subtract from it.
 * ============================================================ */