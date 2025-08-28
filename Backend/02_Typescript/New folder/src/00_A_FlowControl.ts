// if; if, else; if, else if, else;
let val: string = 'y'

// if statement
// block is executed only if 'if' condition is true
if (val == 'y') {
    console.log("printed from if statement only");
}


// if else statement
// block is executed only if 'if' condition is true in case its false else part is executed
if (val == 'n') {
    console.log("printed from if block of if else statement only");
}
else {
    console.log("printed from else block of if else statement only");
}


// Nested if else Statement
// block is executed where any of the if/ else if condition is true in case all are false else part is executed
if (val == 'a') {
    console.log("printed from if block of nested if else statement only");
}
else if (val == 'y') {
    console.log("printed from else if block of nested if else statement only");
}
else {
    console.log("printed from else block of nested if else statement only");
}

// Ternary Operator
let eochk = (val == 'y') ? "True : from ternary operator block" : "False : from ternary operator block";
console.log(eochk);


// Similarly While, Do while, for and switch cases also work same as in js