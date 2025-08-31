// ===============================
// 🔐 Type Guards & Type Narrowing in TypeScript
// Type guards are a way to narrow down the type of a variable. 
// This is useful when you want to do something different depending on the type of a variable.
// ===============================

// 🔹 1. TYPEOF GUARD
// The typeof operator is used to check the type of a variable. 
// It returns a string value representing the type of the variable.
// Used for primitive types: 'string', 'number', 'boolean', 'symbol', 'undefined', 'object', 'function'

function printValue(val: string | number) {
  if (typeof val === "string") {
    console.log("String value:", val.toUpperCase());
  } else {
    console.log("Number value:", val.toFixed(2));
  }
}

// 🔹 2. INSTANCEOF GUARD
// The instanceof operator is a way to narrow down the type of a variable. 
// It is used to check if an object is an instance of a class.
// Used for class instances

class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function handlePet(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    pet.bark();
  } else {
    pet.meow();
  }
}

// 🔹 3. EQUALITY CHECK
// TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types. 
// Narrowing using comparison

type Admin = { role: "admin"; privileges: string[] };
type User = { role: "user"; email: string };

function getRole(person: Admin | User) {
  if (person.role === "admin") {
    console.log("Admin privileges:", person.privileges);
  } else {
    console.log("User email:", person.email);
  }
}

// 🔹 4. TRUTHINESS GUARD
// Checks for null, undefined, or falsy values

function processInput(input?: string) {
  if (input) {
    console.log("Input provided:", input.trim());
  } else {
    console.log("No input");
  }
}

// 🔹 5. TYPE PREDICATE
// Custom function that tells TypeScript the type

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// ===============================
// 🧠 Summary:
// - typeof: for primitives
// - instanceof: for class instances
// - equality: compare property values
// - truthiness: check for null/undefined
// - type predicates: custom guards for complex types
// ===============================
