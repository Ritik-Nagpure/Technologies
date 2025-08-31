"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let emp1 = {
    id: 1,
    nam: "Ritik",
    gender: "Male",
    // retire: (val) => { return val },
};
emp1.retire = (val) => { return val; };
console.log(emp1);
console.log(emp1.retire("1"));
// Union Types : Union types are used when a value can be more than a single type.
// Such as when a property would be string or number.
function showweight(weight) {
    console.log(weight);
}
showweight(10);
showweight("10 KGs");
let card = {
    drag: () => { },
    resize: () => { }
};
console.log(card);
const humanInfo = {
    name: "John",
    age: 30,
    address: "123 Main St"
};
function getProperty(obj, key) {
    console.log(obj[key]);
    return obj[key];
}
const humanInfoName = getProperty(humanInfo, 'name'); // Valid
const humanInfoAge = getProperty(humanInfo, 'age'); // Valid
const humanInfoAddress = getProperty(humanInfo, 'address'); // Valid
