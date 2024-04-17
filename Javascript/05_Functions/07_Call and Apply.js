// call and apply
// another method of calling a function
// apply is similar to call only that we can aplly properties to apply


let o = {
    carId: 123,
    getid: function (prefix) {
        return prefix + this.carId;
    },
    getid1: function () {
        return this.carId;
    }
}

let newCar = {carId:456};

console.log( o.getid.apply(newCar, ['ID: ']));
console.log( o.getid1.call(newCar));
