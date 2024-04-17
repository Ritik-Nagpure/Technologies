// include "type": "module", in package.json file to use ecma modules

import greetme, {hi, bye} from './sayhi.js';

hi();
bye();

greetme();