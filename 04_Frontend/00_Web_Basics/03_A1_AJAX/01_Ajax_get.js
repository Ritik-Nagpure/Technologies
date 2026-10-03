
document.getElementById("getbutton").addEventListener('click', clickedgetbutton);

function clickedgetbutton() {
    //create url
    const url = "https://dog.ceo/api/breeds/image/random";

    console.log(url);

    // create XMLHttpRequest Object
    let xhr = new XMLHttpRequest();

    // Open the object
    xhr.open('GET', url, true);
    xhr.withCredentials = false;
    // setting Headers
    // xhr.setRequestHeader("Authorization", apikey);

    // while object in progress state
    xhr.onprogress = () => {
        console.log(" Request in Progress");
    }

    // while object is loaded or ready
    xhr.onload = function () {
        operatorOnResponse(xhr.responseText);
    }

    // Send chr request
    xhr.send();

}

function operatorOnResponse(data) {
    let jsondata = JSON.parse(data);
    let fromMap = `<h2> ${jsondata.status} </h2> <br/><img src="${jsondata.message}" height="300" style="margin: 20px"/>`;
    document.getElementById("ajaxdata").innerHTML = fromMap;
}


