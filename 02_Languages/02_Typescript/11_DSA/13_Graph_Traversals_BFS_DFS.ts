// 13_Graph_Traversals_BFS_DFS.ts

/* ============================================================
 *  📘 GRAPH TRAVERSALS: BFS & DFS IN TYPESCRIPT
 *
 *  BFS (Breadth-First Search) explores a graph LEVEL BY LEVEL
 *  using a queue. DFS (Depth-First Search) explores as deep as
 *  possible before backtracking, using a stack or recursion.
 *  Together they are the foundation of almost every graph
 *  algorithm: shortest paths, cycle detection, topological sort,
 *  connected components, and more.
 *
 *  This file covers: BFS iterative, BFS levels, shortest path
 *  (unweighted), DFS recursive + iterative, preorder/postorder
 *  DFS, connected components, cycle detection (both directed and
 *  undirected), grid BFS/DFS (islands), and complexity notes.
 *
 *  Sections:
 *   1. BFS vs DFS at a glance
 *   2. BFS — iterative with head-pointer queue
 *   3. BFS with levels (distance tracking)
 *   4. Shortest path in an unweighted graph
 *   5. Multi-source BFS
 *   6. DFS — recursive
 *   7. DFS — iterative with stack
 *   8. Connected components (DFS + BFS)
 *   9. Cycle detection — undirected
 *  10. Cycle detection — directed (colors)
 *  11. Grid BFS/DFS — number of islands
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ BFS VS DFS AT A GLANCE
 * ============================================================ */
// ── Side-by-side ─────────────────────────────────────────────
// | Feature            │ BFS                │ DFS                |
// |--------------------|--------------------|--------------------|
// | Data structure     │ queue (head ptr)   │ stack / recursion  |
// | Order              │ level by level     │ deep first         |
// | Shortest path (uw) │ ✅ YES             │ ❌ NO              |
// | Memory             │ O(width)           │ O(depth)           |
// | Recursion risk     │ none (iterative)   │ high on deep graphs|
// | Uses               │ shortest path,     │ topo sort, cycle,  |
// |                    │ levels, min moves  │ components, LCA    |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Rule of thumb:
//   - Need SHORTEST path / min steps → BFS.
//   - Need to explore/backtrack deep → DFS.
//   - Need level-order info → BFS.
//   - Need finishing order → DFS (postorder).


/* ============================================================
 *  2️⃣ BFS — ITERATIVE WITH HEAD-POINTER QUEUE
 * ============================================================ */
// 🔹 Visit start, enqueue it; dequeue from front, enqueue
//    unvisited neighbours; repeat.
// 🔸 O(V + E) time, O(V) space.

function bfs<T>(adj: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>([start]);
  const order: T[] = [];
  const q: T[] = [start];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) {
        visited.add(v);
        q.push(v);
      }
    }
  }
  return order;
}

const g = new Map<string, string[]>([
  ["A", ["B", "C"]],
  ["B", ["A", "D", "E"]],
  ["C", ["A", "F"]],
  ["D", ["B"]],
  ["E", ["B", "F"]],
  ["F", ["C", "E"]],
]);
console.log(bfs(g, "A"));               // ["A", "B", "C", "D", "E", "F"]

// ⚠️ Mark visited WHEN ENQUEUING, not when dequeueing — otherwise
//    the same node can be enqueued twice.
// 🧠 Always: visited.add(v) BEFORE q.push(v).


/* ============================================================
 *  3️⃣ BFS WITH LEVELS (DISTANCE TRACKING)
 * ============================================================ */
// 🔹 Snapshot the queue size at the start of each level.
// 🔸 Or store [node, distance] tuples.
// 🎯 Used for "levels", "minimum steps", "min moves".

function bfsLevels<T>(adj: Map<T, T[]>, start: T): Map<T, number> {
  const dist = new Map<T, number>([[start, 0]]);
  const q: T[] = [start];
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

console.log([...bfsLevels(g, "A").entries()]);
// [ ["A",0], ["B",1], ["C",1], ["D",2], ["E",2], ["F",2] ]

// 🔸 Group by level (returns array of arrays)
function bfsByLevel<T>(adj: Map<T, T[]>, start: T): T[][] {
  const levels: T[][] = [];
  const visited = new Set<T>([start]);
  const q: T[] = [start];
  let head = 0;
  while (head < q.length) {
    const size = q.length - head;         // ← snapshot BEFORE inner loop
    const level: T[] = [];
    for (let i = 0; i < size; i++) {
      const u = q[head++];
      if (u === undefined) break;
      level.push(u);
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) {
          visited.add(v);
          q.push(v);
        }
      }
    }
    levels.push(level);
  }
  return levels;
}

