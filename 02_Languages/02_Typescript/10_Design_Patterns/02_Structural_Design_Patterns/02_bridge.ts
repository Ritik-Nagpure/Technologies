// 05_Classes_OOP/14_Bridge_Pattern.ts

/* ============================================================
 *  📘 THE BRIDGE PATTERN IN TYPESCRIPT
 *
 *  Bridge DECOUPLES an abstraction from its implementation so
 *  that both can vary INDEPENDENTLY.
 *
 *  Sections:
 *   1. Core idea
 *   2. Participants
 *   3. The problem Bridge solves
 *   4. Basic implementation (shapes + renderers)
 *   5. Another example (remote + devices)
 *   6. Bridge vs Strategy vs Adapter
 *   7. Generic bridge (type-safe)
 *   8. Real-world use cases
 *   9. Pros & cons
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */

/* ============================================================
 *  1️⃣ CORE IDEA
 * ============================================================ */

// When a class has TWO (or more) independent dimensions of
// variation, naive inheritance explodes:
//
//   Shape × Renderer → CircleVector, CircleRaster, SquareVector, SquareRaster, ...
//
// Bridge separates the dimensions:
//   - Abstraction      → "what" (Shape)
//   - Implementation   → "how" (Renderer)
//   - Abstraction HOLDS a reference to Implementation.
//
// Both hierarchies can grow independently:
//   Add new shape OR new renderer without touching the other side.

/* ============================================================
 *  2️⃣ PARTICIPANTS
 * ============================================================ */

// ┌────────────────────┬───────────────────────────────────────────┐
// │ Role               │ Responsibility                             │
// ├────────────────────┼───────────────────────────────────────────┤
// │ Abstraction        │ High-level control, holds Implementor ref  │
// │ RefinedAbstraction │ Extends Abstraction with extra behavior    │
// │ Implementor        │ Low-level interface (the "how")            │
// │ ConcreteImplementor│ Concrete implementation of the "how"       │
// └────────────────────┴───────────────────────────────────────────┘

/* ============================================================
 *  3️⃣ THE PROBLEM BRIDGE SOLVES
 * ============================================================ */

// ─── Naive inheritance explosion ───
//
//          Shape
//        /       \
//    Circle      Square
//    /  \        /  \
// VecCircle RasterCircle VecSquare RasterSquare
//
// Add "Triangle" → 2 more classes.
// Add "SVG" renderer → 4 more classes.
// M × N classes for M shapes and N renderers.

// ─── With Bridge ───
//
//    Shape ──────holds──▶ Renderer
//    ├ Circle              ├ VectorRenderer
//    ├ Square              ├ RasterRenderer
//    └ Triangle            └ SVGRenderer
//
// M + N classes. Both sides vary independently.

/* ============================================================
 *  4️⃣ BASIC IMPLEMENTATION — SHAPES × RENDERERS
 * ============================================================ */

// ─── Implementor: the "how" ───
interface Renderer {
  renderCircle(radius: number): string;
  renderSquare(side: number): string;
}

// ─── Concrete Implementors ───
class VectorRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `Vector: drawing circle with radius ${radius}`;
  }
  renderSquare(side: number): string {
    return `Vector: drawing square with side ${side}`;
  }
}

class RasterRenderer implements Renderer {
  renderCircle(radius: number): string {
    return `Raster: pixels for circle radius ${radius}`;
  }
  renderSquare(side: number): string {
    return `Raster: pixels for square side ${side}`;
  }
}

// ─── Abstraction: the "what" ───
abstract class Shape {
  // The BRIDGE — a reference to the implementor.
  constructor(protected renderer: Renderer) {}

  abstract draw(): string;
  abstract resize(factor: number): void;
}

// ─── Refined Abstractions ───
class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) {
    super(renderer);
  }
  draw(): string { return this.renderer.renderCircle(this.radius); }
  resize(factor: number): void { this.radius *= factor; }
}

class Square extends Shape {
  constructor(renderer: Renderer, private side: number) {
    super(renderer);
  }
  draw(): string { return this.renderer.renderSquare(this.side); }
  resize(factor: number): void { this.side *= factor; }
}

// ─── Client code — picks abstraction and implementation independently ───
const vectorCircle = new Circle(new VectorRenderer(), 5);
const rasterCircle = new Circle(new RasterRenderer(), 5);
const vectorSquare = new Square(new VectorRenderer(), 10);

