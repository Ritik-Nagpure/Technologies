// Declaring a Class
// You can use the underscore character to separate the getter/setter from the actual property:

class Car {
    #cname;
    #model;

    // Declaring a Constructor
    constructor(n) { 
        this.#cname = n;
    }

    // Declaring a Getter
    get carname() {
        return this.#model;
    }

    // Declaring a Setter
    set carname(nam) {
        this.#model = nam;
    }
}

let c1 = new Car("BMW");
c1.carname = "x6";

console.log(c1.cname);
console.log(c1.carname);
console.log(c1); // this will only show public properties in our case a blank object as there is no public property