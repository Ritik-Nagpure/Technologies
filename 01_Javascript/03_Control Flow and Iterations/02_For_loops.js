// for loops in javascript

// FOR
// runs for a specified number of times untill mentioned condition is not false
console.log(" -------------- Simple For loop -------------------");

for (let i = 0; i < 10; i++) {
    console.log(i);
}

let a = [23, 45, 34, 67, 78]

console.log(" -------------- For loop : index looping in array-------------------");

// FOR IN
// print/ iterates through indexes of an object
for (let i in a) {
    console.log(i);
}

console.log(" -------------- For loop : Value looping in array-------------------");

// FOR of
// print/ iterates through values of an Array object does not work with objects
for (let i of a) {
    console.log(i);
}

console.log(" -------------- For loop : More examples of variety -------------------");

myarray = [1, 2, 3, 4, 5, 6, 7, 8];

myobj = {
    1: "Husky",
    2: "Sexo",
    3: "Peggu",
    4: "Tatya",
    5: "Octya"
};

mymap = new Map();
mymap.set(1, 'C++');
mymap.set(2, 'Java');
mymap.set(3, 'Javascript');
mymap.set(4, 'Python');
mymap.set(5, 'R');

console.log(mymap);

// Map objects store key-value pairs and maintain insertion order.
// But for...in is meant for objects, so when used with a Map, it doesn’t iterate over its entries—it won’t return keys or values.
for (let [index, val] of mymap) {
    console.log(`index --> ${index} , Value --> ${val}`);
}

// Looping through array
for (let index in myarray) {
    console.log(`index --> ${index} , Value --> ${myarray[index]}`);
}

// looping through Objects
// for...of is designed to iterate over iterable objects like arrays, strings, Map, and Set.
// Regular objects ({ key: value }) are not iterable by default.
for (let key in myobj) {
    console.log(`Key --> ${key} , Value --> ${myobj[key]}`);
}

// to iterate through object value we can usewhich we extracts values as a single array and then its values can be accessed
for (let val of Object.values(myobj)) {
    console.log(val);
}

console.log(" ----------------- forEach loop --------------------------");
// works as for in iterates trhough value but works as mapping more effective.
// doesn't return anything under any condition
myarray.forEach(element => {
    console.log(element)
});

console.log(myarray.forEach(el => (el))); // this only iterates and does not return anything for that use map method
arraylist = [0, 0, 0, 0, 0]
// this method has access to index, values of the passed array and entire array can also be passed inside
// callback function has fixed pattern as ( < Value> , < index > , <array>) name is replaceable but not the position
// The third parameter in a forEach callback is not a custom variable — it's automatically set to the array being iterated

myarray.forEach((val, key, arraylist) => {
    console.log(`Index --> ${key},\nValue --> ${val},\npassed Array --> ${arraylist}`);
})