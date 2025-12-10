import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Pages principales
import LandingPage from './pages/LandingPage';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import ForWho from './pages/ForWho';

// Auth
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboards
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PartnerPending from './pages/PartnerPending';

// Orders
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import PickupQR from './pages/PickupQR';

// Partner
import PartnerComingSoon from './pages/PartnerComingSoon';

// Legal
import Legal from './pages/Legal';

// 404
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Pages principales */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/partners-map" element={<PartnersMap />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/how-it-works" element={<ForWho />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboards */}
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/partner-pending" element={<PartnerPending />} />
          
          {/* Orders */}
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />
          <Route path="/pickup-qr/:orderId" element={<PickupQR />} />
          
          {/* Partner - Pour les CLIENTS qui voient un pressing pas encore validé */}
          <Route path="/partner-coming-soon" element={<PartnerComingSoon />} />
          
          {/* Legal */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/legal/cgu" element={<Legal />} />
          <Route path="/legal/privacy" element={<Legal />} />
          <Route path="/privacy" element={<Legal />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
