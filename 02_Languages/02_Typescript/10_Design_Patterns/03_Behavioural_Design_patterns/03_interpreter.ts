// 05_Classes_OOP/21_Interpreter_Pattern.ts

/* ============================================================
 *  📘 THE INTERPRETER PATTERN IN TYPESCRIPT
 *
 *  Interpreter defines a GRAMMAR for a language and provides
 *  an INTERPRETER to evaluate sentences in that language.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Interpreter solves
 *   4. Basic implementation (arithmetic expressions)
 *   5. Adding variables / context
 *   6. Boolean logic interpreter
 *   7. Generic AST interpreter
 *   8. Real-world use cases
 *   9. Interpreter vs Visitor vs Composite
 *  10. Pros & cons
 *  11. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// Interpreter models a small LANGUAGE (grammar) as a tree of
// expression classes. Each node knows how to EVALUATE itself.
//
//   Grammar → AST (Abstract Syntax Tree) → Evaluation
//
// Example: "3 + 5 * 2" becomes
//
//           Add
//          /   \
//         3    Multiply
//              /    \
//             5      2
//
// Each node implements `interpret(context)`. Calling `interpret`
// on the root recursively evaluates the whole tree.
//
// Best for SMALL, well-defined languages — not general-purpose
// parsers (use a real parser generator for that).

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬────────────────────────────────────────┐
// │ Role                 │ Responsibility                          │
// ├──────────────────────┼────────────────────────────────────────┤
// │ AbstractExpression   │ Declares `interpret(context)`           │
// │ TerminalExpression   │ Leaf nodes — literals / variables       │
// │ NonTerminalExpr.     │ Composite nodes — combine sub-expressions│
// │ Context              │ Holds shared state (variable bindings)  │
// │ Client               │ Builds AST, calls `interpret`           │
// └──────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM INTERPRETER SOLVES
 * ============================================================ */

// You have a small language (rules, formulas, queries, DSL).
// It changes often; you want each rule to be a first-class object.
//
// WITHOUT Interpreter:
//   - One giant switch/if chain per rule
//   - Hard to extend or test individual rules
//   - Grammar logic scattered everywhere
//
// WITH Interpreter:
//   - Each grammar rule = one class
//   - Add rules by adding classes
//   - Testable in isolation
//   - Composable into trees

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — ARITHMETIC EXPRESSIONS
 * ============================================================ */

// ─── Context ───
// Empty for pure arithmetic; used later for variables.
type Context = Record<string, number>;

// ─── Abstract Expression ───
interface Expression {
    interpret(ctx: Context): number;
}

// ─── Terminal Expressions (leaves) ───
class NumberExpr implements Expression {
    constructor(private value: number) { }
    interpret(): number { return this.value; }
}

class VariableExpr implements Expression {
    constructor(private name: string) { }
    interpret(ctx: Context): number {
        const value = ctx[this.name];
        if (value === undefined) throw new Error(`Unknown: ${this.name}`);
        return value;
    }
}

// ─── Non-Terminal Expressions (composites) ───
class AddExpr implements Expression {
    constructor(private left: Expression, private right: Expression) { }
    interpret(ctx: Context): number {
        return this.left.interpret(ctx) + this.right.interpret(ctx);
    }
}

class SubtractExpr implements Expression {
    constructor(private left: Expression, private right: Expression) { }
    interpret(ctx: Context): number {
        return this.left.interpret(ctx) - this.right.interpret(ctx);
    }
}

class MultiplyExpr implements Expression {
    constructor(private left: Expression, private right: Expression) { }
    interpret(ctx: Context): number {
        return this.left.interpret(ctx) * this.right.interpret(ctx);
    }
}

class DivideExpr implements Expression {
    constructor(private left: Expression, private right: Expression) { }
    interpret(ctx: Context): number {
        const d = this.right.interpret(ctx);
        if (d === 0) throw new Error("Division by zero");
        return this.left.interpret(ctx) / d;
    }
}

class NegateExpr implements Expression {
    constructor(private inner: Expression) { }
    interpret(ctx: Context): number { return -this.inner.interpret(ctx); }
}

// ─── Client — build an AST manually ───
// Expression: 3 + 5 * 2
const ast: Expression = new AddExpr(
    new NumberExpr(3),
    new MultiplyExpr(new NumberExpr(5), new NumberExpr(2))
);

console.log(ast.interpret({}));   // 13

// 🧠 Multiply runs first only because we BUILT the tree that way —
//    precedence is baked into the tree shape, not the interpreter.

/* ============================================================
 *  5️⃣ ADDING VARIABLES / CONTEXT
 * ============================================================ */

// Expression: x * (y + 2)
const expr2: Expression = new MultiplyExpr(
    new VariableExpr("x"),
    new AddExpr(new VariableExpr("y"), new NumberExpr(2))
);

console.log(expr2.interpret({ x: 3, y: 4 }));    // 18
console.log(expr2.interpret({ x: 10, y: 0 }));   // 20

// 🔸 Context can be richer — envs, scopes, config, etc.

