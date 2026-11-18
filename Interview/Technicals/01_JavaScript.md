## 1. What is JavaScript?
JavaScript is a high-level, dynamically typed, single-threaded programming language primarily used to build interactive and dynamic web applications.

It is one of the core technologies of web development, alongside HTML and CSS.

JavaScript supports multiple programming paradigms, including object-oriented, functional, and event-driven programming.

It can run in browsers as well as on servers using runtimes like Node.js.

Some of its key features are:
- Dynamically typed language.
- Prototype-based inheritance.
- First-class functions.
- Asynchronous programming using callbacks, promises, and async/await.
- Event-driven and non-blocking execution.
- Automatic memory management through garbage collection.
In my experience, I primarily use JavaScript and TypeScript with React.js, Next.js, and Node.js to develop scalable full-stack applications.


## 2. What is hoisting in JavaScript?
Hoisting is a JavaScript mechanism in which variable and function declarations are processed during the memory creation phase before the code execution phase.

Variables declared with var are hoisted and initialized with undefined, whereas let and const are hoisted but remain in the Temporal Dead Zone (TDZ) until initialization.

Function declarations are fully hoisted, meaning we can call them before their definition.

```javascript
console.log(name); // undefined
var name = "Ritik";

greet(); // Hello

function greet() {
    console.log("Hello");
}
```

## 3. What is a closure?
A closure is a feature in JavaScript where an inner function remembers and retains access to variables from its outer function's lexical scope, even after the outer function has finished executing.
Closures are commonly used for data privacy, maintaining state, function factories, and callbacks.


## 4. How does a closure work?
A closure works through lexical scoping.
When an inner function is created inside an outer function, it maintains access to its outer lexical environment.
Even after the outer function completes execution, the inner function can still access the variables from that environment.
JavaScript keeps the required lexical environment available as long as it remains reachable.

## 5. Give an example of a closure.
```javascript
function counter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const increment = counter();

console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
```
Here, the inner function maintains access to the count variable even after the outer function has finished executing. This is a closure.


## 6. Give another practical example of a closure.
```javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit(amount) {
            balance += amount;
            return balance;
        },

        withdraw(amount) {
            if (amount > balance) {
                return "Insufficient balance";
            }

            balance -= amount;
            return balance;
        },

        getBalance() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);

console.log(account.deposit(500));  // 1500
console.log(account.withdraw(200)); // 1300
console.log(account.getBalance());  // 1300
```

Here, the balance variable cannot be directly accessed or modified from outside the function.Only the returned methods can interact with it. This demonstrates how closures help achieve data privacy and encapsulation.


## 7. What is the difference between `var` and `let`?
The main differences between var and let are their scope, hoisting behavior, and redeclaration rules.
1. Scope:
   - var is function-scoped.
   - let is block-scoped.

2. Hoisting:
   - var is hoisted and initialized with undefined.
   - let is hoisted but remains in the Temporal Dead Zone (TDZ).
     - Temporal Dead Zone (TDZ) is the period between entering a scope and the point where a let or const variable is initialized. Accessing the variable during this period throws a ReferenceError.
3. Redeclaration:
   - var allows redeclaration within the same scope.
   - let does not allow redeclaration within the same scope.

4. Reassignment:
   - Both var and let allow reassignment.

```javascript
function example() {
    if (true) {
        var a = 10;
        let b = 20;
    }

    console.log(a); // 10
    console.log(b); // ReferenceError
}
```

In modern JavaScript, I prefer using let and const because they provide better scope management and reduce unexpected behavior.


## 8. What happens when you access a `var` variable before initialization?
When we access a var variable before its declaration, JavaScript returns undefined instead of throwing an error.

This happens because var declarations are hoisted and automatically initialized with undefined during the creation phase.

```javascript
console.log(name); // undefined

var name = "Ritik";

JavaScript behaves approximately like this internally:

var name;

console.log(name); // undefined

name = "Ritik";
```
Only the declaration is hoisted, not the assignment.

## 9. What happens when you access a `let` variable before initialization?
When we access a let variable before its initialization, JavaScript throws a ReferenceError.This happens because let variables are hoisted but remain in the Temporal Dead Zone (TDZ) until their declaration is evaluated.

