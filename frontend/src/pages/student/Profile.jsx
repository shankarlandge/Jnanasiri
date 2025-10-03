import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../utils/api';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  IdentificationIcon,
  HeartIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bloodGroup: '',
    standard: '',
    section: '',
    rollNumber: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        bloodGroup: user.bloodGroup || '',
        standard: user.standard || '',
        section: user.section || '',
        rollNumber: user.rollNumber || '',
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          relationship: user.emergencyContact?.relationship || '',
          phone: user.emergencyContact?.phone || '',
          email: user.emergencyContact?.email || ''
        }
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getProfile();
      const data = response.data;
      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          bloodGroup: data.bloodGroup || '',
          standard: data.standard || '',
          section: data.section || '',
          rollNumber: data.rollNumber || '',
          emergencyContact: {
            name: data.emergencyContact?.name || '',
            relationship: data.emergencyContact?.relationship || '',
            phone: data.emergencyContact?.phone || '',
            email: data.emergencyContact?.email || ''
          }
        });
      }
    } catch (error) {
      showMessage('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('emergencyContact.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('File size must be less than 5MB', 'error');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file', 'error');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const response = await studentAPI.updateProfile(profileData);
      
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await studentAPI.uploadPhoto(formData);
      }

      if (updateUser) {
        updateUser(response.data);
      }
      showMessage('Profile updated successfully!', 'success');
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Spouse', 'Sibling', 'Other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Manage your personal information and settings</p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPhotoFile(null);
                    setPhotoPreview(null);
                    fetchProfileData();
                  }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 disabled:opacity-50 flex items-center font-medium"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 flex items-center font-medium"
              >
                <PencilIcon className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center ${
          messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 mr-3" />
          ) : messageType === 'error' ? (
            <XCircleIcon className="w-5 h-5 mr-3" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5 mr-3" />
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Photo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
            <div className="text-center">
              <div className="relative inline-block">
                {photoPreview || user?.photo?.url ? (
                  <img
                    src={photoPreview || user.photo.url}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <UserIcon className="w-16 h-16 text-white" />
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
                    <CameraIcon className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600 font-medium">Student ID: {user?.student_id}</p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>

              {isEditing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    Upload Photo Guidelines
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    • Maximum size: 5MB<br/>
                    • Formats: JPG, PNG<br/>
                    • Recommended: Square images
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <UserIcon className="w-6 h-6 mr-3 text-blue-500" />
                Personal Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                      placeholder="Enter your email"
                    />
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={profileData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                      placeholder="Enter mobile number"
                    />
                    <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    />
                    <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                  >
                    <option value="">Select Gender</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                  <div className="relative">
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    <HeartIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <HomeIcon className="w-6 h-6 mr-3 text-blue-500" />
                Address Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors resize-none"
                    placeholder="Enter complete address"
                  />
                  <MapPinIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileData.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <AcademicCapIcon className="w-6 h-6 mr-3 text-blue-500" />
                Academic Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Standard/Class</label>
                  <input
                    type="text"
                    name="standard"
                    value={profileData.standard}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter class/standard"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={profileData.section}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter section"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="rollNumber"
                      value={profileData.rollNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                      placeholder="Enter roll number"
                    />
                    <IdentificationIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <PhoneIcon className="w-6 h-6 mr-3 text-blue-500" />
                Emergency Contact
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={profileData.emergencyContact.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                    placeholder="Enter contact name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
                  <select
                    name="emergencyContact.relationship"
                    value={profileData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                  >
                    <option value="">Select Relationship</option>
                    {relationships.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={profileData.emergencyContact.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                      placeholder="Enter phone number"
                    />
                    <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="emergencyContact.email"
                      value={profileData.emergencyContact.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-colors"
                      placeholder="Enter email address"
                    />
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;