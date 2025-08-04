var humanInfo1 = {
    name: "John",
    age: 30,
    address: "123 Main St",
    greet: function (message) {
        console.log("Hi, I'm ".concat(this.name, " and I'm ").concat(this.age, " years old. and say ").concat(message));
    },
    gender: 'Male',
    nature: 'Faminine'
};
console.log(humanInfo1);
humanInfo1.greet('Kya re lawde');
