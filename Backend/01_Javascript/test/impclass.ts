import { Toy } from './class'

class Soft_toy extends Toy {
    get sft() {
        return this.toyname;
    }
}

let husky = new Soft_toy();
// console.log(husky.toyname);
console.log(husky.sft);

