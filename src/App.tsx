import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages principales
import LandingPage from './pages/LandingPage';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';
import PartnerLanding from './pages/PartnerLanding';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';

// Auth
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';

// Dashboards
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import UserProfile from './pages/UserProfile';

// Orders
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import ReviewOrder from './pages/ReviewOrder';
import PickupQR from './pages/PickupQR';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// Partner
import PartnerComingSoon from './pages/PartnerComingSoon';

// Content pages
import ForWho from './pages/ForWho';
import LaverVsPressing from './pages/LaverVsPressing';
import EconomiserPressing from './pages/EconomiserPressing';
import Referral from './pages/Referral';

// Legal
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MentionsLegales from './pages/MentionsLegales';

// 404
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Pages principales */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/partner-landing" element={<PartnerLanding />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/how-it-works" element={<ForWho />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboards */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/loyalty" element={<LoyaltyDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        
        {/* Orders */}
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/pickup-qr/:orderId" element={<PickupQR />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        
        {/* Partner */}
        <Route path="/partner-coming-soon" element={<PartnerComingSoon />} />
        
        {/* Content */}
        <Route path="/for-who" element={<ForWho />} />
        <Route path="/laver-vs-pressing" element={<LaverVsPressing />} />
        <Route path="/economiser-pressing" element={<EconomiserPressing />} />
        <Route path="/referral" element={<Referral />} />
        
        {/* Legal */}
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/cgu" element={<Legal />} />
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />
        <Route path="/legal/cookies" element={<Privacy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
