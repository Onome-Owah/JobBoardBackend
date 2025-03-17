require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import the CORS package

const app = express();
const PORT = process.env.PORT || 5000;

// Adzuna API credentials
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;  // Replace with your App ID
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;  // Replace with your API Key


// Log environment variables to check if they are loaded properly
console.log('Adzuna App ID:', ADZUNA_APP_ID);
console.log('Adzuna API Key:', ADZUNA_API_KEY);

// Enable CORS for all incoming requests (or specify origin as needed)
app.use(cors({
  origin: 'https://your-frontend.onrender.com',  // Allow requests from local frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Endpoint to fetch jobs from Adzuna API
app.get('/api/jobs', async (req, res) => {
  const { query, location } = req.query;  // Get query and location from URL parameters

  try {
    // Make a request to Adzuna API
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/gb/search/1', {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        what: query,
        where: location,
        'content-type': 'application/json',
      },
    });

    // Send job listings data to frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error.response ? error.response.data : error.message);

    // Send error response with additional error details
    res.status(500).json({
      error: 'Failed to fetch job listings',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
