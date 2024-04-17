let closetab = () => {
    window.close(); 
}

let opentab = () => {
    window.open("file:///G:/Node.js/JavaScript%20Notes/Javascript/10_BOM/index.html");
}

function showdimen() {
    let a = window.innerHeight;
    let b = window.innerWidth;

    document.getElementById("Dimen").innerHTML = `Height is ${String(a)}  and Width is ${String(b)}`;
}