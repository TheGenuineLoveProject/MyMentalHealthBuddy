import React from 'react'
export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">404 — Page not found</h1>
        <p className="text-slate-600 mt-2"><a className="underline" href="/">Go back home</a></p>
      </div>
    </div>
  )
}
