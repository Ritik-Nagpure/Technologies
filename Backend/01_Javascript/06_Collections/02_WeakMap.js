let weakmap = new WeakMap();

let obj = {};
let obj1 = { 1: 1 };

weakmap.set(obj, "Private value");
weakmap.set(obj1, "Private data");

console.log(weakmap.get(obj));
console.log(weakmap.get(obj1));

// Weakmap is not iteratable and they are private
// no value can be accessed without knowing the key

try{
    for ( i of weakmap){
        console.log(i);
    }
}
catch(ex){
    console.error(ex.message);
}