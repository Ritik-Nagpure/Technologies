# 10_Binary_Search_Trees.py

# ============================================================
#  📘 BINARY SEARCH TREES IN PYTHON — COMPLETE COVERAGE
#
#  A Binary Search Tree (BST) is a binary tree where for every
#  node, all values in the LEFT subtree are smaller and all
#  values in the RIGHT subtree are larger. This ordering gives
#  O(log n) search / insert / delete on AVERAGE (O(n) worst
#  when unbalanced). BSTs are the mental model behind balanced
#  trees (AVL, Red-Black) and ordered maps.
#
#  This file covers: BST property, search, insert, delete (all
#  three cases), min/max, floor/ceil, k-th smallest, validating
#  a BST, sorted array → BST, and why unbalanced trees degrade
#  to O(n).
#
#  Sections:
#   1. The BST property
#   2. Node structure
#   3. Search — O(h)
#   4. Insert — O(h)
#   5. Min and max
#   6. Delete — three cases
#   7. In-order traversal = sorted output
#   8. Floor and ceiling
#   9. K-th smallest element
#  10. Validate a BST
#  11. Sorted array → balanced BST
#  12. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ THE BST PROPERTY
# ============================================================
# 🔹 For every node N:
#     • all keys in left subtree  < N.value
#     • all keys in right subtree > N.value
# 🔸 Strict inequality (no duplicates) is the common convention.
# 🎯 This gives ordered traversal + fast search on balanced trees.
#
#   Height h → search/insert/delete O(h).
#   Balanced → h = O(log n).
#   Skewed   → h = O(n) — the tree degenerates to a list.

# 🧠 BST = binary tree + ordering invariant. If you forget the
#    invariant, it's just a binary tree.

# ── Complexity summary ───────────────────────────────────────
# | Operation | Average      | Worst (skewed)  |
# |-----------|--------------|-----------------|
# | Search    | O(log n)     | O(n)            |
# | Insert    | O(log n)     | O(n)            |
# | Delete    | O(log n)     | O(n)            |
# | Min/Max   | O(log n)     | O(n)            |
# | Inorder   | O(n)         | O(n)            |
# | Space     | O(n)         | O(n)            |


# ============================================================
#  2️⃣ NODE STRUCTURE
# ============================================================
# 🔹 Same shape as a binary tree node.

class BSTNode:
    __slots__ = ("value", "left", "right")

    def __init__(self, value: int) -> None:
        self.value = value
        self.left: "BSTNode | None" = None
        self.right: "BSTNode | None" = None

    def __repr__(self) -> str:
        return f"BSTNode({self.value})"


# ============================================================
#  3️⃣ SEARCH — O(h)
# ============================================================
# 🔹 At each node: go left if target < value, right if target > value.
# 🔸 Iterative version avoids recursion depth issues.

def search(root: BSTNode | None, target: int) -> BSTNode | None:
    cur = root
    while cur is not None:
        if target == cur.value:
            return cur
        cur = cur.left if target < cur.value else cur.right
    return None

# ✅ Also common recursively
def search_rec(root: BSTNode | None, target: int) -> BSTNode | None:
    if root is None or root.value == target:
        return root
    if target < root.value:
        return search_rec(root.left, target)
    return search_rec(root.right, target)


# ============================================================
#  4️⃣ INSERT — O(h)
# ============================================================
# 🔹 Walk down like search; attach as a new leaf where you
#    "fall off".
# 🔸 Duplicates: decided by policy — usually ignored or placed
#    on one side consistently.

