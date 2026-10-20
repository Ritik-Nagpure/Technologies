# 06_Stacks.py

# ============================================================
#  📘 STACKS IN PYTHON — COMPLETE COVERAGE
#
#  A stack is a LIFO (Last-In, First-Out) collection. Push adds
#  to the top; pop removes from the top. In Python, a plain list
#  is the idiomatic stack (append / pop both O(1) amortised).
#  Stacks are the backbone of parsing, DFS, backtracking, undo
#  systems, and expression evaluation.
#
#  This file covers: LIFO semantics, list-as-stack, deque for
#  safety, the classic problems (balanced parentheses, infix →
#  postfix, postfix evaluation, monotonic stack, next greater
#  element, min stack), and pitfalls with shared references.
#
#  Sections:
#   1. What a stack is
#   2. Stack via list (the standard way)
#   3. Stack via collections.deque
#   4. Stack via a class (for clarity in interviews)
#   5. Balanced parentheses
#   6. Infix → postfix (shunting-yard)
#   7. Postfix evaluation
#   8. Monotonic stack — next greater element
#   9. Min stack (O(1) getMin)
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A STACK IS
# ============================================================
# 🔹 LIFO — the last item you push is the first you pop.
# 🔹 Core operations:
#     push(x)  → add to top
#     pop()    → remove & return top
#     peek()   → look at top without removing
#     is_empty()
#     size()
# 🔸 Every operation on a well-implemented stack is O(1).
# 🎯 Analogy: a stack of plates — you add/remove at the top only.

# 🧠 Use a stack whenever the problem says:
#    "match", "undo", "nested", "backtrack", "DFS", "recent".


# ============================================================
#  2️⃣ STACK VIA LIST (THE STANDARD WAY)
# ============================================================
# 🔹 list.append(x)   → O(1) amortised push
# 🔹 list.pop()       → O(1) pop from end
# 🔹 list[-1]         → O(1) peek
# 🔸 NEVER use insert(0, x) / pop(0) — those are O(n).

stack: list[int] = []

stack.append(1)                         # push
stack.append(2)
stack.append(3)
print(stack)                            # [1, 2, 3]

top = stack[-1]                         # peek
print(top)                              # 3

x = stack.pop()                         # pop
print(x, stack)                         # 3 [1, 2]

print(len(stack))                       # 2
print(not stack)                        # False (empty check)

# ⚠️ Popping from an empty list raises IndexError.
# [].pop()                              # ❌ IndexError: pop from empty list

# ✅ Safe pop with default
def safe_pop(stack: list[int]) -> int | None:
    return stack.pop() if stack else None

print(safe_pop([]))                     # None

# 🧠 list is a perfectly fine stack — no need for a custom class
#    in most interviews unless the problem asks for one.


# ============================================================
#  3️⃣ STACK VIA collections.deque
# ============================================================
# 🔹 deque supports O(1) append / pop on BOTH ends.
# 🔸 Useful when you also need a queue in the same code.
# 🔸 Thread-safe for append/pop on either side.

from collections import deque

stack: deque[int] = deque()

stack.append(1)                         # push (right end)
stack.append(2)
stack.append(3)

print(stack[-1])                        # peek → 3
print(stack.pop())                      # pop → 3
print(list(stack))                      # [1, 2]

# 🔸 deque(maxlen=n) auto-drops old items — great for fixed
#    histories.
recent: deque[int] = deque(maxlen=3)
for i in range(5):
    recent.append(i)
print(list(recent))                     # [2, 3, 4]

# 🧠 deque is slightly faster than list for pop/append in some
#    workloads, but list is simpler. Either is fine for stacks.


# ============================================================
#  4️⃣ STACK VIA A CLASS
# ============================================================
# 🔹 Nice for interviews when you need extra logic (min, size,
#    capacity, safety).
# 🔸 Keeps the API explicit.

class Stack:
    def __init__(self) -> None:
        self._items: list[int] = []

    def push(self, x: int) -> None:
        self._items.append(x)

    def pop(self) -> int:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> int:
        if not self._items:
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def is_empty(self) -> bool:
        return not self._items

    def __len__(self) -> int:
        return len(self._items)

    def __repr__(self) -> str:
        return f"Stack({self._items})"

s = Stack()
s.push(10)
s.push(20)
print(s)                                # Stack([10, 20])
print(s.peek())                         # 20
print(s.pop())                          # 20
print(len(s))                           # 1

# 🧠 Prefer a plain list in competitive/interview settings —
#    less boilerplate, same complexity.


# ============================================================
#  5️⃣ BALANCED PARENTHESES
# ============================================================
# 🔹 Classic stack problem — O(n) time, O(n) space.
# 🔸 Push opening brackets, pop on closing, verify match.

