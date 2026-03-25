// program to find prime number
// Time complexity: O(√n) → loop checks divisors up to sqrt(n)
// Space complexity: O(1) → constant extra space


console.log("Check Prime Numbers :");

const checkprime = (num) => {
    if (num > 1) {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                return "Not a Prime Number"
            }
        }
    }
    return "Prime Number";
}

const num_list = [56, 23, 33, 17, 57, 29, 11, 7, 13];

for (let n of num_list) {
    console.log(`number ${n} is : ${checkprime(n)}`);
}