def insert(root: BSTNode | None, value: int) -> BSTNode:
    if root is None:
        return BSTNode(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    # else: duplicate — ignore
    return root

# ✅ Iterative insert (avoids recursion)
def insert_iter(root: BSTNode | None, value: int) -> BSTNode:
    node = BSTNode(value)
    if root is None:
        return node
    cur = root
    while True:
        if value < cur.value:
            if cur.left is None:
                cur.left = node
                return root
            cur = cur.left
        elif value > cur.value:
            if cur.right is None:
                cur.right = node
                return root
            cur = cur.right
        else:
            return root     # duplicate — do nothing

# Build a tree
root: BSTNode | None = None
for v in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    root = insert(root, v)

#        8
#       / \
#      3   10
#     / \    \
#    1   6    14
#       / \   /
#      4   7 13


# ============================================================
#  5️⃣ MIN AND MAX
# ============================================================
# 🔹 Min = leftmost node.
# 🔹 Max = rightmost node.
# 🔸 Both O(h).

def bst_min(root: BSTNode | None) -> BSTNode | None:
    if root is None:
        return None
    while root.left is not None:
        root = root.left
    return root

def bst_max(root: BSTNode | None) -> BSTNode | None:
    if root is None:
        return None
    while root.right is not None:
        root = root.right
    return root

print(bst_min(root).value)          # 1
print(bst_max(root).value)          # 14


# ============================================================
#  6️⃣ DELETE — THREE CASES
# ============================================================
# 🔹 Case 1: leaf            → remove it.
# 🔹 Case 2: one child       → replace node with its child.
# 🔹 Case 3: two children    → replace value with successor
#                              (min of right subtree), then delete
#                              that successor.
# 🔸 O(h) overall.

def delete(root: BSTNode | None, value: int) -> BSTNode | None:
    if root is None:
        return None
    if value < root.value:
        root.left = delete(root.left, value)
    elif value > root.value:
        root.right = delete(root.right, value)
    else:
        # Found the node to delete
        if root.left is None:
            return root.right           # also handles leaf
        if root.right is None:
            return root.left
        # Two children: replace with in-order successor
        succ = bst_min(root.right)
        assert succ is not None
        root.value = succ.value
        root.right = delete(root.right, succ.value)
    return root

# Demo: delete 3 from the tree above
root = delete(root, 3)
# New structure — 4 takes 3's place (min of right subtree)
#        8
#       / \
#      4   10
#     / \    \
#    1   6    14
#       / \   /
#      4* 7 13
# Wait — 3's left child was 1, right child was 6.
# Successor = min(6,4,7) = 4 → root.value becomes 4 and 4 is removed
# from the right subtree, leaving 6 with left child = None.

# 🔸 Print to verify
def inorder(root: BSTNode | None) -> list[int]:
    if root is None:
        return []
    return inorder(root.left) + [root.value] + inorder(root.right)

print(inorder(root))                # [1, 4, 6, 7, 8, 10, 13, 14]

# 🧠 Predecessor alternative: max of left subtree — same idea.
# ⚠️ Successor path can be O(h); in a skewed tree that's O(n).


# ============================================================
#  7️⃣ IN-ORDER TRAVERSAL = SORTED OUTPUT
# ============================================================
# 🔹 The BST invariant makes in-order traversal return values in
#    ascending order.
# 🔸 O(n) time, O(h) stack.

def inorder_iter(root: BSTNode | None) -> list[int]:
    out: list[int] = []
    stack: list[BSTNode] = []
    cur = root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.value)
        cur = cur.right
    return out

print(inorder_iter(root))           # [1, 4, 6, 7, 8, 10, 13, 14]

# 🧠 If you find yourself doing inorder traversal + list, ask
#    whether the problem can be solved during traversal.

# 🔸 In-order successor of a node:
#    • if it has a right subtree → min(right)
#    • else → nearest ancestor where we came from the left


# ============================================================
#  8️⃣ FLOOR AND CEILING
# ============================================================
# 🔹 Floor  : largest value ≤ target.
# 🔹 Ceiling: smallest value ≥ target.
# 🔸 Walk down the tree, remembering candidate.

def floor_bst(root: BSTNode | None, target: int) -> int | None:
    ans: int | None = None
    cur = root
    while cur:
        if cur.value == target:
            return cur.value
        if cur.value < target:
            ans = cur.value
            cur = cur.right
        else:
            cur = cur.left
    return ans

def ceil_bst(root: BSTNode | None, target: int) -> int | None:
    ans: int | None = None
    cur = root
    while cur:
        if cur.value == target:
            return cur.value
        if cur.value > target:
            ans = cur.value
            cur = cur.left
        else:
            cur = cur.right
    return ans

print(floor_bst(root, 9))           # 8
print(ceil_bst(root, 9))            # 10
print(floor_bst(root, 1))           # 1
print(ceil_bst(root, 100))          # None

# 🧠 Both are O(h) — no need to materialise the whole tree.


# ============================================================
#  9️⃣ K-TH SMALLEST ELEMENT
# ============================================================
# 🔹 Walk in-order, stop at the k-th node.
# 🔸 O(h + k) time with early stop, O(h) space.

