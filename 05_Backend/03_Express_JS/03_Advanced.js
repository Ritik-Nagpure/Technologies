import express from 'express'
const app = express();
const router = express.Router();

import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ==============================
// 1. App Settings
// ==============================
// Express allows setting custom app-level variables
app.set('appName', 'Advanced Express App');
app.set('env', 'development'); // default is 'development' or 'production'

app.get('/settings', (req, res) => {
    res.send(`App Name: ${app.get('appName')}, Environment: ${app.get('env')}`);
});

// ==============================
// 2. HTTP Methods
// ==============================
// Express supports all standard HTTP methods
app.get('/method', (req, res) => res.send('GET method'));
app.post('/method', (req, res) => res.send('POST method'));
app.put('/method', (req, res) => res.send('PUT method'));
app.delete('/method', (req, res) => res.send('DELETE method'));

// ==============================
// 3. Route Chaining
// ==============================
// Chain multiple handlers for the same route
app.route('/book')
    .get((req, res) => res.send('Get a book'))
    .post((req, res) => res.send('Add a book'))
    .put((req, res) => res.send('Update a book'));

// ==============================
// 4. Wildcard & Regex Routes
// ==============================
// Match any route starting with /api/
app.get('/api/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notfound.html'));

});

// Match route using regex: only digits
app.get(/^\/item\/\d+$/, (req, res) => {
    res.send('Regex matched: /item/:id where id is a number');
});

// ==============================
// 5. Nested Routers
// ==============================
// Create a router for admin routes
const adminRouter = express.Router();

// Nested route: /admin/dashboard
adminRouter.get('/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});

// Nested route: /admin/users
adminRouter.get('/users', (req, res) => {
    res.send('Admin Users');
});

// Mount the nested router
app.use('/admin', adminRouter);

// ==============================
// 6. Request Lifecycle
// ==============================
// Middleware to log lifecycle stages
app.use((req, res, next) => {
    console.log('🔄 Request received');
    next();
});

app.get('/lifecycle', (req, res, next) => {
    console.log('📦 Processing route');
    next();
}, (req, res) => {
    console.log('✅ Sending response');
    res.send('Request lifecycle complete');
});

// ==============================
// 7. Handle 404 Errors
// ==============================
// This should be the last route
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// ==============================
// 8. Error Handler Middleware
// ==============================
// Custom error handler (must have 4 parameters)
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).send('Internal Server Error');
});

// Example route to trigger error
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// ==============================
// Start the Server
// ==============================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