```javascript
console.log(name); // ReferenceError

let name = "Ritik";
```
The variable exists in its lexical scope, but we cannot access it before initialization.
This behavior prevents accidental access to variables before they are properly initialized.


## 10. What is the difference between regular functions and arrow functions?
The main differences are related to this binding, arguments, constructors, hoisting, and syntax.

1. Syntax:
   - Regular functions use the function keyword.
   - Arrow functions use the => syntax.

2. this binding:
   - Regular functions have dynamic this binding.
   - Arrow functions inherit this from their surrounding lexical scope.

3. arguments:
   - Regular functions have their own arguments object.
   - Arrow functions do not have their own arguments object.

4. Constructor:
   - Regular functions can be used as constructors with new.
   - Arrow functions cannot be used as constructors.

5. Prototype:
   - Regular functions have a prototype property.
   - Arrow functions do not have a prototype property.

6. Return:
   - Regular functions generally require an explicit return statement.
   - Arrow functions support implicit returns for concise expressions.
```javascript
function regularFunction() {
    return "Hello";
}

const arrowFunction = () => "Hello";
```
In my experience, I commonly use arrow functions for callbacks and React event handlers because their lexical this behavior is predictable.


## 11. How does hoisting work with regular functions?

Regular function declarations are completely hoisted.

This means both the function name and its implementation are available before the function declaration appears in the code.
```javascript
greet(); // Hello Ritik

function greet() {
    console.log("Hello Ritik");
}
```
JavaScript makes the entire function declaration available during the creation phase. However, function expressions assigned to variables follow the hoisting rules of the variable declaration.


## 12. How does hoisting work with arrow functions?
Arrow functions are not hoisted like regular function declarations.They follow the hoisting behavior of the variable used to store them.

```javascript
greet();

var greet = () => {
    console.log("Hello");
};

// TypeError: greet is not a function
```
Here, greet is hoisted and initialized with undefined. When JavaScript tries to execute it, it throws a TypeError.

```javascript
greet();

let greet = () => {
    console.log("Hello");
};

// ReferenceError
```
Here, greet is in the Temporal Dead Zone (TDZ), so accessing it before initialization throws a ReferenceError. The important point is that arrow functions follow variable hoisting rules, not regular function declaration hoisting rules.


## 13. What are the different data types available in JavaScript?
JavaScript has seven primitive data types and one non-primitive data type.
Primitive data types:

1. String:
   Represents textual data.
   Example: let name = "Ritik";

2. Number:
   Represents integers and floating-point numbers.
   Example: let age = 26;

3. Boolean:
   Represents true or false.
   Example: let isDeveloper = true;

4. Undefined:
   Represents a variable that has been declared but not assigned a value.
   Example: let salary;

5. Null:
   Represents an intentional absence of a value.
   Example: let address = null;

6. BigInt:
   Represents integers larger than the safe Number limit.
   Example: let bigNumber = 12345678901234567890n;

7. Symbol:
   Represents unique identifiers.
   Example: let id = Symbol("id");

Non-primitive data type:

8. Object:
   Represents collections of properties and values.
   Example:

   let user = {
       name: "Ritik",
       age: 26
   };

Arrays and functions are also objects in JavaScript.

## 14. How are JavaScript data types categorized?

JavaScript data types are categorized into two major groups:

1. Primitive Data Types
2. Non-Primitive (Reference) Data Types

1. Primitive Data Types:

- String
- Number
- Boolean
- Undefined
- Null
- BigInt
- Symbol

Characteristics:
- They represent single values.
- They are immutable.
- Assignment copies the value.
- They are compared by value.

2. Non-Primitive Data Types:

- Object
- Array
- Function
- Date
- Map
- Set

Characteristics:
- They represent complex data structures.
- Objects are mutable.
- Assignment copies the reference value.
- Objects are compared by reference identity.

```javascript
let a = 10;
let b = a;

b = 20;

console.log(a); // 10

let user1 = { name: "Ritik" };
let user2 = user1;

user2.name = "Rahul";

console.log(user1.name); // Rahul
```

In the first example, changing b does not affect a because primitive assignment copies the value. In the second example, both variables reference the same object, so modifying the object through one reference is visible through the other. This is an important distinction when working with objects, arrays, and state management in React applications.



