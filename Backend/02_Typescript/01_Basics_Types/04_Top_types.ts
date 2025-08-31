/*
🚫 NEVER – represents unreachable code
🚫 What is never?
 The never type represents values that never occur. It’s used when a function:
    throws an error
    never returns
    or when you want to catch impossible code paths

🧠 Why is it useful?
    Helps catch unreachable code
    Forces you to handle all possible cases
    Makes your code more robust and future-proof


        Use Case	                    Description
    Throwing functions	        Functions that always throw
    Infinite loops	            Functions that never exit
    Exhaustive checks	        Catching unhandled cases in logic


 Example 1: Function that never returns
*/


function throwError(message: string): never {
    throw new Error(message);
}

// Exhaustive switch using never
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
    switch (shape) {
        case "circle":
            return Math.PI * 1 * 1;
        case "square":
            return 1 * 1;
        default:
            // If a new shape is added and not handled, this triggers a type error
            const exhaustiveCheck: never = shape;
            return exhaustiveCheck;
    }
}

console.log(getArea('circle'));
