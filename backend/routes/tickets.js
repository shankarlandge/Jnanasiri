import express from 'express';
import Ticket from '../models/Ticket.js';
import { authenticate as auth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all tickets (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { page = 1, limit = 10, status, priority, category } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .populate('studentId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('responses.author', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tickets for specific student
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter object
    const filter = { studentId: req.user.id };
    if (status) filter.status = status;

    const tickets = await Ticket.find(filter)
      .populate('assignedTo', 'firstName lastName')
      .populate('responses.author', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ticket
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('studentId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('responses.author', 'firstName lastName role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can view this ticket
    if (req.user.role !== 'admin' && ticket.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new ticket
router.post('/', [
  auth,
  body('subject').notEmpty().withMessage('Subject is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['technical', 'academic', 'admission', 'payment', 'general', 'other']).withMessage('Invalid category'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { subject, description, category, priority } = req.body;

    const ticket = new Ticket({
      studentId: req.user.id,
      studentName: `${req.user.firstName} ${req.user.lastName}`,
      studentEmail: req.user.email,
      subject,
      description,
      category,
      priority
    });

    await ticket.save();

    // Populate the saved ticket for response
    await ticket.populate('studentId', 'firstName lastName email');
    
    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket status (Admin only)
router.patch('/:id/status', [
  auth,
  body('status').isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    if (status === 'resolved') {
      ticket.resolvedBy = req.user.id;
    }

    await ticket.save();
    await ticket.populate('studentId', 'firstName lastName email');
    await ticket.populate('assignedTo', 'firstName lastName');

    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add response to ticket
router.post('/:id/responses', [
  auth,
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can respond to this ticket
    if (req.user.role !== 'admin' && ticket.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const response = {
      author: req.user.id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      message,
      isStaffResponse: req.user.role === 'admin'
    };

    ticket.responses.push(response);
    await ticket.save();

    await ticket.populate('responses.author', 'firstName lastName role');

    res.status(201).json({
      message: 'Response added successfully',
      response: ticket.responses[ticket.responses.length - 1]
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign ticket to staff (Admin only)
router.patch('/:id/assign', [
  auth,
  body('assignedTo').notEmpty().withMessage('Assigned user ID is required')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.assignedTo = assignedTo;
    await ticket.save();
    await ticket.populate('assignedTo', 'firstName lastName');

    res.json({
      message: 'Ticket assigned successfully',
      ticket
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ticket statistics (Admin only)
router.get('/stats/summary', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

    // Priority breakdown
    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Category breakdown
    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      priorityBreakdown: priorityStats,
      categoryBreakdown: categoryStats
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
