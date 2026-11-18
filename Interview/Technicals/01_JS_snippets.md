
# A. HOISTING, SCOPE AND TEMPORAL DEAD ZONE

## 1. What happens when you access a var variable before declaration?

```javascript
console.log(a);
var a = 10;
console.log(a);
```

Output:
```text
undefined
10
```
Explanation: var is hoisted and initialized with undefined. Only the declaration is hoisted, not the assignment.

## 2. What happens when you access a let variable before initialization?

```javascript
console.log(a);
let a = 10;
```

Output:
```text
ReferenceError: Cannot access 'a' before initialization
```
Explanation: let is hoisted but remains in the Temporal Dead Zone (TDZ) until initialization.

## 3. What happens when a local variable has the same name as a global variable?

```javascript
var a = 10;
function test() {
    console.log(a);
    var a = 20;
    console.log(a);
}
test();
```

Output:
```text
undefined
20
```
Explanation: The local var is hoisted and shadows the global variable throughout the function scope.

## 4. What happens when var and let are declared inside the same function?

```javascript
function test() {
    console.log(a);
    console.log(b);
    var a = 10;
    let b = 20;
}
test();
```

Output:
```text
undefined
ReferenceError: Cannot access 'b' before initialization
```
Explanation: var is initialized with undefined, whereas let remains in the TDZ. The second statement throws an error.

## 5. What is the output of var and let inside a block?

```javascript
var a = 10;
{
    var a = 20;
    let b = 30;
    console.log(a);
    console.log(b);
}
console.log(a);
console.log(b);
```

Output:
```text
20
30
20
ReferenceError: b is not defined
```
Explanation: var is not block-scoped, whereas let is accessible only inside its block.

## 6. What is the difference between function declaration and function expression hoisting?

```javascript
greet();
function greet() {
    console.log("Hello");
}
sayHello();
var sayHello = function () {
    console.log("World");
};
```

Output:
```text
Hello
TypeError: sayHello is not a function
```
Explanation: Function declarations are fully hoisted. Function expressions follow variable hoisting rules, so sayHello is undefined when called.

## 7. What happens when const is accessed before initialization?

```javascript
console.log(a);
const a = 100;
```

Output:
```text
ReferenceError: Cannot access 'a' before initialization
```
Explanation: const is hoisted but remains in the TDZ until initialization.

## 8. What happens when we redeclare var and let?

```javascript
var a = 10;
var a = 20;
console.log(a);
let b = 10;
let b = 20;
console.log(b);
```

Output:
```text
SyntaxError: Identifier 'b' has already been declared
```
Explanation: var allows redeclaration, but let does not allow redeclaration in the same scope. The SyntaxError prevents the entire script from executing.

# B. CLOSURES AND FUNCTIONS

## 9. What is the output of a closure?

```javascript
function outer() {
    let count = 0;
    return function inner() {
        count++;
        console.log(count);
    };
}
const fn = outer();
fn();
fn();
fn();
```

Output:
```text
1
2
3
```
Explanation: The inner function retains access to the outer function's count variable through its lexical environment.

## 10. What happens when var is used inside a loop with closures?

```javascript
function test() {
    var functions = [];
    for (var i = 0; i < 3; i++) {
        functions.push(function () {
            console.log(i);
        });
    }
    return functions;
}
const result = test();
result[0]();
result[1]();
result[2]();
```

Output:
```text
3
3
3
```
Explanation: All functions share the same function-scoped i variable. The loop finishes before the callbacks execute.

## 11. What happens when let is used inside the same loop?

```javascript
function test() {
    var functions = [];
    for (let i = 0; i < 3; i++) {
        functions.push(function () {
            console.log(i);
        });
    }
    return functions;
}
const result = test();
result[0]();
result[1]();
result[2]();
```

Output:
```text
0
1
2
```
Explanation: let creates a separate binding for each loop iteration, which each closure retains.

## 12. What is the difference between regular function and arrow function this?

```javascript
const obj = {
    name: "Ritik",
    regular: function () {
        console.log(this.name);
    },
    arrow: () => {
        console.log(this.name);
    }
};
obj.regular();
obj.arrow();
```

