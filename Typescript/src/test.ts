
const kstep: number = 7;
const rstep: number = 5;

let kan: number = 0;
let rabbit: number = 100;
let stepCount: number = 0;
let exactstepnum: number = 0;

let step = (): void => {
    kan += kstep;
    rabbit -= rstep;
}
let exactstep = (): void => {
    kan -= kstep;
    rabbit += rstep;
    while (kan != rabbit) {
        kan += 1;
        rabbit -= 1;
    }
    exactstepnum = kan;
}

while (kan < rabbit) {
    stepCount += 1
    step();
}


exactstep();
console.log(`they will meet after ${stepCount} Reps. At step number ${exactstepnum}`);
