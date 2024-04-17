// Set
// A Set is a special type collection – “set of values” (without keys), where each value may occur only once.


let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// visits, some users come multiple times
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// set keeps only unique values
console.log( set.size ); // 3

for (let user of set) {
  console.log(user.name); // John (then Pete and Mary)
}

console.log(set.delete(john));
console.log(set.has(john));
console.log(set.clear());
console.log(set);

// Iteration over Set


let set1 = new Set(["oranges", "apples", "bananas"]);

for (let value of set1) console.log(value); // oranges, apples, bananas
console.log("*********************");

// the same with forEach:
set1.forEach((value, valueAgain, set1) => {
  console.log(value); // oranges, apples, bananas
});
console.log("*********************");

// iterate over keys (vegetables)
for (let fruit of set1.keys()) {
    console.log(fruit); // oranges, apples, bananas
}
console.log("*********************");

// iterate over values (amounts)
for (let amount of set1.values()) {
    console.log(amount); // oranges, apples, bananas
}
console.log("*********************");

// iterate over [key, value] entries
for (let entry of set1) { 
    console.log(entry); // oranges, apples, bananas
}