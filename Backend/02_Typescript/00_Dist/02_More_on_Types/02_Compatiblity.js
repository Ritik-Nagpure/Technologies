"use strict";
// Topic: Type Compatibility — structural matching of types in TypeScript
// Description: TypeScript uses structural typing, meaning types are compatible 
// if their shapes match, regardless of explicit declarations.
Object.defineProperty(exports, "__esModule", { value: true });
let pet;
let myDog = { name: "Rex", breed: "Labrador" };
pet = myDog; // ✅ Compatible: Dog has all Animal properties
function printName(entity) {
    console.log(entity.name);
    console.log(entity.breed);
}
printName(myDog); // ✅ Compatible: structure matches
// printName(pet); // not Compatible: structure matches
