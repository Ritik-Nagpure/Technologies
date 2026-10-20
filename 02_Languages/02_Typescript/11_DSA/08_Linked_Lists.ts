// 08_Linked_Lists.ts

/* ============================================================
 *  📘 LINKED LISTS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A linked list is a chain of NODES where each node stores a
 *  value and a reference to the next node. Unlike arrays, it
 *  gives O(1) insert/delete at a known position, at the cost of
 *  O(n) random access. Singly, doubly, and circular variants
 *  are the standard building blocks for LRU caches, adjacency
 *  lists, and interview problems.
 *
 *  This file covers: node structure, singly vs doubly linked
 *  lists, all standard operations (insert, delete, reverse,
 *  find middle, detect cycles), the classic tricks (dummy head,
 *  slow/fast pointers, Floyd's cycle detection), and pitfalls
 *  like dangling references and losing the head.
 *
 *  Sections:
 *   1. What a linked list is
 *   2. Node class
 *   3. Singly linked list — full implementation
 *   4. Doubly linked list
 *   5. Reverse a linked list (iterative + recursive)
 *   6. Find the middle node (slow/fast)
 *   7. Detect a cycle (Floyd's algorithm)
 *   8. Merge two sorted lists
 *   9. Remove nth node from end
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A LINKED LIST IS
 * ============================================================ */
// 🔹 A sequence of nodes connected by references.
// 🔸 Each node knows only its value and the next node.
// 🎯 Trades random access for cheap insertion/removal.
// 🔎 JavaScript has no built-in linked list — we build it.

// ── Compare with array ───────────────────────────────────────
// | Operation              │ Array         │ Linked List        |
// |------------------------|---------------|--------------------|
// | Access by index        │ O(1)          │ O(n)               |
// | Insert/delete at head  │ O(n)          │ O(1)               |
// | Insert/delete at tail  │ O(1) amort.   │ O(1) with tail ptr |
// | Search                 │ O(n)          │ O(n)               |
// | Memory per element     │ small         │ larger (pointers)  |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Real-world use: LRU caches, adjacency lists, undo chains,
//    polynomial arithmetic, and any "cheap head insert" problem.


/* ============================================================
 *  2️⃣ NODE CLASS
 * ============================================================ */
// 🔹 A node stores data + a "next" pointer.
// 🔸 Optionally a "prev" pointer for doubly linked lists.

class ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;

  constructor(
    value: T,
    next: ListNode<T> | null = null,
    prev: ListNode<T> | null = null,
  ) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

const n1 = new ListNode(1);
const n2 = new ListNode(2);
n1.next = n2;
console.log(n1.value, n1.next.value);       // 1 2

// 🧠 JavaScript object shapes stay fast when you don't add/remove
//    properties dynamically. Sticking to the constructor keeps
//    the hidden class stable.
// 🔸 For massive lists, consider typed arrays + index-based
//    linked lists to avoid pointer chasing cost.

