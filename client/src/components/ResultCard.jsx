import React from 'react';
import { BIN_COLORS } from '../utils/constants';

const ResultCard = ({ result }) => {
  const binColor = BIN_COLORS[result.binColor] || BIN_COLORS.Blue;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
        
        {/* Main Card - Glassmorphism */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header with Dynamic Gradient */}
          <div 
            className="relative p-12 text-white text-center overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${binColor.color} 0%, ${binColor.color}dd 50%, ${binColor.color}aa 100%)` 
            }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.2) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}/>
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              {/* Success Icon */}
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
                    <span className="text-7xl animate-bounce-slow">✅</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>

              <h2 className="text-5xl font-bold mb-3 drop-shadow-lg">
                Classification Complete!
              </h2>
              <p className="text-2xl opacity-90 font-medium">
                Item Successfully Identified
              </p>

              {/* Decorative Line */}
              <div className="mt-6 flex justify-center">
                <div className="w-32 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10 space-y-8">
            
            {/* Material Type - Hero Card */}
            <div className="relative group/card">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover/card:opacity-40 transition-all"></div>
              <div className="relative text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                <div className="inline-block mb-4 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <p className="text-sm text-gray-300 uppercase tracking-wider font-bold">
                    🔍 Material Type
                  </p>
                </div>
                
                <h3 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                  {result.materialType}
                </h3>
                
                <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
                  {result.description}
                </p>
              </div>
            </div>

            {/* Bin Color Section - Enhanced */}
            <div className="relative group/bin">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover/bin:opacity-40 transition-all"></div>
              <div className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <p className="text-sm text-gray-300 uppercase tracking-wider font-bold">
                      🗑️ Disposal Instructions
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  {/* Bin Color Display */}
                  <div className="relative group/color">
                    <div className="absolute -inset-2 rounded-3xl blur-xl opacity-50 transition-all group-hover/color:opacity-75" style={{ backgroundColor: binColor.color }}></div>
                    <div 
                      className="relative w-32 h-32 rounded-3xl shadow-2xl transform transition-all group-hover/color:scale-110 group-hover/color:rotate-6 border-4 border-white/30"
                      style={{ backgroundColor: binColor.color }}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-3xl"></div>
                    </div>
                  </div>

                  {/* Bin Info */}
                  <div className="text-center md:text-left">
                    <p className="text-4xl font-bold text-white mb-2">
                      {binColor.name}
                    </p>
                    <p className="text-gray-300 text-xl leading-relaxed max-w-md">
                      {binColor.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recyclable Status - Enhanced Badge */}
            <div className="flex justify-center">
              <div className="relative group/status">
                <div className={`absolute -inset-1 rounded-full blur-lg opacity-50 group-hover/status:opacity-75 transition-all ${
                  result.recyclable ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className={`relative px-10 py-5 rounded-full font-bold text-xl shadow-2xl backdrop-blur-lg border-2 transform transition-all group-hover/status:scale-105 ${
                  result.recyclable 
                    ? 'bg-green-500/20 text-green-400 border-green-500' 
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                }`}>
                  <span className="flex items-center gap-3">
                    <span className="text-3xl">{result.recyclable ? '♻️' : '⚠️'}</span>
                    <span>{result.recyclable ? '100% Recyclable' : 'Special Handling Required'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Section - Enhanced */}
            <div className="relative group/tip">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover/tip:opacity-40 transition-all"></div>
              <div className="relative bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 p-8 rounded-r-2xl backdrop-blur-lg shadow-xl">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-5xl shadow-xl transform transition-all group-hover/tip:scale-110 group-hover/tip:rotate-12">
                      💡
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-4 text-2xl flex items-center gap-2">
                      Pro Recycling Tip
                      <span className="text-blue-400">✨</span>
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {result.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples Section - Enhanced */}
            {result.examples && result.examples.length > 0 && (
              <div className="relative group/examples">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover/examples:opacity-40 transition-all"></div>
                <div className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
                  <h4 className="font-bold text-white mb-6 text-2xl flex items-center gap-3">
                    <span className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      📋
                    </span>
                    <span>Common Examples</span>
                  </h4>
                  
                  <div className="flex flex-wrap gap-4">
                    {result.examples.map((example, index) => (
                      <div
                        key={index}
                        className="group/tag relative"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-0 group-hover/tag:opacity-50 transition-all"></div>
                        <span className="relative block px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-200 rounded-full text-base font-medium border border-white/20 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50 transition-all transform hover:scale-105 shadow-lg">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button className="group/btn relative px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full overflow-hidden shadow-2xl shadow-green-500/50 font-bold text-lg transition-all transform hover:scale-105">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">📤</span>
                  <span>Share Results</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </button>

              <button className="group/btn2 px-10 py-4 bg-white/5 backdrop-blur-lg hover:bg-white/10 rounded-full font-bold text-lg transition-all border-2 border-white/10 hover:border-green-500/50 shadow-xl text-white transform hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl">ℹ️</span>
                  <span>Learn More</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
