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

// Middleware - CORS configuration for production and development
const allowedOrigins = [
  'https://grabitedit.vercel.app',  // Vercel frontend
  'http://localhost:5173',         // Local development
  'http://localhost:3000',         // Alternative local port
  process.env.FRONTEND_URL         // Environment variable for custom frontend URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection with improved options
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://manasadhikari087:goldengatepaprika@cluster0.1fghguw.mongodb.net/jobweb?retryWrites=true&w=majority&appName=Cluster0';

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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

// ===== API Routes (must come before catch-all) =====
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

// ===== Special Frontend Route Handlers =====

// Handle frontend requests to /admin/login - redirect to React route
app.get('/admin/login', (req, res) => {
  console.log('Frontend attempting to access /admin/login, redirecting to frontend admin route');
  
  // Get the frontend URL from the request origin or use default
  const frontendUrl = req.headers.origin || 'https://grabitedit.vercel.app';
  const redirectUrl = `${frontendUrl}/supersecret-admin`;
  
  console.log(`Redirecting to: ${redirectUrl}`);
  res.redirect(302, redirectUrl);
});

// Serve static files from public directory (for PDF.js worker and other assets)
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from React app (build) - Only serve if frontend is built
const frontendPath = path.join(__dirname, '../frontend/dist');
const indexPath = path.join(frontendPath, 'index.html');

// Check if frontend build exists
const frontendExists = require('fs').existsSync(indexPath);

if (frontendExists) {
  app.use(express.static(frontendPath));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    // Skip API routes - let React Router handle all other routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    
    // Serve React app for all frontend routes (including admin routes)
    console.log(`Serving React app for: ${req.path}`);
    res.sendFile(indexPath);
  });
  
  console.log('✅ Frontend build found, serving React app for all non-API routes');
} else {
  console.log('⚠️ Frontend build not found, serving API only');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server is already started above with error handling



