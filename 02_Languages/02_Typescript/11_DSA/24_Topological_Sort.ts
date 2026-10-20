// 24_Topological_Sort.ts

/* ============================================================
 *  📘 TOPOLOGICAL SORT IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A TOPOLOGICAL SORT orders the vertices of a DIRECTED ACYCLIC
 *  GRAPH (DAG) so that for every edge u → v, u appears before v.
 *  It's the mathematical model of "do X before Y": build
 *  systems, course prerequisites, spreadsheet formulas, package
 *  managers, and task schedulers all rely on it.
 *
 *  Sections:
 *   1. What topological sort is
 *   2. When it applies (DAG requirement)
 *   3. Kahn's algorithm (BFS-based)
 *   4. DFS postorder approach
 *   5. Detecting cycles (no valid topo order)
 *   6. Lexicographically smallest order
 *   7. All topological orders (backtracking)
 *   8. Longest path in a DAG
 *   9. Course schedule & alien dictionary
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT TOPOLOGICAL SORT IS
 * ============================================================ */
// 🔹 Linear ordering of vertices where every edge points forward.
// 🔸 Applies ONLY to DAGs — cycles make it impossible.
// 🎯 Signal phrases: "prerequisites", "dependencies", "build
//    order", "task scheduling", "before/after".

// ── Complexity ───────────────────────────────────────────────
// | Algorithm         │ Time      │ Space │ Notes             |
// |-------------------|-----------|-------|-------------------|
// | Kahn's (BFS)      │ O(V + E)  │ O(V)  │ natural cycle     |
// |                   │           │       │ detection         |
// | DFS postorder     │ O(V + E)  │ O(V)  │ recursion risk    |
// | Lexicographic     │ O(V log V │ O(V)  │ heap instead of   |
// |                   │ + E)      │       │ queue             |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Kahn's is usually the safer default — iterative, and it
//    detects cycles for free (leftover nodes).


/* ============================================================
 *  2️⃣ WHEN IT APPLIES (DAG REQUIREMENT)
 * ============================================================ */
// 🔹 A DAG has at least one vertex with no incoming edges
//    (in-degree 0) — that's the natural starting point.
// 🔸 Every DAG has at least one topological order (usually many).
// 🔸 A cycle → no valid order → some nodes never get in-degree 0.

// 🧠 Rule: if the graph might have cycles, use Kahn's or the
//    colour-DFS from file 13 to detect them BEFORE claiming a
//    topo order exists.

// Simple sorted-insertion min-heap for lexicographic order
class MinHeapStr {
  private h: string[] = [];
  get size(): number { return this.h.length; }
  push(x: string): void {
    let lo = 0;
    let hi = this.h.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const v = this.h[mid];
      if (v !== undefined && v < x) lo = mid + 1;
      else hi = mid;
    }
    this.h.splice(lo, 0, x);
  }
  pop(): string | undefined {
    return this.h.shift();
  }
}


/* ============================================================
 *  3️⃣ KAHN'S ALGORITHM (BFS-BASED)
 * ============================================================ */
// 🔹 Compute in-degree for every node.
// 🔸 Queue all in-degree-0 nodes.
// 🔸 Pop, append to order, decrement neighbours' in-degrees;
//    enqueue any that hit 0.
// 🎯 Detects cycles: if order length < V, there's a cycle.

function topologicalSortKahn<T>(
  adj: Map<T, T[]>,
): T[] | null {
  // Ensure every vertex exists as a key
  const vertices = new Set<T>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const v of neighbours) vertices.add(v);
  }

  const indegree = new Map<T, number>();
  for (const v of vertices) indegree.set(v, 0);
  for (const neighbours of adj.values()) {
    for (const v of neighbours) {
      indegree.set(v, (indegree.get(v) ?? 0) + 1);
    }
  }

  const q: T[] = [];
  for (const [v, d] of indegree) {
    if (d === 0) q.push(v);
  }
  const order: T[] = [];
  let head = 0;

  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      const next = (indegree.get(v) ?? 0) - 1;
      indegree.set(v, next);
      if (next === 0) q.push(v);
    }
  }

  return order.length === vertices.size ? order : null;
}

const graph = new Map<string, string[]>([
  ["A", ["C", "D"]],
  ["B", ["D"]],
  ["C", ["E"]],
  ["D", ["E"]],
  ["E", []],
]);
console.log(topologicalSortKahn(graph));
// e.g. ["A", "B", "C", "D", "E"] — one valid order

// 🔸 Cycle example — returns null
const cycle = new Map<string, string[]>([
  ["A", ["B"]],
  ["B", ["C"]],
  ["C", ["A"]],
]);
console.log(topologicalSortKahn(cycle));    // null

