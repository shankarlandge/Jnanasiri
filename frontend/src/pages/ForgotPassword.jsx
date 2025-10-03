import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    userType: 'student' // 'student' or 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email address is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/forgot-password', {
        email: formData.email,
        userType: formData.userType
      });
      
      if (response.success) {
        setSuccess(true);
        // Navigate to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate('/verify-otp', { 
            state: { 
              email: formData.email, 
              userType: formData.userType 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit verification code to <span className="font-medium">{formData.email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email and enter the verification code to reset your password.
              </p>
              <div className="text-sm">
                <span className="text-gray-600">Redirecting to verification page...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/jnana-siri-logo.png" 
                alt="Jnana Siri Educational Institute" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">Jnana Siri</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Select Account Type
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border transition-colors ${
                    formData.userType === 'student'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'admin' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border transition-colors ${
                    formData.userType === 'admin'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;