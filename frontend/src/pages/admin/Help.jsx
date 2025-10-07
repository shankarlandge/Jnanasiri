import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ticketAPI } from '../../utils/api';

const AdminHelp = () => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState('tickets');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  // Fetch tickets and stats on component mount
  useEffect(() => {
    if (user && !authLoading && activeTab === 'tickets') {
      fetchTickets();
      fetchTicketStats();
    }
  }, [user, authLoading, activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getAllTickets();
      console.log('API response:', response);
      // Handle different response structures
      const tickets = response.data?.tickets || response.tickets || [];
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketStats = async () => {
    try {
      const response = await ticketAPI.getTicketStats();
      console.log('Stats response:', response);
      // Handle different response structures
      const stats = response.data || response;
      setTicketStats(stats);
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      setTicketStats({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    try {
      setSubmitting(true);
      
      console.log('Calling createTicket API...');
      const response = await ticketAPI.createTicket(formData);
      console.log('API response:', response);
      
      // Add new ticket to the list
      setTickets(prev => [response.data.ticket, ...prev]);
      
      // Update stats
      setTicketStats(prev => ({
        ...prev,
        total: prev.total + 1,
        open: prev.open + 1
      }));

      // Reset form and close modal
      setFormData({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: ''
      });
      setShowAddModal(false);
      
      // Show success message (you can add a toast notification here)
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      subject: '',
      category: 'general',
      priority: 'medium',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
                <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-primary-600" />
                Help & Support Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage help documentation, support tickets, and student assistance
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('BUTTON CLICKED!');
                setShowAddModal(true);
              }}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{activeTab === 'tickets' ? 'New Ticket' : 'Add FAQ'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Tickets</p>
                <p className="text-2xl font-bold text-neutral-900">{ticketStats.total}</p>
              </div>
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Open Tickets</p>
                <p className="text-2xl font-bold text-neutral-900">{ticketStats.open}</p>
              </div>
              <ExclamationTriangleIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">In Progress</p>
                <p className="text-2xl font-bold text-neutral-900">{ticketStats.inProgress}</p>
              </div>
              <ClockIcon className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Resolved</p>
                <p className="text-2xl font-bold text-neutral-900">{ticketStats.resolved}</p>
              </div>
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="flex border-b border-neutral-200">
            <button 
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'tickets' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Support Tickets
            </button>
            <button 
              onClick={() => setActiveTab('faqs')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'faqs' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              FAQs & Documentation
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'analytics' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Support Tickets</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6"></div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading tickets...</h3>
                  <p className="text-neutral-600">Please wait while we fetch the support tickets.</p>
                </div>
              ) : tickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Ticket #</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Subject</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Created</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-4 px-4 font-mono text-sm text-primary-600">#{ticket.ticketNumber}</td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-neutral-900">{ticket.studentName}</p>
                              <p className="text-sm text-neutral-600">{ticket.studentEmail}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-neutral-900">{ticket.subject}</p>
                            <p className="text-sm text-neutral-600 truncate max-w-xs">{ticket.description}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="capitalize text-sm text-neutral-700">{ticket.category}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              ticket.status === 'open' ? 'bg-orange-100 text-orange-700' :
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-neutral-600">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Add Response"
                              >
                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="w-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No support tickets</h3>
                  <p className="text-neutral-600 mb-6">All students are happy! No support requests at the moment.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create First Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">FAQs & Documentation</h2>
            </div>
            <div className="p-6">
              {faqs.length > 0 ? (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900 mb-2">{faq.question}</h3>
                          <p className="text-neutral-600 text-sm">{faq.answer}</p>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-neutral-500">
                            <span>Category: {faq.category}</span>
                            <span>Views: {faq.views || 0}</span>
                            <span>Updated: {faq.updated_at}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No FAQs created</h3>
                  <p className="text-neutral-600 mb-6">Start building your help documentation</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                  >
                    Create First FAQ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900">Help & Support Analytics</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <QuestionMarkCircleIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-neutral-600">Detailed analytics and reporting for support tickets and help documentation</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Ticket Modal */}
        {(() => {
          console.log('Modal render check - showAddModal:', showAddModal, 'activeTab:', activeTab);
          return showAddModal && activeTab === 'tickets';
        })() && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                  <h3 className="text-2xl font-bold text-neutral-900">Create New Ticket</h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmitTicket} className="mt-6 space-y-6">
                  {/* Subject */}
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Brief description of the issue..."
                      required
                    />
                  </div>

                  {/* Category and Priority Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="general">General</option>
                        <option value="technical">Technical Support</option>
                        <option value="academic">Academic</option>
                        <option value="admission">Admission</option>
                        <option value="payment">Payment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="priority" className="form-label">
                        Priority *
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={6}
                      placeholder="Provide detailed information about the issue..."
                      required
                    ></textarea>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-secondary"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Create Ticket
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHelp;