Output in Node.js CommonJS:
```text
Ritik
undefined
```
Explanation: A regular function gets this from its call site. An arrow function inherits this from its surrounding lexical scope.

## 13. What happens when a function is called without an object?

```javascript
function test() {
    console.log(this);
}
test();
```

Output:
```text
Non-strict mode: globalThis
Strict mode: undefined
```
Explanation: Regular functions use the global object as this in non-strict mode. In strict mode, this remains undefined.

## 14. What is the output when we use call(), apply(), and bind()?

```javascript
const user = { name: "Ritik" };
function greet(city, country) {
    console.log(this.name, city, country);
}
greet.call(user, "Pune", "India");
greet.apply(user, ["Mumbai", "India"]);
const result = greet.bind(user, "Nagpur", "India");
result();
```

Output:
```text
Ritik Pune India
Ritik Mumbai India
Ritik Nagpur India
```
Explanation: call() and apply() execute immediately with a specified this. bind() returns a new function with the specified this and arguments.

## 15. What happens when an arrow function is used as an object method?

```javascript
const user = {
    name: "Ritik",
    greet: function () {
        const inner = () => {
            console.log(this.name);
        };
        inner();
    }
};
user.greet();
```

Output:
```text
Ritik
```
Explanation: The arrow function inherits this from the regular function, where this refers to user.

# C. TYPE COERCION AND EQUALITY

## 16. What is the output of typeof for different JavaScript values?

```javascript
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);
console.log(typeof []);
console.log(typeof {});
console.log(typeof function () {});
```

Output:
```text
object
undefined
number
object
object
function
```
Explanation: null and arrays have historical or object-based typeof behavior. NaN is a Number value, and functions return function.

## 17. What is the output of string and number addition?

```javascript
console.log(1 + "2" + 3);
console.log(1 + 2 + "3");
console.log("10" - 5);
console.log("10" + 5);
console.log("10" * "2");
```

Output:
```text
123
33
5
105
20
```
Explanation: + performs concatenation when a string is involved. -, *, and / perform numeric conversion.

## 18. What is the output of == and ===?

```javascript
console.log(5 == "5");
console.log(5 === "5");
console.log(null == undefined);
console.log(null === undefined);
console.log(false == 0);
console.log(false === 0);
```

Output:
```text
true
false
true
false
true
false
```
Explanation: == allows type coercion, whereas === compares values without converting different types.

## 19. What is the output of these array comparisons?

```javascript
console.log([] == false);
console.log([] == ![]);
console.log([] === []);
console.log([1] == 1);
console.log([1, 2] == "1,2");
```

Output:
```text
true
true
false
true
true
```
Explanation: Arrays convert to primitive strings during loose equality comparisons. Separate arrays have different object references.

## 20. What is the output of Boolean conversion?

```javascript
console.log(Boolean(""));
console.log(Boolean("false"));
console.log(Boolean(0));
console.log(Boolean("0"));
console.log(Boolean([]));
console.log(Boolean({}));
```

Output:
```text
false
true
false
true
true
true
```
Explanation: Empty strings and zero are falsy. Non-empty strings, arrays, and objects are truthy.

## 21. What is the difference between || and ???

```javascript
console.log(0 || 100);
console.log(0 ?? 100);
console.log("" || "Hello");
console.log("" ?? "Hello");
console.log(null ?? "Default");
console.log(undefined ?? "Default");
```

Output:
```text
100
0
Hello

Default
Default
```
Explanation: || checks for falsy values. ?? checks only for null and undefined.

## 22. What is the output of NaN comparisons?

```javascript
console.log(NaN == NaN);
console.log(NaN === NaN);
console.log(Number.isNaN(NaN));
console.log(isNaN("Hello"));
console.log(Number.isNaN("Hello"));
```

Output:
```text
false
false
true
true
false
```
Explanation: NaN is never equal to itself. isNaN() performs coercion, whereas Number.isNaN() does not.

## 23. What is the output of unary plus and other operators?

```javascript
console.log(+"10");
console.log(+"Hello");
console.log(!!"false");
console.log(!!0);
console.log([] + []);
console.log([] + {});
```

Output:
```text
10
NaN
true
false

[object Object]
```
Explanation: Unary + converts values into numbers. !! converts values into Boolean. Arrays and objects undergo primitive conversion during addition.

