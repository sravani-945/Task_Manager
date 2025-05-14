// API configuration
const config = {
  // Local development API URL
  development: {
    apiUrl: 'http://localhost:8080'
  },
  // Production API URL - replace with your actual deployed backend URL
  production: {
    apiUrl: 'https://task-manager-backend-cwru.onrender.com' // Your deployed Render.com backend
  }
};

// Determine current environment
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Export the configuration for the current environment
export default {
  apiUrl: config[env].apiUrl
}; 