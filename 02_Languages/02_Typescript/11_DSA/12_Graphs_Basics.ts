// 12_Graphs_Basics.ts

/* ============================================================
 *  📘 GRAPHS BASICS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A GRAPH is a set of vertices (nodes) connected by edges. It's
 *  the most general data structure — trees, linked lists, and
 *  DAGs are all special cases. Graphs model networks, maps,
 *  dependencies, and relationships of every kind. Almost every
 *  "real world" DSA problem is graph-shaped in disguise.
 *
 *  This file covers: graph terminology, representations
 *  (adjacency list / matrix / edge list), directed vs undirected,
 *  weighted vs unweighted, degree, connectivity, cycle detection
 *  in undirected graphs, and building graph utilities.
 *
 *  Sections:
 *   1. Graph terminology
 *   2. Representations (list, matrix, edge list)
 *   3. Directed vs undirected
 *   4. Weighted graphs
 *   5. Degree, in-degree, out-degree
 *   6. Building a Graph class
 *   7. Connected components (undirected)
 *   8. Cycle detection (undirected)
 *   9. Bipartite check (2-colouring)
 *  10. Common patterns & problem signals
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ GRAPH TERMINOLOGY
 * ============================================================ */
// 🔹 Vertex / Node  : a point in the graph.
// 🔹 Edge           : a connection between two vertices.
// 🔹 Directed       : edges have direction (u → v).
// 🔹 Undirected     : edges are symmetric (u ↔ v).
// 🔹 Weighted       : edges carry a cost / distance.
// 🔹 Degree         : # of edges touching a vertex.
// 🔹 Path           : sequence of vertices connected by edges.
// 🔹 Cycle          : path that returns to its start.
// 🔹 Connected      : every vertex reachable from every other.
// 🔹 Component      : maximal connected subgraph.
// 🔹 DAG            : Directed Acyclic Graph.
// 🔹 Tree           : connected, acyclic, undirected graph.

// 🧠 If a problem mentions "network", "dependency", "route",
//    "friend-of-friend", "schedule" — it's a graph.


/* ============================================================
 *  2️⃣ REPRESENTATIONS
 * ============================================================ */
// 🔹 ADJACENCY LIST  : Map / array of neighbour lists — preferred.
// 🔹 ADJACENCY MATRIX: 2D grid — fast edge lookup, O(V²) memory.
// 🔹 EDGE LIST        : array of [u, v] pairs — compact.

// ── Adjacency LIST (string keys) ─────────────────────────────
const adjList = new Map<string, string[]>([
  ["A", ["B", "C"]],
  ["B", ["A", "D"]],
  ["C", ["A", "D"]],
  ["D", ["B", "C"]],
]);

console.log(adjList.get("A"));          // ["B", "C"]

// ── Adjacency LIST (numeric vertices 0..n-1) ─────────────────
const adjLL: number[][] = [
  [1, 2],       // 0
  [0, 3],       // 1
  [0, 3],       // 2
  [1, 2],       // 3
];
console.log(adjLL[3]);                  // [1, 2]

// ── Adjacency MATRIX ─────────────────────────────────────────
const n = 4;
const mat: number[][] = Array.from({ length: n }, () =>
  new Array<number>(n).fill(0),
);
const edges: Array<[number, number]> = [[0, 1], [0, 2], [1, 3], [2, 3]];
for (const [u, v] of edges) {
  const rowU = mat[u];
  const rowV = mat[v];
  if (rowU) rowU[v] = 1;
  if (rowV) rowV[u] = 1;
}

for (const row of mat) console.log(row.join(" "));
// 0 1 1 0
// 1 0 0 1
// 1 0 0 1
// 0 1 1 0

console.log(mat[1]?.[3]);               // 1 — O(1) edge check

// ── EDGE LIST ────────────────────────────────────────────────
const edgeList: Array<[string, string]> = [
  ["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"],
];

// ── Comparison table ─────────────────────────────────────────
// | Representation    │ Space  │ Edge lookup │ Iterate neighbours |
// |-------------------|--------|-------------|--------------------|
// | Adjacency list    │ O(V+E) │ O(deg)      │ O(deg)             |
// | Adjacency matrix  │ O(V²)  │ O(1)        │ O(V)               |
// | Edge list         │ O(E)   │ O(E)        │ O(E) per query     |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Default to adjacency list (Map<string, string[]> or
//    number[][]). Use matrix for dense graphs or O(1) edge
//    queries. Use edge list for algorithms that only iterate
//    edges (Kruskal, Bellman-Ford).


