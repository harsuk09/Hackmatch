const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  interests: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekend-only', 'flexible'],
    default: 'flexible'
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['developer', 'designer', 'business', 'other'],
    default: 'developer'
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Notifications stored on user for simple in-app alerts
userSchema.add({
  notifications: [
    {
      type: {
        type: String,
        enum: ['team_request', 'message', 'system'],
        default: 'system'
      },
      message: { type: String },
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

