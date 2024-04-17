import http from "http";
import url from "url";

const PORT = 8080;
const CONTENT_TYPE_JSON = { "Content-Type": "application/json" };
const CONTENT_TYPE_HTML = { "Content-Type": "text/html" };

let products = [
    { id: 1, name: 'Product 1', price: 20.0 },
    { id: 2, name: 'Product 2', price: 30.0 },
];


const server = http.createServer((req, res) => {

    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname == '/' || parsedUrl.pathname == '/product') {
        // Call the function to handle GET requests
        handleGetRequest(req, res, parsedUrl);
    }

    else if (parsedUrl.pathname == '/product/new') {
        // Call the function to handle POST requests
        handlePostRequest(req, res, parsedUrl);
    }

    else if (parsedUrl.pathname == '/product/update') {
        // Call the function to handle PUT requests
        handlePutRequest(req, res, parsedUrl);
    }

    else if (parsedUrl.pathname == '/product/remove') {
        // Call the function to handle DELETE requests
        handleDeleteRequest(req, res, parsedUrl);
    }

    else {
        // Return a 404 response if the method is not allowed
        sendResponse(res, 404, "JSON", { error: ' rofjfoj Method not allowed' });
    }
});

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(" Server Started"));

function handleGetRequest(req, res, parsedUrl) {
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

function handlePostRequest(req, res, parsedUrl) {
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

function handlePutRequest(req, res, parsedUrl) {
    if (parsedUrl.pathname == "/product/update") {
        if (parsedUrl.query.id != undefined) {
            console.log("inside update");
            updateproduct(parsedUrl.query.id, parsedUrl.query.name, parsedUrl.query.price);
            sendResponse(res, 200, "JSON",{
                "message" : `${parsedUrl.query.id} is updated with given parameters`
            })
        }
        else {
            sendResponse(res, 404, "HTML", { error: "<h1> Please mention id and data which has to be removed </h1>" });
        }
    }
}

function handleDeleteRequest(req, res, parsedUrl) {
    // console.log(parsedUrl);

    if (parsedUrl.pathname == "/product/remove") {
        if (parsedUrl.query.id != undefined) {
            console.log("inside delete");
            deleteproduct(parsedUrl.query.id);
            sendResponse(res, 200, "JSON",{
                "message" : `${parsedUrl.query.id} is deleted`
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
        res.end(JSON.stringify(data));
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
    // res.write("<h1> 404 ERROR: Page unavailable </h1>")
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
