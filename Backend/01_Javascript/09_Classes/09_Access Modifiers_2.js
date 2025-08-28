import { Toy, toy } from './09_Access Modifiers.js'

// Private and protected properties and methods
// converting toy class into private and protected class

class Soft_toy extends Toy {
    get sft() {
        return this._toyname;
    }
}

let husky = new Soft_toy();
console.log(husky._toyname);
console.log(husky.sft);


// console.log(toy);

// toy.name = "Chukky";
// toy.age = 45;

// console.log(toy);

// console.log(toy._toyname);
// toy._toyname = 'Ana';
// console.log(toy._toyname);
// // console.log(toy.#toyage);

// console.log(toy.name);
// console.log(toy.age);


