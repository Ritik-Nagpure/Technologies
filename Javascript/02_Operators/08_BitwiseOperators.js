// Bitwise Operators
let val = 10;
console.log(val);
console.log(val.toString(2));

val <<= 1;  // shifts bit to left
console.log(val);
console.log(val.toString(2));

val >>= 3;  // shifts bit to right
console.log(val);
console.log(val.toString(2));

val >>>=1 ; //shifts to right keeping the sign
console.log(val);
console.log(val.toString(2));


// Bitwise Operators
let num1 = 6;
console.log("num1" , num1, num1.toString(2));

let num2 = 3;
console.log("num2" , num2, num2.toString(2));

// & Bitwise AND
let andans = num1 & num2;
console.log( "num1 & num2 : ", andans, andans.toString(2));

// Explainaton      [ 1 and 1 ==> 1 ;  1 and 0 ==> 0]
//     6 ==>   110
//     3 ==>   011
//     and    _____
//     2 ==>   010

// | Bitwise OR  
let orans = num1 | num2;
console.log( "num1 | num2 : ", orans, orans.toString(2));

// Explainaton       [ 1 or 1 ==> 1 ;  1 or 0 ==> 1]
//     6 ==>   110
//     3 ==>   011
//     or     _____
//     7 ==>   111


// ^ Bitwise XOR  
let xorans = num1 ^ num2;
console.log( "num1 ^ num2 : ", xorans, xorans.toString(2));

// Explainaton       [ 1 xor 1 ==> 0 ;  1 xor 0 ==> 1]
//     6 ==>   110
//     3 ==>   011
//     xor    _____
//     7 ==>   101

// ! Bitwise NOT
let notans = ~num1;
console.log( "~num1 : ", notans, notans.toString(2));
let notans1 = ~num2;
console.log( "~num2 : ", notans1, notans1.toString(2));

// Explainaton       [ 1 xor 1 ==> 0 ;  1 xor 0 ==> 1]
//     3  ==>   0000110
//     ~3 ==>   1111001