# D. ARRAY METHODS AND OBJECT REFERENCES

## 24. What happens when map() does not return a value?

```javascript
const numbers = [1, 2, 3, 4, 5];
const result = numbers.map(num => {
    if (num > 2) {
        return num * 2;
    }
});
console.log(result);
```

Output:
```text
[undefined, undefined, 6, 8, 10]
```
Explanation: map() stores the callback return value. When no return statement executes, the result is undefined.

## 25. What happens when filter() does not return a Boolean?

```javascript
const numbers = [1, 2, 3, 4];
const result = numbers.filter(num => {
    num > 2;
});
console.log(result);
```

Output:
```text
[]
```
Explanation: The callback has no return statement, so it returns undefined. filter() treats it as falsy.

Correct implementation:

```javascript
const result = numbers.filter(num => num > 2);
console.log(result);
```

Output:
```text
[3, 4]
```

## 26. What happens when reduce() is used without an initial value?

```javascript
const numbers = [1, 2, 3, 4];
const result = numbers.reduce((acc, curr) => acc + curr);
console.log(result);
```

Output:
```text
10
```
Explanation: Without an initial value, reduce() uses the first array element as the accumulator.

## 27. What happens when an array is assigned to another variable?

```javascript
const arr = [1, 2, 3];
const result = arr;
result.push(4);
console.log(arr);
console.log(result);
```

Output:
```text
[1, 2, 3, 4]
[1, 2, 3, 4]
```
Explanation: Both variables reference the same array in memory.

## 28. What is the difference between slice() and splice()?

```javascript
const arr = [1, 2, 3, 4, 5];
const result = arr.slice(1, 3);
console.log(result);
console.log(arr);
arr.splice(1, 2);
console.log(arr);
```

Output:
```text
[2, 3]
[1, 2, 3, 4, 5]
[1, 4, 5]
```
Explanation: slice() returns a shallow copy without modifying the original. splice() modifies the original array.

## 29. What happens when we use the spread operator on nested objects?

```javascript
const obj1 = {
    name: "Ritik",
    address: { city: "Pune" }
};
const obj2 = { ...obj1 };
obj2.name = "Rahul";
obj2.address.city = "Mumbai";
console.log(obj1.name);
console.log(obj1.address.city);
```

Output:
```text
Ritik
Mumbai
```
Explanation: Spread creates a shallow copy. The nested address object is still shared between both objects.

## 30. What happens when we sort numbers without a comparator?

```javascript
const numbers = [10, 2, 30, 4, 5];
numbers.sort();
console.log(numbers);
numbers.sort((a, b) => a - b);
console.log(numbers);
```

Output:
```text
[10, 2, 30, 4, 5]
[2, 4, 5, 10, 30]
```
Explanation: sort() converts elements to strings by default. A numeric comparator is required for numeric sorting.

## 31. What happens when objects are used as keys in a normal object?

```javascript
const obj = {};
const a = { id: 1 };
const b = { id: 2 };
obj[a] = "First";
obj[b] = "Second";
console.log(obj[a]);
console.log(obj[b]);
console.log(obj);
```

Output:
```text
Second
Second
{ '[object Object]': 'Second' }
```
Explanation: Object keys are converted to strings or Symbols. Both objects convert to "[object Object]", so the second assignment overwrites the first.

## 32. What happens when we compare two objects?

```javascript
const a = { name: "Ritik" };
const b = { name: "Ritik" };
const c = a;
console.log(a == b);
console.log(a === b);
console.log(a === c);
```

Output:
```text
false
false
true
```
Explanation: Objects are compared by reference identity. a and b are different objects, whereas c references a.

# E. ASYNCHRONOUS JAVASCRIPT AND EVENT LOOP

## 33. What is the execution order of synchronous and asynchronous code?

```javascript
console.log("Start");
setTimeout(() => {
    console.log("Timeout");
}, 0);
console.log("End");
```

Output:
```text
Start
End
Timeout
```
Explanation: Synchronous code executes first. The timer callback executes later when its timer is eligible and the Event Loop can process it.

## 34. Which executes first: Promise or setTimeout()?

