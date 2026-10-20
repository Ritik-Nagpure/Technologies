// 06_Stacks.ts

/* ============================================================
 *  📘 STACKS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A stack is a LIFO (Last-In, First-Out) collection. Push adds
 *  to the top; pop removes from the top. In JavaScript/
 *  TypeScript, a plain array is the idiomatic stack (push / pop
 *  both O(1) amortised). Stacks are the backbone of parsing,
 *  DFS, backtracking, undo systems, and expression evaluation.
 *
 *  This file covers: LIFO semantics, array-as-stack, a typed
 *  Stack class, the classic problems (balanced parentheses,
 *  infix → postfix, postfix evaluation, monotonic stack, next
 *  greater element, min stack), and pitfalls with shared
 *  references.
 *
 *  Sections:
 *   1. What a stack is
 *   2. Stack via array (the standard way)
 *   3. Stack via a typed class
 *   4. Balanced parentheses
 *   5. Infix → postfix (shunting-yard)
 *   6. Postfix evaluation
 *   7. Monotonic stack — next greater element
 *   8. Min stack (O(1) getMin)
 *   9. Implement queue via two stacks (bridge to next file)
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A STACK IS
 * ============================================================ */
// 🔹 LIFO — the last item you push is the first you pop.
// 🔹 Core operations:
//     push(x)  → add to top
//     pop()    → remove & return top
//     peek()   → look at top without removing
//     isEmpty()
//     size()
// 🔸 Every operation on a well-implemented stack is O(1).
// 🎯 Analogy: a stack of plates — you add/remove at the top only.

// 🧠 Use a stack whenever the problem says:
//    "match", "undo", "nested", "backtrack", "DFS", "recent".


/* ============================================================
 *  2️⃣ STACK VIA ARRAY (THE STANDARD WAY)
 * ============================================================ */
// 🔹 arr.push(x)   → O(1) amortised push
// 🔹 arr.pop()     → O(1) pop from end
// 🔹 arr[arr.length - 1] → O(1) peek
// 🔸 NEVER use shift/unshift — those are O(n).

const stack: number[] = [];

stack.push(1);                          // push
stack.push(2);
stack.push(3);
console.log(stack);                     // [1, 2, 3]

const top = stack[stack.length - 1];    // peek
console.log(top);                       // 3

const x = stack.pop();                  // pop
console.log(x, stack);                  // 3 [1, 2]

console.log(stack.length);              // 2
console.log(stack.length === 0);        // false (empty check)

// ⚠️ Popping from an empty array returns undefined (no throw).
// [].pop();                             // undefined

// ✅ Safe pop with default
function safePop(s: number[]): number | undefined {
  return s.length > 0 ? s.pop() : undefined;
}
console.log(safePop([]));               // undefined

// 🧠 Array is a perfectly fine stack — no need for a custom class
//    in most interviews unless the problem asks for one.


/* ============================================================
 *  3️⃣ STACK VIA A TYPED CLASS
 * ============================================================ */
// 🔹 Nice for interviews when you need extra logic (min, size,
//    capacity, safety).
// 🔸 Keeps the API explicit.

class Stack<T> {
  private items: T[] = [];

  push(x: T): void {
    this.items.push(x);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }

  toArray(): readonly T[] {
    return [...this.items];
  }
}

const s = new Stack<number>();
s.push(10);
s.push(20);
console.log(s.peek());                  // 20
console.log(s.pop());                   // 20
console.log(s.size);                    // 1
console.log(s.toArray());               // [10]

// 🧠 Prefer a plain array in competitive/interview settings —
//    less boilerplate, same complexity. Use a class when you
//    need extra invariants (min, max, capacity).


/* ============================================================
 *  4️⃣ BALANCED PARENTHESES
 * ============================================================ */
// 🔹 Classic stack problem — O(n) time, O(n) space.
// 🔸 Push opening brackets, pop on closing, verify match.

