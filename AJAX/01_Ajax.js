
const getbutton = document.getElementById("getbutton");
const apilink = "https://reqres.in/api/users?page=";

let sec = document.getElementById("ajaxdata");

getbutton.addEventListener('click', clickedgetbutton);

function clickedgetbutton() {
    const topic = document.getElementById("search").value;
    //create url
    const url = apilink + topic;
    console.log(url);

    // create XMLHttpRequest Object
    let xhr = new XMLHttpRequest();

    // Open the object
    xhr.open('GET', url, true);

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

// Shows Data using an Iterator
function showDataUsingIterator(data) {
    let jsondata = dataiterator(data);
    let tabledata = "";
    let isdone = false;
    while (!isdone) {
        let val = jsondata.next();
        if (!val.done) {
            tabledata += createListFromJsonObject(val.value);
        }
        else {
            isdone = true;
        }
    }
    return tabledata;
}

// Create Iterator for response data array
function dataiterator(jsondata) {
    let nextIndex = 0;
    return {
        next: function () {
            if (nextIndex < jsondata.length) {
                return {
                    value: jsondata[nextIndex++],
                    done: false
                }
            }
            else {
                return {
                    done: true
                }
            }
        }
    }
}

// Creates a table row for the data
function createListFromJsonObject(arr) {
    let listItem = `<tr><td>${arr["id"]}</td><td>${arr["avatar"]}</td><td>${arr["first_name"]}</td><td>${arr["last_name"]}</td><td>${arr["email"]}</td></tr>`;
    return listItem;
}

// Show data using Array Map function
function createListFromArrayMap(arr) {
    let list = "";
    let tablearr = arr.map((val) => {
        return `<tr><td>${val["id"]}</td><td>${val["avatar"]}</td><td>${val["first_name"]}</td><td>${val["last_name"]}</td><td>${val["email"]}</td></tr>`;
    });

    for (item of tablearr) {
        list += item;
    }
    return list;
}

function operatorOnResponse(data) {
    let jsondata = JSON.parse(data)["data"];

    // let fromiterator = showDataUsingIterator(jsondata); // using iteratpr

    let fromMap = createListFromArrayMap(jsondata); // using Array map Function
    sec.innerHTML = fromMap;
}


