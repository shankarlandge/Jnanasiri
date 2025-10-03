import React, { useState, useEffect } from 'react';
import { publicAPI } from '../../utils/api';
import {
  PhoneIcon,
  EnvelopeIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, searchTerm, filterStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      const response = await publicAPI.getContacts(params);
      const { contacts: contactsData, pagination: paginationData } = response.data || {};

      setContacts(contactsData || []);
      setPagination(prev => ({
        ...prev,
        total: paginationData?.totalItems || 0,
        totalPages: paginationData?.totalPages || 0,
        page: paginationData?.currentPage || 1
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contactId) => {
    try {
      const response = await publicAPI.getContact(contactId);
      setSelectedContact(response.data.contact);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const handleUpdateStatus = async (contactId, status) => {
    try {
      await publicAPI.updateContactStatus(contactId, { status });
      await fetchContacts();
      alert('Contact status updated successfully!');
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Error updating contact status. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      try {
        // Note: We'll need to add this API endpoint in the backend
        await fetch(`http://localhost:3002/api/public/admin/contacts/${contactId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        await fetchContacts();
        alert('Contact deleted successfully!');
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSending(true);
      await publicAPI.respondToContact(selectedContact._id, {
        message: replyText,
        respondedBy: 'admin' // This should come from auth context
      });
      
      setReplyText('');
      setShowReplyModal(false);
      setShowModal(false);
      await fetchContacts();
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'in-progress':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
      case 'resolved':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'closed':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <ClockIcon className="w-4 h-4" />;
      case 'in-progress':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'closed':
        return <XMarkIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const contactStats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    inProgress: contacts.filter(c => c.status === 'in-progress').length,
    resolved: contacts.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-orange-50 to-red-50 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <PhoneIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Contact Management
              </h1>
              <p className="text-neutral-600">
                Handle inquiries and communications from visitors
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="form-input pl-10 w-64 bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-orange-300 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                className="form-select pl-10 bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-orange-300 focus:ring-orange-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Contacts', 
            value: contactStats.total, 
            icon: PhoneIcon,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
          },
          { 
            label: 'New Inquiries', 
            value: contactStats.new, 
            icon: ClockIcon,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          },
          { 
            label: 'In Progress', 
            value: contactStats.inProgress, 
            icon: ChatBubbleLeftRightIcon,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          { 
            label: 'Resolved', 
            value: contactStats.resolved, 
            icon: CheckCircleIcon,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`card p-6 ${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contacts Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-6"></div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading contacts...</h3>
            <p className="text-neutral-600">Please wait while we fetch the contact data.</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mb-6">
              <PhoneIcon className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">No contacts found</h3>
            <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
              Contact inquiries from your website will appear here. Check back later for new messages.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Date Received
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gradient-to-r hover:from-orange-25 hover:to-red-25 transition-all duration-200">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shadow-md">
                              <UserIcon className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-neutral-900">
                              {contact.name}
                            </div>
                            <div className="text-xs text-neutral-600 flex items-center">
                              <EnvelopeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-neutral-900 truncate max-w-xs">
                          {contact.subject}
                        </div>
                        <div className="text-xs text-neutral-500 truncate max-w-xs">
                          {contact.message?.substring(0, 50)}...
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-neutral-900">
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(contact.status || 'new')}`}>
                          {getStatusIcon(contact.status || 'new')}
                          <span className="ml-2 capitalize">{contact.status || 'new'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleViewContact(contact._id)}
                            className="p-2 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {contact.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(contact._id, 'resolved')}
                              className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as Resolved"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Contact"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-700">
                      Showing <span className="font-semibold text-neutral-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-semibold text-neutral-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                      <span className="font-semibold text-neutral-900">{pagination.total}</span> contacts
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                        const page = pagination.page <= 3 ? index + 1 : 
                                    pagination.page + index - 2;
                        return page <= pagination.totalPages ? (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                              pagination.page === page
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'text-neutral-600 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                          >
                            {page}
                          </button>
                        ) : null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <h3 className="text-2xl font-bold text-neutral-900">Contact Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Contact Information */}
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Name</label>
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Email</label>
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Phone</label>
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedContact.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Date Received</label>
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-600">Subject</label>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-600">Message</label>
                  <div className="mt-1 p-4 bg-neutral-50 rounded-xl border">
                    <p className="text-neutral-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-600">Current Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(selectedContact.status || 'new')}`}>
                      {getStatusIcon(selectedContact.status || 'new')}
                      <span className="ml-2 capitalize">{selectedContact.status || 'new'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-neutral-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(true);
                    setShowModal(false);
                  }}
                  className="btn-primary"
                >
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900">Reply to {selectedContact.name}</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="rounded-full p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="mt-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Reply Message
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="form-textarea w-full h-32"
                    placeholder="Type your reply message..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className={`btn-primary ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        Send Reply
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
  );
};

export default AdminContacts;
