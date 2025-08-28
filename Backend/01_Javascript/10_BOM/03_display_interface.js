document.getElementById('showscreen').addEventListener('click', () => {
    let info = `
        Screen Width: ${screen.width}px
        Screen Height: ${screen.height}px
        Available Width: ${screen.availWidth}px
        Available Height: ${screen.availHeight}px
        Color Depth: ${screen.colorDepth} bits
      `;
    document.getElementById("Dimen").innerText = info;
})

document.getElementById('alert').addEventListener('click', () => {
    alert(" You have pressed alert !!")
});

document.getElementById('confirm').addEventListener('click', () => {
    confirm(" Are you sure ? ")
});

document.getElementById('prompt').addEventListener('click', () => {
    let propmtval = prompt(" Type anything if you are sure.");
    if (propmtval.length != 0) {
        alert(" Fine Fuck you !!")
    }
});

document.getElementById('print').addEventListener('click', () => {
    print();
});
