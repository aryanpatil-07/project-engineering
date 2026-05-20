import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ 
  message = 'Something went wrong. Please try again.',
  errorDetail = null,
  onRetry = null,
  icon: Icon = AlertCircle 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-red-600" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
        Error Loading Data
      </h2>
      
      <p className="text-gray-600 text-center mb-4 max-w-md">
        {message}
      </p>

      {errorDetail && (
        <p className="text-xs text-gray-500 text-center mb-6 max-w-md bg-gray-50 p-3 rounded-lg font-mono">
          {errorDetail}
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