// 🔸 Helper: build a list from an array
function buildList<T>(values: readonly T[]): ListNode<T> | null {
  const dummy = new ListNode<T>(undefined as unknown as T);
  let cur: ListNode<T> = dummy;
  for (const v of values) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 🔸 Helper: convert list to array
function toArray<T>(head: ListNode<T> | null): T[] {
  const out: T[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}


/* ============================================================
 *  3️⃣ SINGLY LINKED LIST — FULL IMPLEMENTATION
 * ============================================================ */
// 🔹 head → first node; walk via .next to the end.
// 🔸 Maintain a tail reference for O(1) append.

class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  private count = 0;

  pushFront(value: T): void {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.count += 1;
  }

  pushBack(value: T): void {
    const node = new ListNode(value);
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.count += 1;
  }

  popFront(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    this.count -= 1;
    return value;
  }

  find(value: T): ListNode<T> | null {
    let cur = this.head;
    while (cur !== null) {
      if (cur.value === value) return cur;
      cur = cur.next;
    }
    return null;
  }

  remove(value: T): boolean {
    let prev: ListNode<T> | null = null;
    let cur = this.head;
    while (cur !== null) {
      if (cur.value === value) {
        if (prev === null) this.head = cur.next;
        else prev.next = cur.next;
        if (cur === this.tail) this.tail = prev;
        this.count -= 1;
        return true;
      }
      prev = cur;
      cur = cur.next;
    }
    return false;
  }

  get size(): number {
    return this.count;
  }

  *[Symbol.iterator](): Iterator<T> {
    let cur = this.head;
    while (cur !== null) {
      yield cur.value;
      cur = cur.next;
    }
  }

  toString(): string {
    return [...this].join(" -> ") + " -> null";
  }
}

const ll = new SinglyLinkedList<number>();
ll.pushBack(1);
ll.pushBack(2);
ll.pushBack(3);
ll.pushFront(0);
console.log(ll.toString());             // "0 -> 1 -> 2 -> 3 -> null"
console.log(ll.size);                   // 4
ll.remove(2);
console.log(ll.toString());             // "0 -> 1 -> 3 -> null"
console.log(ll.popFront());             // 0
console.log(ll.toString());             // "1 -> 3 -> null"

// 🧠 The dummy-head trick (below) avoids edge cases at head —
//    often cleaner than a special-case branch for prev is null.


/* ============================================================
 *  4️⃣ DOUBLY LINKED LIST
 * ============================================================ */
// 🔹 Each node points to prev AND next.
// 🔸 Enables O(1) delete given a NODE reference (no prev walk).
// 🎯 Foundation of LRU cache (with a hashmap).

class DoublyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  private count = 0;

  pushFront(value: T): void {
    const node = new ListNode(value, this.head);
    if (this.head) this.head.prev = node;
    this.head = node;
    if (this.tail === null) this.tail = node;
    this.count += 1;
  }

  pushBack(value: T): void {
    const node = new ListNode(value, null, this.tail);
    if (this.tail) this.tail.next = node;
    this.tail = node;
    if (this.head === null) this.head = node;
    this.count += 1;
  }

  removeNode(node: ListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;

    this.count -= 1;
  }

  get size(): number {
    return this.count;
  }

  *[Symbol.iterator](): Iterator<T> {
    let cur = this.head;
    while (cur !== null) {
      yield cur.value;
      cur = cur.next;
    }
  }

  toString(): string {
    return [...this].join(" <-> ") + " <-> null";
  }
}

const dl = new DoublyLinkedList<number>();
dl.pushBack(1);
dl.pushBack(2);
dl.pushBack(3);
console.log(dl.toString());             // "1 <-> 2 <-> 3 <-> null"
const mid = dl.head?.next ?? null;
if (mid) dl.removeNode(mid);
console.log(dl.toString());             // "1 <-> 3 <-> null"

// 🧠 Doubly linked list = O(1) remove given node. That's the
//    secret behind LRU caches.


/* ============================================================
 *  5️⃣ REVERSE A LINKED LIST
 * ============================================================ */
// 🔹 Rewire next pointers to point backwards.
// 🔸 Iterative: O(n) time, O(1) space.
// 🔸 Recursive: O(n) time, O(n) stack.

function reverseIterative<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;               // save
    cur.next = prev;                    // rewire
    prev = cur;                         // advance prev
    cur = nxt;                          // advance cur
  }
  return prev;                          // new head
}

function reverseRecursive<T>(head: ListNode<T> | null): ListNode<T> | null {
  if (head === null || head.next === null) return head;
  const newHead = reverseRecursive(head.next);
  head.next.next = head;                // point next back to me
  head.next = null;                     // break old link
  return newHead;
}

let h = buildList([1, 2, 3, 4]);
console.log(toArray(reverseIterative(h)));  // [4, 3, 2, 1]

h = buildList([1, 2, 3, 4]);
console.log(toArray(reverseRecursive(h)));  // [4, 3, 2, 1]

// ⚠️ Recursive reverse uses O(n) stack — for very long lists,
//    prefer iterative.
// 🧠 Template: prev / cur / nxt — the golden trio of list problems.


/* ============================================================
 *  6️⃣ FIND THE MIDDLE NODE (SLOW/FAST)
 * ============================================================ */
// 🔹 Slow moves 1 step, fast moves 2.
// 🔸 When fast hits the end, slow is at the middle.
// 🎯 Also used to detect cycles, find k-th from end.

function middleNode<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

let m = buildList([1, 2, 3, 4, 5]);
console.log(middleNode(m)?.value);      // 3

m = buildList([1, 2, 3, 4]);
console.log(middleNode(m)?.value);      // 3  (second middle)

