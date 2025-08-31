"use strict";
// objectTypesNotes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const user1 = {
    id: 101,
    name: "Aarav",
    isActive: true,
};
console.log("Interface:", user1);
// ✅ Class
// Blueprint for creating objects with properties and methods
class Animal {
    species;
    constructor(species) {
        this.species = species;
    }
    speak() {
        console.log(`${this.species} makes a sound.`);
    }
}
const dog = new Animal("Dog");
dog.speak();
// ✅ Enum
// Defines a set of named constants for better readability and control
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
const move = Direction.Left;
console.log("Enum:", move); // Output: 2
// ✅ Array
// A list of values of the same type
const fruits = ["Apple", "Banana", "Mango"];
console.log("Array:", fruits);
// ✅ Tuple
// A fixed-length array with specific types at each position
const userTuple = [1, "Aarav", true];
console.log("Tuple:", userTuple);
// ✅ Object Literal
// Directly defines an object with specific property types
const settings = {
    theme: "dark",
    notifications: true,
};
console.log("Object Literal:", settings);
