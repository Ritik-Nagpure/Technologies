"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Primitive Datatypes
let str = "This is String";
let bool = true;
let num = 4;
let decinum = 7.564;
let nannum = NaN;
let neginfi = -Infinity; // represents divide by 0.
let infi = Infinity; // greater than any number 
console.log(str);
console.log(bool);
console.log(num);
console.log(decinum);
console.log(nannum);
console.log(neginfi);
console.log(infi);
// Special Datatypes
let undef;
let nullvar = null;
console.log(undef);
console.log(nullvar);
// Void : Function that does not return any value.
function greet() {
    console.log("Hello World");
}
greet();
