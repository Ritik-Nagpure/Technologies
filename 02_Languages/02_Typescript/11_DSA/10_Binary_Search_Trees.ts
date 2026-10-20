// 10_Binary_Search_Trees.ts

/* ============================================================
 *  📘 BINARY SEARCH TREES IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A Binary Search Tree (BST) is a binary tree where for every
 *  node, all values in the LEFT subtree are smaller and all
 *  values in the RIGHT subtree are larger. This ordering gives
 *  O(log n) search / insert / delete on AVERAGE (O(n) worst
 *  when unbalanced). BSTs are the mental model behind balanced
 *  trees (AVL, Red-Black) and ordered maps.
 *
 *  This file covers: BST property, search, insert, delete (all
 *  three cases), min/max, floor/ceil, k-th smallest, validating
 *  a BST, sorted array → BST, and why unbalanced trees degrade
 *  to O(n).
 *
 *  Sections:
 *   1. The BST property
 *   2. Node structure
 *   3. Search — O(h)
 *   4. Insert — O(h)
 *   5. Min and max
 *   6. Delete — three cases
 *   7. In-order traversal = sorted output
 *   8. Floor and ceiling
 *   9. K-th smallest element
 *  10. Validate a BST
 *  11. Sorted array → balanced BST
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ THE BST PROPERTY
 * ============================================================ */
// 🔹 For every node N:
//     • all keys in left subtree  < N.value
//     • all keys in right subtree > N.value
// 🔸 Strict inequality (no duplicates) is the common convention.
// 🎯 This gives ordered traversal + fast search on balanced trees.
//
//   Height h → search/insert/delete O(h).
//   Balanced → h = O(log n).
//   Skewed   → h = O(n) — the tree degenerates to a list.

// 🧠 BST = binary tree + ordering invariant. If you forget the
//    invariant, it's just a binary tree.

// ── Complexity summary ───────────────────────────────────────
// | Operation | Average      | Worst (skewed)  |
// |-----------|--------------|-----------------|
// | Search    | O(log n)     | O(n)            |
// | Insert    | O(log n)     | O(n)            |
// | Delete    | O(log n)     | O(n)            |
// | Min/Max   | O(log n)     | O(n)            |
// | Inorder   | O(n)         | O(n)            |
// | Space     | O(n)         | O(n)            |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  2️⃣ NODE STRUCTURE
 * ============================================================ */
// 🔹 Same shape as a binary tree node.

class BSTNode<T> {
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

// 🧠 Generic T lets you use numbers, strings, or custom types
//    with a comparator. For simplicity, most examples here use
//    numbers and the built-in <, >, === operators.


/* ============================================================
 *  3️⃣ SEARCH — O(h)
 * ============================================================ */
// 🔹 At each node: go left if target < value, right if target > value.
// 🔸 Iterative version avoids recursion depth issues.

function search(root: BSTNode<number> | null, target: number): BSTNode<number> | null {
  let cur = root;
  while (cur !== null) {
    if (target === cur.value) return cur;
    cur = target < cur.value ? cur.left : cur.right;
  }
  return null;
}

// ✅ Also common recursively
function searchRec(
  root: BSTNode<number> | null,
  target: number,
): BSTNode<number> | null {
  if (root === null || root.value === target) return root;
  if (target < root.value) return searchRec(root.left, target);
  return searchRec(root.right, target);
}


/* ============================================================
 *  4️⃣ INSERT — O(h)
 * ============================================================ */
// 🔹 Walk down like search; attach as a new leaf where you
//    "fall off".
// 🔸 Duplicates: decided by policy — usually ignored or placed
//    on one side consistently.

function insert(root: BSTNode<number> | null, value: number): BSTNode<number> {
  if (root === null) return new BSTNode(value);
  if (value < root.value) root.left = insert(root.left, value);
  else if (value > root.value) root.right = insert(root.right, value);
  // else: duplicate — ignore
  return root;
}

// ✅ Iterative insert (avoids recursion)
function insertIter(root: BSTNode<number> | null, value: number): BSTNode<number> {
  const node = new BSTNode(value);
  if (root === null) return node;
  let cur = root;
  while (true) {
    if (value < cur.value) {
      if (cur.left === null) {
        cur.left = node;
        return root;
      }
      cur = cur.left;
    } else if (value > cur.value) {
      if (cur.right === null) {
        cur.right = node;
        return root;
      }
      cur = cur.right;
    } else {
      return root;                      // duplicate — do nothing
    }
  }
}

// Build a tree
let root: BSTNode<number> | null = null;
for (const v of [8, 3, 10, 1, 6, 14, 4, 7, 13]) {
  root = insert(root, v);
}

//        8
//       / \
//      3   10
//     / \    \
//    1   6    14
//       / \   /
//      4   7 13


/* ============================================================
 *  5️⃣ MIN AND MAX
 * ============================================================ */
// 🔹 Min = leftmost node.
// 🔹 Max = rightmost node.
// 🔸 Both O(h).

function bstMin(root: BSTNode<number> | null): BSTNode<number> | null {
  if (root === null) return null;
  let cur = root;
  while (cur.left !== null) cur = cur.left;
  return cur;
}

function bstMax(root: BSTNode<number> | null): BSTNode<number> | null {
  if (root === null) return null;
  let cur = root;
  while (cur.right !== null) cur = cur.right;
  return cur;
}

console.log(bstMin(root)?.value);       // 1
console.log(bstMax(root)?.value);       // 14


/* ============================================================
 *  6️⃣ DELETE — THREE CASES
 * ============================================================ */
// 🔹 Case 1: leaf            → remove it.
// 🔹 Case 2: one child       → replace node with its child.
// 🔹 Case 3: two children    → replace value with successor
//                              (min of right subtree), then delete
//                              that successor.
// 🔸 O(h) overall.

function deleteNode(
  root: BSTNode<number> | null,
  value: number,
): BSTNode<number> | null {
  if (root === null) return null;
  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Found the node to delete
    if (root.left === null) return root.right;   // also leaf
    if (root.right === null) return root.left;
    // Two children: replace with in-order successor
    const succ = bstMin(root.right);
    if (succ === null) return root;
    root.value = succ.value;
    root.right = deleteNode(root.right, succ.value);
  }
  return root;
}

