const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/ehomeho.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/ehomeho.com/fullchain.pem')
};

// Serve static files
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

// Catch-all route for undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start HTTPS server
const PORT = process.env.PORT || 443;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});