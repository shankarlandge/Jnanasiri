import express from 'express';
import User from '../models/User.js';
import Admission from '../models/Admission.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin, handleValidationErrors } from '../middleware/validation.js';
import { generateJWTToken, sendSuccess, sendError } from '../utils/helpers.js';
import { sendPasswordResetOTP } from '../utils/email.js';

const router = express.Router();

// Admin login
router.post('/admin/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate token
    const token = generateJWTToken(admin._id, admin.role);
    
    sendSuccess(res, {
      token,
      user: admin.getPublicProfile()
    }, 'Admin login successful');
    
  } catch (error) {
    console.error('Admin login error:', error);
    sendError(res, 'Login failed', 500);
  }
});

// Student login
router.post('/student/login', async (req, res) => {
  try {
    const { studentId, email, password } = req.body;
    
    // Validate input
    if (!password || (!studentId && !email)) {
      return sendError(res, 'Student ID/Email and password are required', 400);
    }
    
    // Find student - first try by student_id, then by email
    let student = null;
    if (studentId) {
      student = await User.findOne({ student_id: studentId, role: 'student' });
    } else if (email) {
      student = await User.findOne({ email, role: 'student' });
    }
    
    if (!student) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Check if student account is active
    if (!student.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact administration.', 403);
    }
    
    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }
    
    // Update last login
    student.lastLogin = new Date();
    await student.save();
    
    // Generate token
    const token = generateJWTToken(student._id, student.role);
    
    sendSuccess(res, {
      token,
      user: student.getPublicProfile()
    }, 'Student login successful');
    
  } catch (error) {
    console.error('Student login error:', error);
    sendError(res, 'Login failed', 500);
  }
});

// Verify token and get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    sendSuccess(res, {
      user: req.user.getPublicProfile()
    }, 'User data retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    sendError(res, 'Failed to get user data', 500);
  }
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticate, async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Logout failed', 500);
  }
});

// Change password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', 400);
    }
    
    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return sendError(res, 'Current password is incorrect', 401);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    sendSuccess(res, null, 'Password changed successfully');
    
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 'Failed to change password', 500);
  }
});

// Get authentication stats (admin only)
router.get('/stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return sendError(res, 'Access denied', 403);
    }
    
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const recentLogins = await User.countDocuments({ 
      role: 'student', 
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });
    
    sendSuccess(res, {
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
      recentLogins
    }, 'Authentication stats retrieved successfully');
    
  } catch (error) {
    console.error('Get auth stats error:', error);
    sendError(res, 'Failed to get authentication stats', 500);
  }
});

// Forgot password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, userType } = req.body;
    
    if (!email || !userType) {
      return sendError(res, 'Email and user type are required', 400);
    }
    
    if (!['student', 'admin'].includes(userType)) {
      return sendError(res, 'Invalid user type', 400);
    }
    
    // Find user by email and role
    const user = await User.findOne({ email, role: userType }).select('+resetPasswordOTP +resetPasswordOTPExpires');
    
    // Temporary debug logging (remove in production)
    console.log(`🔍 Password reset attempt: ${email} (${userType}) - User ${user ? 'found' : 'not found'}`);
    
    if (!user) {
      // Don't reveal if email exists - security best practice
      return sendSuccess(res, null, 'If this email exists in our system, you will receive a verification code');
    }
    
    // Check if user account is active (for students)
    if (userType === 'student' && !user.isActive) {
      return sendError(res, 'Account is deactivated. Please contact administration', 403);
    }
    
    // Generate OTP
    const otp = user.generateResetPasswordOTP();
    await user.save();
    
    // Send OTP email
    try {
      await sendPasswordResetOTP(email, user.name || 'User', otp, userType);
      sendSuccess(res, null, 'Verification code sent to your email');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Clear OTP if email fails
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();
      sendError(res, 'Failed to send verification email. Please try again', 500);
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    sendError(res, 'Failed to process password reset request', 500);
  }
});

// Verify OTP and generate reset token
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, userType } = req.body;
    
    if (!email || !otp || !userType) {
      return sendError(res, 'Email, OTP, and user type are required', 400);
    }
    
    if (!['student', 'admin'].includes(userType)) {
      return sendError(res, 'Invalid user type', 400);
    }
    
    // Find user with OTP fields
    const user = await User.findOne({ email, role: userType }).select('+resetPasswordOTP +resetPasswordOTPExpires +resetPasswordToken');
    if (!user) {
      return sendError(res, 'Invalid request', 400);
    }
    
    // Verify OTP
    const verificationResult = user.verifyResetPasswordOTP(otp);
    if (!verificationResult.success) {
      return sendError(res, verificationResult.message, 400);
    }
    
    // Save user with reset token
    await user.save();
    
    sendSuccess(res, { 
      resetToken: verificationResult.resetToken 
    }, 'OTP verified successfully');
    
  } catch (error) {
    console.error('OTP verification error:', error);
    sendError(res, 'Failed to verify OTP', 500);
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password, resetToken, userType } = req.body;
    
    if (!email || !password || !resetToken || !userType) {
      return sendError(res, 'All fields are required', 400);
    }
    
    if (!['student', 'admin'].includes(userType)) {
      return sendError(res, 'Invalid user type', 400);
    }
    
    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters long', 400);
    }
    
    // Password strength validation
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return sendError(res, 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 400);
    }
    
    // Find user with reset token
    const user = await User.findOne({ email, role: userType }).select('+resetPasswordToken');
    if (!user) {
      return sendError(res, 'Invalid request', 400);
    }
    
    // Reset password
    const resetResult = user.resetPasswordWithToken(resetToken, password);
    if (!resetResult.success) {
      return sendError(res, resetResult.message, 400);
    }
    
    // Save user
    await user.save();
    
    sendSuccess(res, null, 'Password reset successfully. You can now login with your new password');
    
  } catch (error) {
    console.error('Reset password error:', error);
    sendError(res, 'Failed to reset password', 500);
  }
});

export default router;
