// setTimeout()
// functions can be execeuted with a delay asynchronously so that it has no effect on program
let fn = setTimeout(() => {
    console.log("Hi");
}, 2000);


// clearTimeout()
// it is used to clear timeout
// no function from settimeout will be executed after the timeout is cleared
// console.log("This is the id for setTimeout(): ", fn);
clearTimeout(fn);


// comment cleartimeout to see output of settimeout() which will occur after 2 secs