## 15. What are `map()`, `filter()`, and `reduce()`?
map(), filter(), and reduce() are higher-order array methods in JavaScript used to process and transform array elements.

1. map():
   - Iterates over every element.
   - Performs an operation on each element.
   - Returns a new array with the transformed elements.
   - Does not modify the original array.

2. filter():
   - Iterates over every element.
   - Checks a condition against each element.
   - Returns a new array containing only elements that satisfy the condition.
   - Does not modify the original array.

3. reduce():
   - Iterates over every element.
   - Executes a callback function and accumulates the result.
   - Returns a single accumulated value.
   - Commonly used for summation, grouping, counting, and object transformations.

```javascript
const numbers = [1, 2, 3, 4, 5];

const mapped = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]

const filtered = numbers.filter(num => num > 2);
// [3, 4, 5]

const reduced = numbers.reduce((acc, num) => acc + num, 0);
// 15
```

## 16. What does `map()` return?
map() returns a new array containing the results of applying the callback function to every element of the original array.The returned array always has the same length as the original array.It does not modify the original array.

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(num => num * 2);

console.log(result);
// [2, 4, 6]

console.log(numbers);
// [1, 2, 3]
``` 


## 17. What does `filter()` return?
filter() returns a new array containing only those elements that satisfy the condition specified in the callback function. The returned array can have fewer elements or the same number of elements as the original array. If no elements match, it returns an empty array. It does not modify the original array.

```javascript
const numbers = [1, 2, 3, 4, 5];

const result = numbers.filter(num => num > 3);

console.log(result);
// [4, 5]

console.log(numbers);
// [1, 2, 3, 4, 5]

```

## 18. On which data structures can we use `map()`?
The map() method is available on JavaScript arrays and Map objects, but they are two different implementations.

1. Array.prototype.map():
   - Used to transform array elements.
   - Returns a new array.

2. Map.prototype:
   - A Map object stores key-value pairs.
   - Provides methods such as set(), get(), has(), and delete().
   - It does not provide the array map() method directly.

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(num => num * 2);

console.log(result);
// [2, 4, 6]
```

For Set objects, we can convert them into arrays using Array.from() or the spread operator before using map().

## 19. What is an accumulator in `reduce()`?
An accumulator is a variable maintained by the reduce() method that stores the accumulated result after each iteration.It receives the return value of the previous callback execution and passes it to the next iteration.The accumulator gets its initial value from the second argument of reduce().

```javascript
array.reduce((accumulator, currentValue) => {
    return updatedAccumulator;
}, initialValue);
```
## 20. Give an example of an accumulator in `reduce()`.
 Calculate the sum of all numbers in an array.
```javascript
const numbers = [10, 20, 30, 40];

const total = numbers.reduce((acc, currentValue) => {
    return acc + currentValue;
}, 0);

console.log(total);
// 100
```
Execution:

Iteration 1: acc = 0,  currentValue = 10, result = 10
Iteration 2: acc = 10, currentValue = 20, result = 30
Iteration 3: acc = 30, currentValue = 30, result = 60
Iteration 4: acc = 60, currentValue = 40, result = 100

Here, acc is the accumulator, which maintains the running total throughout the iterations.

## 21. What is the `find()` function?
find() is a JavaScript array method used to search for an element that satisfies a given condition.

It returns the first element that satisfies the condition.

If no element matches the condition, it returns undefined.

It does not modify the original array.

## 22. How do you use `find()`?
We use find() by passing a callback function that defines the condition for searching an element.
Here, find() checks each element and returns the first user whose id is 2.

```javascript
const users = [
    { id: 1, name: "Ritik" },
    { id: 2, name: "Rahul" },
    { id: 3, name: "Amit" }
];

const user = users.find(user => user.id === 2);

console.log(user);
// { id: 2, name: "Rahul" }
```

## 23. What is the difference between `find()` and `filter()`?
The main difference is that find() returns the first matching element, whereas filter() returns all matching elements in a new array.

1. find():
   - Returns a single matching element.
   - Stops searching after finding the first match.
   - Returns undefined if no match is found.

