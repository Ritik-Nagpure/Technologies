// 09_Binary_Trees.ts

/* ============================================================
 *  📘 BINARY TREES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A binary tree is a hierarchical structure where each node has
 *  up to two children (left, right). Trees are the natural model
 *  for hierarchies (filesystems, HTML DOM, expressions), for
 *  ordered data (BSTs, heaps), and for recursive algorithms
 *  (divide & conquer, backtracking). Mastery of tree traversals
 *  is the foundation for graphs, DP on trees, and much more.
 *
 *  This file covers: tree terminology, node structure, all four
 *  traversals (preorder, inorder, postorder, level-order),
 *  iterative versions, recursive solutions to standard problems
 *  (height, count, mirror, diameter, LCA), and pitfalls like
 *  unbalanced recursion depth.
 *
 *  Sections:
 *   1. Tree terminology
 *   2. Node structure
 *   3. Building trees from arrays
 *   4. Depth-first traversals (preorder, inorder, postorder)
 *   5. Iterative DFS (stack-based)
 *   6. Level-order traversal (BFS)
 *   7. Height, size, sum of a tree
 *   8. Mirror / symmetric tree
 *   9. Diameter of a tree
 *  10. Lowest Common Ancestor (LCA)
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ TREE TERMINOLOGY
 * ============================================================ */
// 🔹 Root      : the top node (no parent)
// 🔹 Child     : a node directly below another
// 🔹 Parent    : the node directly above another
// 🔹 Leaf      : a node with no children
// 🔹 Subtree   : a node plus all its descendants
// 🔹 Height    : # edges on the longest path from node to leaf
// 🔹 Depth     : # edges from root to node
// 🔹 Level     : depth + 1 (root is level 1)
// 🔹 Complete  : every level full except possibly the last
// 🔹 Full      : every node has 0 or 2 children
// 🔹 Perfect   : every level full, all leaves at same depth
// 🔹 Balanced  : height is O(log n)

// 🧠 Rule: if the problem mentions hierarchy, ordering, or
//    recursion on sub-parts → think tree.


/* ============================================================
 *  2️⃣ NODE STRUCTURE
 * ============================================================ */
// 🔹 Each node has a value and up to two children.

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(
    value: T,
    left: TreeNode<T> | null = null,
    right: TreeNode<T> | null = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// 🧠 In TypeScript, using a generic T is idiomatic. Constrain
//    T to comparable types (e.g., T extends number) when you
//    need ordering.


/* ============================================================
 *  3️⃣ BUILDING TREES FROM ARRAYS
 * ============================================================ */
// 🔹 Level-order array with null for missing children.
//    e.g., [1, 2, 3, null, 5] →
//            1
//           / \
//          2   3
//           \
//            5
// 🔸 Standard LeetCode input format.

function buildTree(values: readonly (number | null)[]): TreeNode<number> | null {
  if (values.length === 0) return null;
  const first = values[0];
  if (first === undefined || first === null) return null;

  const root = new TreeNode(first);
  const queue: TreeNode<number>[] = [root];
  let head = 0;                           // pointer to avoid O(n) shift
  let i = 1;

  while (head < queue.length && i < values.length) {
    const node = queue[head++];
    if (node === undefined) break;

    // Left child
    if (i < values.length) {
      const lv = values[i];
      if (lv !== undefined && lv !== null) {
        node.left = new TreeNode(lv);
        queue.push(node.left);
      }
      i += 1;
    }

    // Right child
    if (i < values.length) {
      const rv = values[i];
      if (rv !== undefined && rv !== null) {
        node.right = new TreeNode(rv);
        queue.push(node.right);
      }
      i += 1;
    }
  }
  return root;
}

const root = buildTree([1, 2, 3, null, 5, 6, 7]);
console.log(root?.value, root?.left?.value, root?.right?.value);  // 1 2 3

// 🔸 Pretty-print for debugging
function display(
  node: TreeNode<number> | null,
  level: number = 0,
  prefix: string = "R: ",
): void {
  if (node === null) return;
  console.log("  ".repeat(level) + prefix + node.value);
  display(node.left, level + 1, "L: ");
  display(node.right, level + 1, "R: ");
}

display(root);
// R: 1
//   L: 2
//     R: 5
//   R: 3
//     L: 6
//     R: 7

// 🧠 buildTree is a great way to convert test data to a tree.


/* ============================================================
 *  4️⃣ DEPTH-FIRST TRAVERSALS
 * ============================================================ */
// 🔹 PREORDER  : node → left → right
// 🔹 INORDER   : left → node → right   (sorted for BSTs)
// 🔹 POSTORDER : left → right → node   (children before parent)
// 🔸 All O(n) time, O(h) stack space.

function preorder(node: TreeNode<number> | null): number[] {
  if (node === null) return [];
  return [node.value, ...preorder(node.left), ...preorder(node.right)];
}

function inorder(node: TreeNode<number> | null): number[] {
  if (node === null) return [];
  return [...inorder(node.left), node.value, ...inorder(node.right)];
}

function postorder(node: TreeNode<number> | null): number[] {
  if (node === null) return [];
  return [...postorder(node.left), ...postorder(node.right), node.value];
}

const t = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("pre ", preorder(t));       // [1, 2, 4, 5, 3, 6, 7]
console.log("in  ", inorder(t));        // [4, 2, 5, 1, 6, 3, 7]
console.log("post", postorder(t));      // [4, 5, 2, 6, 7, 3, 1]

// 🧠 Mnemonic: PRE = node first; POST = node last; IN = node
//    between children.
// ⚠️ These one-liners spread arrays — O(n²) worst-case due to
//    repeated spreading. Use an accumulator for production code.

// ✅ Accumulator-style (O(n))
function preorderAcc(node: TreeNode<number> | null, out: number[] = []): number[] {
  if (node === null) return out;
  out.push(node.value);
  preorderAcc(node.left, out);
  preorderAcc(node.right, out);
  return out;
}
console.log(preorderAcc(t));            // [1, 2, 4, 5, 3, 6, 7]


/* ============================================================
 *  5️⃣ ITERATIVE DFS (STACK-BASED)
 * ============================================================ */
// 🔹 Avoids recursion depth limits.
// 🔸 Uses an explicit stack (array).

function preorderIter(root: TreeNode<number> | null): number[] {
  if (root === null) return [];
  const out: number[] = [];
  const stack: TreeNode<number>[] = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === undefined) break;
    out.push(node.value);
    // Push right FIRST so left is popped first
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}

