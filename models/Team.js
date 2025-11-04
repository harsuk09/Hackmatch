const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a team name'],
    trim: true,
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    // Make hackathon optional so teams can exist without being linked to a hackathon
    // required: [true, 'Please provide a hackathon ID']
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Team must have a leader']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxMembers: {
    type: Number,
    default: 5,
    min: [2, 'Team must have at least 2 members'],
    max: [10, 'Team cannot have more than 10 members']
  },
  skillsNeeded: {
    type: [String],
    default: []
  },
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'full', 'closed'],
    default: 'open'
  },
  tags: {
    type: [String],
    default: []
  },
  projectIdea: {
    type: String,
    maxlength: [1000, 'Project idea cannot exceed 1000 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Pending join requests: stored with reference to user and an optional message
teamSchema.add({
  pendingRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

// Virtual to check if team is full
teamSchema.virtual('isFull').get(function() {
  return this.members.length >= this.maxMembers;
});

// Update status based on members count
teamSchema.pre('save', function(next) {
  if (this.members.length >= this.maxMembers) {
    this.status = 'full';
  } else if (this.status === 'full' && this.members.length < this.maxMembers) {
    this.status = 'open';
  }
  next();
});

// Index for searching
teamSchema.index({ hackathon: 1, status: 1 });
teamSchema.index({ skillsNeeded: 1 });
teamSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Team', teamSchema);

