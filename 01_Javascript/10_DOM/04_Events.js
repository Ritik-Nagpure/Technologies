
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
