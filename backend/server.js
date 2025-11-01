const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const jobRoutes = require('./routes/job');
const databaseRoutes = require('./routes/database');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://grabitedit.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Create default admin if it doesn't exist
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error (server will continue running without DB):', error.message || error);
  });
} else {
  console.warn('⚠️ MONGODB_URI is not set. Backend will run without a database connection.');
}

// Create default admin function
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin created successfully');
    } else {
      console.log('✅ Admin already exists:', existingAdmin.email);
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
}

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/database', databaseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/supersecret-admin`);
});
