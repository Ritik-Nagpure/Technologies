function bubbleSort(arr) {
  let n = arr.length;

  // Outer loop for passes
  for (let i = 0; i < n - 1; i++) {
    // Inner loop for comparisons
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if out of order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}

// Example usage
let arr = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(arr));
// Output: [11, 12, 22, 25, 34, 64, 90]
