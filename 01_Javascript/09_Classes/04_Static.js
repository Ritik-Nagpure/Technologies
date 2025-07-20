// JavaScript Static Methods
// Static class methods are defined on the class itself.
// You cannot call a static method on an object, only on an object class.

class Car {
    constructor(name) {
        this.name = name;
    }
    static hello(x) {
        return "Hello " + x.name;
    }
}

let mycar = new Car("Mahindra");
console.log(Car.hello(mycar));