// 🧠 Slow/fast is a swiss-army knife — memorise it.


/* ============================================================
 *  7️⃣ DETECT A CYCLE (FLOYD'S ALGORITHM)
 * ============================================================ */
// 🔹 If a cycle exists, fast will eventually catch slow.
// 🔸 O(n) time, O(1) space — no visited set needed.
// 🔎 To find the START of the cycle:
//     reset slow to head, advance both by 1 → they meet at start.

function hasCycle<T>(head: ListNode<T> | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function cycleStart<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) {
        slow = slow!.next;
        fast = fast!.next;
      }
      return slow;
    }
  }
  return null;
}

// Build a cyclic list: 1 -> 2 -> 3 -> 4 -> 2 (cycle at 2)
const cyclicHead = buildList([1, 2, 3, 4]);
let tail = cyclicHead;
while (tail && tail.next) tail = tail.next;
if (tail && cyclicHead) tail.next = cyclicHead.next;

console.log(hasCycle(cyclicHead));      // true
const start = cycleStart(cyclicHead);
console.log(start?.value);              // 2

// 🧠 Floyd's is the standard trick — no extra memory.
//    Alternative: store visited nodes in a Set → O(n) space.


/* ============================================================
 *  8️⃣ MERGE TWO SORTED LISTS
 * ============================================================ */
// 🔹 Classic: combine two sorted lists into one.
// 🔸 Dummy-head trick keeps the code clean.
// 🎯 O(n + m) time, O(1) extra space (rewires in place).

function mergeSorted<T>(
  a: ListNode<T> | null,
  b: ListNode<T> | null,
  compare: (x: T, y: T) => number = (x, y) => (x < y ? -1 : x > y ? 1 : 0),
): ListNode<T> | null {
  const dummy = new ListNode<T>(undefined as unknown as T);
  let tail: ListNode<T> = dummy;
  let pa = a;
  let pb = b;
  while (pa !== null && pb !== null) {
    if (compare(pa.value, pb.value) <= 0) {
      tail.next = pa;
      pa = pa.next;
    } else {
      tail.next = pb;
      pb = pb.next;
    }
    tail = tail.next;
  }
  tail.next = pa ?? pb;
  return dummy.next;
}

const l1 = buildList([1, 3, 5]);
const l2 = buildList([2, 4, 6]);
console.log(toArray(mergeSorted(l1, l2)));  // [1, 2, 3, 4, 5, 6]

// 🧠 Dummy-head: create a fake node, build the result on
//    dummy.next, return it. Removes all edge cases at head.


/* ============================================================
 *  9️⃣ REMOVE NTH NODE FROM END
 * ============================================================ */
// 🔹 Two-pointer gap technique — one pass.
// 🔸 Advance fast n+1 steps, then move both until fast is null.

function removeNthFromEnd<T>(
  head: ListNode<T> | null,
  n: number,
): ListNode<T> | null {
  const dummy = new ListNode<T>(undefined as unknown as T, head);
  let fast: ListNode<T> | null = dummy;
  let slow: ListNode<T> | null = dummy;
  for (let i = 0; i < n + 1; i++) {
    if (fast === null) return head;     // n larger than length
    fast = fast.next;
  }
  while (fast !== null) {
    fast = fast.next;
    slow = slow!.next;
  }
  if (slow !== null && slow.next !== null) {
    slow.next = slow.next.next;
  }
  return dummy.next;
}

let rn = buildList([1, 2, 3, 4, 5]);
console.log(toArray(removeNthFromEnd(rn, 2)));   // [1, 2, 3, 5]

rn = buildList([1]);
console.log(toArray(removeNthFromEnd(rn, 1)));   // []

