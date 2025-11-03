const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a hackathon name'],
    trim: true,
    maxlength: [100, 'Hackathon name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  organizer: {
    type: String,
    required: [true, 'Please provide an organizer name'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please provide a registration deadline']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  website: {
    type: String,
    default: ''
  },
  maxTeamSize: {
    type: Number,
    default: 5,
    min: [2, 'Max team size must be at least 2'],
    max: [10, 'Max team size cannot exceed 10']
  },
  minTeamSize: {
    type: Number,
    default: 2,
    min: [2, 'Min team size must be at least 2']
  },
  categories: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  prize: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for searching
hackathonSchema.index({ startDate: 1, status: 1 });
hackathonSchema.index({ name: 'text', description: 'text', tags: 'text' });
hackathonSchema.index({ registrationDeadline: 1 });

module.exports = mongoose.model('Hackathon', hackathonSchema);

