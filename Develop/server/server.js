const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import and use your routes
require('./routes/htmlRoutes')(app);

// Handle any requests that don't match the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html')); // Ensure this points to your main HTML file
});

// Start the server
app.listen(PORT, () => console.log(`💚 Now listening on port: ${PORT}`));
