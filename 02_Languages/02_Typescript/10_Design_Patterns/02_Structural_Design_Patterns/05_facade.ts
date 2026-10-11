// 05_Classes_OOP/17_Facade_Pattern.ts

/* ============================================================
 *  📘 THE FACADE PATTERN IN TYPESCRIPT
 *
 *  Facade provides a SIMPLIFIED, unified interface to a set of
 *  interfaces in a subsystem. It hides complexity behind one
 *  clean entry point.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Facade solves
 *   4. Basic implementation (home theater)
 *   5. Facade vs Adapter vs Decorator vs Proxy
 *   6. Subsystem stays accessible
 *   7. Layered facades
 *   8. Generic / configurable facades
 *   9. Functional facade (module-level)
 *  10. Real-world use cases
 *  11. Pros & cons
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// A subsystem has MANY classes, each with its own API.
// Clients shouldn't need to know the ORDER of calls, which
// combinations work, or which low-level details matter.
//
// The Facade wraps the subsystem behind ONE class with
// HIGH-LEVEL methods (e.g., `watchMovie()` instead of
// `dimLights(); turnOnProjector(); turnOnAmp(); ...`).
//
//   Client → Facade → Subsystem classes (many)
//
// The Facade does NOT replace the subsystem — it just simplifies.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌──────────────┬──────────────────────────────────────────────┐
// │ Role         │ Responsibility                                │
// ├──────────────┼──────────────────────────────────────────────┤
// │ Facade       │ Simplified high-level API over subsystem      │
// │ Subsystem    │ Many classes doing the actual work            │
// │ Client       │ Uses the Facade; may also use subsystem       │
// └──────────────┴──────────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM FACADE SOLVES
 * ============================================================ */

// WITHOUT Facade:
//
//   const amp = new Amplifier();
//   const projector = new Projector();
//   const lights = new Lights();
//   const screen = new Screen();
//   const player = new StreamingPlayer();
//
//   lights.dim(10);
//   screen.down();
//   projector.on();
//   projector.wideScreenMode();
//   amp.on();
//   amp.setVolume(5);
//   player.on();
//   player.play("Inception");
//
//   // ... 15 lines to "start a movie"
//
// WITH Facade:
//
//   homeTheater.watchMovie("Inception");
//
// 🧠 Same result. Client code is dramatically simpler.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — HOME THEATER
 * ============================================================ */

// ─── Subsystem classes (many, complex) ───
class Amplifier {
  on() { console.log("Amp on"); }
  off() { console.log("Amp off"); }
  setVolume(v: number) { console.log(`Volume: ${v}`); }
}

class Projector {
  on() { console.log("Projector on"); }
  off() { console.log("Projector off"); }
  wideScreenMode() { console.log("Projector: widescreen"); }
}

class Lights {
  dim(level: number) { console.log(`Lights dimmed to ${level}%`); }
  on() { console.log("Lights on"); }
}

class Screen {
  down() { console.log("Screen down"); }
  up() { console.log("Screen up"); }
}

class StreamingPlayer {
  on() { console.log("Player on"); }
  off() { console.log("Player off"); }
  play(movie: string) { console.log(`Playing "${movie}"`); }
  stop() { console.log("Player stopped"); }
}

// ─── Facade ───
class HomeTheaterFacade {
  constructor(
    private amp: Amplifier,
    private projector: Projector,
    private lights: Lights,
    private screen: Screen,
    private player: StreamingPlayer
  ) {}

  // 🔸 ONE method that orchestrates many subsystem calls
  watchMovie(movie: string): void {
    console.log("Get ready to watch a movie...");
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.wideScreenMode();
    this.amp.on();
    this.amp.setVolume(5);
    this.player.on();
    this.player.play(movie);
  }

  endMovie(): void {
    console.log("Shutting down...");
    this.player.stop();
    this.player.off();
    this.amp.off();
    this.projector.off();
    this.screen.up();
    this.lights.on();
  }
}

// ─── Client ───
const theater = new HomeTheaterFacade(
  new Amplifier(),
  new Projector(),
  new Lights(),
  new Screen(),
  new StreamingPlayer()
);

theater.watchMovie("Inception");
// Get ready to watch a movie...
// Lights dimmed to 10%
// Screen down
// Projector on
// Projector: widescreen
// Amp on
// Volume: 5
// Player on
// Playing "Inception"

theater.endMovie();

// 🧠 Client only knows `watchMovie` / `endMovie` — subsystem
//    complexity stays hidden.

/* ============================================================
 *  5️⃣ FACADE vs ADAPTER vs DECORATOR vs PROXY
 * ============================================================ */

