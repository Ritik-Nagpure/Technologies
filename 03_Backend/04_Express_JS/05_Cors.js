/*
🌐 What Is CORS?
    CORS is a security feature enforced by browsers that restricts web pages from making requests to a different domain than the one that served the page.

    For example:
    A frontend running on http://localhost:3000 trying to access an API on http://localhost:5000 will trigger a CORS check.

🚧 Why You Need CORS in Express
Without enabling CORS, your Express server will block cross-origin requests by default. This is especially important when:
    Your frontend and backend are on different domains or ports.
    You're building APIs consumed by external clients.

*/

import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes and origins
app.use(cors());


// Customise Cors Behaviour
// app.use(cors({
//     origin: ['http://localhost:3000', 'https://myapp.com'], // allowed origins
//     methods: ['GET', 'POST'], // allowed HTTP methods
//     credentials: true, // allow cookies
//     allowedHeaders: ['Content-Type', 'Authorization'] // allowed headers
// }));

// Optional: Enable CORS for specific origin
// app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/data', (req, res) => {
    res.json({ message: 'CORS-enabled route' });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