type RichContext = {
    vars: Record<string, number>;
    debug?: boolean;
};

class DebuggableExpr implements Expression {
    constructor(private inner: Expression, private label: string) { }
    interpret(ctx: Context): number {
        const v = this.inner.interpret(ctx);
        console.log(`[debug] ${this.label} = ${v}`);
        return v;
    }
}

/* ============================================================
 *  6️⃣ BOOLEAN LOGIC INTERPRETER
 * ============================================================ */

// Same pattern, different grammar — boolean rules.

interface BoolExpr {
    evaluate(ctx: Record<string, boolean>): boolean;
}

class Literal implements BoolExpr {
    constructor(private value: boolean) { }
    evaluate(): boolean { return this.value; }
}

class Variable implements BoolExpr {
    constructor(private name: string) { }
    evaluate(ctx: Record<string, boolean>): boolean {
        const value = ctx[this.name];
        if (value === undefined) throw new Error(`Unknown: ${this.name}`);
        return value;
    }
}
class And implements BoolExpr {
    constructor(private a: BoolExpr, private b: BoolExpr) { }
    evaluate(ctx: Record<string, boolean>): boolean {
        return this.a.evaluate(ctx) && this.b.evaluate(ctx);
    }
}

class Or implements BoolExpr {
    constructor(private a: BoolExpr, private b: BoolExpr) { }
    evaluate(ctx: Record<string, boolean>): boolean {
        return this.a.evaluate(ctx) || this.b.evaluate(ctx);
    }
}

class Not implements BoolExpr {
    constructor(private inner: BoolExpr) { }
    evaluate(ctx: Record<string, boolean>): boolean {
        return !this.inner.evaluate(ctx);
    }
}

// Expression: (isAdmin AND isActive) OR isSuperUser
const policy: BoolExpr = new Or(
    new And(new Variable("isAdmin"), new Variable("isActive")),
    new Variable("isSuperUser")
);

console.log(policy.evaluate({ isAdmin: true, isActive: true, isSuperUser: false })); // true
console.log(policy.evaluate({ isAdmin: true, isActive: false, isSuperUser: false })); // false
console.log(policy.evaluate({ isAdmin: false, isActive: false, isSuperUser: true })); // true

// 🧠 Rules as data — you can build, transform, and store them.

/* ============================================================
 *  7️⃣ GENERIC AST INTERPRETER
 * ============================================================ */

// A generic, type-safe interpreter over a visitor-style AST.

type Node<T> =
    | { kind: "lit"; value: T }
    | { kind: "var"; name: string }
    | { kind: "bin"; op: "+" | "-" | "*" | "/"; left: Node<T>; right: Node<T> }
    | { kind: "neg"; inner: Node<T> };

// A generic evaluator parameterized by operations.
interface Ops<T> {
    add(a: T, b: T): T;
    sub(a: T, b: T): T;
    mul(a: T, b: T): T;
    div(a: T, b: T): T;
    neg(a: T): T;
}

function interpretGeneric<T>(
    node: Node<T>,
    ctx: Record<string, T>,
    ops: Ops<T>
): T {
    switch (node.kind) {
        case "lit": return node.value;
        case "var": {
            const value = ctx[node.name];
            if (value === undefined) throw new Error(`Unknown var ${node.name}`);
            return value;
        }
        case "neg": return ops.neg(interpretGeneric(node.inner, ctx, ops));
        case "bin": {
            const l = interpretGeneric(node.left, ctx, ops);
            const r = interpretGeneric(node.right, ctx, ops);
            switch (node.op) {
                case "+": return ops.add(l, r);
                case "-": return ops.sub(l, r);
                case "*": return ops.mul(l, r);
                case "/": return ops.div(l, r);
            }
        }
    }
}

// ─── Number interpreter ───
const numOps: Ops<number> = {
    add: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => a / b,
    neg: (a) => -a,
};

// Expression: (x + 2) * 3
const tree: Node<number> = {
    kind: "bin",
    op: "*",
    left: {
        kind: "bin",
        op: "+",
        left: { kind: "var", name: "x" },
        right: { kind: "lit", value: 2 },
    },
    right: { kind: "lit", value: 3 },
};

console.log(interpretGeneric(tree, { x: 4 }, numOps));   // 18

// ─── String interpreter (same AST, different semantics!) ───
const strOps: Ops<string> = {
    add: (a, b) => a + b,
    sub: (a, b) => a.replace(b, ""),
    mul: (a, b) => a.repeat(Number(b) || 0),
    div: (a, _) => a,
    neg: (a) => a.split("").reverse().join(""),
};

const strTree: Node<string> = {
    kind: "bin",
    op: "+",
    left: { kind: "lit", value: "Hello, " },
    right: { kind: "lit", value: "World!" },
};
console.log(interpretGeneric(strTree, {}, strOps));      // "Hello, World!"

// 🧠 Same AST shape — different language semantics.

