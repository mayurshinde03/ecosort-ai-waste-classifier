import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { classifyImage } from '../services/api';

const Identifier = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Camera states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up camera...');
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    console.log('🛑 Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    console.log('🎥 Starting camera...');
    console.log('VideoRef exists?', !!videoRef.current);
    
    setCameraError(null);
    
    // Stop any existing stream
    stopCamera();
    
    try {
      console.log('📸 Requesting getUserMedia...');
      
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      
      // Store stream reference
      streamRef.current = stream;
      
      if (!videoRef.current) {
        console.error('❌ VideoRef is null!');
        setCameraError('Video element not ready');
        return;
      }
      
      console.log('📺 Attaching stream to video element...');
      videoRef.current.srcObject = stream;
      
      // Force play
      try {
        await videoRef.current.play();
        console.log('▶️ Video is playing!');
        setIsCameraOpen(true);
        console.log('State updated: isCameraOpen = true');
      } catch (playErr) {
        console.error('❌ Play error:', playErr);
        setCameraError('Failed to play video: ' + playErr.message);
      }
      
    } catch (err) {
      console.error('❌ Camera error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      let message = '';
      switch (err.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          message = 'Camera permission denied. Please allow camera access in browser settings.';
          break;
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          message = 'No camera found on this device.';
          break;
        case 'NotReadableError':
        case 'TrackStartError':
          message = 'Camera is being used by another application.';
          break;
        case 'OverconstrainedError':
          message = 'Camera settings not supported. Trying lower resolution...';
          // Retry with basic constraints
          retryBasicCamera();
          return;
        default:
          message = 'Camera error: ' + err.message;
      }
      
      setCameraError(message);
      alert('❌ ' + message);
    }
  };

  const retryBasicCamera = async () => {
    try {
      console.log('🔄 Retrying with basic constraints...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOpen(true);
        console.log('✅ Basic camera started successfully');
      }
    } catch (err) {
      console.error('❌ Retry failed:', err);
      setCameraError('Unable to start camera with any settings');
    }
  };

  const captureFromCamera = () => {
    console.log('📷 Capturing from camera...');
    
    if (!videoRef.current) {
      alert('Video not ready');
      return;
    }

    if (videoRef.current.videoWidth === 0) {
      alert('Video not loaded yet. Please wait a moment and try again.');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      
      console.log('✅ Photo captured, size:', imageData.length);
      
      setSelectedImage(imageData);
      stopCamera();
      setIsCameraOpen(false);
      
      // Auto-analyze
      handleAnalyze(imageData);
    } catch (err) {
      console.error('❌ Capture error:', err);
      alert('Failed to capture: ' + err.message);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (imageData = selectedImage) => {
    if (!imageData) {
      setError('Please upload or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await classifyImage(imageData);
      setResult(response.result);
    } catch (err) {
      setError(err.message || 'Failed to classify image');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    stopCamera();
    setIsCameraOpen(false);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-lg' : 'bg-gray-900/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
                ♻️
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                EcoSort
              </span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Smart Recycle Identifier
            </h1>
            <p className="text-xl text-gray-400">
              {loading ? '🔄 AI is analyzing...' : 'Choose your method'}
            </p>
            
            {/* Debug Info */}
            <div className="mt-4 text-sm text-gray-500">
              <p>Camera State: {isCameraOpen ? '🟢 Open' : '🔴 Closed'}</p>
              {cameraError && <p className="text-red-400">Error: {cameraError}</p>}
            </div>
          </div>

          {/* SPLIT LAYOUT */}
          {!result && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              
              {/* LEFT - FILE UPLOAD */}
              <div className="bg-gray-900/50 rounded-3xl p-8 border-2 border-gray-800">
                <div className="text-center">
                  <div className="text-7xl mb-4">📁</div>
                  <h3 className="text-2xl font-bold mb-3">Browse Files</h3>
                  <p className="text-gray-400 mb-6">Upload from device</p>
                  
                  {selectedImage && !isCameraOpen && (
                    <div className="relative mb-6">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 w-10 h-10 bg-red-600 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold text-lg"
                  >
                    📁 Choose File
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* RIGHT - CAMERA */}
              <div className="bg-gray-900/50 rounded-3xl p-8 border-2 border-gray-800">
                <div className="text-center">
                  <div className="text-7xl mb-4">📷</div>
                  <h3 className="text-2xl font-bold mb-3">
                    {isCameraOpen ? '🔴 LIVE CAMERA' : 'Open Camera'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {isCameraOpen ? 'Point and capture' : 'Capture from camera'}
                  </p>
                  
                  {/* VIDEO ELEMENT - ALWAYS RENDERED */}
                  <div className={`relative rounded-2xl overflow-hidden mb-6 bg-black ${
                    isCameraOpen ? 'border-4 border-green-500' : 'border-4 border-dashed border-gray-700'
                  }`} style={{ minHeight: '300px' }}>
                    
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-auto ${isCameraOpen ? 'block' : 'hidden'}`}
                      style={{ 
                        minHeight: '300px',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        backgroundColor: '#000'
                      }}
                    />
                    
                    {!isCameraOpen && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">Camera will appear here</p>
                      </div>
                    )}
                    
                    {/* Overlay when camera is open */}
                    {isCameraOpen && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-xl"/>
                        <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-xl"/>
                        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-xl"/>
                        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-xl"/>
                        
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"/>
                          <span className="text-white text-xs font-bold">LIVE</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Controls */}
                  {!isCameraOpen ? (
                    <button
                      onClick={startCamera}
                      className="w-full px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 font-semibold text-lg"
                    >
                      📷 Start Camera
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={captureFromCamera}
                        className="flex-1 px-6 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 font-bold text-lg"
                      >
                        📸 CAPTURE
                      </button>
                      <button
                        onClick={() => {
                          stopCamera();
                          setIsCameraOpen(false);
                        }}
                        className="px-6 py-4 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {selectedImage && !result && !loading && !isCameraOpen && (
            <div className="text-center mb-8">
              <button
                onClick={() => handleAnalyze()}
                className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-full hover:bg-green-700"
              >
                🔍 Analyze Image
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && <div className="flex justify-center my-12"><LoadingSpinner /></div>}

          {/* Error */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8 bg-red-900/20 border-l-4 border-red-500 p-6 rounded">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div>
              <ResultCard result={result} />
              <div className="text-center mt-8">
                <button onClick={handleReset} className="px-8 py-3 bg-gray-800 rounded-full">
                  🔄 Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Identifier;
