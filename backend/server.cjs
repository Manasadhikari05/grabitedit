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

// Handle port conflicts gracefully
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/supersecret-admin`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop other server instances or use a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

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

// MongoDB Connection with improved options
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://manasadhikari087:goldengatepaprika@cluster0.1fghguw.mongodb.net/jobweb?retryWrites=true&w=majority&appName=Cluster0';

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(mongoUri, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Create default admin if it doesn't exist
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error (server will continue running without DB):', error.message || error);
    // Don't exit the process, let the server continue running
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
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

// Add database routes
const databaseRoutes = require('./routes/database');
app.use('/api/database', databaseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Serve static files from public directory (for PDF.js worker)
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from React app (build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server is already started above with error handling



