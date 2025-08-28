// mixin
// Mixins are a way to add reusable behavior to classes without using inheritance.
// You define a function that takes a class and returns a new class with added functionality.


let sayHiMixin = {
  sayHi() {
    console.log(`Hello ${this.name}`);
  },
  sayBye() {
    console.log(`Bye ${this.name}`);
  }
};

// usage:
class User {
  constructor(name) {
    this.name = name;
  }
}

// copy the methods
Object.assign(User.prototype, sayHiMixin);

// now User can say hi
new User("Dude").sayHi(); // Hello Dude!



// If you're building something like a game character that can jump, swim, and fly, mixins are your friend. But if you're modeling a hierarchy like Vehicle → Car → ElectricCar, inheritance (extends) makes more sense.

// Example 2
const CanFly = (Base) => class extends Base {
  fly() {
    console.log("Flying!");
  }
};

const CanSwim = (Base) => class extends Base {
  swim() {
    console.log("Swimming!");
  }
};

class Animal {
  eat() {
    console.log("Eating");
  }
}

// Apply mixins
class Duck extends CanSwim(CanFly(Animal)) { }

const daffy = new Duck();
daffy.eat();  // From Animal
daffy.fly();  // From CanFly mixin
daffy.swim(); // From CanSwim mixin
