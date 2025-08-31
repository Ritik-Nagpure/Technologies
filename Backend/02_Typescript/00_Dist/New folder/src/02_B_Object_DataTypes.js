"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Composite Datatypes
// Arrays
let arrnum = [3, 4, 5, 6,];
let arrstr = ["Husky", "Sexo", "Octya"];
//Custom / Typescript datatypes
// Tuple : A tuple is a typed array with a pre-defined length and types for each index.
let tuplevar = ["hello", 10]; // Value arrangement should be same as type annotation
console.log(tuplevar);
// ENUM : An enum is a special "class" that represents a group of constants (unchangeable variables).  Enums come in two flavors string and numeric.
var CardinalDirections;
(function (CardinalDirections) {
    CardinalDirections["North"] = "North";
    CardinalDirections["East"] = "East";
    CardinalDirections["South"] = "South";
    CardinalDirections["West"] = "West";
})(CardinalDirections || (CardinalDirections = {}));
;
let c = CardinalDirections.North;
console.log(c);
function volume(shape) {
    return shape.height * shape.length * shape.width;
}
const cube = {
    height: 5,
    width: 5,
    length: 5
};
console.log(volume(cube));
// Class
// a class is a blueprint for creating objects with specific properties and methods. 
class Animal {
    name;
    sound;
    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }
    makeSound() {
        console.log(`${this.name} makes a sound: ${this.sound}`);
    }
}
const cat = new Animal("Cat", "Meow");
cat.makeSound();