/* ============================================================
 *  3️⃣ DIRECTED VS UNDIRECTED
 * ============================================================ */
// 🔹 Undirected: each edge adds BOTH directions.
// 🔹 Directed  : edge u → v does NOT imply v → u.

function addUndirected<T>(
  adj: Map<T, T[]>,
  u: T,
  v: T,
): void {
  let nu = adj.get(u);
  if (!nu) {
    nu = [];
    adj.set(u, nu);
  }
  nu.push(v);

  let nv = adj.get(v);
  if (!nv) {
    nv = [];
    adj.set(v, nv);
  }
  nv.push(u);
}

function addDirected<T>(adj: Map<T, T[]>, u: T, v: T): void {
  let nu = adj.get(u);
  if (!nu) {
    nu = [];
    adj.set(u, nu);
  }
  nu.push(v);
  if (!adj.has(v)) adj.set(v, []);       // ensure v key exists
}

const g = new Map<string, string[]>();
addUndirected(g, "A", "B");
addDirected(g, "B", "C");
console.log([...g.entries()]);
// [ ["A", ["B"]], ["B", ["A", "C"]], ["C", []] ]

// ⚠️ Forgetting to add both directions for undirected graphs is
//    the #1 bug. Double-check your input format.


/* ============================================================
 *  4️⃣ WEIGHTED GRAPHS
 * ============================================================ */
// 🔹 Store [neighbour, weight] tuples.
// 🔸 Same representations, just richer values.

type WeightedAdj<T> = Map<T, Array<[T, number]>>;

const weighted: WeightedAdj<string> = new Map([
  ["A", [["B", 1], ["C", 4]]],
  ["B", [["C", 2], ["D", 5]]],
  ["C", [["D", 1]]],
  ["D", []],
]);

// 🔸 Iterate edges with weights
for (const [u, neighbours] of weighted) {
  for (const [v, w] of neighbours) {
    console.log(`${u} -> ${v} (cost ${w})`);
  }
}

// 🔸 Weighted adjacency matrix
const INF = Infinity;
const wmat: number[][] = Array.from({ length: n }, () =>
  new Array<number>(n).fill(INF),
);
for (let i = 0; i < n; i++) {
  const row = wmat[i];
  if (row) row[i] = 0;
}
for (const [u, v, w] of [[0, 1, 3], [1, 2, 2], [2, 3, 4]] as Array<[number, number, number]>) {
  const rowU = wmat[u];
  const rowV = wmat[v];
  if (rowU) rowU[v] = w;
  if (rowV) rowV[u] = w;
}
console.log(wmat[0]?.[1]);              // 3

// 🧠 Weighted graph problems: Dijkstra, Bellman-Ford,
//    Floyd-Warshall, MST (Kruskal, Prim). See files 22–24.


/* ============================================================
 *  5️⃣ DEGREE, IN-DEGREE, OUT-DEGREE
 * ============================================================ */
// 🔹 Undirected: degree = neighbours.length.
// 🔹 Directed  : out-degree = neighbours.length;
//               in-degree  = count of edges pointing IN.

function degreesUndirected<T>(adj: Map<T, T[]>): Map<T, number> {
  const out = new Map<T, number>();
  for (const [u, nbrs] of adj) out.set(u, nbrs.length);
  return out;
}

console.log([...degreesUndirected(adjList).entries()]);
// [ ["A",2], ["B",2], ["C",2], ["D",2] ]

function inOutDegrees<T>(adj: Map<T, T[]>): {
  out: Map<T, number>;
  in: Map<T, number>;
} {
  const out = new Map<T, number>();
  const inD = new Map<T, number>();
  for (const [u, nbrs] of adj) {
    out.set(u, nbrs.length);
    if (!inD.has(u)) inD.set(u, 0);
  }
  for (const [, nbrs] of adj) {
    for (const v of nbrs) {
      inD.set(v, (inD.get(v) ?? 0) + 1);
    }
  }
  return { out, in: inD };
}

