let closetab = () => {
    window.close();
}

let opentab = () => {
    window.open("file:///G:/Technologies/01_Javascript/10_BOM/index.html");
}

setInterval(() => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    document.getElementById('time').innerText = time
}, 1000)


// Focus and Blur on input
const input = document.getElementById("textInput");

input.addEventListener("focus", () => {
    document.getElementById("log").textContent = "Input is focused";
});

input.addEventListener("blur", () => {
    document.getElementById("log").textContent = "Input lost focus";
});

// Scroll the page
function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Show location info
function showLocation() {
    document.getElementById("loc").textContent =
        `Current URL: ${window.location.href}`;
}


// Trigger a fake error
function triggerError() {
    // Reference undefined function
    undefinedFunction();
}

// onerror handler
window.onerror = function (msg, url, line, col, err) {
    document.getElementById("errlog").textContent =
        `Error caught: ${msg} at ${line}:${col}`;
    return true; // suppress browser error popup
};


// Local Storage handlers
function saveLocal() {
    const val = document.getElementById('localInput').value;
    localStorage.setItem('localData', val);
}

function loadLocal() {
    const val = localStorage.getItem('localData');
    document.getElementById('localResult').innerText = `Stored in localStorage: ${val}`;
}

// Session Storage handlers
function saveSession() {
    const val = document.getElementById('sessionInput').value;
    sessionStorage.setItem('sessionData', val);
}

function loadSession() {
    const val = sessionStorage.getItem('sessionData');
    document.getElementById('sessionResult').innerText = `Stored in sessionStorage: ${val}`;
}