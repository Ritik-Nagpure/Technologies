// Static Methods and Properties

class Human {
    // Static Property
    static bioname = "Homo Sapien";
    constructor(height, weight, age) {
        this.height = height;
        this.weight = weight;
        this.age = age;
    }
    // Static method
    static define() {
        return "Hi I'm a human";
    }

    speak() {
        return " how arew you?";
    }
}

class Man extends Human {
    constructor(name, height, weight, age, language) {
        super(height, weight, age);
        this.name = name;
        this.language = language;
    }

    speak() {
        return "hi, I'm " + this.name + super.speak() + " I speak " + this.language;
    }
}

console.log(Human.bioname);
console.log(Human.define());
let man1 = new Man("Ritik", 8, 48, 45, "hindi")
console.log(man1.speak());

console.log(Man.define()); // inheritance of static method
console.log(Man.bioname);  // inheritance of static property 