# 08_Linked_Lists.py

# ============================================================
#  📘 LINKED LISTS IN PYTHON — COMPLETE COVERAGE
#
#  A linked list is a chain of NODES where each node stores a
#  value and a reference to the next node. Unlike arrays, it
#  gives O(1) insert/delete at a known position, at the cost of
#  O(n) random access. Singly, doubly, and circular variants are
#  the standard building blocks for LRU caches, adjacency lists,
#  and interview problems.
#
#  This file covers: node structure, singly vs doubly linked
#  lists, all standard operations (insert, delete, reverse,
#  find middle, detect cycles), the classic tricks (dummy head,
#  slow/fast pointers, Floyd's cycle detection), and pitfalls
#  like dangling references and losing the head.
#
#  Sections:
#   1. What a linked list is
#   2. Node class
#   3. Singly linked list — full implementation
#   4. Doubly linked list
#   5. Reverse a linked list (iterative + recursive)
#   6. Find the middle node (slow/fast)
#   7. Detect a cycle (Floyd's algorithm)
#   8. Merge two sorted lists
#   9. Remove nth node from end
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A LINKED LIST IS
# ============================================================
# 🔹 A sequence of nodes connected by references.
# 🔸 Each node knows only its value and the next node.
# 🎯 Trades random access for cheap insertion/removal.
# 🔎 Python does not have a built-in linked list — we build it.

# ── Compare with array ───────────────────────────────────────
# | Operation              │ Array (list)  │ Linked List        |
# |------------------------|---------------|--------------------|
# | Access by index        │ O(1)          │ O(n)               |
# | Insert/delete at head  │ O(n)          │ O(1)               |
# | Insert/delete at tail  │ O(1) amort.   │ O(1) with tail ptr |
# | Search                 │ O(n)          │ O(n)               |
# | Memory per element     │ small         │ larger (pointers)  |
# ─────────────────────────────────────────────────────────────

# 🧠 Real-world use: LRU caches, adjacency lists, undo chains,
#    polynomial arithmetic, and any "cheap head insert" problem.


# ============================================================
#  2️⃣ NODE CLASS
# ============================================================
# 🔹 A node stores data + a "next" pointer.
# 🔸 Optionally a "prev" pointer for doubly linked lists.

class Node:
    __slots__ = ("value", "next", "prev")   # smaller memory

    def __init__(
        self,
        value: int,
        nxt: "Node | None" = None,
        prv: "Node | None" = None,
    ) -> None:
        self.value = value
        self.next = nxt
        self.prev = prv                     # for doubly linked lists

    def __repr__(self) -> str:
        return f"Node({self.value})"

n1 = Node(1)
n2 = Node(2)
n1.next = n2
print(n1.value, n1.next.value)              # 1 2

# 🧠 __slots__ cuts memory ~30–50% — useful for large lists.
#    Drop prev for a singly linked list.


# ============================================================
#  3️⃣ SINGLY LINKED LIST — FULL IMPLEMENTATION
# ============================================================
# 🔹 head → first node; walk via .next to the end.
# 🔸 Maintain a tail reference for O(1) append.

class SinglyLinkedList:
    def __init__(self) -> None:
        self.head: Node | None = None
        self.tail: Node | None = None
        self._size = 0

    # 🔸 Push front — O(1)
    def push_front(self, value: int) -> None:
        node = Node(value, nxt=self.head)
        self.head = node
        if self.tail is None:
            self.tail = node
        self._size += 1

    # 🔸 Push back — O(1) thanks to tail pointer
    def push_back(self, value: int) -> None:
        node = Node(value)
        if self.tail is None:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self._size += 1

    # 🔸 Pop front — O(1)
    def pop_front(self) -> int:
        if self.head is None:
            raise IndexError("pop from empty list")
        value = self.head.value
        self.head = self.head.next
        if self.head is None:
            self.tail = None
        self._size -= 1
        return value

    # 🔸 Find value — O(n)
    def find(self, value: int) -> Node | None:
        cur = self.head
        while cur is not None:
            if cur.value == value:
                return cur
            cur = cur.next
        return None

    # 🔸 Delete first occurrence — O(n)
    def remove(self, value: int) -> bool:
        prev: Node | None = None
        cur = self.head
        while cur is not None:
            if cur.value == value:
                if prev is None:
                    self.head = cur.next
                else:
                    prev.next = cur.next
                if cur is self.tail:
                    self.tail = prev
                self._size -= 1
                return True
            prev, cur = cur, cur.next
        return False

    def __len__(self) -> int:
        return self._size

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def __repr__(self) -> str:
        return " -> ".join(str(v) for v in self) + " -> None"

