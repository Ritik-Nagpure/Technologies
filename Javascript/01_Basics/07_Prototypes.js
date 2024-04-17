// prototype is a property of an js object that is either null or refer another object
// js objects can inherit properties and methods from a prototype

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
