import React, { useState } from 'react';
import { admissionAPI } from '../utils/api';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilSquareIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import AdmissionForm from './AdmissionForm';

const AdmissionStatus = () => {
  const [email, setEmail] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setApplicationData(null);
    setStatusData(null);

    try {
      // First get the status
      const statusResponse = await admissionAPI.getStatus(email);
      setStatusData(statusResponse.data);
    } catch (error) {
      console.error('Error fetching status:', error);
      setError(error.message || 'No application found for this email address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditApplication = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await admissionAPI.getApplication(email);
      setApplicationData(response.data);
      setIsEditMode(true);
    } catch (error) {
      console.error('Error fetching application:', error);
      setError(error.message || 'Unable to load application for editing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await admissionAPI.getApplication(email);
      setApplicationData(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      setError(error.message || 'Unable to load application details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplete = () => {
    setIsEditMode(false);
    setApplicationData(null);
    setShowDetails(false);
    // Refresh status after update
    handleEmailSubmit({ preventDefault: () => {} });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-8 h-8 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-8 h-8 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-8 h-8 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If editing mode, show the admission form with pre-filled data
  if (isEditMode && applicationData) {
    return (
      <EditableAdmissionForm 
        applicationData={applicationData} 
        email={email}
        onUpdateComplete={handleUpdateComplete}
        onCancel={() => setIsEditMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Compact */}
      <section className="bg-gradient-to-br from-primary-600/90 to-secondary-600/90 py-12">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <DocumentTextIcon className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Admission Status
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Check and edit your admission application
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Email Input Form */}
          <div className="card mb-8">
            <div className="card-body">
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Check Your Application Status
                  </h2>
                  <p className="text-neutral-600">
                    Enter the email address you used for your admission application
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="alert-error">
                    <div className="flex items-start space-x-3">
                      <ExclamationCircleIcon className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="loading mr-3"></div>
                      Checking Status...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                      Check Status
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Status Results */}
          {statusData && (
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-8">
                  <div className="mb-6">
                    {getStatusIcon(statusData.status)}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Application Found!
                  </h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getStatusColor(statusData.status)}`}>
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      Status: {statusData.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600 mb-1">Submitted On</p>
                      <p className="font-semibold text-neutral-900">
                        {formatDate(statusData.submittedAt)}
                      </p>
                    </div>
                    {statusData.processedAt && (
                      <div className="text-center p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600 mb-1">Processed On</p>
                        <p className="font-semibold text-neutral-900">
                          {formatDate(statusData.processedAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {statusData.student_id && (
                    <div className="alert-success">
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">
                            Congratulations! Your application has been approved.
                          </h4>
                          <p className="text-sm text-green-700">
                            Your Student ID is: <span className="font-mono font-bold">{statusData.student_id}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {statusData.status === 'pending' && (
                    <div className="alert-info">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">Your application is under review</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• We will review your application within 2-3 business days</li>
                            <li>• You will be notified via email once processed</li>
                            <li>• You can edit your application anytime before it's processed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleViewDetails}
                    disabled={isLoading}
                    className="btn-outline flex items-center justify-center"
                  >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    View Details
                  </button>
                  
                  {statusData.status === 'pending' && (
                    <button
                      onClick={handleEditApplication}
                      disabled={isLoading}
                      className="btn-primary flex items-center justify-center"
                    >
                      <PencilSquareIcon className="w-5 h-5 mr-2" />
                      Edit Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Application Details Modal */}
          {showDetails && applicationData && (
            <ApplicationDetailsModal 
              applicationData={applicationData}
              onClose={() => {
                setShowDetails(false);
                setApplicationData(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Component for showing application details
const ApplicationDetailsModal = ({ applicationData, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900">Application Details</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Name:</span> {applicationData.firstName} {applicationData.lastName}</div>
              <div><span className="font-medium">Date of Birth:</span> {formatDate(applicationData.dateOfBirth)}</div>
              <div><span className="font-medium">Gender:</span> {applicationData.gender || 'Not specified'}</div>
              <div><span className="font-medium">Blood Group:</span> {applicationData.bloodGroup || 'Not specified'}</div>
              <div><span className="font-medium">Nationality:</span> {applicationData.nationality || 'Not specified'}</div>
              <div><span className="font-medium">Email:</span> {applicationData.email}</div>
              <div><span className="font-medium">Phone:</span> {applicationData.phone}</div>
              <div><span className="font-medium">Course:</span> {applicationData.course}</div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Address</h4>
            <div className="text-sm space-y-2">
              <div>{applicationData.address}</div>
              <div>{applicationData.city}, {applicationData.state} - {applicationData.pincode}</div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Academic Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Previous School:</span> {applicationData.previousSchool || 'Not specified'}</div>
              <div><span className="font-medium">Board of Study:</span> {applicationData.boardOfStudy || 'Not specified'}</div>
              <div><span className="font-medium">Year of Passing:</span> {applicationData.yearOfPassing || 'Not specified'}</div>
              <div><span className="font-medium">Percentage:</span> {applicationData.previousPercentage ? `${applicationData.previousPercentage}%` : 'Not specified'}</div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Parent/Guardian Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Father's Name:</span> {applicationData.fatherName || 'Not specified'}</div>
              <div><span className="font-medium">Father's Occupation:</span> {applicationData.fatherOccupation || 'Not specified'}</div>
              <div><span className="font-medium">Mother's Name:</span> {applicationData.motherName || 'Not specified'}</div>
              <div><span className="font-medium">Mother's Occupation:</span> {applicationData.motherOccupation || 'Not specified'}</div>
              <div><span className="font-medium">Guardian Phone:</span> {applicationData.guardianPhone || 'Not specified'}</div>
            </div>
          </div>

          {/* Documents */}
          {applicationData.documents && applicationData.documents.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">Uploaded Documents</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 capitalize">{doc.type}</p>
                      <p className="text-xs text-neutral-600">{doc.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-neutral-50">
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for editing application
const EditableAdmissionForm = ({ applicationData, email, onUpdateComplete, onCancel }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container text-center">
          <PencilSquareIcon className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Edit Your Application</h1>
          <p className="text-xl text-white/90">
            Update your admission application details
          </p>
        </div>
      </section>

      {/* Edit Form */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="alert-info mb-8">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Editing Application</h4>
                <p className="text-sm text-blue-700">
                  You are editing the application for <span className="font-mono">{email}</span>. 
                  Only applications with "pending" status can be edited.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button onClick={onCancel} className="btn-outline">
              Cancel Edit
            </button>
          </div>

          <AdmissionEditForm 
            initialData={applicationData}
            email={email}
            onSuccess={onUpdateComplete}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

// Separate component for the actual edit form
const AdmissionEditForm = ({ initialData, email, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
    gender: initialData.gender || '',
    bloodGroup: initialData.bloodGroup || '',
    nationality: initialData.nationality || '',
    phone: initialData.phone || '',
    alternatePhone: initialData.alternatePhone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pincode: initialData.pincode || '',
    course: initialData.course || '',
    previousSchool: initialData.previousSchool || '',
    previousPercentage: initialData.previousPercentage || '',
    boardOfStudy: initialData.boardOfStudy || '',
    yearOfPassing: initialData.yearOfPassing || '',
    fatherName: initialData.fatherName || '',
    fatherOccupation: initialData.fatherOccupation || '',
    motherName: initialData.motherName || '',
    motherOccupation: initialData.motherOccupation || '',
    guardianPhone: initialData.guardianPhone || '',
    extracurricular: initialData.extracurricular || '',
    medicalHistory: initialData.medicalHistory || '',
    specialRequirements: initialData.specialRequirements || ''
  });

  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const courses = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare form data for submission
      const submissionData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          submissionData.append(key, formData[key]);
        }
      });
      
      // Add files
      Object.keys(files).forEach(fileType => {
        if (files[fileType]) {
          submissionData.append(fileType, files[fileType]);
        }
      });
      
      // Submit to API
      await admissionAPI.updateApplication(email, submissionData);
      
      // Show success and redirect
      alert('Application updated successfully!');
      onSuccess();
      
    } catch (error) {
      console.error('Error updating admission:', error);
      setError(error.message || 'Failed to update application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="alert-error">
              <div className="flex items-start space-x-3">
                <ExclamationCircleIcon className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Indian"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alternate Phone</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                required
              ></textarea>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pin Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Academic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Course Applied For *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Previous School/College</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Percentage/CGPA</label>
                <input
                  type="text"
                  name="previousPercentage"
                  value={formData.previousPercentage}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Board of Study</label>
                <input
                  type="text"
                  name="boardOfStudy"
                  value={formData.boardOfStudy}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Year of Passing</label>
                <input
                  type="number"
                  name="yearOfPassing"
                  value={formData.yearOfPassing}
                  onChange={handleInputChange}
                  className="form-input"
                  min="2015"
                  max="2025"
                />
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Parent/Guardian Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Father's Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mother's Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Guardian Phone</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Update Documents (Optional)</h3>
            <p className="text-sm text-neutral-600">Only upload new documents if you want to replace existing ones.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: 'photo', label: 'Passport Size Photo' },
                { key: 'marksheet', label: 'Latest Marksheet' },
                { key: 'transferCertificate', label: 'Transfer Certificate' },
                { key: 'birthCertificate', label: 'Birth Certificate' }
              ].map((doc) => (
                <div key={doc.key} className="form-group">
                  <label className="form-label">{doc.label}</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, doc.key)}
                    className="form-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {files[doc.key] && (
                    <p className="text-sm text-success mt-1">New file selected: {files[doc.key].name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">Additional Information</h3>
            
            <div className="form-group">
              <label className="form-label">Extracurricular Activities</label>
              <textarea
                name="extracurricular"
                value={formData.extracurricular}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="loading mr-3"></div>
                  Updating Application...
                </>
              ) : (
                'Update Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionStatus;