ll = SinglyLinkedList()
ll.push_back(1); ll.push_back(2); ll.push_back(3)
ll.push_front(0)
print(ll)                                   # 0 -> 1 -> 2 -> 3 -> None
print(len(ll))                              # 4
ll.remove(2)
print(ll)                                   # 0 -> 1 -> 3 -> None
print(ll.pop_front())                       # 0
print(ll)                                   # 1 -> 3 -> None

# 🧠 The dummy-head trick (below) avoids edge cases at head —
#    often cleaner than a special-case branch for prev is None.


# ============================================================
#  4️⃣ DOUBLY LINKED LIST
# ============================================================
# 🔹 Each node points to prev AND next.
# 🔸 Enables O(1) delete given a NODE reference (no prev walk).
# 🎯 Foundation of LRU cache (with a hashmap).

class DoublyLinkedList:
    def __init__(self) -> None:
        self.head: Node | None = None
        self.tail: Node | None = None
        self._size = 0

    def push_front(self, value: int) -> None:
        node = Node(value, nxt=self.head)
        if self.head:
            self.head.prev = node
        self.head = node
        if self.tail is None:
            self.tail = node
        self._size += 1

    def push_back(self, value: int) -> None:
        node = Node(value, prv=self.tail)
        if self.tail:
            self.tail.next = node
        self.tail = node
        if self.head is None:
            self.head = node
        self._size += 1

    def remove_node(self, node: Node) -> None:
        """Remove a node in O(1) — requires a reference."""
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        self._size -= 1

    def __len__(self) -> int:
        return self._size

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def __repr__(self) -> str:
        return " <-> ".join(str(v) for v in self) + " <-> None"

dl = DoublyLinkedList()
dl.push_back(1); dl.push_back(2); dl.push_back(3)
print(dl)                                   # 1 <-> 2 <-> 3 <-> None
mid = dl.head.next                          # node with value 2
dl.remove_node(mid)
print(dl)                                   # 1 <-> 3 <-> None

# 🧠 Doubly linked list = O(1) remove given node. That's the
#    secret behind LRU caches.


# ============================================================
#  5️⃣ REVERSE A LINKED LIST
# ============================================================
# 🔹 Rewire next pointers to point backwards.
# 🔸 Iterative: O(n) time, O(1) space.
# 🔸 Recursive: O(n) time, O(n) stack.

def reverse_iterative(head: Node | None) -> Node | None:
    prev: Node | None = None
    cur = head
    while cur is not None:
        nxt = cur.next                      # save
        cur.next = prev                     # rewire
        prev = cur                          # advance prev
        cur = nxt                           # advance cur
    return prev                             # new head

def reverse_recursive(head: Node | None) -> Node | None:
    if head is None or head.next is None:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head                   # point next back to me
    head.next = None                        # break old link
    return new_head

# Build a small list 1 -> 2 -> 3
def build(values: list[int]) -> Node | None:
    dummy = Node(0)
    cur = dummy
    for v in values:
        cur.next = Node(v)
        cur = cur.next
    return dummy.next

def to_list(head: Node | None) -> list[int]:
    out: list[int] = []
    while head:
        out.append(head.value)
        head = head.next
    return out

