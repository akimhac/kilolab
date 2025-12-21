import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// On enlève <React.StrictMode> pour éviter les doubles initialisations qui font planter le site.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Toaster position="top-center" />
    <App />
  </BrowserRouter>
);
