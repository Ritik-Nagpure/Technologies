// Declaring a Class

class Car {
    // Declaring a Constructor
    // constructor(name, engine) {
    //     this.name = name;
    //     this.engine = engine;
    // }
    constructor() { }
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



let c4 = Object.create(new Car('ALPHA ROMEO', 'Sarso ka tel'));
console.log(c4);
console.log(c4.name);

let auto = {
    lavda : "nahi hai",
    constructor(fuel) {

    },

    hi() {
        console.log('HI');

    }
}

let c5 = auto;
console.log(c5);
console.log(c5.fuel);


console.log(c5.lavda); 
console.log(auto.lavda); 
c5.lavda = 'Ghum gaya';
console.log(c5.lavda);
console.log(auto.lavda);

c5.hi()
