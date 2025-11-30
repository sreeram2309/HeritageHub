// Import necessary packages
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Our database connection module

const app = express();
const port = process.env.PORT || 5001;

// === MIDDLEWARE ===
const allowedOrigins = [
  'http://localhost:3000', 
  'https://heritagehub-1.onrender.com' // <-- YOUR LIVE FRONTEND URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Block all other origins
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

/**
 * =================================================================
 * AUTH ROUTES
 * =================================================================
 */
// --- REGISTER ROUTE (UPDATED) ---
app.post('/api/auth/register', async (req, res) => {
  try {
    // 1. Get role from the request
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    // Security Check: Don't let people register as Admin via the API!
    // If they try to hack it and send 'Admin', force it back to 'User'.
    const safeRole = (role === 'Admin') ? 'User' : (role || 'User');

    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insert the user WITH the chosen role
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, passwordHash, safeRole]
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

// --- LOGIN ROUTE ---
// --- LOGIN ROUTE (UPDATED for Username OR Email) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    // We accept 'identifier' (which can be email OR username) and 'password'
    const { identifier, password } = req.body;

    // 1. Check if the user exists by searching BOTH columns
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1', 
      [identifier]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 2. Check if the password matches the hash
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. Generate the JWT Token
    const token = jwt.sign(
      { user_id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Send response
    res.json({ 
      token, 
      role: user.rows[0].role,
      userId: user.rows[0].id 
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
    const { id } = req.params;
    
    // 1. Fetch the main monument details
    const monument = await pool.query('SELECT * FROM monuments WHERE id = $1', [id]);

    if (monument.rows.length === 0) {
      return res.status(404).json({ message: 'Monument not found' });
    }

    // 2. Fetch the extra gallery images
    const gallery = await pool.query('SELECT image_url FROM monument_images WHERE monument_id = $1', [id]);
    
    // 3. Combine them into one object
    const result = {
        ...monument.rows[0],
        gallery: gallery.rows.map(row => row.image_url) // Return simple array of URLs
    };

    res.json(result); 
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- UPDATE A MONUMENT ---
app.put('/api/monuments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, panoUrl, latitude, longitude, category, state } = req.body;

    const updateOp = await pool.query(
      `UPDATE monuments 
       SET name = $1, description = $2, image_url = $3, pano_image_url = $4, latitude = $5, longitude = $6, category = $7, state = $8
       WHERE id = $9 RETURNING *`,
      [name, description, imageUrl, panoUrl, latitude, longitude, category, state, id]
    );

    if (updateOp.rows.length === 0) {
      return res.status(404).json({ message: 'Monument not found' });
    }

    res.json(updateOp.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- DELETE A MONUMENT ---
app.delete('/api/monuments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Perform the delete operation
    const deleteOp = await pool.query('DELETE FROM monuments WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ message: 'Monument not found' });
    }

    res.json({ message: 'Monument deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- CREATE A NEW MONUMENT (WITH GALLERY & CATEGORY) ---
app.post('/api/monuments', async (req, res) => {
  try {
    // Added 'category' to the list
    const { name, description, imageUrl, panoUrl, latitude, longitude, gallery, category, state } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    // Insert with category
    const newMonument = await pool.query(
      'INSERT INTO monuments (name, description, image_url, pano_image_url, latitude, longitude, category, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, imageUrl, panoUrl, latitude, longitude, category || 'Monument', state || 'India']
    );

    const monumentId = newMonument.rows[0].id;

    if (gallery && gallery.length > 0) {
        for (const img of gallery) {
            await pool.query(
                'INSERT INTO monument_images (monument_id, image_url) VALUES ($1, $2)',
                [monumentId, img]
            );
        }
    }

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

/**
 * =================================================================
 * TOUR SCHEDULING ROUTES (NEW!)
 * =================================================================
 */

// --- GET UPCOMING TOURS FOR A MONUMENT ---
app.get('/api/monuments/:id/tours', async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch tours and join with user table to get the Guide's name
    const tours = await pool.query(
      `SELECT tours.*, users.username AS guide_name 
       FROM tours 
       JOIN users ON tours.guide_id = users.id 
       WHERE monument_id = $1 
       ORDER BY tour_date, tour_time`,
      [id]
    );
    res.json(tours.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- SCHEDULE A NEW TOUR ---
app.post('/api/tours', async (req, res) => {
  try {
    const { monument_id, guide_id, tour_date, tour_time, meeting_link } = req.body;
    
    if (!tour_date || !tour_time || !meeting_link) {
      return res.status(400).json({ message: 'Date, time, and link are required.' });
    }

    const newTour = await pool.query(
      'INSERT INTO tours (monument_id, guide_id, tour_date, tour_time, meeting_link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [monument_id, guide_id, tour_date, tour_time, meeting_link]
    );

    res.status(201).json(newTour.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- BOOK A TICKET (User) ---
app.post('/api/tours/:id/book', async (req, res) => {
  try {
    const { id } = req.params; // Tour ID
    const { user_id } = req.body;

    await pool.query(
      'INSERT INTO bookings (tour_id, user_id) VALUES ($1, $2)',
      [id, user_id]
    );
    res.json({ message: 'Ticket booked successfully!' });
  } catch (error) {
    // If unique constraint fails (already booked)
    if (error.code === '23505') {
        return res.status(400).json({ message: 'You already booked this tour.' });
    }
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET ATTENDEES (Guide) ---
app.get('/api/tours/:id/attendees', async (req, res) => {
  try {
    const { id } = req.params; // Tour ID
    const attendees = await pool.query(
      `SELECT users.username, users.email, bookings.booked_at 
       FROM bookings 
       JOIN users ON bookings.user_id = users.id 
       WHERE bookings.tour_id = $1`,
      [id]
    );
    res.json(attendees.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * =================================================================
 * FAVORITES ROUTES (NEW!)
 * =================================================================
 */

// --- TOGGLE FAVORITE (Add/Remove) ---
app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { user_id, monument_id } = req.body;

    // 1. Check if it already exists
    const check = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND monument_id = $2',
      [user_id, monument_id]
    );

    if (check.rows.length > 0) {
      // It exists, so DELETE it (Unlike)
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND monument_id = $2',
        [user_id, monument_id]
      );
      return res.json({ status: 'removed' });
    } else {
      // It doesn't exist, so ADD it (Like)
      await pool.query(
        'INSERT INTO favorites (user_id, monument_id) VALUES ($1, $2)',
        [user_id, monument_id]
      );
      return res.json({ status: 'added' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET USER FAVORITES ---
app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    // Join with monuments table to get the names and images
    const favorites = await pool.query(
      `SELECT monuments.* FROM favorites 
       JOIN monuments ON favorites.monument_id = monuments.id 
       WHERE favorites.user_id = $1`,
      [id]
    );
    res.json(favorites.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * =================================================================
 * ADMIN USER MANAGEMENT ROUTES (NEW!)
 * =================================================================
 */

// --- GET ALL USERS ---
app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users but DO NOT send back passwords!
    const users = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY id');
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- UPDATE USER ROLE (Promote/Demote) ---
app.put('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // e.g. "Tour Guide"

    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- DELETE USER ---
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET USER BOOKINGS ---
app.get('/api/users/:id/bookings', async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await pool.query(
      `SELECT bookings.id as booking_id, tours.tour_date, tours.tour_time, tours.meeting_link, monuments.name as monument_name 
       FROM bookings 
       JOIN tours ON bookings.tour_id = tours.id 
       JOIN monuments ON tours.monument_id = monuments.id 
       WHERE bookings.user_id = $1 
       ORDER BY tours.tour_date ASC`,
      [id]
    );
    res.json(bookings.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
