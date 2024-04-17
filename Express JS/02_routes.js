import express from 'express';
import {app, products} from './01_app.js'
const router = express();

router.set("view engine", "ejs")

router.use("/", app)

router.post("/item/new", (req, res) => {
    let newItem = {
        id: Number(req.query.id),
        name: req.query.name,
        price: Number(req.query.price)
    }
    products.push(newItem)
    res.send(products)  
})

router.listen(3030);