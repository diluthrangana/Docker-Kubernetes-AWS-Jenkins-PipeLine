const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (Hardcoded)
const MONGO_URI = "mongodb+srv://diluthrangana:6EepE8bRWt1XA2xR@pipeline-test.ibwmkwt.mongodb.net/?retryWrites=true&w=majority&appName=pipeline-test";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});

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
