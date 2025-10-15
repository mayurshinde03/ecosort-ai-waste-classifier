import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        
        {/* Multiple Spinning Rings - Layered Effect */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 border-8 border-transparent border-t-green-500 border-r-emerald-500 rounded-full animate-spin"></div>
          
          {/* Middle ring - opposite direction */}
          <div className="absolute inset-2 w-24 h-24 border-6 border-transparent border-b-cyan-400 border-l-blue-400 rounded-full animate-spin-reverse"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-4 w-16 h-16 border-4 border-transparent border-t-emerald-400 border-r-green-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Center Icon with Glassmorphism */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <span className="text-5xl animate-pulse">♻️</span>
            </div>
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Text Content - Enhanced */}
      <div className="mt-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">AI Processing</span>
        </div>

        {/* Main Text */}
        <h3 className="text-white font-bold text-3xl mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent animate-pulse">
          Analyzing Your Item
        </h3>
        <p className="text-gray-300 text-xl mb-3">
          🤖 AI is identifying the material type
        </p>
        <p className="text-gray-400 text-base">
          This usually takes 2-3 seconds
        </p>
      </div>
      
      {/* Progress Indicator - Animated Dots */}
      <div className="mt-8 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-8 w-64">
        <div className="h-2 bg-white/5 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 animate-progress rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { icon: '⚡', text: 'Fast Processing' },
          { icon: '🎯', text: '95% Accurate' },
          { icon: '🔒', text: 'Secure & Private' }
        ].map((item, i) => (
          <div 
            key={i}
            className="px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full animate-fade-in"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-400 text-sm font-medium">{item.text}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
