/**
 * © 2025 Aaliyah Draws Art LLC – All rights reserved.
 * Built with GPT-40, MIT License, evidence-based mental health models.
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import HealingButton from '@/components/HealingButton'
import ServiceStatus from '@/components/service-status'

export default function Dashboard() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['api/services'],
    queryFn: async () => {
      const res = await fetch('/api/services')
      return res.json()
    },
    refetchInterval: 30000, // refresh every 30 seconds
  })

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            🧠 Welcome to MyMentalHealthBuddy 💖
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Self-healing, self-evolving AI Dashboard
          </p>
        </div>

        {/* ✅ Healing Button UI */}
        <div className="mb-8">
          <HealingButton />
        </div>

        {/* ✅ Service Status */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-system-status">
            🛠️ System Status
          </h2>
          <ServiceStatus services={services} loading={isLoading} />
        </div>

        {/* ✅ Terminal placeholder */}
        <div className="bg-blue-50 rounded-lg px-4 py-4 text-sm text-blue-800 border border-blue-300">
          <span>🧪 Terminal is ready…</span>
        </div>
      </div>
    </div>
  )
}