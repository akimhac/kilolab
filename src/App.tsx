import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import PartnersMap from './pages/PartnersMap';
import Pricing from './pages/Pricing';
import BecomePartner from './pages/BecomePartner';
import Pricing from './pages/Pricing';
import ClientDashboard from './pages/ClientDashboard';
import Pricing from './pages/Pricing';
import PartnerDashboard from './pages/PartnerDashboard';
import Pricing from './pages/Pricing';
import CGU from './pages/legal/CGU';
import Pricing from './pages/Pricing';
import MentionsLegales from './pages/legal/MentionsLegales';
import Pricing from './pages/Pricing';
import Privacy from './pages/legal/Privacy';
import Pricing from './pages/Pricing';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/legal/cgu" element={<CGU />} />
        <Route path="/legal/mentions-legales" element={<MentionsLegales />} />
        <Route path="/legal/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
