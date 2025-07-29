/*
❔ Nullish Coalescing (??)
Used to return a default only if the left operand is null or undefined (not false, 0, '', etc).
if left side is null or undefined right is choosen
if left is falsy or truty left is choosen
*/

let username = null;
let defaultName = username ?? "Guest";
console.log(defaultName); // Output: Guest

let trufalchk = false ?? 'Wow What an example'
console.log(trufalchk);

// Compare with logical OR (||) which also treats falsy values like 0 or '' as needing defaults:
// if left side is falsy,null or undefined --> right value is choosen

let count = 0;
let display = count || 10;      // Output: 10
let displaySafe = count ?? 10;  // Output: 0


console.log(display);
console.log(displaySafe);

const und = undefined
let nuunorchk = null || 'Pathetic Example'
console.log(nuunorchk);


// Example 

function getUserName(userInput) {
    return userInput ?? "Anonymous";
}

console.log(getUserName("Alice"));    // Output: Alice
console.log(getUserName(undefined));  // Output: Anonymous
