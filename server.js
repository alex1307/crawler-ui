// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), { fallthrough: true }));

// Define specific routes for each HTML file
app.get(['/calculator', '/calculator.html'], (req, res) => {
    console.log('Serving calculator.html');
    res.sendFile(path.resolve(__dirname, 'dist', 'calculator.html'));
});

app.get(['/analysis', '/analysis.html'], (req, res) => {
    console.log('Serving analysis.html');
    res.sendFile(path.resolve(__dirname, 'dist', 'analysis.html'));
});

app.get(['/results', '/results.html'], (req, res) => {
    console.log('Serving results.html');
    res.sendFile(path.resolve(__dirname, 'dist', 'results.html'));
});

app.get(['/search', '/search.html'], (req, res) => {
    console.log('Serving search.html');
    res.sendFile(path.resolve(__dirname, 'dist', 'search.html'));
});

// Catch-all route to serve index.html for other paths
app.get('*', (req, res) => {
    console.log(`Fallback: Serving index.html for path ${req.path}`);
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});