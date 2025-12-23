import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import BecomePartner from './pages/BecomePartner';
import PartnerLanding from './pages/PartnerLanding';
import FindPressing from './pages/FindPressing';
import NewOrder from './pages/NewOrder';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SecretAdmin from './pages/SecretAdmin';
import ScanQR from './pages/ScanQR';
import Settings from './pages/Settings';
import Referral from './pages/Referral';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

// Pages Légales
import Legal from './pages/legal/Legal';
import CGU from './pages/legal/CGU';
import Privacy from './pages/legal/Privacy';

function App() {
  return (
    <Routes>
      {/* ROUTES PUBLIQUES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tarifs" element={<Landing />} />
      
      {/* PARTENAIRES */}
      <Route path="/partner" element={<PartnerLanding />} />
      <Route path="/become-partner" element={<BecomePartner />} />
      
      {/* CLIENT & COMMANDE */}
      <Route path="/trouver" element={<FindPressing />} />
      <Route path="/new-order" element={<NewOrder />} />
      
      {/* DASHBOARDS */}
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="/partner-dashboard" element={<PartnerDashboard />} />
      
      {/* ADMIN */}
      <Route path="/admin-access" element={<SecretAdmin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* OUTILS */}
      <Route path="/scan-qr" element={<ScanQR />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/referral" element={<Referral />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* MOT DE PASSE */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* LEGAL */}
      <Route path="/legal" element={<Legal />} />
      <Route path="/cgu" element={<CGU />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Privacy />} />
    </Routes>
  );
}

export default App;
