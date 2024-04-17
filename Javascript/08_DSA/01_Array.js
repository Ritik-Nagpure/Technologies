// Arrays
// An array is a special variable, which can hold more than one value.

// Array declaration
let arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let arr2 = new Array();
let arr3 = [];

console.log("array 1 : ", arr1);
console.log("array 2 : ",arr2);
console.log("array 3 : ",arr3);

// accessing Array elements
arr2[0] = "hello";
arr2[1] = "hi";

arr3[0] = "ola";
arr3[1] = "hallo";

console.log("array 1 : ",arr1);
console.log("array 2 : ",arr2);
console.log("array 3 : ",arr3);

// Converting to string
console.log(arr1.toString());

// Determine size/length of an array
console.log(arr1.length);

// Adding element to array
arr1.push(15);
console.log(arr1);

// remove last element of array
arr1.pop();
console.log(arr1);

// Shift elements to lower index and remove 1st element
arr1.shift();
console.log(arr1);

// add element at beginging and shift elements to a higher index
arr1.unshift(95);
console.log(arr1);

//deleting elements leaving behind undefined values at that index
delete arr1[5];
console.log(arr1, arr1[5]);

// concating two arrays
let cataar = arr1.concat(arr2, arr3);
console.log(cataar);

// Flattening an Array
let flataar = [[1,2], ["hi","hello"],[56,85]]; // nexted array
console.log(flataar[1][1]); //accessing nested array elements
console.log(flataar);
console.log(flataar.flat());

// Splicing Array => used to add element at nth index
// Array.Splice(<starting index>, <number of elements to remove>, n times values we want to add separated by ',')
arr1.splice(2, 0, 45, 76, 85, 56);
console.log(arr1);
arr1.splice(2,2);
console.log(arr1);

// Slicing Array
console.log(arr1.slice(2,5));
console.log(arr1.slice(5));

// Joining Array
console.log(arr1.join(";"));

// Filtering Array
console.log(arr1.filter((val)=>val%2!=0));
console.log(arr1.filter((val)=>val%2==0));

// find element through Array
// finds first matching element as per expression/condition
console.log(arr1.find((val)=>val%2==0));

// find  element through Array
// finds first matching element's index as per expression/condition
console.log(arr1.findIndex((val)=>val%2==0));

// find last element through Array
// finds last matching element as per expression/condition
console.log(arr1.findLast((val)=>val%2==0));


// find last element through Array
// finds last matching element's Index as per expression/condition
console.log(arr1.findLastIndex((val)=>val%2==0));

// Reduce 
// A function to execute for each element in the array. Its return value becomes the value of the accumulator parameter on the next invocation of callbackFn. For the last invocation, the return value becomes the return value of reduce().
console.log(arr1.reduce((accumulator, currentValue) => accumulator + currentValue));

//Sorting Array
console.log(arr1.sort());
console.log(arr1.toSorted());

//Array iterator
for (i of arr1.values()) { console.log(i); }
arr1.forEach((el)=>console.log(el));
console.log(arr1.map((el) => el * 2))
console.log(arr1.some((el) => el * 2)) // some() => checks atleast one element passes the function

