/*
🧠 What Is a Template Engine?
    A template engine lets you generate dynamic HTML pages by embedding JavaScript logic directly into your HTML. 
    It’s commonly used in server-side rendering to display data from your backend.

⚙️ How Template Engines Work in Express
Express integrates easily with template engines. You:
    Set the engine using app.set('view engine', 'ejs') (or pug, hbs, etc.)
    Create template files in a views/ folder.
    Use res.render() to render a template and pass data to it.

*/

import express from 'express'
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory (optional if using default 'views/')
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home', {
        title: 'User Homepage',
        username: 'Jane Doe',
        email : 'jane.Doe@example.com'
    });
});


app.listen(3000, () => {
    console.log(`Application is running on ${3000}`);

});