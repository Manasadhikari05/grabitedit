const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const companyRoutes = require('./routes/company');
const jobRoutes = require('./routes/job');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://manasadhikari087:goldengatepaprika@cluster0.1fghguw.mongodb.net/jobweb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Create default admin if it doesn't exist
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error (server will continue running without DB):', error.message || error);
  });

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
      // Ensure password matches env; if not, update it
      const bcrypt = require('bcryptjs');
      const matches = await existingAdmin.comparePassword(process.env.ADMIN_PASSWORD);
      if (!matches) {
        existingAdmin.password = process.env.ADMIN_PASSWORD;
        await existingAdmin.save();
        console.log('✅ Admin password updated to match config');
      } else {
        console.log('✅ Admin already exists:', existingAdmin.email);
      }
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
}

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Serve static files from React app (build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
   console.log(`📊 Admin panel: http://localhost:${PORT}/supersecret-admin`);
   console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});



