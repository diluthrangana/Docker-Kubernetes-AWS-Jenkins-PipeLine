import axios from 'axios';

// Change API_URL if your backend is at a different location
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Add your custom API functions here