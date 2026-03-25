//  given is number n find of an factorial a number n using Recursion
// Time Complexity: O(n) → makes n recursive calls
// Space Complexity: O(n) → call stack grows to depth n

const factorial = (n) => {
    if (n > 1) {
        return (n * factorial(n - 1));
    }
    return 1;
}


console.log(factorial(0))
console.log(factorial(1))
console.log(factorial(2))
console.log(factorial(3))
console.log(factorial(4))
console.log(factorial(5))
console.log(factorial(6))
console.log(factorial(7))