```javascript
console.log("Start");
setTimeout(() => {
    console.log("Timeout");
}, 0);
Promise.resolve().then(() => {
    console.log("Promise");
});
console.log("End");
```

Output:
```text
Start
End
Promise
Timeout
```
Explanation: Promise callbacks are microtasks. They execute before timer callbacks after synchronous execution.

## 35. What is the execution order of process.nextTick(), Promise, and setImmediate()?

```javascript
console.log("Start");
process.nextTick(() => console.log("NextTick"));
Promise.resolve().then(() => console.log("Promise"));
setImmediate(() => console.log("Immediate"));
console.log("End");
```

Output in Node.js CommonJS:
```text
Start
End
NextTick
Promise
Immediate
```
Explanation: Node.js processes the next-tick queue before Promise microtasks, followed by the eligible Event Loop phases.

## 36. What happens when await is used inside an async function?

```javascript
async function test() {
    console.log("A");
    await Promise.resolve();
    console.log("B");
}
console.log("Start");
test();
console.log("End");
```

Output:
```text
Start
A
End
B
```
Explanation: The async function executes synchronously until await. Its continuation is scheduled as a Promise microtask.

## 37. What happens when a Promise returns another Promise?

```javascript
Promise.resolve()
    .then(() => {
        console.log(1);
        return Promise.resolve(2);
    })
    .then(result => console.log(result));
console.log(3);
```

Output:
```text
3
1
2
```
Explanation: Synchronous code executes first. Promise chaining waits for the returned Promise to settle before passing its value to the next then().

## 38. What happens when multiple setTimeout callbacks are used inside a loop?

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000);
}
```

Output after approximately one second:
```text
3
3
3
```
Explanation: All callbacks share the same var variable. The loop finishes before they execute.

Using let:

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000);
}
```

Output:
```text
0
1
2
```
Explanation: let creates a separate binding for every iteration.

## 39. What happens when Promise.all() receives one rejected Promise?

```javascript
const p1 = Promise.resolve("User");
const p2 = Promise.reject("Payment failed");
const p3 = Promise.resolve("Orders");
Promise.all([p1, p2, p3])
    .then(result => console.log(result))
    .catch(error => console.log(error));
```

Output:
```text
Payment failed
```
Explanation: Promise.all() rejects when any input Promise rejects. It does not cancel the remaining operations.

## 40. What is the difference between Promise.all() and Promise.allSettled()?

```javascript
const p1 = Promise.resolve("Success");
const p2 = Promise.reject("Failed");
Promise.allSettled([p1, p2])
    .then(result => console.log(result));
```

Output:
```javascript
[
    { status: "fulfilled", value: "Success" },
    { status: "rejected", reason: "Failed" }
]
```
Explanation: Promise.allSettled() waits for every Promise to settle, regardless of success or failure.

# F. ADVANCED JAVASCRIPT CONCEPTS

## 41. What happens when a default parameter receives undefined or null?

```javascript
function test(a = 20) {
    console.log(a);
}
test();
test(undefined);
test(null);
test(0);
```

Output:
```text
20
20
null
0
```
Explanation: Default parameters apply when the argument is omitted or undefined, not when it is null or zero.

## 42. What happens when an object is frozen?

```javascript
const user = { name: "Ritik", age: 26 };
Object.freeze(user);
user.name = "Rahul";
user.city = "Pune";
console.log(user);
```

Output in non-strict mode:
```text
{ name: "Ritik", age: 26 }
```
Explanation: Object.freeze() prevents modifying, adding, and removing own properties. It is shallow, so nested objects are not automatically frozen.

## 43. What happens when we use optional chaining?

```javascript
const user = {
    name: "Ritik",
    address: null
};
console.log(user.name);
console.log(user.address?.city);
console.log(user.contact?.phone);
```

Output:
```text
Ritik
undefined
undefined
```
Explanation: Optional chaining returns undefined instead of throwing when the value before ?. is null or undefined.

## 44. What happens when we use the delete operator?

```javascript
const user = { name: "Ritik", age: 26 };
delete user.age;
console.log(user);
console.log(user.age);
```

Output:
```text
{ name: 'Ritik' }
undefined
```
Explanation: delete removes a configurable object property. Accessing the deleted property returns undefined.

