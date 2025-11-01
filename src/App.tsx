import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function DashboardClient() {
  return <div className="p-8 text-center text-green-600">Dashboard Client ✅</div>;
}
function DashboardPartner() {
  return <div className="p-8 text-center text-blue-600">Dashboard Partenaire ✅</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-partner" element={<DashboardPartner />} />
      </Routes>
    </BrowserRouter>
  );
}
