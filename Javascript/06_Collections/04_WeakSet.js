// WeakSet
// Weak set is not iteratable
// only contain objects that can be garbage collected

let weakset = new WeakSet();

let obj = {};
let obj1 = {};

weakset.add(obj);
weakset.add(obj1);

console.log(weakset);
console.log(weakset.has(obj));

try{
    for( i of weakset){
        console.log(i);
    }
}
catch(ex){
    console.warn(ex.message);
}
