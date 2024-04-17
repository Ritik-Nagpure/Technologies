//Equality Operators
// ==  and  === [strick equality operator]
console.log(1 == 1);
console.log(1 == true);

console.log(1 === true);
console.log(1 === 1);


console.log(1 != 1);
console.log(1 != true);

console.log(1 !== true);
console.log(1 !== 1);

let a = 123;
console.log(a === 123);
console.log(a !== 123);


// Object.is( value1, value2)
//determines whether two values are the same value. Two values are the same both are same
console.log(Object.is(NaN,NaN));