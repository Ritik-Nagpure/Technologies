# 09_Binary_Trees.py

# ============================================================
#  📘 BINARY TREES IN PYTHON — COMPLETE COVERAGE
#
#  A binary tree is a hierarchical structure where each node has
#  up to two children (left, right). Trees are the natural model
#  for hierarchies (filesystems, HTML DOM, expressions), for
#  ordered data (BSTs, heaps), and for recursive algorithms
#  (divide & conquer, backtracking). Mastery of tree traversals
#  is the foundation for graphs, DP on trees, and much more.
#
#  This file covers: tree terminology, node structure, all four
#  traversals (preorder, inorder, postorder, level-order),
#  iterative versions, recursive solutions to standard problems
#  (height, count, mirror, diameter, LCA), and pitfalls like
#  unbalanced recursion depth.
#
#  Sections:
#   1. Tree terminology
#   2. Node structure
#   3. Building trees from lists
#   4. Depth-first traversals (preorder, inorder, postorder)
#   5. Iterative DFS (stack-based)
#   6. Level-order traversal (BFS)
#   7. Height, size, sum of a tree
#   8. Mirror / symmetric tree
#   9. Diameter of a tree
#  10. Lowest Common Ancestor (LCA)
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ TREE TERMINOLOGY
# ============================================================
# 🔹 Root      : the top node (no parent)
# 🔹 Child     : a node directly below another
# 🔹 Parent    : the node directly above another
# 🔹 Leaf      : a node with no children
# 🔹 Subtree   : a node plus all its descendants
# 🔹 Height    : # edges on the longest path from node to leaf
# 🔹 Depth     : # edges from root to node
# 🔹 Level     : depth + 1 (root is level 1)
# 🔹 Complete  : every level full except possibly the last
# 🔹 Full      : every node has 0 or 2 children
# 🔹 Perfect   : every level full, all leaves at same depth
# 🔹 Balanced  : height is O(log n)

# 🧠 Rule: if the problem mentions hierarchy, ordering, or
#    recursion on sub-parts → think tree.


# ============================================================
#  2️⃣ NODE STRUCTURE
# ============================================================
# 🔹 Each node has a value and up to two children.

class TreeNode:
    __slots__ = ("value", "left", "right")

    def __init__(
        self,
        value: int,
        left: "TreeNode | None" = None,
        right: "TreeNode | None" = None,
    ) -> None:
        self.value = value
        self.left = left
        self.right = right

    def __repr__(self) -> str:
        return f"TreeNode({self.value})"

# 🧠 __slots__ saves memory for large trees.


# ============================================================
#  3️⃣ BUILDING TREES FROM LISTS
# ============================================================
# 🔹 Level-order list with None for missing children.
#    e.g., [1, 2, 3, None, 5] →
#            1
#           / \
#          2   3
#           \
#            5
# 🔸 Standard LeetCode input format.

from collections import deque

def build_tree(values: list[int | None]) -> TreeNode | None:
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    q: deque[TreeNode] = deque([root])
    i = 1
    while q and i < len(values):
        node = q.popleft()
        # Left child
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            q.append(node.left)
        i += 1
        # Right child
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            q.append(node.right)
        i += 1
    return root

root = build_tree([1, 2, 3, None, 5, 6, 7])
print(root.value, root.left.value, root.right.value)   # 1 2 3

# 🔸 Helper to pretty-print a tree for debugging
def display(root: TreeNode | None, level: int = 0, prefix: str = "R: ") -> None:
    if root is None:
        return
    print("  " * level + prefix + str(root.value))
    display(root.left, level + 1, "L: ")
    display(root.right, level + 1, "R: ")

display(root)
# R: 1
#   L: 2
#     R: 5
#   R: 3
#     L: 6
#     R: 7

# 🧠 build_tree is a great way to convert test data to a tree.


# ============================================================
#  4️⃣ DEPTH-FIRST TRAVERSALS
# ============================================================
# 🔹 PREORDER  : node → left → right
# 🔹 INORDER   : left → node → right   (sorted for BSTs)
# 🔹 POSTORDER : left → right → node   (children before parent)
# 🔸 All O(n) time, O(h) stack space.

def preorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return [root.value] + preorder(root.left) + preorder(root.right)

def inorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return inorder(root.left) + [root.value] + inorder(root.right)

def postorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return postorder(root.left) + postorder(root.right) + [root.value]

root = build_tree([1, 2, 3, 4, 5, 6, 7])
print("pre ", preorder(root))       # [1, 2, 4, 5, 3, 6, 7]
print("in  ", inorder(root))        # [4, 2, 5, 1, 6, 3, 7]
print("post", postorder(root))      # [4, 5, 2, 6, 7, 3, 1]

# 🧠 Mnemonic: PRE = node first; POST = node last; IN = node
#    between children.
# ⚠️ These one-liners build new lists — O(n) extra space per
#    call → O(n²) worst. For production, use a callback or an
#    accumulator list.


# ============================================================
#  5️⃣ ITERATIVE DFS (STACK-BASED)
# ============================================================
# 🔹 Avoids recursion depth limits.
# 🔸 Uses an explicit stack (list).

def preorder_iter(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    out: list[int] = []
    stack: list[TreeNode] = [root]
    while stack:
        node = stack.pop()
        out.append(node.value)
        # Push right FIRST so left is popped first
        if node.right: stack.append(node.right)
        if node.left:  stack.append(node.left)
    return out

def inorder_iter(root: TreeNode | None) -> list[int]:
    out: list[int] = []
    stack: list[TreeNode] = []
    cur = root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.value)
        cur = cur.right
    return out

def postorder_iter(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    out: list[int] = []
    stack: list[tuple[TreeNode, bool]] = [(root, False)]
    while stack:
        node, visited = stack.pop()
        if visited:
            out.append(node.value)
        else:
            stack.append((node, True))
            if node.right: stack.append((node.right, False))
            if node.left:  stack.append((node.left, False))
    return out

root = build_tree([1, 2, 3, 4, 5, 6, 7])
print(preorder_iter(root))          # [1, 2, 4, 5, 3, 6, 7]
print(inorder_iter(root))           # [4, 2, 5, 1, 6, 3, 7]
print(postorder_iter(root))         # [4, 5, 2, 6, 7, 3, 1]

# 🧠 Iterative DFS is the go-to when recursion may blow the
#    stack (tree depth > ~500 in Python).


# ============================================================
#  6️⃣ LEVEL-ORDER TRAVERSAL (BFS)
# ============================================================
# 🔹 Visit nodes level by level, left to right.
# 🔸 Uses a QUEUE.
# 🎯 Foundation for shortest path on unweighted trees.

def level_order(root: TreeNode | None) -> list[list[int]]:
    if root is None:
        return []
    result: list[list[int]] = []
    q: deque[TreeNode] = deque([root])
    while q:
        level_size = len(q)
        level: list[int] = []
        for _ in range(level_size):
            node = q.popleft()
            level.append(node.value)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result

root = build_tree([1, 2, 3, 4, 5, 6, 7])
print(level_order(root))            # [[1], [2, 3], [4, 5, 6, 7]]

# 🔸 Zig-zag level order (alternate direction each level)
def zigzag_level_order(root: TreeNode | None) -> list[list[int]]:
    if root is None:
        return []
    result: list[list[int]] = []
    q: deque[TreeNode] = deque([root])
    left_to_right = True
    while q:
        level: list[int] = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.value)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        if not left_to_right:
            level.reverse()
        result.append(level)
        left_to_right = not left_to_right
    return result

print(zigzag_level_order(root))     # [[1], [3, 2], [4, 5, 6, 7]]

# 🧠 Level-size snapshot (len(q) BEFORE inner loop) is what
#    keeps levels separate.


# ============================================================
#  7️⃣ HEIGHT, SIZE, SUM OF A TREE
# ============================================================
# 🔹 All three are one-line recursive patterns.
# 🔸 Same shape: recurse left, recurse right, combine.

def height(root: TreeNode | None) -> int:
    if root is None:
        return -1                       # edges; use 0 for nodes
    return 1 + max(height(root.left), height(root.right))

