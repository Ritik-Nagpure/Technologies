// Function in TS
function normalfunc(val: number): string {
    return (val % 2 == 0) ? "even" : "odd";
}

// Arrow functions in TS
// default and optional parameter with (?) as suffix
let arrowfunction: any = (val: number, val2?: number, val3: number = 45): string => {
    return (val % 2 == 0) ? "even" : "odd";
}


console.log(normalfunc(56));
console.log(arrowfunction(56));

console.log(normalfunc(55));
console.log(arrowfunction(55));


function getMean(...numbers: number[]): any[] {  // function return type is any array and returns [<number>, <string>]
    let sum: number = 0;
    for (let i: number = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    let eochk: string = (sum % 2 == 0) ? "even" : "odd";;
    return [sum, eochk];
}

let ans: string[] = getMean(1, 2, 3, 4, 5, 6, 7); // ans var is of type number array and doesn't accept any string value but it does through function call
console.log(`sum of numbers is ${ans[0]} and the sum is ${ans[1]}`);


// Solution to this is returning an object instead of array :
// interface checkobj {
//     sum: number,
//     numtype: string
// }
// function getMean(...numbers: number[]): checkobj {
//     let sum: number = 0;
//     for (let i: number = 0; i < numbers.length; i++) {
//         sum += numbers[i];
//     }
//     let eochk: string = (sum % 2 == 0) ? "even" : "odd";;
//     return { "sum": sum, "numtype": eochk };
// }

// let ans: checkobj = getMean(1, 2, 3, 4, 5, 6, 7);

// console.log(`sum of numbers is ${ans.sum} and the sum is ${ans.numtype}`);