## 45. What happens when a class extends another class?

```javascript
class Parent {
    constructor() {
        this.name = "Parent";
    }
    greet() {
        console.log(this.name);
    }
}
class Child extends Parent {
    constructor() {
        super();
        this.name = "Child";
    }
}
const obj = new Child();
obj.greet();
```

Output:
```text
Child
```
Explanation: Child inherits greet() from Parent. The child constructor changes the inherited instance property to Child.

# G. ADVANCED OUTPUT-BASED QUESTIONS

## 46. What is the difference between Object.assign() and the spread operator?

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = Object.assign({}, obj1);
const obj3 = { ...obj1 };
obj2.a = 100;
obj3.b = 200;
console.log(obj1);
console.log(obj2);
console.log(obj3);
```

Output:
```text
{ a: 1, b: 2 }
{ a: 100, b: 2 }
{ a: 1, b: 200 }
```
Explanation: Both create shallow copies. Changes to top-level properties do not affect the original object.

## 47. What happens when we use a sparse array?

```javascript
const arr = [1, , 3];
console.log(arr.length);
console.log(arr[1]);
console.log(1 in arr);
arr.forEach(value => console.log(value));
```

Output:
```text
3
undefined
false
1
3
```
Explanation: Index 1 is an empty slot, not an actual property. forEach() skips empty slots.

## 48. What happens when we modify an array during forEach()?

```javascript
const arr = [1, 2, 3];
arr.forEach((value, index) => {
    console.log(value);
    if (index === 0) {
        arr.push(4);
    }
});
```

Output:
```text
1
2
3
```
Explanation: forEach() captures the original array length when iteration starts, so newly appended elements are not visited.

## 49. What happens when a Promise is resolved multiple times?

```javascript
const promise = new Promise((resolve, reject) => {
    resolve("First");
    resolve("Second");
    reject("Error");
});
promise.then(result => console.log(result));
```

Output:
```text
First
```
Explanation: A Promise can settle only once. Subsequent resolve() and reject() calls have no effect.

## 50. What happens when an error is thrown inside a Promise chain?

```javascript
Promise.resolve()
    .then(() => {
        console.log("A");
        throw new Error("Something went wrong");
    })
    .then(() => console.log("B"))
    .catch(error => console.log(error.message))
    .then(() => console.log("C"));
```

Output:
```text
A
Something went wrong
C
```
Explanation: The thrown error rejects the chain. The next then() is skipped, catch() handles the error, and the final then() executes.

## 51. What happens when an async function returns a normal value?

```javascript
async function test() {
    return 100;
}
console.log(test());
test().then(result => console.log(result));
```

Output:
```text
Promise { 100 }
100
```
Explanation: An async function always returns a Promise. A normal return value becomes its fulfilled value. Promise display varies by runtime.

## 52. What happens when await is used with a normal value?

```javascript
async function test() {
    const result = await 100;
    console.log(result);
}
console.log("Start");
test();
console.log("End");
```

Output:
```text
Start
End
100
```
Explanation: await accepts non-Promise values. The continuation still executes asynchronously through Promise scheduling.

## 53. What happens when setTimeout is nested inside setTimeout?

```javascript
console.log("Start");
setTimeout(() => {
    console.log("First");
    setTimeout(() => {
        console.log("Second");
    }, 0);
}, 0);
console.log("End");
```

Output:
```text
Start
End
First
Second
```
Explanation: The second timer is scheduled only after the first timer callback executes.

## 54. What is the output of Promise.race()?

```javascript
const p1 = new Promise(resolve => {
    setTimeout(() => resolve("First"), 100);
});
const p2 = new Promise(resolve => {
    setTimeout(() => resolve("Second"), 50);
});
Promise.race([p1, p2])
    .then(result => console.log(result));
```

Output:
```text
Second
```
Explanation: Promise.race() settles with the first input Promise that settles, whether fulfilled or rejected.

## 55. What is the output of Promise.any()?

```javascript
const p1 = Promise.reject("Error 1");
const p2 = Promise.resolve("Success");
const p3 = Promise.reject("Error 2");
Promise.any([p1, p2, p3])
    .then(result => console.log(result));
