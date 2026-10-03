// ===============================
// 🎨 ADVANCED FEATURES: DECORATORS
// ===============================
// This file introduces decorators in TypeScript—special functions that can modify or annotate classes,
// methods, properties, or parameters. Decorators are a powerful metaprogramming tool.

// ✅ What is a Decorator?
// A decorator is a function that gets called at runtime and can modify or enhance the behavior of a class or its members.

// ✅ Enabling Decorators
// You must enable `experimentalDecorators` in tsconfig.json to use them.

// ✅ Class Decorator
// A class decorator receives the constructor function and can modify or log metadata.

function Logger(constructor: Function) {
  console.log(`Class ${constructor.name} has been initialized`);
}

// Applying the decorator to a class
@Logger
class Service {
  constructor() {
    console.log("Service instance created");
  }
}

// Output:
// Class Service has been initialized
// Service instance created

// ✅ Decorator Factory
// A decorator factory returns a decorator function and allows customization.

function Sealed(name: string) {
  return function (constructor: Function) {
    Object.seal(constructor); // Prevents adding new properties to the class
    Object.seal(constructor.prototype); // Prevents adding methods to the prototype
    console.log(`Sealed class: ${name}`);
  };
}

@Sealed("MyClass")
class MyClass {
  message = "Hello";
}

// ✅ Why Use Decorators?
// - Logging and analytics
// - Dependency injection
// - Access control
// - Metadata tagging
// - Framework-level annotations (e.g., Angular)

// ✅ Decorator Types (Brief Overview)
// - Class decorators: modify or annotate the class
// - Method decorators: wrap or modify method behavior
// - Property decorators: observe or transform property access
// - Parameter decorators: tag parameters for injection or validation

// ✅ Example: Method Decorator (basic logging)
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(2, 3)); // Logs method call and result

// ===============================
// ❓ Trick Questions
// ===============================
// - Do decorators run at compile time? ❌ No—they run at runtime.
// - Can you use decorators without enabling `experimentalDecorators`? ❌ No—must be enabled in tsconfig.
// - Can decorators modify class behavior? ✅ Yes—especially with factories.
// - Can you apply multiple decorators to one class? ✅ Yes—they stack top-down.
// - Are decorators part of standard JavaScript? ❌ No—still a TypeScript/ES proposal.