// ┌──────────────┬────────────────────────────────────────────────┐
// │ Pattern      │ Distinguishing trait                            │
// ├──────────────┼────────────────────────────────────────────────┤
// │ Facade       │ SIMPLIFY many interfaces into one              │
// │ Adapter      │ CONVERT one interface to another               │
// │ Decorator    │ ADD behavior; same interface                   │
// │ Proxy        │ CONTROL access; same interface                 │
// └──────────────┴────────────────────────────────────────────────┘
//
//  🧠 Facade = NEW interface (simplified).
//     Adapter = DIFFERENT interface (compatible).
//     Decorator/Proxy = SAME interface.

/* ============================================================
 *  6️⃣ SUBSYSTEM STAYS ACCESSIBLE
 * ============================================================ */

// The Facade does NOT hide the subsystem — power users can still
// reach the individual classes.

const amp = new Amplifier();
const player = new StreamingPlayer();
const facade = new HomeTheaterFacade(
  amp, new Projector(), new Lights(), new Screen(), player
);

// High-level:
facade.watchMovie("Dune");

// Low-level (bypassing the facade):
amp.setVolume(11);
player.play("Blade Runner 2049");

// 🧠 Facade is a convenience, not a wall.

/* ============================================================
 *  7️⃣ LAYERED FACADES
 * ============================================================ */

// Subsystems often have their own internal facades.

class VideoSubsystem {
  private projector = new Projector();
  private screen = new Screen();

  start(): void { this.screen.down(); this.projector.on(); }
  stop(): void { this.projector.off(); this.screen.up(); }
}

class AudioSubsystem {
  private amp = new Amplifier();
  start(): void { this.amp.on(); this.amp.setVolume(5); }
  stop(): void { this.amp.off(); }
}

// Top-level facade orchestrates the subsystem facades.
class CinematicExperience {
  private video = new VideoSubsystem();
  private audio = new AudioSubsystem();
  private player = new StreamingPlayer();

  start(movie: string): void {
    this.video.start();
    this.audio.start();
    this.player.on();
    this.player.play(movie);
  }
  stop(): void {
    this.player.stop();
    this.player.off();
    this.audio.stop();
    this.video.stop();
  }
}

new CinematicExperience().start("Interstellar");

// 🧠 Layer facades to keep each level focused.

/* ============================================================
 *  8️⃣ GENERIC / CONFIGURABLE FACADES
 * ============================================================ */

// Config-driven facades help when a subsystem has many options.

type HomeTheaterConfig = {
  volume?: number;
  dimLevel?: number;
  widescreen?: boolean;
};

class ConfigurableTheater {
  constructor(
    private amp: Amplifier,
    private projector: Projector,
    private lights: Lights,
    private screen: Screen,
    private player: StreamingPlayer
  ) {}

  watchMovie(movie: string, cfg: HomeTheaterConfig = {}): void {
    const {
      volume = 5,
      dimLevel = 10,
      widescreen = true,
    } = cfg;

    this.lights.dim(dimLevel);
    this.screen.down();
    this.projector.on();
    if (widescreen) this.projector.wideScreenMode();
    this.amp.on();
    this.amp.setVolume(volume);
    this.player.on();
    this.player.play(movie);
  }
}

// 🔸 Returning data: facades can also AGGREGATE results.
class UserDashboardFacade {
  constructor(
    private users: { count(): Promise<number> },
    private orders: { pending(): Promise<number> },
    private revenue: { today(): Promise<number> }
  ) {}

  async getSummary() {
    const [userCount, pendingOrders, todayRevenue] = await Promise.all([
      this.users.count(),
      this.orders.pending(),
      this.revenue.today(),
    ]);
    return { userCount, pendingOrders, todayRevenue };
  }
}

/* ============================================================
 *  9️⃣ FUNCTIONAL FACADE (MODULE-LEVEL)
 * ============================================================ */

// In modern TS/JS, a facade is often just a MODULE with a clean API.
// All helpers live in this same file — no external imports needed.

// ─── Internal subsystem classes (not exported) ───
class AuthService {
  async login(email: string, password: string): Promise<string> {
    console.log(`Auth: logging in ${email}`);
    return `token-${email}`;
  }
}

class TokenStore {
  private token: string | null = null;
  save(token: string): void { this.token = token; }
  get(): string | null { return this.token; }
  clear(): void { this.token = null; }
}

class UserRepo {
  async getByEmail(email: string): Promise<{ email: string; name: string | undefined}> {
    return { email, name: email.split("@")[0] };
  }
  async byToken(token: string): Promise<{ email: string; name: string } | null> {
    return token ? { email: "x@y.com", name: "X" } : null;
  }
}

// ─── Facade instances (private to this module) ───
const auth = new AuthService();
const tokens = new TokenStore();
const users = new UserRepo();

// ─── Public facade API (exported) ───
export async function login(email: string, password: string) {
  const token = await auth.login(email, password);
  tokens.save(token);
  return users.getByEmail(email);
}

