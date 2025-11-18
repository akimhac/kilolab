import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CookieBanner from './components/CookieBanner';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import CGU from './pages/legal/CGU';
import MentionsLegales from './pages/legal/MentionsLegales';
import Privacy from './pages/legal/Privacy';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import NewOrder from './pages/NewOrder';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/legal/cgu" element={<CGU />} />
        <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
