// Binary Search is an efficient algorithm to find an element in a sorted array by repeatedly dividing the search interval in half.
// The array (or list) must be sorted. Without sorting, binary search does not work.

let arr = [-5, -3, 0, 2, 3, 5, 6, 7, 8, 10, 15, 16, 19, 20, 28, 45, 56, 62, 78, 84, 98, 99, 101]

const getelem = (target) => {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);

        if (arr[mid] === target) {
            return mid
        }
        if (arr[mid] > target) {
            end = mid - 1;
        }
        if (arr[mid] < target) {
            start = mid + 1;
        }
    }
    return -1

}

console.log(getelem(-3));
console.log(getelem(99));
console.log(getelem(19));
console.log(getelem(28));
console.log(getelem(26));
console.log(getelem(45));
console.log(getelem(54));
