import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppErrorBoundary } from './App.jsx'
import ProductShell from './ProductShell.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><ProductShell /></AppErrorBoundary></React.StrictMode>)
