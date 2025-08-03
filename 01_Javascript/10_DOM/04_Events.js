
// Keyboard event
document.addEventListener('keydown', function (event) {
  document.getElementById('pev02').innerText = `Key pressed: ${event.key}`;
});

// Single click
document.getElementById('ev01').addEventListener('click', function () {
  document.getElementById('pev011').innerText = `Mouse Clicked : 1`;
});

// Double click
document.getElementById('ev01').addEventListener('dblclick', function () {
  document.getElementById('pev012').innerText = `Mouse Double Clicked : 2`;
});



// Copy event
document.addEventListener('copy', () => {
  document.getElementById('pev03').innerText = (`You tried to Copy text: ${document.getSelection().toString()}`);
});

// Cut event
document.addEventListener('cut', () => {
  document.getElementById('pev03').innerText = (`You tried to Cut text: ${document.getSelection().toString()}`);
});

// Paste event
document.getElementById('textInput03').addEventListener('paste', (event) => {
  const pastedText = event.clipboardData.getData('text');
  document.getElementById('pev03').innerText = (`You Pasted text in input box : ${pastedText}`);
});

