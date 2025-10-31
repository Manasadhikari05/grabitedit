const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import models
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');

// Get database schema information
router.get('/schema', async (req, res) => {
  try {
    const schemas = {
      jobs: {
        fields: Object.keys(Job.schema.paths),
        types: Object.fromEntries(
          Object.entries(Job.schema.paths).map(([key, value]) => [key, value.instance])
        )
      },
      companies: {
        fields: Object.keys(Company.schema.paths),
        types: Object.fromEntries(
          Object.entries(Company.schema.paths).map(([key, value]) => [key, value.instance])
        )
      },
      users: {
        fields: Object.keys(User.schema.paths),
        types: Object.fromEntries(
          Object.entries(User.schema.paths).map(([key, value]) => [key, value.instance])
        )
      }
    };
    res.json(schemas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sample data from all collections
router.get('/samples', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const [jobs, companies, users] = await Promise.all([
      Job.find().limit(limit).lean(),
      Company.find().limit(limit).lean(),
      User.find().limit(limit).select('-password').lean()
    ]);

    res.json({
      jobs,
      companies,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get collection statistics
router.get('/stats', async (req, res) => {
  try {
    const [jobCount, companyCount, userCount] = await Promise.all([
      Job.countDocuments(),
      Company.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      jobs: jobCount,
      companies: companyCount,
      users: userCount,
      total: jobCount + companyCount + userCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Query jobs with filters
router.get('/query/jobs', async (req, res) => {
  try {
    const { location, job_type, experience_level, salary_min, salary_max, limit = 10 } = req.query;

    let query = {};

    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    if (job_type) {
      query.job_type = job_type;
    }

    if (experience_level) {
      query.experience_level = experience_level;
    }

    if (salary_min || salary_max) {
      query.salary = {};
      if (salary_min) query.salary.$gte = salary_min;
      if (salary_max) query.salary.$lte = salary_max;
    }

    const jobs = await Job.find(query).limit(parseInt(limit)).lean();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Query companies with filters
router.get('/query/companies', async (req, res) => {
  try {
    const { industry, size, location, limit = 10 } = req.query;

    let query = {};

    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }

    if (size) {
      query.size = size;
    }

    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    const companies = await Company.find(query).limit(parseInt(limit)).lean();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get database structure overview
router.get('/structure', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const structure = {};

    for (const collection of collections) {
      const name = collection.name;
      const count = await db.collection(name).countDocuments();
      structure[name] = {
        count,
        indexes: await db.collection(name).indexes()
      };
    }

    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;