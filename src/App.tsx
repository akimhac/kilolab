import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async'; // ✅ AJOUT SEO

// ========================================
// PAGES CORE
// ========================================
import Landing from './pages/Landing';
import Login from './pages/Login';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

// Legal
import Legal from './pages/legal/Legal';
import CGU from './pages/legal/CGU';
import CGV from './pages/legal/CGV';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';

// Info / SEO
import FAQ from './pages/FAQ';
import ForWho from './pages/ForWho';
import Blog from './pages/Blog';

// ========================================
// LAZY LOADING
// ========================================
const NewOrder = lazy(() => import('./pages/NewOrder'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Trouver = lazy(() => import('./pages/Trouver'));
const CityLanding = lazy(() => import('./pages/CityLanding')); // ✅ AJOUT SEO

// Dashboards
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Partenaires
const PartnerLanding = lazy(() => import('./pages/PartnerLanding'));
const BecomePartner = lazy(() => import('./pages/BecomePartner'));
const PartnerGuide = lazy(() => import('./pages/PartnerGuide'));
const PartnerPending = lazy(() => import('./pages/PartnerPending'));

// Paiement
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));

// Autres
const Referral = lazy(() => import('./pages/Referral'));
const ScanQR = lazy(() => import('./pages/ScanQR'));
const Settings = lazy(() => import('./pages/Settings'));
const SecretAdmin = lazy(() => import('./pages/SecretAdmin'));

// ========================================
// LOADER
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
// APP
// ========================================
export default function App() {
  return (
    <HelmetProvider> {/* ✅ AJOUT SEO : Wrapper obligatoire */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6',
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

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/trouver" element={<Trouver />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* ✅ AJOUT SEO : Route dynamique villes */}
          <Route path="/pressing/:city" element={<CityLanding />} />

          {/* SEO / INFO */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/for-who" element={<ForWho />} />
          <Route path="/blog" element={<Blog />} />

          {/* AUTH */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* CLIENT */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/referral" element={<Referral />} />

          {/* PARTENAIRES */}
          <Route path="/partner" element={<PartnerLanding />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/partner-app" element={<PartnerDashboard />} />
          <Route path="/partner-guide" element={<PartnerGuide />} />
          <Route path="/partner-pending" element={<PartnerPending />} />

          {/* PAIEMENT */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* ADMIN */}
          <Route path="/admin-access" element={<SecretAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* OUTILS */}
          <Route path="/scan-qr" element={<ScanQR />} />

          {/* LEGAL */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* FALLBACK */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}
