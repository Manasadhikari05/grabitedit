const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  last_date: {
    type: Date,
    required: true
  },
  company_id: {
    type: String,
    required: true,
    ref: 'Company'
  },
  salary: {
    type: String,
    default: ''
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    placeId: {
      type: String,
      default: ''
    }
  },
  job_type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full Time'
  },
  experience_level: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    default: 'Entry Level'
  },
  work_location: {
    type: String,
    enum: ['Office', 'Remote', 'Hybrid'],
    default: 'Office'
  },
  application_link: {
    type: String,
    default: ''
  },
  applicantsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);



