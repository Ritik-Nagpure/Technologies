//

class microArray extends Array {
    // defining custom methods
    isEmpty() {
        return this.length === 0;
    }
}

let m1arr = new microArray(1, 256, 3, 54, 5);
console.log(m1arr);
console.log(m1arr.isEmpty());

let m2arr = new microArray();

console.log(m2arr.isEmpty());