```

Output:
```text
Success
```
Explanation: Promise.any() fulfills with the first fulfilled Promise. It rejects with AggregateError only when all inputs reject.

## 56. What happens when an object property is modified through a function?

```javascript
const user = { name: "Ritik" };
function updateUser(obj) {
    obj.name = "Rahul";
}
updateUser(user);
console.log(user.name);
```

Output:
```text
Rahul
```
Explanation: The function receives a copy of the object reference. Both references point to the same object.

## 57. What happens when we reassign an object inside a function?

```javascript
const user = { name: "Ritik" };
function updateUser(obj) {
    obj = { name: "Rahul" };
}
updateUser(user);
console.log(user.name);
```

Output:
```text
Ritik
```
Explanation: Reassigning the local parameter changes only its local reference. The original object remains unchanged.

## 58. What happens when we use Object.keys() with an array?

```javascript
const arr = ["A", "B", "C"];
console.log(Object.keys(arr));
console.log(Object.values(arr));
console.log(Object.entries(arr));
```

Output:
```text
["0", "1", "2"]
["A", "B", "C"]
[["0", "A"], ["1", "B"], ["2", "C"]]
```
Explanation: Arrays are objects with enumerable indexed properties. Object methods return their keys, values, and entries.

## 59. What happens when we use the in operator?

```javascript
const user = { name: "Ritik" };
console.log("name" in user);
console.log("age" in user);
console.log("toString" in user);
console.log(Object.hasOwn(user, "toString"));
```

Output:
```text
true
false
true
false
```
Explanation: in checks the object and its prototype chain. Object.hasOwn() checks only directly owned properties.

## 60. What happens when we compare two dates?

```javascript
const date1 = new Date("2026-01-01");
const date2 = new Date("2026-01-01");
console.log(date1 == date2);
console.log(date1 === date2);
console.log(date1.getTime() === date2.getTime());
```

Output:
```text
false
false
true
```
Explanation: Date objects are compared by reference. getTime() returns primitive timestamps, which can be compared by value.

# H. NODE.JS-SPECIFIC TRICKY QUESTIONS

## 61. What is the difference between process.nextTick() and Promise microtasks?

```javascript
console.log("Start");
Promise.resolve().then(() => console.log("Promise 1"));
process.nextTick(() => console.log("NextTick 1"));
process.nextTick(() => console.log("NextTick 2"));
console.log("End");
```

Output in Node.js CommonJS:
```text
Start
End
NextTick 1
NextTick 2
Promise 1
```
Explanation: Node.js processes the next-tick queue before the Promise microtask queue after the current operation.

## 62. What happens when process.nextTick() is scheduled inside a Promise callback?

```javascript
console.log("Start");
Promise.resolve().then(() => {
    console.log("Promise 1");
    process.nextTick(() => console.log("NextTick"));
});
Promise.resolve().then(() => console.log("Promise 2"));
console.log("End");
```

Output in Node.js CommonJS:
```text
Start
End
Promise 1
Promise 2
NextTick
```
Explanation: Node.js finishes draining the current Promise microtask queue before processing next-tick callbacks scheduled during those microtasks.

## 63. What is the difference between setTimeout() and setImmediate() inside an I/O callback?

```javascript
const fs = require("fs");
fs.readFile(__filename, () => {
    setTimeout(() => console.log("Timeout"), 0);
    setImmediate(() => console.log("Immediate"));
});
```

Output:
```text
Immediate
Timeout
```
Explanation: setImmediate() executes in the Check phase after the I/O callback. The timer executes in a subsequent eligible Timers phase.

## 64. What happens when a Promise callback schedules another Promise callback?

```javascript
Promise.resolve().then(() => {
    console.log("A");
    Promise.resolve().then(() => console.log("B"));
    console.log("C");
});
Promise.resolve().then(() => console.log("D"));
```

Output:
```text
A
C
D
B
```
Explanation: The second Promise callback was already queued before the newly scheduled callback B.

## 65. What happens when a synchronous operation blocks the Event Loop?

```javascript
console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
const start = Date.now();
while (Date.now() - start < 2000) {}
console.log("End");
```

Output:
```text
Start
End
Timeout
```
Explanation: The synchronous while loop blocks the main thread, preventing the timer callback from executing until the loop finishes.

## 66. What happens when process.nextTick() is recursively scheduled?

```javascript
console.log("Start");
process.nextTick(function run() {
    console.log("NextTick");
    process.nextTick(run);
});
setTimeout(() => console.log("Timeout"), 0);
```

Output:
```text
Start
NextTick
NextTick
NextTick
...
```
Explanation: Recursive next-tick scheduling continuously replenishes the queue and starves the Event Loop. The timer may never execute.

# I. ADDITIONAL IMPORTANT JAVASCRIPT INTERVIEW TOPICS

## 67. What happens when an object is compared with itself after modification?

```javascript
const obj = { a: 1 };
const ref = obj;
obj.a = 100;
console.log(ref.a);
console.log(obj === ref);
```

Output:
```text
100
true
```
Explanation: Both variables reference the same object, so modifications are visible through either reference.

## 68. What happens when we use Object.freeze() on a nested object?

```javascript
const user = {
    name: "Ritik",
    address: { city: "Pune" }
};
Object.freeze(user);
user.address.city = "Mumbai";
console.log(user.address.city);
```

Output in non-strict mode:
```text
Mumbai
```
Explanation: Object.freeze() is shallow. It does not automatically freeze nested objects.

## 69. What happens when we use Object.seal()?

```javascript
const user = { name: "Ritik", age: 26 };
Object.seal(user);
user.name = "Rahul";
user.city = "Pune";
delete user.age;
console.log(user);
```

Output in non-strict mode:
```text
{ name: "Rahul", age: 26 }
```
Explanation: Object.seal() allows modifying existing properties but prevents adding or deleting properties.

## 70. What happens when we use Object.preventExtensions()?

```javascript
const user = { name: "Ritik" };
Object.preventExtensions(user);
user.name = "Rahul";
user.age = 26;
console.log(user);
```

Output in non-strict mode:
```text
{ name: "Rahul" }
```
Explanation: Existing properties can be modified, but new properties cannot be added.

## 71. What happens when we use the prototype chain?

```javascript
const parent = { greet: "Hello" };
const child = Object.create(parent);
child.name = "Ritik";
console.log(child.name);
console.log(child.greet);
console.log(child.hasOwnProperty("greet"));
```

Output:
```text
Ritik
Hello
false
```
Explanation: child inherits greet through its prototype chain, but greet is not its own property.

## 72. What happens when we use the instanceof operator?

```javascript
const arr = [];
const obj = {};
console.log(arr instanceof Array);
console.log(arr instanceof Object);
console.log(obj instanceof Array);
console.log(obj instanceof Object);
```

Output:
```text
true
true
false
true
```
Explanation: instanceof checks whether a constructor's prototype exists in an object's prototype chain.

## 73. What happens when we use Array.isArray() and typeof?

```javascript
const arr = [];
console.log(typeof arr);
console.log(Array.isArray(arr));
console.log(Array.isArray({}));
```

Output:
```text
object
true
false
```
Explanation: Arrays are objects, so typeof returns object. Array.isArray() specifically identifies arrays.

## 74. What happens when we use destructuring with default values?

```javascript
const user = { name: "Ritik", age: null };
const { name = "Guest", age = 25, city = "Pune" } = user;
console.log(name, age, city);
```

Output:
```text
Ritik null Pune
```
Explanation: Destructuring defaults apply only when the property is undefined, not null.

## 75. What happens when we use the rest operator?

```javascript
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first);
console.log(second);
console.log(rest);
```

Output:
```text
10
20
[30, 40, 50]
```
Explanation: The rest operator collects remaining elements into a new array.

## 76. What happens when we use a Set with duplicate values?

```javascript
const numbers = new Set([1, 2, 2, 3, 3, 4]);
console.log(numbers.size);
console.log([...numbers]);
```

Output:
```text
4
[1, 2, 3, 4]
```
Explanation: Set stores unique values and automatically removes duplicates.

## 77. What happens when we use Map with duplicate keys?

```javascript
const map = new Map();
map.set("name", "Ritik");
map.set("name", "Rahul");
console.log(map.get("name"));
console.log(map.size);
```

Output:
```text
Rahul
1
```
Explanation: Map keys must be unique. Setting an existing key replaces its value without increasing the size.

## 78. What happens when we use a Symbol as an object key?

```javascript
const id = Symbol("id");
const user = { [id]: 101, name: "Ritik" };
console.log(user[id]);
console.log(Object.keys(user));
console.log(Object.getOwnPropertySymbols(user));
```

Output:
```text
101
["name"]
[Symbol(id)]
```
Explanation: Symbol properties are not included in Object.keys(), but can be retrieved using Object.getOwnPropertySymbols().

## 79. What happens when we use a generator function?

```javascript
function* generate() {
    yield 1;
    yield 2;
    yield 3;
}
const gen = generate();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
```

Output:
```text
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true }
```
Explanation: Generator functions pause at yield and resume when next() is called.

## 80. What happens when we use the nullish coalescing assignment operator?

```javascript
let a = null;
let b = 0;
let c = undefined;
a ??= 10;
b ??= 20;
c ??= 30;
console.log(a, b, c);
```

Output:
```text
10 0 30
```
Explanation: ??= assigns a value only when the existing variable is null or undefined.

## 81. What happens when we use a tagged template literal?

```javascript
function greet(strings, name) {
    return strings[0] + name.toUpperCase() + strings[1];
}
const result = greet`Hello ${"Ritik"}!`;
console.log(result);
```

Output:
```text
Hello RITIK!
```
Explanation: Tagged template literals pass string segments and interpolated values as arguments to a function.

## 82. What happens when we use a finally() block in a Promise?

```javascript
Promise.resolve("Success")
    .then(value => {
        console.log(value);
        return value;
    })
    .finally(() => console.log("Finally"))
    .then(value => console.log(value));
