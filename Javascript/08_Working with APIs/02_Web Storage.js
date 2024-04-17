// TO Check Storage go to devtools ==> Application ==> Storage ==> Local/Session


function setsession() {
    let key = document.getElementById("sessionkey").value;
    let val = document.getElementById("sessionval").value;
    sessionStorage.setItem(key, val);
    clearsessions();
}

function getsession() {
    let key = document.getElementById("sessionkey").value;
    let display = sessionStorage.getItem(key);
    document.getElementById("sessionget").innerHTML = display;
    clearsessions();
}

function setlocal() {
    let key = document.getElementById("localkey").value;
    let val = document.getElementById("localval").value;
    localStorage.setItem(key, val);
    clearlocals();
}

function getlocal() {
    let key = document.getElementById("localkey").value;
    let display = localStorage.getItem(key);
    document.getElementById("localget").innerHTML = display;
    clearlocals();

}

function clearlocals() {
    document.getElementById("localkey").value = "";
    document.getElementById("localval").value = "";
}

function clearsessions() {
    document.getElementById("sessionkey").value = "";
    document.getElementById("sessionval").value = "";
}