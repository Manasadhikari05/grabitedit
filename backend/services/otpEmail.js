const nodemailer = require('nodemailer');
const crypto = require('crypto');

class OTPEmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  // Validate environment variables
  validateEnvironment() {
    const errors = [];
    
    if (!process.env.GMAIL_EMAIL) {
      errors.push('GMAIL_EMAIL environment variable is not set');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(process.env.GMAIL_EMAIL)) {
        errors.push('GMAIL_EMAIL is not a valid email address');
      }
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      errors.push('GMAIL_APP_PASSWORD environment variable is not set');
    } else {
      // Gmail App Password should be 16 characters
      if (process.env.GMAIL_APP_PASSWORD.length !== 16) {
        errors.push('GMAIL_APP_PASSWORD should be exactly 16 characters (App Password)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      email: process.env.GMAIL_EMAIL,
      hasAppPassword: !!process.env.GMAIL_APP_PASSWORD
    };
  }

  initializeTransporter() {
    const envCheck = this.validateEnvironment();
    
    if (!envCheck.isValid) {
      console.log('⚠️ Email Service Configuration Issues:');
      envCheck.errors.forEach(error => console.log(`   ❌ ${error}`));
      console.log('   💡 Gmail App Password must be 16 characters from Google Account settings');
      return;
    }

    try {
      // Option 1: Using Gmail service (recommended)
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: envCheck.email,
          pass: process.env.GMAIL_APP_PASSWORD
        },
        // Additional security options
        tls: {
          // Reject unauthorized TLS certificates
          rejectUnauthorized: true,
          // Minimum TLS version
          minVersion: 'TLSv1.2'
        }
      });

      this.isConfigured = true;
      console.log('✅ Gmail transporter initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Gmail transporter:', error);
    }
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create optimized email template to avoid spam filtering
  createOTPEmailTemplate(email, otp, name = 'User') {
    const fromEmail = process.env.GMAIL_EMAIL;
    const otpPreview = otp.substring(0, 3) + '***'; // Don't expose full OTP in logs
    
    return {
      from: `${fromEmail}`,
      to: email,
      subject: '🔐 GrabIt - Your Verification Code (Expires in 5 minutes)',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - GrabIt</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">GrabIt Job Portal</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4f46e5; margin-top: 0;">Hello ${name},</h2>
                
                <p>Thank you for registering with GrabIt Job Portal. To complete your registration, please use the verification code below:</p>
                
                <div style="background: #f8fafc; border: 2px dashed #4f46e5; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <div style="font-size: 32px; font-weight: bold; color: #4f46e5; margin: 10px 0; font-family: 'Courier New', monospace;">${otp}</div>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Expires in 5 minutes</p>
                </div>
                
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Security Notice:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #991b1b;">
                        <li>This code expires in 5 minutes</li>
                        <li>Never share this code with anyone</li>
                        <li>If you didn't request this, please ignore</li>
                    </ul>
                </div>
                
                <p>If you need help, contact support@grabit.com</p>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>GrabIt Team</strong>
                </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p>This email was sent to ${email}</p>
                <p>© 2024 GrabIt Job Portal. All rights reserved.</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Email Verification - GrabIt Job Portal
        
        Hello ${name},
        
        Thank you for registering with GrabIt Job Portal. To complete your registration, please use the verification code below:
        
        Your Verification Code: ${otp}
        Expires in 5 minutes
        
        Security Notice:
        - This code expires in 5 minutes
        - Never share this code with anyone  
        - If you didn't request this, please ignore
        
        Best regards,
        GrabIt Team
        
        This email was sent to ${email}
        © 2024 GrabIt Job Portal. All rights reserved.
      `
    };
  }

  // Enhanced sendOTP with comprehensive error handling and logging
  async sendOTP(email, name = 'User') {
    try {
      const otp = this.generateOTP();
      console.log(`🔐 OTP Generated: ${otp.substring(0,3)}*** (preview)`);

      // Check if email service is configured
      if (!this.isConfigured) {
        console.log('❌ Email service not configured');
        throw new Error('Email service not configured. Please check environment variables.');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email address format');
      }

      const envCheck = this.validateEnvironment();
      if (!envCheck.isValid) {
        throw new Error(`Environment configuration error: ${envCheck.errors.join(', ')}`);
      }

      // Create email template
      const mailOptions = this.createOTPEmailTemplate(email, otp, name);
      
      console.log('📧 Email Configuration:');
      console.log(`   From: ${mailOptions.from}`);
      console.log(`   To: ${email}`);
      console.log(`   Subject: ${mailOptions.subject}`);
      console.log(`   HTML Length: ${mailOptions.html.length} characters`);

      // Send email with detailed error handling
      try {
        console.log('🚀 Attempting to send email via Gmail SMTP...');
        
        const info = await this.transporter.sendMail({
          ...mailOptions,
          // Additional headers to improve deliverability
          headers: {
            'X-Mailer': 'GrabIt Email Service',
            'X-Priority': '3',
            'X-MSMail-Priority': 'Normal'
          }
        });

        console.log('✅ Email sent successfully!');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📧 Response: ${info.response}`);
        console.log(`📧 Envelope:`, info.envelope);
        console.log(`⏰ Accepted: ${info.accepted.length} recipients`);
        console.log(`⏰ Rejected: ${info.rejected.length} recipients`);
        
        if (info.accepted.length > 0) {
          console.log(`✅ Successfully delivered to: ${info.accepted.join(', ')}`);
        }
        
        if (info.rejected.length > 0) {
          console.log(`⚠️ Rejected recipients: ${info.rejected.join(', ')}`);
        }

        return {
          success: true,
          otp: otp,
          messageId: info.messageId,
          emailSent: true,
          accepted: info.accepted,
          rejected: info.rejected,
          message: 'OTP sent successfully to your email'
        };

      } catch (smtpError) {
        console.error('❌ SMTP Error Details:');
        console.error(`   Error Code: ${smtpError.code}`);
        console.error(`   Error Message: ${smtpError.message}`);
        console.error(`   Error Response: ${smtpError.response}`);
        console.error(`   Error Command: ${smtpError.command}`);
        console.error(`   Full Error:`, smtpError);
        
        // Classify the error for better debugging
        if (smtpError.code === 'EAUTH') {
          throw new Error('Gmail authentication failed. Please check your App Password and email address.');
        } else if (smtpError.code === 'EUNPLUG') {
          throw new Error('Email service temporarily unavailable. Please try again later.');
        } else if (smtpError.response && smtpError.response.includes('550')) {
          throw new Error('Recipient email address is invalid or blocked.');
        } else if (smtpError.response && smtpError.response.includes('550')) {
          throw new Error('Email content was rejected by spam filter.');
        } else {
          throw new Error(`Email sending failed: ${smtpError.message}`);
        }
      }

    } catch (error) {
      console.error('❌ OTP Service Error:');
      console.error(`   Error Type: ${error.constructor.name}`);
      console.error(`   Error Message: ${error.message}`);
      console.error(`   Stack:`, error.stack);
      
      // For testing environments, still return OTP
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Development mode - returning OTP for testing');
        const otp = this.generateOTP();
        console.log(`🔐 Testing OTP: ${otp}`);
        
        return {
          success: true,
          otp: otp,
          emailSent: false,
          showOTP: true,
          message: 'Email service unavailable - OTP shown for testing',
          instructions: `Enter this code: ${otp}`
        };
      }

      return {
        success: false,
        error: error.message,
        message: 'Failed to send OTP email'
      };
    }
  }

  // Test SMTP connection with detailed diagnostics
  async testConnection() {
    try {
      console.log('🔍 Testing SMTP connection...');
      
      if (!this.transporter) {
        throw new Error('SMTP transporter not initialized');
      }

      // Verify connection
      const verifyResult = await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      console.log('📧 SMTP Configuration Details:');
      console.log(`   Service: Gmail`);
      console.log(`   Host: smtp.gmail.com`);
      console.log(`   Port: 587 (STARTTLS)`);
      console.log(`   Secure: false`);
      console.log(`   Auth User: ${process.env.GMAIL_EMAIL}`);
      console.log(`   Auth Password: ${'*'.repeat(process.env.GMAIL_APP_PASSWORD?.length || 0)}`);

      return {
        success: true,
        message: 'SMTP connection successful',
        details: verifyResult
      };

    } catch (error) {
      console.error('❌ SMTP Connection Test Failed:');
      console.error(`   Error Code: ${error.code}`);
      console.error(`   Error Message: ${error.message}`);
      console.error(`   Error Response: ${error.response}`);
      
      // Provide specific troubleshooting guidance
      let troubleshooting = [];
      
      if (error.code === 'EAUTH') {
        troubleshooting.push('Check Gmail App Password (must be 16 characters)');
        troubleshooting.push('Verify Gmail email address is correct');
        troubleshooting.push('Ensure 2-factor authentication is enabled');
      } else if (error.code === 'ECONNREFUSED') {
        troubleshooting.push('Check internet connection');
        troubleshooting.push('Verify firewall settings allow SMTP');
      } else if (error.message.includes('timeout')) {
        troubleshooting.push('Connection timeout - check network stability');
      }
      
      return {
        success: false,
        error: error.message,
        troubleshooting: troubleshooting
      };
    }
  }

  // SendGrid fallback service
  async sendOTPFallback(email, name, otp) {
    // This would be implemented if SendGrid API key is available
    console.log('💡 SendGrid fallback not configured');
    console.log('💡 To use SendGrid, set SENDGRID_API_KEY environment variable');
    return false;
  }

  // Comprehensive configuration check
  getConfigurationStatus() {
    const envCheck = this.validateEnvironment();
    const transporterStatus = this.transporter ? 'Initialized' : 'Not Initialized';
    
    return {
      emailService: 'Gmail SMTP',
      configured: this.isConfigured,
      environment: envCheck,
      transporter: transporterStatus,
      hostCompatibility: {
        render: '✅ Compatible (allows outbound SMTP)',
        vercel: '⚠️ Limited (consider SendGrid)',
        heroku: '✅ Compatible (allows outbound SMTP)',
        digitalOcean: '✅ Compatible (allows outbound SMTP)'
      },
      recommendations: [
        'Use Gmail App Password (not regular password)',
        'Enable 2-factor authentication on Gmail account',
        'Check spam/promotions folder for emails',
        'Consider SendGrid for production on Vercel',
        'Monitor email delivery rates'
      ]
    };
  }
}

module.exports = new OTPEmailService();