// 🧠 Order of equal in-degree-0 nodes is arbitrary (depends on
//    insertion). Use a heap for a deterministic (lexicographic)
//    order — see section 6.


/* ============================================================
 *  4️⃣ DFS POSTORDER APPROACH
 * ============================================================ */
// 🔹 DFS each node; append to output AFTER visiting children.
// 🔸 Reverse the postorder to get topological order.

function topologicalSortDfs<T>(adj: Map<T, T[]>): T[] | null {
  const vertices = new Set<T>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const v of neighbours) vertices.add(v);
  }

  const visited = new Set<T>();
  const onStack = new Set<T>();           // for cycle detection
  const post: T[] = [];
  let hasCycle = false;

  function dfs(u: T): void {
    if (hasCycle) return;
    visited.add(u);
    onStack.add(u);
    for (const v of adj.get(u) ?? []) {
      if (onStack.has(v)) {
        hasCycle = true;                  // back edge
        return;
      }
      if (!visited.has(v)) dfs(v);
    }
    onStack.delete(u);
    post.push(u);
  }

  for (const v of vertices) {
    if (!visited.has(v)) {
      dfs(v);
      if (hasCycle) return null;
    }
  }
  post.reverse();
  return post;
}

console.log(topologicalSortDfs(graph));
// e.g. ["B","A","D","C","E"] — one valid order
console.log(topologicalSortDfs(cycle));      // null

// ⚠️ Recursive DFS: risk of RangeError on deep DAGs (chain of
//    length > ~5000 in V8). Convert to iterative if needed.
// 🧠 Postorder + reverse is the classic "DFS topo sort".
//    onStack = "currently in the current DFS path" = gray nodes.


/* ============================================================
 *  5️⃣ DETECTING CYCLES (NO VALID TOPO ORDER)
 * ============================================================ */
// 🔹 Kahn's leaves leftover nodes if a cycle exists.
// 🔸 DFS uses three colours (white / gray / black) — see 13.

function hasCycleAndToposort<T>(
  adj: Map<T, T[]>,
): { hasCycle: boolean; order: T[] | null } {
  const order = topologicalSortKahn(adj);
  if (order === null) return { hasCycle: true, order: null };
  return { hasCycle: false, order };
}

console.log(hasCycleAndToposort(graph));    // { hasCycle: false, order: [...] }
console.log(hasCycleAndToposort(cycle));    // { hasCycle: true, order: null }

// 🔸 Which nodes are in a cycle? After Kahn's, the leftovers
//    (still positive in-degree) are exactly the cyclic part.

function nodesInCycle<T>(adj: Map<T, T[]>): T[] {
  const vertices = new Set<T>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const v of neighbours) vertices.add(v);
  }
  const indegree = new Map<T, number>();
  for (const v of vertices) indegree.set(v, 0);
  for (const neighbours of adj.values()) {
    for (const v of neighbours) {
      indegree.set(v, (indegree.get(v) ?? 0) + 1);
    }
  }
  const q: T[] = [];
  for (const [v, d] of indegree) if (d === 0) q.push(v);
  const visited = new Set<T>();
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    visited.add(u);
    for (const v of adj.get(u) ?? []) {
      const next = (indegree.get(v) ?? 0) - 1;
      indegree.set(v, next);
      if (next === 0) q.push(v);
    }
  }
  const out: T[] = [];
  for (const v of vertices) if (!visited.has(v)) out.push(v);
  return out;
}

console.log(nodesInCycle(cycle));           // ["A", "B", "C"]

// 🧠 Kahn's naturally distinguishes DAG nodes from cyclic nodes.


/* ============================================================
 *  6️⃣ LEXICOGRAPHICALLY SMALLEST ORDER
 * ============================================================ */
// 🔹 Replace the queue with a MIN-HEAP.
// 🔸 Always pick the smallest node among in-degree-0 candidates.

function topologicalSortLex(adj: Map<string, string[]>): string[] | null {
  const vertices = new Set<string>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const v of neighbours) vertices.add(v);
  }
  const indegree = new Map<string, number>();
  for (const v of vertices) indegree.set(v, 0);
  for (const neighbours of adj.values()) {
    for (const v of neighbours) {
      indegree.set(v, (indegree.get(v) ?? 0) + 1);
    }
  }

  const heap = new MinHeapStr();
  for (const [v, d] of indegree) if (d === 0) heap.push(v);

  const order: string[] = [];
  while (heap.size > 0) {
    const u = heap.pop();
    if (u === undefined) break;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      const next = (indegree.get(v) ?? 0) - 1;
      indegree.set(v, next);
      if (next === 0) heap.push(v);
    }
  }
  return order.length === vertices.size ? order : null;
}