function inorderIter(root: TreeNode<number> | null): number[] {
  const out: number[] = [];
  const stack: TreeNode<number>[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    const node = stack.pop();
    if (node === undefined) break;
    out.push(node.value);
    cur = node.right;
  }
  return out;
}

function postorderIter(root: TreeNode<number> | null): number[] {
  if (root === null) return [];
  const out: number[] = [];
  const stack: Array<[TreeNode<number>, boolean]> = [[root, false]];
  while (stack.length > 0) {
    const item = stack.pop();
    if (item === undefined) break;
    const [node, visited] = item;
    if (visited) {
      out.push(node.value);
    } else {
      stack.push([node, true]);
      if (node.right) stack.push([node.right, false]);
      if (node.left) stack.push([node.left, false]);
    }
  }
  return out;
}

console.log(preorderIter(t));           // [1, 2, 4, 5, 3, 6, 7]
console.log(inorderIter(t));            // [4, 2, 5, 1, 6, 3, 7]
console.log(postorderIter(t));          // [4, 5, 2, 6, 7, 3, 1]

// 🧠 Iterative DFS is the go-to when recursion may blow the
//    V8 stack (tree depth > ~5000).


/* ============================================================
 *  6️⃣ LEVEL-ORDER TRAVERSAL (BFS)
 * ============================================================ */
// 🔹 Visit nodes level by level, left to right.
// 🔸 Uses a QUEUE.
// 🎯 Foundation for shortest path on unweighted trees.

function levelOrder(root: TreeNode<number> | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const q: TreeNode<number>[] = [root];
  let head = 0;
  while (head < q.length) {
    const levelSize = q.length - head;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = q[head++];
      if (node === undefined) break;
      level.push(node.value);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(level);
  }
  return result;
}

console.log(levelOrder(t));             // [[1], [2, 3], [4, 5, 6, 7]]

// 🔸 Zig-zag level order (alternate direction each level)
function zigzagLevelOrder(root: TreeNode<number> | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const q: TreeNode<number>[] = [root];
  let head = 0;
  let leftToRight = true;
  while (head < q.length) {
    const size = q.length - head;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = q[head++];
      if (node === undefined) break;
      level.push(node.value);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    result.push(leftToRight ? level : level.reverse());
    leftToRight = !leftToRight;
  }
  return result;
}

console.log(zigzagLevelOrder(t));       // [[1], [3, 2], [4, 5, 6, 7]]

// 🧠 Level-size snapshot (queue length BEFORE inner loop) is
//    what keeps levels separate.


/* ============================================================
 *  7️⃣ HEIGHT, SIZE, SUM OF A TREE
 * ============================================================ */
// 🔹 All three are one-line recursive patterns.
// 🔸 Same shape: recurse left, recurse right, combine.

function height(node: TreeNode<number> | null): number {
  if (node === null) return -1;         // edges; use 0 for nodes
  return 1 + Math.max(height(node.left), height(node.right));
}

function size(node: TreeNode<number> | null): number {
  if (node === null) return 0;
  return 1 + size(node.left) + size(node.right);
}

