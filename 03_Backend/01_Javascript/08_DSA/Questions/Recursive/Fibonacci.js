//  given is number n find the first n numbers of an fibonacci series
// Time Complexity: O(2^n) → naive recursion recomputes many values
// Space Complexity: O(n) → recursion depth grows with n

const fibonacci = (num) => {
    const fibo_rec = (n) => {
        if (n < 2) {
            return n
        }
        return fibo_rec(n - 1) + fibo_rec(n - 2)
    }

    let sequence = [];
    for (let i = 0; i < num; i++) {
        sequence.push(fibo_rec(i));
    }
    return sequence;
}


console.log(fibonacci(0))
console.log(fibonacci(1))
console.log(fibonacci(2))
console.log(fibonacci(3))
console.log(fibonacci(4))
console.log(fibonacci(5))
console.log(fibonacci(6))
console.log(fibonacci(7))