// Arrow functions
// Create to write functions in shorter syntax

// normal functions
function f1() {
    return "this is fucntions f1";
}


// Arrow function
// no function ketyword is required here 
let f2 = () => {
    return "this is fucntions f2";
}


// Arrow function returns by default / implicitly 
// Below are the two wasy to return the function 

let f3 = () => "this is fucntions f3"
let f31 = () => ("this is fucntions f31")

// Arrow function with parameters
let f4 = (val, greet) => greet + val + " this is functions f4 "

// Arrow function with parameters without parenthesis works only if there is only one parameter
let f5 = val => val + " this is fucntions f5 "


// Pro tips
// Arrow functions don't bind their own this, which means inside objects or classes, you should use regular functions.



console.log(f1());
console.log(f2());
console.log(f3());
console.log(f31());
console.log(f4(" Ritik ", "Hi"));
console.log(f5("Ritik "));



/*

Feature	                  Traditional Function                  	            Arrow Function
Syntax	                    function greet() {}	                             const greet = () => {}
this Binding	        Dynamic (depends on how it's called)	            Lexical (inherits from surrounding)
Usage as method	        Works well as object method	                        May not bind this properly
Constructor             Use	Can be used with new	                        Cannot be used as constructor
Arguments object	            Available	                                    Not available
*/


// Argumetnts object
let argf = function () {
    console.log(arguments);
}

let argarrf = () => {
    console.log(arguments);
}

console.log('// Arguments Object')
argf(3,4,5,6,7,9) // --> takes the values passed an as object called arguments
argarrf(3,4,5,6,7,8) // --> takes some weired thing as object possibly window or anything else but not the values passed
// to imitate arguments in arrow functions use spread operator


// This keyword
// Arrow functions are great for callbacks (like in setTimeout or array methods) because they avoid unexpected this behaviors.
// This is not present in arrow functions so they take this from their surrounding scope.