// for loops in javascript

// FOR
// runs for a specified number of times untill mentioned condition is not false
console.log(" -------------- Simple For loop -------------------");

for(i=0;i<10;i++){
    console.log(i);
}

let a = [23,45,34,67,78]

console.log(" -------------- For loop : index looping in array-------------------");

// FOR IN
// print/ iterates through indexes of an object
for(i in a ){
    console.log(i);
}

console.log(" -------------- For loop : Value looping in array-------------------");

// FOR of
// print/ iterates through values of an object
for(i of a ){
    console.log(i);
}