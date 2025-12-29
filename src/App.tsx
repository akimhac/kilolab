import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// ========================================
// PAGES LÉGÈRES (chargées immédiatement)
// ========================================
import Landing from './pages/Landing';
import Login from './pages/Login';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

// Legal
import Legal from './pages/legal/Legal';
import CGU from './pages/legal/CGU';
import Privacy from './pages/legal/Privacy';

// ========================================
// PAGES LOURDES (lazy loading)
// ========================================
const NewOrder = lazy(() => import('./pages/NewOrder'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Trouver = lazy(() => import('./pages/Trouver'));

// Dashboards
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Partenaires
const PartnerLanding = lazy(() => import('./pages/PartnerLanding'));
const BecomePartner = lazy(() => import('./pages/BecomePartner'));
const PartnerGuide = lazy(() => import('./pages/PartnerGuide'));

// Autres
const Referral = lazy(() => import('./pages/Referral'));
const SecretAdmin = lazy(() => import('./pages/SecretAdmin'));
const ScanQR = lazy(() => import('./pages/ScanQR'));
const Settings = lazy(() => import('./pages/Settings'));

// ========================================
// COMPOSANT DE CHARGEMENT
// ========================================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
      <p className="text-slate-600 font-medium">Chargement...</p>
    </div>
  </div>
);

// ========================================
// APP PRINCIPAL
// ========================================
function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontWeight: '600',
          },
        }}
      />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/trouver" element={<Trouver />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />

          {/* CLIENT */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/referral" element={<Referral />} />
          
          {/* PARTENAIRES */}
          <Route path="/partner" element={<PartnerLanding />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/partner-app" element={<PartnerDashboard />} />
          <Route path="/partner-guide" element={<PartnerGuide />} />
          
          {/* ADMIN */}
          <Route path="/admin-access" element={<SecretAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* OUTILS */}
          <Route path="/scan-qr" element={<ScanQR />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* LEGAL */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Privacy />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