console.log(topologicalSortLex(graph));
// ["A", "B", "C", "D", "E"]  (deterministic)

// 🧠 Use this when the problem asks for the smallest order, or
//    when you want deterministic output for tests.


/* ============================================================
 *  7️⃣ ALL TOPOLOGICAL ORDERS (BACKTRACKING)
 * ============================================================ */
// 🔹 Enumerate ALL valid orderings via backtracking.
// 🔸 Only feasible for small graphs (n ≤ ~10).

function allTopologicalSorts<T>(adj: Map<T, T[]>): T[][] {
  const vertices = new Set<T>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const v of neighbours) vertices.add(v);
  }
  const initialIndegree = new Map<T, number>();
  for (const v of vertices) initialIndegree.set(v, 0);
  for (const neighbours of adj.values()) {
    for (const v of neighbours) {
      initialIndegree.set(v, (initialIndegree.get(v) ?? 0) + 1);
    }
  }

  const result: T[][] = [];
  const used = new Set<T>();

  function backtrack(order: T[], indeg: Map<T, number>): void {
    if (order.length === vertices.size) {
      result.push([...order]);
      return;
    }
    for (const v of vertices) {
      if (used.has(v)) continue;
      if ((indeg.get(v) ?? 0) !== 0) continue;
      used.add(v);
      order.push(v);
      // Decrement neighbours
      for (const w of adj.get(v) ?? []) {
        indeg.set(w, (indeg.get(w) ?? 0) - 1);
      }
      backtrack(order, indeg);
      // Undo
      for (const w of adj.get(v) ?? []) {
        indeg.set(w, (indeg.get(w) ?? 0) + 1);
      }
      order.pop();
      used.delete(v);
    }
  }

  backtrack([], new Map(initialIndegree));
  return result;
}

const small = new Map<string, string[]>([
  ["A", ["C"]],
  ["B", ["C"]],
  ["C", []],
]);
for (const t of allTopologicalSorts(small)) console.log(t);
// ["A", "B", "C"]
// ["B", "A", "C"]

// 🧠 Exponential — use only for tiny graphs.
// ⚠️ `used` as Set for O(1) membership vs array includes O(n).


/* ============================================================
 *  8️⃣ LONGEST PATH IN A DAG
 * ============================================================ */
// 🔹 Topological order lets you DP the longest path in O(V + E).
// 🔸 For general graphs, longest path is NP-hard; DAG is the
//    tractable special case.

type WeightedAdj<T> = Map<T, Array<[T, number]>>;

function longestPathDag<T>(
  adj: WeightedAdj<T>,
  src: T,
): Map<T, number> {
  const vertices = new Set<T>(adj.keys());
  for (const neighbours of adj.values()) {
    for (const [v] of neighbours) vertices.add(v);
  }
  const indegree = new Map<T, number>();
  for (const v of vertices) indegree.set(v, 0);
  for (const neighbours of adj.values()) {
    for (const [v] of neighbours) {
      indegree.set(v, (indegree.get(v) ?? 0) + 1);
    }
  }

  const q: T[] = [];
  for (const [v, d] of indegree) if (d === 0) q.push(v);
  const order: T[] = [];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    order.push(u);
    for (const [v] of adj.get(u) ?? []) {
      const next = (indegree.get(v) ?? 0) - 1;
      indegree.set(v, next);
      if (next === 0) q.push(v);
    }
  }

  // DP: dist[v] = max distance from src to v
  const NEG_INF = -Infinity;
  const dist = new Map<T, number>();
  for (const v of vertices) dist.set(v, NEG_INF);
  dist.set(src, 0);

  for (const u of order) {
    const du = dist.get(u) ?? NEG_INF;
    if (du === NEG_INF) continue;
    for (const [v, w] of adj.get(u) ?? []) {
      if (du + w > (dist.get(v) ?? NEG_INF)) {
        dist.set(v, du + w);
      }
    }
  }
  return dist;
}

const wadj: WeightedAdj<string> = new Map([
  ["A", [["B", 3], ["C", 6]]],
  ["B", [["C", 4], ["D", 4]]],
  ["C", [["D", 8]]],
  ["D", []],
]);
console.log([...longestPathDag(wadj, "A").entries()]);
// [ ["A",0], ["B",3], ["C",7], ["D",15] ]

// 🧠 Pattern: topological order + DP. Works for ANY DAG.
// 🔸 Shortest path in a DAG is the same code with `Math.min` —
//    works even with NEGATIVE weights (unlike Dijkstra).