function isBalanced(s: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (ch === ")" || ch === "]" || ch === "}") {
      const last = stack.pop();
      if (last !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isBalanced("()[]{}"));      // true
console.log(isBalanced("([{}])"));      // true
console.log(isBalanced("(]"));          // false
console.log(isBalanced("((("));         // false
console.log(isBalanced(""));            // true

// ⚠️ Common bugs:
//   - Forgetting to check empty stack before pop
//   - Forgetting the final `stack.length === 0` check
// 🧠 Template: push on open, validate+pop on close, ensure empty.


/* ============================================================
 *  5️⃣ INFIX → POSTFIX (SHUNTING-YARD)
 * ============================================================ */
// 🔹 Converts "3 + 4 * 2" to "3 4 2 * +" for easy evaluation.
// 🔸 Uses a stack for operators, respects precedence + associativity.
// 🎯 Classic interview topic.

function infixToPostfix(tokens: readonly string[]): string[] {
  const precedence: Record<string, number> = {
    "+": 1, "-": 1, "*": 2, "/": 2, "^": 3,
  };
  const rightAssoc = new Set([ "^" ]);
  const output: string[] = [];
  const ops: string[] = [];

  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      output.push(tok);
    } else if (tok === "(") {
      ops.push(tok);
    } else if (tok === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        const op = ops.pop();
        if (op !== undefined) output.push(op);
      }
      if (ops.length === 0) throw new Error("Mismatched parentheses");
      ops.pop();                        // discard "("
    } else {
      const prec = precedence[tok];
      if (prec === undefined) throw new Error(`Unknown token: ${tok}`);
      while (ops.length > 0) {
        const topOp = ops[ops.length - 1];
        if (topOp === undefined || topOp === "(") break;
        const topPrec = precedence[topOp] ?? -1;
        if (
          topPrec > prec ||
          (topPrec === prec && !rightAssoc.has(tok))
        ) {
          output.push(ops.pop() as string);
        } else {
          break;
        }
      }
      ops.push(tok);
    }
  }

  while (ops.length > 0) {
    const top = ops.pop();
    if (top === "(") throw new Error("Mismatched parentheses");
    if (top !== undefined) output.push(top);
  }
  return output;
}

console.log(infixToPostfix(["3", "+", "4", "*", "2"]));
// ["3","4","2","*","+"]

console.log(infixToPostfix(["(", "1", "+", "2", ")", "*", "3"]));
// ["1","2","+","3","*"]

// 🧠 Rule: higher-precedence operators pop lower-precedence ones.
//    Parentheses act as barriers.


/* ============================================================
 *  6️⃣ POSTFIX EVALUATION
 * ============================================================ */
// 🔹 Postfix (Reverse Polish) is stack-evaluable in one pass.
// 🔸 Push numbers; on operator, pop two, apply, push result.

function evalPostfix(tokens: readonly string[]): number {
  const stack: number[] = [];
  for (const tok of tokens) {
    if (tok === "+" || tok === "-" || tok === "*" || tok === "/") {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error("Invalid postfix expression");
      }
      switch (tok) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": stack.push(a / b); break;
      }
    } else {
      const n = Number(tok);
      if (Number.isNaN(n)) throw new Error(`Invalid number: ${tok}`);
      stack.push(n);
    }
  }
  if (stack.length !== 1) throw new Error("Invalid postfix expression");
  return stack[0] as number;
}

console.log(evalPostfix(["3", "4", "2", "*", "+"]));           // 11
console.log(evalPostfix(["5", "1", "2", "+", "4", "*", "+", "3", "-"]));
// 14

// ⚠️ Order matters! Popping b BEFORE a because a op b — the top
//    of stack is the SECOND operand.
// 🧠 One-pass, O(n) time, O(n) space.


/* ============================================================
 *  7️⃣ MONOTONIC STACK — NEXT GREATER ELEMENT
 * ============================================================ */
// 🔹 Keep stack SORTED (increasing or decreasing) as you scan.
// 🔸 Classic pattern for "next greater / smaller" problems.
// 🎯 Turns O(n²) brute force into O(n).

function nextGreater(xs: readonly number[]): number[] {
  const n = xs.length;
  const result = new Array<number>(n).fill(-1);
  const stack: number[] = [];           // indices, decreasing values

  for (let i = 0; i < n; i++) {
    const x = xs[i];
    if (x === undefined) continue;
    while (stack.length > 0) {
      const topIdx = stack[stack.length - 1];
      if (topIdx === undefined) break;
      const topVal = xs[topIdx];
      if (topVal === undefined || topVal >= x) break;
      stack.pop();
      result[topIdx] = x;
    }
    stack.push(i);
  }
  return result;
}

console.log(nextGreater([2, 1, 2, 4, 3, 1]));   // [4, 2, 4, -1, -1, -1]

