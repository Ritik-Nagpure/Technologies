// Class fields is a syntax that allows to add any properties.
// For instance, let’s add name property to class User:

class Toy {

    toyname = "Robert"; // default value
    toyage; // no default value just initialise has value undefined

    constructor() {

    }
    get name() {
        return this.toyname;
    }

    get age() {
        return this.toyage;
    }

    set name(x) {
        this.toyname = x;
    }

    set age(x) {
        this.toyage = x;
    }

}


let toy = new Toy();
console.log(toy);

toy.name = "Chukky";
toy.age = 45;

console.log(toy);

console.log(toy.toyname);
console.log(toy.toyage);

console.log(toy.name);
console.log(toy.age);
