import React from 'react';
import { useAuth } from '../../context/AuthContext';

const IdCard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Student ID Card</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold">Janashiri Institute</h2>
            <div className="my-4">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <h3 className="text-lg font-bold">{user?.name || 'Student Name'}</h3>
              <p className="text-sm opacity-90">{user?.email || 'email@example.com'}</p>
              <p className="text-sm opacity-90">ID: {user?.student_id || 'STUD001'}</p>
            </div>
            <div className="text-xs bg-white/20 px-2 py-1 rounded inline-block">
              Verified Student
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Print ID Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