head = build([1, 2, 3, 4])
print(to_list(reverse_iterative(head)))     # [4, 3, 2, 1]

head = build([1, 2, 3, 4])
print(to_list(reverse_recursive(head)))     # [4, 3, 2, 1]

# ⚠️ Recursive reverse uses O(n) stack — for very long lists,
#    prefer iterative.
# 🧠 Template: prev / cur / nxt — the golden trio of list problems.


# ============================================================
#  6️⃣ FIND THE MIDDLE NODE (SLOW/FAST)
# ============================================================
# 🔹 Slow moves 1 step, fast moves 2.
# 🔸 When fast hits the end, slow is at the middle.
# 🎯 Also used to detect cycles, find k-th from end.

def middle_node(head: Node | None) -> Node | None:
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow

# Note: for even-length lists, this returns the SECOND middle.
head = build([1, 2, 3, 4, 5])
print(middle_node(head).value)              # 3

head = build([1, 2, 3, 4])
print(middle_node(head).value)              # 3  (second middle)

# 🧠 Slow/fast is a swiss-army knife — memorise it.


# ============================================================
#  7️⃣ DETECT A CYCLE (FLOYD'S ALGORITHM)
# ============================================================
# 🔹 If a cycle exists, fast will eventually catch slow.
# 🔸 O(n) time, O(1) space — no visited set needed.
# 🔎 To find the START of the cycle:
#     reset slow to head, advance both by 1 → they meet at start.

def has_cycle(head: Node | None) -> bool:
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def cycle_start(head: Node | None) -> Node | None:
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            # Reset slow to head, advance both by 1 → meet at start
            slow = head
            while slow is not fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None

# Build a cyclic list: 1 -> 2 -> 3 -> 4 -> 2 (cycle at 2)
head = build([1, 2, 3, 4])
tail = head
while tail.next:
    tail = tail.next
tail.next = head.next                       # 4 points back to 2

print(has_cycle(head))                      # True
start = cycle_start(head)
print(start.value if start else None)       # 2

# 🧠 Floyd's is the standard trick — no extra memory.
#    Alternative: store visited nodes in a set → O(n) space.


# ============================================================
#  8️⃣ MERGE TWO SORTED LISTS
# ============================================================
# 🔹 Classic: combine two sorted lists into one.
# 🔸 Dummy-head trick keeps the code clean.
# 🎯 O(n + m) time, O(1) extra space (rewires in place).

def merge_sorted(a: Node | None, b: Node | None) -> Node | None:
    dummy = Node(0)
    tail = dummy
    while a is not None and b is not None:
        if a.value <= b.value:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a if a is not None else b   # attach remainder
    return dummy.next

l1 = build([1, 3, 5])
l2 = build([2, 4, 6])
print(to_list(merge_sorted(l1, l2)))        # [1, 2, 3, 4, 5, 6]

# 🧠 Dummy-head: create a fake node, build the result on
#    `dummy.next`, return it. Removes all edge cases at head.


# ============================================================
#  9️⃣ REMOVE NTH NODE FROM END
# ============================================================
# 🔹 Two-pointer gap technique — one pass.
# 🔸 Advance fast n+1 steps, then move both until fast is None.

def remove_nth_from_end(head: Node | None, n: int) -> Node | None:
    dummy = Node(0, nxt=head)
    fast: Node | None = dummy
    slow: Node | None = dummy
    for _ in range(n + 1):
        if fast is None:
            return head                     # n larger than length
        fast = fast.next
    while fast is not None:
        fast = fast.next
        slow = slow.next
    assert slow is not None and slow.next is not None
    slow.next = slow.next.next              # unlink
    return dummy.next

head = build([1, 2, 3, 4, 5])
print(to_list(remove_nth_from_end(head, 2)))    # [1, 2, 3, 5]

head = build([1])
print(to_list(remove_nth_from_end(head, 1)))    # []

