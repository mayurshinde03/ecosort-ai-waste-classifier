import React from 'react';
import { BIN_COLORS } from '../utils/constants';

const ResultCard = ({ result }) => {
  const binColor = BIN_COLORS[result.binColor] || BIN_COLORS.Blue;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="relative group">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
        
        {/* Main Card Container - FIXED BACKGROUND */}
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          
          {/* Header Section - More Prominent */}
          <div className="relative p-10 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-b border-white/10">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">✨ AI-Powered Recognition</span>
            </div>
            
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce-slow">✅</div>
              <h2 className="text-4xl font-bold text-white mb-2">
                Classification Complete!
              </h2>
              <p className="text-gray-300 text-lg">
                Item Successfully Identified
              </p>
            </div>
          </div>

          {/* Content Area - CLEAN WHITE BACKGROUND */}
          <div className="p-8 space-y-6 bg-gray-900/50">
            
            {/* Material Type Card - BRIGHT & CLEAR */}
            <div className="relative group/material">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover/material:opacity-30 transition-all"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
                <div className="inline-block mb-4 px-5 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                  <p className="text-sm text-green-400 uppercase tracking-wider font-bold">
                    🔍 Material Type
                  </p>
                </div>
                
                <h3 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent mb-4">
                  {result.materialType}
                </h3>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  {result.description}
                </p>
              </div>
            </div>

            {/* Disposal Instructions - CLEAN CARD */}
            <div className="relative group/disposal">
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover/disposal:opacity-30 transition-all" style={{ background: `linear-gradient(135deg, ${binColor.color}, ${binColor.color}88)` }}></div>
              <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
                <div className="inline-block mb-5 px-5 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30">
                  <p className="text-sm text-blue-400 uppercase tracking-wider font-bold">
                    🗑️ Disposal Instructions
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Bin Color Square */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-2xl blur-lg opacity-60 transition-all" style={{ backgroundColor: binColor.color }}></div>
                    <div 
                      className="relative w-24 h-24 rounded-2xl shadow-2xl border-4 border-white/20 transition-all transform hover:scale-110 hover:rotate-6"
                      style={{ backgroundColor: binColor.color }}
                    >
                      <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Bin Info */}
                  <div>
                    <p className="text-3xl font-bold text-white mb-2">
                      {binColor.name}
                    </p>
                    <p className="text-gray-300 text-base">
                      {binColor.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recyclable Status Badge - BRIGHTER */}
            <div className="flex justify-center py-2">
              <div className="relative group/status">
                <div className={`absolute -inset-1 rounded-full blur-lg opacity-50 transition-all ${
                  result.recyclable ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className={`relative px-10 py-4 rounded-full font-bold text-lg backdrop-blur-lg border-2 shadow-2xl ${
                  result.recyclable 
                    ? 'bg-green-500/30 text-green-400 border-green-500' 
                    : 'bg-yellow-500/30 text-yellow-400 border-yellow-500'
                }`}>
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{result.recyclable ? '♻️' : '⚠️'}</span>
                    <span>{result.recyclable ? '100% Recyclable' : 'Special Handling Required'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tip Section - VIBRANT */}
            <div className="relative group/tip">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover/tip:opacity-30 transition-all"></div>
              <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                    💡
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-3 text-xl flex items-center gap-2">
                      Pro Recycling Tip
                      <span className="text-blue-400 text-base">✨</span>
                    </h4>
                    <p className="text-gray-200 leading-relaxed text-base">
                      {result.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Examples - CLEANER */}
            {result.examples && result.examples.length > 0 && (
              <div className="relative group/examples">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover/examples:opacity-30 transition-all"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="font-bold text-white mb-5 text-lg flex items-center gap-3">
                    <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                      📋
                    </span>
                    <span>Common Examples</span>
                  </h4>
                  
                  <div className="flex flex-wrap gap-3">
                    {result.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-full text-sm font-medium border border-gray-600/50 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50 transition-all transform hover:scale-105"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - PROMINENT */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 group/btn relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full overflow-hidden shadow-2xl shadow-green-500/40 font-bold text-lg transition-all transform hover:scale-105">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-xl">📤</span>
                  <span>Share Results</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </button>

              <button className="flex-1 px-10 py-5 bg-gray-800/70 backdrop-blur-lg hover:bg-gray-700/70 rounded-full font-bold text-lg transition-all border-2 border-gray-700/50 hover:border-green-500/50 shadow-xl text-white transform hover:scale-105">
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl">ℹ️</span>
                  <span>Learn More</span>
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Action - Scan Another */}
          <div className="p-6 bg-gray-900/80 border-t border-white/5 text-center">
            <button className="group px-8 py-4 bg-gray-800/70 hover:bg-gray-700/70 rounded-full font-semibold text-base transition-all border border-gray-700/50 hover:border-blue-500/50 text-white transform hover:scale-105 shadow-lg">
              <span className="flex items-center gap-3">
                <span className="text-xl">🔄</span>
                <span>Scan Another Item</span>
              </span>
            </button>
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

        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