/* ============================================================
 *  9️⃣ COURSE SCHEDULE & ALIEN DICTIONARY
 * ============================================================ */
// 🔹 Course Schedule I: can you finish all courses? (No cycle)
// 🔹 Course Schedule II: return order. (Topo sort)

function canFinish(numCourses: number, prerequisites: ReadonlyArray<[number, number]>): boolean {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < numCourses; i++) adj.set(i, []);
  for (const [course, pre] of prerequisites) {
    const bucket = adj.get(pre);
    if (bucket) bucket.push(course);
  }
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [, nbrs] of adj) {
    for (const v of nbrs) indegree[v] = (indegree[v] ?? 0) + 1;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) q.push(i);
  let seen = 0;
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    seen += 1;
    for (const v of adj.get(u) ?? []) {
      indegree[v] = (indegree[v] ?? 0) - 1;
      if (indegree[v] === 0) q.push(v);
    }
  }
  return seen === numCourses;
}

console.log(canFinish(2, [[1, 0]]));                // true
console.log(canFinish(2, [[1, 0], [0, 1]]));        // false

function findOrder(numCourses: number, prerequisites: ReadonlyArray<[number, number]>): number[] {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < numCourses; i++) adj.set(i, []);
  for (const [course, pre] of prerequisites) {
    const bucket = adj.get(pre);
    if (bucket) bucket.push(course);
  }
  const indegree = new Array<number>(numCourses).fill(0);
  for (const [, nbrs] of adj) {
    for (const v of nbrs) indegree[v] = (indegree[v] ?? 0) + 1;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) q.push(i);
  const order: number[] = [];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      indegree[v] = (indegree[v] ?? 0) - 1;
      if (indegree[v] === 0) q.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}

console.log(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));
// [0, 1, 2, 3] or [0, 2, 1, 3]
console.log(findOrder(2, [[1, 0], [0, 1]]));        // []

// 🔸 Alien Dictionary: derive character order from sorted words.
function alienOrder(words: readonly string[]): string {
  const adj = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();

  for (const w of words) {
    for (const ch of w) {
      if (!adj.has(ch)) adj.set(ch, new Set());
      if (!indegree.has(ch)) indegree.set(ch, 0);
    }
  }

  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (!a || !b) continue;
    // Edge case: b is a prefix of a → invalid order
    if (a.length > b.length && a.startsWith(b)) return "";
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      const x = a[j];
      const y = b[j];
      if (x === undefined || y === undefined) break;
      if (x !== y) {
        const bucket = adj.get(x);
        if (bucket && !bucket.has(y)) {
          bucket.add(y);
          indegree.set(y, (indegree.get(y) ?? 0) + 1);
        }
        break;
      }
    }
  }

  // Kahn's with a min-heap for lexicographic determinism
  const heap = new MinHeapStr();
  for (const [ch, d] of indegree) if (d === 0) heap.push(ch);
  const order: string[] = [];
  while (heap.size > 0) {
    const u = heap.pop();
    if (u === undefined) break;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      const next = (indegree.get(v) ?? 0) - 1;
      indegree.set(v, next);
      if (next === 0) heap.push(v);
    }
  }
  return order.length === adj.size ? order.join("") : "";
}

console.log(alienOrder(["wrt", "wrf", "er", "ett", "rftt"]));
// "wertf"

