// Objects

console.log("----------------- Object Declarations ------------------------");

// 1. Object Literals
// ✅ Clean, fast ✅ Great for plain objects ❌ Not ideal for shared methods across instances
let user = {};  // "object literal" syntax
let user1 = {                     // an object
    name: "John",                // by key "name" store value "John"
    age: 30,                     // by key "age" store value 30 ,etc.
    "likes birds": true
};
console.log("Object Literal method--> user --> ", user)
console.log("Object Literal method--> user1 --> ", user1)


// 2. Object Constructor
// ✅ Explicit instantiation ❌ More verbose than literals
// It creates singleton object: a singleton object is a pattern used to ensure that only one instance of a particular object exists throughout your application.

let user2 = new Object(); // "object constructor" syntax
user2.name = "pankaj"
user2.status = "usdas"
console.log("Constructor method--> user2 --> ", user2, typeof (user2));


// 3. Object Constructor Function
// ✅ Good for creating instances ✅ Can use prototypes for shared methods ❌ Slightly outdated in favor of classes

function Person(name, age) {
    this.name = name;
    this.age = age;
}
const alice = new Person("Alice", 30);
console.log("Constructor Function --> alice --> ", alice, typeof (alice));

//  4. Object.create()
// Used for advanced prototypal inheritance:
// ✅ Explicit prototype linking ✅ Handy for prototype-based inheritance ❌ Can be tricky to reason about


const proto = { greet() { console.log("Hello!"); } };
const mike = Object.create(proto);
mike.name = "Mike";
console.log("Object.create() method --> Mike --> ", mike, typeof (mike));


// 5. ES6 Class Declaration
// Modern and powerful approach:
// ✅ Elegant syntax ✅ Supports inheritance ✅ Easy method sharing ❌ A bit more heavyweight than literals

class PersonC {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
}
const alok = new PersonC("Alok", 30);
console.log("Class Object --> alok --> ", alok, typeof (alok));

// 🔥 Bonus: Factory Functions
// Flexibly create objects without new or class:
// ✅ Functional and reusable ✅ Easy to compose ✅ No side effects or this

function createPerson(n, a) {
    nam = n
    age = a
    return { nam, age };
}
const akki = createPerson("Akki", 30);
console.log("Constructor Function --> akki --> ", akki, typeof (akki));

console.log("----------------- Object Declarations ------------------------");


console.log(" -------------------- Accessing the values ---------------");
// only two methods to access the values directly 
// if the object elements/ values are private then can be accessed using getter/setter method only

// Accessing value
console.log(alok.name);    // using . 
console.log(alok["age"]);  // using key 

// Accessing Key and values as array
console.log(Object.keys(alok), typeof Object.keys(alok));
console.log(Object.values(alok), typeof Object.values(alok));

// Accessing values as arrays only [[<property name> , <property value>]]
console.log(Object.entries(alok), typeof Object.entries(alok));


console.log("   -------------- Bonus ----------------")
sym = Symbol('grey')
symobj = {
    fname: "John",
    lname: "Doe",
    age: 33,
    [sym]: 'Color -> Grey'
}
console.log(symobj[sym], "type pf Key -->", typeof (Object.keys(symobj)[(Object.keys(symobj).length)]));

// Object.key(object variable) --> only returns string keys ❌ It ignores symbol keys (and non-enumerable ones)
console.log(Object.keys(symobj).length);


// How to use Symbol as a key
// Incorrect method as it considers it as string not symbol
sym1 = Symbol('red')

symobj.sym1 = 'Coler -> Red'
console.log(symobj["sym1"], "type pf Key -->", typeof symobj["sym1"]);

// correct method

sym2 = Symbol('blue')
symobj[sym2] = 'Color -> Blue'
console.log(symobj[sym2], "type pf Key -->", typeof symobj[sym2]);

console.log(symobj);

console.log("   -------------- Bonus ----------------")
console.log(" -------------------- Accessing the values ---------------");
// freeze will just freeze the Object to current only making sure you cannot change it further
// to make an object immutable—it prevents adding, removing, or changing properties.

// Object.freeze(symobj);
symobj.fname = 'me haa'
console.log(" Freezed fname --> ", symobj.fname);

// There’s no built-in method to “unfreeze” an object once it's frozen. But you can create a clone (shallow or deep), which will be mutable again.

symobj.greet = () => {
    console.log(`Hello ${symobj.fname} !!!!`);
}
symobj.greet()

// ------------------ Nesting of objects -------------------
// the objects are nestesd m by one inside another. can be array objects or functions too.
nestedobj = {
    username: "jodoe12",
    fname: "John",
    fullname: {
        fname: "John",
        lname: "Doe",
        mname: "Nick"
    },
    intrests: {
        movies: {
            Genre: ["Horrer", "Action", "Thriller", "Comedy"],
            top3: {
                first: "Liar Liar",
                second: "Saw",
                third: "John Wick"
            }
        },
        songs: {
            Genre: ["All"],
            top3: {
                first: "Animals",
                second: "Waka Waka",
                third: "Blank Space"
            }
        }
    }
}
console.log(nestedobj);
// access top movie 
console.log(`${nestedobj.fname}'s most favorite movie is ${nestedobj.intrests.movies.top3.first} `);

// Optional Chaining 
// no such object as top4 so it gives undefined not error. This ensures no matter what, your access is safe.
console.log(`${nestedobj.fname}'s least favorite movie is ${nestedobj.intrests?.movies?.top4?.third} `);

/* BONUS --> Optional chaining can even work when calling functions or accessing array elements like obj?.list?.[0]?.title.


    Segment	                            What It Does
data?.	                Checks if data is not null or undefined before accessing anything
.config?.	            Accesses config only if data exists
.getSettings?.()	    Calls getSettings() only if it exists and is a function
.theme	                Accesses the theme property from the result of getSettings()

*/

const data = {
    config: {
        getSettings: () => ({ theme: "dark" })
    }
};

const theme = data?.config?.getSettings?.()?.theme;
console.log(theme); // 👉 "dark"

console.log("--------------------- Operations on Objects ----------------------");
// Merging two objects

obj1 = { a: 1, b: 2, c: 3 };
obj2 = { d: 4, e: 5, f: 6 };

console.log({ obj1, obj2 }); // will create a single object with 2 objs inside not merging

// correct method
// {} is important is need a new object else all will be merged in first object resulting in change first object 
const objmerge = Object.assign({},  obj1, obj2); 
console.log(objmerge);
console.log(obj1, obj2);

// spread method --> easy and convienient
console.log({...obj1, ...obj2});

// check if object has any property 
console.log(obj1.hasOwnProperty('a'));
console.log(obj1.hasOwnProperty('g'));

console.log("--------------- Desturtructuring -------------");
const game = {
    gamename : "God of War",
    gameprice : 99,
    consoleWhereGameIsAvailable : "PS5"
}
console.log(game);

// this is how we can extract values as we want and rename it to avoid game.gamename, etc we can directly use as we mentioned below.
// to rename the property we can us e: name 
const {gamename , gameprice: price, consoleWhereGameIsAvailable: device } = game
console.log(gamename, price, device);


console.log("------------------- Function as a property of an Object -----------------------------");

fobj = {
    nam : "Pankaj",
    stat : function() { 
        return `${this.nam } is Udas`;
    },
    // to Define method property --> a function ' : ' is not mandatory 
    balance(){
        return `Oh!! ${this.nam} is Broke.`
    }
}

console.log(fobj.nam);
console.log(fobj.stat());
console.log(fobj.balance());


