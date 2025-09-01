

export class Toy {
    public a: string = '';
    protected toyname: string = "Robert"; // Protected properties are usually prefixed with an underscore _
    private toyage: number; // Privates should start with #. They are only accessible from inside the class.

    constructor() {

    }
    get name() {
        return this.toyname;
    }

    get age() {
        return this.toyage;
    }

    set name(x) {
        this.toyname = x;
    }

    set age(x) {
        this.toyage = x;
    }

}