console.log(bfsByLevel(g, "A"));
// [ ["A"], ["B","C"], ["D","E","F"] ]

// 🧠 Snapshot `q.length - head` at each level — that's the whole
//    trick. Also avoids O(n) shift by using a head pointer.


/* ============================================================
 *  4️⃣ SHORTEST PATH IN AN UNWEIGHTED GRAPH
 * ============================================================ */
// 🔹 BFS gives shortest path in EDGE COUNT.
// 🔸 Track parent to reconstruct the path.

function shortestPath<T>(
  adj: Map<T, T[]>,
  start: T,
  goal: T,
): T[] | null {
  if (start === goal) return [start];
  const parent = new Map<T, T | null>([[start, null]]);
  const q: T[] = [start];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    if (u === undefined) break;
    for (const v of adj.get(u) ?? []) {
      if (!parent.has(v)) {
        parent.set(v, u);
        if (v === goal) {
          const path: T[] = [v];
          let cur: T | null = u;
          while (cur !== null) {
            path.push(cur);
            cur = parent.get(cur) ?? null;
          }
          return path.reverse();
        }
        q.push(v);
      }
    }
  }
  return null;
}

console.log(shortestPath(g, "A", "F"));  // ["A", "C", "F"]
console.log(shortestPath(g, "A", "D"));  // ["A", "B", "D"]
console.log(shortestPath(g, "A", "Z"));  // null

// ⚠️ BFS gives shortest in UNWEIGHTED graphs only.
//    For weighted, use Dijkstra (file 23).
// 🧠 Parent map + backtrack = reconstruction pattern.


/* ============================================================
 *  5️⃣ MULTI-SOURCE BFS
 * ============================================================ */
// 🔹 Start BFS from MANY sources at once.
// 🔸 Enqueue all sources with distance 0.
// 🎯 Use case: "distance to nearest 0 in a grid",
//    "rotting oranges", "walls and gates".

function multiSourceBfs<T>(adj: Map<T, T[]>, sources: readonly T[]): Map<T, number> {
  const dist = new Map<T, number>();
  const q: T[] = [];
  for (const s of sources) {
    dist.set(s, 0);
    q.push(s);
  }
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

const g2 = new Map<string, string[]>([
  ["A", ["B", "C"]],
  ["B", ["A", "D"]],
  ["C", ["A", "D"]],
  ["D", ["B", "C", "E"]],
  ["E", ["D"]],
]);
console.log([...multiSourceBfs(g2, ["A", "E"]).entries()]);
// [ ["A",0], ["E",0], ["B",1], ["C",1], ["D",1] ]

// 🧠 Multi-source BFS is just BFS with many starts in the queue.
//    Very common in grid problems.


/* ============================================================
 *  6️⃣ DFS — RECURSIVE
 * ============================================================ */
// 🔹 Visit, recurse on unvisited neighbours, backtrack.
// 🔸 O(V + E) time, O(depth) stack space.
// ⚠️ V8 stack limit ~10k frames → prefer iterative for deep
//    graphs.

function dfsRec<T>(adj: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>();
  const order: T[] = [];
  function go(u: T): void {
    visited.add(u);
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) go(v);
    }
  }
  go(start);
  return order;
}

console.log(dfsRec(g, "A"));            // ["A","B","D","E","F","C"] (varies)

// 🔸 Classic DFS variants:
//    - PREORDER : push BEFORE recursing (above)
//    - POSTORDER: push AFTER recursing (children first)
function dfsPostorder<T>(adj: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>();
  const order: T[] = [];
  function go(u: T): void {
    visited.add(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) go(v);
    }
    order.push(u);                       // post-order push
  }
  go(start);
  return order;
}

console.log(dfsPostorder(g, "A"));      // ["D","B","F","E","C","A"] (varies)

// 🧠 Postorder is the basis of topological sort (file 24).
// ⚠️ Deep chains risk RangeError. Convert to iterative for V > ~5000.


/* ============================================================
 *  7️⃣ DFS — ITERATIVE WITH STACK
 * ============================================================ */
// 🔹 Explicit stack → no recursion depth limit.
// 🔸 Push neighbours in reverse order so left-most is popped first.