console.log(vectorCircle.draw());   // Vector: drawing circle with radius 5
console.log(rasterCircle.draw());   // Raster: pixels for circle radius 5
console.log(vectorSquare.draw());   // Vector: drawing square with side 10

// 🧠 Client picks BOTH axes independently:
//    new Circle(new VectorRenderer(), 5)
//              ↑ how              ↑ what

/* ============================================================
 *  5️⃣ ANOTHER EXAMPLE — REMOTES × DEVICES
 * ============================================================ */

// ─── Implementor ───
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(v: number): void;
}

// ─── Concrete Implementors ───
class TV implements Device {
  private on = false;
  private volume = 30;
  isEnabled() { return this.on; }
  enable() { this.on = true; }
  disable() { this.on = false; }
  getVolume() { return this.volume; }
  setVolume(v: number) { this.volume = v; }
}

class Radio implements Device {
  private on = false;
  private volume = 10;
  isEnabled() { return this.on; }
  enable() { this.on = true; }
  disable() { this.on = false; }
  getVolume() { return this.volume; }
  setVolume(v: number) { this.volume = v; }
}

// ─── Abstraction ───
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    this.device.isEnabled() ? this.device.disable() : this.device.enable();
  }
  volumeUp(): void { this.device.setVolume(this.device.getVolume() + 1); }
  volumeDown(): void { this.device.setVolume(this.device.getVolume() - 1); }
}

// ─── Refined Abstraction — adds features without touching Device ───
class AdvancedRemote extends RemoteControl {
  mute(): void { this.device.setVolume(0); }
  setVolume(v: number): void { this.device.setVolume(v); }
}

// ─── Client ───
const tv = new TV();
const remote = new RemoteControl(tv);
remote.togglePower();
remote.volumeUp();

const radio = new Radio();
const advRemote = new AdvancedRemote(radio);
advRemote.togglePower();
advRemote.setVolume(50);
advRemote.mute();

// 🧠 Add a "smart speaker" Device? No change to RemoteControl.
//    Add a "voice remote"? No change to Device.

/* ============================================================
 *  6️⃣ BRIDGE vs STRATEGY vs ADAPTER
 * ============================================================ */

// ┌──────────────┬────────────────────────────────────────────────┐
// │ Pattern      │ Purpose / Timing                                │
// ├──────────────┼────────────────────────────────────────────────┤
// │ Bridge       │ Designed UP FRONT — two independent dimensions  │
// │ Strategy     │ Swap ONE algorithm at runtime — one dimension   │
// │ Adapter      │ RETROFIT — make existing classes compatible     │
// └──────────────┴────────────────────────────────────────────────┘
//
//  🧠 Bridge is often a "Strategy at the class design level".
//     Strategy typically lives inside ONE class; Bridge spans a
//     hierarchy of abstractions and implementations.

/* ============================================================
 *  7️⃣ GENERIC BRIDGE (TYPE-SAFE)
 * ============================================================ */

// Generic bridge parameterized by the implementor type.

interface Serializer<T> {
  serialize(value: T): string;
}

class JsonSerializer<T> implements Serializer<T> {
  serialize(value: T): string { return JSON.stringify(value); }
}

class XmlSerializer<T> implements Serializer<T> {
  serialize(value: T): string { return `<value>${String(value)}</value>`; }
}

// Abstraction parameterized by BOTH the data and serializer.
abstract class Exporter<T> {
  constructor(protected serializer: Serializer<T>) {}
  abstract export(data: T): string;
}

class FileExporter<T> extends Exporter<T> {
  constructor(serializer: Serializer<T>, private path: string) {
    super(serializer);
  }
  export(data: T): string {
    return `Writing to ${this.path}: ${this.serializer.serialize(data)}`;
  }
}

class HttpExporter<T> extends Exporter<T> {
  constructor(serializer: Serializer<T>, private url: string) {
    super(serializer);
  }
  export(data: T): string {
    return `POST ${this.url}: ${this.serializer.serialize(data)}`;
  }
}

const jsonFile = new FileExporter(new JsonSerializer<{ a: number }>(), "/out.json");
const xmlHttp = new HttpExporter(new XmlSerializer<{ a: number }>(), "/api");

