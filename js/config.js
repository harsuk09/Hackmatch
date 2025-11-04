// Client configuration for frontend pages
// This file defines `window.config.API_BASE_URL` used by `js/api.js`.
// In production (Vercel) the frontend build can set a different value via
// an environment-injected script or by editing this value.

window.config = window.config || {};

// Priority:
// 1) window.config.API_BASE_URL already set
// 2) hosting injected window.API_URL (Vercel env or similar)
// 3) derive from location for local dev (assume backend on port 5000)
// 4) fallback to http://localhost:5000/api
window.config.API_BASE_URL = window.config.API_BASE_URL || window.API_URL || (
  // If page is opened via file://, default to localhost backend
  (window.location.protocol === 'file:'
    ? 'http://localhost:5000/api'
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `${window.location.protocol}//${window.location.hostname}:5000/api`
      : '/api')
);
