// program to find prime number
// Time Complexity: O(√n) → recursion checks divisors up to √n.
// Space Complexity: O(√n) → recursion depth grows with number of calls.

console.log("Check Prime Numbers :");

const checkprime = (num, i = 2) => {
    if (num <= 1) return false;
    if (i > Math.sqrt(num)) return true;
    if (num % i === 0) return false;

    return checkprime(num, i + 1)
}

const num_list = [56, 23, 33, 17, 57, 29, 11, 7, 13];

for (let n of num_list) {
    console.log(`number ${n} is a Prime Number : ${checkprime(n)}`);
}