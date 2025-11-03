// API Configuration
const config = {
  API_BASE_URL: process.env.API_URL || 'http://localhost:5000/api'
};

// Make config available globally
window.config = config;