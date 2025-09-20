/*
===============================
🔄 COMPARISON & INTEGRATION
===============================    
This file explores how TypeScript handles structural and behavioral contracts,
comparing interfaces and classes, and explaining how objects relate to both.

✅ What is Comparison & Integration in TypeScript?
It’s about understanding how interfaces, classes, and objects relate to each other and how they work together.

🧩 Why is it important?
Because in real-world TypeScript projects, you often:
    Use interfaces to define the shape of data (like a blueprint).
    Use classes to build reusable components with behavior.
    Use objects to store and pass around actual data.
Knowing how they compare and integrate helps you:
    Write cleaner, more flexible code.
    Avoid bugs caused by mismatched types.
    Build systems that are easy to extend and maintain.

    
    Concept	              What it is	                        Why it matters
Interface	    A contract for structure	                Ensures consistency across components
Class	        Blueprint with behavior	                    Adds logic and reusability
Object	        Actual data instance	                    Used in real operations and functions

*/
// ✅ Interfaces vs Classes
// Interfaces define the shape (structure) of an object, while classes define both structure and behavior.

interface IUser {
  name: string;
  login(): void;
}

// Admin class implements IUser interface, fulfilling its structural contract.
class Admin implements IUser {
  constructor(public name: string) {}

  // login() provides behavior required by the interface.
  login(): void {
    console.log(`${this.name} logged in`);
  }
}

// Interfaces are purely structural—they cannot contain implementation.
// Classes can implement multiple interfaces, but can only extend one class.

interface Auditable {
  audit(): void;
}

class SuperAdmin extends Admin implements Auditable {
  audit(): void {
    console.log(`${this.name} performed an audit`);
  }
}

// ✅ Class vs Object
// A class is a blueprint for creating objects.
// An object is an instance of a class or a literal structure.

class Vehicle {
  constructor(public type: string) {}

  drive(): void {
    console.log(`Driving a ${this.type}`);
  }
}

const v1 = new Vehicle("Car"); // Class instance
v1.drive(); // Driving a Car

const v2 = {
  type: "Bike",
  drive: () => console.log("Driving a Bike"),
}; // Object literal with same shape

// ✅ Structural Typing
// TypeScript uses "duck typing"—if it looks like a type, it is that type.

function operate(vehicle: { type: string; drive(): void }) {
  vehicle.drive();
}

operate(v1); // ✅ Class instance
operate(v2); // ✅ Object literal

// ✅ Interface Extension vs Class Inheritance
// Interfaces can extend multiple interfaces.
// Classes can only extend one class but implement multiple interfaces.

interface Person {
  name: string;
}

interface Employee extends Person {
  employeeId: number;
}

class Staff implements Employee {
  constructor(public name: string, public employeeId: number) {}
}

// ✅ Integration: Interfaces with Classes
// Interfaces are often used to define contracts for class-based APIs.

interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log("LOG:", message);
  }
}

// ✅ Integration: Objects with Interfaces
// Object literals can also conform to interfaces without using classes.

const simpleLogger: Logger = {
  log: (msg) => console.log("Simple log:", msg),
};

// ✅ Trick Questions
// - Can interfaces contain implementation? ❌ No—only structure.
// - Can classes implement multiple interfaces? ✅ Yes.
// - Can interfaces extend classes? ❌ No—but they can extend other interfaces.
// - Can objects conform to interfaces without using classes? ✅ Yes—via structural typing.
// - Can you instantiate an interface? ❌ No—it’s not a runtime construct.
