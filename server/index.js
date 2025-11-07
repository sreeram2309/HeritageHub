// Import necessary packages
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Our database connection module

const app = express();
const port = 5001; // <-- Port is 5001

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json()); // <--- THIS IS THE MISSING LINE!

// === ROUTES ===

// --- TEST ROUTE ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Backend!' });
});

/**
 * =================================================================
 * AUTH ROUTES
 * =================================================================
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role',
      [username, email, passwordHash]
    );
    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * =================================================================
 * MONUMENT ROUTES
 * =================================================================
 */

// --- GET ALL MONUMENTS ---
app.get('/api/monuments', async (req, res) => {
  try {
    const allMonuments = await pool.query('SELECT * FROM monuments ORDER BY name');
    res.json(allMonuments.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET A SINGLE MONUMENT BY ID ---
app.get('/api/monuments/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter
    const monument = await pool.query(
      'SELECT * FROM monuments WHERE id = $1',
      [id]
    );

    if (monument.rows.length === 0) {
      return res.status(404).json({ message: 'Monument not found' });
    }

    res.json(monument.rows[0]); // Send back the single monument
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- CREATE A NEW MONUMENT (UPDATED) ---
app.post('/api/monuments', async (req, res) => {
  try {
    // We now accept latitude and longitude!
    const { name, description, imageUrl, panoUrl, latitude, longitude } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    const newMonument = await pool.query(
      'INSERT INTO monuments (name, description, image_url, pano_image_url, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, imageUrl, panoUrl, latitude, longitude]
    );

    res.status(201).json(newMonument.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * =================================================================
 * REVIEW ROUTES (NEW!)
 * =================================================================
 */

// --- GET ALL REVIEWS FOR A SPECIFIC MONUMENT ---
app.get('/api/monuments/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params; // Get the monument ID from the URL
    const reviews = await pool.query(
      'SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE monument_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(reviews.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- POST A NEW REVIEW FOR A MONUMENT ---
app.post('/api/monuments/:id/reviews', async (req, res) => {
  try {
    const { id: monument_id } = req.params; // Get the monument ID from the URL
    const { rating, comment, user_id } = req.body; // TODO: We will get user_id from a token later

    if (!rating || !user_id) {
      return res.status(400).json({ message: 'Rating and User ID are required.' });
    }

    const newReview = await pool.query(
      'INSERT INTO reviews (rating, comment, user_id, monument_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [rating, comment, user_id, monument_id]
    );

    res.status(201).json(newReview.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * =================================================================
 * ARTICLE ROUTES (NEW!)
 * =================================================================
 */

// --- GET ALL ARTICLES ---
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await pool.query(
        'SELECT articles.*, users.username AS author_name FROM articles JOIN users ON articles.author_id = users.id ORDER BY created_at DESC'
    );
    res.json(articles.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- CREATE A NEW ARTICLE ---
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, image_url, author_id } = req.body; // TODO: Get author_id from token
    if (!title || !content || !author_id) {
      return res.status(400).json({ message: 'Title, content, and author are required.' });
    }
    const newArticle = await pool.query(
      'INSERT INTO articles (title, content, image_url, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, image_url, author_id]
    );
    res.status(201).json(newArticle.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * =================================================================
 * TIMELINE ROUTES (NEW!)
 * =================================================================
 */

// --- GET TIMELINE FOR A SPECIFIC MONUMENT ---
app.get('/api/monuments/:id/timeline', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await pool.query(
      'SELECT * FROM timeline_events WHERE monument_id = $1 ORDER BY event_year',
      [id]
    );
    res.json(events.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
