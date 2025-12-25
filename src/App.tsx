import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages Principales
import Landing from './pages/Landing';
import NewOrder from './pages/NewOrder';
import Tarifs from './pages/Tarifs';
import Trouver from './pages/Trouver';
import Login from './pages/Login';

// Pages Clients
import ClientDashboard from './pages/ClientDashboard';
import Referral from './pages/Referral';

// Pages Partenaires (PRO) - AJOUTÉ ICI
import PartnerLanding from './pages/PartnerLanding'; // La page de vente B2B
import BecomePartner from './pages/BecomePartner';   // Le formulaire d'inscription
import PartnerDashboard from './pages/PartnerDashboard'; // <--- L'APP PRO (DASHBOARD)
import PartnerGuide from './pages/PartnerGuide';         // <--- LE GUIDE DE FORMATION

// Pages Admin
import SecretAdmin from './pages/SecretAdmin';
import AdminDashboard from './pages/AdminDashboard';

// Outils & Auth
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
        {/* --- PUBLIC --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/trouver" element={<Trouver />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />

        {/* --- CLIENT --- */}
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/referral" element={<Referral />} />
        
        {/* --- PARTENAIRES (PRO) --- */}
        <Route path="/partner" element={<PartnerLanding />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/partner-app" element={<PartnerDashboard />} /> {/* <--- NOUVELLE ROUTE */}
        <Route path="/partner-guide" element={<PartnerGuide />} />   {/* <--- NOUVELLE ROUTE */}
        
        {/* --- ADMIN --- */}
        <Route path="/admin-access" element={<SecretAdmin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* --- OUTILS --- */}
        <Route path="/scan-qr" element={<ScanQR />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* --- LEGAL --- */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Privacy />} />
      </Routes>
    </>
  );
}

export default App;
