import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-28 h-28 border-8 border-gray-700 border-t-green-500 border-r-emerald-500 rounded-full animate-spin"></div>
        
        {/* Inner icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl animate-pulse">
          ♻️
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-white font-bold text-2xl mb-2 animate-pulse">
          Analyzing your item...
        </p>
        <p className="text-gray-400 text-lg">
          Our AI is identifying the material type
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This may take a few seconds ⏱️
        </p>
      </div>
      
      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
