// IIFE's
// Immediately Invoked Function Expression
// called as soon as it is declared 
// can be used to calculate and assign value to constants

const app = (function(){
    return Math.PI * 2;
  })();

console.log(app);