function dfsIter<T>(adj: Map<T, T[]>, start: T): T[] {
  const visited = new Set<T>();
  const order: T[] = [];
  const stack: T[] = [start];
  while (stack.length > 0) {
    const u = stack.pop();
    if (u === undefined) continue;
    if (visited.has(u)) continue;
    visited.add(u);
    order.push(u);
    // Push neighbours in reverse order so the "first" is popped first
    const nbrs = adj.get(u) ?? [];
    for (let i = nbrs.length - 1; i >= 0; i--) {
      const v = nbrs[i];
      if (v !== undefined && !visited.has(v)) stack.push(v);
    }
  }
  return order;
}

console.log(dfsIter(g, "A"));           // ["A","B","D","E","F","C"]

// ⚠️ Without the `if (visited.has(u)) continue` check, the same
//    node can be pushed multiple times. Skipping at pop keeps
//    the order clean.
// 🧠 Reverse-push matches recursive DFS order when neighbour
//    lists are ordered consistently.


/* ============================================================
 *  8️⃣ CONNECTED COMPONENTS (DFS + BFS)
 * ============================================================ */
// 🔹 Count components, list members, or check connectivity.
// 🔸 Loop over all vertices, run DFS on unvisited ones.

function countComponents<T>(adj: Map<T, T[]>): number {
  const visited = new Set<T>();
  let count = 0;
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    count += 1;
    const stack: T[] = [start];
    while (stack.length > 0) {
      const u = stack.pop();
      if (u === undefined || visited.has(u)) continue;
      visited.add(u);
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) stack.push(v);
      }
    }
  }
  return count;
}

const g3 = new Map<string, string[]>([
  ["A", ["B"]],
  ["B", ["A"]],
  ["C", []],
  ["D", ["E"]],
  ["E", ["D"]],
]);
console.log(countComponents(g3));       // 3

// 🔸 Same via BFS
function countComponentsBfs<T>(adj: Map<T, T[]>): number {
  const visited = new Set<T>();
  let count = 0;
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    count += 1;
    const q: T[] = [start];
    let head = 0;
    visited.add(start);
    while (head < q.length) {
      const u = q[head++];
      if (u === undefined) break;
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) {
          visited.add(v);
          q.push(v);
        }
      }
    }
  }
  return count;
}

console.log(countComponentsBfs(g3));    // 3

// 🧠 Each fresh start = one new component.


/* ============================================================
 *  9️⃣ CYCLE DETECTION — UNDIRECTED
 * ============================================================ */
// 🔹 DFS with parent tracking.
// 🔸 If we see a visited node that isn't the parent → cycle.
// ⚠️ Recursion depth for large graphs → iterative version below.

function hasCycleUndirected<T>(adj: Map<T, T[]>): boolean {
  const visited = new Set<T>();

  function dfs(u: T, parent: T | null): boolean {
    visited.add(u);
    for (const v of adj.get(u) ?? []) {
      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        return true;
      }
    }
    return false;
  }

  for (const start of adj.keys()) {
    if (!visited.has(start)) {
      if (dfs(start, null)) return true;
    }
  }
  return false;
}

console.log(hasCycleUndirected(new Map([
  ["A", ["B"]], ["B", ["A", "C"]], ["C", ["B", "A"]],
])));                                    // true

console.log(hasCycleUndirected(new Map([
  ["A", ["B"]], ["B", ["A"]],
])));                                    // false

// 🔸 Iterative version (avoids deep recursion)
function hasCycleUndirectedIter<T>(adj: Map<T, T[]>): boolean {
  const visited = new Set<T>();
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    // Stack entries: [node, parent]
    const stack: Array<[T, T | null]> = [[start, null]];
    while (stack.length > 0) {
      const item = stack.pop();
      if (!item) continue;
      const [u, parent] = item;
      if (visited.has(u)) continue;
      visited.add(u);
      for (const v of adj.get(u) ?? []) {
        if (!visited.has(v)) {
          stack.push([v, u]);
        } else if (v !== parent) {
          return true;
        }
      }
    }
  }
  return false;
}

// 🧠 Parent check avoids flagging the edge you just came from.


/* ============================================================
 *  🔟 CYCLE DETECTION — DIRECTED (COLORS)
 * ============================================================ */
// 🔹 Three colours:
//     WHITE (0) = unvisited
//     GRAY  (1) = in current DFS path
//     BLACK (2) = fully processed
// 🔸 An edge to a GRAY node = back edge = cycle.
// 🎯 O(V + E) — the standard for directed graphs.

