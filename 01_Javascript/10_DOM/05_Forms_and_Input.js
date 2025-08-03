

const form = document.getElementById('userForm');

// Fires when form is submitted
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page reload
  console.log('Form submitted!');
});

// Fires when a form element gains focus
form.addEventListener('focusin', (event) => {
  document.getElementById('pev041').innerText = `Focused on: ${event.target.name}`;
});

// Fires when a form element loses focus
form.addEventListener('focusout', (event) => {
  document.getElementById('pev042').innerText = `Left field: ${event.target.name}`;
});

// Fires when a form element value changes
form.addEventListener('change', (event) => {
  document.getElementById('pev043').innerText = `${event.target.name} changed to: ${event.target.value}`;
});
// Fires when a form element value changes
form.addEventListener('input', (event) => {
  document.getElementById('pev044').innerText = `Writing on ${event.target.name} : ${event.target.value}`;
});
