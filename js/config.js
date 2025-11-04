// Client configuration for frontend pages
// This file defines `window.config.API_BASE_URL` used by `js/api.js`.
// In production (Vercel) the frontend build can set a different value via
// an environment-injected script or by editing this value.

window.config = window.config || {};
window.config.API_BASE_URL = window.config.API_BASE_URL || 'http://localhost:5000/api';

// If a global `API_URL` is injected (e.g. by hosting), prefer that.
if (window.API_URL) {
  window.config.API_BASE_URL = window.API_URL;
}
