import React, { useState, useRef, useEffect } from 'react';

const ImageUpload = ({ onImageSelect, onAutoAnalyze }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <>
          {!isCameraOpen ? (
            // Upload Interface
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-green-500 bg-green-500/10 scale-105' 
                  : 'border-gray-700 bg-gray-800/30 hover:border-green-500/50'
              }`}
            >
              <div className="text-7xl mb-6 animate-bounce">📸</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Upload or Capture Image
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                Drag and drop, browse files, or open camera
              </p>
              
              {cameraError && (
                <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded text-red-300">
                  <p className="font-semibold">❌ {cameraError}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105 font-semibold text-lg"
                >
                  📁 Browse Files
                </button>
                <button
                  onClick={openCamera}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 font-semibold text-lg"
                >
                  📷 Open Camera
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            // LIVE CAMERA FEED - THIS IS THE KEY PART
            <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 shadow-2xl bg-black">
              {/* THIS IS THE LIVE VIDEO ELEMENT */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto block"
                style={{
                  minHeight: '400px',
                  maxHeight: '70vh',
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
              />
              
              {/* Camera UI Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-xl animate-pulse"/>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-green-400 rounded-tr-xl animate-pulse"/>
                <div className="absolute bottom-24 left-4 w-16 h-16 border-b-4 border-l-4 border-green-400 rounded-bl-xl animate-pulse"/>
                <div className="absolute bottom-24 right-4 w-16 h-16 border-b-4 border-r-4 border-green-400 rounded-br-xl animate-pulse"/>
                
                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-green-400/50 rounded-full animate-ping"></div>
                </div>
              </div>
              
              {/* LIVE Indicator */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 pointer-events-none">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"/>
                <span className="text-white font-bold text-sm">🔴 LIVE</span>
              </div>
              
              {/* Instructions */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg pointer-events-none">
                <p className="text-white text-sm font-semibold">Point camera at object and click capture</p>
              </div>
              
              {/* CAPTURE AND CLOSE BUTTONS */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 pointer-events-auto">
                {/* CAPTURE BUTTON - BIG GREEN BUTTON */}
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className="relative group"
                  title="Capture Photo"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white">
                    {isCapturing ? (
                      <span className="text-5xl animate-spin">⚡</span>
                    ) : (
                      <span className="text-5xl">📸</span>
                    )}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 px-3 py-1 rounded-full whitespace-nowrap">
                    <span className="text-white text-xs font-bold">CAPTURE</span>
                  </div>
                </button>
                
                {/* CLOSE BUTTON */}
                <button
                  onClick={closeCamera}
                  className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-110 border-4 border-white"
                  title="Close Camera"
                >
                  <span className="text-3xl text-white font-bold">✕</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Image Preview
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"/>
          <div className="relative">
            <img
              src={preview}
              alt="Captured"
              className="w-full h-auto rounded-2xl shadow-2xl border-2 border-gray-700"
            />
            {isCapturing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 animate-spin">⚡</div>
                <p className="text-white font-bold text-2xl mb-2">Processing...</p>
                <p className="text-gray-300">AI is analyzing your image</p>
              </div>
            )}
            <button
              onClick={resetImage}
              className="absolute top-4 right-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
