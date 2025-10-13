import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
    return () => window.removeEventListener('scroll', handleScroll);
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
      stats: '150K+ scans'
    },
    {
      icon: '♻️',
      title: 'Instant Results',
      description: 'Get disposal instructions and recycling tips in under 3 seconds',
      color: 'from-green-500 to-emerald-500',
      stats: '<3s response'
    },
    {
      icon: '🌍',
      title: 'Real Impact',
      description: 'Track your environmental contribution and CO₂ savings in real-time',
      color: 'from-purple-500 to-pink-500',
      stats: '2.5K tons CO₂'
    }
  ];

  const bins = [
    { name: 'Green Bin', color: '#10b981', items: ['Food waste', 'Garden waste', 'Compostable items'], icon: '🗑️' },
    { name: 'Blue Bin', color: '#3b82f6', items: ['Paper', 'Cardboard', 'Newspapers'], icon: '📄' },
    { name: 'Yellow Bin', color: '#eab308', items: ['Plastic bottles', 'Cans', 'Metal containers'], icon: '🥤' },
    { name: 'Red Bin', color: '#ef4444', items: ['General waste', 'Non-recyclables'], icon: '🚮' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Environmental Activist',
      text: 'EcoSort has transformed how our community recycles. The accuracy is incredible!',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'School Teacher',
      text: 'Perfect educational tool for teaching students about sustainable waste management.',
      avatar: '👨‍🏫',
      rating: 5
    },
    {
      name: 'Emma Williams',
      role: 'Homemaker',
      text: 'So easy to use! My kids love scanning items and learning about recycling.',
      avatar: '👩',
      rating: 5
    }
  ];

  return (
    <div className="bg-gray-950 text-white overflow-hidden">

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg shadow-green-500/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg shadow-green-500/30">
                ♻️
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                EcoSort
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Impact', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"/>
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/identifier')}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all"
              >
                Start Scanning →
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center"
            >
              <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 p-6 bg-gray-800 rounded-2xl space-y-4">
              {['Features', 'How It Works', 'Impact', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-gray-300 hover:text-green-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => navigate('/identifier')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-semibold"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(46, 204, 113, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            transform: `translateY(${scrollY * 0.3}px)`
          }}/>
        </div>

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-500/10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8 inline-block">
            <div className="text-8xl animate-bounce-slow">♻️</div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Smart Recycling
            </span>
            <br />
            <span className="text-white">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform waste into wonder with AI-powered material identification.
            <br className="hidden md:block"/>
            Scan, identify, and recycle correctly in <span className="text-green-400 font-semibold">seconds</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => navigate('/identifier')}
              className="group px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 transition-all flex items-center gap-3"
            >
              <span>Start Scanning Now</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-gray-800 hover:bg-gray-700 rounded-full font-bold text-lg transition-all border-2 border-gray-700 hover:border-green-500"
            >
              Learn More
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-400">95% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-400">3sec Response</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-400">150K+ Users</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => window.scrollBy({ top: 800, behavior: 'smooth' })}>
          <div className="w-6 h-10 border-2 border-green-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-green-500 rounded-full mt-2 animate-scroll"/>
          </div>
        </div>
      </section>

      {/* Features Section - Interactive Cards */}
      <section id="features" className="py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of recycling with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}/>
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-800 group-hover:border-green-500/50 transition-all duration-300 transform group-hover:scale-105">
                  <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                  <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 text-sm font-semibold`}>
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Steps */}
      <section id="how-it-works" className="py-32 px-4 scroll-animate bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to revolutionize your recycling habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', icon: '📸', title: 'Capture', desc: 'Take a photo or upload an image of your waste item' },
              { step: '02', icon: '🤖', title: 'Analyze', desc: 'Our AI identifies the material type in seconds' },
              { step: '03', icon: '♻️', title: 'Recycle', desc: 'Get instant disposal instructions and recycling tips' }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-green-500/10">
                  {item.step}
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-10 border-2 border-gray-800 group-hover:border-green-500/50 transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"/>
                  <div className="relative">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-4xl text-green-500/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Bin Guide */}
      <section className="py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Color-Coded Guide
            </h2>
            <p className="text-xl text-gray-400">
              Click on any bin to see what goes inside
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {bins.map((bin, index) => (
              <div
                key={index}
                onClick={() => setSelectedBin(selectedBin === index ? null : index)}
                className="cursor-pointer group"
              >
                <div className={`bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 ${
                  selectedBin === index 
                    ? 'border-green-500 scale-105' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl"
                    style={{ backgroundColor: bin.color }}
                  >
                    {bin.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4 text-white">{bin.name}</h3>
                  <div className={`transition-all duration-300 overflow-hidden ${
                    selectedBin === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-3 font-semibold">Accepted Items:</p>
                      <ul className="space-y-2">
                        {bin.items.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-32 px-4 scroll-animate bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Real-Time Impact
            </h2>
            <p className="text-xl text-gray-400">
              Together, we\'re making a measurable difference
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: itemsRecycled.toLocaleString(), label: 'Items Recycled', icon: '♻️', color: 'from-green-500 to-emerald-500' },
              { value: `${co2Saved.toLocaleString()}+`, label: 'Tons CO₂ Saved', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
              { value: `${waterSaved.toLocaleString()}L`, label: 'Water Conserved', icon: '💧', color: 'from-blue-400 to-blue-600' },
              { value: `${treesPlanted.toLocaleString()}+`, label: 'Trees Equivalent', icon: '🌳', color: 'from-green-600 to-green-400' }
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}/>
                <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-800 group-hover:border-green-500/50 transition-all transform group-hover:scale-105 text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Loved by Users
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands making a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-500 ${
                  activeTestimonial === index 
                    ? 'border-green-500 scale-105' 
                    : 'border-gray-800'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed italic">
                  \"{testimonial.text}\"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 scroll-animate">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-3xl opacity-20"/>
            <div className="relative bg-gray-900/70 backdrop-blur-sm rounded-3xl p-12 md:p-20 border-2 border-green-500/30 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Ready to Make a
                <br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Real Difference?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join 150,000+ users making a real environmental impact.
                <br/>
                It\'s free, fast, and makes a difference.
              </p>
              <button
                onClick={() => navigate('/identifier')}
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 transition-all inline-flex items-center gap-3"
              >
                <span>Start Your Journey</span>
                <span className="text-2xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl">
                  ♻️
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  EcoSort
                </span>
              </div>
              <p className="text-gray-400">
                Making recycling smarter, one scan at a time.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 EcoSort. AI-powered waste identification for a sustainable future 🌱</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
