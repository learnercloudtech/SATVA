
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const moodRoutes = require('./routes/moods');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// --- Database Connection (Optional for now) ---
// This block will connect to your database when you provide the MONGO_URI.
// The app will run without it, but won't save data.
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not found in .env file. Server is running without a database connection.');
}

// --- API Routes ---
app.use('/api/moods', moodRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
