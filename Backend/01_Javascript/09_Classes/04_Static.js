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

obj1 = {name1 : 'Ha Ha !! Done'}
obj2 = {name : 'Ha Ha !! Done'}

let mycar = new Car("Mahindra");
console.log(Car.hello(mycar));
console.log(Car.hello({name : 'PINKY'}));

// parameter/argument is a string/number [ primitive datatype] not a class instance object so the output is undefined always
console.log(Car.hello('Hi'));
// parameter/argument is a object so the output is depends on the presence of the property with same name inside it
console.log(Car.hello(obj1)); 
console.log(Car.hello(obj2)); 
// throws error as only available in class object and takes instance as parameter
console.log(mycar.hello('Hi'));  