const degTest = new Map<string, string[]>([
  ["A", ["B", "C"]],
  ["B", ["C"]],
  ["C", []],
]);
const { out, in: indeg } = inOutDegrees(degTest);
console.log([...out.entries()]);        // [ ["A",2], ["B",1], ["C",0] ]
console.log([...indeg.entries()]);      // [ ["A",0], ["B",1], ["C",2] ]

// 🧠 Handshake lemma (undirected): Σ degree = 2 × |E|.
//    Sum of out-degrees = sum of in-degrees = |E| (directed).


/* ============================================================
 *  6️⃣ BUILDING A GRAPH CLASS
 * ============================================================ */
// 🔹 A reusable generic wrapper with common helpers.

class Graph<T> {
  adj: Map<T, T[]> = new Map();
  private readonly directed: boolean;

  constructor(directed: boolean = false) {
    this.directed = directed;
  }

  addEdge(u: T, v: T): void {
    let nu = this.adj.get(u);
    if (!nu) {
      nu = [];
      this.adj.set(u, nu);
    }
    nu.push(v);

    if (this.directed) {
      if (!this.adj.has(v)) this.adj.set(v, []);
    } else {
      let nv = this.adj.get(v);
      if (!nv) {
        nv = [];
        this.adj.set(v, nv);
      }
      nv.push(u);
    }
  }

  neighbours(u: T): readonly T[] {
    return this.adj.get(u) ?? [];
  }

  vertices(): T[] {
    return [...this.adj.keys()];
  }

  edges(): Array<[T, T]> {
    const out: Array<[T, T]> = [];
    const seen = new Set<string>();
    for (const [u, nbrs] of this.adj) {
      for (const v of nbrs) {
        // Dedup undirected edges by canonical key
        const key = this.directed
          ? `${String(u)}->${String(v)}`
          : [String(u), String(v)].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push([u, v]);
      }
    }
    return out;
  }

  toString(): string {
    return [...this.adj.entries()]
      .map(([k, v]) => `${String(k)}: [${v.map(String).join(", ")}]`)
      .join("\n");
  }
}

const graph = new Graph<string>(false);
for (const [u, v] of [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]] as Array<[string, string]>) {
  graph.addEdge(u, v);
}
console.log(graph.edges());
// [ ["A","B"], ["A","C"], ["B","D"], ["C","D"] ]


/* ============================================================
 *  7️⃣ CONNECTED COMPONENTS (UNDIRECTED)
 * ============================================================ */
// 🔹 DFS/BFS from each unvisited vertex.
// 🔸 Each fresh start = one new component.
// 🎯 O(V + E).

function connectedComponents<T>(adj: Map<T, T[]>): T[][] {
  const visited = new Set<T>();
  const components: T[][] = [];

  function dfs(u: T, comp: T[]): void {
    visited.add(u);
    comp.push(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) dfs(v, comp);
    }
  }

  for (const u of adj.keys()) {
    if (!visited.has(u)) {
      const comp: T[] = [];
      dfs(u, comp);
      components.push(comp);
    }
  }
  return components;
}

const cc = new Map<string, string[]>([
  ["A", ["B"]],
  ["B", ["A", "C"]],
  ["C", ["B"]],
  ["D", ["E"]],
  ["E", ["D"]],
  ["F", []],
]);
console.log(connectedComponents(cc));
// [ ["A","B","C"], ["D","E"], ["F"] ]

// 🧠 One DFS call visits exactly one connected component.
// ⚠️ Recursion depth can blow up on long chains — use an
//    explicit stack for large graphs (see file 13).


/* ============================================================
 *  8️⃣ CYCLE DETECTION (UNDIRECTED)
 * ============================================================ */
// 🔹 DFS with parent tracking: if we reach a visited neighbour
//    that ISN'T our parent → cycle.
// 🔸 O(V + E).

function hasCycleUndirected<T>(adj: Map<T, T[]>): boolean {
  const visited = new Set<T>();

  function dfs(u: T, parent: T | null): boolean {
    visited.add(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        return true;                    // back edge → cycle
      }
    }
    return false;
  }

  for (const u of adj.keys()) {
    if (!visited.has(u)) {
      if (dfs(u, null)) return true;
    }
  }
  return false;
}

const gCycle = new Map<string, string[]>([
  ["A", ["B"]], ["B", ["A", "C"]], ["C", ["B", "A"]],
]);
console.log(hasCycleUndirected(gCycle));    // true

