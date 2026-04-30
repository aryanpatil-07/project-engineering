import React from 'react';
import { InboxIcon } from 'lucide-react';

const EmptyState = ({
  title = 'No Data',
  message = 'There is nothing to display.',
  actionLabel = null,
  onAction = null,
  icon: Icon = InboxIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {title}
      </h2>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
