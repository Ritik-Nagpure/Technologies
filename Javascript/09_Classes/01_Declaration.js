// Declaring a Class

class Car {
    // Declaring a Constructor
    constructor(name, engine) {
        this.name = name;
        this.engine = engine;
    }
    // Declaring a Method
    run() {
        console.log(this.name + " is running....");
    }
}

let c1 = new Car("volvo", "Petrol");
let c2 = new Car();
c2.name = "BMW";
c2.engine = "Deisel";

console.log(c1);
console.log(c2);

c2.run();

let c3 = 1;

// Checking Class with instanceof operator
// retuns true is the object is an instance of a class else false
console.log(c1 instanceof Car);
console.log(c2 instanceof Car);
console.log(c3 instanceof Car);
