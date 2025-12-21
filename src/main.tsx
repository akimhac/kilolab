// src/main.tsx

// DEBUG TEMP — affiche les crashs directement à l’écran (iPad-friendly)
// (À retirer une fois le bug trouvé)
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    try {
      document.body.innerHTML = `
<pre style="padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.4">
❌ JS ERROR:
${String((e as any)?.message || e)}
${String((e as any)?.filename || "")}:${String((e as any)?.lineno || "")}:${String((e as any)?.colno || "")}
</pre>`;
    } catch {}
  });

  window.addEventListener("unhandledrejection", (e: any) => {
    try {
      document.body.innerHTML = `
<pre style="padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.4">
❌ PROMISE REJECTION:
${String(e?.reason?.message || e?.reason || e)}
</pre>`;
    } catch {}
  });
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

// On enlève <React.StrictMode> pour éviter les doubles initialisations qui font planter le site.
const rootEl = document.getElementById("root");

if (!rootEl) {
  // Cas ultra rare mais ça évite un crash silencieux (page blanche)
  document.body.innerHTML = `
<pre style="padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.4">
❌ FATAL: #root introuvable dans index.html
</pre>`;
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.Fragment>
      <BrowserRouter>
        <Toaster position="top-center" />
        <App />
      </BrowserRouter>
    </React.Fragment>
  );
}