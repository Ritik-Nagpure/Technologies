// Map

let map1 = new Map();

map1.set('1', 'str1');   // a string key
map1.set(1, 'num1');     // a numeric key
map1.set(true, 'bool1'); // a boolean key

// remember the regular Object? it would convert keys to string
// Map keeps the type, so these two are different:
console.log( map1.get(1)   ); // 'num1'
console.log( map1.get('1') ); // 'str1'
console.log( map1.size ); // 3

// Objects as Keys
let john = { name: "John" };
let ben = { name: "ben" };

// for every user, let's store their visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123).set(ben,4526);

console.log( visitsCountMap );
console.log( visitsCountMap.get(john) ); // 123

// iterating through maps
let recipeMap = new Map([
    ['cucumber', 500],
    ['tomatoes', 350],
    ['onion', 50]
]);

// iterate over keys (vegetables)
for (let vegetable of recipeMap.keys()) {
    console.log(vegetable); // cucumber, tomatoes, onion
}

// iterate over values (amounts)
for (let amount of recipeMap.values()) {
    console.log(amount); // 500, 350, 50
}

// iterate over [key, value] entries
for (let entry of recipeMap) { // the same as of recipeMap.entries()
    console.log(entry); // cucumber,500 (and so on)
}

// we store the data in a Map, but we need to pass it to a 3rd-party code that expects a plain object.

let map = new Map();
map.set('banana', 1);
map.set('orange', 2);
map.set('meat', 4);

let obj = Object.fromEntries(map.entries()); // make a plain object (*)
// obj = { banana: 1, orange: 2, meat: 4 }

console.log(typeof(obj), obj, obj.orange);