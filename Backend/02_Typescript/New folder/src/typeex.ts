interface personality {
    gender: string;
    nature: string;
}

interface HumanDataInfo extends personality {
    name: string;
    age: number;
    address: string;
    greet: (a: string) => void;
}

const humanInfo1: HumanDataInfo = {
    name: "John",
    age: 30,
    address: "123 Main St",
    greet: function (message: string) {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old. and say ${message}`);
    },
    gender: 'Male',
    nature: 'Faminine'
};




console.log(humanInfo1);
humanInfo1.greet('Kya re lawde')
