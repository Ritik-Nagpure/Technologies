function shellSort(arr) {
  let n = arr.length;

  // Start with a big gap, then reduce
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;

      // Shift earlier gap-sorted elements until correct position found
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      // Place temp at its correct position
      arr[j] = temp;
    }
  }

  return arr;
}

// Example usage
let arr = [12, 34, 54, 2, 3];
console.log(shellSort(arr));
// Output: [2, 3, 12, 34, 54]
