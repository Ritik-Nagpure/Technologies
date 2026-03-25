//  given is number n find the first n numbers of an fibonacci series
// Time complexity: O(n) → loop builds sequence up to n
// Space complexity: O(n) → array stores n elements

let n = 5
console.log(`entered n is ${n}`);

const fibonacci = (n) => {
    let fibo = [0, 1]
    for (let i = 2; i < n; i++) {
        fibo[i] = fibo[i - 1] + fibo[i - 2]
    }
    if (n == 0) {
        return 'na'
    }
    else if (n == 1) {
        return [0];
    }
    else {
        return fibo
    }
}


console.log(fibonacci(0))
console.log(fibonacci(1))
console.log(fibonacci(2))
console.log(fibonacci(3))
console.log(fibonacci(7))