// 🔸 Previous smaller element (symmetric pattern)
function previousSmaller(xs: readonly number[]): number[] {
  const result = new Array<number>(xs.length).fill(-1);
  const stack: number[] = [];           // indices, increasing values

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x === undefined) continue;
    while (stack.length > 0) {
      const topIdx = stack[stack.length - 1];
      if (topIdx === undefined) break;
      const topVal = xs[topIdx];
      if (topVal !== undefined && topVal < x) break;
      stack.pop();
    }
    const topIdx = stack[stack.length - 1];
    result[i] = topIdx !== undefined ? (xs[topIdx] ?? -1) : -1;
    stack.push(i);
  }
  return result;
}

console.log(previousSmaller([3, 1, 4, 1, 5]));   // [-1, -1, 1, -1, 1]

// 🔸 Largest rectangle in histogram — the classic hard problem
function largestRectangle(heights: readonly number[]): number {
  const stack: number[] = [];           // indices with increasing heights
  const h = [...heights, 0];            // sentinel to flush
  let best = 0;
  for (let i = 0; i < h.length; i++) {
    const cur = h[i];
    if (cur === undefined) continue;
    while (stack.length > 0) {
      const topIdx = stack[stack.length - 1];
      if (topIdx === undefined) break;
      const topH = h[topIdx];
      if (topH === undefined || topH <= cur) break;
      stack.pop();
      const height = topH;
      const width =
        stack.length === 0 ? i : i - (stack[stack.length - 1] ?? 0) - 1;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return best;
}

console.log(largestRectangle([2, 1, 5, 6, 2, 3]));   // 10

// 🧠 Rule: when you find yourself asking "next greater/smaller",
//    think monotonic stack. Each element is pushed/popped ONCE.


/* ============================================================
 *  8️⃣ MIN STACK (O(1) getMin)
 * ============================================================ */
// 🔹 Design a stack that supports push, pop, top, and getMin
//    all in O(1).
// 🔸 Trick: keep a second stack of running minimums.

class MinStack {
  private data: number[] = [];
  private mins: number[] = [];          // parallel min stack

  push(x: number): void {
    this.data.push(x);
    const top = this.mins[this.mins.length - 1];
    if (this.mins.length === 0 || (top !== undefined && x <= top)) {
      this.mins.push(x);
    }
  }

  pop(): number | undefined {
    const x = this.data.pop();
    if (x === undefined) return undefined;
    if (x === this.mins[this.mins.length - 1]) this.mins.pop();
    return x;
  }

  top(): number | undefined {
    return this.data[this.data.length - 1];
  }

  getMin(): number | undefined {
    return this.mins[this.mins.length - 1];
  }
}

const ms = new MinStack();
ms.push(5); ms.push(3); ms.push(7); ms.push(2);
console.log(ms.getMin());               // 2
ms.pop();
console.log(ms.getMin());               // 3
ms.pop(); ms.pop();
console.log(ms.getMin());               // 5

// 🔸 Alternative: store (value, running_min) tuples in one stack.
// 🧠 The "auxiliary stack" pattern generalises:
//    getMax, getMedian, running-product, etc.


/* ============================================================
 *  9️⃣ IMPLEMENT QUEUE VIA TWO STACKS (BRIDGE)
 * ============================================================ */
// 🔹 Classic interview: FIFO from two LIFOs.
// 🔸 push → input stack; pop → transfer to output stack once.
// (Full treatment in next file, but included here for contrast.)

class QueueViaStacks<T> {
  private inStack: T[] = [];
  private outStack: T[] = [];

  push(x: T): void {
    this.inStack.push(x);
  }

  pop(): T | undefined {
    this.shift();
    return this.outStack.pop();
  }

  peek(): T | undefined {
    this.shift();
    return this.outStack[this.outStack.length - 1];
  }

  private shift(): void {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        const v = this.inStack.pop();
        if (v !== undefined) this.outStack.push(v);
      }
    }
  }

  isEmpty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

const q = new QueueViaStacks<number>();
q.push(1); q.push(2); q.push(3);
console.log(q.pop());                   // 1
console.log(q.peek());                  // 2
console.log(q.pop());                   // 2
console.log(q.isEmpty());               // false

// 🧠 Amortised O(1) per operation — each item moves at most once.


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ pop() on an empty array returns undefined — no throw.
//    Always guard peek()/pop() or handle undefined.
// ⚠️ shift/unshift on arrays are O(n) — never use as stack ops;
//    use pop/push.
// ⚠️ Appending mutable objects (like arrays) to a stack shares
//    the reference — mutate carefully.
const sArr: number[][] = [];
const row = [1, 2];
sArr.push(row);
row.push(3);
console.log(sArr[0]);                   // [1, 2, 3]  ← same object

// ⚠️ Recursion uses the call stack — deep recursion + user stack
//    can hit V8's limit fast.
// ⚠️ In postfix evaluation, POP ORDER matters (b then a).
// ⚠️ In shunting-yard, handle "(" and ")" edges carefully —
//    mismatched parens are the #1 bug source.
// ⚠️ Monotonic stack: decide strictly-greater vs greater-equal
//    based on what the problem wants (affects duplicates).
// ⚠️ Min stack must push to mins on <= (not <) for duplicates.
// ⚠️ A "stack" using a Set loses order — use array or a custom
//    structure.
// ⚠️ TypeScript's noUncheckedIndexedAccess makes arr[i] T|undefined
//    — narrow before comparing / arithmetic.
// ⚠️ Iterating an array while mutating it with pop is undefined
//    for that array — take a snapshot first.

/* 🕒 Version notes
 * - Array.prototype.push / pop: always — the canonical stack
 * - Spread / destructuring for stack utilities: ES2015
 * - Array.prototype.at(-1) for last element: ES2022
 * - Array.prototype.findLast: ES2023
 * - WeakMap / Map for auxiliary stacks: ES2015+
 * - No built-in Stack or Deque in JS — use array or implement
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - ES2024 / ES2025 add Set methods (unrelated to stacks)
 * - Generators (function*) make lazy stack-based iterators easy
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation          │ Array              │ Notes              |
 * ─────────────────────────────────────────────────────────────
 * | push (top)         │ arr.push(x) O(1)   │ amortised          |
 * | pop (top)          │ arr.pop()  O(1)    │ returns undefined  |
 * |                    │                    │ if empty           |
 * | peek               │ arr[arr.length-1]  │ undefined if empty |
 * |                    │   O(1)             │                    |
 * | size               │ arr.length O(1)    │ —                  |
 * | empty check        │ arr.length === 0   │ —                  |
 * | push at bottom     │ unshift   O(n) ❌  │ use head pointer   |
 * | pop at bottom      │ shift     O(n) ❌  │ use head pointer   |
 * ─────────────────────────────────────────────────────────────
 * | Classic problem          │ Technique                   |
 * ─────────────────────────────────────────────────────────────
 * | Balanced parentheses     │ Push opens, match on close   |
 * | Infix → postfix          │ Shunting-yard               |
 * | Postfix evaluation       │ Operand stack               |
 * | Next greater element     │ Monotonic decreasing stack  |
 * | Previous smaller         │ Monotonic increasing stack  |
 * | Largest rectangle        │ Monotonic stack + sentinel  |
 * | Min stack                │ Auxiliary min stack         |
 * | Undo / redo              │ Two stacks (do / undone)    |
 * | DFS (iterative)          │ Stack of nodes              |
 * | Queue via two stacks     │ Amortised transfer          |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | pop on empty               │ undefined, no throw            |
 * | shift/unshift as stack ops │ O(n) — not stack ops           |
 * | Shared mutable references  │ Unexpected mutations           |
 * | Pop order in postfix       │ b before a → wrong result      |
 * | Mismatched parens unhandled│ Silent wrong output            |
 * | Monotonic strict vs ≤      │ Duplicates behave differently  |
 * | Min stack with < only      │ Misses duplicates              |
 * | arr[i] T | undefined       │ Narrow before use in strict    |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use a plain array for stacks — simple, fast, idiomatic.
 *  - Guard pop() / peek() against empty stacks.
 *  - Never use shift/unshift as stack ops — that's O(n).
 *  - Use a head-pointer class for queue-like usage.
 *  - Monotonic stack = one push/pop per element → O(n).
 *  - Pop order matters in postfix evaluation (b then a).
 *  - Handle parentheses edges explicitly in shunting-yard.
 *  - Auxiliary stacks unlock O(1) queries (min/max).
 *  - Watch out for shared mutable references on push.
 *  - Narrow arr[i] when TypeScript has noUncheckedIndexedAccess.
 *  - When you see "match", "nested", "undo", or "recent" →
 *    think stack.
 *  - Test with: empty input, single element, deeply nested,
 *    mismatched brackets, and duplicate priorities.
 * ============================================================ */