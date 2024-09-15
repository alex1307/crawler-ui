// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Define specific routes for each HTML file
app.get(['/calculator', '/calculator.html'], (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'calculator.html'));
});

app.get(['/analysis', '/analysis.html'], (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'analysis.html'));
});

app.get(['/results', '/results.html'], (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'results.html'));
});

app.get(['/search', '/search.html'], (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'search.html'));
});

// Catch-all route to serve index.html for any undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});