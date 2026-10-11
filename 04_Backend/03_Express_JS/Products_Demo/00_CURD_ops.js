import express from 'express';
import url from 'url';

const app = express();

const PORT = 8080;
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const CONTENT_TYPE_HTML = { "Content-Type": "text/html" };

let products = [
    { id: 1, name: 'Product 1', price: 20.0 },
    { id: 2, name: 'Product 2', price: 30.0 },
];

app.get("/", (req, res) => {
    handleGetRequest(req, res)
})

app.get("/product", (req, res) => {
    handleGetRequest(req, res)
})

app.post("/product/new", (req, res) => {
    handlePostRequest(req, res)
})

app.put("/product/update", (req, res) => {
    handlePutRequest(req, res)
})

app.delete("/product/remove", (req, res) => {
    handleDeleteRequest(req, res)
})

app.get("*", (req, res) => {
    sendResponse(res, 404, "JSON", { error: ' The URL Method is not allowed' });
})


function handleGetRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl)

    if (parsedUrl.pathname == '/') {
        // Return HTML response for the home page
        sendResponse(res, 200, "JSON", products);
    }
    else if (parsedUrl.pathname == '/product') {
        if (parsedUrl.query.id != undefined) {
            sendResponse(res, 200, "JSON", products[parsedUrl.query.id - 1]);
        }
        else {
            sendResponse(res, 200, "JSON", products);
        }
    }
    else {
        // Return a 404 response if the endpoint is not found
        send404(res, "<h1> 404 ERROR: Page unavailable </h1>");
    }
}

function handlePostRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == '/product/new') {
        if (
            parsedUrl.query.name != undefined &&
            parsedUrl.query.price != undefined
        ) {
            products.push({
                id: products.length + 1,
                name: parsedUrl.query.name,
                price: parsedUrl.query.price
            });

            sendResponse(res, 200, "JSON", products);
        }
    }
    else {
        send404(res, "<h1> 404 ERROR: Page unavailable </h1>");
    }
}

function handlePutRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == "/product/update") {
        if (parsedUrl.query.id != undefined) {
            console.log("inside update");
            updateproduct(parsedUrl.query.id, parsedUrl.query.name, parsedUrl.query.price);
            sendResponse(res, 200, "JSON", {
                "message": `${parsedUrl.query.id} is updated with given parameters`
            })
        }
        else {
            sendResponse(res, 404, "HTML", { error: "<h1> Please mention id and data which has to be removed </h1>" });
        }
    }
}

function handleDeleteRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname == "/product/remove") {
        if (parsedUrl.query.id != undefined) {
            console.log("inside delete");
            deleteproduct(parsedUrl.query.id);
            sendResponse(res, 200, "JSON", {
                "message": `${parsedUrl.query.id} is deleted`
            })
        }
        else {
            sendResponse(res, 404, "JSON", { error: "<h1> Please mention id which has to be removed </h1>" });
        }
    }
}

// Helper function for sending HTTP responses
const sendResponse = (res, statusCode, contentType, data) => {
    if (contentType == "JSON") {
        res.writeHead(statusCode, CONTENT_TYPE_JSON);
        res.write(JSON.stringify(data))
        res.end();
    }
    else {
        res.writeHead(200, CONTENT_TYPE_HTML);
        res.write(data)
        res.end();
    }
};

const send404 = (res, msg) => {
    res.writeHead(404, CONTENT_TYPE_HTML);
    res.write(msg);
    res.end();
}

function deleteproduct(id) {
    for (let i of products) {
        if (id == i.id) {
            const index = products.indexOf(i);
            if (index > -1) {
                products.splice(index, 1);
            }
        }
    }
}

function updateproduct(id, name, price) {
    for (let i of products) {
        if (id == i.id) {
            i.name = name;
            i.price = price;
            break;
        }
    }
}

app.listen(PORT);