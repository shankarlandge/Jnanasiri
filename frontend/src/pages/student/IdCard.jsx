import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/idcard.css';

const IdCard = () => {
  const { user } = useAuth();

  // Format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const joinDate = user?.createdAt ? formatDate(user.createdAt) : '10/06/2025';
  const expireDate = new Date();
  expireDate.setFullYear(expireDate.getFullYear() + 4);
  const formattedExpireDate = formatDate(expireDate);

  const generateBarcode = () => {
    return '||||| || ||| |||| | ||| || |||| ||| | || |||||';
  };

  const generateQRData = () => {
    return {
      name: user?.name || 'Student Name',
      id: user?.student_id || 'STU0001',
      email: user?.email || 'student@janashiri.edu'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Student ID Card
          </h1>
          <p className="text-slate-600 text-lg">Your official Janashiri University identification</p>
        </div>
        
        {/* ID Card Container - Front and Back Side */}
        <div className="flex flex-col xl:flex-row justify-center items-center gap-12 mb-12">
          
          {/* Front Side */}
          <div className="modern-card-container">
            <div className="modern-id-card front-side">
              {/* Purple to Blue Gradient Header */}
              <div className="relative h-24 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 overflow-hidden">
                {/* Smooth curves overlay */}
                <div className="absolute inset-0">
                  <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 400 96" fill="none">
                    <path d="M0,48 C120,20 280,76 400,48 L400,96 L0,96 Z" fill="rgba(255,255,255,0.1)"/>
                    <path d="M0,64 C160,40 240,88 400,64 L400,96 L0,96 Z" fill="rgba(255,255,255,0.05)"/>
                  </svg>
                </div>
                
                {/* University Logo and Name */}
                <div className="relative z-10 flex items-center justify-center p-4 h-full">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span className="text-white font-bold text-xl">J</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">JANASHIRI UNIVERSITY</h2>
                      <p className="text-white/90 text-xs">Excellence in Education</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* White overlay section for content */}
              <div className="bg-white flex-1 p-6 relative">
                {/* Subtle gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-400"></div>
                
                {/* Student Photo and Info */}
                <div className="flex items-start space-x-6 mb-6">
                  {/* Circular Photo Frame */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                      {user?.photo ? (
                        <img 
                          src={user.photo.url} 
                          alt="Student Photo" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-purple-600">
                          {user?.name?.charAt(0) || 'S'}
                        </span>
                      )}
                    </div>
                    {/* Ring accent */}
                    <div className="absolute -inset-2 rounded-full border-2 border-gradient-to-r from-purple-300 to-blue-300 opacity-30"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user?.name?.toUpperCase() || 'STUDENT NAME'}
                    </h3>
                    <p className="text-purple-600 text-sm font-medium mb-4">
                      {user?.course || 'Computer Science Engineering'}
                    </p>
                    
                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">ID No.:</span>
                        <span className="font-mono text-gray-900">{user?.student_id || '0123456789123'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Blood Group:</span>
                        <span className="text-gray-900">{user?.bloodGroup || 'AB+'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <span className="text-gray-900">{user?.mobile || user?.phone || '+91 123 456 7890'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Email:</span>
                        <span className="text-gray-900 text-xs">{user?.email || 'name@janashiri.edu'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code / Barcode */}
                <div className="flex justify-center">
                  <div className="bg-gray-100 px-6 py-3 rounded-lg border">
                    <div className="font-mono text-sm tracking-wider text-gray-800 font-bold">
                      {generateBarcode()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="modern-card-container">
            <div className="modern-id-card back-side bg-white">
              
              {/* Light gradient accent at top */}
              <div className="h-1 bg-gradient-to-r from-purple-400 to-blue-400"></div>
              
              <div className="p-6 h-full flex flex-col justify-between">
                <div>
                  {/* Policy Instructions */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Important Instructions</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This ID card is university property and must be carried at all times on campus.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Report loss or damage immediately to the administration office for replacement.
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Valid for current academic year only. Renewal required annually.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Validity Dates */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-purple-700">Join Date</span>
                      <span className="text-sm font-bold text-gray-900">: {joinDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-purple-700">Expire Date</span>
                      <span className="text-sm font-bold text-gray-900">: {formattedExpireDate}</span>
                    </div>
                  </div>

                  {/* Authorized Signature */}
                  <div className="text-center mb-6">
                    <div className="inline-block">
                      <div className="text-lg font-script text-gray-600 mb-2">Name Surname</div>
                      <div className="w-32 h-px bg-gray-400 mb-2"></div>
                      <p className="text-xs text-gray-500 font-semibold">Authorized Signature</p>
                    </div>
                  </div>
                </div>

                {/* Footer with gradient pattern */}
                <div className="relative h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg overflow-hidden">
                  <div className="absolute inset-0">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 300 64" fill="none">
                      <path d="M0,24 C100,8 200,40 300,24 L300,0 L0,0 Z" fill="rgba(255,255,255,0.1)"/>
                    </svg>
                  </div>
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">J</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">JANASHIRI UNIVERSITY</p>
                        <p className="text-white/80 text-xs">Excellence in Education</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Print Button */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => window.print()}
            className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Print ID Card
          </button>
          <button 
            onClick={() => {
              alert('Download feature will be available soon!');
            }}
            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