// Demo: delete 3 from the tree above
root = deleteNode(root, 3);
// New structure — 4 takes 3's place (min of right subtree)
//        8
//       / \
//      4   10
//     / \    \
//    1   6    14
//       / \   /
//      ?   7 13
// (4's left remains 1, right becomes 6)

// 🔸 Print to verify
function inorder(root: BSTNode<number> | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

console.log(inorder(root));     // [1, 4, 6, 7, 8, 10, 13, 14]

// 🧠 Predecessor alternative: max of left subtree — same idea.
// ⚠️ Successor path can be O(h); in a skewed tree that's O(n).


/* ============================================================
 *  7️⃣ IN-ORDER TRAVERSAL = SORTED OUTPUT
 * ============================================================ */
// 🔹 The BST invariant makes in-order traversal return values in
//    ascending order.
// 🔸 O(n) time, O(h) stack.

function inorderIter(root: BSTNode<number> | null): number[] {
  const out: number[] = [];
  const stack: BSTNode<number>[] = [];
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

console.log(inorderIter(root));         // [1, 4, 6, 7, 8, 10, 13, 14]

// 🧠 If you find yourself doing inorder traversal + list, ask
//    whether the problem can be solved during traversal.

// 🔸 In-order successor of a node:
//    • if it has a right subtree → min(right)
//    • else → nearest ancestor where we came from the left


/* ============================================================
 *  8️⃣ FLOOR AND CEILING
 * ============================================================ */
// 🔹 Floor  : largest value ≤ target.
// 🔹 Ceiling: smallest value ≥ target.
// 🔸 Walk down the tree, remembering candidate.

function floorBST(root: BSTNode<number> | null, target: number): number | null {
  let ans: number | null = null;
  let cur = root;
  while (cur !== null) {
    if (cur.value === target) return cur.value;
    if (cur.value < target) {
      ans = cur.value;
      cur = cur.right;
    } else {
      cur = cur.left;
    }
  }
  return ans;
}

function ceilBST(root: BSTNode<number> | null, target: number): number | null {
  let ans: number | null = null;
  let cur = root;
  while (cur !== null) {
    if (cur.value === target) return cur.value;
    if (cur.value > target) {
      ans = cur.value;
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }
  return ans;
}

console.log(floorBST(root, 9));         // 8
console.log(ceilBST(root, 9));          // 10
console.log(floorBST(root, 1));         // 1
console.log(ceilBST(root, 100));        // null

// 🧠 Both are O(h) — no need to materialise the whole tree.


/* ============================================================
 *  9️⃣ K-TH SMALLEST ELEMENT
 * ============================================================ */
// 🔹 Walk in-order, stop at the k-th node.
// 🔸 O(h + k) time with early stop, O(h) space.

function kthSmallest(root: BSTNode<number> | null, k: number): number | null {
  if (k <= 0) return null;
  const stack: BSTNode<number>[] = [];
  let cur = root;
  let count = 0;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    const node = stack.pop();
    if (node === undefined) break;
    count += 1;
    if (count === k) return node.value;
    cur = node.right;
  }
  return null;
}

console.log(kthSmallest(root, 1));      // 1
console.log(kthSmallest(root, 3));      // 6
console.log(kthSmallest(root, 99));     // null

// 🔸 K-th largest = k-th smallest with reversed inorder.
function kthLargest(root: BSTNode<number> | null, k: number): number | null {
  const stack: BSTNode<number>[] = [];
  let cur = root;
  let count = 0;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.right;
    }
    const node = stack.pop();
    if (node === undefined) break;
    count += 1;
    if (count === k) return node.value;
    cur = node.left;
  }
  return null;
}

