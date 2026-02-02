import React from 'react';
import logo from '../assets/logo.svg';

export default function SacredNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow sacred-border">
      <img src={logo} alt="The Genuine Love Project" className="w-12 h-12 animate-pulse" />
      <ul className="flex space-x-6 text-deepTeal font-medium">
        <li><a href="#tools" className="hover:text-metallicGold">Toolkit</a></li>
        <li><a href="#about" className="hover:text-metallicGold">About</a></li>
        <li><a href="/login" className="text-metallicGold underline">Login</a></li>
      </ul>
    </nav>
  );
}