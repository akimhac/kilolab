import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import GoogleTagManager from './components/GoogleTagManager';

// Pages principales
import LandingPage from './pages/LandingPage';
import PartnersMap from './pages/PartnersMap';
import NewOrder from './pages/NewOrder';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BecomePartner from './pages/BecomePartner';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import VetementsDelicats from './pages/VetementsDelicats';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import FAQ from './pages/FAQ';

// Pages légales
import CGU from './pages/legal/CGU';
import Privacy from './pages/legal/Privacy';
import MentionsLegales from './pages/legal/MentionsLegales';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <GoogleTagManager />
        <Toaster position="top-right" />
        <Routes>
          {/* Pages principales */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/partners-map" element={<PartnersMap />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/vetements-delicats" element={<VetementsDelicats />} />
          
          {/* Paiement */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          
          {/* Pages légales */}
          <Route path="/legal/cgu" element={<CGU />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
