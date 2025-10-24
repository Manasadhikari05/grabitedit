const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      id: admin._id,
      email: admin.email,
      role: admin.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Admin Profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Company
router.post('/companies', auth, async (req, res) => {
  try {
    const { company_id, name, logo, description, location, website } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ company_id });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this ID already exists' });
    }

    const company = new Company({
      company_id,
      name,
      logo,
      description,
      location,
      website
    });

    await company.save();
    res.status(201).json({ message: 'Company added successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Companies
router.get('/companies', auth, async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Job
router.post('/jobs', auth, async (req, res) => {
  try {
    const {
      job_id,
      title,
      description,
      requirements,
      last_date,
      company_id,
      salary,
      location,
      job_type,
      experience_level
    } = req.body;

    // Check if company exists
    const company = await Company.findOne({ company_id });
    if (!company) {
      return res.status(400).json({ message: 'Company does not exist. Please add company first.' });
    }

    // Check if job already exists
    const existingJob = await Job.findOne({ job_id });
    if (existingJob) {
      return res.status(400).json({ message: 'Job with this ID already exists' });
    }

    const job = new Job({
      job_id,
      title,
      description,
      requirements,
      last_date,
      company_id,
      salary,
      location,
      job_type,
      experience_level
    });

    await job.save();
    res.status(201).json({ message: 'Job added successfully', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Jobs
router.get('/jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find().populate('company_id', 'name logo').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Dashboard Stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalCompanies,
      totalJobs,
      activeJobs,
      recentJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



