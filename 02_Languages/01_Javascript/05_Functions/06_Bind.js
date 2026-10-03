/*
🧠 Function Borrowing in JavaScript

🔍 What is it?
    Function borrowing allows one object to use a method defined in another object. 
    This is done using call() or apply() to temporarily bind the method’s this to the borrowing object.

📌 Why use it?
    To reuse methods across objects without duplication.
    To apply shared logic to different data structures.

🧠 Notes:
    call() invokes the function immediately and passes arguments individually.
    apply() does the same but takes arguments as an array.
    Borrowing is temporary—person2 doesn’t permanently gain greet.

*/

const person1 = {
  name: 'Alice',
  greet: function () {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const person2 = {
  name: 'Bob'
};

// 🔁 Borrowing greet from person1
person1.greet.call(person2); // Output: Hello, I'm Bob

/* 
🧠 bind() in JavaScript
🔍 What is it?
    bind() creates a new function with a permanently bound this value. 
    Unlike call() or apply(), it does not invoke the function immediately.

📌 Why use it?
    To fix the this context for later use.
    Useful in event handlers, callbacks, or when passing methods around.

🧠 Notes:
    bind() returns a new function with fixed this.
    You can also pre-fill arguments (partial application).
    Commonly used in class methods, React components, and event listeners.

*/

const car = {
  brand: 'Tesla',
  showBrand: function () {
    console.log(`Brand: ${this.brand}`);
  }
};

const show = car.showBrand.bind(car); // 🔒 `this` is now locked to `car`
show(); // Output: Brand: Tesla

// Even if we try to change context, it stays bound:
const fakeCar = { brand: 'Ford' };
show.call(fakeCar); // Output: Brand: Tesla

// Example 2
let o = {
    carid: 123,
    getid: function(){
        return this.carid;
    }
}

let newcar = { carid: 465 }

let newfunc = o.getid.bind(newcar);
console.log(newfunc());
