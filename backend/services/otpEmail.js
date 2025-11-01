const nodemailer = require('nodemailer');

class OTPEmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Create transporter with Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  createOTPEmailTemplate(email, otp, name = 'User') {
    return {
      from: `"GrabIt Job Portal" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: '🔐 Your OTP Verification Code - GrabIt Job Portal',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification - GrabIt Job Portal</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 300;
                }
                .header p {
                    margin: 10px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .otp-container {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                    border: 2px dashed #667eea;
                }
                .otp-label {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: bold;
                    color: #667eea;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 8px;
                    margin: 10px 0;
                }
                .instructions {
                    color: #555;
                    line-height: 1.6;
                    margin: 20px 0;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-size: 14px;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #eee;
                }
                .button {
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 OTP Verification</h1>
                    <p>Your secure access code for GrabIt Job Portal</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${name}!</h2>
                    
                    <p>Thank you for registering with GrabIt Job Portal. To complete your registration, please verify your email address using the OTP code below:</p>
                    
                    <div class="otp-container">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <p style="color: #667eea; font-weight: bold;">This code expires in 5 minutes</p>
                    </div>
                    
                    <div class="instructions">
                        <h3>How to use this code:</h3>
                        <ol>
                            <li>Go back to the registration page</li>
                            <li>Enter this 6-digit code in the verification field</li>
                            <li>Click "Verify OTP" to complete your registration</li>
                        </ol>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        • This code is only valid for 5 minutes<br>
                        • Never share this code with anyone<br>
                        • If you didn't request this code, please ignore this email<br>
                        • For security reasons, never enter this code on untrusted websites
                    </div>
                    
                    <p>If you're having trouble with the verification process, please contact our support team.</p>
                    
                    <p>Best regards,<br>
                    <strong>GrabIt Job Portal Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>This email was sent to ${email}</p>
                    <p>© 2024 GrabIt Job Portal. All rights reserved.</p>
                    <p>Find your dream job with us!</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name}!

        Thank you for registering with GrabIt Job Portal. To complete your registration, please verify your email address using the OTP code below:

        Your Verification Code: ${otp}

        This code expires in 5 minutes.

        How to use this code:
        1. Go back to the registration page
        2. Enter this 6-digit code in the verification field  
        3. Click "Verify OTP" to complete your registration

        Security Notice:
        • This code is only valid for 5 minutes
        • Never share this code with anyone
        • If you didn't request this code, please ignore this email
        • For security reasons, never enter this code on untrusted websites

        Best regards,
        GrabIt Job Portal Team

        This email was sent to ${email}
        © 2024 GrabIt Job Portal. All rights reserved.
      `
    };
  }

  async sendOTP(email, name = 'User') {
    try {
      const otp = this.generateOTP();
      
      // Always try to send email if credentials are configured
      if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
        try {
          const mailOptions = this.createOTPEmailTemplate(email, otp, name);
          console.log('🔄 Attempting to send OTP email...');
          const info = await this.transporter.sendMail(mailOptions);
          
          console.log('✅ OTP email sent successfully!');
          console.log(`📧 Message ID: ${info.messageId}`);
          console.log(`📧 To: ${email}`);
          console.log(`🔢 OTP: ${otp}`);
          
          return {
            success: true,
            otp: otp,
            messageId: info.messageId,
            emailSent: true,
            message: 'OTP sent successfully to your email'
          };
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
          // Continue with fallback even if email fails
        }
      } else {
        console.log('⚠️ Gmail credentials not configured, using fallback mode');
      }

      // Fallback: return OTP for testing when email fails or credentials missing
      console.log('📧 OTP for testing:', otp);
      
      return {
        success: true,
        otp: otp,
        emailSent: false,
        message: 'OTP generated (Email service unavailable)'
      };

    } catch (error) {
      console.error('❌ Error in OTP service:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate OTP'
      };
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection successful');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

module.exports = new OTPEmailService();