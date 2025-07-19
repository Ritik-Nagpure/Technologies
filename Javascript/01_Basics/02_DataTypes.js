//DataTypes in JavaScript

// Primitive Datatypes
console.log("--> Primitive Datatypes in JavaScript ");
// Primitive datatypes are immutable and hold single value
// They are the basic building blocks of data in JavaScript
// There are 7 primitive datatypes in JavaScript

//🚀 Fast and efficient: They're stored directly in memory.
// 🧮 Fixed size and behavior
// 🙅 No additional methods or properties
// a copy of the value is created when assigned to a new variable

// 1] string 
//Array of characters is called String
let str = "Hello";
console.log(str);
console.log(str[1]);
console.log(typeof(str[1]));

// 2] number
console.log(1);
console.log(1.23);
console.log(typeof(1.23));


// 3] bigint
// used to store big interger numbers
console.log(123654846541897498464n);
console.log(BigInt(123654846541897498464));
console.log(typeof(BigInt(123654846541897498464)));

// 4] boolean
//stores true or false values
console.log(true, false);
console.log(typeof(true), typeof(false));

// 5] undefined 
// datatype which is not of anyother datatype has value undefined and type undefined
console.log(typeof(undefined), undefined);

// 6] null
// has null/no value its of object datatype
console.log(typeof(null), null);

// 7] Symbols new datatype in ES6
// its non mutable and unique datatype means no two symbols having same value returns true when tried to equal.
const sym1 = Symbol('RED');
const sym2 = Symbol('BLUE');
const sym3 = Symbol('BLUE');

console.log(sym1, sym2);
console.log(sym1.toString(), sym1.description, sym1.valueOf());
console.log(sym1 == sym2);
console.log(sym3 == sym2);
console.log(typeof(sym1));
sym1.description = 'GREEN'; // This will not change the description as symbols are immutable
console.log(sym1.description); // Still 'RED'


console.log("--> Non-Primitive Datatypes in JavaScript ");
// Non-Primitive Datatypes
// only Object is the main non-primitive datatype in JavaScript rest can be called as special objects or collections
// Non-Primitive datatypes are mutable and can hold multiple values and functions
// Objects can be of various types and can hold multiple values and functions


// Stored by reference, not by direct value
// 🧰 Have methods, constructors, and properties
// 🧠 Can be user-defined (like your own class Person or Car)


// 1] Object
// used to store key-value pairs
let obj = {
    name: "Ritik",
    age: 25,
    isStudent: false
};
console.log(obj);
console.log(obj.name);  
console.log(obj['age']);
console.log(typeof(obj));

// 2] Array
// used to store ordered list of values 
let arr = [1, 2, 3, "Hello", true];
console.log(arr);
console.log(arr[3]);
console.log(typeof(arr));

// 3] Function
// a block of code designed to perform a particular task
function greet() {
    console.log("Hello, World!");
    return "Greeting from function";
}
console.log(greet);
console.log(typeof(greet));

// 4] Date
// used to work with dates and times
let date = new Date();
console.log(date);
console.log(typeof(date));

// 5] RegExp
// used for pattern matching in strings
let regex = /abc/;
console.log(regex);
console.log(typeof(regex));

// ---------------------- Advanced Non-Primitive Datatypes ----------------------
// Advanced Non-Primitive Datatypes
// These are more complex data structures that are built on top of objects and arrays
// They are used for specific purposes and provide additional functionality
// ex. Error
// used to handle errors in JavaScript
let error = new Error("This is an error message");
error.name = "I created this error";
console.log(error);
console.log(error.message);
console.log(error.name);
console.log(typeof(error));

// 6] Map
// a collection of keyed data items, similar to an object
let map = new Map();
map.set('name', 'Ritik');
map.set('age', 25);
console.log(map);
console.log(typeof(map));

// 7] Set
// a collection of unique values
let set = new Set([1, 2, 3, 4, 5]);
console.log(set);
console.log(typeof(set));

