// write a program to check if the number is a power of two


const ispoweroftwo = (n) => {
    if (n == 1) {
        return true;
    }
    else {
        if (n % 2 !== 0) {
            return false
        }
        return ispoweroftwo(n / 2);
    }
}


const num_list = [2, 4, 6, 8, 10, 14, 16, 20, 30, 32, 34, 64, 128, 512, 1024];

for (let number of num_list) {
    console.log(`number ${number} is Power of two : ${number > 1 ? ispoweroftwo(number) : false}`);
}