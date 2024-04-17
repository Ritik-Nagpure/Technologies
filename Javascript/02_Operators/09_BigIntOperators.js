// BigInt Operators
// normal int is shown as exponential notation
console.log(2546285496845152321556546541)

// Method 1 to declare 
let x = 254628549684515232155n ;
console.log(x);

// Method 2 to declare 
let y = BigInt(162654685132158496419846531);
console.log(y);

//Cannot operate bigint with number throws error
//console.log( x/2);
//console.log( x+2);
//console.log( y-2);
//console.log( y*2);

// divison of bigint or multiplications always uses int its not shown in decimals
// console.log(5n/3n);
// console.log(5/3);

//console.log(5n*3.58n); // throws error coz bigint cannot be floating point number
//console.log(5*3.58);