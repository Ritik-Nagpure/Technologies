// Linear search is searching algorithm where we check each value of the array to find the exact match and return its index. if not we return -1 as no value found.
// independent of sorting as it checks all the values so if the array is sorted and the number is less then search time will be less but if the number is large at the near end of array then sorted will take more time 
// usually O(n) is the time complexity in such case

let arr = [-5, -3, 0, 2, 6, 10, 15, 20, 19, 98, 87, 26, -8, 72]

const getelem = (target) => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === target) {
            return i
        }
    }
    return -1
}

console.log(getelem(6));
console.log(getelem(98));
console.log(getelem(67));
console.log(getelem(26));
