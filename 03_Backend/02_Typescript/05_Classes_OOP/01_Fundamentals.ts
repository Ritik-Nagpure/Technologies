// ===============================
// 🧱 CLASS FUNDAMENTALS
// ===============================
// This file covers the foundational concepts of classes in TypeScript,
// including how to declare a class, instantiate it, and use methods and accessors.

// ✅ Class Declaration & Instantiation
// This class represents a simple person with a name and a greeting method.
class Person {
  name: string;

  // Constructor initializes the 'name' property when a new Person is created.
  constructor(name: string) {
    this.name = name;
  }

  // greet() is a method that prints a personalized greeting.
  // It's a public method accessible to any code using the class.
  greet() {
    console.log(`Hello, ${this.name}`);
  }
}

// Creating an instance of Person and calling its method.
const p1 = new Person("Aarav");
p1.greet(); // Output: Hello, Aarav

// ✅ Methods and Accessors (get/set)
// This class represents a rectangle and demonstrates encapsulation using private properties.
class Rectangle {
  // Private properties 'width' and 'height' are hidden from outside access.
  constructor(private width: number, private height: number) {}

  // Getter method 'area' calculates and returns the area of the rectangle.
  // It allows read-only access to a derived value.
  get area(): number {
    return this.width * this.height;
  }

  // Setter method 'dimensions' allows updating both width and height at once.
  // It provides controlled write access to internal state.
  set dimensions([w, h]: [number, number]) {
    this.width = w;
    this.height = h;
  }
}

// Creating an instance and using accessors.
const rect = new Rectangle(10, 5);
console.log(rect.area); // Output: 50

// Updating dimensions using the setter.
rect.dimensions = [20, 10];
console.log(rect.area); // Output: 200

// ===============================
// ❓ Trick Questions
// ===============================
// - Can you instantiate a class without calling its constructor? ❌ No.
// - Can a class have multiple constructors? ❌ Not directly—use overloads with union types.
// - Can you access private properties directly? ❌ No—use accessors or public methods.
