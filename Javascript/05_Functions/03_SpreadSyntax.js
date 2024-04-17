// ***************** Spread Syntax *******************
// opposite of Rest Parameters
// splits given argument iterable into no. of arguments required by a function

function dissen(a,b,c,d,e,f,g,h,i){
console.log(a,b,c,d,e,f,g,h,i);
}

let in1 = [23,34,4,5,6,74,3,4,'abc',45]
dissen(...in1);

let in2 = "Husky"
dissen(...in2);
