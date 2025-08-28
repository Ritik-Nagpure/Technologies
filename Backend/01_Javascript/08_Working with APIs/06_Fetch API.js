
async function fetchjoke() {
    const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-RapidAPI-Key': '56ad5599d3msh630174acbc756bep17e8b5jsn88bc29e8ac2a',
            'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        displayfresponse(result);
    } catch (error) {
        console.error(error);
    }
}

function displayfresponse(result) {
    let data = JSON.parse(result);
    let str = `<div> <p>` + data["id"] + `</p> <div> ` + data["value"] + `</div></div>`;


    document.getElementById("fetch").innerHTML = str;

}