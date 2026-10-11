// 05_Classes_OOP/20_Chain_Of_Responsibility_Pattern.ts

/* ============================================================
 *  📘 THE CHAIN OF RESPONSIBILITY PATTERN IN TYPESCRIPT
 *
 *  Chain of Responsibility passes a request along a chain of
 *  handlers. Each handler decides to HANDLE the request or
 *  PASS it to the next handler.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Chain of Responsibility solves
 *   4. Basic implementation (support tickets)
 *   5. Middleware chain (functional)
 *   6. Request pipeline with early exit
 *   7. Chain with context / shared state
 *   8. Async chain
 *   9. Generic chain (type-safe)
 *  10. Real-world use cases
 *  11. Chain vs Decorator vs Middleware
 *  12. Pros & cons
 *  13. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// A chain of handlers, each capable of handling (or forwarding)
// a request. The SENDER doesn't know which handler will process it.
//
//   Client → Handler1 → Handler2 → Handler3 → (no more handlers)
//               |            |          |
//             handle       handle     handle
//
// Each handler either:
//   - Handles the request and STOPS, OR
//   - Handles and PASSES to the next, OR
//   - Doesn't handle and passes to the next
//
// Benefits:
//   - Decouple senders from receivers
//   - Compose handlers dynamically
//   - Add/remove handlers without touching clients
//   - Great fit for middleware, validation, escalation

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────────────┬────────────────────────────────────────┐
// │ Role                 │ Responsibility                          │
// ├──────────────────────┼────────────────────────────────────────┤
// │ Handler              │ Interface with `setNext` + `handle`     │
// │ AbstractHandler      │ Holds reference to next handler         │
// │ ConcreteHandler      │ Handles or forwards the request         │
// │ Client               │ Builds the chain and sends requests     │
// └──────────────────────┴────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM IT SOLVES
 * ============================================================ */

// WITHOUT chain — big if/else blocks scattered across code:
//
//   if (amount < 100) return handleByClerk(request);
//   else if (amount < 1000) return handleByManager(request);
//   else if (amount < 10000) return handleByDirector(request);
//   else return handleByCEO(request);
//
// Adding a new level requires editing this code.
//
// WITH chain — each level is a handler class:
//
//   clerk.setNext(manager).setNext(director).setNext(ceo);
//   clerk.handle(request);
//
// 🧠 Add a "regional manager"? Just insert it into the chain.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — SUPPORT TICKETS
 * ============================================================ */

// ─── Request ───
type Priority = "low" | "medium" | "high" | "critical";

type Ticket = {
    id: number;
    priority: Priority;
    description: string;
};

// ─── Handler interface ───
interface SupportHandler {
    setNext(handler: SupportHandler): SupportHandler;
    handle(ticket: Ticket): string | null;
}

// ─── Abstract base — holds the next-handler reference ───
abstract class AbstractSupportHandler implements SupportHandler {
    private next: SupportHandler | null = null;

    setNext(handler: SupportHandler): SupportHandler {
        this.next = handler;
        return handler;              // enables fluent chaining
    }

    protected passToNext(ticket: Ticket): string | null {
        return this.next ? this.next.handle(ticket) : null;
    }

    abstract handle(ticket: Ticket): string | null;
}

// ─── Concrete handlers ───
class BotHandler extends AbstractSupportHandler {
    handle(t: Ticket): string | null {
        if (t.priority === "low") {
            return `[BOT] auto-replied to ticket #${t.id}`;
        }
        return this.passToNext(t);
    }
}

class JuniorAgentHandler extends AbstractSupportHandler {
    handle(t: Ticket): string | null {
        if (t.priority === "medium") {
            return `[JUNIOR] resolved ticket #${t.id}`;
        }
        return this.passToNext(t);
    }
}

class SeniorAgentHandler extends AbstractSupportHandler {
    handle(t: Ticket): string | null {
        if (t.priority === "high") {
            return `[SENIOR] resolved ticket #${t.id}`;
        }
        return this.passToNext(t);
    }
}

class ManagerHandler extends AbstractSupportHandler {
    handle(t: Ticket): string | null {
        if (t.priority === "critical") {
            return `[MANAGER] escalated ticket #${t.id}`;
        }
        return this.passToNext(t);
    }
}

// ─── Build the chain ───
const bot = new BotHandler();
bot
    .setNext(new JuniorAgentHandler())
    .setNext(new SeniorAgentHandler())
    .setNext(new ManagerHandler());

// ─── Client ───
console.log(bot.handle({ id: 1, priority: "low", description: "reset password" }));
// [BOT] auto-replied to ticket #1

console.log(bot.handle({ id: 2, priority: "high", description: "billing issue" }));
// [SENIOR] resolved ticket #2

