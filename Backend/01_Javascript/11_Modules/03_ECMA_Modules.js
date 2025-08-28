// include "type": "module", in package.json file to use ecma modules

import greetme, {hi, bye} from './sayhi.js';

hi();
bye();

greetme();


import { greet, work } from './greet.js';

console.log(greet('Alex'));
console.log(work('Alex'));
