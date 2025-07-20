// Closures
//a form of lexical scoping used to preserve variables from the outer scope of a function in the inner scope of a function.

function car(cname) {
    function createcar() {
        return { id: Math.floor(Math.random() * 10), model: cname }
    }
    return createcar
}

let makeCar = car("BMW");
let car1 = makeCar();

console.log(car1);
console.log(car1.model);
console.log(car1.id);

// Another example
// Craeter a private counter with closure to increase count whenever called upon.


const privateCounter = () =>{
    let count = 0
    let counter = () => {
        count++
        return count;
    }
    return counter
}
const mycounter = privateCounter();
console.log(mycounter());
console.log(mycounter());
console.log(mycounter());
console.log(mycounter());
console.log(mycounter());
