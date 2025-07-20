//works on http but not with local files as chrome doesn't load it.
// so a another was of using web working locally is bellow
let w;

function startWorker() {
    if (typeof (w) == "undefined") {
        // w = new Worker("workertask.js"); 
        w = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], { type: 'text/javascript' })));
    }
    w.onmessage = function (event) {
        document.getElementById("worker").innerHTML = event.data;
    };
}

function stopWorker() {
    if (typeof (w) != "undefined") {
        w.terminate();
    }
    w = undefined;
}

function worker_function() {
    let i = 0;
    setInterval(
        () => {
            i++;
            postMessage(i);
        }
        , 1000
    )
}

// This is in case of normal worker start
// "window" is not defined in web worker
// so if you load this file directly using `new Worker`
// the worker code will still execute properly
if (window != self)
    worker_function();