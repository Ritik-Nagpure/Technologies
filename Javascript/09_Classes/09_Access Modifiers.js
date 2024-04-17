// Private and protected properties and methods
// converting toy class into private and protected class

// Protected ==> are only accessible to the object and its descendants.
// Private ==> are not accessible outside of the object

class Toy {
    _toyname = "Robert"; // Protected properties are usually prefixed with an underscore _
    #toyage; // Privates should start with #. They are only accessible from inside the class.

    constructor() {

    }
    get name() {
        return this._toyname;
    }

    get age() {
        return this.#toyage;
    }

    set name(x) {
        this._toyname = x;
    }

    set age(x) {
        this.#toyage = x;
    }

}


let toy = new Toy();
console.log(toy);

toy.name = "Chukky";
toy.age = 45;

console.log(toy);

// console.log(toy._toyname);
// console.log(toy.#toyage);

console.log(toy.name);
console.log(toy.age);


// Read-only “power”
// For power property, let’s make it read-only. It sometimes happens that a property must be set at creation time only, and then never modified. That’s exactly the case for a coffee machine: power never changes. To do so, we only need to make getter, but not the setter:

class CoffeeMachine {
    #power;
    constructor(x) {
        this.#power = x;
    }

    get power() {
        return this.#power;
    }
}
let coffeeMachine = new CoffeeMachine(100);

console.log(`Power is: ${coffeeMachine.power}W`); // Power is: 100W
coffeeMachine.power = 25; // Error (no setter)
// coffeeMachine.#power = 25; // cannot modify directly as it is private no accesible outside of class
console.log(`Power is: ${coffeeMachine.power}W`); // Power is: 100W

