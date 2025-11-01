const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const createTransporter = () => {
  // For development, we'll use a test account
  // In production, you would use your actual SMTP credentials
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // For development, use Ethereal for testing
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal_user@ethereal.email", // This will be replaced with actual user
        pass: "ethereal_pass" // This will be replaced with actual pass
      }
    });
  }
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
    
    if (process.env.NODE_ENV === 'development') {
      // Create a test account for development
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      info = await testTransporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Email Preview URL: ' + previewUrl);
      console.log('📧 OTP for ' + email + ': ' + otp);
      return { success: true, previewUrl };
    } else {
      // Production email sending
      info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error, just log it so the OTP verification can still work
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail
};