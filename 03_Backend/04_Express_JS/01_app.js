import express from 'express';
export const app = express();

export let products = [
    { id: 1, name: 'Product 1', price: 20.0 },
    { id: 2, name: 'Product 2', price: 30.0 },
    { id: 3, name: 'Product 3', price: 50.0 },
    { id: 4, name: 'Product 4', price: 80.0 },
    { id: 5, name: 'Product 5', price: 60.0 }
];


app.get('/', (req, res) => {
    res.send(products)
});

// call api for any id or parameter
app.get("/item/:id", (req, res) => {
    res.send(req.item)
})


// chaining of requests or grouping of similar routes with similar pathname but different methods
// note if chaining is not used them place the routes accordingly so that correct one is hit on every call not the first one refer [18:00 of https://youtu.be/SccSCuHhOw0?si=X02pPk-MK2M_dMU3]

app.route("/item/:id")
    .get(
        (req, res) => {
            // console.log(req.item);
            res.send(req.item)
        }
    )
    .put(
        (req, res) => {
            req.item.name = "Updated Now";
            res.send(products)
        }
    )
    .delete(
        (req, res) => {
            products.splice([req.params.id - 1], 1)
            res.send(products)
        }
    )

// Middleware in Express runs in between when a request is made to a server and a response is sent back
// this will run first and once next is call the rest of the code run i.e. ==> matches the route and process the request

app.param("id", (req, res, next, id) =>{
    req.item = products[id - 1]
    console.log(req.item)
    next()
})

// app.listen(8080);

// if this port is off still request can come through 3030 port as we have used routes that is basically routing the traffic or call to this file