2. filter():
   - Returns an array of all matching elements.
   - Checks every element.
   - Returns an empty array if no match is found.

```javascript
const numbers = [10, 20, 30, 20, 40];

const result1 = numbers.find(num => num === 20);

console.log(result1);
// 20

const result2 = numbers.filter(num => num === 20);

console.log(result2);
// [20, 20]
```
In practical applications, I use find() when retrieving a specific record by ID and filter() when implementing search results or filtering lists.

## 24. How do you flatten a nested array into a single-level array while maintaining element order?
We can flatten a nested array into a single-level array using recursion.
```javascript
const nestedArray = [1, [2, [3, 4]], 5];

function flattenArray(arr) {
    let result = [];

    for (let element of arr) {
        if (Array.isArray(element)) {
            result = result.concat(flattenArray(element));
        } else {
            result.push(element);
        }
    }

    return result;
}

console.log(flattenArray(nestedArray));
// [1, 2, 3, 4, 5]
```
Explanation:

1. Iterate through each element.
2. Check whether the element is an array using Array.isArray().
3. If it is an array, recursively flatten it.
4. If it is not an array, push it into the result.
5. Return the flattened array.

Recursion ensures that nested arrays of any depth are flattened while maintaining the original element order.

## 25. How do you sort an array in ascending order without using built-in functions?
We can sort an array in ascending order using the Bubble Sort algorithm.

Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.
```javascript
const numbers = [5, 2, 8, 1, 3];

function sortAscending(arr) {
    let result = [...arr];

    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - i - 1; j++) {

            if (result[j] > result[j + 1]) {
                let temp = result[j];

                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }

    return result;
}

console.log(sortAscending(numbers));
// [1, 2, 3, 5, 8]
```
Explanation:

1. The outer loop controls the number of passes.
2. The inner loop compares adjacent elements.
3. If the current element is greater than the next element, swap them.
4. After every pass, the largest unsorted element moves to its correct position.
5. Repeat until the array is sorted.

Time Complexity:
- Best Case: O(n) with an optimized early-exit check.
- Average Case: O(n²).
- Worst Case: O(n²).

Space Complexity: O(n) because we create a copy of the original array.

This implementation does not use built-in sorting methods and preserves the original array.



## 26. Given a nested array, predict the output after flattening it.

The output depends on the nesting level and the flattening approach used.

JavaScript provides the flat() method to flatten nested arrays.

```javascript
const arr = [1, [2, 3], [4, [5, 6]]];

console.log(arr.flat());
// [1, 2, 3, 4, [5, 6]]

console.log(arr.flat(Infinity));
// [1, 2, 3, 4, 5, 6]
```

The flat() method accepts a depth parameter. By default, it flattens only one level. Using Infinity flattens all nested levels while maintaining element order.

## 27. Given a `setTimeout()` inside a `for` loop, predict the output.

JavaScript uses the event loop to handle asynchronous callbacks.

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}

// Output:
// 3
// 3
// 3
```

This happens because var is function-scoped, and all three callbacks share the same variable i.

The loop completes before the setTimeout callbacks execute. At that point, i becomes 3, so all callbacks print 3.

Using let:

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}

// Output:
// 0
// 1
// 2
```

This happens because let creates a separate binding for each loop iteration, so each callback remembers its corresponding value of i.

## 28. Given a JavaScript code snippet, determine its execution output.

To determine the output of JavaScript code, I analyze the execution context, hoisting, scope, data types, closures, and event loop.

The important things I check are:

1. Hoisting: Whether variables and functions are accessible before declaration.
2. Scope: Whether variables are function-scoped or block-scoped.
3. Temporal Dead Zone: Whether let and const variables are accessed before initialization.
4. Type coercion: How JavaScript converts values between different data types.
5. Closures: Whether inner functions retain access to outer variables.
6. this binding: How the this keyword is determined during function execution.
7. Asynchronous execution: How callbacks, promises, and setTimeout interact with the event loop.
8. Execution order: Whether synchronous code, microtasks, or macrotasks execute first.

I first execute the synchronous code, then process microtasks such as Promise callbacks, followed by macrotasks such as setTimeout callbacks.

This helps me determine the exact execution order and output of a JavaScript program.

