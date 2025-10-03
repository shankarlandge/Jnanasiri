import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Email Configuration...\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('Email Configuration:');
console.log('- Host:', process.env.EMAIL_HOST);
console.log('- Port:', process.env.EMAIL_PORT);
console.log('- User:', process.env.EMAIL_USER);
console.log('- Password:', process.env.EMAIL_PASS ? 'Present' : 'Missing');
console.log('- From:', process.env.EMAIL_FROM);
console.log('');

// Test transporter connection
console.log('Testing SMTP connection...');
try {
  await transporter.verify();
  console.log('✅ SMTP connection successful!');
} catch (error) {
  console.log('❌ SMTP connection failed:', error.message);
  process.exit(1);
}

// Test sending a sample OTP email
console.log('\nSending test OTP email...');
const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
const otp = '123456';

const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .otp-box { background: white; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; border: 2px dashed #667eea; }
      .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 15px 0; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔐 TEST - Password Reset Verification</h1>
        <p style="margin: 10px 0; opacity: 0.9;">Janashiri Institute - Email Test</p>
      </div>
      <div class="content">
        <p>This is a <strong>TEST EMAIL</strong> to verify that the email service is working correctly.</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #666; font-size: 14px;">Test Verification Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 0; color: #666; font-size: 12px;">This is a test OTP</p>
        </div>
        
        <p>If you received this email, the SMTP configuration is working properly!</p>
        
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>Host: ${process.env.EMAIL_HOST}</li>
          <li>Port: ${process.env.EMAIL_PORT}</li>
          <li>User: ${process.env.EMAIL_USER}</li>
          <li>TLS: Enabled</li>
        </ul>
      </div>
    </div>
  </body>
  </html>
`;

const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: testEmail,
  subject: '🧪 TEST - OTP Email Configuration Check',
  html: htmlContent
};

try {
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Test email sent successfully!');
  console.log('- Message ID:', info.messageId);
  console.log('- Preview URL:', nodemailer.getTestMessageUrl(info));
  console.log('- Recipient:', testEmail);
  console.log('\nCheck your inbox for the test email.');
} catch (error) {
  console.log('❌ Failed to send test email:', error.message);
  console.log('Full error:', error);
}

console.log('\n🔍 Troubleshooting Tips:');
console.log('1. Check that Gmail "App Passwords" is enabled');
console.log('2. Verify the app password is correct');
console.log('3. Make sure 2FA is enabled on Gmail account');
console.log('4. Check spam/junk folder');
console.log('5. Verify Gmail account is not suspended');

process.exit(0);