//DataTypes in JavaScript

// Primitive Datatypes

// 1] string 
//Array of characters is called String
let str = "Hello";
console.log(str);
console.log(str[1]);
console.log(typeof(str[1]));

// 2] number
console.log(1);
console.log(1.23);
console.log(typeof(1.23));


// bigint
// used to store big interger numbers
console.log(123654846541897498464n);
console.log(BigInt(123654846541897498464));
console.log(typeof(BigInt(123654846541897498464)));

// boolean
//stores true or false values
console.log(true, false);
console.log(typeof(true), typeof(false));

// undefined 
// datatype which is not of anyother datatype has value undefined and type undefined
console.log(typeof(undefined), undefined);

// null
// has null/no value its of object datatype
console.log(typeof(null), null);

// Symbols new datatype in ES6
// its non mutable and unique datatype means no two symbols having same value returns true when tried to equal.
const sym1 = Symbol('RED');
const sym2 = Symbol('BLUE');

console.log(sym1, sym2);
console.log(sym1.toString(), sym1.description, sym1.valueOf());
console.log(sym1 == sym2);
console.log(typeof(sym1));