const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

function hasCycleDirected<T>(adj: Map<T, T[]>): boolean {
  const colour = new Map<T, number>();
  for (const u of adj.keys()) colour.set(u, WHITE);

  function dfs(u: T): boolean {
    colour.set(u, GRAY);
    for (const v of adj.get(u) ?? []) {
      const cv = colour.get(v);
      if (cv === GRAY) return true;       // back edge
      if (cv === WHITE && dfs(v)) return true;
    }
    colour.set(u, BLACK);
    return false;
  }

  for (const u of adj.keys()) {
    if (colour.get(u) === WHITE) {
      if (dfs(u)) return true;
    }
  }
  return false;
}

const dag = new Map<string, string[]>([
  ["A", ["B"]], ["B", ["C"]], ["C", []],
]);
console.log(hasCycleDirected(dag));     // false

const cycle = new Map<string, string[]>([
  ["A", ["B"]], ["B", ["C"]], ["C", ["A"]],
]);
console.log(hasCycleDirected(cycle));   // true

// 🧠 Cycle in directed graphs ≠ undirected cycle logic.
//    Colors (white/gray/black) is the classic, correct way.
// ⚠️ A pair of opposite edges (A→B, B→A) IS a cycle in directed
//    graphs, but NOT in undirected (it's just a single edge).


/* ============================================================
 *  1️⃣1️⃣ GRID BFS/DFS — NUMBER OF ISLANDS
 * ============================================================ */
// 🔹 Grid = implicit graph; each cell has up to 4 neighbours.
// 🔸 Standard 4-directional DFS flood-fill.

function numIslands(grid: string[][]): number {
  if (grid.length === 0 || grid[0]?.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let count = 0;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const row = grid[r];
    if (!row || row[c] !== "1") return;
    row[c] = "0";                        // mark visited IN PLACE
    dfs(r + 1, c); dfs(r - 1, c);
    dfs(r, c + 1); dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]?.[c] === "1") {
        count += 1;
        dfs(r, c);
      }
    }
  }
  return count;
}

const grid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];
console.log(numIslands(grid));          // 3

// 🔸 BFS version (safer for very large grids — no recursion)
function numIslandsBfs(grid: string[][]): number {
  if (grid.length === 0 || grid[0]?.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r]?.[c] === "1") {
        count += 1;
        const q: Array<[number, number]> = [[r, c]];
        let head = 0;
        const row = grid[r];
        if (row) row[c] = "0";
        while (head < q.length) {
          const cell = q[head++];
          if (!cell) continue;
          const [x, y] = cell;
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) continue;
            const nrow = grid[nx];
            if (nrow && nrow[ny] === "1") {
              nrow[ny] = "0";
              q.push([nx, ny]);
            }
          }
        }
      }
    }
  }
  return count;
}

const grid2 = grid.map((row) => [...row]);
console.log(numIslandsBfs(grid2));      // 3

