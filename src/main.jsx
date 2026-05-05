import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'flag-icons/css/flag-icons.min.css';

// ============================================================================
// REGISTRAR SERVICE WORKER (PWA)
// ============================================================================
// Solo registramos el SW en producción (no en StackBlitz)
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
      })
      .catch((error) => {
        console.warn('⚠️ Error registrando Service Worker:', error);
      });
  });
}

// ============================================================================
// MONTAR LA APP REACT
// ============================================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);