import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import NewOrder from './pages/NewOrder';
import PartnerLanding from './pages/PartnerLanding';
import BecomePartner from './pages/BecomePartner';
import Login from './pages/Login';
import Tarifs from './pages/Tarifs';
import Trouver from './pages/Trouver';
import SecretAdmin from './pages/SecretAdmin';
import AdminDashboard from './pages/AdminDashboard';
import Referral from './pages/Referral';
import ClientDashboard from './pages/ClientDashboard';
import ScanQR from './pages/ScanQR';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

// Legal
import Legal from './pages/legal/Legal';
import CGU from './pages/legal/CGU';
import Privacy from './pages/legal/Privacy';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/trouver" element={<Trouver />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/partner" element={<PartnerLanding />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/login" element={<Login />} />
        
        {/* ADMIN */}
        <Route path="/admin-access" element={<SecretAdmin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* OUTILS & AUTH */}
        <Route path="/scan-qr" element={<ScanQR />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* LEGAL */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Privacy />} />
      </Routes>
    </>
  );
}
export default App;