console.log(bot.handle({ id: 3, priority: "critical", description: "site down" }));
// [MANAGER] escalated ticket #3

// 🧠 Client only sends to the head — doesn't know which handler handles it.

/* ============================================================
 *  5️⃣ MIDDLEWARE CHAIN (FUNCTIONAL)
 * ============================================================ */

// Express-style middleware — the most common modern form.

type Context = {
    url: string;
    user?: { id: string; role: "admin" | "user" };
    response?: string;
};

type Middleware = (ctx: Context, next: () => void) => void;

class MiddlewareChain {
    private middlewares: Middleware[] = [];

    use(mw: Middleware): this {
        this.middlewares.push(mw);
        return this;
    }

    run(ctx: Context): Context {
        let index = 0;

        const next = (): void => {
            const mw = this.middlewares[index++];
            if (mw) {
                mw(ctx, next);
            }
        };

        next();
        return ctx;
    }
}

// ─── Middlewares ───
const logger: Middleware = (ctx, next) => {
    console.log(`[log] ${ctx.url}`);
    next();
};

const auth: Middleware = (ctx, next) => {
    if (!ctx.user) {
        ctx.response = "401 Unauthorized";
        return;                    // short-circuit
    }
    next();
};

const adminOnly: Middleware = (ctx, next) => {
    if (ctx.user?.role !== "admin") {
        ctx.response = "403 Forbidden";
        return;
    }
    next();
};

const handler: Middleware = (ctx) => {
    ctx.response = "200 OK: admin data";
};

// ─── Build & run ───
const chain = new MiddlewareChain().use(logger).use(auth).use(adminOnly).use(handler);

console.log(chain.run({ url: "/admin" }));
// [log] /admin
// { url: "/admin", response: "401 Unauthorized" }

console.log(chain.run({ url: "/admin", user: { id: "u1", role: "admin" } }));
// [log] /admin
// { url: "/admin", user: {...}, response: "200 OK: admin data" }

// 🧠 `next()` is the "pass to next" step. Not calling it stops the chain.

/* ============================================================
 *  6️⃣ REQUEST PIPELINE WITH EARLY EXIT
 * ============================================================ */

// Classic form for validation pipelines.

type ValidationResult = { ok: true } | { ok: false; error: string };

abstract class Validator {
    private next: Validator | null = null;

    setNext(v: Validator): Validator {
        this.next = v;
        return v;
    }

    validate(value: string): ValidationResult {
        const result = this.check(value);
        if (!result.ok) return result;
        return this.next ? this.next.validate(value) : { ok: true };
    }

    protected abstract check(value: string): ValidationResult;
}

class NotEmptyValidator extends Validator {
    protected check(v: string): ValidationResult {
        return v.trim().length > 0 ? { ok: true } : { ok: false, error: "empty" };
    }
}

class MinLengthValidator extends Validator {
    constructor(private min: number) { super(); }
    protected check(v: string): ValidationResult {
        return v.length >= this.min ? { ok: true } : { ok: false, error: `min ${this.min}` };
    }
}

class NoSpacesValidator extends Validator {
    protected check(v: string): ValidationResult {
        return /\s/.test(v) ? { ok: false, error: "contains spaces" } : { ok: true };
    }
}

const validator = new NotEmptyValidator();
validator.setNext(new MinLengthValidator(3)).setNext(new NoSpacesValidator());

console.log(validator.validate("hello"));   // { ok: true }
console.log(validator.validate("hi"));      // { ok: false, error: "min 3" }
console.log(validator.validate(""));        // { ok: false, error: "empty" }
console.log(validator.validate("hi there"));// { ok: false, error: "min 3" } — stops at min length first

/* ============================================================
 *  7️⃣ CHAIN WITH CONTEXT / SHARED STATE
 * ============================================================ */

// Handlers can mutate a shared context — useful for staged
// processing (parse → transform → validate → save).

type PipelineContext = {
    raw: string;
    parsed?: unknown;
    validated?: boolean;
    output?: string;
    errors: string[];
};

abstract class PipelineStage {
    private next: PipelineStage | null = null;
    setNext(s: PipelineStage): PipelineStage { this.next = s; return s; }
    process(ctx: PipelineContext): void {
        this.step(ctx);
        if (ctx.errors.length > 0) return;      // stop on error
        this.next?.process(ctx);
    }
    protected abstract step(ctx: PipelineContext): void;
}

class ParseStage extends PipelineStage {
    protected step(ctx: PipelineContext): void {
        try { ctx.parsed = JSON.parse(ctx.raw); }
        catch { ctx.errors.push("parse error"); }
    }
}