def kth_smallest(root: BSTNode | None, k: int) -> int | None:
    if k <= 0:
        return None
    stack: list[BSTNode] = []
    cur = root
    count = 0
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        count += 1
        if count == k:
            return cur.value
        cur = cur.right
    return None

print(kth_smallest(root, 1))        # 1
print(kth_smallest(root, 3))        # 6
print(kth_smallest(root, 99))       # None

# 🔸 K-th largest = k-th smallest with reversed inorder (or n-k+1).
def kth_largest(root: BSTNode | None, k: int) -> int | None:
    stack: list[BSTNode] = []
    cur = root
    count = 0
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.right
        cur = stack.pop()
        count += 1
        if count == k:
            return cur.value
        cur = cur.left
    return None

print(kth_largest(root, 1))         # 14

# 🧠 Early stop saves time when k is small relative to n.


# ============================================================
#  🔟 VALIDATE A BST
# ============================================================
# 🔹 Naive check: left.value < node.value < right.value —
#    WRONG. Must verify against an interval (min, max).
# 🔸 Pass down bounds while recursing.

def is_valid_bst(root: BSTNode | None) -> bool:
    def check(node: BSTNode | None, lo: float, hi: float) -> bool:
        if node is None:
            return True
        if not (lo < node.value < hi):
            return False
        return (check(node.left, lo, node.value) and
                check(node.right, node.value, hi))
    return check(root, float("-inf"), float("inf"))

# ✅ Valid BST
root_ok: BSTNode | None = None
for v in [5, 3, 7, 1, 4, 6, 8]:
    root_ok = insert(root_ok, v)
print(is_valid_bst(root_ok))        # True

# ❌ Invalid: a right grandchild smaller than its ancestor
#        5
#       / \
#      3   7
#       \
#        6     ← 6 is < 7 but is in the right subtree of 5? Ok.
# Wait — 6 > 5 but comes from left of 7, so it's valid for 7.
# Let's build an invalid tree manually:

bad = BSTNode(5)
bad.left  = BSTNode(1)
bad.right = BSTNode(7)
bad.right.left = BSTNode(3)         # ❌ 3 is on the RIGHT side of 5
print(is_valid_bst(bad))            # False

# 🔸 Alternative: inorder traversal must be STRICTLY increasing.
def is_valid_bst_inorder(root: BSTNode | None) -> bool:
    prev = float("-inf")
    stack: list[BSTNode] = []
    cur = root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        if cur.value <= prev:
            return False
        prev = cur.value
        cur = cur.right
    return True

print(is_valid_bst_inorder(bad))    # False
print(is_valid_bst_inorder(root_ok))# True

# ⚠️ The classic bug: only comparing node with its immediate
#    children. The bounds must be inherited from ALL ancestors.
# 🧠 Two solid checks: (lo, hi) interval recursion, OR strict
#    in-order monotonicity.


# ============================================================
#  1️⃣1️⃣ SORTED ARRAY → BALANCED BST
# ============================================================
# 🔹 Pick middle as root; recurse left/right halves.
# 🔸 Produces a balanced BST of height O(log n).
# 🎯 Standard trick to fix a degenerate BST.

def sorted_array_to_bst(xs: list[int]) -> BSTNode | None:
    def build(lo: int, hi: int) -> BSTNode | None:
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        node = BSTNode(xs[mid])
        node.left = build(lo, mid - 1)
        node.right = build(mid + 1, hi)
        return node
    return build(0, len(xs) - 1)

xs = [1, 2, 3, 4, 5, 6, 7]
balanced = sorted_array_to_bst(xs)
print(inorder_iter(balanced))       # [1, 2, 3, 4, 5, 6, 7]
print(is_valid_bst(balanced))       # True

# 🧠 Middle-root guarantees balance — every insert-by-sorting
#    trick uses this.

# 🔸 Related: convert a BST to a sorted list (inorder), then
#    rebuild balanced — how Red-Black / AVL restore balance.


