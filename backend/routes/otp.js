const express = require('express');
const User = require('../models/User');
const otpEmailService = require('../services/otpEmail');
const fallbackEmailService = require('../services/fallbackEmail');

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

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    console.log(`📧 Processing OTP request for: ${email}`);

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

    // Send OTP via primary service (Gmail)
    const otpResult = await otpEmailService.sendOTP(email, 'User');
    let finalResult = otpResult;

    // If Gmail failed and SendGrid is configured, try fallback
    if (!otpResult.success && process.env.SENDGRID_API_KEY) {
      console.log('🔄 Trying SendGrid fallback...');
      const fallbackResult = await fallbackEmailService.sendOTP(email, 'User');
      
      if (fallbackResult.success) {
        finalResult = {
          ...fallbackResult,
          fallbackUsed: true,
          originalError: otpResult.error
        };
      }
    }

    const otp = finalResult.otp;

    // Store OTP in database with 5-minute expiry
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    user.isEmailVerified = false;
    user.isVerified = false;

    await user.save();

    // Enhanced logging with provider information
    const provider = finalResult.fallbackUsed ? 'SendGrid' : 'Gmail';
    const emailSent = finalResult.emailSent || finalResult.provider === 'SendGrid';
    
    console.log('\n==========================================');
    console.log('🔐 OTP GENERATED AND STORED');
    console.log('==========================================');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);
    console.log('⏰ Expires:', user.otpExpires.toLocaleString());
    console.log('👤 User Type:', isNewUser ? 'NEW' : 'EXISTING');
    console.log('💾 Stored in MongoDB: YES');
    console.log('📧 Email Sent:', emailSent ? 'YES' : 'NO');
    console.log('🌐 Provider:', provider);
    console.log('📧 Message ID:', finalResult.messageId || 'N/A');
    console.log('==========================================\n');

    // Response based on email sending success
    if (finalResult.success) {
      res.json({
        success: true,
        message: finalResult.fallbackUsed 
          ? `OTP sent successfully via ${provider}` 
          : 'OTP sent successfully to your email. Check your inbox.',
        emailSent: emailSent,
        showOTP: !emailSent,
        expiresIn: '5 minutes',
        isNewUser: isNewUser,
        provider: provider,
        fallbackUsed: finalResult.fallbackUsed,
        messageId: finalResult.messageId,
        instructions: !emailSent ? `Enter this code: ${otp}` : undefined
      });
    } else {
      // All email services failed - show troubleshooting info
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP via all available services',
        error: finalResult.error,
        troubleshooting: [
          'Check Gmail App Password configuration',
          'Verify 2-factor authentication is enabled on Gmail',
          'Check spam/promotions folder for emails',
          'Try SendGrid for production deployment',
          'Verify environment variables are set correctly'
        ]
      });
    }

  } catch (error) {
    console.error('❌ Send OTP error:', error);
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

    console.log(`🔍 Verifying OTP for: ${email}`);

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
    console.error('❌ Verify OTP error:', error);
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

// Enhanced test email configuration endpoint
router.get('/test-connection', async (req, res) => {
  try {
    console.log('🔍 Testing email service connections...');
    
    // Test Gmail connection
    const gmailTest = await otpEmailService.testConnection();
    
    // Test SendGrid if available
    let sendgridTest = { available: false };
    if (process.env.SENDGRID_API_KEY) {
      try {
        sendgridTest = {
          available: true,
          message: 'SendGrid API key configured',
          messageCount: '100 emails/day (free tier)'
        };
      } catch (error) {
        sendgridTest = {
          available: false,
          error: error.message
        };
      }
    }

    // Get configuration status
    const configStatus = otpEmailService.getConfigurationStatus();

    res.json({
      success: true,
      gmail: gmailTest,
      sendgrid: sendgridTest,
      configuration: configStatus,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasGmailEmail: !!process.env.GMAIL_EMAIL,
        hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
        hasSendGridKey: !!process.env.SENDGRID_API_KEY
      }
    });

  } catch (error) {
    console.error('❌ Connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    });
  }
});

// Delete OTP endpoint (for clearing verification status)
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log(`🗑️ Clearing OTP for: ${email}`);

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (user) {
        user.otp = null;
        user.otpExpires = null;
        user.isVerified = false;
        await user.save();
      }

      return res.json({
        success: true,
        message: 'OTP cleared successfully'
      });

    } catch (error) {
      console.error('❌ Database clear error:', error);
      return res.status(500).json({
        success: false,
        message: 'Database error during clear operation'
      });
    }

  } catch (error) {
    console.error('❌ Clear OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;