// prototype is a property of an js object that is either null or refer another object
// js objects can inherit properties and methods from a prototype
// the prototype essentially acts like a parent object—it's how inheritance is achieved.

let a = {
    name: "Ritik",
    age: 24,
    eat: () => console.log(a.name + " is eating "),
    speak: () => console.log("Speaking")
}

let r = {
    run: () => console.log("running...")
}

let w = {
    walk: () => console.log("Walking...")
}

let e = {
    eat: () => console.log("eating...")
}

a.__proto__ = r;
w.__proto__ = e;
r.__proto__ = w;

a.name;
a.age;
a.speak();
a.eat();
a.run();
a.walk();

r.eat()



// Go Below Here you understand Classa and Objects 
// --------------------- prototypes on Objects --------------------
/* Private fields like #name or #age are part of the class syntax introduced in ES2019 (ES10). They’re not just syntactic sugar—they’re a new language feature with strict rules:
->    They must be declared inside a class body using the # prefix.
->    They are not properties on the object—they’re stored in a hidden internal slot.
->    They are lexically scoped to the class definition.
    
*/
console.log('--------------------- prototypes on Objects --------------------');

let vehicle = {
    model: '',
    price: '',

    Car(model, price) {
        this.model = model;
        this.price = price;
    },

    get model() {
        return this.model;
    },
    get price() {
        return this.price;
    }
}


let car = Object.create(vehicle);
car.Car('BMW', 90);
console.log(car.model);


// --------------------- prototypes on Classes --------------------
console.log('--------------------- prototypes on Objects --------------------');

class person {
    #pname;
    #age;

    constructor(nam, age) {
        this.#pname = nam;
        this.#age = age;
    }

    get Name() {
        return this.#pname;
    }

    get Age() {
        return this.#age;
    }
}

class habits {
    eat() {
        return `Eating....`
    }
    walk() {
        return `Walking....`
    }
}

class actions extends habits {

}

// -->  Not working !!
// person.prototype = actions
// --> You're trying to assign a class (actions) as the prototype of another class. But ".prototype" should be an object, not a class. Even though actions is a class (and therefore an object), what you're assigning here is not the prototype object, but the entire class constructor function. That’s not what .prototype is meant to hold.

// person.__proto__ = actions
// --> This sets the prototype of the person constructor function to actions, but it doesn’t affect instances of person.


// Object.setPrototypeOf(actions.prototype, person.prototype);
// -->  sets person as prototype of actions we need actions as prototype of person

// -->  Works !!
Object.setPrototypeOf(person.prototype, actions.prototype);

let man = new person('Husky', 4);
console.log(man);
console.log(man.eat());
console.log(man.walk());
console.log(man.Name);
console.log(typeof man);

