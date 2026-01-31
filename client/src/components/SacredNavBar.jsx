import React from 'react';
import logo from '../../public/icons/logo-heart.svg'; // update to your actual logo path

export default function SacredNavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-softWhite bg-opacity-90 shadow-md backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Genuine Love Logo" className="h-10 w-10 animate-pulse-slow drop-shadow-glow" />
          <span className="font-serif text-xl text-deepTeal font-bold">The Genuine Love Project</span>
        </div>
        <div className="space-x-6 hidden md:flex text-charcoal font-sans">
          <a href="#tools" className="hover:text-deepTeal">Wellness Tools</a>
          <a href="#testimonials" className="hover:text-deepTeal">Testimonials</a>
          <a href="#onboarding" className="hover:text-deepTeal">Get Started</a>
        </div>
      </div>
    </nav>
  );
}