def size(root: TreeNode | None) -> int:
    if root is None:
        return 0
    return 1 + size(root.left) + size(root.right)

def tree_sum(root: TreeNode | None) -> int:
    if root is None:
        return 0
    return root.value + tree_sum(root.left) + tree_sum(root.right)

def count_leaves(root: TreeNode | None) -> int:
    if root is None:
        return 0
    if root.left is None and root.right is None:
        return 1
    return count_leaves(root.left) + count_leaves(root.right)

root = build_tree([1, 2, 3, 4, 5, 6, 7])
print(height(root))                 # 2
print(size(root))                   # 7
print(tree_sum(root))               # 28
print(count_leaves(root))           # 4

# 🧠 Template: 
#     if not root: return <base>
#     left = rec(root.left)
#     right = rec(root.right)
#     return <combine>


# ============================================================
#  8️⃣ MIRROR / SYMMETRIC TREE
# ============================================================
# 🔹 Mirror: recursively swap left and right.
# 🔸 Symmetric: tree is mirror of itself around root.

def mirror(root: TreeNode | None) -> TreeNode | None:
    if root is None:
        return None
    root.left, root.right = mirror(root.right), mirror(root.left)
    return root

def is_symmetric(root: TreeNode | None) -> bool:
    def check(a: TreeNode | None, b: TreeNode | None) -> bool:
        if a is None and b is None:
            return True
        if a is None or b is None:
            return False
        return (a.value == b.value
                and check(a.left, b.right)
                and check(a.right, b.left))
    return root is None or check(root.left, root.right)

root = build_tree([1, 2, 2, 3, 4, 4, 3])
print(is_symmetric(root))           # True

root2 = build_tree([1, 2, 2, None, 3, None, 3])
print(is_symmetric(root2))          # False

# 🧠 Symmetric check = "cross compare" (a.left vs b.right).


# ============================================================
#  9️⃣ DIAMETER OF A TREE
# ============================================================
# 🔹 Longest path (in edges) between any two nodes.
# 🔸 Compute height once, track max(left_h + right_h) at each node.
# 🎯 O(n) time — one pass with a nonlocal accumulator.

def diameter(root: TreeNode | None) -> int:
    best = 0
    def dfs(node: TreeNode | None) -> int:
        nonlocal best
        if node is None:
            return -1
        lh = dfs(node.left)
        rh = dfs(node.right)
        best = max(best, lh + rh + 2)   # +2 for the two edges
        return 1 + max(lh, rh)
    dfs(root)
    return best

root = build_tree([1, 2, 3, 4, 5])
print(diameter(root))               # 3  (path 4-2-1-3 or 5-2-1-3)

# 🧠 Pattern: "compute a value (height) AND update a global
#    answer inside the same DFS." Very common in tree problems
#    (max path sum, largest BST subtree, etc.).


# ============================================================
#  🔟 LOWEST COMMON ANCESTOR (LCA)
# ============================================================
# 🔹 Deepest node that is ancestor of both p and q.
# 🔸 Recursive: if p and q are on different sides, current is LCA.

def lca(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    if root is None or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root                     # p and q split here
    return left or right

root = build_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4])
p = root.left                       # 5
q = root.right                      # 1
print(lca(root, p, q).value)        # 3

n1 = root.left.left                 # 6
n2 = root.left.right.right          # 4
print(lca(root, n1, n2).value)      # 5

# 🧠 LCA is the parent of "split point" — where left returns one
#    and right returns the other.
# 🔸 For BSTs, LCA is even simpler (compare values).

