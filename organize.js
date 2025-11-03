const fs = require('fs-extra');
const path = require('path');

// Frontend files to move (HTML, CSS, JS)
const frontendFiles = [
  'index.html',
  'login.html',
  'signup.html',
  'dashboard.html',
  'profile.html',
  'createTeam.html',
  'createHackathon.html',
  'hackathons.html',
  'css',
  'js'
];

// Backend files to move
const backendFiles = [
  'server.js',
  'package.json',
  'package-lock.json',
  'vercel.json',
  'config',
  'controllers',
  'middleware',
  'models',
  'routes'
];

// Move frontend files
frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.moveSync(file, path.join('frontend', file), { overwrite: true });
  }
});

// Move backend files
backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.moveSync(file, path.join('backend', file), { overwrite: true });
  }
});

console.log('Files organized successfully!');