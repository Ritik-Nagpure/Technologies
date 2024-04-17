// setInterval
// The setInterval() method calls a function at specified intervals (in milliseconds).

let greet = " Hi This is called in every 2 secs."

let si = setInterval(() => {
    console.log(greet);    
    console.log(" ******** waiting for delay *******");    
}, 2000);


// clearInterval
// The setInterval() method continues calling the function until clearInterval() is called, or the window is closed.
// console.log("This is the id for setInterval(): ", si);
clearInterval(si);


// comment clearInterval() to see output of setInterval() which will occur after 2 secs
