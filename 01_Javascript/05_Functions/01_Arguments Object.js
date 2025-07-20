// Arguments Object 
// The arguments object is a local variable available within all non-arrow functions. You can refer to a function's arguments inside that function by using its arguments object. 

function func1(a, b, c) {
    console.log(arguments[0]);

    console.log(arguments[1]);

    console.log(arguments[2]);
    console.log(arguments[2]);
    console.log(arguments[2]);
    console.log(arguments[2]);

    console.log(arguments[3]); // undefined, since no fourth argument is passed
    console.log(arguments.length); // 3, since three arguments are passed
    console.log(arguments); // [1, 2, 3]
}

func1(1, 2, 3);