console.log(kthLargest(root, 1));       // 14

// 🧠 Early stop saves time when k is small relative to n.


/* ============================================================
 *  🔟 VALIDATE A BST
 * ============================================================ */
// 🔹 Naive check: left.value < node.value < right.value —
//    WRONG. Must verify against an interval (min, max).
// 🔸 Pass down bounds while recursing.

function isValidBST(root: BSTNode<number> | null): boolean {
  function check(
    node: BSTNode<number> | null,
    lo: number,
    hi: number,
  ): boolean {
    if (node === null) return true;
    if (!(lo < node.value && node.value < hi)) return false;
    return check(node.left, lo, node.value) && check(node.right, node.value, hi);
  }
  return check(root, -Infinity, Infinity);
}

// ✅ Valid BST
let rootOk: BSTNode<number> | null = null;
for (const v of [5, 3, 7, 1, 4, 6, 8]) rootOk = insert(rootOk, v);
console.log(isValidBST(rootOk));        // true

// ❌ Invalid: a grandchild smaller than its ancestor
const bad = new BSTNode(5);
bad.left = new BSTNode(1);
bad.right = new BSTNode(7);
bad.right.left = new BSTNode(3);        // ❌ 3 is on the RIGHT side of 5
console.log(isValidBST(bad));           // false

// 🔸 Alternative: inorder traversal must be STRICTLY increasing.
function isValidBstInorder(root: BSTNode<number> | null): boolean {
  let prev = -Infinity;
  const stack: BSTNode<number>[] = [];
  let cur = root;
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    const node = stack.pop();
    if (node === undefined) break;
    if (node.value <= prev) return false;
    prev = node.value;
    cur = node.right;
  }
  return true;
}

console.log(isValidBstInorder(bad));    // false
console.log(isValidBstInorder(rootOk)); // true

// ⚠️ The classic bug: only comparing node with its immediate
//    children. The bounds must be inherited from ALL ancestors.
// 🧠 Two solid checks: (lo, hi) interval recursion, OR strict
//    in-order monotonicity.


/* ============================================================
 *  1️⃣1️⃣ SORTED ARRAY → BALANCED BST
 * ============================================================ */
// 🔹 Pick middle as root; recurse left/right halves.
// 🔸 Produces a balanced BST of height O(log n).
// 🎯 Standard trick to fix a degenerate BST.

function sortedArrayToBST(xs: readonly number[]): BSTNode<number> | null {
  function build(lo: number, hi: number): BSTNode<number> | null {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const v = xs[mid];
    if (v === undefined) return null;
    const node = new BSTNode(v);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, xs.length - 1);
}

const xs = [1, 2, 3, 4, 5, 6, 7];
const balanced = sortedArrayToBST(xs);
console.log(inorderIter(balanced));     // [1, 2, 3, 4, 5, 6, 7]
console.log(isValidBST(balanced));      // true

// 🧠 Middle-root guarantees balance — every insert-by-sorting
//    trick uses this.

// 🔸 Related: convert a BST to a sorted list (inorder), then
//    rebuild balanced — how Red-Black / AVL restore balance.


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Duplicates: decide a policy (ignore / left / right) and
//    apply it consistently — otherwise the invariant may break.
// ⚠️ Skewed tree (sorted input) becomes O(n) chain — height = n.
//    Real BSTs need balancing (AVL / Red-Black) for guarantees.
// ⚠️ Delete with two children: MUST pick successor or
//    predecessor consistently; forgetting to actually delete
//    the successor duplicates the value.
// ⚠️ Validate: comparing only with immediate children is wrong.
//    Use bounds (lo, hi) or check inorder is strictly increasing.
// ⚠️ Floor/ceiling: initialize ans = null; return null if no
//    such value exists.
// ⚠️ Insert recursively on a deep chain → RangeError. Use
//    iterative for safety.
// ⚠️ `root === null` handling for empty tree in EVERY function.
// ⚠️ K-th smallest: early return is important; don't build the
//    full list if k is small.
// ⚠️ `-Infinity` / `Infinity` work as sentinels for numbers; for
//    other types, use a nullable bounds check:
//      check(node, lo: T | null, hi: T | null)
// ⚠️ When comparing nodes by identity vs value: LCA and delete
//    use identity where appropriate; here we mostly use value.
// ⚠️ BST needs ORDER, not hashing. Keys must support < and >.
// ⚠️ TypeScript: prefer strict comparison with `===` / `!==` for
//    equality; `<` / `>` for ordering.
// ⚠️ In a sorted input, insert order matters — building a BST by
//    inserting 1..n creates a linked list of depth n.

