// Declaring a Class
// You can use the underscore character to separate the getter/setter from the actual property:

class Car {
    // Declaring a Constructor
    constructor() { }

    // Declaring a Getter
    get carname() {
        return this.name;
    }

    // Declaring a Setter
    set carname(nam) {
        this.name = nam;
    }
}

let c1 = new Car("BMW");
c1.carname = "volvo";

console.log(c1);
console.log(c1.carname);