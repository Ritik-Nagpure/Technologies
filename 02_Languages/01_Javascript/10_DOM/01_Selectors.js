// Id selector work directly as it is unique to a element however for class selector we have to specify a particular class which we need to select as '[n]' 
// Hance for naming elements always use an ID for one single element and class for multiple element
// do not use/ give same id to multiple elements


let idsel = () => {
    console.log("ID selector");
    document.getElementById("idsel").innerHTML = " You have used ID Selector"
}

let classsel = () => {
    console.log("Class selector");
    document.getElementsByClassName("classsel")[0].innerHTML = " You have used Class Selector";// use [n] after tagselector to specify which particular tag to select
}

let tagsel = () => {
    console.log("tag selector");
    document.getElementsByTagName("h4")[0].innerHTML = "You have used Tag Selector"; // use [n] after tagselector to specify which particular tag to select
}

let querysel = () => {
    console.log("Query Selector");
    console.log(document.querySelector('.qsel'));
    document.querySelector('.qsel').innerHTML = 'Select one (First)';
}

let queryselall = () => {
    console.log("Query Selector All");
    console.log(document.querySelectorAll('.qsel'));
    document.querySelectorAll('.qsel').forEach(el => {
        el.innerHTML = 'Select ALL';
    });
}



