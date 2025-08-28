// This Keyowrd
// The this keyword in JavaScript is a bit of a shape-shifter—it behaves differently depending on how and where it's used. 
// Let's break it down by context:

// 🧩 In Object Methods --> this refers to the object the method belongs to.

const person = {
  name: "Amit",
  greet() {
    console.log(this.name); // "Amit"
  }
};
person.greet(); // "Amit"


// 🏹 In Arrow Functions --> Arrow functions do not have their own this.
// They inherit this from their surrounding lexical scope.
// Suppose it is insidean object then this refers to object if it is inside a function this refer to the this of function

const person2 = {
  name: "Amit",
  greet: () => {
    console.log(this.name); // undefined (inherits from global)
  }
};
person2.greet(); // undefined



// 🔧 In Regular Functions --> Non-strict mode: this refers to the global object (window in browsers).
// Strict mode: this is undefined.

function show() {
  console.log(this); // window (non-strict), undefined (strict)   --> In DOM  , {} (empty Object) in Node
}

// 🧍‍♂️ Used Alone (Global Context) --> Outside any function or object, this refers to the global object.
console.log(this); // window (in browsers)

// 🖱️ In Event Handlers --> this refers to the DOM element that triggered the event.

/* html
<button onclick="this.style.background='red'">Click Me</button>
javascript
element.addEventListener("click", function () {
  console.log(this); // the clicked element
});

*/


/* 
🧪 Summary Table
        Context	                                 this refers to...
        Object Method	                    The object itself
        Regular Function	                Global object (non-strict) / undefined (strict)
        Alone	                            Global object
        Event Handler	                    The element that triggered the event
        Arrow Function	                    Lexical scope (outer this)
*/