export function logout() {
  tokens.clear();
}

export function currentUser() {
  const token = tokens.get();
  return token ? users.byToken(token) : null;
}

// 🧠 A module's PUBLIC exports ARE a facade over its private helpers.
//    This is the most idiomatic form in modern TS.

// ─── Usage (same-file demo; in real code these come from another file) ───
(async () => {
  const user = await login("ravi@example.com", "secret");
  console.log("Logged in:", user);          // { email: "ravi@example.com", name: "ravi" }
  console.log("Current user:", await currentUser());
  logout();
  console.log("After logout:", await currentUser());   // null
})();

// 🧠 A module's PUBLIC exports ARE a facade over its private helpers.
//    This is the most idiomatic form in modern TS.

/* ============================================================
 *  🔟 REAL-WORLD USE CASES
 * ============================================================ */

// - Simplifying third-party SDK usage (AWS, Stripe, Firebase)
// - Wrapping complex multi-step operations (checkout, signup, publish)
// - Aggregating multiple microservice calls behind one API
// - Building a public API over internal modules
// - UI component libraries exposing a curated surface
// - Database access layers (repository facade)
// - Logging / analytics aggregators
// - Bootstrapping / teardown flows in applications
// - Feature entry points in CLI tools
//
// Frameworks / libraries:
//   - jQuery as a facade over DOM APIs
//   - Axios as a facade over `XMLHttpRequest` / `fetch`
//   - Firebase SDK as a facade over REST + auth + storage
//   - NestJS `app.get(...)` as a facade over the DI container
//   - React's `useState`/`useEffect` as facades over internals

/* ============================================================
 *  1️⃣1️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Simplifies client code — one entry point
//  - Reduces coupling between clients and subsystems
//  - Layering — hides internal structure
//  - Easy to swap subsystem implementations
//  - Reduces boilerplate and duplicated orchestration
//  - Great for onboarding / public APIs
//
// ❌ Cons
//  - Can become a "god object" if it grows unboundedly
//  - Adds a layer of indirection
//  - Doesn't prevent misuse if clients still bypass it
//  - If the facade leaks abstractions, the benefit shrinks
//  - Could become a bottleneck if it does heavy work synchronously

/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ Facade ≠ Adapter. Adapter CONVERTS an interface; Facade SIMPLIFIES
//     many interfaces into one.
// ⚠️ Facade ≠ Singleton. A facade CAN be a singleton, but that's optional.
// ⚠️ Don't let the facade grow into a GOD CLASS — split by concern.
// ⚠️ Don't force clients to use the facade exclusively. Power users
//     should still be able to reach the subsystem.
// ⚠️ Don't leak subsystem types in the facade's public API — return
//     simple, high-level types.
// ⚠️ Prefer passing subsystem instances via constructor (DI) — makes
//     testing easy and prevents hidden dependencies.
// ⚠️ Async facade methods should aggregate with `Promise.all` when
//     independent — don't await sequentially for no reason.
// ⚠️ Error handling: decide whether the facade should let low-level
//     errors bubble or wrap them in higher-level errors.
// ⚠️ For small subsystems, a module with named exports may be a
//     better "facade" than an entire class.

// 🕒 Version notes
// - Facade pattern: GoF, 1994
// - Module-based facades: ES2015 / TS 1.5
// - `Promise.all` for async facades: ES2015 / TS 2.1

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept     │ Notes                                          │
 * ─────────────────────────────────────────────────────────────
 * | Facade      │ Simplified entry point over a subsystem        │
 * | Subsystem   │ Many classes doing the real work               │
 * | Client      │ Uses facade; may also access subsystem         │
 * | Layered     │ Facades over facades                           │
 * | Module form │ Public exports = facade in modern TS           │
 * ─────────────────────────────────────────────────────────────
 *
 * | Pattern   | Intent                                              │
 * ─────────────────────────────────────────────────────────────
 * | Facade    │ SIMPLIFY many interfaces                             │
 * | Adapter   │ CONVERT one interface to another                    │
 * | Decorator │ ADD behavior; same interface                        │
 * | Proxy     │ CONTROL access; same interface                      │
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Keep facades SMALL — one concern each.
 *  - Inject subsystem dependencies via constructor.
 *  - Return HIGH-LEVEL types — don't leak subsystem details.
 *  - Allow power users to bypass the facade (don't hide subsystem).
 *  - Aggregate async calls with `Promise.all` when independent.
 *  - Decide on error-handling strategy upfront.
 *  - Layer facades for large subsystems.
 *  - Prefer module-level exports for small subsystems.
 *  - Watch for god-object drift — split when methods exceed ~10.
 *  - A facade is a convenience, not a wall.
 * ============================================================ */