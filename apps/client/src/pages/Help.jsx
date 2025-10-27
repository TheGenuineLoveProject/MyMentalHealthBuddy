import React from 'react'
import Header from '../components/Header.jsx'

export default function Help() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-3xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Gentle support</h2>
        <ul className="list-disc list-inside text-slate-700">
          <li>Try a slow breath: inhale 4s, exhale 6s, repeat x4.</li>
          <li>Write one kind thought about yourself.</li>
          <li>Reach a friend; you’re not alone.</li>
        </ul>
      </main>
    </div>
  )
}
