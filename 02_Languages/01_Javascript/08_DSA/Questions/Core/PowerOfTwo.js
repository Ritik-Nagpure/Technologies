// write a program to check if the number is a power of two
// normal method: O(log n) → divides n by 2 until 1
// bitwise method: O(1) → single check using bitwise AND
// Space complexity: O(1) → constant extra space


const ispoweroftwo = (num) => {
    const normal = (n) => {
        if (n < 1) {
            return false;
        }
        else {
            while (n > 1) {
                if (n % 2 !== 0) {
                    return false
                }
                n = n / 2;
            }
            return true

        }
    }

    const bitwise = (n) => {
        if (n < 1) {
            return false
        }
        else {
            return ((n & (n - 1)) === 0);
        }
    }

    // let ans = normal(num);
    let ans = bitwise(num);

    return ans;
}

const num_list = [2, 4, 6, 8, 10, 14, 16, 20, 30, 32, 34, 64, 128, 512, 1024];

for (let number of num_list) {
    console.log(`number ${number} is Power of two : ${ispoweroftwo(number)}`);
}