/* ============================================================
 *  8️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Math expression evaluators (calculators, spreadsheets)
// - Boolean rule engines (feature flags, access policies)
// - Query DSLs (search filters, GraphQL-like)
// - Regular expression engines (conceptually)
// - Template languages (Mustache, Handlebars-like)
// - SQL / query builders (structural interpretation)
// - Config / policy languages (OPA, CEL)
// - Regex-to-NFA compilers
// - Lisp-like S-expression evaluators
// - Business rule engines (discount rules, pricing rules)
// - Grammar for chat commands / bot DSLs
//
// Libraries / systems using interpreter-like designs:
//   - RegExp engine
//   - PostCSS (CSS transformation)
//   - Babel (JS AST)
//   - ESLint rules
//   - GraphQL parser + executor
//   - Terraform (HCL interpretation)

/* ============================================================
 *  9️⃣ INTERPRETER vs VISITOR vs COMPOSITE
 * ============================================================ */

// ┌────────────────────┬──────────────────────────────────────────┐
// │ Pattern            │ Distinguishing trait                      │
// ├────────────────────┼──────────────────────────────────────────┤
// │ Interpreter        │ Grammar → evaluate AST; behavior on nodes │
// │ Visitor            │ Operations ON a tree, kept OUTSIDE nodes  │
// │ Composite          │ Uniform tree structure; not evaluation    │
// └────────────────────┴──────────────────────────────────────────┘
//
// 🧠 Interpreter nodes KNOW how to evaluate themselves.
//    Visitor moves operations OUT (adding operations is easier;
//    adding node types is harder).
//    Composite is the STRUCTURE; Interpreter adds SEMANTICS.

/* ============================================================
 *  1️⃣0️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Grammar rules become first-class objects
//  - Easy to add new expression types (Open/Closed)
//  - Rules are composable and testable in isolation
//  - Natural fit for DSLs and small languages
//  - Type-safe ASTs with discriminated unions
//
// ❌ Cons
//  - Many small classes — boilerplate
//  - Poor fit for COMPLEX grammars — use parser generators
//  - Adding new OPERATIONS requires touching every node class
//    (Visitor pattern fixes this)
//  - Recursion depth can hit stack limits on huge inputs
//  - Slow for large inputs — no JIT optimizations
//  - Hard to add precedence / associativity without a parser

/* ============================================================
 *  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Interpreter ≠ Parser. The PATTERN evaluates an AST — building
//     the AST from text requires a separate parser (recursive descent,
//     Pratt, or a generator like PEG.js / nearley / Chevrotain).
// ⚠️ Precedence and associativity must be encoded in the tree —
//     the interpreter itself doesn't know "× before +".
// ⚠️ Deep trees can blow the stack — use an explicit stack for very
//     large expressions, or increase the depth limit.
// ⚠️ Guard against division by zero, unknown variables, type mismatches.
// ⚠️ Keep nodes IMMUTABLE — do not mutate during evaluation.
// ⚠️ Cache results if the same subtree is evaluated many times
//     (memoization).
// ⚠️ Add a `toString` / `format` method per node — great for debugging.
// ⚠️ If you find yourself adding many operations, switch to VISITOR —
//     operations live outside the node classes.
// ⚠️ For business rules, prefer a rules ENGINE (json-rules-engine,
//     OPA, CEL) over building your own DSL — unless the DSL is core
//     to the product.
// ⚠️ Discriminated unions + exhaustive `switch` beat class hierarchies
//     for modern TS interpreters (see `interpretGeneric` above).

// 🕒 Version notes
// - Interpreter pattern: GoF, 1994
// - Discriminated unions: TS 2.0
// - Generic interpreters: TS 1.0+
// - Exhaustiveness via `never`: TS 2.0+

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role                │ Notes                                    │
 * ─────────────────────────────────────────────────────────────
 * | AbstractExpression  │ Declares `interpret(context)`            │
 * | TerminalExpression  │ Literals, variables                      │
 * | NonTerminalExpr.    │ Combines sub-expressions (+, -, *, ...)  │
 * | Context             │ Shared state (variable bindings)         │
 * | Client              │ Builds AST, invokes `interpret`          │
 * ─────────────────────────────────────────────────────────────
 *
 * | Form                       │ Trade-off                        │
 * ─────────────────────────────────────────────────────────────
 * | Class-per-node             │ OO style; new operations costly  │
 * | Discriminated unions       │ Modern; exhaustive switch        │
 * | Generic + Ops interface    │ Reusable across value types      │
 * | + Visitor                  │ Moves operations out of nodes    │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Keep the AST IMMUTABLE — evaluate without side effects.
 *  - Use discriminated unions for TS-friendly exhaustiveness.
 *  - Prefer a generic `interpretGeneric` with an `Ops` interface for
 *    reuse across value types.
 *  - Encode precedence in the TREE — not in the interpreter.
 *  - Add `toString`/`format` on nodes for debugging.
 *  - Memoize shared subtrees if they're evaluated repeatedly.
 *  - Combine with Visitor when you'll add many operations.
 *  - For complex grammars use a parser generator — don't hand-roll.
 *  - Reject unknown variables / div-by-zero / type errors explicitly.
 *  - Guard stack depth on huge inputs.
 * ============================================================ */