import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// No <StrictMode>: the reel engine is an imperative Web-Animations/DOM controller,
// and StrictMode's dev-only double-mount would init/destroy it twice. Production is
// unaffected either way; this keeps dev behaviour identical to the shipped build.
createRoot(document.getElementById('root')).render(<App />)
