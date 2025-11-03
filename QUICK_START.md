# HackMatch Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites Check
- ✅ Node.js installed
- ✅ npm installed
- ⚠️ MongoDB needed

---

## Option 1: Quick Start with MongoDB Atlas (Recommended)

### 1. Get MongoDB Atlas (Free)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 2. Update .env File
```bash
# Open .env file in d:\hackn
# Replace MONGODB_URI line with your Atlas connection string:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackmatch?retryWrites=true&w=majority
```

**Important:** Replace `username`, `password`, and `cluster` with your actual values.

### 3. Whitelist Your IP
1. In Atlas dashboard → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Save

### 4. Start Backend
```powershell
cd d:\hackn
npm start
```

Wait for: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

### 5. Open Frontend
Right-click `index.html` → "Open with Live Server" (VS Code)
or use any static file server on port 5500

### 6. Test It!
1. Open browser
2. Go to: http://localhost:5500
3. Click "Sign Up"
4. Create account
5. Explore! 🎉

---

## Option 2: Local MongoDB Setup

### 1. Download MongoDB
- Windows: https://www.mongodb.com/try/download/community
- Install with default settings

### 2. Start MongoDB
```powershell
# Create data directory (if first time)
mkdir C:\data\db

# Start MongoDB
mongod --dbpath "C:\data\db"
```

Keep this terminal open!

### 3. Start Backend
```powershell
# New terminal
cd d:\hackn
npm start
```

### 4. Start Frontend
Right-click `index.html` → "Open with Live Server"

### 5. Test It!
Open: http://localhost:5500

---

## 🔍 Troubleshooting

### "MongoDB connection refused"
**Solution:** MongoDB not running
- Atlas: Check connection string and IP whitelist
- Local: Start `mongod` or MongoDB service

### "Port 5000 already in use"
**Solution:**
```powershell
# Find process
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID 12345 /F
```

### "CORS error"
**Solution:** 
- Make sure backend is running on port 5000
- Check browser console for exact error
- Backend is configured for ports: 3000, 5500, 8080

### Can't open frontend
**Solution:**
```powershell
# Install http-server globally
npm install -g http-server

# Start server
cd d:\hackn
http-server -p 5500
```

---

## ✅ Verification Checklist

- [ ] MongoDB running (Atlas or local)
- [ ] Backend server running on port 5000
- [ ] Frontend accessible on port 5500
- [ ] Can see homepage at http://localhost:5500
- [ ] Can create account
- [ ] Can login
- [ ] Can see dashboard

---

## 📊 What You Should See

### Terminal (Backend)
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
🌍 Environment: development
```

### Browser
- Homepage loads
- Navigation works
- Login/Signup forms work
- Dashboard shows after login

---

## 🎯 Next Steps

1. ✅ Get MongoDB running (5 min)
2. ✅ Start backend (1 min)
3. ✅ Open frontend (1 min)
4. 🚀 Start building!

---

## 📚 More Info

- **Detailed Setup**: See `SETUP.md`
- **Connection Status**: See `CONNECTION_STATUS.md`
- **API Docs**: See `README.md`

---

## 💡 Tips

- Keep backend terminal open while developing
- Use browser DevTools (F12) to debug
- Check backend terminal for API errors
- MongoDB Atlas is easier for beginners
- Local MongoDB is faster for development

---

**Need Help?** Check the error message in terminal or browser console!

