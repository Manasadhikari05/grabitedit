const express = require('express');
const User = require('../models/User');
const otpEmailService = require('../services/otpEmail');

const router = express.Router();

// Environment validation
const validateEnvironment = () => {
  const requiredEnvVars = ['GMAIL_EMAIL', 'GMAIL_APP_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
    console.warn('📧 OTP emails will fall back to console display');
    return false;
  }
  return true;
};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if user exists, if not create a temporary record
    let user = await User.findOne({ email: email.toLowerCase() });
    const isNewUser = !user;

    if (isNewUser) {
      // Create temporary user for OTP verification
      user = new User({
        email: email.toLowerCase(),
        password: 'temp_' + Date.now(), // Temporary password
        name: 'User', // Will be updated during registration
        isEmailVerified: false,
        isVerified: false,
        otp: '',
        otpExpires: null
      });
    }

    // Clear any existing OTP
    user.otp = '';
    user.otpExpires = null;
    user.isVerified = false;

    // Generate and store new OTP
    const otpResult = await otpEmailService.sendOTP(email, 'User');
    const otp = otpResult.otp;

    // Store OTP in database with 5-minute expiry
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    user.isEmailVerified = false;
    user.isVerified = false;

    await user.save();

    console.log('\n==========================================');
    console.log('🔐 OTP GENERATED AND STORED');
    console.log('==========================================');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    console.log('⏰ Expires:', user.otpExpires.toLocaleString());
    console.log('👤 User Type:', isNewUser ? 'NEW' : 'EXISTING');
    console.log('💾 Stored in MongoDB: YES');
    console.log('📧 Email Sent:', otpResult.success ? 'YES' : 'NO');
    console.log('==========================================\n');

    // Response based on email sending success
    if (otpResult.success) {
      res.json({
        success: true,
        message: 'OTP sent successfully to your email. Check your inbox.',
        emailSent: true,
        showOTP: false, // Don't show OTP since email was sent
        expiresIn: '5 minutes',
        isNewUser: isNewUser
      });
    } else {
      // Fallback: Show OTP for testing when email fails
      res.json({
        success: true,
        message: 'OTP generated successfully. Check the server console for the OTP code.',
        emailSent: false,
        showOTP: true, // Show OTP since email failed
        otp: otp, // Include OTP for testing
        expiresIn: '5 minutes',
        isNewUser: isNewUser,
        consoleOTP: true,
        instructions: 'Email service unavailable. Check server console for OTP.'
      });
    }

  } catch (error) {
    console.error('Error in /send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: error.message
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Validate OTP format (6 digits)
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit number'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP.'
      });
    }

    // Check if OTP has expired
    if (user.otpExpires < new Date()) {
      // Clear expired OTP
      user.otp = '';
      user.otpExpires = null;
      user.isVerified = false;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // OTP is valid - mark user as verified
    user.isEmailVerified = true;
    user.isVerified = true;
    user.otp = ''; // Clear OTP after successful verification
    user.otpExpires = null;
    await user.save();

    console.log('\n==========================================');
    console.log('✅ OTP VERIFICATION SUCCESSFUL');
    console.log('==========================================');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    console.log('✅ Verified:', true);
    console.log('💾 Updated in MongoDB: YES');
    console.log('🕒 Verified at:', new Date().toLocaleString());
    console.log('==========================================\n');

    res.json({
      success: true,
      message: 'OTP verified successfully! Email is now verified.',
      emailVerified: true,
      isVerified: true,
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /verify-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
      error: error.message
    });
  }
});

// Resend OTP endpoint
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Call send-otp to generate and send new OTP
    // We'll forward this to the send-otp endpoint
    req.body = { email };
    return router.handle(req, res, router.stack.find(route => route.path === '/send-otp').route);

  } catch (error) {
    console.error('Error in /resend-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
      error: error.message
    });
  }
});

// Get OTP status endpoint
router.get('/otp-status/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        email: user.email,
        isVerified: user.isVerified,
        emailVerified: user.isEmailVerified,
        hasOTP: !!(user.otp && user.otpExpires),
        otpExpired: user.otpExpires ? user.otpExpires < new Date() : false,
        expiresAt: user.otpExpires
      }
    });

  } catch (error) {
    console.error('Error in /otp-status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get OTP status',
      error: error.message
    });
  }
});

// Test email configuration endpoint
router.get('/test-email-config', async (req, res) => {
  try {
    const envValid = validateEnvironment();
    let smtpValid = false;

    if (envValid) {
      smtpValid = await otpEmailService.testConnection();
    }

    res.json({
      success: true,
      data: {
        environmentConfigured: envValid,
        smtpConnectionValid: smtpValid,
        gmailEmail: process.env.GMAIL_EMAIL ? 'Set' : 'Not Set',
        timestamp: new Date().toISOString()
      },
      message: envValid && smtpValid ? 'Email configuration is valid' : 'Email configuration needs attention'
    });

  } catch (error) {
    console.error('Error in /test-email-config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email configuration',
      error: error.message
    });
  }
});

module.exports = router;