// 🧠 Dummy head + two pointers = O(n) single pass, O(1) space.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Losing the head: if you advance head without saving it, the
//    whole list is unreachable.
// ⚠️ Forgetting to update tail when popping/removing the last
//    node.
// ⚠️ Reverse: after the loop, return prev (NOT cur — cur is null).
// ⚠️ Cycle detection: check `fast !== null && fast.next !== null`
//    before advancing fast.
// ⚠️ Recursive reverse has O(n) stack — not safe for 10^5+ nodes.
// ⚠️ Remove nth: the dummy head is REQUIRED to handle n = length.
// ⚠️ Node identity vs value equality: `cur === node` !== `cur.value === v`.
//    Use strict equality on the node reference.
// ⚠️ Don't compare nodes with === unless you mean reference equality.
// ⚠️ Sharing nodes between lists causes aliasing bugs — copy if
//    you need two independent lists.
// ⚠️ When deleting, always keep a reference to `prev` (or use the
//    dummy head trick).
// ⚠️ In cyclic lists, any "walk to the end" loop hangs forever.
//    Detect cycles first.
// ⚠️ TypeScript strict null checks: use `!` only when you have
//    PROVEN non-null via a guard; otherwise it silences real bugs.
// ⚠️ Recursion in TS/JS hits V8 stack limit around ~10k — plan
//    iterative for large lists.

// 🧠 Debugging tip: convert to array with toArray() to inspect.

/* 🕒 Version notes
 * - No built-in linked list in JavaScript / TypeScript
 * - Generator methods (`*[Symbol.iterator]`) let you for...of: ES2015
 * - Class fields (public/private/#priv): ES2022 (private #)
 * - TypeScript generics: TS 1.0+
 * - Strict null checks: TS 2.0+
 * - noUncheckedIndexedAccess: TS 4.1+
 * - Optional chaining / nullish coalescing: ES2020
 * - Symbol.iterator: ES2015
 * - WeakRef / FinalizationRegistry (advanced list caches):
 *   ES2021, Node 14+
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation                │ Singly  │ Doubly               |
 * ─────────────────────────────────────────────────────────────
 * | push_front               │ O(1)    │ O(1)                 |
 * | push_back (with tail)    │ O(1)    │ O(1)                 |
 * | pop_front                │ O(1)    │ O(1)                 |
 * | pop_back (with tail)     │ O(n)    │ O(1)                 |
 * | find / search            │ O(n)    │ O(n)                 |
 * | remove by value          │ O(n)    │ O(n)                 |
 * | remove by NODE ref       │ O(n)    │ O(1)                 |
 * | reverse (iterative)      │ O(n)/O(1)│ O(n)/O(1)           |
 * | index access             │ O(n)    │ O(n)                 |
 * ─────────────────────────────────────────────────────────────
 * | Classic problem             │ Technique                |
 * ─────────────────────────────────────────────────────────────
 * | Reverse list                │ prev / cur / nxt         |
 * | Find middle                 │ slow/fast pointers       |
 * | Detect cycle                │ Floyd's tortoise/hare    |
 * | Cycle start                 │ Reset slow + advance 1   |
 * | Merge two sorted lists      │ Dummy head + compare     |
 * | Remove nth from end         │ Two-pointer gap          |
 * | Palindrome list             │ Middle + reverse half    |
 * | LRU cache                   │ Hashmap + doubly LL      |
 * | Intersection of two lists   │ Length diff + walk       |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites              |
 * ─────────────────────────────────────────────────────────────
 * | Losing head                 │ List unreachable          |
 * | Not updating tail           │ Push_back silently broken |
 * | Return cur instead of prev  │ Reverse returns null      |
 * | fast.next without fast      │ TypeError                 |
 * | Recursive reverse deep      │ RangeError (stack)        |
 * | No dummy head in remove-nth │ Fails on n = length       |
 * | Node === value confusion    │ Wrong node matched        |
 * | Shared nodes across lists   │ Aliasing bugs             |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use the DUMMY HEAD trick to avoid head-edge branches.
 *  - Memorise prev / cur / nxt for reverse.
 *  - Slow/fast pointers for middle, cycle, kth from end.
 *  - Floyd's algorithm detects cycles in O(n) time, O(1) space.
 *  - Keep a tail reference for O(1) push_back.
 *  - Doubly linked list gives O(1) remove given a node.
 *  - Prefer iterative over recursive for long lists.
 *  - Convert to array for debugging — toArray(head).
 *  - Use strict node reference comparison (===) not value equality.
 *  - Watch out for shared references when two lists use the
 *    same node objects.
 *  - Draw the list on paper for tricky pointer rewires.
 *  - Guard null in TS strict mode; use `!` only after a guard.
 *  - Test with: empty, single node, two nodes, cyclic, even/odd
 *    length, and n-th removal at boundaries.
 * ============================================================ */