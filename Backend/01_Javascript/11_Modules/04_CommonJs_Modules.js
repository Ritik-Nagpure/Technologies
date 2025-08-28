let cjsm = require("./greet");

console.log(cjsm.greet("Ritik"));
console.log(cjsm.work("Ritik"));

let { greet, work } = require("./greet");

console.log(greet("Sher"));
console.log(work("Sher"));


// importing using common js for es modules export 
let shim = require('./sayhi');

shim.hi();
shim.bye();

// When you require() an ES module that uses export default, Node wraps the module and exposes the default export under the .default property. This is part of the interop layer between CommonJS and ES modules.
shim.default();

// Named exports
const { hi, bye } = require('./sayhi')
hi();
bye();