const gTree = new Map<string, string[]>([
  ["A", ["B", "C"]], ["B", ["A"]], ["C", ["A"]],
]);
console.log(hasCycleUndirected(gTree));     // false

// ⚠️ In multigraphs (parallel edges), this check misreports —
//    track edge IDs instead of parent vertex.
// 🧠 Cycle detection in DIRECTED graphs uses a different
//    approach (white/gray/black colouring) — see file 13.


/* ============================================================
 *  9️⃣ BIPARTITE CHECK (2-COLOURING)
 * ============================================================ */
// 🔹 A graph is bipartite if its vertices can be split into two
//    sets with no edge within a set.
// 🔸 Equivalent: 2-colourable, no odd-length cycle.
// 🎯 BFS/DFS with 2-colouring; O(V + E).

function isBipartite<T>(adj: Map<T, T[]>): boolean {
  const colour = new Map<T, 0 | 1>();
  for (const start of adj.keys()) {
    if (colour.has(start)) continue;
    colour.set(start, 0);
    const q: T[] = [start];
    let head = 0;
    while (head < q.length) {
      const u = q[head++];
      if (u === undefined) break;
      const cu = colour.get(u) ?? 0;
      for (const v of adj.get(u) ?? []) {
        const cv = colour.get(v);
        if (cv === undefined) {
          colour.set(v, (1 - cu) as 0 | 1);
          q.push(v);
        } else if (cv === cu) {
          return false;
        }
      }
    }
  }
  return true;
}

// Even cycle → bipartite
const even = new Map<string, string[]>([
  ["A", ["B"]], ["B", ["A", "C"]], ["C", ["B", "D"]], ["D", ["C", "A"]],
]);
console.log(isBipartite(even));         // true

// Triangle → NOT bipartite
const triangle = new Map<string, string[]>([
  ["A", ["B", "C"]], ["B", ["A", "C"]], ["C", ["A", "B"]],
]);
console.log(isBipartite(triangle));     // false

// 🧠 Bipartite ↔ no odd cycle. Used in matching, scheduling,
//    and 2-colouring problems.


/* ============================================================
 *  🔟 COMMON PATTERNS & PROBLEM SIGNALS
 * ============================================================ */
// 🔹 "Shortest path" (unweighted) → BFS.
// 🔹 "Shortest path" (weighted, non-negative) → Dijkstra.
// 🔹 "Negative weights" → Bellman-Ford.
// 🔹 "All pairs shortest paths" → Floyd-Warshall.
// 🔹 "Ordering with dependencies" → Topological Sort (DAG).
// 🔹 "Cycle in directed graph" → DFS with colours / Kahn's.
// 🔹 "Connected groups" → DFS / Union-Find.
// 🔹 "Minimum cost to connect" → MST (Kruskal / Prim).
// 🔹 "Reachability" → DFS / BFS.
// 🔹 "Bipartite / matching" → 2-colour / Hungarian / Hopcroft-Karp.

// 🔸 Graph model checklist before coding:
//     1. Directed or undirected?
//     2. Weighted or not?
//     3. Dense or sparse? (matrix vs list)
//     4. Vertices labelled how? (number / string / coordinates)
//     5. Self loops or multi-edges?


