// Primitive Datatypes
let str: string = "This is String";
let bool: boolean = true;

let num: number = 4;
let decinum: number = 7.564;

let nannum: number = NaN;
let neginfi: number = -Infinity; // represents divide by 0.
let infi: number = Infinity; // greater than any number 

console.log(str);
console.log(bool);
console.log(num);
console.log(decinum);
console.log(nannum);
console.log(neginfi);
console.log(infi);


// Special Datatypes
let undef : undefined;
let nullvar : null = null;

console.log(undef);
console.log(nullvar);


// Void : Function that does not return any value.
function greet(): void {
    console.log("Hello World");
}
greet();
