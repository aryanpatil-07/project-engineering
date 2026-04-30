import React from 'react';

const SkeletonCard = ({ count = 3, height = 80, variant = 'card' }) => {
  const skeletons = Array.from({ length: count });

  if (variant === 'row') {
    // Table row skeleton
    return (
      <div className="space-y-2">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg animate-pulse"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    // Dashboard StatCard skeleton
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse"
            style={{ height: `${height}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'product') {
    // Product card grid skeleton
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-xl animate-pulse"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
    );
  }

  // Default: card skeleton (for Orders)
  return (
    <div className="space-y-4">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse flex justify-between items-center"
          style={{ height: `${height}px` }}
        >
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