class ValidateStage extends PipelineStage {
    protected step(ctx: PipelineContext): void {
        if (typeof ctx.parsed !== "object" || ctx.parsed === null) {
            ctx.errors.push("not an object");
            return;
        }
        ctx.validated = true;
    }
}

class FormatStage extends PipelineStage {
    protected step(ctx: PipelineContext): void {
        ctx.output = JSON.stringify(ctx.parsed);
    }
}

const pipeline = new ParseStage();
pipeline.setNext(new ValidateStage()).setNext(new FormatStage());

const ctx: PipelineContext = { raw: '{"a":1}', errors: [] };
pipeline.process(ctx);
console.log(ctx);   // { raw: '{"a":1}', parsed: {a:1}, validated: true, output: '{"a":1}', errors: [] }

/* ============================================================
 *  8️⃣ ASYNC CHAIN
 * ============================================================ */

// Handlers returning Promises — useful for HTTP, DB, external calls.

interface AsyncHandler<T> {
    setNext(h: AsyncHandler<T>): AsyncHandler<T>;
    handle(req: T): Promise<T | null>;
}

abstract class AbstractAsyncHandler<T> implements AsyncHandler<T> {
    private next: AsyncHandler<T> | null = null;
    setNext(h: AsyncHandler<T>): AsyncHandler<T> { this.next = h; return h; }
    protected pass(req: T): Promise<T | null> {
        return this.next ? this.next.handle(req) : Promise.resolve(null);
    }
    abstract handle(req: T): Promise<T | null>;
}

type PaymentRequest = {
    amount: number;
    currency: string;
    userId: string;
};

class FraudCheckHandler extends AbstractAsyncHandler<PaymentRequest> {
    async handle(req: PaymentRequest): Promise<PaymentRequest | null> {
        await new Promise((r) => setTimeout(r, 5));   // simulated async
        if (req.amount > 10000) {
            console.log("[fraud] suspicious amount — rejected");
            return null;
        }
        console.log("[fraud] ok");
        return this.pass(req);
    }
}

class BalanceCheckHandler extends AbstractAsyncHandler<PaymentRequest> {
    async handle(req: PaymentRequest): Promise<PaymentRequest | null> {
        await new Promise((r) => setTimeout(r, 5));
        console.log("[balance] ok");
        return this.pass(req);
    }
}

class ChargeHandler extends AbstractAsyncHandler<PaymentRequest> {
    async handle(req: PaymentRequest): Promise<PaymentRequest | null> {
        console.log(`[charge] ${req.amount} ${req.currency} for ${req.userId}`);
        return this.pass(req);
    }
}

const payment = new FraudCheckHandler();
payment.setNext(new BalanceCheckHandler()).setNext(new ChargeHandler());

(async () => {
    await payment.handle({ amount: 100, currency: "USD", userId: "u1" });
    // [fraud] ok
    // [balance] ok
    // [charge] 100 USD for u1

    await payment.handle({ amount: 50000, currency: "USD", userId: "u2" });
    // [fraud] suspicious amount — rejected
})();

/* ============================================================
 *  9️⃣ GENERIC CHAIN (TYPE-SAFE)
 * ============================================================ */

// A reusable, type-safe chain — handler returns either a result
// or `null` (meaning "pass to next").

type HandlerFn<TIn, TOut> = (input: TIn) => TOut | null;

class Chain<TIn, TOut> {
    private handlers: HandlerFn<TIn, TOut>[] = [];

    add(fn: HandlerFn<TIn, TOut>): this {
        this.handlers.push(fn);
        return this;
    }

    execute(input: TIn): TOut | null {
        for (const h of this.handlers) {
            const result = h(input);
            if (result !== null) return result;
        }
        return null;
    }
}

// ─── Usage — a form field parser tries multiple formats ───
type Field = string;
type Parsed = { type: "int" | "float" | "bool" | "text"; value: unknown };

const parse = new Chain<Field, Parsed>()
    .add((s) => (/^-?\d+$/.test(s) ? { type: "int", value: parseInt(s, 10) } : null))
    .add((s) => (/^-?\d+\.\d+$/.test(s) ? { type: "float", value: parseFloat(s) } : null))
    .add((s) => (s === "true" || s === "false" ? { type: "bool", value: s === "true" } : null))
    .add((s) => ({ type: "text", value: s }));   // fallback

