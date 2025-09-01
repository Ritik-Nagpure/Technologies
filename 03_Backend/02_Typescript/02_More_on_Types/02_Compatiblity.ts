// Topic: Type Compatibility — structural matching of types in TypeScript
// Description: TypeScript uses structural typing, meaning types are compatible 
// if their shapes match, regardless of explicit declarations.

interface Animal { name: string; }
interface Dog { name: string; breed: string; }

let pet: Animal;
let myDog: Dog = { name: "Rex", breed: "Labrador" };

pet = myDog; // ✅ Compatible: Dog has all Animal properties

function printName(entity: { name: string, breed: string }) {
  console.log(entity.name);
  console.log(entity.breed);
}

printName(myDog); // ✅ Compatible: structure matches
// printName(pet); // not Compatible: structure matches
