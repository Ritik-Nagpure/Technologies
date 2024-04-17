import express from 'express';
const app = express();

app.get("/", (req, res) => {
    console.log("Here");
    res.json({ message: " Hello Its working" })
})


app.listen(3000);