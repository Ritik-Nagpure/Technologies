// Number
// JavaScript has a single number type, which is a double-precision 64-bit binary format IEEE 754 value.
// This means it can represent both integers and floating-point numbers.
// Numbers in JavaScript can be written with or without decimals.

// Declaring numbers
let numobj = new Number(100); // Using the Number object
let numLiteral = Number(100); // Using the Number function --> converts the inside value to number
let numPrimitive = 100; // Using a primitive number 
// All three represent the same numeric value, but they differ in type.
console.log(`Number Object: ${numobj} --> (${typeof (numobj)}), Number Literal: ${numLiteral}--> (${typeof (numLiteral)}), , Number Primitive: ${numPrimitive}--> (${typeof (numPrimitive)}), `);

let integer = 42; // An integer
let float = 3.14; // A floating-point number

console.log(`Integer: ${integer}, Float: ${float}`);

// You can perform arithmetic operations like addition, subtraction, multiplication, and division.
let sum = integer + float; // Addition
let difference = integer - float; // Subtraction
let product = integer * float; // Multiplication
let quotient = integer / float; // Division

console.log(`Sum: ${sum}, Difference: ${difference}, Product: ${product}, Quotient: ${quotient}`);

// JavaScript also supports the modulo operator, which returns the remainder of a division.
let remainder = integer % float; // Modulo operation
console.log(`Remainder of ${integer} % ${float} is: ${remainder}`);


// JavaScript also supports the increment and decrement operators.
integer++; // Increment
float--; // Decrement
console.log(`Incremented integer: ${integer}, Decremented float: ${float}`);

// Number Properties
let dec = 123.897879087986987

console.log("toExponential --> ", dec.toExponential());
console.log("toFixed digits after . --> ", dec.toFixed());
console.log("toFixed 2 --> ", dec.toFixed(2));
console.log("toFixed 4 --> ", dec.toFixed(4));
console.log("toPrecision --> ", dec.toPrecision());
console.log("toPrecision 2 --> ", dec.toPrecision(2));
console.log("toPrecision 3 --> ", dec.toPrecision(3));
console.log("toPrecision 4 --> ", dec.toPrecision(4));
// console.log("toPrecision -1 --> ", dec.toPrecision(-1)); // throws error

money = 10000000
console.log("toString --> ", money.toString());
console.log("toLocaleString default takes local country standards --> ", money.toLocaleString());
console.log("toLocaleString en-US spcofoes to us standards --> ", money.toLocaleString('en-US'));
console.log("toLocaleString ar-EG spcofoes to Egypt Arabic standards --> ", money.toLocaleString('ar-EG'));
console.log("toLocaleString hi-IN spcofoes to Idnian standards --> ", money.toLocaleString('hi-IN'));

console.log(" ---------------------- BONUS on Standards -----------------");
let dt = new Date()
console.log("Date in hi-IN --> ", dt.toLocaleString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
console.log("Date in en-IN --> ", dt.toLocaleString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
console.log("Date in en-US --> ", dt.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
console.log(" ---------------------- BONUS on Standards -----------------");


console.log(" --------------------------- Math Library -------------------------");
console.log(`Pi --> ${Math.PI} , E --> ${Math.E}`);
console.log("Absolute value 1234.657868 --> ", Math.abs(1234.657868), "-4 --> ", Math.abs(-4));
// it’s always non-negative. 

// Get Random value
console.log(Math.random()) // gives random values between 0 and 1 only
console.log(Math.random() * 10); // convert to single digit value


let newnum = Math.random() + 12
console.log(newnum);

//gives closest minimun integer value 
console.log(Math.floor(newnum));

//gives closest maximum integer value 
console.log(Math.ceil(newnum));

//gives closest integer value 
console.log(Math.round(newnum));


// to get random value in a range we have to create a fucntion as no default way is present
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
console.log(Math.round(getRandom(10, 20)));

console.log( Math.sin(1));
console.log( Math.cos(1));

console.log( Math.min(23,45,23,56,134,3532.565,76,767,88,72));
console.log( Math.max(23,45,23,56,134,3532.565,76767,88,72));
console.log( Math.pow(3,3));
console.log( Math.sqrt(64));
console.log( Math.cbrt(64));


