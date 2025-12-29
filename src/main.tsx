import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

// ========================================
// INITIALISATION ANALYTICS
// ========================================
// Initialise window.dataLayer pour GTM
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  console.log('📊 Analytics initialized');
}

// ========================================
// RENDER APP
// ========================================
const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;background:#f8fafc;">
      <div style="text-align:center;padding:24px;background:white;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);max-width:500px;">
        <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
        <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin-bottom:8px;">Erreur de chargement</h1>
        <p style="color:#64748b;font-size:14px;">L'élément #root est introuvable dans index.html</p>
        <p style="color:#64748b;font-size:12px;margin-top:16px;">Contactez le support technique</p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.Fragment>
      <BrowserRouter>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: {
                primary: '#14b8a6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </React.Fragment>
  );
}
