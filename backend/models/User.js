const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    default: '',
    unique: true,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  // Profile Information
  title: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  // Social Links
  twitter: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  dribbble: {
    type: String,
    default: ''
  },
  leetcode: {
    type: String,
    default: ''
  },
  codeforces: {
    type: String,
    default: ''
  },
  // Current Work
  currentCompany: {
    type: String,
    default: ''
  },
  currentPosition: {
    type: String,
    default: ''
  },
  // Arrays for complex data
  interests: [String],
  // AI Insights and Analytics
  aiInsights: {
    type: Object,
    default: {}
  },
  // User behavior tracking for AI recommendations
  behaviorData: {
    jobViews: [{
      job_id: String,
      category: String,
      viewedAt: Date,
      timeSpent: Number // in seconds
    }],
    searchQueries: [{
      query: String,
      timestamp: Date,
      resultsCount: Number
    }],
    applicationPatterns: {
      preferredCategories: [String],
      preferredLocations: [String],
      preferredSalaryRanges: [String],
      applicationTimes: [String] // e.g., ["morning", "afternoon", "evening"]
    }
  },
  workHistory: [{
    position: String,
    company: String,
    period: String,
    current: {
      type: Boolean,
      default: false
    }
  }],
  skills: [String],
  certificates: [{
    name: String,
    issuer: String,
    date: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  // Job Applications
  appliedJobs: [{
    job_id: {
      type: String,
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'applied'
    }
  }],
  // Job Bookmarks
  bookmarkedJobs: [{
    job_id: {
      type: String,
      required: true
    },
    bookmarkedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Job Views
  viewedJobs: [{
    job_id: {
      type: String,
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Discussion Posts
  discussionPosts: [{
    post_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    tags: [String],
    imageUrl: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    likes: [{
      user_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    views: {
      type: Number,
      default: 0
    },
    viewedBy: [{
      user_id: String,
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Comments on Posts
  comments: [{
    comment_id: {
      type: String,
      required: true
    },
    post_id: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Profile Image
  profileImage: {
    type: String,
    default: ''
  },
  // Random Avatar Color (for react-avatar)
  avatarColor: {
    type: String,
    default: ''
  },
  // Email Verification
  emailVerificationToken: {
    type: String,
    default: ''
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // OTP Specific Fields
  otp: {
    type: String,
    default: ''
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


