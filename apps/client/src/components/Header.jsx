import React from 'react'
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <a href="/" className="font-bold tracking-tight">MyMentalHealthBuddy</a>
        <nav className="space-x-4 text-sm">
          <a className="hover:underline" href="/">Home</a>
          <a className="hover:underline" href="/help">Help</a>
          <a className="hover:underline" href="http://localhost:5000/health" target="_blank" rel="noreferrer">API</a>
        </nav>
      </div>
    </header>
  )
}
