// Binary Search is an efficient algorithm to find an element in a sorted array by repeatedly dividing the search interval in half.
// The array (or list) must be sorted. Without sorting, binary search does not work.

// using recursion

let arr = [-5, -3, 0, 2, 3, 5, 6, 7, 8, 10, 15, 16, 19, 20, 28, 45, 56, 62, 78, 84, 98, 99, 101]

const getelem = (arr, target, start, end) => {
    if (start <= end) {
        let mid = Math.floor((start + end) / 2);

        if (arr[mid] === target) {
            return mid
        }
        if (arr[mid] > target) {
            return getelem(arr, target, start, mid - 1);
        }
        if (arr[mid] < target) {
            return getelem(arr, target, mid + 1, end);
        }
        
    }
    return -1
}

console.log(getelem(arr, -3, 0, arr.length - 1));
console.log(getelem(arr, 99, 0, arr.length - 1));
console.log(getelem(arr, 19, 0, arr.length - 1));
console.log(getelem(arr, 28, 0, arr.length - 1));
console.log(getelem(arr, 26, 0, arr.length - 1));
console.log(getelem(arr, 45, 0, arr.length - 1));
console.log(getelem(arr, 54, 0, arr.length - 1));
