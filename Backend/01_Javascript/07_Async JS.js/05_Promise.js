//Promise
issolved = false

let myPromise = new Promise(function (myResolve, myReject) {
    if (issolved) {
        setTimeout(function () { myResolve("I love You !!"); }, 3000)
    } else {
        myReject("Promise is rejected!");
    }
    
},);


// "Consuming Code" (Must wait for a fulfilled Promise)
myPromise.then(
    function (value) { console.log(value); },
    function (error) { console.error(error); }
);
