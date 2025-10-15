import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);

  // Animated Counter Hook
  const useCounter = (end, duration = 2000, trigger = true) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!trigger) return;
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [end, duration, trigger]);

    return count;
  };

  const [statsVisible, setStatsVisible] = useState(false);
  const itemsRecycled = useCounter(150000, 2500, statsVisible);
  const co2Saved = useCounter(2500, 2500, statsVisible);
  const waterSaved = useCounter(95000, 2500, statsVisible);
  const treesPlanted = useCounter(12000, 2500, statsVisible);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          if (entry.target.classList.contains('stats-section')) {
            setStatsVisible(true);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(testimonialTimer);
  }, []);

  const features = [
    {
      icon: '📸',
      title: 'Smart Scanning',
      description: 'AI-powered image recognition identifies materials instantly with 95% accuracy',
      color: 'from-blue-500 to-cyan-500',
      stats: '150K+ scans',
      gradient: 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/20'
    },
    {
      icon: '♻️',
      title: 'Instant Results',
      description: 'Get disposal instructions and recycling tips in under 3 seconds',
      color: 'from-green-500 to-emerald-500',
      stats: '<3s response',
      gradient: 'bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20'
    },
    {
      icon: '🌍',
      title: 'Real Impact',
      description: 'Track your environmental contribution and CO₂ savings in real-time',
      color: 'from-purple-500 to-pink-500',
      stats: '2.5K tons CO₂',
      gradient: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20'
    }
  ];

  const bins = [
    { 
      name: 'Green Bin', 
      color: '#10b981', 
      items: ['Food waste', 'Garden waste', 'Compostable items'], 
      icon: '🗑️',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    { 
      name: 'Blue Bin', 
      color: '#3b82f6', 
      items: ['Paper', 'Cardboard', 'Newspapers'], 
      icon: '📄',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    { 
      name: 'Yellow Bin', 
      color: '#eab308', 
      items: ['Plastic bottles', 'Cans', 'Metal containers'], 
      icon: '🥤',
      bgGradient: 'from-yellow-500/10 to-amber-500/10'
    },
    { 
      name: 'Red Bin', 
      color: '#ef4444', 
      items: ['General waste', 'Non-recyclables'], 
      icon: '🚮',
      bgGradient: 'from-red-500/10 to-rose-500/10'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Environmental Activist',
      text: 'EcoSort has transformed how our community recycles. The accuracy is incredible!',
      avatar: '👩‍💼',
      rating: 5,
      company: 'Green Earth Foundation'
    },
    {
      name: 'Mike Chen',
      role: 'School Teacher',
      text: 'Perfect educational tool for teaching students about sustainable waste management.',
      avatar: '👨‍🏫',
      rating: 5,
      company: 'Riverside High School'
    },
    {
      name: 'Emma Williams',
      role: 'Homemaker',
      text: 'So easy to use! My kids love scanning items and learning about recycling.',
      avatar: '👩',
      rating: 5,
      company: 'Home User'
    }
  ];

  return (
    <div className="bg-gray-950 text-white overflow-hidden relative">

      {/* Navigation Bar - Glassmorphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-green-500/5 border-b border-white/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

            <div className="hidden md:flex items-center gap-1 bg-gray-800/50 backdrop-blur-sm rounded-full p-2 border border-white/5">
              {['Features', 'How It Works', 'Impact', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-5 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 font-medium text-sm relative group"
                >
                  {item}
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"/>
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/identifier')}
                className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold overflow-hidden shadow-lg shadow-green-500/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Scanning 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/5 flex items-center justify-center hover:bg-gray-700/50 transition-all"
            >
              <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 p-6 bg-gray-800/80 backdrop-blur-xl rounded-2xl space-y-3 border border-white/5 animate-fade-in">
              {['Features', 'How It Works', 'Impact', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-gray-300 hover:text-green-400 hover:bg-white/5 transition-all py-3 px-4 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => navigate('/identifier')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold mt-2 shadow-lg shadow-green-500/30"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Enhanced with Glassmorphism */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)',
            backgroundSize: '48px 48px',
            transform: `translateY(${scrollY * 0.2}px)`
          }}/>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Hero Badge */}
          <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">95% Accuracy • 150K+ Active Users</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
            <span className="inline-block animate-fade-in-up">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-2xl">
                Smart Recycling
              </span>
            </span>
            <br />
            <span className="inline-block animate-fade-in-up text-white" style={{ animationDelay: '0.2s' }}>
              Made 
              <span className="relative inline-block mx-4">
                <span className="relative z-10">Simple</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-gradient-to-r from-green-500/40 to-emerald-500/40 blur-sm"></span>
              </span>
            </span>
          </h1>

          {/* Subtitle with Glassmorphism */}
          <div className="max-w-4xl mx-auto mb-12 p-8 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Transform waste into wonder with <span className="text-green-400 font-semibold">AI-powered</span> material identification.
              <br className="hidden md:block"/>
              Scan, identify, and recycle correctly in <span className="relative inline-block">
                <span className="text-green-400 font-bold">seconds</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></span>
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button
              onClick={() => navigate('/identifier')}
              className="group relative px-12 py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full font-bold text-lg overflow-hidden shadow-2xl shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <span>Start Scanning Now</span>
                <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="group px-12 py-6 bg-white/5 backdrop-blur-lg hover:bg-white/10 rounded-full font-bold text-lg transition-all border-2 border-white/10 hover:border-green-500/50 shadow-xl"
            >
              <span className="flex items-center gap-3">
                Explore Features
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </span>
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '✓', text: '95% Accuracy', color: 'from-green-500 to-emerald-500' },
              { icon: '⚡', text: '3sec Response', color: 'from-blue-500 to-cyan-500' },
              { icon: '🌍', text: '150K+ Users', color: 'from-purple-500 to-pink-500' },
              { icon: '🔒', text: 'Privacy First', color: 'from-orange-500 to-red-500' }
            ].map((pill, i) => (
              <div 
                key={i}
                className="group px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl bg-gradient-to-r ${pill.color} bg-clip-text text-transparent`}>{pill.icon}</span>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{pill.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Glassmorphism Cards */}
      <section id="features" className="py-32 px-6 scroll-animate relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full">
              <span className="text-green-400 font-semibold text-sm">✨ POWERFUL CAPABILITIES</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Built for Excellence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience the future of recycling with cutting-edge AI technology that delivers real results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500`}/>
                
                {/* Main Card - Glassmorphism */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="mb-8 inline-block">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 mb-8 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Stats Badge */}
                    <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 border border-white/10`}>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} animate-pulse`} />
                      <span className="text-sm font-bold text-white">{feature.stats}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <button 
              onClick={() => navigate('/identifier')}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-lg border border-white/10 hover:border-green-500/50 rounded-full transition-all hover:bg-white/10"
            >
              <span className="font-semibold text-lg">See It In Action</span>
              <span className="text-green-400 group-hover:translate-x-2 transition-transform text-xl">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Step Flow */}
      <section id="how-it-works" className="py-32 px-6 scroll-animate relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full">
              <span className="text-blue-400 font-semibold text-sm">⚡ SIMPLE PROCESS</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Three Steps to Impact
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Revolutionary recycling made accessible to everyone
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-500/20 via-emerald-500/40 to-green-500/20 -translate-y-1/2 rounded-full"></div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { 
                  step: '01', 
                  icon: '📸', 
                  title: 'Capture', 
                  desc: 'Take a photo or upload an image of your waste item using our smart camera interface',
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  step: '02', 
                  icon: '🤖', 
                  title: 'Analyze', 
                  desc: 'Our advanced AI identifies the material type and composition in under 3 seconds',
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  step: '03', 
                  icon: '♻️', 
                  title: 'Recycle', 
                  desc: 'Get instant disposal instructions, environmental impact data, and recycling tips',
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  {/* Step Number Background */}
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-8xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent opacity-10 group-hover:opacity-20 transition-opacity`}>
                    {item.step}
                  </div>

                  {/* Card */}
                  <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-4 shadow-2xl">
                    {/* Gradient Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
                    
                    <div className="relative z-10">
                      {/* Step Number Badge */}
                      <div className="mb-6 inline-flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-sm`}>
                          STEP {item.step}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`w-24 h-24 mb-8 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                        {item.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-3xl font-bold mb-5 text-white text-center group-hover:text-green-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 text-lg leading-relaxed text-center">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Arrow Connector */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                      <div className={`text-5xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent animate-pulse`}>
                        →
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bin Guide - Enhanced */}
      <section className="py-32 px-6 scroll-animate relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full">
              <span className="text-purple-400 font-semibold text-sm">🎨 INTERACTIVE GUIDE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Color-Coded System
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Click any bin to discover what belongs inside
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {bins.map((bin, index) => (
              <div
                key={index}
                onClick={() => setSelectedBin(selectedBin === index ? null : index)}
                className="cursor-pointer group"
              >
                <div className={`relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 ${
                  selectedBin === index 
                    ? 'border-white/30 scale-105 shadow-2xl' 
                    : 'border-white/10 hover:border-white/20'
                }`}>
                  {/* Colored Glow */}
                  <div 
                    className={`absolute inset-0 rounded-3xl blur-2xl opacity-0 ${selectedBin === index ? 'opacity-30' : 'group-hover:opacity-20'} transition-all duration-500`}
                    style={{ backgroundColor: bin.color }}
                  />

                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div
                      className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-2xl"
                      style={{ 
                        backgroundColor: bin.color,
                        boxShadow: `0 20px 40px ${bin.color}40`
                      }}
                    >
                      {bin.icon}
                    </div>

                    {/* Bin Name */}
                    <h3 className="text-2xl font-bold text-center mb-2 text-white">
                      {bin.name}
                    </h3>

                    {/* Click Indicator */}
                    <p className="text-center text-gray-500 text-sm mb-4">
                      {selectedBin === index ? 'Click to close' : 'Click to explore'}
                    </p>

                    {/* Expandable Content */}
                    <div className={`transition-all duration-500 overflow-hidden ${
                      selectedBin === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-4 font-semibold uppercase tracking-wide">
                          Accepted Items:
                        </p>
                        <ul className="space-y-3">
                          {bin.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: bin.color }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism */}
      <section className="stats-section py-32 px-6 scroll-animate relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}/>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full">
              <span className="text-green-400 font-semibold text-sm">📊 LIVE METRICS</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Real-Time Impact
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Together, we're creating measurable environmental change
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                value: itemsRecycled.toLocaleString(), 
                label: 'Items Recycled', 
                icon: '♻️', 
                color: 'from-green-500 to-emerald-500',
                description: 'Waste diverted'
              },
              { 
                value: `${co2Saved.toLocaleString()}`, 
                label: 'Tons CO₂ Saved', 
                icon: '🌍', 
                color: 'from-blue-500 to-cyan-500',
                description: 'Carbon offset'
              },
              { 
                value: `${waterSaved.toLocaleString()}L`, 
                label: 'Water Conserved', 
                icon: '💧', 
                color: 'from-blue-400 to-blue-600',
                description: 'Resource saved'
              },
              { 
                value: `${treesPlanted.toLocaleString()}`, 
                label: 'Trees Equivalent', 
                icon: '🌳', 
                color: 'from-green-600 to-green-400',
                description: 'Forest impact'
              }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500`}/>
                
                {/* Card */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl text-center">
                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}>
                    {stat.icon}
                  </div>

                  {/* Value */}
                  <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-white font-semibold text-lg mb-2">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-gray-400 text-sm">
                    {stat.description}
                  </div>

                  {/* Pulse Indicator */}
                  <div className="mt-6 flex justify-center items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${stat.color} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r ${stat.color}`}></span>
                    </div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Live</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced Cards */}
      <section id="testimonials" className="py-32 px-6 scroll-animate relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-block mb-4 px-6 py-2 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-full">
              <span className="text-yellow-400 font-semibold text-sm">⭐ USER REVIEWS</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Loved Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands making a real difference every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl ${
                  activeTestimonial === index 
                    ? 'border-green-500/50 scale-105' 
                    : 'border-white/10'
                }`}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-0 ${
                  activeTestimonial === index ? 'opacity-30' : 'group-hover:opacity-20'
                } transition-all duration-500`}/>

                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    "
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6 justify-end">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-300 group-hover:text-white mb-8 leading-relaxed text-lg italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-green-400 mt-1">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? 'w-12 bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Hero Style */}
      <section className="py-32 px-6 scroll-animate relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-green-500/5 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="relative">
            {/* Glassmorphism Card */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-[3rem] p-16 md:p-24 border-2 border-white/10 shadow-2xl overflow-hidden">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 opacity-50"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

              <div className="relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-white">Join 150,000+ Active Users</span>
                </div>

                {/* Headline */}
                <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Ready to Make
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                    Real Impact?
                  </span>
                </h2>

                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Start your sustainable journey today. Free forever, lightning fast,
                  <br className="hidden md:block"/>
                  and backed by cutting-edge AI technology.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                  <button
                    onClick={() => navigate('/identifier')}
                    className="group relative px-14 py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full font-bold text-xl overflow-hidden shadow-2xl shadow-green-500/50 transform hover:scale-110 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <span>Start Your Journey</span>
                      <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/10">
                  {[
                    { icon: '⚡', text: 'Instant Setup' },
                    { icon: '🔒', text: '100% Private' },
                    { icon: '🆓', text: 'Always Free' },
                    { icon: '🌍', text: 'Global Impact' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-400">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern Design */}
      <footer className="relative bg-gradient-to-b from-transparent to-gray-900/50 border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-xl">
                  ♻️
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    EcoSort
                  </span>
                  <p className="text-xs text-gray-500">AI-Powered Recycling</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Making recycling smarter, one scan at a time. Join our mission to create a sustainable future through innovative technology.
              </p>
              <div className="flex gap-4">
                {['🐦', '📘', '📷', '💼'].map((icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 hover:bg-white/10 flex items-center justify-center text-2xl transition-all transform hover:scale-110"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'API Access'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-green-400 group-hover:w-4 transition-all"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Press Kit'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-green-400 group-hover:w-4 transition-all"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Legal</h4>
              <ul className="space-y-3">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-green-400 group-hover:w-4 transition-all"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 EcoSort. AI-powered waste identification for a sustainable future 🌱
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-gray-500">for the planet</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); }
          30% { transform: translateY(8px); }
          100% { transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }

        .scroll-animate.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </div>
  );
};

export default Home;
