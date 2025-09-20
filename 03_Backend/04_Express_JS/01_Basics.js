// =======================
// 1. App Setup
// =======================

// Import the Express module
import express from 'express';

// Create an Express application instance
const app = express();

// Use built-in middleware to parse JSON request bodies
// This allows us to access data sent in POST requests as JSON
app.use(express.json());


// =======================
// 2. Static Files
// =======================

// Serve static files (HTML, CSS, JS, images) from the "public" folder
// Example: public/index.html will be served when user visits "/"
app.use(express.static('public'));


// =======================
// 3. Basic Routing
// =======================
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle GET request to the root URL ("/")
// This route sends a plain text response
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle POST request to "/submit"
// This route simulates form submission
app.post('/submit', (req, res) => {
    // You can access submitted data using req.body if JSON is sent
    res.send('Form submitted successfully!');
});


// =======================
// 4. Send Response
// =======================

// Send plain text response
app.get('/text', (req, res) => {
    res.send('This is plain text.');
});

// Send JSON response
app.get('/json', (req, res) => {
    res.json({ message: 'This is JSON data.' });
});

// Send HTML response
app.get('/html', (req, res) => {
    res.send('<h2>This is HTML content.</h2>');
});


// =======================
// 5. App Listen
// =======================

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