def lca_bst(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    cur = root
    while cur:
        if p.value < cur.value and q.value < cur.value:
            cur = cur.left
        elif p.value > cur.value and q.value > cur.value:
            cur = cur.right
        else:
            return cur
    return None

# 🔸 In a general tree, LCA can be found with parent pointers +
#    a set of ancestors (walk p to root, then walk q up).


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Empty tree → root is None. Every function must handle this.
# ⚠️ Recursion depth = tree height. A skewed tree (n=10^5) blows
#    the Python stack → use iterative DFS or raise the limit.
# ⚠️ The one-line list-concat traversals are O(n²) worst case —
#    use an accumulator for production code.
# ⚠️ Preorder-iterative: push RIGHT first, then LEFT, so left is
#    popped first.
# ⚠️ Postorder-iterative: use a "visited" flag or reverse of a
#    modified preorder (root → right → left → reverse).
# ⚠️ Level-order: capture len(q) BEFORE the inner loop to keep
#    levels separate.
# ⚠️ Height: pick a definition (edges vs nodes) and stick with it.
#    Edges → 1 + max(...) with leaf = 0; or 0 with None = -1.
# ⚠️ Mirror modifies in place — copy first if you need the original.
# ⚠️ Diameter: the +2 counts the two edges above children.
#    Off-by-one is easy.
# ⚠️ Symmetric: compare a.left with b.right and a.right with
#    b.left (cross), not same side.
# ⚠️ LCA with None children: guard with `if not root`.
# ⚠️ Don't assume node identity == value — a tree can have
#    duplicate values.

# 🕒 Version notes
# - __slots__ on Node: Python 3.0+
# - PEP 604 unions (TreeNode | None): Python 3.10+
#   For 3.9 and below use Optional[TreeNode]
# - nonlocal keyword (used in diameter): Python 3.0+
# - Generator-based iterators: Python 2.2+
# - deque for BFS: Python 2.4+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Traversal    │ Order                 │ Notes                |
# ─────────────────────────────────────────────────────────────
# | Preorder     │ node → left → right   │ copy / serialize     |
# | Inorder      │ left → node → right   │ BST sorted order     |
# | Postorder    │ left → right → node   │ delete / evaluate    |
# | Level-order  │ level by level        │ BFS with deque       |
# | Zig-zag      │ alternate per level   │ BFS + reverse        |
# ─────────────────────────────────────────────────────────────
# | Problem              │ Technique                        |
# ─────────────────────────────────────────────────────────────
# | Height               │ 1 + max(left, right)             |
# | Size / sum           │ 1 + left + right                 |
# | Count leaves         │ check no children                |
# | Mirror               │ swap children recursively        |
# | Symmetric            │ cross-compare two subtrees       |
# | Diameter             │ track max(left + right) DFS      |
# | LCA (general)        │ recursive split point            |
# | LCA (BST)            │ walk down by value compare       |
# | Level-order variants │ BFS with per-level snapshot      |
# ─────────────────────────────────────────────────────────────
# | Complexity          │ Time      │ Space                     |
# ─────────────────────────────────────────────────────────────
# | Any traversal        │ O(n)     │ O(h) recursion / O(n) BFS |
# | Height/size/sum      │ O(n)     │ O(h)                      |
# | Diameter (2-pass)    │ O(n)     │ O(h)                      |
# | LCA                  │ O(n)     │ O(h)                      |
# | LCA (BST)            │ O(h)     │ O(1) iterative            |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Skewed tree recursion      │ RecursionError                 |
# | list-concat traversals     │ O(n²) for skewed               |
# | Preorder push order        │ right vs left, wrong order     |
# | Level-order missing snapshot│ Levels merge                  |
# | Height edges vs nodes      │ Off-by-one                     |
# | Diameter +2 vs +1          │ Wrong max                      |
# | Symmetric same-side check  │ Misses asymmetry               |
# | Mirror in-place            │ Original tree altered          |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Every recursive function: base case = None → return 0/[]/etc.
#  - Prefer iterative DFS when tree depth may exceed ~500.
#  - Use deque for level-order / BFS, never list.pop(0).
#  - Snapshot len(q) before inner loop for per-level processing.
#  - Preorder-iterative: push RIGHT first, then LEFT.
#  - Height: define edges vs nodes consistently.
#  - Use __slots__ on TreeNode for memory-heavy trees.
#  - Build test trees from level-order lists (LeetCode style).
#  - Draw the tree on paper for tricky pointer problems.
#  - For "compute + track max" problems, use nonlocal inside
#    a helper DFS.
#  - LCA on BSTs = walk down by comparing values, O(h), no
#    recursion needed.
#  - Always test with empty, single-node, and skewed trees.
# ============================================================