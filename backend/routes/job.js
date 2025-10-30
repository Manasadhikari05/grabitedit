const express = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const router = express.Router();

// Function to clean up expired jobs
const cleanupExpiredJobs = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const result = await Job.deleteMany({
      last_date: { $lt: startOfDay },
      isActive: true
    });

    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} expired jobs`);
    }
  } catch (error) {
    console.error('Error cleaning up expired jobs:', error);
  }
};

// Run cleanup on server start (only after DB connection)
setTimeout(cleanupExpiredJobs, 5000); // Delay to ensure DB connection

// Run cleanup every hour
setInterval(cleanupExpiredJobs, 60 * 60 * 1000);

// Get all jobs
router.get('/', async (req, res) => {
  try {
    // Clean up expired jobs before fetching
    await cleanupExpiredJobs();

    // Get user skills from query parameter if provided
    const userSkills = req.query.skills ? req.query.skills.split(',').map(skill => skill.trim()) : [];

    let jobs = await Job.find({ isActive: true })
      .populate('company_id', 'name logo description')
      .sort({ createdAt: -1 });

    // If user has skills, score and sort jobs based on skill matches
    if (userSkills.length > 0) {
      jobs = jobs.map(job => {
        let skillMatches = 0;
        const jobText = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();

        userSkills.forEach(skill => {
          const skillLower = skill.toLowerCase();
          // Escape special regex characters to avoid invalid regex patterns
          const escapedSkill = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Count occurrences of the skill in job title, description and requirements
          const regex = new RegExp(escapedSkill, 'gi');
          const matches = jobText.match(regex);
          if (matches) {
            skillMatches += matches.length;
          }
        });

        return {
          ...job.toObject(),
          skillMatchScore: skillMatches,
          isHighlyRecommended: skillMatches >= 2
        };
      });

      // Sort by skill match score (highest first), then by creation date
      jobs.sort((a, b) => {
        if (b.skillMatchScore !== a.skillMatchScore) {
          return b.skillMatchScore - a.skillMatchScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs'
    });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company_id', 'name logo description website industry location');

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job'
    });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const { job_id, title, description, requirements, last_date, company_id, salary, location, job_type, experience_level, work_location, application_link } = req.body;

    // Handle location data - could be string or object
    let processedLocation = location;
    if (typeof location === 'object' && location !== null) {
      // Location is already in the new format with coordinates
      processedLocation = location;
    } else if (typeof location === 'string') {
      // Legacy string location - convert to new format
      processedLocation = {
        address: location,
        coordinates: { lat: 0, lng: 0 },
        placeId: ''
      };
    }

    // Validate required fields
    if (!job_id || !title || !description || !requirements || !last_date || !company_id || !location) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    // Check if company exists
    const company = await Company.findById(company_id);
    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Check if job_id already exists
    const existingJob = await Job.findOne({ job_id });
    if (existingJob) {
      return res.status(400).json({
        success: false,
        error: 'Job ID already exists'
      });
    }

    // Create new job
    const job = new Job({
      job_id,
      title,
      description,
      requirements,
      last_date,
      company_id,
      salary,
      location: processedLocation,
      job_type,
      experience_level,
      work_location,
      application_link
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { job_id, title, description, requirements, last_date, company_id, salary, location, job_type, experience_level, work_location, application_link, isActive } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Update fields
    if (job_id) job.job_id = job_id;
    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (last_date) job.last_date = last_date;
    if (company_id) job.company_id = company_id;
    if (salary !== undefined) job.salary = salary;
    if (location) {
      // Handle location data - could be string or object
      let processedLocation = location;
      if (typeof location === 'object' && location !== null) {
        // Location is already in the new format with coordinates
        processedLocation = location;
      } else if (typeof location === 'string') {
        // Legacy string location - convert to new format
        processedLocation = {
          address: location,
          coordinates: { lat: 0, lng: 0 },
          placeId: ''
        };
      }
      job.location = processedLocation;
    }
    if (job_type) job.job_type = job_type;
    if (experience_level) job.experience_level = experience_level;
    if (work_location) job.work_location = work_location;
    if (application_link) job.application_link = application_link;
    if (isActive !== undefined) job.isActive = isActive;

    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job'
    });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete job'
    });
  }
});

// Get jobs by company
router.get('/company/:companyId', async (req, res) => {
  try {
    const jobs = await Job.find({ company_id: req.params.companyId, isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs by company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs by company'
    });
  }
});

// Search jobs
router.get('/search/:query', async (req, res) => {
  try {
    // Clean up expired jobs before searching
    await cleanupExpiredJobs();

    const query = req.params.query;
    const jobs = await Job.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('company_id', 'name logo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search jobs'
    });
  }
});

// Get expiring jobs (last date is today)
router.get('/expiring/today', async (req, res) => {
  try {
    // Clean up expired jobs first
    await cleanupExpiredJobs();

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const expiringJobs = await Job.find({
      isActive: true,
      last_date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
      .populate('company_id', 'name logo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs: expiringJobs
    });
  } catch (error) {
    console.error('Error fetching expiring jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expiring jobs'
    });
  }
});

// Get expiring jobs for a specific user (bookmarked jobs expiring today)
router.post('/expiring/today/:userId', async (req, res) => {
  try {
    // Clean up expired jobs first
    await cleanupExpiredJobs();

    const { userId } = req.params;
    const { bookmarkedJobIds } = req.body; // Array of bookmarked job IDs from frontend
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get bookmarked jobs expiring today
    const bookmarkedExpiringJobs = await Job.find({
      _id: { $in: bookmarkedJobIds || [] },
      isActive: true,
      last_date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
      .populate('company_id', 'name logo')
      .sort({ createdAt: -1 });

    // Get all jobs expiring today as recommended jobs (excluding already bookmarked ones)
    const recommendedExpiringJobs = await Job.find({
      _id: { $nin: bookmarkedJobIds || [] },
      isActive: true,
      last_date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    })
      .populate('company_id', 'name logo')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      bookmarkedExpiringJobs,
      recommendedExpiringJobs
    });
  } catch (error) {
    console.error('Error fetching user expiring jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user expiring jobs'
    });
  }
});

// Bookmark a job
router.post('/bookmark/:jobId', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { jobId } = req.params;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Job ID are required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has already bookmarked this job
    const alreadyBookmarked = user.bookmarkedJobs.some(bookmark => bookmark.job_id.toString() === jobId.toString());
    if (alreadyBookmarked) {
      return res.json({
        success: true,
        message: 'Job already bookmarked',
        bookmark: {
          job_id: jobId,
          bookmarkedAt: user.bookmarkedJobs.find(bookmark => bookmark.job_id.toString() === jobId.toString()).bookmarkedAt
        }
      });
    }

    // Add job bookmark to user's profile
    user.bookmarkedJobs.push({
      job_id: jobId,
      bookmarkedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Job bookmarked successfully',
      bookmark: {
        job_id: jobId,
        bookmarkedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error bookmarking job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bookmark job'
    });
  }
});

// Remove bookmark
router.delete('/bookmark/:jobId', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { jobId } = req.params;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Job ID are required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find and remove the bookmark
    const bookmarkIndex = user.bookmarkedJobs.findIndex(bookmark => bookmark.job_id.toString() === jobId.toString());
    if (bookmarkIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    user.bookmarkedJobs.splice(bookmarkIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove bookmark'
    });
  }
});

// Track job view
router.post('/view/:jobId', async (req, res) => {
  try {
    // Get user ID from JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { jobId } = req.params;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Job ID are required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Always add job view to user's profile (no daily limit for tracking)
    user.viewedJobs.push({
      job_id: jobId,
      viewedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Job view tracked successfully',
      view: {
        job_id: jobId,
        viewedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error tracking job view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track job view'
    });
  }
});

module.exports = router;