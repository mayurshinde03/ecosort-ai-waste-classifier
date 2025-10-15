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
  const [hoveredCard, setHoveredCard] = useState(null);
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
    <div className="bg-gray-950 text-white min-h-screen overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }}/>
      </div>

      {/* Navigation - Glassmorphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-green-500/5 border-b border-white/5' 
          : 'bg-gray-900/80 backdrop-blur-lg border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl shadow-green-500/40">
                ♻️
                <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                  EcoSort
                </span>
                <p className="text-xs text-gray-400 font-medium">AI-Powered Recycling</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="group px-8 py-3 bg-white/5 backdrop-blur-lg hover:bg-white/10 rounded-full font-semibold transition-all border-2 border-white/10 hover:border-green-500/50 shadow-xl"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Home</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Title Section */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">
                {loading ? '🔄 AI Analyzing...' : '✨ AI-Powered Recognition'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Smart Waste Identifier
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Choose your preferred method to identify and classify waste materials
            </p>
          </div>

          {/* SPLIT LAYOUT - Glassmorphism Cards */}
          {!result && (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              
              {/* LEFT - FILE UPLOAD */}
              <div 
                className="group relative"
                onMouseEnter={() => setHoveredCard('upload')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-0 ${hoveredCard === 'upload' ? 'opacity-40' : ''} transition-all duration-500`}/>
                
                {/* Main Card */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 ${hoveredCard === 'upload' ? 'opacity-100' : ''} transition-opacity duration-500`} />
                  
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="mb-8 inline-block">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                        📁
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                      Browse Files
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 mb-8 text-lg">
                      Upload an image from your device
                    </p>
                    
                    {/* Selected Image Preview */}
                    {selectedImage && !isCameraOpen && (
                      <div className="relative mb-8 group/image">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-50"></div>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-white/20">
                          <img 
                            src={selectedImage} 
                            alt="Selected" 
                            className="w-full h-64 object-cover"
                          />
                          <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-3 right-3 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-xl font-bold transition-all transform hover:scale-110 shadow-lg"
                          >
                            ✕
                          </button>
                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4 text-white">
                              <p className="text-sm font-semibold">✓ Image Selected</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="group/btn w-full px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:shadow-2xl hover:shadow-blue-500/50 font-bold text-lg transition-all transform hover:scale-105 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-2xl">📁</span>
                        <span>Choose Image</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                    
                    {/* Stats Badge */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <span className="text-blue-400 text-sm font-semibold">PNG, JPG, WEBP • Max 10MB</span>
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
              </div>

              {/* RIGHT - CAMERA */}
              <div 
                className="group relative"
                onMouseEnter={() => setHoveredCard('camera')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-0 ${hoveredCard === 'camera' || isCameraOpen ? 'opacity-40' : ''} transition-all duration-500`}/>
                
                {/* Main Card */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-3xl opacity-0 ${hoveredCard === 'camera' || isCameraOpen ? 'opacity-100' : ''} transition-opacity duration-500`} />
                  
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    {!isCameraOpen && (
                      <div className="mb-8 inline-block">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                          📷
                        </div>
                      </div>
                    )}

                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">
                      {isCameraOpen ? '🔴 LIVE CAMERA' : 'Live Camera'}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 mb-8 text-lg">
                      {isCameraOpen ? 'Point at waste and capture' : 'Capture in real-time'}
                    </p>
                    
                    {/* VIDEO ELEMENT with Enhanced Styling */}
                    <div className={`relative rounded-2xl overflow-hidden mb-8 transition-all duration-500 ${
                      isCameraOpen 
                        ? 'border-4 border-green-500 shadow-2xl shadow-green-500/50' 
                        : 'border-4 border-dashed border-gray-700 hover:border-gray-600'
                    }`} style={{ minHeight: '320px' }}>
                      
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-auto ${isCameraOpen ? 'block' : 'hidden'}`}
                        style={{ 
                          minHeight: '320px',
                          maxHeight: '400px',
                          objectFit: 'cover',
                          backgroundColor: '#000'
                        }}
                      />
                      
                      {/* Placeholder when camera is off */}
                      {!isCameraOpen && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                          <div className="text-6xl mb-4 animate-pulse">📷</div>
                          <p className="text-gray-500 font-medium">Camera preview will appear here</p>
                        </div>
                      )}
                      
                      {/* Overlay when camera is open */}
                      {isCameraOpen && (
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Corner Brackets */}
                          <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-2xl animate-pulse"/>
                          <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-2xl animate-pulse"/>
                          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-2xl animate-pulse"/>
                          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-2xl animate-pulse"/>
                          
                          {/* Live Indicator */}
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"/>
                            <span className="text-white text-sm font-bold uppercase tracking-wide">Recording</span>
                          </div>

                          {/* Center Target */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400/50 rounded-full animate-pulse"/>
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Error Display */}
                    {cameraError && (
                      <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
                        <p className="text-red-300 text-sm">{cameraError}</p>
                      </div>
                    )}
                    
                    {/* Controls */}
                    {!isCameraOpen ? (
                      <button
                        onClick={startCamera}
                        className="group/btn w-full px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/50 font-bold text-lg transition-all transform hover:scale-105 relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <span className="text-2xl">📷</span>
                          <span>Start Camera</span>
                          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={captureFromCamera}
                          className="flex-1 px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:shadow-2xl hover:shadow-green-500/50 font-bold text-lg transition-all transform hover:scale-105"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span className="text-2xl">📸</span>
                            <span>CAPTURE</span>
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            stopCamera();
                            setIsCameraOpen(false);
                          }}
                          className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                        >
                          <span className="text-xl">✕</span>
                        </button>
                      </div>
                    )}

                    {/* Stats Badge */}
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-400 text-sm font-semibold">
                        {isCameraOpen ? 'Camera Active' : 'HD Quality • Auto Focus'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button - Enhanced */}
          {selectedImage && !result && !loading && !isCameraOpen && (
            <div className="text-center mb-16">
              <div className="inline-block">
                <button
                  onClick={() => handleAnalyze()}
                  className="group relative px-16 py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white rounded-full font-bold text-2xl overflow-hidden shadow-2xl shadow-green-500/50 transform hover:scale-110 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span className="text-3xl">🔍</span>
                    <span>Analyze Image</span>
                    <span className="group-hover:translate-x-2 transition-transform text-3xl">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                {/* Info Text */}
                <p className="mt-4 text-gray-400 text-sm">
                  Our AI will identify the waste type and provide recycling instructions
                </p>
              </div>
            </div>
          )}

          {/* Loading State - Enhanced */}
          {loading && (
            <div className="max-w-2xl mx-auto my-16">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl text-center">
                <LoadingSpinner />
                <p className="text-2xl font-bold text-white mt-8 mb-4">
                  🤖 AI is analyzing your image...
                </p>
                <p className="text-gray-400 text-lg">
                  This usually takes 2-3 seconds
                </p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display - Enhanced */}
          {error && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-red-900/20 backdrop-blur-xl border-l-4 border-red-500 p-8 rounded-2xl shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">❌</div>
                  <div>
                    <h3 className="text-xl font-bold text-red-300 mb-2">Error Occurred</h3>
                    <p className="text-red-300 text-lg">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && !loading && (
            <div className="space-y-8">
              <ResultCard result={result} />
              
              <div className="text-center">
                <button 
                  onClick={handleReset} 
                  className="group px-12 py-5 bg-white/5 backdrop-blur-lg hover:bg-white/10 rounded-full font-bold text-lg transition-all border-2 border-white/10 hover:border-green-500/50 shadow-xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
                    <span>Scan Another Item</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Feature Cards - When no result */}
          {!result && !loading && !selectedImage && !isCameraOpen && (
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Why Choose EcoSort?</h2>
                <p className="text-gray-400 text-lg">Powered by advanced AI technology</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Results in under 3 seconds', color: 'from-yellow-500 to-orange-500' },
                  { icon: '🎯', title: '95% Accurate', desc: 'Industry-leading precision', color: 'from-blue-500 to-cyan-500' },
                  { icon: '🌍', title: 'Real Impact', desc: 'Track your contribution', color: 'from-green-500 to-emerald-500' }
                ].map((item, i) => (
                  <div key={i} className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-105">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4 transform group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Identifier;
