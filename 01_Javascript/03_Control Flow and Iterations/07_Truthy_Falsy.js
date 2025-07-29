/*
✅ Truthy and ❌ Falsy Values
In JavaScript, values are coerced to true or false when used in conditionals.

✅ Truthy (evaluates to true)
Examples:
    Non-empty strings ("hello")
    Non-zero numbers (42)
    Objects and arrays ({}, [])
    true
    
Notes: --> To check array or object is true or false always go for length

❌ Falsy (evaluates to false)
Examples: 
    false
    0
    ""  --> (empty string)
    null
    undefined
    NaN

*/

let nam = "";

if (nam) {
    console.log("Name is provided.");
} else {
    console.log("Name is missing."); // This runs
}