// 🧠 Alien Dictionary combines topo sort with lexicographic
//    tie-breaking (heap) — hence the two techniques.
// ⚠️ The prefix edge case ("abc", "ab") is subtle and often
//    forgotten — it's an invalid input → return "".
// 🧠 Course Schedule uses Kahn's: `seen === n` means no cycle.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Topological sort only works on DAGs — cycle → no valid order.
// ⚠️ Kahn's: after the queue empties, if order.length < V → cycle.
// ⚠️ DFS topo: forgetting `onStack.delete(u)` breaks cycle
//    detection.
// ⚠️ DFS topo: recursion depth limit — convert to iterative for
//    large graphs (V8 stack ~10k frames).
// ⚠️ Disconnected DAG: multiple in-degree-0 starting points.
// ⚠️ Isolated nodes: still part of the order — include them.
// ⚠️ Multiple valid orders: don't compare against a single
//    "expected" order in tests unless the problem specifies
//    tie-breaking.
// ⚠️ Kahn's order depends on Map iteration order — use a heap
//    for deterministic output.
// ⚠️ Self-loops: indegree never reaches 0 → cycle detected.
// ⚠️ Multi-edges: count them properly in indegree (or dedup).
// ⚠️ Alien dictionary: the prefix case is a hidden test.
// ⚠️ No heap in stdlib — use MinHeapStr or file 11's MinHeap.
// ⚠️ Node labels: ensure every node appears as a key even if it
//    has no outgoing edges.
// ⚠️ "All topological orders" is exponential — don't try on n=20.
// ⚠️ Longest path in a DAG uses topological order + DP — much
//    faster than DFS-memo for dense graphs.
// ⚠️ `-Infinity` sentinel: check `dist[u] !== -Infinity` before
//    relaxing from u.
// ⚠️ TypeScript strict null checks: Map.get returns T|undefined.
//    Narrow before arithmetic or comparison.
// ⚠️ JS Array.sort with no comparator does STRING sort — for
//    numeric tie-breaks, always pass a comparator.

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - Spread of Map entries: ES2015
 * - Array.from: ES2015
 * - Optional chaining (?.) / nullish coalescing (??): ES2020
 * - noUncheckedIndexedAccess: TS 4.1+
 * - BigInt: ES2020 (rarely needed here)
 * - structuredClone: Node 17+ (not needed for topo sort)
 * - No built-in heap in JS / TS — implement or use file 11
 * - No stdlib topological sort — write it yourself
 * - V8 stack limit ~10k frames — iterative Kahn's preferred
 * - For very large graphs, consider WASM or C++ bindings
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Algorithm        │ Data structure │ Cycle detection  │ Time   |
 * ─────────────────────────────────────────────────────────────
 * | Kahn's           │ queue (head)   │ order < V        │ O(V+E) |
 * | Kahn's lexical   │ min-heap       │ order < V        │ O((V+E)│
 * |                  │                │                  │ log V) |
 * | DFS postorder    │ recursion      │ gray node (stack)│ O(V+E) |
 * ─────────────────────────────────────────────────────────────
 * | Steps of Kahn's algorithm                                   │
 * ─────────────────────────────────────────────────────────────
 * | 1. Compute in-degree for every vertex                       │
 * | 2. Enqueue all with in-degree 0                             │
 * | 3. Pop, append to order, decrement neighbours               │
 * | 4. Push new in-degree-0 to queue                            │
 * | 5. Repeat until empty                                       │
 * | 6. If order.length < V → cycle exists                       │
 * ─────────────────────────────────────────────────────────────
 * | Problem                       │ Technique                   │
 * ─────────────────────────────────────────────────────────────
 * | Any topo order                │ Kahn's / DFS postorder      │
 * | Lexicographically smallest    │ Kahn's + min-heap           │
 * | Detect cycle                  │ Kahn's leftover count       │
 * | Nodes in cycle                │ Kahn's leftovers            │
 * | Course schedule I / II        │ Kahn's                      │
 * | Alien dictionary              │ Kahn's + heap + prefix test │
 * | Longest path in DAG           │ Topo order + DP             │
 * | Shortest path in DAG (neg ok) │ Topo order + DP             │
 * | All valid orders              │ Backtracking (small n)      │
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                  |
 * ─────────────────────────────────────────────────────────────
 * | Cycles                      │ No valid topo order           |
 * | Missing keys                │ Map.get returns undefined     |
 * | Recursive DFS depth         │ RangeError                    |
 * | Non-deterministic order     │ Tests fail if unchecked       |
 * | Self-loop unaccounted       │ Wrong indegree → cycle missed |
 * | Multi-edges double-counted  │ Wrong indegree                |
 * | Alien prefix edge           │ "" expected but not returned  |
 * | All orders for large n      │ Exponential blowup            |
 * | Array.sort without cmp      │ String sort for numbers       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Prefer Kahn's algorithm — iterative, cycle-safe, easy.
 *  - Include ISOLATED vertices — every node in the graph must
 *    appear in the topological order.
 *  - Use min-heap (not queue) for a DETERMINISTIC or smallest
 *    order.
 *  - Detect cycles via leftover count in Kahn's, or gray nodes
 *    in DFS.
 *  - Never claim a topo order exists without checking for cycles.
 *  - Longest/shortest path in DAG = topo order + DP — beats
 *    Dijkstra and works with negative weights.
 *  - Alien dictionary: remember the "b is prefix of a" invalid
 *    case → return "".
 *  - For "all topological orders", backtracking only for n ≤ 10.
 *  - Test with: empty graph, single node, self-loop, disconnect,
 *    multi-edges, and a "prefix" invalid input.
 *  - Tie-breaking matters: if the problem gives a deterministic
 *    expected output, use a heap.
 *  - Draw the DAG by hand for tricky cases to sanity-check.
 *  - Use Map<T, T[]> for vertices of arbitrary types; number[][]
 *    for 0..n-1.
 * ============================================================ */