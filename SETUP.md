# HackMatch Setup Guide

This guide will help you set up and connect the HackMatch frontend and backend.

## Prerequisites

1. **Node.js** (v14 or higher) - ✅ Installed
2. **MongoDB** - ❌ Not installed/running
3. **npm** - ✅ Installed

## Installation Steps

### 1. Install MongoDB

You have two options:

#### Option A: Install MongoDB Locally

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB and start the service
3. The default connection string is: `mongodb://localhost:27017/hackmatch`

#### Option B: Use MongoDB Atlas (Cloud - Recommended for Quick Setup)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file with your Atlas connection string

### 2. Configure Environment

The `.env` file has been created with default settings. You may need to update:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hackmatch
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5500
```

### 3. Start MongoDB

**If using local MongoDB:**
```bash
# Windows: Start MongoDB service or run mongod
mongod --dbpath "C:\data\db"

# Or start MongoDB as a Windows service
net start MongoDB
```

**If using MongoDB Atlas:**
- No local installation needed!

### 4. Start the Backend Server

```bash
# Navigate to project directory
cd d:\hackn

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

You should see:
```
✅ MongoDB Connected: [your-connection-details]
🚀 Server running on port 5000
🌍 Environment: development
```

### 5. Start the Frontend

You can use any of these methods:

**Option A: Using VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Usually opens at `http://localhost:5500`

**Option B: Using Python**
```bash
# Python 3
python -m http.server 5500

# Or Python 2
python -m SimpleHTTPServer 5500
```

**Option C: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 5500
```

**Option D: Using any static file server**
- Serve files from `d:\hackn` directory
- Access at `http://localhost:5500`

### 6. Verify Connection

1. Open browser and go to `http://localhost:5500`
2. Open browser console (F12)
3. Try to register/login
4. Check for any errors in console

If you see CORS errors, make sure:
- Backend is running on port 5000
- Frontend is on allowed ports (3000, 5500, 8080, or 127.0.0.1:5500)

## Troubleshooting

### MongoDB Connection Issues

**Error: "connect ECONNREFUSED"**
- MongoDB is not running
- Start MongoDB service or use MongoDB Atlas

**Error: "Authentication failed"**
- Check your MongoDB credentials in `.env`
- For Atlas, ensure your IP is whitelisted

### CORS Errors

**Error: "CORS policy: No 'Access-Control-Allow-Origin' header"**
- Backend is not running
- Frontend URL is not in allowed origins
- Check browser console for details

### Port Already in Use

**Error: "Port 5000 already in use"**
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

## Quick Test

Once both servers are running:

1. Open `http://localhost:5500`
2. Click "Sign Up"
3. Create an account
4. Login
5. You should see the dashboard with teams and hackathons

## API Endpoints

Backend API is available at: `http://localhost:5000/api`

Test health endpoint:
```
GET http://localhost:5000/api/health
```

## Need Help?

- Check browser console for errors
- Check backend terminal for errors
- Ensure MongoDB is running
- Verify environment variables in `.env`

---

**Frontend**: Port 5500 (or any you prefer)
**Backend**: Port 5000
**MongoDB**: Port 27017 (local) or Atlas (cloud)

