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

/* -------------------- ✅ CORS CONFIGURATION -------------------- */
// Update this list with your actual deployed frontend URLs (no trailing slash)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://job-search-websute.vercel.app', // your main Vercel domain
  'https://job-search-websute-c8epx7ksq-manas-projects-1291f11b.vercel.app', // preview domain
];

// Set up CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* -------------------- ✅ DATABASE CONNECTION -------------------- */
const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://manasadhikari087:goldengatepaprika@cluster0.1fghguw.mongodb.net/jobweb?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message || error);
  });

/* -------------------- ✅ CREATE DEFAULT ADMIN -------------------- */
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Default admin created successfully');
    } else {
      const bcrypt = require('bcryptjs');
      const matches = await existingAdmin.comparePassword(process.env.ADMIN_PASSWORD);
      if (!matches) {
        existingAdmin.password = process.env.ADMIN_PASSWORD;
        await existingAdmin.save();
        console.log('✅ Admin password updated');
      } else {
        console.log('✅ Admin already exists:', existingAdmin.email);
      }
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
}

/* -------------------- ✅ ROUTES -------------------- */
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

/* -------------------- ✅ HEALTH CHECK -------------------- */
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Job Search API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      jobs: '/api/jobs',
      auth: '/api/auth',
      companies: '/api/companies',
      admin: '/api/admin',
      upload: '/api/upload',
    },
  });
});

/* -------------------- ✅ ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

/* -------------------- ✅ START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});



