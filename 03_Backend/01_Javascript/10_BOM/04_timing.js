//  setTimeout: runs once after delay
let timeoutval;
document.getElementById('runTimeout').addEventListener('click', () => {
    document.getElementById("timeoutlog").innerText = "Waiting 5 seconds...";
    timeoutval = setTimeout(() => {
        document.getElementById("timeoutlog").innerText = `5 seconds Passed!`;
    }, 5000);
});

// clearTimeout: stops the Timeout
document.getElementById('clearTimeout').addEventListener('click', () => {
    clearTimeout(timeoutval);
    document.getElementById("timeoutlog").innerText = "Interval stopped.";
});

// setInterval: runs repeatedly
let intervalId;
document.getElementById('startInterval').addEventListener('click', () => {
    let count = 0;
    intervalId = setInterval(() => {
        count++;
        document.getElementById("intervallog").innerText = `Interval count : ${count}`;
    }, 1000); // runs every 1 second
});

// clearInterval: stops the interval
document.getElementById('stopInterval').addEventListener('click', () => {
    clearInterval(intervalId);
    document.getElementById("intervallog").innerText = "Interval stopped.";
});




// Set timeout and Interval are Complex like if I clicked twice on set interval id for first doesn't exist but the function does in callback queue going on untill stopped which is not possible anymore so only a refresh/ retart can fix this.
// make sure you note id of each timing object/ promise to keep control on it.

// I've fix this issue with appropriate for loops use below commented code to understand this
