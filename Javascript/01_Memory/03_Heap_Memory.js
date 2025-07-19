/* 🎒 Heap Memory – The Big Toy Bin

--> 5 y/o ans

the heap is like a giant toy bin where you throw in big toys like a teddy bear or LEGO castle.
    🧩 It's for complicated stuff — like objects and games with parts.
    😵‍💫 It's messy and takes longer to find things.
    🧠 Your brain (JavaScript!) needs to remember where each toy is so it can go find it later.
    Example: When you make a friend named “Max” in a game, you put all their info (name, age, favorite color) in the heap bin!



-->  Interview ans

What it is:
    Heap memory is used for dynamic memory allocation.
    It stores objects, arrays, functions — anything complex.
    Unlike stack, it doesn’t follow any order — it’s like a big pile.

Key Traits:
    🐢 Slower access compared to stack
    🧠 Requires tracking references to manage memory
    💥 If references are lost, objects get garbage collected


Notes:
--> Non- Pritimitive datatypes are stored in Heap memory.
--> whenever a operation like this ( a = [1,2,3]; b= a; ) is performed, the reference of 'a' is copied to 'b' in heap memory.
--> this means a and b are pointing to the same object in heap memory.
--> changing anyone a/b ( a.push(23) ) will change the other also, the operation is peformed on value not reference.
--> to create a copy of the object, we can use spread operator (let c = [...a]) or JSON.parse(JSON.stringify(a)) to create a deep copy.
--> another method is to use Object.assign({}, a) to create a shallow copy.

*/


let person = { name: "Max", age: 30 }; // Stored in heap


/*
🧍 Shallow Copy — Surface Level Cloning
A shallow copy copies only the top layer of an object. If the object contains other objects (nested structures), the inner objects are not cloned — their references are simply copied.

💡 Think:
You rewrote the ingredients list but just linked to grandma’s sauce recipe instead of writing it down.

📦 Example:
    let original = { name: "Max", address: { city: "Paris" } };
    let shallow = { ...original };

    shallow.name = "Mike";             // ✅ Does NOT affect original
    shallow.address.city = "London";   // ❌ Changes original too!


🧠 Deep Copy — Full Cloning
A deep copy creates a complete duplicate, even for nested objects. No shared references. Changes to the copy won’t affect the original.
let deep = JSON.parse(JSON.stringify(original));
deep.address.city = "Rome";        // ✅ Original stays as "Paris"



Feature	            Shallow Copy	         Deep Copy
Top-level values	    Copied	                Copied
Nested objects	        Shared references	    Fully copied
Performance	            Faster	                Slower (depends)
Use cases	            Simple structures	    Complex/nested ones

*/