```

Output:
```text
Success
Finally
Success
```
Explanation: finally() executes after settlement and normally preserves the original fulfillment value or rejection reason.

## 83. What happens when an error is thrown inside an async function?

```javascript
async function test() {
    throw new Error("Failed");
}
test()
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
```

Output:
```text
Failed
```
Explanation: An error thrown inside an async function causes its returned Promise to reject.

## 84. What happens when Promise.resolve() receives another Promise?

```javascript
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(p1);
p2.then(value => console.log(value));
```

Output:
```text
10
```
Explanation: Promise.resolve() adopts the state and eventual value of the supplied Promise instead of nesting it.

## 85. What happens when we use Array.from() with a string?

```javascript
const result = Array.from("Ritik");
console.log(result);
```

Output:
```text
["R", "i", "t", "i", "k"]
```
Explanation: Array.from() converts an iterable string into an array of its Unicode code points.

## 86. What happens when we use flat() with nested arrays?

```javascript
const arr = [1, [2, [3, 4]], 5];
console.log(arr.flat());
console.log(arr.flat(2));
console.log(arr.flat(Infinity));
```

Output:
```text
[1, 2, [3, 4], 5]
[1, 2, 3, 4, 5]
[1, 2, 3, 4, 5]
```
Explanation: flat() defaults to depth 1. The depth argument controls how many nested levels are flattened.

## 87. What happens when we use the comma operator?

```javascript
let a = (1, 2, 3);
console.log(a);
```

Output:
```text
3
```
Explanation: The comma operator evaluates each expression and returns the value of the last expression.

## 88. What happens when we use short-circuit evaluation?

```javascript
console.log(false && "Hello");
console.log(true || "World");
console.log(null && "Test");
console.log("Ritik" || "Guest");
```

Output:
```text
false
true
null
Ritik
```
Explanation: && returns the first falsy operand. || returns the first truthy operand. Both operators short-circuit when the result is determined.

## 89. What happens when we use the typeof operator on an undeclared variable?

```javascript
console.log(typeof unknownVariable);
console.log(unknownVariable);
```

Output:
```text
undefined
ReferenceError
```
Explanation: typeof safely handles an undeclared identifier, but directly accessing it throws a ReferenceError.

## 90. What happens when we use a labeled break?

```javascript
outer:
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outer;
        }
        console.log(i, j);
    }
}
```

Output:
```text
0 0
0 1
0 2
1 0
```
Explanation: break outer terminates the entire labeled outer loop, not just the inner loop.
    