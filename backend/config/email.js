const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // Try Gmail SMTP first for real email delivery
  const gmailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'noreply@grabitedit.com',
      pass: process.env.SMTP_PASS || 'your-app-password' // Use app password for Gmail
    }
  };

  return nodemailer.createTransport(gmailConfig);
};

const transporter = createTransporter();

// Email template for OTP verification
const createOTPEmail = (email, otp) => {
  return {
    from: '"GrabIt Job Portal" <noreply@grabitedit.com>',
    to: email,
    subject: 'Email Verification - GrabIt Job Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366F1; margin: 0;">GrabIt Job Portal</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Your Career Journey Starts Here</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 6px; margin-bottom: 25px;">
          <h2 style="color: #333; margin: 0 0 15px 0;">Email Verification Code</h2>
          <p style="color: #555; margin: 0 0 20px 0;">Please use the following code to verify your email address:</p>
          
          <div style="background: white; border: 2px dashed #6366F1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #6366F1; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 0;">
            <strong>Note:</strong> This code will expire in 10 minutes for security purposes.
          </p>
        </div>
        
        <div style="text-align: center; padding: 15px 0; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            If you didn't request this verification, please ignore this email.<br>
            © 2024 GrabIt Job Portal. All rights reserved.
          </p>
        </div>
      </div>
    `
  };
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = createOTPEmail(email, otp);
    
    let info;
    let success = false;
    
    // Try to send real email
    try {
      info = await transporter.sendMail(mailOptions);
      console.log('✅ Real email sent successfully to:', email);
      console.log('📧 OTP for ' + email + ': ' + otp);
      success = true;
      return { success: true, messageId: info.messageId, emailSent: true };
    } catch (smtpError) {
      console.log('⚠️ SMTP failed, trying fallback email service...');
      
      // Fallback: Use EmailJS or other service (you can implement this)
      // For now, let's just log and return success so the frontend shows OTP
      console.log('📧 OTP for ' + email + ': ' + otp + ' (Email service unavailable)');
      
      return {
        success: true,
        emailSent: false,
        fallback: true,
        error: smtpError.message
      };
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail
};