// 8] WeakMap
// a collection of keyed data items, where keys are objects and values can be any type
let weakMap = new WeakMap();
let objKey = {};
weakMap.set(objKey, 'value');
console.log(weakMap);
console.log(typeof(weakMap));

// 9] WeakSet
// a collection of unique values, where values are objects and can be garbage collected
let weakSet = new WeakSet();
let objValue = {};
weakSet.add(objValue);
console.log(weakSet);
console.log(typeof(weakSet));

// 10] JSON
// JavaScript Object Notation, a lightweight data interchange format
let jsonString = '{"name": "Ritik", "age": 25}';
let jsonObject = JSON.parse(jsonString);
console.log(jsonObject);
console.log(typeof(jsonObject));
// 11] ArrayBuffer
// used to represent a generic, fixed-length binary data buffer
let buffer = new ArrayBuffer(16); // 16 bytes
console.log(buffer);
console.log(typeof(buffer));
// 12] TypedArray
// an array-like view of an ArrayBuffer
let typedArray = new Uint8Array(buffer);
console.log(typedArray);
console.log(typeof(typedArray));
// 13] DataView
// a low-level interface for reading and writing multiple number types in an ArrayBuffer
let dataView = new DataView(buffer);
console.log(dataView);
console.log(typeof(dataView));
// 14] Promise
// an object representing the eventual completion (or failure) of an asynchronous operation
let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Promise resolved!"), 1000);
});
console.log(promise);
console.log(typeof(promise));
// 15] Generator
// a special type of function that can be paused and resumed, allowing for asynchronous programming
function* generatorFunction() {
    yield "First yield";
    yield "Second yield";
}       
let generator = generatorFunction();
console.log(generator);
console.log(typeof(generator));
// 16] Proxy
// an object that wraps another object or function and intercepts operations on it
let target = {};
let handler = {
    get: function(target, prop) {
        return prop in target ? target[prop] : "Property not found";
    }
};
let proxy = new Proxy(target, handler);
console.log(proxy);
console.log(typeof(proxy));
// 17] Reflect
// a built-in object that provides methods for interceptable JavaScript operations
let reflect = Reflect;
console.log(reflect);
console.log(typeof(reflect));
// 18] Intl
// a namespace for internationalization features, such as formatting numbers, dates, and strings
let intl = Intl;
console.log(intl);
console.log(typeof(intl));
// 19] WebAssembly
// a low-level binary format that can be executed in web browsers, designed for performance
let webAssembly = WebAssembly;
console.log(webAssembly);
console.log(typeof(webAssembly));
// 20] SharedArrayBuffer
// a type of ArrayBuffer that can be shared between web workers
let sharedBuffer = new SharedArrayBuffer(16); // 16 bytes
console.log(sharedBuffer);
console.log(typeof(sharedBuffer));
// 21] Atomics
// a global object that provides atomic operations for shared memory
let atomics = Atomics;
console.log(atomics);
console.log(typeof(atomics));
// 22] BigInt64Array
// a typed array that represents an array of 64-bit signed integers
let bigInt64Array = new BigInt64Array(2);
console.log(bigInt64Array);
console.log(typeof(bigInt64Array));
// 23] BigUint64Array
// a typed array that represents an array of 64-bit unsigned integers
let bigUint64Array = new BigUint64Array(2);
console.log(bigUint64Array);
console.log(typeof(bigUint64Array));
// 24] FinalizationRegistry
// a registry that allows you to register a callback to be called when an object is garbage collected
let finalizationRegistry = new FinalizationRegistry((heldValue) => {
    console.log(`Object with held value ${heldValue} has been garbage collected.`);
});
// 25] WeakRef
// a weak reference to an object, allowing you to hold a reference without preventing garbage collection
let weakRef = new WeakRef(obj);
console.log(weakRef);
console.log(typeof(weakRef));
// 26] URL
// a built-in object for parsing and manipulating URLs
let url = new URL('https://example.com/path?query=123');
console.log(url);
console.log(typeof(url));


