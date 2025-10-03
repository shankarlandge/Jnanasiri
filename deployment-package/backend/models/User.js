import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    required: [true, 'Role is required']
  },
  // Student specific fields
  student_id: {
    type: String,
    sparse: true, // Only unique if not null
    match: [/^STU\d{4}$/, 'Invalid student ID format']
  },
  name: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobile: {
    type: String,
    required: function() { return this.role === 'student'; },
    match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  bloodGroup: {
    type: String,
    required: function() { return this.role === 'student'; },
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  standard: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true
  },
  photo: {
    url: {
      type: String,
      required: false  // Made optional to support existing students
    },
    public_id: {
      type: String,
      required: false  // Made optional to support existing students
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  // Additional student fields
  dateOfBirth: {
    type: Date,
    required: false  // Made optional to support existing students
  },
  address: {
    type: String,
    required: false,  // Made optional to support existing students
    trim: true
  },
  emergencyContact: {
    name: {
      type: String,
      required: false,  // Made optional to support existing students
      trim: true
    },
    relationship: {
      type: String,
      required: false,  // Made optional to support existing students
      trim: true
    },
    phone: {
      type: String,
      required: false,  // Made optional to support existing students
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    }
  },
  // Settings
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    academicUpdates: { type: Boolean, default: true },
    examReminders: { type: Boolean, default: true },
    feeReminders: { type: Boolean, default: true },
    generalAnnouncements: { type: Boolean, default: true }
  },
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'limited', 'private'], default: 'private' },
    contactVisibility: { type: String, enum: ['public', 'limited', 'private'], default: 'limited' },
    academicInfoVisibility: { type: String, enum: ['public', 'limited', 'private'], default: 'private' }
  },
  // Password reset OTP fields
  resetPasswordOTP: {
    type: String,
    select: false // Don't include in queries by default
  },
  resetPasswordOTPExpires: {
    type: Date,
    select: false // Don't include in queries by default
  },
  resetPasswordToken: {
    type: String,
    select: false // Don't include in queries by default
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Method to get public profile (excluding sensitive data)
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.resetPasswordOTP;
  delete user.resetPasswordOTPExpires;
  delete user.resetPasswordToken;
  return user;
};

// Method to generate and set OTP for password reset
userSchema.methods.generateResetPasswordOTP = function() {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set OTP and expiration (5 minutes from now)
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpires = new Date(Date.now() + 5 * 60 * 1000);
  
  return otp;
};

// Method to verify OTP and generate reset token
userSchema.methods.verifyResetPasswordOTP = function(otp) {
  if (!this.resetPasswordOTP || !this.resetPasswordOTPExpires) {
    return { success: false, message: 'No OTP found. Please request a new one.' };
  }
  
  if (new Date() > this.resetPasswordOTPExpires) {
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }
  
  if (this.resetPasswordOTP !== otp) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }
  
  // Generate reset token (valid for 15 minutes)
  const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
  this.resetPasswordToken = resetToken;
  
  // Clear OTP fields
  this.resetPasswordOTP = undefined;
  this.resetPasswordOTPExpires = undefined;
  
  return { success: true, resetToken };
};

// Method to verify reset token and reset password
userSchema.methods.resetPasswordWithToken = function(token, newPassword) {
  if (!this.resetPasswordToken || this.resetPasswordToken !== token) {
    return { success: false, message: 'Invalid or expired reset token.' };
  }
  
  // Reset password
  this.password = newPassword;
  this.resetPasswordToken = undefined;
  
  return { success: true };
};

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ student_id: 1 });
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);
