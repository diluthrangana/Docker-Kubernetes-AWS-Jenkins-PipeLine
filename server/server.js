const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;  // Change port if needed

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)  // You'll set this in .env file
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });  // Customize message if desired
});

// Add your custom routes here

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});