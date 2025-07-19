let num = 6 // avalue is assigned to varialble num
console.log(num);

num=7 // value is changed to 7
console.log(num);

// 6 is a value stored directly in memory.
// when num is assigned to 7, a new value is created in memory and num now points to that new value.
// therefore 6 is no longer referred by any other variable and is eligible for garbage collection.
// As Garbage Collector runs, it will free up the memory occupied by 6.
// Garbage Collector is a process that automatically frees up memory by removing objects that are no longer needed.
// As a resule 6 present anywhere in memory.

// If no referece is available then the value is eligible for garbage collection irrespective of the type ( primitive or non-primitive).