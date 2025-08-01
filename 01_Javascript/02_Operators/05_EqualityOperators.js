//Equality Operators
// ==  and  === [strick equality operator]
console.log(1 == 1);
console.log(1 == true);

console.log(1 === true);
console.log(1 === 1);


console.log(1 != 1);
console.log(1 != true);

console.log(1 !== true);
console.log(1 !== 1);

let a = 123;
console.log(a === 123);
console.log(a !== 123);

/*
Object.is( value1, value2)
Object.is() is a method used to compare two values for strict equality, similar to ===, but with a few nuanced differences:
It’s special because it’s a perfectionist in disguise. 😄 Where most comparisons in JavaScript just say “close enough,”
Object.is() goes full detective mode—it catches sneaky edge cases like NaN being equal to NaN and spots the subtle difference between +0 and -0.

Comparison	                 ===	                    Object.is()
NaN === NaN	                false	                     ✅ true
+0 === -0	                ✅ true	                    false
'hello' === 'hello'	        ✅ true	                    ✅ true
*/

console.log(Object.is(25, 25));           // true
console.log(Object.is('apple', 'apple')); // true
console.log(Object.is(NaN, NaN));         // true
console.log(Object.is(+0, -0));   
