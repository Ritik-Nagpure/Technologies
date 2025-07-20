// Callback functions
// A callback is a function passed as an argument to another function.

function myDisplayer(some) {
    console.log(some);
}

function myCalculator(num1, num2, myCallback) {
    let sum = num1 + num2;
    myCallback(sum);
}

function issumeven(num) {
    ans = num % 2 == 0 ? true : false;
    console.log(ans);
}

myCalculator(5, 5, myDisplayer);
myCalculator(5, 5, issumeven);
myCalculator(5, 8, issumeven);