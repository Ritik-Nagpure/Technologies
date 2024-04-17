//  The iterator is commonly used to loop through the objects of a collection, read them, and remove them.

// Creating an iterator using iterator protocol
function arrayIterator(values) {
    let nextIndex = 0;
    // we will return this object
    return {
        next: function () {
            if (nextIndex < values.length) {
                // We will return below object
                return {
                    value: values[nextIndex++],
                    done: false
                }
            }
            else {
                // We will return below object with only
                return {
                    done: true
                }
            }
        }
    }
}

let myarray = [1, 2, 37];
console.log(myarray);

// Using the iterator
// an iterator iterates in an sequence and once it had iterated over all the values it has no next value ( its undefined ) and done as true
const numbers = arrayIterator(myarray);
console.log(numbers.next());
console.log(numbers.next().value);
console.log(numbers.next().done);
console.log(numbers.next());
