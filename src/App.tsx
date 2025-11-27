// src/App.tsx
// Application principale avec toutes les routes

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';

// Components
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';

// Pages principales
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';

// Dashboards
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Commandes
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import ReviewOrder from './pages/ReviewOrder';
import { ClientPickupQR, PartnerQRScanner } from './pages/PickupQR';

// Pages marketing
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ForWho from './pages/ForWho';
import Referral from './pages/Referral';

// Blog
import Blog from './pages/Blog';
import EconomiserPressing from './pages/blog/EconomiserPressing';
import LaverVsPressing from './pages/blog/LaverVsPressing';
import VetementsDelicats from './pages/blog/VetementsDelicats';

// Pages légales
import CGU from './pages/legal/CGU';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';

// 404
import NotFound from './pages/NotFound';

// Analytics
import { initializeGA, trackPageView } from './services/analytics';

function App() {
  // Initialiser Google Analytics au montage
  useEffect(() => {
    initializeGA();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Notifications toast */}
        <Toaster 
          position="top-right"
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
        
        {/* Banner cookies RGPD */}
        <CookieBanner />
        
        {/* Scroll to top on navigation */}
        <ScrollToTop />
        
        <Routes>
          {/* ===== PAGES PUBLIQUES ===== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* ===== PRESSINGS ===== */}
          <Route path="/partners-map" element={<PartnersMap />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          
          {/* ===== DASHBOARDS ===== */}
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* ===== COMMANDES ===== */}
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />
          <Route path="/review/:orderId" element={<ReviewOrder />} />
          
          {/* ===== QR CODE / RETRAIT ===== */}
          <Route path="/pickup/:orderId" element={<ClientPickupQR />} />
          <Route path="/scanner" element={<PartnerQRScanner />} />
          
          {/* ===== MARKETING ===== */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/for-who" element={<ForWho />} />
          <Route path="/referral" element={<Referral />} />
          
          {/* ===== BLOG ===== */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/economiser-pressing" element={<EconomiserPressing />} />
          <Route path="/blog/laver-vs-pressing" element={<LaverVsPressing />} />
          <Route path="/blog/vetements-delicats" element={<VetementsDelicats />} />
          
          {/* ===== LEGAL ===== */}
          <Route path="/legal/cgu" element={<CGU />} />
          <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          
          {/* ===== 404 ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
