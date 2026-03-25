// 🔹 Definition
//     Hashing is the process of converting a key into a fixed-size integer (hash value) using a hash function. This value determines the index in a hash table where the data is stored. Searching then becomes a direct lookup at that index.

// 🔹 Precondition
//     A hash function must be defined to map keys to indices.
//     A hash table (array-like structure) must exist to store values.
//     Collisions (two keys mapping to the same index) must be handled using techniques like separate chaining or open addressing.

// 🔹 Working Steps (Search Operation)
//     Compute the hash value of the target key using the hash function.
//     Go directly to that index in the hash table.
//     If the key is present → return the value.
//     If multiple keys exist at the same index (collision), search through them (linked list or probing).
//     If not found → return null or -1.

class HashTable {
  constructor(size) {
    this.table = new Array(size);
  }

  hash(key) {
    return key % this.table.length; // simple modulo hash
  }

  insert(key, value) {
    let index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    this.table[index].push([key, value]); // chaining
  }

  search(key) {
    let index = this.hash(key);
    if (this.table[index]) {
      for (let [k, v] of this.table[index]) {
        if (k === key) return v;
      }
    }
    return null;
  }
}

// Example usage
let ht = new HashTable(10);
ht.insert(15, "apple");
ht.insert(25, "banana"); // collision with 15
console.log(ht.search(15)); // "apple"
console.log(ht.search(25)); // "banana"
console.log(ht.search(35)); // null (not found)
