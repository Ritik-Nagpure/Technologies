import express from 'express';
const app = express();

// Set Pug as the template engine
app.set('view engine', 'pug');

// Set the views directory (optional if using default 'views/')
app.set('views', './views');

// Route to render the homepage using Pug
app.get('/', (req, res) => {
    res.render('home', {
        title: 'User Homepage',
        username: 'Jane Doe',
        email: 'jane.doe@example.com'
    });
});

// Start the server
app.listen(3000, () => {
    console.log(`Application is running on http://localhost:3000`);
});