function treeSum(node: TreeNode<number> | null): number {
  if (node === null) return 0;
  return node.value + treeSum(node.left) + treeSum(node.right);
}

function countLeaves(node: TreeNode<number> | null): number {
  if (node === null) return 0;
  if (node.left === null && node.right === null) return 1;
  return countLeaves(node.left) + countLeaves(node.right);
}

console.log(height(t));                 // 2
console.log(size(t));                   // 7
console.log(treeSum(t));                // 28
console.log(countLeaves(t));            // 4

// 🧠 Template:
//     if (!node) return <base>
//     left = rec(node.left)
//     right = rec(node.right)
//     return <combine>


/* ============================================================
 *  8️⃣ MIRROR / SYMMETRIC TREE
 * ============================================================ */
// 🔹 Mirror: recursively swap left and right.
// 🔸 Symmetric: tree is mirror of itself around root.

function mirror(node: TreeNode<number> | null): TreeNode<number> | null {
  if (node === null) return null;
  const leftMirrored = mirror(node.right);
  const rightMirrored = mirror(node.left);
  node.left = leftMirrored;
  node.right = rightMirrored;
  return node;
}

function isSymmetric(root: TreeNode<number> | null): boolean {
  function check(
    a: TreeNode<number> | null,
    b: TreeNode<number> | null,
  ): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return (
      a.value === b.value &&
      check(a.left, b.right) &&
      check(a.right, b.left)
    );
  }
  return root === null || check(root.left, root.right);
}

const sym = buildTree([1, 2, 2, 3, 4, 4, 3]);
console.log(isSymmetric(sym));          // true

const sym2 = buildTree([1, 2, 2, null, 3, null, 3]);
console.log(isSymmetric(sym2));         // false

// 🧠 Symmetric check = "cross compare" (a.left vs b.right).


/* ============================================================
 *  9️⃣ DIAMETER OF A TREE
 * ============================================================ */
// 🔹 Longest path (in edges) between any two nodes.
// 🔸 Compute height once, track max(left_h + right_h) at each node.
// 🎯 O(n) time — one pass with a closure-scoped accumulator.

function diameter(root: TreeNode<number> | null): number {
  let best = 0;
  function dfs(node: TreeNode<number> | null): number {
    if (node === null) return -1;
    const lh = dfs(node.left);
    const rh = dfs(node.right);
    best = Math.max(best, lh + rh + 2);   // +2 for the two edges
    return 1 + Math.max(lh, rh);
  }
  dfs(root);
  return best;
}

const dTree = buildTree([1, 2, 3, 4, 5]);
console.log(diameter(dTree));           // 3

// 🧠 Pattern: "compute a value (height) AND update a global
//    answer inside the same DFS." Very common in tree problems
//    (max path sum, largest BST subtree, etc.).


/* ============================================================
 *  🔟 LOWEST COMMON ANCESTOR (LCA)
 * ============================================================ */
// 🔹 Deepest node that is ancestor of both p and q.
// 🔸 Recursive: if p and q are on different sides, current is LCA.

function lca(
  root: TreeNode<number> | null,
  p: TreeNode<number>,
  q: TreeNode<number>,
): TreeNode<number> | null {
  if (root === null || root === p || root === q) return root;
  const left = lca(root.left, p, q);
  const right = lca(root.right, p, q);
  if (left !== null && right !== null) return root;  // split here
  return left ?? right;
}

const lcaTree = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const p = lcaTree!.left!;               // 5
const q = lcaTree!.right!;              // 1
console.log(lca(lcaTree, p, q)?.value); // 3

const n1 = lcaTree!.left!.left!;        // 6
const n2 = lcaTree!.left!.right!.right!;// 4
console.log(lca(lcaTree, n1, n2)?.value); // 5

// 🧠 LCA is the parent of "split point" — where left returns one
//    and right returns the other.
// 🔸 For BSTs, LCA is even simpler (compare values).

function lcaBst(
  root: TreeNode<number> | null,
  p: TreeNode<number>,
  q: TreeNode<number>,
): TreeNode<number> | null {
  let cur = root;
  while (cur !== null) {
    if (p.value < cur.value && q.value < cur.value) cur = cur.left;
    else if (p.value > cur.value && q.value > cur.value) cur = cur.right;
    else return cur;
  }
  return null;
}

// 🔸 In a general tree, LCA can be found with parent pointers +
//    a set of ancestors (walk p to root, then walk q up).


