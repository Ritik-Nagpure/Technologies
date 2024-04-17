// Closures
//a form of lexical scoping used to preserve variables from the outer scope of a function in the inner scope of a function.

function getCarId(){
    let id = 95;
    function createCar(){
        let car = "Chevy";
        return {id : id, car : car};
    }
    return {
        createCar: createCar
    }
}

let app = getCarId();
console.log(app.createCar());
console.log(app.id);