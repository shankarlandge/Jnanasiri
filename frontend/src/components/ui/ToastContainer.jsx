import React, { useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({ toast }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, removeToast]);

  const getToastStyles = () => {
    const baseStyles = "flex items-center w-full max-w-md p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out transform";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-green-500 bg-green-50 text-green-800`;
      case 'error':
        return `${baseStyles} border-red-500 bg-red-50 text-red-800`;
      case 'warning':
        return `${baseStyles} border-yellow-500 bg-yellow-50 text-yellow-800`;
      case 'info':
      default:
        return `${baseStyles} border-blue-500 bg-blue-50 text-blue-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="text-sm font-medium flex-1">
        {toast.message}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
