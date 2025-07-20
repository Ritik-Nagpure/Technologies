// Special Datatypes
let notSure: any = 4;
notSure = "maybe a string instead";
console.log(notSure);
notSure = false; // okay, definitely a boolean
console.log(notSure);


// Objects
let obj: Object = {
    nam: "Ritik",
    age: 67,
    male: true
}

let user: {
    readonly id: number,
    nam: string,
    age?: number,
    gender: string,
    email?: string,
    retire?: (date: Date) => void
} = { id: Number("007"), nam: "Sher", gender: "Female" };;


user.retire = (date: Date): void => {
    console.log("Printing from retire function" + date);
}

user.retire(new Date(2018, 0O5, 0O5, 17, 23, 42, 11))

user.age = 24;

console.log(obj);
console.log(user);

// Unknown
// unknown is the type-safe counterpart of any.
// Anything is assignable to unknown, but unknown isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing.
// example: unknown of type string is only assignable to type string and any only it can't be assigned to boolean, number, interface, etc

let unknownVar: unknown = "this is unknown variable of type string";
console.log(typeof (unknownVar), unknownVar);
console.log(unknownVar + " ! Done.");
// console.log(unknownVar / 2); // gives error as operation requires number not string
if (unknownVar) {
    // When you use it in a conditional statement like an if block, TypeScript doesn't raise an error because it doesn't assume anything about the truthiness or falsiness of an unknown value.
    console.log("printed from if of unknown var");
}





// Never: We can set never for exception(error) handling or when an function should not-stop on that place you can use never.
// when we are certain that a particular situation will never happen, we use the never type.
// let nevar: never = null;

