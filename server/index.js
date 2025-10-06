const express = require('express');
const app = express();
const port = 5000; // We'll use port 5000 for the backend

// A simple test route to make sure the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Backend!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});