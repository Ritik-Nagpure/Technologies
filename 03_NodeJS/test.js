let products = [
    { id: 1, name: 'Product 1', price: 20.0 },
    { id: 2, name: 'Product 2', price: 30.0 },
    { id: 3, name: 'Product 2', price: 30.0 },
    { id: 4, name: 'Product 2', price: 30.0 },
];

function deleteproduct(id) {
    for (let i of products) {
        if (id == i.id) {
            const index = products.indexOf(i);
            if (index > -1) {
                products.splice(index, 1);
            }
            break;
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
    var a = 45;
}


// deleteproduct(3)
// deleteproduct(1)

updateproduct(3, "Product 3", 89)
// products = [2, 9]
for (let i of products) {
    // console.log(i);
    var b = 45;
}

console.log(a);