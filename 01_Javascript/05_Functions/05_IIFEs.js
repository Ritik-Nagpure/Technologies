// IIFE's
// Immediately Invoked Function Expression
// called as soon as it is declared 
// can be used to calculate and assign value to constants
// why it is required: To avoid polutiing global scope we can use IIFE.
// EX. wehre the function is required instead of first declaring it globally and using once we can declare and use at same time in required destination

// Ex. if we want to connect to DB as soon as a module is called we can use this to create a connection.
// The widget is configured as soon as the page loads, without leaving behind unnecessary global variables using IIFE.

console.log((function () {
  return Math.PI * 2;
})());