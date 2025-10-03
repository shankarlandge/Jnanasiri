import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['admission', 'contact', 'system', 'security', 'payment']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Admission', 'Contact', 'User', 'Gallery']
  },
  actionUrl: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ userId: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;