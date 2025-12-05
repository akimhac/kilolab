// src/App.tsx
// Application principale avec toutes les routes

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages publiques
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';

// Dashboards
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Commandes
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import PartnerComingSoon from './pages/PartnerComingSoon';

// QR Code
import { ClientPickupQR, PartnerQRScanner } from './pages/PickupQR';

// Pages marketing (à créer si besoin)
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Blog from './pages/Blog';

// Pages légales (à créer si besoin)
// import CGU from './pages/legal/CGU';
// import Privacy from './pages/legal/Privacy';
// import MentionsLegales from './pages/legal/MentionsLegales';

// 404
// import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* Notifications toast */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
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
      
      <Routes>
        {/* ===== PAGES PUBLIQUES ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* ===== PRESSINGS ===== */}
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/partner-coming-soon" element={<PartnerComingSoon />} />
        
        {/* ===== DASHBOARDS ===== */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* ===== COMMANDES ===== */}
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        
        {/* ===== QR CODE / RETRAIT ===== */}
        <Route path="/pickup/:orderId" element={<ClientPickupQR />} />
        <Route path="/scanner" element={<PartnerQRScanner />} />
        
        {/* ===== PAGES MARKETING (décommenter quand créées) ===== */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/for-who" element={<ForWho />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
        
        {/* ===== PAGES LÉGALES (décommenter quand créées) ===== */}
        {/* <Route path="/legal/cgu" element={<CGU />} /> */}
        {/* <Route path="/legal/privacy" element={<Privacy />} /> */}
        {/* <Route path="/legal/mentions-legales" element={<MentionsLegales />} /> */}
        
        {/* ===== 404 ===== */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