/* 🕒 Version notes
 * - Classes and generics in TypeScript: TS 1.0+
 * - Strict null checks: TS 2.0+
 * - Optional chaining (?.) / nullish coalescing (??): ES2020 / TS 3.7+
 * - noUncheckedIndexedAccess: TS 4.1+
 * - No built-in balanced BST in JS / TS
 * - Third-party: `sorted-btree`, `functional-red-black-tree`
 * - For sorted-array work, `Array.sort` + binary search (or
 *   `Array.prototype.findIndex` after sort) is often enough
 * - No native PriorityQueue in JS — use a heap (see file 11)
 * - `Math.min` / `Math.max` with spread limited by argument count
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation          │ Average       │ Worst (skewed)     |
 * ─────────────────────────────────────────────────────────────
 * | Search             │ O(log n)      │ O(n)               |
 * | Insert             │ O(log n)      │ O(n)               |
 * | Delete             │ O(log n)      │ O(n)               |
 * | Min / Max          │ O(log n)      │ O(n)               |
 * | Floor / Ceil       │ O(log n)      │ O(n)               |
 * | In-order traversal │ O(n)          │ O(n)               |
 * | K-th smallest      │ O(h + k)      │ O(n)               |
 * | Validate BST       │ O(n)          │ O(n)               |
 * ─────────────────────────────────────────────────────────────
 * | BST delete cases                                            │
 * ─────────────────────────────────────────────────────────────
 * | Case 1: leaf            → remove directly                    │
 * | Case 2: one child       → replace with child                 │
 * | Case 3: two children    → replace value with in-order        │
 * |                           successor, delete successor        │
 * ─────────────────────────────────────────────────────────────
 * | Classic problem              │ Technique                   |
 * ─────────────────────────────────────────────────────────────
 * | Search / insert / delete     │ Compare & recurse           |
 * | Min / max                    │ Leftmost / rightmost        |
 * | Floor / ceil                 │ Walk down, track candidate  |
 * | K-th smallest                │ In-order, early stop        |
 * | Validate BST                 │ Interval bounds (lo, hi)    |
 * | Sorted array → BST           │ Middle root recursion       |
 * | LCA on BST                   │ Walk down by comparison     |
 * | Inorder successor            │ Right subtree min, or split |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                  |
 * ─────────────────────────────────────────────────────────────
 * | Sorted input insert         │ Tree degenerates to O(n)      |
 * | Validate via children only  │ Misses ancestor bounds        |
 * | Delete two-child: forget    │ Duplicates successor value    |
 * |   to delete successor       │                               |
 * | Recursive insert deep       │ RangeError                    |
 * | Duplicate policy mismatch   │ Invariant broken              |
 * | Null root unhandled         │ TypeError in strict mode      |
 * | Building k-th via full list │ O(n) even if k=1              |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - BST requires COMPARABLE keys (< and >), not hashable.
 *  - Prefer iterative search / insert for safety on deep trees.
 *  - Delete with two children: replace with in-order SUCCESSOR
 *    (min of right subtree); then delete successor.
 *  - Validate BST with (lo, hi) interval bounds, not just
 *    parent-child comparisons.
 *  - In-order traversal gives sorted order — exploit it.
 *  - Floor/ceil: walk down, remembering the latest valid
 *    candidate in the right direction.
 *  - For k-th element, do in-order and STOP early.
 *  - Sorted array → balanced BST: pick middle as root.
 *  - For real workloads, use a self-balancing tree (AVL,
 *    Red-Black, or a third-party library).
 *  - Duplicates: choose one convention and enforce it.
 *  - Test with: empty, single-node, left-skewed, right-skewed,
 *    full-balanced, and duplicate-containing trees.
 *  - Beware V8's stack limit — iterative versions for depth >5000.
 * ============================================================ */