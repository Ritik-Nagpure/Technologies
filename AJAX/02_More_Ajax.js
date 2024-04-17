// use this website to work with frontend small api calls: https://dummy.restapiexample.com/create
const postroute = "https://dummy.restapiexample.com/api/v1/";


const postbutton = document.getElementById("postbutton");
postbutton.addEventListener('click', clickedpostbutton);

function clickedpostbutton() {
    const data = document.getElementById("postdata").value;
    const postjson = `{"name":"testmsg","salary":"${data}","age":"23"}`;
    const url = postroute + "create";

    let xhr = new XMLHttpRequest();
    xhr.getResponseHeader("Content-type", "application/json")
    xhr.open('POST', url, true);
    xhr.onload = function () {
        if (this.status === 200) {
            let a = JSON.parse(this.responseText)["data"]["id"]
            console.log(a);
            displaypost((a).toString());
        }
        else {
            // console.log("error");
        }
    }
    xhr.send(postjson);
}

const showPost = document.getElementById("getPost");
showPost.addEventListener('click', clickedshowPost);

const postdisplay = document.getElementById("showPost");
function clickedshowPost() {
    const id = document.getElementById("postdata").value;
    const url = postroute + `/employee/${id}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (this.status === 200) {
            let a = JSON.parse(this.responseText)["data"]
            console.log(a);
            displaypost(JSON.stringify(a));
        }
        else {
            // console.log("error");
        }
    }
    xhr.send();
}

function displaypost(message) {
    postdisplay.innerHTML = message;
}