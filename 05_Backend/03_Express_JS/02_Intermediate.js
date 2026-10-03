import express from 'express'
const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// 1. Built-in Middleware
// ==============================
// Parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

// ==============================
// 2. Custom Middleware
// ==============================
// Logs method and URL of every request
const logger = (req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next(); // Pass control to next middleware or route
};
app.use(logger);

// ==============================
// 3. Route Parameters
// ==============================
// Example: /user/john → req.params.username = 'john'
app.get('/user/:username', (req, res) => {
    const username = req.params.username;
    res.send(`Hello, ${username}!`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
})
// ==============================
// 4. Query Parameters
// ==============================
// Example: /search?q=node&page=2 → req.query = { q: 'node', page: '2' }
app.get('/search', (req, res) => {
    const { q, page } = req.query;
    res.send(`Search query: ${q}, Page: ${page}`);
});

// ==============================
// 5. Router Grouping
// ==============================
// Create a router for user-related routes
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));

});

userRouter.get('/:id', (req, res) => {
    res.json({ "message": `User ID: ${req.params.id}` });
});

// Mount the router on /users
app.use('/users', userRouter);

// ==============================
// 6. Redirect
// ==============================
// Redirect /old to /new
app.get('/old', (req, res) => {
    res.redirect('/new');
});

app.get('/new', (req, res) => {
    res.send('You have been redirected to /new');
});

// ==============================
// 7. Set Custom Headers
// ==============================
app.get('/info', (req, res) => {
    res.set('X-Powered-By', 'Express Copilot');
    res.set('Cache-Control', 'no-store');
    res.send('Custom headers set!');
});

// ==============================
// Start the Server
// ==============================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
