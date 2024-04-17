//                      ***************** Type Conversions *******************
//                     ||_____|| Strings to Numbers ||_____||
console.log("_______________________________________________________________________")
console.log("               ||_____|| Strings to Numbers ||_____||           ")
console.log("************************************************************************")

console.log(Number(3.14));
console.log(Number(Math.PI));
console.log(Number(" "));
console.log(Number(""));
console.log(Number("John"));
console.log(Number("99 88"));

console.log(parseFloat("3.14"));
console.log(parseInt("3.14"));

let x1 = "5";
console.log(typeof(x1), x1);

let y1 = + x1;
console.log(typeof(y1), y1);

//                     ||_____|| Numbers to Strings ||_____||
console.log("_______________________________________________________________________")
console.log("               ||_____|| Numbers to Strings ||_____||           ")
console.log("************************************************************************")
let x = 3.14

console.log(String(x));
console.log(String(123));
console.log(String(100+23));
console.log();

console.log(x.toString());
console.log((123).toString());
console.log((100+23).toString());
console.log();

console.log(x.toExponential());
console.log(x.toFixed());
console.log(x.toFixed(3));
console.log(x.toPrecision());
console.log(x.toPrecision(5));
console.log(x.toLocaleString());
console.log();



//                     ||_____|| Dates to Numbers ||_____||
console.log("_______________________________________________________________________")
console.log("               ||_____|| Dates to Numbers ||_____||           ")
console.log("************************************************************************")

d = new Date();
console.log(d);
console.log();

console.log(Number(d));
console.log(d.getTime());


//                     ||_____|| Dates to Strings ||_____||
console.log("_______________________________________________________________________")
console.log("                ||_____|| Dates to Strings ||_____||           ")
console.log("************************************************************************")

console.log(String(Date()));
console.log(Date.toString());
console.log();

console.log(d.getDate());
console.log(d.getMonth());
console.log(d.getFullYear());
console.log(d.getDay());
console.log(d.getHours());
console.log(d.getMinutes());
console.log(d.getSeconds());
console.log(d.getTime());
console.log();

//                     ||_____|| Booleans to Strings ||_____||
console.log("_______________________________________________________________________")
console.log("               ||_____|| Booleans to Strings ||_____||           ")
console.log("************************************************************************")

console.log(String(false));
console.log(false.toString());

console.log(String(true));
console.log(true.toString());


//                     ||_____|| Booleans to Numbers ||_____||
console.log("_______________________________________________________________________")
console.log("               ||_____|| Booleans to Numbers ||_____||           ")
console.log("************************************************************************")

console.log(Number(false));
console.log(Number(true));

console.log("___xxxx______________xxxx__________________xxxx__________________xxxx__________________")
