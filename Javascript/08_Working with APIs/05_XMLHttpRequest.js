// making API Calls

function getjoke() {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            displayresponse(this.responseText);
        }
    });

    xhr.open('GET', 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('X-RapidAPI-Key', '56ad5599d3msh630174acbc756bep17e8b5jsn88bc29e8ac2a');
    xhr.setRequestHeader('X-RapidAPI-Host', 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com');

    xhr.send(data);

}

function displayresponse(result) {
    let data = JSON.parse(result);
    let str = `<div> <p>` + data["id"] + `</p> <div> ` + data["value"] + `</div></div>`;


    document.getElementById("xhr").innerHTML = str;

}