// 🧠 Grid DFS/BFS patterns:
//    - "flood fill"        → DFS/BFS from any start cell
//    - "shortest path"     → BFS with distance
//    - "count regions"     → iterate + flood each region
//    - "number of islands" → above
//    - "rotten oranges"    → multi-source BFS
//    - "walls and gates"   → multi-source BFS
// Direction arrays:
//    const dirs4 = [[1,0], [-1,0], [0,1], [0,-1]] as const;
//    const dirs8 = [...dirs4, [1,1], [1,-1], [-1,1], [-1,-1]];


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ BFS: mark visited when ENQUEUING (not when popping).
//    Otherwise the same node can be enqueued multiple times.
// ⚠️ DFS recursive: mark visited BEFORE recursion. Otherwise
//    infinite loop on cycles.
// ⚠️ Undirected graph: parent check avoids false cycle detection.
// ⚠️ Directed graph: use color (white/gray/black), NOT parent.
// ⚠️ Recursion depth for DFS on chain of 10^5 → RangeError.
//    Use iterative stack.
// ⚠️ Grid problems: check bounds BEFORE indexing.
// ⚠️ Grid mutation vs a separate visited set — pick one and stick
//    with it. Mutating input is O(1) space but destroys data.
// ⚠️ Neighbour order affects the traversal order but not the set
//    of visited nodes.
// ⚠️ BFS shortest path only works on UNWEIGHTED graphs (or all
//    edges equal weight).
// ⚠️ Multi-source BFS: initialise ALL sources to dist 0.
// ⚠️ For huge graphs, avoid spread copies in tight loops.
// ⚠️ Cycles in directed graphs are NOT the same as undirected —
//    a two-edge pair (A→B, B→A) is a cycle in directed but not
//    in undirected sense.
// ⚠️ TypeScript noUncheckedIndexedAccess: grid[r] and grid[r][c]
//    are both `T | undefined`. Guard or assert.
// ⚠️ Use `Map<T, T[]>` for vertices of arbitrary types; use
//    number[][] when vertices are 0..n-1 for speed.
// ⚠️ JSON.stringify on Map yields "{}" — convert to entries
//    array for serialisation.

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - Spread / destructuring: ES2015
 * - Optional chaining (?.) / nullish coalescing (??): ES2020
 * - Object.hasOwn: ES2022
 * - structuredClone: Node 17+ / modern browsers
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - V8 stack limit ~10k frames — for deep DFS, iterate
 * - No built-in graph traversal in JS / TS
 * - For huge graphs consider WebAssembly or worker threads
 * - Node 18+ / Deno for modern runtimes
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Traversal  │ Data structure      │ Order           │ Notes   |
 * ─────────────────────────────────────────────────────────────
 * | BFS        │ head-ptr queue      │ level by level  │ shortest (uw) |
 * | DFS (rec)  │ call stack          │ depth-first     │ simple, risky |
 * | DFS (iter) │ explicit stack      │ depth-first     │ no stack limit|
 * ─────────────────────────────────────────────────────────────
 * | Task                     │ Best choice                  |
 * ─────────────────────────────────────────────────────────────
 * | Shortest path (unweighted)│ BFS with parent map         |
 * | Levels / min moves        │ BFS with level snapshot     |
 * | Multi-source distance     │ Multi-source BFS            |
 * | Connectivity / components │ DFS or BFS from each start  |
 * | Cycle (undirected)        │ DFS with parent tracking    |
 * | Cycle (directed)          │ DFS with 3 colours          |
 * | Topological order (DAG)   │ DFS postorder (reverse)     |
 * | Grid flood fill           │ DFS or BFS (4 dirs)         |
 * | Rotting / walls           │ Multi-source BFS            |
 * ─────────────────────────────────────────────────────────────
 * | Complexity          │ Time      │ Space                     |
 * ─────────────────────────────────────────────────────────────
 * | BFS                 │ O(V+E)    │ O(V)                      |
 * | DFS                 │ O(V+E)    │ O(V) (stack/recursion)    |
 * | Grid BFS/DFS        │ O(R*C)    │ O(R*C)                    |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                        │ Why it bites             |
 * ─────────────────────────────────────────────────────────────
 * | Mark visited on pop            │ Duplicate queue entries  |
 * | Recursion DFS without visited  │ Infinite loop on cycles  |
 * | Undirected cycle via colours   │ Wrong tool               |
 * | Directed cycle via parent      │ Misses back edges        |
 * | BFS for weighted               │ Wrong shortest path      |
 * | Grid without bounds check      │ IndexError / undefined   |
 * | Deep recursion DFS             │ RangeError (stack)       |
 * | Multi-source with one start    │ Wrong distances          |
 * | Modifying grid vs visited set  │ Destroys input / dupes   |
 * | Map iteration not deterministic│ Differs across engines   |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - BFS: use a head-pointer queue; mark visited BEFORE enqueue.
 *  - BFS: snapshot queue length for level-by-level processing.
 *  - DFS: prefer iterative with explicit stack for large graphs.
 *  - DFS: mark visited BEFORE recursing.
 *  - Cycle (undirected): DFS with parent tracking.
 *  - Cycle (directed): DFS with WHITE/GRAY/BLACK colours.
 *  - Grid problems: bounds-check first, then check cell value.
 *  - Shortest path (unweighted): BFS + parent map.
 *  - Multi-source BFS: seed queue with all sources at dist 0.
 *  - Never use BFS to find shortest path on weighted graphs.
 *  - Use Map<T, T[]> for vertices of arbitrary types; number[][]
 *    for 0..n-1 for speed.
 *  - Test: empty graph, single node, self-loop, disconnected
 *    components, and deep chain.
 *  - Draw the graph on paper for tricky stateful traversals.
 *  - Guard indexed access with optional chaining in TS.
 * ============================================================ */