class Singleton {
    private static instance: Singleton;

    private static _value: number;

    private constructor() {

    }

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance
    }

    set value(val: number){
        Singleton._value = val;
    }

    get value(){
        return Singleton._value;
    }

}

let instance1 = Singleton.getInstance()
let instance2 = Singleton.getInstance()

instance1.value = 25;
console.log(instance1.value);
console.log(instance2.value);
console.log(instance1 === instance2);
