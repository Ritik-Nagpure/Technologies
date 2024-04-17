// By calling the super() method in the constructor method, we call the parent's constructor method and gets access to the parent's properties and methods.

class Car {
    constructor(name) {
        this.carname = name;
    }
    run() {
        console.log(this.carname + " is running ...");
    }
    trunk() {
        console.log("It has a Trunk");
    }
    present() {
        return 'I have a ' + this.carname;
    }
}

class Model extends Car {
    constructor(brand, mod) {
        super(brand); // The super() method refers to the parent class.
        this.model = mod;
    }

    show() {
        return this.present() + ', it is a ' + this.model; // overriding a method
    }
}

let myCar = new Model("Ford", "Mustang");
console.log(myCar);
myCar.run();
console.log(myCar.show());;