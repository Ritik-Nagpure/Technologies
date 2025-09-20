// ===============================
// 🧬 INHERITANCE & POLYMORPHISM
// ===============================
// This file covers the core OOP concepts of inheritance and polymorphism,
// showing how TypeScript enables class hierarchies and dynamic behavior.

// ✅ Inheritance
// Inheritance allows a class to reuse and specialize behavior from a parent class.
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // speak() is a general method that all animals share.
  speak(): void {
    console.log(`${this.name} makes a sound.`);
  }
}

// Dog extends Animal and inherits its properties and methods.
class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // Call the parent constructor
    this.breed = breed;
  }

  // Overriding the speak() method to provide dog-specific behavior.
  speak(): void {
    console.log(`${this.name} barks. Breed: ${this.breed}`);
  }
}

const dog = new Dog("Buddy", "Labrador");
dog.speak(); // Buddy barks. Breed: Labrador

// ✅ Polymorphism
// Polymorphism allows different classes to be treated through a common interface or base class.
class Cat extends Animal {
  speak(): void {
    console.log(`${this.name} meows.`);
  }
}

const animals: Animal[] = [
  new Dog("Max", "Beagle"),
  new Cat("Whiskers"),
];

// Each animal responds differently to the same method call.
animals.forEach((animal) => animal.speak());
// Output:
// Max barks. Breed: Beagle
// Whiskers meows.

// ✅ Method Overriding
// Overriding means redefining a method from the base class in a subclass.
class Printer {
  print(): void {
    console.log("Printing document...");
  }
}

class ColorPrinter extends Printer {
  // Overrides the base method and adds extra behavior.
  print(): void {
    super.print(); // Optional: preserve base behavior
    console.log("Using color ink.");
  }
}

const cp = new ColorPrinter();
cp.print();
// Output:
// Printing document...
// Using color ink.

// ✅ Abstract Classes
// Abstract classes define a blueprint and cannot be instantiated directly.
abstract class Shape {
  constructor(public color: string) {}

  // Abstract method must be implemented by subclasses.
  abstract getArea(): number;
}

class Circle extends Shape {
  constructor(color: string, private radius: number) {
    super(color);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

const circle = new Circle("blue", 5);
console.log(circle.getArea()); // 78.53981633974483

// ✅ Abstraction
// Abstraction hides internal details and exposes only essential features.
// Abstract classes and interfaces enforce abstraction by defining contracts.

// ===============================
// ❓ Trick Questions
// ===============================
// - Can you instantiate an abstract class? ❌ No.
// - Can abstract methods have a body? ❌ No—they must be implemented.
// - Can you override a method with a different return type? ❌ No—must match signature.
// - Can you call super.method() in an overridden method? ✅ Yes.
// - Can a subclass override a constructor? ✅ Yes—but must call super().


// ===============================
// 🧬 INHERITANCE & POLYMORPHISM + ADVANCED OOP CONCEPTS
// ===============================
// This file focuses on deeper OOP principles beyond basic inheritance and overriding,
// including polymorphism, substitution, and SOLID design principles.

// ✅ Multiple Inheritance via Interfaces
// TypeScript doesn't support multiple class inheritance, but interfaces can simulate it.
interface Logger {
  log(message: string): void;
}

interface Serializer {
  serialize(): string;
}

// Implements multiple interfaces
class DataModel implements Logger, Serializer {
  constructor(private data: string) {}

  log(message: string): void {
    console.log("LOG:", message);
  }

  serialize(): string {
    return JSON.stringify({ data: this.data });
  }
}

// ✅ Dynamic Dispatch
// Dynamic dispatch ensures that the correct method is called based on the runtime type.
class Shape2 {
  draw(): void {
    console.log("Drawing a generic shape");
  }
}

class Triangle extends Shape2 {
  draw(): void {
    console.log("Drawing a triangle");
  }
}

function render(shape: Shape2) {
  shape.draw(); // Calls the correct method based on actual object type
}

render(new Triangle()); // Output: Drawing a triangle

// ✅ Liskov Substitution Principle (LSP)
// Subtypes must be substitutable for their base types without altering correctness.
class Bird {
  fly(): string {
    return "Flying";
  }
}

class Penguin extends Bird {
  // Violates LSP if fly() throws or behaves unexpectedly
  fly(): string {
    throw new Error("Penguins can't fly"); // ❌ Bad design
  }
}

// ✅ Open/Closed Principle (OCP)
// Classes should be open for extension but closed for modification.
abstract class Notification {
  abstract send(): void;
}

class EmailNotification extends Notification {
  send() {
    console.log("Sending email");
  }
}

class SMSNotification extends Notification {
  send() {
    console.log("Sending SMS");
  }
}

function notifyAll(notifiers: Notification[]) {
  notifiers.forEach(n => n.send());
}

// ✅ Interface Segregation Principle (ISP)
// Clients shouldn't be forced to depend on interfaces they don't use.
interface FullPrinter {
  print(): void;
  scan(): void;
  fax(): void;
}

// Segregated interfaces
interface SimplePrinter {
  print(): void;
}

class BasicPrinter implements SimplePrinter {
  print() {
    console.log("Printing only");
  }
}

// ✅ Dependency Inversion Principle (DIP)
// High-level modules should depend on abstractions, not concrete implementations.
interface Storage {
  save(data: string): void;
}

class FileStorage implements Storage {
  save(data: string) {
    console.log("Saving to file:", data);
  }
}

class AppService {
  constructor(private storage: Storage) {}

  persist(data: string) {
    this.storage.save(data);
  }
}

const service = new AppService(new FileStorage());
service.persist("User data");

// ===============================
// ❓ Trick Questions
// ===============================
// - Can TypeScript support multiple class inheritance? ❌ No—only via interfaces.
// - Can dynamic dispatch fail if method is missing? ✅ Yes—ensure base class defines it.
// - Is LSP violated if subclass throws where base returns? ✅ Yes—avoid behavioral mismatch.
// - Can you follow OCP without abstract classes? ✅ Yes—use interfaces or strategy patterns.
// - Is ISP about splitting interfaces? ✅ Yes—keep them focused.
// - Can DIP be applied without a framework? ✅ Absolutely—use constructor injection.
