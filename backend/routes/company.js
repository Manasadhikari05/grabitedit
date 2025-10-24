const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select('name logo description website industry location size createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch companies'
    });
  }
});

// Get single company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company'
    });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const { name, logo, description, website, industry, location, size } = req.body;

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
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: 'Company with this name already exists'
      });
    }
    
    // Create new company
    const company = new Company({
      name,
      logo,
      description,
      website,
      industry,
      location: processedLocation,
      size,
      createdBy: req.user?.id || null // You might want to add auth middleware
    });
    
    await company.save();
    
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create company'
    });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { name, logo, description, website, industry, location, size, isActive } = req.body;
    
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }
    
    // Update fields
    if (name) company.name = name;
    if (logo) company.logo = logo;
    if (description) company.description = description;
    if (website !== undefined) company.website = website;
    if (industry !== undefined) company.industry = industry;
    if (location !== undefined) {
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
      company.location = processedLocation;
    }
    if (size) company.size = size;
    if (isActive !== undefined) company.isActive = isActive;
    
    await company.save();
    
    res.json({
      success: true,
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company'
    });
  }
});

// Delete company (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete company'
    });
  }
});

// Get company statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments({ isActive: true });
    const recentCompanies = await Company.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name logo description createdAt');
    
    res.json({
      success: true,
      stats: {
        totalCompanies,
        recentCompanies
      }
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company statistics'
    });
  }
});

module.exports = router;

