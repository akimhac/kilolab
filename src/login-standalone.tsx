import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './index.css';

function DashboardClient() { return <div className="p-8 text-center text-green-600">Dashboard Client ✅</div>; }
function DashboardPartner() { return <div className="p-8 text-center text-blue-600">Dashboard Partenaire ✅</div>; }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-partner" element={<DashboardPartner />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
