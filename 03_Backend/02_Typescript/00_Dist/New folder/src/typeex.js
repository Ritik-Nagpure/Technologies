"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const humanInfo1 = {
    name: "John",
    age: 30,
    address: "123 Main St",
    greet: function (message) {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old. and say ${message}`);
    },
    gender: 'Male',
    nature: 'Faminine'
};
console.log(humanInfo1);
humanInfo1.greet('Kya re lawde');
