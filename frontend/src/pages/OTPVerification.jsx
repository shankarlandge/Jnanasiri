import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const otpRefs = useRef([]);
  
  const email = location.state?.email;
  const userType = location.state?.userType || 'student';

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        otp: otp.join(''),
        userType
      });
      
      if (response.success) {
        // Navigate to reset password page
        navigate('/reset-password', {
          state: {
            email,
            userType,
            resetToken: response.resetToken
          }
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
        userType
      });
      
      if (response.success) {
        setTimer(300); // Reset timer
        setOtp(['', '', '', '', '', '']); // Clear OTP
        otpRefs.current[0]?.focus();
        // Show success message briefly
        setError(''); // Clear any previous errors
        alert('New verification code sent to your email!');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError(error.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
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
        <div className="text-center mt-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
          <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            Code expires in {formatTime(timer)}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => (otpRefs.current[index] = ref)}
                    type="text"
                    maxLength="1"
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || timer > 240} // Allow resend after 1 minute
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {resendLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Sending...
                </span>
              ) : timer > 240 ? (
                `Resend in ${formatTime(timer - 240)}`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          {/* Back to Previous Step */}
          <div className="mt-6">
            <Link
              to="/forgot-password"
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-500 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Use different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;