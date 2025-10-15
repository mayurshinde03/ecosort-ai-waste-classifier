import React, { useState, useRef, useEffect } from 'react';

const ImageUpload = ({ onImageSelect, onAutoAnalyze }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('Camera stopped');
      });
      videoRef.current.srcObject = null;
    }
  };

  const openCamera = async () => {
    setCameraError(null);
    console.log('Opening camera...');
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      console.log('Camera access granted, stream:', stream);

      // Set the stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play()
            .then(() => {
              console.log('Video playing!');
              setIsCameraOpen(true);
            })
            .catch(err => {
              console.error('Play error:', err);
              setCameraError('Failed to play video');
            });
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      let message = 'Unable to access camera. ';
      
      if (err.name === 'NotAllowedError') {
        message += 'Permission denied. Please allow camera access.';
      } else if (err.name === 'NotFoundError') {
        message += 'No camera found.';
      } else {
        message += err.message;
      }
      
      setCameraError(message);
      alert(message);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      alert('Camera not ready');
      return;
    }

    setIsCapturing(true);
    console.log('Capturing photo...');

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      console.log('Photo captured, size:', imageData.length);
      
      // Set preview
      setPreview(imageData);
      onImageSelect(imageData);
      
      // Close camera
      stopCamera();
      setIsCameraOpen(false);
      
      // Auto-analyze after short delay
      setTimeout(() => {
        setIsCapturing(false);
        if (onAutoAnalyze) {
          console.log('Auto-analyzing...');
          onAutoAnalyze(imageData);
        }
      }, 500);
      
    } catch (err) {
      console.error('Capture error:', err);
      setIsCapturing(false);
      alert('Failed to capture photo: ' + err.message);
    }
  };

  const closeCamera = () => {
    console.log('Closing camera...');
    stopCamera();
    setIsCameraOpen(false);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const resetImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!preview ? (
        <>
          {!isCameraOpen ? (
            // Upload Interface - Glassmorphism
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-3xl p-12 text-center transition-all duration-500 ${
                isDragging 
                  ? 'border-4 border-green-500 bg-green-500/20 backdrop-blur-xl scale-105 shadow-2xl shadow-green-500/50' 
                  : 'border-4 border-dashed border-white/10 bg-white/5 backdrop-blur-xl hover:border-green-500/50 hover:bg-white/10'
              }`}
            >
              {/* Gradient Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-0 ${isDragging ? 'opacity-40' : ''} transition-all duration-500`}/>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-8 inline-block">
                  <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-7xl transform transition-all duration-500 shadow-2xl ${
                    isDragging ? 'scale-125 rotate-12' : 'animate-bounce-slow'
                  }`}>
                    📸
                  </div>
                </div>

                <h3 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Upload or Capture
                </h3>
                <p className="text-gray-400 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
                  {isDragging ? '✨ Drop your image here' : 'Drag and drop, browse files, or open camera'}
                </p>
                
                {/* Error Display */}
                {cameraError && (
                  <div className="mb-8 p-6 bg-red-900/30 backdrop-blur-xl border-l-4 border-red-500 rounded-2xl shadow-xl max-w-2xl mx-auto">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">❌</span>
                      <div className="text-left">
                        <p className="font-bold text-red-300 text-lg mb-1">Camera Error</p>
                        <p className="text-red-200">{cameraError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setHoveredCard('upload')}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full overflow-hidden shadow-2xl shadow-blue-500/50 font-bold text-xl transition-all transform hover:scale-110"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">📁</span>
                      <span>Browse Files</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={openCamera}
                    onMouseEnter={() => setHoveredCard('camera')}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full overflow-hidden shadow-2xl shadow-green-500/50 font-bold text-xl transition-all transform hover:scale-110"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">📷</span>
                      <span>Open Camera</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* File Info */}
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { icon: '✓', text: 'PNG, JPG, WEBP' },
                    { icon: '📏', text: 'Max 10MB' },
                    { icon: '⚡', text: 'Instant Analysis' }
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-green-400">{item.icon}</span>
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            // LIVE CAMERA FEED - Enhanced Glassmorphism
            <div className="relative rounded-3xl overflow-hidden border-4 border-green-500 shadow-2xl shadow-green-500/50 bg-black">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-50 animate-pulse"/>
              
              {/* THIS IS THE LIVE VIDEO ELEMENT */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="relative z-10 w-full h-auto block"
                style={{
                  minHeight: '400px',
                  maxHeight: '70vh',
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
              />
              
              {/* Camera UI Overlay - Enhanced */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {/* Corner Brackets - Animated */}
                <div className="absolute top-6 left-6 w-20 h-20 border-t-4 border-l-4 border-green-400 rounded-tl-2xl animate-pulse"/>
                <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-green-400 rounded-tr-2xl animate-pulse"/>
                <div className="absolute bottom-32 left-6 w-20 h-20 border-b-4 border-l-4 border-green-400 rounded-bl-2xl animate-pulse"/>
                <div className="absolute bottom-32 right-6 w-20 h-20 border-b-4 border-r-4 border-green-400 rounded-br-2xl animate-pulse"/>
                
                {/* Center Targeting System */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-40 h-40 border-2 border-green-400/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 w-40 h-40 border-2 border-green-400 rounded-full"></div>
                    {/* Crosshair */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-0.5 bg-green-400"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-12 bg-green-400"></div>
                    </div>
                  </div>
                </div>

                {/* Scanning Line Animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan opacity-50"></div>
                </div>
              </div>
              
              {/* LIVE Indicator - Enhanced */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-red-600/90 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border-2 border-white/20">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </div>
                  <span className="text-white font-bold text-base uppercase tracking-wider">Recording</span>
                </div>
              </div>
              
              {/* Instructions - Glassmorphism */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30">
                <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
                  <p className="text-white text-base font-semibold flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span>Point at object and capture</span>
                  </p>
                </div>
              </div>
              
              {/* CAPTURE AND CLOSE BUTTONS - Enhanced */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-12 pointer-events-auto z-30">
                {/* CAPTURE BUTTON - Big Glassmorphic Button */}
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className="group relative"
                  title="Capture Photo"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl transition-all transform group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white/50 backdrop-blur-sm">
                    {isCapturing ? (
                      <span className="text-6xl animate-spin">⚡</span>
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform">📸</span>
                    )}
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white text-sm font-bold uppercase tracking-wide">
                      {isCapturing ? 'Capturing...' : 'Capture'}
                    </span>
                  </div>
                </button>
                
                {/* CLOSE BUTTON - Enhanced */}
                <button
                  onClick={closeCamera}
                  className="group relative w-20 h-20 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 border-4 border-white/50 backdrop-blur-sm"
                  title="Close Camera"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-xl opacity-0 group-hover:opacity-75 transition-opacity"></div>
                  <span className="relative text-4xl text-white font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Image Preview - Enhanced Glassmorphism
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-all duration-500"/>
          
          <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/5 backdrop-blur-xl">
            <img
              src={preview}
              alt="Captured"
              className="w-full h-auto"
            />
            
            {/* Processing Overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center z-20">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                    <span className="text-6xl animate-spin">⚡</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-75 animate-pulse"></div>
                </div>
                <p className="text-white font-bold text-3xl mb-3">Processing...</p>
                <p className="text-gray-300 text-lg">AI is analyzing your image</p>
                <div className="mt-6 flex gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            
            {/* Remove Button - Enhanced */}
            <button
              onClick={resetImage}
              className="group/btn absolute top-6 right-6 px-8 py-4 bg-red-600/90 hover:bg-red-700 backdrop-blur-xl text-white rounded-full transition-all font-bold shadow-2xl transform hover:scale-110 border-2 border-white/30 z-10"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">✕</span>
                <span>Remove</span>
              </span>
            </button>

            {/* Image Info Badge */}
            <div className="absolute bottom-6 left-6 px-5 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 z-10">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white font-semibold text-sm">Image Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
