// async keyword creates asynchronous function and run it asynchronouly
// await wait for the response from async function to proceed futher async task has to be finished first.
// await can only be used inside an async function only

// Below the program will wait for the promise to be resolved and untill then no further action will be taken.
console.log(`Program Started at  --> ${Date().toString()}`);
let myPromise = await new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve("I love You !!");
    }, 5000);
});


// console.log(myPromise);
console.log(myPromise)

console.log('This Should print First usually as promise is still not resolved... but wont as we awaited for the promise');
console.log(`Program Ended at  --> ${Date().toString()}`);


// Async Await

// Simulate a server request that takes time
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = {
                1: { name: "Alice", age: 28 },
                2: { name: "Bob", age: 34 },
                3: { name: "Charlie", age: 22 }
            };
            const user = users[userId];
            if (user) {
                resolve(user);
            } else {
                reject("User not found");
            }
        }, 3000); // Simulate 3-second delay
    });
}

// Async function to handle the fetch
async function displayUser(userId) {
    console.log("Fetching user data...");
    try {
        const user = await fetchUserData(userId);
        console.log(`✅ User Found: ${user.name}, Age: ${user.age}`);
    } catch (error) {
        console.log(`❌ Error: ${error}`);
    }
    console.log("Done.");
}

// Call the function
displayUser(2);
console.log('Fetch Promise called and no further action is there to proceed to program ends here. Output will be thrown once we have one');
