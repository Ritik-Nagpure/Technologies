// objectTypesNotes.ts

// ✅ Interface
// Defines the shape of an object with named properties and types
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const user1: User = {
  id: 101,
  name: "Aarav",
  isActive: true,
};
console.log("Interface:", user1);

// ✅ Class
// Blueprint for creating objects with properties and methods
class Animal {
  species: string;

  constructor(species: string) {
    this.species = species;
  }

  speak(): void {
    console.log(`${this.species} makes a sound.`);
  }
}

const dog = new Animal("Dog");
dog.speak();

// ✅ Enum
// Defines a set of named constants for better readability and control
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const move: Direction = Direction.Left;
console.log("Enum:", move); // Output: 2

// ✅ Array
// A list of values of the same type
const fruits: string[] = ["Apple", "Banana", "Mango"];
console.log("Array:", fruits);

// ✅ Tuple
// A fixed-length array with specific types at each position
const userTuple: [number, string, boolean] = [1, "Aarav", true];
console.log("Tuple:", userTuple);

// ✅ Object Literal
// Directly defines an object with specific property types
const settings: { theme: string; notifications: boolean } = {
  theme: "dark",
  notifications: true,
};
console.log("Object Literal:", settings);
