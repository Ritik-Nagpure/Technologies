//  given is number n find of an factorial a number n
// Time complexity: O(n) → loop runs n times
// Space complexity: O(1) → only res variable used

let num = 5
console.log(`entered n is ${num}`);

const factorial = (n) => {
    let res = 1;
    for (i = 2; i <= n; i++) {
        res = res * i
    }
    return res
}


console.log(factorial(0))
console.log(factorial(1))
console.log(factorial(2))
console.log(factorial(3))
console.log(factorial(4))
console.log(factorial(5))
console.log(factorial(6))
console.log(factorial(7))