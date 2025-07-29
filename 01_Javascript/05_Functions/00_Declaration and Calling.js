// Declaring a Function 
// function is a code block which is written in order to use same code multiple times
// is declared with function keyword
// function <function_name> (<functions_parameters>){ <code block> }
// is called as <function_name>();
// has a return keyword which can return a value at the end. no code after return keyword inside a function is accessed once return is called.

// declare using function keyword with name after the keyword

function printValues(val) {
    console.log(val);
}


// declare using function keyword with assigning it to a variable which will serve as a name of that function
let func1 = function (a, b) {
    return a + b
}

printValues("Print this Function example.");
printValues("as you see");
printValues("this is written once");
printValues("but called many times. !!!!");

console.log(func1(3, 4));