# 🧠 Dummy head + two pointers = O(n) single pass, O(1) space.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Losing the head: if you advance head without saving it, the
#    whole list is unreachable.
# ⚠️ Forgetting to update tail when popping/removing the last node.
# ⚠️ Reverse: after the loop, return prev (NOT cur — cur is None).
# ⚠️ Cycle detection: check `fast and fast.next` before moving
#    fast — otherwise AttributeError on short lists.
# ⚠️ Recursive reverse has O(n) stack — not safe for 10^5+ nodes.
# ⚠️ Remove nth: the dummy head is REQUIRED to handle n = length.
# ⚠️ Node identity vs value equality: `cur is node` != `cur.value == v`.
# ⚠️ Do NOT compare nodes with == unless you defined __eq__.
# ⚠️ Sharing nodes between lists causes aliasing bugs — copy if
#    you need two independent lists.
# ⚠️ When deleting, always keep a reference to `prev` (or use the
#    dummy head trick).
# ⚠️ In cyclic lists, any "walk to the end" loop hangs forever.
#    Detect cycles first.

# 🧠 Debugging tip: convert to list with to_list() to inspect.

# 🕒 Version notes
# - __slots__ (used for compact Node): Python 3.0+
# - PEP 604 unions (int | None): Python 3.10+ — for 3.9 and
#   below use Optional[int]
# - `yield` in __iter__ (generator): Python 2.2+
# - dataclass-based Node is possible but usually slower than
#   __slots__ for large lists
# - No built-in linked list in stdlib; use custom or 3rd-party


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation                │ Singly  │ Doubly               |
# ─────────────────────────────────────────────────────────────
# | push_front               │ O(1)    │ O(1)                 |
# | push_back (with tail)    │ O(1)    │ O(1)                 |
# | pop_front                │ O(1)    │ O(1)                 |
# | pop_back (with tail)     │ O(n)    │ O(1)                 |
# | find / search            │ O(n)    │ O(n)                 |
# | remove by value          │ O(n)    │ O(n)                 |
# | remove by NODE ref       │ O(n)    │ O(1)                 |
# | reverse (iterative)      │ O(n)/O(1)│ O(n)/O(1)           |
# | index access             │ O(n)    │ O(n)                 |
# ─────────────────────────────────────────────────────────────
# | Classic problem             │ Technique                |
# ─────────────────────────────────────────────────────────────
# | Reverse list                │ prev / cur / nxt         |
# | Find middle                 │ slow/fast pointers       |
# | Detect cycle                │ Floyd's tortoise/hare    |
# | Cycle start                 │ Reset slow + advance 1   |
# | Merge two sorted lists      │ Dummy head + compare     |
# | Remove nth from end         │ Two-pointer gap          |
# | Palindrome list             │ Middle + reverse half    |
# | LRU cache                   │ Hashmap + doubly LL      |
# | Intersection of two lists   │ Length diff + walk       |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites              |
# ─────────────────────────────────────────────────────────────
# | Losing head                 │ List unreachable          |
# | Not updating tail           │ Push_back silently broken |
# | Return cur instead of prev  │ Reverse returns None      |
# | fast.next without fast      │ AttributeError            |
# | Recursive reverse deep      │ RecursionError            |
# | No dummy head in remove-nth │ Fails on n = length       |
# | Node == value confusion     │ Wrong node matched        |
# | Shared nodes across lists   │ Aliasing bugs             |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use the DUMMY HEAD trick to avoid head-edge branches.
#  - Memorise prev / cur / nxt for reverse.
#  - Slow/fast pointers for middle, cycle, kth from end.
#  - Floyd's algorithm detects cycles in O(n) time, O(1) space.
#  - Use __slots__ on Node for compact memory.
#  - Keep a tail reference for O(1) push_back.
#  - Doubly linked list gives O(1) remove given a node.
#  - Prefer iterative over recursive for long lists.
#  - Convert to a list for debugging — to_list(head).
#  - Watch out for shared references when two lists use the
#    same node objects.
#  - Draw the list on paper for tricky pointer rewires.
# ============================================================