import React, { useEffect, useState } from 'react'
export default function HealthBadge() {
  const [status, setStatus] = useState('checking…')
  useEffect(() => {
    fetch('http://localhost:5000/health').then(r => r.json()).then(
      () => setStatus('ok'),
      () => setStatus('offline')
    )
  },[])
  const color = status === 'ok' ? 'bg-green-500' : (status === 'offline' ? 'bg-red-500' : 'bg-yellow-500')
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-white ${color}`}>
      <span className="w-2 h-2 rounded-full bg-white/90"></span>
      <span className="text-sm">Server: {status}</span>
    </div>
  )
}
