function insertionSort(arr) {
  let n = arr.length;

  // Start from the second element
  for (let i = 1; i < n; i++) {
    let key = arr[i]; // current element to insert
    let j = i - 1;

    // Shift elements of the sorted part that are greater than key
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Place key at its correct position
    arr[j + 1] = key;
  }

  return arr;
}

// Example usage
let arr = [12, 11, 13, 5, 6];
console.log(insertionSort(arr));
// Output: [5, 6, 11, 12, 13]
