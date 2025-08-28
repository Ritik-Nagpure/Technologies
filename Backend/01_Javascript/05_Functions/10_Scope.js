//  Scope
// Types of Scope in JavaScript

// 1. Global Scope
// Variables declared outside any function or block:
// ✅ Accessible throughout your program ❗ Can cause naming conflicts if overused


let globalVar = "I’m global";

function showGlobal() {
    console.log(globalVar); // ✅ Accessible here
}



// 2. Function Scope
// Variables declared with var, let, or const inside a function:
// ✅ Keeps variables contained ✅ Prevents pollution of global space


function myFunction() {
    let localVar = "I’m local";
    console.log(localVar); // ✅ Accessible here
}
// console.log(localVar); // ❌ Not accessible here!



// 3. Block Scope(ES6 +)
// Variables declared with let or const inside { } (like loops or conditionals):
// ✅ Safer than var, which is function-scoped ✅ Useful for clean and predictable control flow
// if var is used inside of loops or conditionals it will be having global scope as var is hoisted


{
    let blockVar = "Inside block";
    console.log(blockVar); // ✅
}
// console.log(blockVar); // ❌



// 4. Lexical Scope
// Nested functions can access variables from their outer functions:
// ✅ Enables closures and powerful abstraction patterns
//  the term 'lexical environment' in simple words, the lexical environment for a function 'outer'
//  simply refers to the environment enclosing that function's definition in the source code.

function outer() {
    const outerVar = "outer";
    function inner() {
        console.log(outerVar); // ✅ Accessible due to lexical scope
    }
    inner();
}

//  Example with All Scopes
// everything is accesible inside of if as console.log is inside the every variable's scope

let global = "🌍";

function outer() {
    let functionLevel = "🧠";
    if (true) {
        let blockLevel = "🔒";
        console.log(global, functionLevel, blockLevel);
    }
}
outer();
