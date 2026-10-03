function heapify(arr, n, i) {
  let largest = i;       // assume root is largest
  let left = 2 * i + 1;  // left child
  let right = 2 * i + 2; // right child

  // If left child is larger
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // If right child is larger
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // If largest is not root, swap and continue heapifying
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  let n = arr.length;

  // Step 1: Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Step 2: Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Heapify reduced heap
    heapify(arr, i, 0);
  }

  return arr;
}

// Example usage
let arr = [12, 11, 13, 5, 6, 7];
console.log(heapSort(arr));
// Output: [5, 6, 7, 11, 12, 13]
