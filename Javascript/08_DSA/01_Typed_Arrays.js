// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays

//JavaScript typed arrays are array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers.
//Typed arrays are not intended to replace arrays for any kind of functionality. Instead, they provide developers with a familiar interface for manipulating binary data.

/*

Type	            Value Range	    Size in bytes	 Web IDL type
Int8Array	         -128 to 127            1	        byte
Uint8Array	            0 to 255	        1	        octet
Uint8ClampedArray	    0 to 255	        1	        octet
Int16Array	       -32768 to 32767	        2	        short
Uint16Array	            0 to 65535	        2	        unsigned short
Int32Array	  -2147483648 to 2147483647	    4	        long
Uint32Array	            0 to 4294967295	    4	        unsigned long
Float32Array	  -3.4e38 to 3.4e38 	    4	        unrestricted float
Float64Array	 -1.8e308 to 1.8e308	    8	        unrestricted double
BigInt64Array	     -263 to 263 - 1	    8	        bigint
BigUint64Array	        0 to 264 - 1	    8	        bigint

*/


const uint8 = new Uint8Array([1, 2, 3]);
console.log(uint8[0]); // 1

// For illustrative purposes only. Not for production code.
uint8[-1] = 0;
uint8[2.5] = 0;
uint8[NaN] = 0;
console.log(Object.keys(uint8)); // ["0", "1", "2"]
console.log(uint8[NaN]); // undefined

// Non-numeric access still works
uint8[true] = 0;
console.log(uint8[true]); // 0

Object.freeze(uint8); // TypeError: Cannot freeze array buffer views with elements
