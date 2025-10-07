import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // General Settings
  siteName: {
    type: String,
    required: true,
    default: 'Jnana Siri LMS',
    trim: true,
    maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  siteDescription: {
    type: String,
    default: 'Learning Management System',
    trim: true,
    maxlength: [500, 'Site description cannot exceed 500 characters']
  },
  adminEmail: {
    type: String,
    required: true,
    default: 'admin@janasiri.edu',
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  contactPhone: {
    type: String,
    default: '+91-XXXXXXXXXX',
    trim: true,
    maxlength: [20, 'Contact phone cannot exceed 20 characters']
  },
  address: {
    type: String,
    default: 'Your Institution Address',
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  timeZone: {
    type: String,
    default: 'Asia/Kolkata',
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },

  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  weeklyReports: {
    type: Boolean,
    default: true
  },

  // System Settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  debugMode: {
    type: Boolean,
    default: false
  },
  backupFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  logLevel: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    default: 'info'
  },
  cacheEnabled: {
    type: Boolean,
    default: true
  },

  // Security Settings
  requireEmailVerification: {
    type: Boolean,
    default: true
  },
  enableTwoFactor: {
    type: Boolean,
    default: false
  },
  passwordExpiry: {
    type: Number,
    default: 90,
    min: [30, 'Password expiry cannot be less than 30 days'],
    max: [365, 'Password expiry cannot exceed 365 days']
  },
  maxLoginAttempts: {
    type: Number,
    default: 5,
    min: [3, 'Max login attempts cannot be less than 3'],
    max: [10, 'Max login attempts cannot exceed 10']
  },
  sessionTimeout: {
    type: Number,
    default: 24,
    min: [1, 'Session timeout cannot be less than 1 hour'],
    max: [168, 'Session timeout cannot exceed 168 hours (1 week)']
  },

  // Metadata
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updateData, userId) {
  const settings = await this.getSettings();
  
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined && updateData[key] !== null) {
      settings[key] = updateData[key];
    }
  });

  settings.lastUpdatedBy = userId;
  settings.lastUpdatedAt = new Date();
  
  return await settings.save();
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;