def is_balanced(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack: list[str] = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(is_balanced("()[]{}"))            # True
print(is_balanced("([{}])"))            # True
print(is_balanced("(]"))                # False
print(is_balanced("((("))               # False
print(is_balanced(""))                  # True

# ⚠️ Common bugs:
#   - Forgetting to check `not stack` before pop
#   - Forgetting the final `not stack` check (unmatched opens)
# 🧠 Template: push on open, validate+pop on close, ensure empty.


# ============================================================
#  6️⃣ INFIX → POSTFIX (SHUNTING-YARD)
# ============================================================
# 🔹 Converts "3 + 4 * 2" to "3 4 2 * +" for easy evaluation.
# 🔸 Uses a stack for operators, respect precedence + associativity.
# 🎯 Classic interview topic.

def infix_to_postfix(tokens: list[str]) -> list[str]:
    precedence = {"+": 1, "-": 1, "*": 2, "/": 2, "^": 3}
    right_assoc = {"^"}
    output: list[str] = []
    ops: list[str] = []

    for tok in tokens:
        if tok.isnumeric():
            output.append(tok)
        elif tok == "(":
            ops.append(tok)
        elif tok == ")":
            while ops and ops[-1] != "(":
                output.append(ops.pop())
            if not ops:
                raise ValueError("Mismatched parentheses")
            ops.pop()                   # discard "("
        else:                           # operator
            while (ops and ops[-1] != "(" and
                   (precedence[ops[-1]] > precedence[tok] or
                    (precedence[ops[-1]] == precedence[tok]
                     and tok not in right_assoc))):
                output.append(ops.pop())
            ops.append(tok)

    while ops:
        if ops[-1] == "(":
            raise ValueError("Mismatched parentheses")
        output.append(ops.pop())
    return output

print(infix_to_postfix(["3", "+", "4", "*", "2"]))
# ['3', '4', '2', '*', '+']

print(infix_to_postfix(["(", "1", "+", "2", ")", "*", "3"]))
# ['1', '2', '+', '3', '*']

# 🧠 Rule: higher-precedence operators pop lower-precedence ones.
#    Parentheses act as barriers.


# ============================================================
#  7️⃣ POSTFIX EVALUATION
# ============================================================
# 🔹 Postfix (Reverse Polish) is stack-evaluable in one pass.
# 🔸 Push numbers; on operator, pop two, apply, push result.

def eval_postfix(tokens: list[str]) -> float:
    stack: list[float] = []
    for tok in tokens:
        if tok in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if tok == "+": stack.append(a + b)
            elif tok == "-": stack.append(a - b)
            elif tok == "*": stack.append(a * b)
            else: stack.append(a / b)
        else:
            stack.append(float(tok))
    if len(stack) != 1:
        raise ValueError("Invalid postfix expression")
    return stack[0]

print(eval_postfix(["3", "4", "2", "*", "+"]))          # 11.0
print(eval_postfix(["5", "1", "2", "+", "4", "*", "+", "3", "-"]))  # 14.0

# ⚠️ Order matters! Popping b BEFORE a because a op b — the top
#    of stack is the SECOND operand.
# 🧠 One-pass, O(n) time, O(n) space.


# ============================================================
#  8️⃣ MONOTONIC STACK — NEXT GREATER ELEMENT
# ============================================================
# 🔹 Keep stack SORTED (increasing or decreasing) as you scan.
# 🔸 Classic pattern for "next greater / smaller" problems.
# 🎯 Turns O(n²) brute force into O(n).

def next_greater(xs: list[int]) -> list[int]:
    n = len(xs)
    result = [-1] * n
    stack: list[int] = []               # indices, decreasing values
    for i, x in enumerate(xs):
        # Pop everything smaller than x — x is their next greater
        while stack and xs[stack[-1]] < x:
            idx = stack.pop()
            result[idx] = x
        stack.append(i)
    return result

print(next_greater([2, 1, 2, 4, 3, 1]))     # [4, 2, 4, -1, -1, -1]

# 🔸 Previous smaller element (symmetric pattern)
def previous_smaller(xs: list[int]) -> list[int]:
    result = [-1] * len(xs)
    stack: list[int] = []               # indices, increasing values
    for i, x in enumerate(xs):
        while stack and xs[stack[-1]] >= x:
            stack.pop()
        result[i] = xs[stack[-1]] if stack else -1
        stack.append(i)
    return result

print(previous_smaller([3, 1, 4, 1, 5]))    # [-1, -1, 1, -1, 1]

# 🔸 Largest rectangle in histogram — the classic hard problem
def largest_rectangle(heights: list[int]) -> int:
    stack: list[int] = []                # indices with increasing heights
    best = 0
    heights = heights + [0]              # sentinel to flush
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best

print(largest_rectangle([2, 1, 5, 6, 2, 3]))    # 10

# 🧠 Rule: when you find yourself asking "next greater/smaller",
#    think monotonic stack. Each element is pushed/popped ONCE.


# ============================================================
#  9️⃣ MIN STACK (O(1) getMin)
# ============================================================
# 🔹 Design a stack that supports push, pop, top, and getMin
#    all in O(1).
# 🔸 Trick: keep a second stack of running minimums.

class MinStack:
    def __init__(self) -> None:
        self._data: list[int] = []
        self._mins: list[int] = []      # parallel min stack

    def push(self, x: int) -> None:
        self._data.append(x)
        if not self._mins or x <= self._mins[-1]:
            self._mins.append(x)

    def pop(self) -> int:
        x = self._data.pop()
        if x == self._mins[-1]:
            self._mins.pop()
        return x

    def top(self) -> int:
        return self._data[-1]

    def get_min(self) -> int:
        return self._mins[-1]

ms = MinStack()
ms.push(5); ms.push(3); ms.push(7); ms.push(2)
print(ms.get_min())                     # 2
ms.pop()
print(ms.get_min())                     # 3
ms.pop(); ms.pop()
print(ms.get_min())                     # 5

# 🔸 Alternative: store (value, running_min) tuples in one stack.
# 🧠 The "auxiliary stack" pattern generalises:
#    getMax, getMedian, running-product, etc.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ pop()/peek() on empty stack → IndexError. Guard first.
# ⚠️ list.insert(0, x) and list.pop(0) are O(n) — never use them
#    as stack ops; that's a deque use case.
# ⚠️ Appending mutable objects (like lists) to a stack shares the
#    reference — mutate carefully.
stack = []
row = [1, 2]
stack.append(row)
row.append(3)
print(stack[0])                         # [1, 2, 3]  ← same object

# ⚠️ Recursion uses the call stack — deep recursion + user stack
#    in the same code can hit the limit quickly.
# ⚠️ In postfix evaluation, POP ORDER matters (b then a).
# ⚠️ In shunting-yard, handle "(" and ")" edges carefully —
#    mismatched parens are the #1 bug source.
# ⚠️ Monotonic stack: decide strictly-greater vs greater-equal
#    based on what the problem wants (affects duplicates).
# ⚠️ Min stack must push to _mins on <= (not <) for duplicates.
# ⚠️ A "stack" using a set loses order — use list or deque.

# 🕒 Version notes
# - list.append / pop: always available — the canonical stack
# - collections.deque: Python 2.4+
# - deque.appendleft / popleft (O(1)): Python 2.4+
# - list.pop() from end: O(1) — always has been
# - list comprehensions for stack-flattening: Python 3.0+
# - Heapq, deque both in stdlib — no third-party needed
# - Python 3.5+ extended unpacking: `first, *rest = stack`
#   useful for stack utilities


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation          │ list                │ deque              |
# ─────────────────────────────────────────────────────────────
# | push (top)         │ append → O(1) amort │ append → O(1)      |
# | pop (top)          │ pop()  → O(1)       │ pop()  → O(1)      |
# | peek               │ [-1]   → O(1)       │ [-1]   → O(1)      |
# | size               │ len()  → O(1)       │ len()  → O(1)      |
# | empty check        │ `not s` → O(1)      │ `not s` → O(1)     |
# | push at bottom     │ insert(0) → O(n) ❌ │ appendleft → O(1)  |
# | pop at bottom      │ pop(0) → O(n) ❌    │ popleft → O(1)     |
# ─────────────────────────────────────────────────────────────
# | Classic problem          │ Technique                   |
# ─────────────────────────────────────────────────────────────
# | Balanced parentheses     │ Push opens, match on close   |
# | Infix → postfix          │ Shunting-yard               |
# | Postfix evaluation       │ Operand stack               |
# | Next greater element     │ Monotonic decreasing stack  |
# | Previous smaller         │ Monotonic increasing stack  |
# | Largest rectangle        │ Monotonic stack + sentinel  |
# | Min stack                │ Auxiliary min stack         |
# | Undo / redo              │ Two stacks (do / undone)    |
# | DFS (iterative)          │ Stack of nodes              |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | pop on empty               │ IndexError                     |
# | insert(0)/pop(0)           │ O(n) — not stack ops           |
# | Shared mutable references  │ Unexpected mutations           |
# | Pop order in postfix       │ b before a → wrong result      |
# | Mismatched parens unhandled│ Silent wrong output            |
# | Monotonic strict vs ≤      │ Duplicates behave differently  |
# | Min stack with `<` only    │ Misses duplicates              |
# | Using set as stack         │ Loses order                    |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use a plain list for stacks — simple, fast, idiomatic.
#  - Guard pop() / peek() against empty stacks.
#  - Never use insert(0)/pop(0) as stack ops — that's O(n).
#  - Use deque when you also need a queue.
#  - Monotonic stack = one push/pop per element → O(n).
#  - Pop order matters in postfix evaluation (b then a).
#  - Handle parentheses edges explicitly in shunting-yard.
#  - Auxiliary stacks unlock O(1) queries (min/max).
#  - Watch out for shared mutable references on push.
#  - When you see "match", "nested", "undo", or "recent" →
#    think stack.
# ============================================================