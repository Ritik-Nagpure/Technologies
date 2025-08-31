"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kstep = 7;
const rstep = 5;
let kan = 0;
let rabbit = 100;
let stepCount = 0;
let exactstepnum = 0;
let step = () => {
    kan += kstep;
    rabbit -= rstep;
};
let exactstep = () => {
    kan -= kstep;
    rabbit += rstep;
    while (kan != rabbit) {
        kan += 1;
        rabbit -= 1;
    }
    exactstepnum = kan;
};
while (kan < rabbit) {
    stepCount += 1;
    step();
}
exactstep();
console.log(`they will meet after ${stepCount} Reps. At step number ${exactstepnum}`);
