// Composite Datatypes
// Arrays
let arrnum: number[] = [3, 4, 5, 6,];
let arrstr: Array<string> = ["Husky", "Sexo", "Octya"]


//Custom / Typescript datatypes
// Tuple : A tuple is a typed array with a pre-defined length and types for each index.
let tuplevar: [string, number] = ["hello", 10]; // Value arrangement should be same as type annotation
console.log(tuplevar);

// ENUM : An enum is a special "class" that represents a group of constants (unchangeable variables).  Enums come in two flavors string and numeric.
enum CardinalDirections {
    North = 'North',
    East = "East",
    South = "South",
    West = "West"
};
let c: CardinalDirections = CardinalDirections.North;
console.log(c);


// ------------------
// Interface
// an interface defines the structure of an object by specifying the properties and their types. 
// Interfaces can also describe functions and their signatures.
interface dimensions {
    length: number;
    width: number;
    height: number;
}

function volume(shape: dimensions) {
    return shape.height * shape.length * shape.width;
}

const cube: dimensions = {
    height: 5,
    width: 5,
    length: 5
}

console.log(volume(cube));

// Class
// a class is a blueprint for creating objects with specific properties and methods. 


class Animal {
    name: string;
    sound: string;

    constructor(name: string, sound: string) {
        this.name = name;
        this.sound = sound;
    }

    makeSound() {
        console.log(`${this.name} makes a sound: ${this.sound}`);
    }
}

const cat = new Animal("Cat", "Meow");

cat.makeSound(); 