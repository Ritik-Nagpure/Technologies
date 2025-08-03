// Updates man01 using innerText
function updateMan01() {
    const div1 = document.getElementById('man01');
    div1.innerText = '<h1>🚗 Car One - updated with innerText</h1>';
}

// Updates man02 using textContent
function updateMan02() {
    const div2 = document.getElementById('man02');
    div2.textContent = '🚙 Car Two - updated with textContent';
}

// Updates man03 using innerHTML
function updateMan03() {
    const div3 = document.getElementById('man03');
    div3.innerHTML = '<h3 class="text-red-500">🚕 Car Three - updated with innerHTML</h3>';
}



//


function updateAtt01() {
    const div = document.getElementById('att01');
    // 1️⃣ innerText to show what's happening
    div.innerText = 'Attributes Updated!';

    // 2️⃣ ID manipulation
    console.log('Old ID:', div.id);
    div.id = 'att01-updated';

    // 5️⃣ Attribute manipulation
    div.setAttribute('title', 'This is a tooltip!');
    console.log('Title attribute:', div.getAttribute('title'));
    div.removeAttribute('onclick'); // removes the onclick handler

    // 6️⃣ Dataset manipulation
    div.dataset.user = 'admin';
    div.dataset.status = 'active';
    console.log('Dataset:', div.dataset.user, div.dataset.status);

    // 7️⃣ Value (not applicable to div, but here's how it works for inputs)
    // let input = document.createElement('input');
    // input.value = 'Hello';
    // document.body.appendChild(input);

    // 1️⃣ innerText to show what's happening
    div.innerText = `Attributes Updated!\n Old id : att01 --> New id ${div.id}\n Attribute : ${div.getAttribute('title')}`;

}

//


function addBox() {
    const container = document.getElementById('contain');
    const newBox = document.createElement('div');
    newBox.classList.add('bg-green-400');
    newBox.classList.add('p-4');
    newBox.classList.add('m-2');
    newBox.classList.add('rounded-full');
    newBox.classList.add('font-semibold');
    newBox.classList.add('text-lg');
    newBox.innerText = 'New Box !!'
    container.appendChild(newBox);
}

function removeBox() {
    const container = document.getElementById('contain');
    const lastBox = container.lastElementChild;
    if (lastBox) {
        container.removeChild(lastBox);
    }
}



//


