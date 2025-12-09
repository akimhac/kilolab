import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages existantes
import LandingPage from './pages/LandingPage';
import PartnersMap from './pages/PartnersMap';
import BecomePartner from './pages/BecomePartner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewOrder from './pages/NewOrder';
import OrderTracking from './pages/OrderTracking';
import Pricing from './pages/Pricing';

// Placeholder pour les pages pas encore créées
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
    <h1 className="text-3xl font-bold mb-2">{title}</h1>
    <p className="text-slate-500">Bientôt disponible</p>
    <a href="/" className="mt-4 text-teal-600 hover:underline">← Retour à l'accueil</a>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Pages principales */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/partners-map" element={<PartnersMap />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboards */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/partner-dashboard" element={<PartnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Orders */}
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        
        {/* Pages à créer (placeholder) */}
        <Route path="/how-it-works" element={<Placeholder title="Comment ça marche" />} />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
        <Route path="/about" element={<Placeholder title="À Propos" />} />
        <Route path="/legal/cgu" element={<Placeholder title="Conditions Générales d'Utilisation" />} />
        <Route path="/legal/privacy" element={<Placeholder title="Politique de Confidentialité" />} />
        <Route path="/legal/cookies" element={<Placeholder title="Politique des Cookies" />} />
        
        {/* Fallback */}
        <Route path="*" element={<Placeholder title="Page non trouvée" />} />
      </Routes>
    </Router>
  );
}

export default App;
