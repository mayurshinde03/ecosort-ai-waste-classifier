import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">♻️</div>
            <div>
              <h1 className="text-3xl font-bold">RecycleBuddy</h1>
              <p className="text-sm text-green-100">Smart Recycle Identifier</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-green-200 transition">Home</a>
            <a href="#about" className="hover:text-green-200 transition">About</a>
            <a href="#guide" className="hover:text-green-200 transition">Guide</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
