// Arrow functions
// Create to write functions in shorter syntax

// normal functions
 f1 = function () {
    return "this is fucntions f1";
}


// Arrow function
let f2 = () => {
    return "this is fucntions f2";
}


// Arrow function returns by default
let f3 = () => "this is fucntions f3"


// Arrow function with parameters
let f4 = (val, greet) => greet+ val+" this is functions f5 "

// Arrow function with parameters without parenthesis
let f5 = val => val + " this is fucntions f4 "





console.log(f1());
console.log(f2());
console.log(f3());
console.log(f4(" Ritik " ,"Hi"));
console.log(f5("Ritik "));