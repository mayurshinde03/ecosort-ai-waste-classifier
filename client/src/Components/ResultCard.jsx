import React from 'react';
import { BIN_COLORS } from '../utils/constants';

const ResultCard = ({ result }) => {
  const binColor = BIN_COLORS[result.binColor] || BIN_COLORS.Blue;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-green-500/30">
        
        {/* Header with gradient */}
        <div 
          className="p-8 text-white text-center relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${binColor.color} 0%, ${binColor.color}dd 100%)` 
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}/>
          </div>
          <div className="relative">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-4xl font-bold mb-2">Classification Complete!</h2>
            <p className="text-xl opacity-90">Item Successfully Identified</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          {/* Material Type */}
          <div className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-3 font-semibold">
              Material Type
            </p>
            <h3 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
              {result.materialType}
            </h3>
            <p className="text-gray-300 text-lg">{result.description}</p>
          </div>

          {/* Bin Color Section */}
          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4 text-center font-semibold">
              Disposal Instructions
            </p>
            <div className="flex items-center justify-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl shadow-xl transform hover:scale-110 transition-transform border-2 border-white/20"
                style={{ backgroundColor: binColor.color }}
              ></div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {binColor.name}
                </p>
                <p className="text-gray-400 text-lg">{binColor.description}</p>
              </div>
            </div>
          </div>

          {/* Recyclable Status */}
          <div className="flex justify-center">
            <div className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg ${
              result.recyclable 
                ? 'bg-green-500/20 text-green-400 border-2 border-green-500' 
                : 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
            }`}>
              {result.recyclable ? '♻️ 100% Recyclable' : '⚠️ Special Handling Required'}
            </div>
          </div>

          {/* Tip Section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500 p-6 rounded-r-2xl backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-5xl">💡</span>
              <div>
                <h4 className="font-bold text-white mb-3 text-xl">
                  Pro Recycling Tip
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">{result.tip}</p>
              </div>
            </div>
          </div>

          {/* Examples */}
          {result.examples && result.examples.length > 0 && (
            <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
              <h4 className="font-bold text-white mb-4 text-xl flex items-center gap-2">
                <span>📋</span> Common Examples:
              </h4>
              <div className="flex flex-wrap gap-3">
                {result.examples.map((example, index) => (
                  <span
                    key={index}
                    className="px-5 py-2 bg-gray-700 text-gray-200 rounded-full text-sm font-medium hover:bg-green-500/20 hover:text-green-400 transition-all border border-gray-600"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
