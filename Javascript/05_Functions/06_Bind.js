// Bind
// please fill about bind

let o = {
    carid: 123,
    getid: function(){
        return this.carid;
    }
}

let newcar = { carid: 465 }

let newfunc = o.getid.bind(newcar);
console.log(newfunc());