import React from 'react'
export default function App(){
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">MyMentalHealthBuddy</h1>
      <p className="text-slate-600">Gentle tools. No medical advice—just support.</p>
      <a className="btn" href="/help">Help</a>
      <p className="text-sm text-slate-500">API health: <a className="underline" href="http://localhost:5000/health" target="_blank">/health</a></p>
    </main>
  )
}
