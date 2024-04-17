import { Animal } from "./01_Export.js";

class Dog extends Animal {
    constructor(name, breed) {
        super(breed);
        this.name = name;
    }
}

let husky = new Dog("Dollar", "Husky");
husky.ability = "Drama";
console.log(husky.ability);
