function updateStyle01() {
    const div = document.getElementById('style01');

    // 3️⃣ Class manipulation
    div.className += ' font-bold'; // adds a class via string
    div.classList.add('p-6'); // adds a class via classList
    div.classList.add('border-4'); // adds a class via classList
    div.classList.remove('p-4'); // removes a class
    div.classList.toggle('rounded-3xl'); // toggles a class on or off provided that class exists/not in the element and the precedence also matters

    // 4️⃣ Style manipulation
    div.style.backgroundColor = '#17be0eff'; // Tailwind green-400
    div.style.borderColor = 'black';
    div.style.borderStyle = 'solid';
}