console.log(parse.execute("42"));      // { type: "int", value: 42 }
console.log(parse.execute("3.14"));    // { type: "float", value: 3.14 }
console.log(parse.execute("true"));    // { type: "bool", value: true }
console.log(parse.execute("hello"));   // { type: "text", value: "hello" }

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - HTTP middleware pipelines (Express, Koa, Fastify)
// - Authentication / authorization chains
// - Form validation pipelines
// - Logging / metrics / tracing decorators
// - Support ticket escalation
// - Approval workflows (manager → director → CEO)
// - Payment processing (fraud → balance → charge)
// - Content moderation stages
// - Compiler passes (parse → analyze → optimize → emit)
// - Event handling chains (bubbling)
// - Data transformation pipelines
//
// Frameworks using this pattern:
//   - Express (middleware)
//   - Koa (middleware)
//   - NestJS (interceptors, guards, pipes)
//   - Redux middleware
//   - Webpack loaders/plugins
//   - Angular HTTP interceptors
//   - Vue Router navigation guards

/* ============================================================
 *  1️⃣1️⃣ CHAIN vs DECORATOR vs MIDDLEWARE
 * ============================================================ */

// ┌────────────────────┬───────────────────────────────────────────┐
// │ Pattern            │ Distinguishing trait                       │
// ├────────────────────┼───────────────────────────────────────────┤
// │ Chain of Resp.     │ Each handler may HANDLE or PASS            │
// │ Decorator          │ Every wrapper ALWAYS runs around inner     │
// │ Middleware         │ Chain-like, functional; can short-circuit  │
// └────────────────────┴───────────────────────────────────────────┘
//
//  🧠 CoR: "who handles this?"       (exclusive ownership)
//     Decorator: "everyone wraps"    (inclusive layering)
//     Middleware: like CoR but usually functional + async

/* ============================================================
 *  1️⃣2️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Decouples sender from receivers
//  - Dynamic chain composition at runtime
//  - Follows Single Responsibility — one handler per concern
//  - Follows Open/Closed — add handlers without editing clients
//  - Great fit for pipelines, validation, middleware
//
// ❌ Cons
//  - No GUARANTEE the request gets handled (unless you add a fallback)
//  - Hard to debug — order and side effects matter
//  - Deep chains hurt performance and readability
//  - Request may pass through many handlers before being handled
//  - State shared across handlers (context) can get messy

/* ============================================================
 *  1️⃣3️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ ALWAYS handle "no handler matched" — either a fallback handler
//     at the end or a null-check in the client.
// ⚠️ Middleware chains must call `next()` exactly once — calling twice
//     duplicates downstream work; not calling stops the chain.
// ⚠️ Watch for cycles — a handler must not link back into the chain.
// ⚠️ Async chains: await correctly and rethrow errors — silent
//     failures are a top CoR bug.
// ⚠️ Deep chains hurt performance — cache "which handler handles what"
//     when possible.
// ⚠️ In functional middleware, keep each middleware focused — one job.
// ⚠️ Prefer parameter objects for the context so you can add fields
//     without breaking every handler.
// ⚠️ Type the chain generically so all handlers agree on input/output.
// ⚠️ Beware of mutation: if handlers mutate shared context, ordering
//     becomes critical.
// ⚠️ CoR vs Decorator: same call shape, but CoR may SHORT-CIRCUIT;
//     Decorator always calls the inner handler.

// 🕒 Version notes
// - Chain of Responsibility: GoF, 1994
// - Async/await: ES2017 / TS 2.1
// - AsyncIterator / for await: ES2018 / TS 2.3
// - Express/Koa middleware: Node ecosystem, early 2010s

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Role          │ Notes                                         │
 * ─────────────────────────────────────────────────────────────
 * | Handler       │ Interface: setNext + handle                    │
 * | Base handler  │ Holds next; provides passToNext                │
 * | Concrete      │ Handles or forwards                            │
 * | Client        │ Builds chain, sends to head                    │
 * ─────────────────────────────────────────────────────────────
 *
 * | Chain style       │ Form                                       │
 * ─────────────────────────────────────────────────────────────
 * | OO chain          │ Abstract class + setNext                   │
 * | Functional        │ (ctx, next) => void                        │
 * | Async             │ Promise<T> | null                          │
 * | Generic chain     │ Chain<TIn, TOut> with handler array        │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Provide a fallback handler or an explicit "not handled" path.
 *  - Keep each handler SINGLE-RESPONSIBILITY.
 *  - Prefer parameter objects for shared context.
 *  - Always call `next()` exactly once in middleware.
 *  - Await async handlers; rethrow errors after logging.
 *  - Watch chain length — deep chains are hard to debug.
 *  - Make `setNext` return the handler to allow fluent chaining.
 *  - Type the chain generically for safety.
 *  - Prefer ORDER-INDEPENDENT handlers when possible.
 *  - Log the chain execution in dev — massive debugging aid.
 *  - Remember: CoR may SHORT-CIRCUIT; Decorator always wraps.
 * ============================================================ */