// include "type": "module", in package.json file to use ecma modules


let {hi, bye} = await import('./sayhi.js'); // named exports require us to use the exact exported names when importing

hi();
bye();

let md = await import('./sayhi.js'); // Default exports allow us to import the exported value with any name in the importing module

md.hi();
md.bye();
