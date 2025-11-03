# HackMatch Backend API

Complete backend API for **HackMatch – The Hackathon Team Formation Platform** built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **User Authentication** - JWT-based authentication with secure password hashing
- **User Management** - Profile management with skills, interests, and availability
- **Team Management** - Create, join, leave, and manage hackathon teams
- **Hackathon Management** - Create and manage hackathon events
- **Advanced Search** - Search users and teams by skills, interests, and more
- **RESTful API** - Clean, well-structured REST API endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/hackmatch
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas connection string.

6. **Run the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📁 Project Structure

```
hackmatch-backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User management logic
│   ├── teamController.js   # Team management logic
│   └── hackathonController.js # Hackathon management logic
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── errorHandler.js    # Global error handler
├── models/
│   ├── User.js            # User schema
│   ├── Team.js            # Team schema
│   └── Hackathon.js       # Hackathon schema
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── userRoutes.js      # User routes
│   ├── teamRoutes.js      # Team routes
│   └── hackathonRoutes.js # Hackathon routes
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "Full-stack developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI"],
  "availability": "full-time",
  "role": "developer",
  "experience": "intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "github": "https://github.com/johndoe"
}
```

#### Search Users
```http
GET /api/users/search?skills=JavaScript,React&role=developer&availability=full-time
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

---

### Team Endpoints

#### Create Team
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Awesome Team",
  "description": "We build awesome things",
  "hackathon": "hackathon_id_here",
  "maxMembers": 5,
  "skillsNeeded": ["Frontend", "Backend", "Design"],
  "requirements": "Must have React experience",
  "tags": ["web", "mobile"],
  "projectIdea": "AI-powered task manager"
}
```

#### Get All Teams
```http
GET /api/teams?hackathon=hackathon_id&status=open&skills=JavaScript
Authorization: Bearer <token>
```

#### Get Team by ID
```http
GET /api/teams/:id
Authorization: Bearer <token>
```

#### Join Team
```http
POST /api/teams/:id/join
Authorization: Bearer <token>
```

#### Leave Team
```http
POST /api/teams/:id/leave
Authorization: Bearer <token>
```

#### Update Team
```http
PUT /api/teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Team Name",
  "description": "Updated description",
  "skillsNeeded": ["Updated", "Skills"]
}
```

#### Delete Team
```http
DELETE /api/teams/:id
Authorization: Bearer <token>
```

#### Remove Member
```http
DELETE /api/teams/:id/members/:memberId
Authorization: Bearer <token>
```

---

### Hackathon Endpoints

#### Create Hackathon
```http
POST /api/hackathons
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "TechFest 2024",
  "description": "Annual tech hackathon",
  "organizer": "Tech University",
  "startDate": "2024-06-01T09:00:00Z",
  "endDate": "2024-06-03T18:00:00Z",
  "registrationDeadline": "2024-05-25T23:59:59Z",
  "location": "San Francisco, CA",
  "isOnline": false,
  "website": "https://techfest2024.com",
  "maxTeamSize": 5,
  "minTeamSize": 2,
  "categories": ["Web", "Mobile", "AI"],
  "tags": ["hackathon", "coding", "innovation"],
  "prize": "$10,000",
  "image": "https://example.com/image.jpg"
}
```

#### Get All Hackathons
```http
GET /api/hackathons?status=upcoming&search=tech&category=Web
Authorization: Bearer <token>
```

#### Get Hackathon by ID
```http
GET /api/hackathons/:id
Authorization: Bearer <token>
```

#### Update Hackathon
```http
PUT /api/hackathons/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Hackathon Name",
  "description": "Updated description"
}
```

#### Delete Hackathon
```http
DELETE /api/hackathons/:id
Authorization: Bearer <token>
```

#### Join Hackathon
```http
POST /api/hackathons/:id/join
Authorization: Bearer <token>
```

#### Leave Hackathon
```http
POST /api/hackathons/:id/leave
Authorization: Bearer <token>
```

---

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🎯 User Model Fields

- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (min 6 characters)
- `bio` - User biography (max 500 chars)
- `skills` - Array of skills (e.g., ["JavaScript", "React"])
- `interests` - Array of interests (e.g., ["Web Dev", "AI"])
- `availability` - Enum: `full-time`, `part-time`, `weekend-only`, `flexible`
- `role` - Enum: `developer`, `designer`, `business`, `other`
- `experience` - Enum: `beginner`, `intermediate`, `advanced`, `expert`
- `github` - GitHub profile URL
- `linkedin` - LinkedIn profile URL
- `portfolio` - Portfolio website URL
- `avatar` - Avatar image URL

## 🏆 Team Model Fields

- `name` - Team name
- `description` - Team description
- `hackathon` - Reference to Hackathon
- `leader` - Reference to User (team leader)
- `members` - Array of User references
- `maxMembers` - Maximum team size (default: 5)
- `skillsNeeded` - Array of required skills
- `requirements` - Team requirements text
- `status` - Enum: `open`, `full`, `closed`
- `tags` - Array of tags
- `projectIdea` - Project idea description

## 🎪 Hackathon Model Fields

- `name` - Hackathon name
- `description` - Hackathon description
- `organizer` - Organizer name
- `startDate` - Start date and time
- `endDate` - End date and time
- `registrationDeadline` - Registration deadline
- `location` - Physical location
- `isOnline` - Boolean (online/offline)
- `website` - Official website URL
- `maxTeamSize` - Maximum team size
- `minTeamSize` - Minimum team size
- `categories` - Array of categories
- `tags` - Array of tags
- `prize` - Prize information
- `status` - Enum: `upcoming`, `active`, `completed`, `cancelled`
- `participants` - Array of User references
- `teams` - Array of Team references

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

## 📝 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🚨 Important Notes

1. **JWT Secret**: Change the `JWT_SECRET` in production to a strong, random string
2. **MongoDB**: Ensure MongoDB is running before starting the server
3. **CORS**: Update `FRONTEND_URL` in `.env` to match your frontend URL
4. **Password**: Passwords are automatically hashed using bcrypt before saving

## 📄 License

ISC

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Hacking! 🚀**

