// Type Alias: can be used to define a custom datatype
type Employee = {
    readonly id: number,
    nam: string,
    age?: number,
    gender: string,
    email?: string,
    retire?: (val: string) => void
}

let emp1: Employee = {
    id: 1,
    nam: "Ritik",
    gender: "Male",
    // retire: (val) => { return val },
};

emp1.retire = (val) => { return val }

console.log(emp1);
console.log(emp1.retire("1"));


// Union Types : Union types are used when a value can be more than a single type.
// Such as when a property would be string or number.

function showweight(weight: number | string) {
    console.log(weight);
}

showweight(10);
showweight("10 KGs");

// Intersection Types : Intersection types are closely related to union types, but they are used very differently. An intersection type combines multiple types into one. This allows you to add together existing types to get a single type that has all the features you need.

type dragable = {
    drag: () => void
}

type resize = {
    resize: () => void
}

type widget = dragable & resize 

let card: widget = {
    drag: () => {},
    resize: () =>{}
}

console.log(card);


// Keyof 
// The keyof operator in TypeScript is used to get the union of keys from an object type.

interface HumanDataInfo {
    name: string;
    age: number;
    address: string;
}

const humanInfo: HumanDataInfo = {
    name: "John",
    age: 30,
    address: "123 Main St"
};

function getProperty(obj: HumanDataInfo, key: keyof HumanDataInfo) {
    console.log(obj[key]);    
    return obj[key];
}

const humanInfoName = getProperty(humanInfo, 'name'); // Valid
const humanInfoAge = getProperty(humanInfo, 'age'); // Valid
const humanInfoAddress = getProperty(humanInfo, 'address'); // Valid