/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Always handle isolated vertices (present in Map with empty
//    array) — otherwise they're silently dropped.
// ⚠️ Undirected: add BOTH directions. Forgetting breaks everything.
// ⚠️ Directed: ensure every vertex exists as a key, even with no
//    outgoing edges.
// ⚠️ Use `visited` sets — without them, DFS/BFS loops forever on
//    cycles.
// ⚠️ Matrix form: remember O(V²) memory — fine for V ≤ a few
//    thousand.
// ⚠️ Adjacency list neighbours are usually stored as sets if you
//    need dedup or fast membership.
// ⚠️ Weight may be negative — BFS + weighted does NOT work,
//    use Bellman-Ford.
// ⚠️ Multi-edges: adjacency list will contain duplicates; dedup
//    with a Set if needed.
// ⚠️ Self loops: check for u === v in cycle detection.
// ⚠️ Recursion depth in DFS: for V > ~5000, use iterative stack
//    (V8 stack limit).
// ⚠️ Bipartite check: a graph with no edges is trivially bipartite.
// ⚠️ Map iteration order is insertion order — deterministic if
//    you build it deterministically.
// ⚠️ Object keys vs Map keys: for non-string vertices (numbers,
//    tuples), you MUST use Map — object keys coerce to string.
//    Alternatively, serialise to strings.
// ⚠️ TypeScript: `Map<T, T[]>` requires T to be hashable — the
//    Map handles any object type by reference, but if you want
//    VALUE equality for tuple vertices, serialise to a string
//    key (e.g., "x,y").

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - Map insertion order guaranteed: ES2015+
 * - Spread of Map entries: ES2015
 * - Optional chaining (?.) and nullish coalescing (??): ES2020
 * - Object.hasOwn: ES2022
 * - structuredClone for deep-copying graphs: Node 17+
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - No native graph type in JS — implement your own
 * - For huge graphs, consider `graphology` or bindings to C++
 * - V8 stack limit ~10k frames — for deep DFS, iterate
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Representation    │ Best for          │ Space  │ Edge lookup |
 * ─────────────────────────────────────────────────────────────
 * | Adjacency list    │ Sparse graphs     │ O(V+E) │ O(deg)      |
 * | Adjacency matrix  │ Dense / O(1) check│ O(V²)  │ O(1)        |
 * | Edge list         │ Kruskal, BF       │ O(E)   │ O(E)        |
 * ─────────────────────────────────────────────────────────────
 * | Graph variant     │ Add edges how?                          |
 * ─────────────────────────────────────────────────────────────
 * | Undirected        │ add both (u,v) and (v,u)                |
 * | Directed          │ add only (u,v); ensure v key exists     |
 * | Weighted          │ store [v, w] tuples                     |
 * | Multigraph        │ dedup with Set if needed                |
 * ─────────────────────────────────────────────────────────────
 * | Problem signal        │ Algorithm to reach for             |
 * ─────────────────────────────────────────────────────────────
 * | Connected components  │ DFS / BFS / Union-Find             |
 * | Cycle (undirected)    │ DFS with parent tracking           |
 * | Cycle (directed)      │ DFS colours / Kahn's algorithm     |
 * | Bipartite / 2-colour  │ BFS colouring                      |
 * | Shortest path (BFS)   │ BFS with distance array            |
 * | Shortest path (w ≥ 0) │ Dijkstra                           |
 * | Negative weights      │ Bellman-Ford                       |
 * | All pairs shortest    │ Floyd-Warshall                     |
 * | DAG ordering          │ Topological sort                   |
 * | MST                   │ Kruskal / Prim                     |
 * | Matching              │ Hopcroft-Karp / Hungarian          |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Undirected missing reverse │ Edge unreachable from v        |
 * | No visited set             │ Infinite loop on cycles        |
 * | Isolated vertex dropped    │ Missing key in Map             |
 * | Weighted treated as BFS    │ Wrong shortest-path results    |
 * | Recursion depth            │ RangeError on large V          |
 * | Duplicate edges unhandled  │ Extra work / wrong counts      |
 * | Self-loops ignored         │ Wrong cycle detection          |
 * | Matrix for huge V          │ Memory blowup                  |
 * | Object keys for non-string │ Coerced to string — collisions |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Default to adjacency list (Map<T, T[]>).
 *  - Use number[][] when vertices are 0..n-1 for speed.
 *  - Always maintain a `visited` Set in traversals.
 *  - Ensure isolated vertices appear as keys with empty
 *    neighbours.
 *  - Undirected = add both directions; directed = add one.
 *  - For weighted edges, store [neighbour, weight] tuples.
 *  - Prefer iterative DFS/BFS for large graphs (V8 stack).
 *  - Build adjacency with Map (any key type) — for tuple keys,
 *    serialise to string.
 *  - Identify graph problems early: "network", "route",
 *    "depends", "friend", "path", "cluster" — all graph
 *    signals.
 *  - Match algorithm to weights and direction (BFS / Dijkstra /
 *    Bellman-Ford / Floyd-Warshall).
 *  - Use a Graph<T> class for readability — but a plain Map is
 *    fine for one-off solutions.
 *  - Test with edge cases: single vertex, empty graph,
 *    self-loop, multi-edge, disconnected components.
 *  - For "structural equality" vertices, serialise to a string
 *    key OR store vertices in an index map: Map<T, number>.
 * ============================================================ */