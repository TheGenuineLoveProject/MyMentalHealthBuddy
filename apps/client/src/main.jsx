import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import App from './pages/App.jsx'
import Help from './pages/Help.jsx'
import NotFound from './pages/NotFound.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/help', element: <Help /> },
  { path: '*', element: <NotFound /> }
])

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
