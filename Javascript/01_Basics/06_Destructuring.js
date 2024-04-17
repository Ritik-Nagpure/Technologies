// ********************* Destucturing of Array ***********************
let names = ['husky', 'sexa', 'octya', 'Tatya'];
console.log(typeof(names), names);

// method 1 of destructuring
let [toy1 , toy2, toy3, toy4] = names;

console.log(typeof(toy1), toy1);
console.log(typeof(toy2), toy2);
console.log(typeof(toy3), toy3);
console.log(typeof(toy4), toy4);


// method 2 of destructuring
let toy6 , toy7, toy8, toy9 ;
[toy6 , toy7, toy8, toy9] = names;
console.log(toy6, toy7, toy8, toy9);

// Skipping element 
[toy1 , toy2 , , toy4] = names;
console.log(toy1, toy2, toy3, toy4);

// using rest parameters
let toy, remainingtoys
[toy, ...remainingtoys] = names;
console.log(toy, remainingtoys);


// *********************** Destructuring of Object ***********************************
let obj = { id: 7, nam: 'John' , code: 'Bond' };
console.log(typeof(obj), obj);
console.log(obj.id, obj.nam, obj.code);


// method 1 of destructuring
let {id1, nam1, code1} = obj ;
console.log(typeof(id1) , id1);
 
// method 2 of destructuring for some reasons not working on node
let id2, nam2, code2 ;
({id2, nam2, code2} = obj) ;
console.log(id2, nam2, code2);
