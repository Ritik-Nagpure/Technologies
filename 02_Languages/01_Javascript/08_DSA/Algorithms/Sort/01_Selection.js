function selectionSort(arr) {
  let n = arr.length;

  // Outer loop: move boundary of unsorted array
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i; // assume current index is minimum

    // Inner loop: find the actual minimum in the unsorted part
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // update minIndex if smaller element found
      }
    }

    // Swap the found minimum with the first element of unsorted part
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }

  return arr;
}

// Example usage
let arr = [64, 25, 12, 22, 11];
console.log(selectionSort(arr)); 
// Output: [11, 12, 22, 25, 64]
