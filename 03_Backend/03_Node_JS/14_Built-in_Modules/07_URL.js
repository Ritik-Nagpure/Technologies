// The URL module splits up a web address into readable parts.


import url from "url";

var adr = 'http://localhost:8080/default.htm/4?year=2017&month=february&day=30';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'
console.log(qdata);

console.log(q.search);

let myurl = new URL(adr);
myurl.searchParams.forEach((element, item ) => {
    console.log(`${item} : ${element}`);
    
});

console.log(myurl.search);
console.log(myurl.searchParams);
// console.log(myurl.query);
