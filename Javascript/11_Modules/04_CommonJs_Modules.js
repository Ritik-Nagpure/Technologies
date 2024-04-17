let cjsm = require("./greet");

console.log(cjsm.greet("Ritik"));
console.log(cjsm.work("Ritik"));

let { greet, work } = require("./greet");

console.log(greet("Sher"));
console.log(work("Sher"));