# ============================================================
#  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Duplicates: decide a policy (ignore / left / right) and
#    apply it consistently — otherwise the invariant may break.
# ⚠️ Skewed tree (sorted input) becomes O(n) chain — height = n.
#    Real BSTs need balancing (AVL / Red-Black) for guarantees.
# ⚠️ Delete with two children: MUST pick successor or
#    predecessor consistently; forgetting to actually delete
#    the successor duplicates the value.
# ⚠️ Validate: comparing only with immediate children is wrong.
#    Use bounds (lo, hi) or check inorder is strictly increasing.
# ⚠️ Floor/ceiling: initialize ans = None; return None if no
#    such value exists.
# ⚠️ Insert recursively on a deep chain → RecursionError. Use
#    iterative for safety.
# ⚠️ `root is None` handling for empty tree in EVERY function.
# ⚠️ K-th smallest: early return is important; don't build the
#    full list if k is small.
# ⚠️ `float("-inf")` works as a sentinel but if keys can be
#    floats/ints at extremes, use None-based bounds instead:
#      check(node, lo: int | None, hi: int | None)
# ⚠️ When comparing nodes by identity vs value: LCA and delete
#    use identity where appropriate; but here we mostly use value.
# ⚠️ BST on hashables vs comparables: BST needs ORDER, not
#    hashing. Keys must support `<` and `>`.

# 🕒 Version notes
# - __slots__ on Node: Python 3.0+
# - PEP 604 unions (BSTNode | None): Python 3.10+
#   For 3.9 and below, use Optional[BSTNode]
# - No built-in balanced BST in stdlib — use `sortedcontainers`
#   (3rd-party) if you need one, or `bisect` on a list for
#   simple sorted-array use cases
# - `bisect.insort` gives O(log n) find + O(n) insert
# - `heapq` is not a BST — it's a heap (see file 11)


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation          │ Average       │ Worst (skewed)     |
# ─────────────────────────────────────────────────────────────
# | Search             │ O(log n)      │ O(n)               |
# | Insert             │ O(log n)      │ O(n)               |
# | Delete             │ O(log n)      │ O(n)               |
# | Min / Max          │ O(log n)      │ O(n)               |
# | Floor / Ceil       │ O(log n)      │ O(n)               |
# | In-order traversal │ O(n)          │ O(n)               |
# | K-th smallest      │ O(h + k)      │ O(n)               |
# | Validate BST       │ O(n)          │ O(n)               |
# ─────────────────────────────────────────────────────────────
# | BST delete cases                                            │
# ─────────────────────────────────────────────────────────────
# | Case 1: leaf            → remove directly                    │
# | Case 2: one child       → replace with child                 │
# | Case 3: two children    → replace value with in-order        │
# |                           successor, delete successor        │
# ─────────────────────────────────────────────────────────────
# | Classic problem              │ Technique                   |
# ─────────────────────────────────────────────────────────────
# | Search / insert / delete     │ Compare & recurse           |
# | Min / max                    │ Leftmost / rightmost        |
# | Floor / ceil                 │ Walk down, track candidate  |
# | K-th smallest                │ In-order, early stop        |
# | Validate BST                 │ Interval bounds (lo, hi)    |
# | Sorted array → BST           │ Middle root recursion       |
# | LCA on BST                   │ Walk down by comparison     |
# | Inorder successor            │ Right subtree min, or split |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                  |
# ─────────────────────────────────────────────────────────────
# | Sorted input insert         │ Tree degenerates to O(n)      |
# | Validate via children only  │ Misses ancestor bounds        |
# | Delete two-child: forgetting│ Duplicates successor value    |
# |   to delete successor       │                               |
# | Recursive insert deep       │ RecursionError                |
# | Duplicate policy mismatch   │ Invariant broken              |
# | None root unhandled         │ AttributeError                |
# | Building k-th via full list │ O(n) even if k=1              |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - BST requires COMPARABLE keys (`<` and `>`), not hashable.
#  - Prefer iterative search / insert for safety on deep trees.
#  - Delete with two children: replace with in-order SUCCESSOR
#    (min of right subtree); then delete successor.
#  - Validate BST with (lo, hi) interval bounds, not just
#    parent-child comparisons.
#  - In-order traversal gives sorted order — exploit it.
#  - Floor/ceil: walk down, remembering the latest valid
#    candidate in the right direction.
#  - For k-th element, do in-order and STOP early.
#  - Sorted array → balanced BST: pick middle as root.
#  - For real workloads, use a self-balancing tree (AVL,
#    Red-Black, or `sortedcontainers.SortedList`).
#  - Duplicates: choose one convention and enforce it.
#  - Test with empty, single-node, left-skewed, right-skewed,
#    and full-balanced trees.
# ============================================================