console.log(jsonFile.export({ a: 1 }));
console.log(xmlHttp.export({ a: 1 }));

/* ============================================================
 *  8️⃣ REAL-WORLD USE CASES
 * ============================================================ */

// - Graphics libraries: Shape × Renderer (vector/raster/webgl)
// - Device control: Remote × Device (TV/Radio/Speaker)
// - Persistence: Entity × Storage (SQL/NoSQL/In-memory)
// - Logging: Message × Transport (console/file/http)
// - Serialization: Data × Format (JSON/XML/YAML/Proto)
// - Messaging: Publisher × Broker (Kafka/RabbitMQ/SQS)
// - Cloud SDKs: Operations × Provider (AWS/GCP/Azure)
// - File systems: Operations × Backend (local/S3/GCS)
// - Windows toolkits: Window × Platform (Win/Mac/Linux)
//
// Frameworks using Bridge-like designs:
//   - JDBC (driver abstraction + connection implementation)
//   - Express.js (middleware chain = abstraction; adapters = impl)
//   - React (components × renderer — DOM / native / test renderer)

/* ============================================================
 *  9️⃣ PROS & CONS
 * ============================================================ */

// ✅ Pros
//  - Both axes vary INDEPENDENTLY (M + N instead of M × N)
//  - Clean separation of "what" and "how"
//  - Follows Open/Closed — extend either side freely
//  - Avoids deep inheritance hierarchies
//  - Enables runtime swapping of the implementor
//
// ❌ Cons
//  - More classes and indirection than a simple inheritance setup
//  - Overkill if only ONE axis will ever vary
//  - Initial design cost — you must anticipate both axes
//  - Can be confused with Strategy — pick the right one

/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */

// ⚠️ The implementor reference should typically be `protected` or
//     `private readonly` — the abstraction owns it.
// ⚠️ Don't add business logic to the implementor — it should stay
//     focused on the "how". Business rules live in the abstraction.
// ⚠️ If only one axis varies, use Strategy instead — Bridge is overkill.
// ⚠️ Avoid mutable state shared BETWEEN abstraction and implementor
//     unless intentional — introduces coupling.
// ⚠️ Bridge is a DESIGN-TIME decision. Don't retrofit it onto a
//     small class hierarchy — the extra classes don't pay off.
// ⚠️ In TypeScript's structural typing, sometimes a plain interface
//     with a `strategy` field is enough — a formal class hierarchy
//     isn't always required.
// ⚠️ Watch out for diamond problems if you inherit on BOTH axes.
//     Keep abstractions and implementors SEPARATE hierarchies.
// ⚠️ Generic bridges often look like "Strategy on steroids" — call
//     it Bridge only if you genuinely have two INDEPENDENT axes.

// 🕒 Version notes
// - Bridge pattern: GoF, 1994
// - Generic bridge: TS 1.0+
// - `abstract` classes: TS 1.0
// - Default type parameters for bridges: TS 2.3+
// - Const type params for literal-heavy bridges: TS 5.0

/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Concept              | Notes                                    |
 * ─────────────────────────────────────────────────────────────
 * | Abstraction          | High-level control ("what")              |
 * | RefinedAbstraction   | Adds features to Abstraction             |
 * | Implementor          | Low-level interface ("how")              |
 * | ConcreteImplementor  | Concrete "how"                           |
 * | Bridge reference     │ Abstraction holds Implementor         │
 * └──────────────────────┴──────────────────────────────────────┘
 *
 * | Pattern  | Key trait                                          |
 * ─────────────────────────────────────────────────────────────
 * | Bridge   | Two INDEPENDENT hierarchies, designed up-front     |
 * | Strategy | One behavior swapped at runtime — one dimension    |
 * | Adapter  | Retrofit — make existing classes compatible        |
 * └────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use Bridge when there are TWO independent axes of variation.
 *  - Keep the implementor focused on the "how" only.
 *  - Prefer composition over a class adapter approach.
 *  - Store the implementor reference as `protected readonly`.
 *  - Design the implementor interface MINIMAL.
 *  - If only ONE axis varies → use Strategy instead.
 *  - If retrofitting legacy code → use Adapter.
 *  - Avoid mixing business logic into the implementor.
 *  - Keep the two hierarchies separate — don't cross-inherit.
 *  - Generic bridges improve type safety when data types vary too.
 * ============================================================ */