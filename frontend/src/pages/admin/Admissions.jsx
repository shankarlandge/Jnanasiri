import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  UserIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  TrashIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

// Safe image component with error handling
const SafeImage = ({ src, alt, className, fallbackComponent }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  useEffect(() => {
    setHasError(false);
    setIsLoading(!!src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    // Silently handle image loading errors
    setHasError(true);
    setIsLoading(false);
  };

  // Show fallback if no src, has error, or if src is invalid
  if (!src || hasError) {
    return fallbackComponent;
  }

  return (
    <>
      {isLoading && fallbackComponent}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAdmissions();
  }, [searchTerm, statusFilter]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      console.log('Fetching admissions...');
      const response = await adminAPI.getAdmissions();
      console.log('Admissions response:', response.data);
      setAdmissions(response.data.admissions || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setAdmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAdmission = async (admissionId, status) => {
    try {
      const action = status === 'approved' ? 'accept' : 'reject';
      
      let requestData = {
        admissionId,
        action
      };
      
      // If rejecting, add a rejection reason
      if (action === 'reject') {
        const reason = prompt('Please provide a reason for rejection (minimum 10 characters):');
        if (!reason || reason.trim().length < 10) {
          alert('Rejection reason is required and must be at least 10 characters long.');
          return;
        }
        requestData.rejectionReason = reason.trim();
      }
      
      await adminAPI.processAdmission(requestData);
      
      await fetchAdmissions();
      setShowModal(false);
      setSelectedAdmission(null);
      
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error processing admission:', error);
      alert('Error processing admission. Please try again.');
    }
  };

  const handleDeleteAdmission = async (admissionId) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await adminAPI.deleteAdmission(admissionId);
        await fetchAdmissions();
        alert('Admission deleted successfully!');
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert('Error deleting admission. Please try again.');
      }
    }
  };

  const handleViewDetails = async (admissionId) => {
    try {
      const response = await adminAPI.getAdmission(admissionId);
      if (response.data && response.data.admission) {
        setSelectedAdmission(response.data.admission);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching admission details:', error);
      alert('Error loading admission details.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'approved':
        return CheckCircleIcon;
      case 'rejected':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    const matchesSearch = searchTerm === '' || 
      admission.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || admission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-orange-50 to-red-50 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Admissions Management
              </h1>
              <p className="text-neutral-600">
                Review and process student admission applications
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search applications..."
                className="form-input pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                className="form-select pl-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 bg-blue-50 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <DocumentArrowDownIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {filteredAdmissions.length}
            </div>
            <div className="text-sm text-neutral-600">Total Applications</div>
          </div>
        </div>

        <div className="card p-6 bg-yellow-50 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {filteredAdmissions.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-neutral-600">Pending Review</div>
          </div>
        </div>

        <div className="card p-6 bg-green-50 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {filteredAdmissions.filter(a => a.status === 'approved').length}
            </div>
            <div className="text-sm text-neutral-600">Approved</div>
          </div>
        </div>

        <div className="card p-6 bg-red-50 border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              {filteredAdmissions.filter(a => a.status === 'rejected').length}
            </div>
            <div className="text-sm text-neutral-600">Rejected</div>
          </div>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="card overflow-hidden bg-white shadow-xl">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-6"></div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Loading admissions...</h3>
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="p-12 text-center">
            <AcademicCapIcon className="h-12 w-12 text-neutral-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">No admissions found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Student Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Personal Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Course & Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {filteredAdmissions.map((admission) => {
                  const StatusIcon = getStatusIcon(admission.status);
                  return (
                    <tr key={admission._id} className="hover:bg-neutral-50 transition-colors">
                      
                      {/* Student Information */}
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <SafeImage
                              src={admission.photo?.url}
                              alt={admission.firstName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                              fallbackComponent={
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                  <UserIcon className="w-6 h-6 text-orange-600" />
                                </div>
                              }
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-neutral-900 mb-1">
                              {admission.firstName} {admission.lastName}
                            </div>
                            <div className="text-xs text-neutral-600 flex items-center mb-1">
                              <EnvelopeIcon className="w-3 h-3 mr-1" />
                              {admission.email}
                            </div>
                            <div className="text-xs text-neutral-600 flex items-center">
                              <PhoneIcon className="w-3 h-3 mr-1" />
                              {admission.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Personal Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-xs text-neutral-600">
                            <span className="font-medium">Age:</span> {
                              admission.dateOfBirth ? 
                              Math.floor((new Date() - new Date(admission.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : 
                              'N/A'
                            } years
                          </div>
                          <div className="text-xs text-neutral-600">
                            <span className="font-medium">Gender:</span> {admission.gender}
                          </div>
                          <div className="text-xs text-neutral-600">
                            <span className="font-medium">Blood:</span> {admission.bloodGroup}
                          </div>
                          <div className="text-xs text-neutral-600">
                            <span className="font-medium">City:</span> {admission.city}, {admission.state}
                          </div>
                        </div>
                      </td>

                      {/* Course & Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                              <AcademicCapIcon className="w-3 h-3 mr-1" />
                              {admission.course}
                            </span>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(admission.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Application Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">
                          {new Date(admission.submittedAt || admission.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {new Date(admission.submittedAt || admission.createdAt).toLocaleTimeString()}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDetails(admission._id)}
                            className="px-3 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50"
                          >
                            <EyeIcon className="w-3 h-3 inline mr-1" />
                            View
                          </button>
                          
                          {/* Action Buttons based on status */}
                          {admission.status === 'pending' ? (
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => handleProcessAdmission(admission._id, 'approved')}
                                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                              >
                                <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleProcessAdmission(admission._id, 'rejected')}
                                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                              >
                                <XCircleIcon className="w-3 h-3 inline mr-1" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmission(admission._id)}
                              className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                            >
                              <TrashIcon className="w-3 h-3 inline mr-1" />
                              Delete
                            </button>
                          )}
                          
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {showModal && selectedAdmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full m-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Admission Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedAdmission.firstName} {selectedAdmission.lastName}</p>
                      <p><span className="font-medium">Email:</span> {selectedAdmission.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedAdmission.phone}</p>
                      <p><span className="font-medium">Gender:</span> {selectedAdmission.gender}</p>
                      <p><span className="font-medium">Blood Group:</span> {selectedAdmission.bloodGroup}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Academic Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Course:</span> {selectedAdmission.course}</p>
                      <p><span className="font-medium">Previous School:</span> {selectedAdmission.previousSchool}</p>
                      <p><span className="font-medium">Previous Percentage:</span> {selectedAdmission.previousPercentage}%</p>
                      <p><span className="font-medium">Address:</span> {selectedAdmission.address}</p>
                      <p><span className="font-medium">City:</span> {selectedAdmission.city}, {selectedAdmission.state}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Close
                  </button>
                  
                  {selectedAdmission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleProcessAdmission(selectedAdmission._id, 'approved')}
                        className="btn-primary bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProcessAdmission(selectedAdmission._id, 'rejected')}
                        className="btn-primary bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;
