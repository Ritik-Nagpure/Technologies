export class Animal {
    #breed;
    #ability;

    constructor(breed) {
        this.#breed = breed;
    }
    set breed(a) {
        this.#breed = a;
    }

    get breed() {
        return this.#breed;
    }


    set ability(a) {
        this.#ability = a;
    }

    get ability() {
        return this.#ability;
    }

    _define() {
        return `${this.#breed} is an ${this.#ability} type Animal`;
    }
}