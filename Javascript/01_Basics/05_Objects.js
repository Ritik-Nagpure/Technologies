// Objects

let user1 = new Object(); // "object constructor" syntax
let user2 = {};  // "object literal" syntax
let user = {     // an object
    name: "John",  // by key "name" store value "John"
    age: 30,     // by key "age" store value 30
    "likes birds": true
};

console.log(user1);
console.log(user2);
console.log(user);
console.log(user.name);
console.log(user.age);
delete user.age;
console.log(user);
console.log(user["name"]); // other way of accessing elements
