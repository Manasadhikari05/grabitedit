const nodemailer = require('nodemailer');

class FallbackEmailService {
  constructor() {
    this.transporter = null;
    this.initializeSendGrid();
  }

  initializeSendGrid() {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️ SendGrid API key not found. Email fallback will not work.');
      return;
    }

    try {
      // SendGrid SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: apiKey
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2'
        }
      });

      console.log('✅ SendGrid transporter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SendGrid transporter:', error);
    }
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  createSendGridEmailTemplate(email, otp, name = 'User') {
    return {
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@grabit.com',
      to: email,
      subject: '🔐 GrabIt - Your Verification Code',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - GrabIt</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px;">
                <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">GrabIt Job Portal</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4f46e5; margin-top: 0;">Hello ${name},</h2>
                
                <p>Your verification code is:</p>
                
                <div style="background: #f8fafc; border: 2px dashed #4f46e5; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #4f46e5; font-family: 'Courier New', monospace;">${otp}</div>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Expires in 5 minutes</p>
                </div>
                
                <p style="color: #6b7280;">Best regards,<br><strong>GrabIt Team</strong></p>
            </div>
        </body>
        </html>
      `,
      text: `Hello ${name},\n\nYour verification code is: ${otp}\nExpires in 5 minutes.\n\nBest regards,\nGrabIt Team`
    };
  }

  async sendOTP(email, name = 'User') {
    try {
      const otp = this.generateOTP();

      if (!this.transporter) {
        throw new Error('SendGrid transporter not configured');
      }

      const mailOptions = this.createSendGridEmailTemplate(email, otp, name);
      
      console.log('🚀 Sending email via SendGrid fallback...');
      const info = await this.transporter.sendMail(mailOptions);

      console.log('✅ SendGrid email sent successfully!');
      console.log(`📧 Message ID: ${info.messageId}`);

      return {
        success: true,
        otp: otp,
        messageId: info.messageId,
        provider: 'SendGrid',
        emailSent: true,
        message: 'OTP sent successfully via SendGrid'
      };

    } catch (error) {
      console.error('❌ SendGrid send error:', error);
      
      return {
        success: false,
        error: error.message,
        provider: 'SendGrid',
        message: 'SendGrid sending failed'
      };
    }
  }
}

module.exports = new FallbackEmailService();