/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Empty tree → root is null. Every function must handle this.
// ⚠️ Recursion depth = tree height. A skewed tree (n=10^5) blows
//    the V8 stack → use iterative DFS or an explicit stack.
// ⚠️ The one-line spread traversals are O(n²) worst case — use
//    an accumulator for production code.
// ⚠️ Preorder-iterative: push RIGHT first, then LEFT, so left is
//    popped first.
// ⚠️ Postorder-iterative: use a "visited" flag or reverse of a
//    modified preorder (root → right → left → reverse).
// ⚠️ Level-order: capture queue length BEFORE the inner loop to
//    keep levels separate. Use a head pointer to avoid O(n)
//    shift.
// ⚠️ Height: pick a definition (edges vs nodes) and stick with it.
//    Edges → -1 for null, 1 + max for internal. Or 0 for null,
//    matching "nodes on longest path".
// ⚠️ Mirror modifies in place — copy first if you need the original.
// ⚠️ Diameter: the +2 counts the two edges above children.
//    Off-by-one is easy.
// ⚠️ Symmetric: compare a.left with b.right and a.right with
//    b.left (cross), not same side.
// ⚠️ LCA with null children: guard with `if (root === null)`.
// ⚠️ Don't assume node identity === value — a tree can have
//    duplicate values.
// ⚠️ TypeScript: use `!` only after a guard; otherwise optional
//    chaining (a?.left) is safer.
// ⚠️ Node comparison: `===` is reference equality — fine for
//    identity checks in LCA, mirror, etc.

/* 🕒 Version notes
 * - Classes and generics in TypeScript: TS 1.0+
 * - Optional chaining (?.): ES2020 / TS 3.7+
 * - Nullish coalescing (??): ES2020 / TS 3.7+
 * - Strict null checks: TS 2.0+
 * - noUncheckedIndexedAccess: TS 4.1+
 * - Generator-based iterators: ES2015
 * - V8 stack limit: ~10k frames; use iterative DFS for large trees
 * - `Array.prototype.at(-1)`: ES2022 for stack top convenience
 * - `structuredClone` for deep-copying trees: Node 17+ / modern browsers
 * - No built-in tree structure in JS/TS
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Traversal    │ Order                 │ Notes                |
 * ─────────────────────────────────────────────────────────────
 * | Preorder     │ node → left → right   │ copy / serialize     |
 * | Inorder      │ left → node → right   │ BST sorted order     |
 * | Postorder    │ left → right → node   │ delete / evaluate    |
 * | Level-order  │ level by level        │ BFS with queue       |
 * | Zig-zag      │ alternate per level   │ BFS + reverse        |
 * ─────────────────────────────────────────────────────────────
 * | Problem              │ Technique                        |
 * ─────────────────────────────────────────────────────────────
 * | Height               │ 1 + max(left, right)             |
 * | Size / sum           │ 1 + left + right                 |
 * | Count leaves         │ check no children                |
 * | Mirror               │ swap children recursively        |
 * | Symmetric            │ cross-compare two subtrees       |
 * | Diameter             │ track max(left + right) DFS      |
 * | LCA (general)        │ recursive split point            |
 * | LCA (BST)            │ walk down by value compare       |
 * | Level-order variants │ BFS with per-level snapshot      |
 * ─────────────────────────────────────────────────────────────
 * | Complexity          │ Time      │ Space                     |
 * ─────────────────────────────────────────────────────────────
 * | Any traversal        │ O(n)     │ O(h) recursion / O(n) BFS |
 * | Height/size/sum      │ O(n)     │ O(h)                      |
 * | Diameter (2-pass)    │ O(n)     │ O(h)                      |
 * | LCA                  │ O(n)     │ O(h)                      |
 * | LCA (BST)            │ O(h)     │ O(1) iterative            |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | Skewed tree recursion      │ RangeError: stack overflow     |
 * | Spread traversals          │ O(n²) for skewed               |
 * | Preorder push order        │ right vs left, wrong order     |
 * | Level-order missing snapshot│ Levels merge                  |
 * | Height edges vs nodes      │ Off-by-one                     |
 * | Diameter +2 vs +1          │ Wrong max                      |
 * | Symmetric same-side check  │ Misses asymmetry               |
 * | Mirror in-place            │ Original tree altered          |
 * | Null handling missed       │ TypeError in strict mode       |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Every recursive function: base case = null → return 0/[]/etc.
 *  - Prefer iterative DFS when tree depth may exceed ~5000.
 *  - Use queue + head pointer for level-order / BFS, never shift.
 *  - Snapshot queue length before inner loop for per-level
 *    processing.
 *  - Preorder-iterative: push RIGHT first, then LEFT.
 *  - Height: define edges vs nodes consistently.
 *  - Use optional chaining and strict null checks — avoid `!`.
 *  - Build test trees from level-order arrays (LeetCode style).
 *  - Draw the tree on paper for tricky pointer problems.
 *  - For "compute + track max" problems, use a closure
 *    accumulator inside a helper DFS.
 *  - LCA on BSTs = walk down by comparing values, O(h), no
 *    recursion needed.
 *  - Always test with empty, single-node, and skewed trees.
 *  - Convert trees to arrays (inorder, level-order) for
 *    quick debugging.
 * ============================================================ */