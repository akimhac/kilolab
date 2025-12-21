import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

// Pas de StrictMode (évite les doubles initialisations)
const rootEl = document.getElementById("root");

if (!rootEl) {
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
