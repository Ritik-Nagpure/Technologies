// async keyword creates asynchronous function and run it asynchronouly
// await wait for the repose from async function to proceed futher async task has to be finished first.
// await can only be used inside an async function only

async function myDisplay() {
    let myPromise = new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve("I love You !!");
        }, 5000);
    });
    console.log(await myPromise);
}

myDisplay();