import React from 'react'
import Header from '../components/Header.jsx'
import HealthBadge from '../components/HealthBadge.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl p-6 space-y-6">
        <section className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">Welcome to MyMentalHealthBuddy</h1>
          <p className="mt-2 text-slate-600">
            A gentle place with simple tools. No medical advice here—just support.
          </p>
          <div className="mt-4">
            <a className="btn" href="/help">Need help now?</a>
          </div>
        </section>
        <HealthBadge />
      </main>
      <footer className="text-center text-xs text-slate-500 py-6">
        Crisis? Call <a className="underline" href="tel:988">988</a> (US) or your local emergency number.
      </footer>
    </div>
  )
}
