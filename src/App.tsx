import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import PrivateRoute from './components/PrivateRoute';

// Imports directs (Pages critiques pour le SEO/LCP)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

// Pages légales (import direct pour SEO)
import Legal from './pages/legal/Legal';
import CGU from './pages/legal/CGU';
import CGV from './pages/legal/CGV';
import Privacy from './pages/legal/Privacy';
import Cookies from './pages/legal/Cookies';

// Pages info (import direct car souvent visitées)
import FAQ from './pages/FAQ';
import ForWho from './pages/ForWho';
import Blog from './pages/Blog';

// Lazy loading (Pages secondaires)
const WasherLanding = lazy(() => import('./pages/WasherLanding'));
const BecomeWasher = lazy(() => import('./pages/BecomeWasher'));
const WasherApp = lazy(() => import('./pages/WasherApp'));
const Signup = lazy(() => import('./pages/Signup'));
const NewOrder = lazy(() => import('./pages/NewOrder'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Trouver = lazy(() => import('./pages/Trouver'));
const CityLanding = lazy(() => import('./pages/CityLanding'));
const SelectDashboard = lazy(() => import('./pages/SelectDashboard'));
const SelectSignup = lazy(() => import('./pages/SelectSignup'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SuperAccess = lazy(() => import('./pages/SuperAccess'));
const PartnerLanding = lazy(() => import('./pages/PartnerLanding'));
const BecomePartner = lazy(() => import('./pages/BecomePartner'));
const PartnerGuide = lazy(() => import('./pages/PartnerGuide'));
const PartnerPending = lazy(() => import('./pages/PartnerPending'));
const PartnerTerms = lazy(() => import('./pages/PartnerTerms'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));
const Referral = lazy(() => import('./pages/Referral'));
const ScanQR = lazy(() => import('./pages/ScanQR'));
const Settings = lazy(() => import('./pages/Settings'));
const SetPassword = lazy(() => import('./pages/SetPassword'));
const ConnectStripe = lazy(() => import('./pages/ConnectStripe'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const PickupQR = lazy(() => import('./pages/PickupQR'));
const Invoice = lazy(() => import('./pages/Invoice'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
      <p className="text-slate-600 font-medium">Chargement...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
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
          success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* === PUBLIC === */}
          <Route path="/" element={<Landing />} />
          
          {/* === WASHER (PIVOT C2C) === */}
          <Route path="/washers" element={<WasherLanding />} />
          <Route path="/become-washer" element={<BecomeWasher />} />
          <Route path="/washer-app" element={<PrivateRoute><WasherApp /></PrivateRoute>} />

          {/* === ONBOARDING === */}
          <Route path="/select-dashboard" element={<SelectDashboard />} />
          <Route path="/select-signup" element={<SelectSignup />} />
          
          {/* === AUTH === */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/reset-password" element={<UpdatePassword />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* === INFO PUBLIQUE === */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/trouver" element={<Trouver />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/pressing/:city" element={<CityLanding />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/for-who" element={<ForWho />} />

          {/* === CLIENT (PROTÉGÉ) === */}
          <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
          <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
          <Route path="/order/:orderId" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          <Route path="/pickup-qr/:orderId" element={<PrivateRoute><PickupQR /></PrivateRoute>} />
          <Route path="/invoice/:orderId" element={<PrivateRoute><Invoice /></PrivateRoute>} />

          {/* === PARTENAIRES (LEGACY B2B) === */}
          <Route path="/partner" element={<PartnerLanding />} />
          <Route path="/become-partner" element={<BecomePartner />} />
          <Route path="/partner-guide" element={<PartnerGuide />} />
          <Route path="/partner-pending" element={<PartnerPending />} />
          <Route path="/partner-terms" element={<PartnerTerms />} />
          <Route path="/partner-dashboard" element={<PrivateRoute><PartnerDashboard /></PrivateRoute>} />
          <Route path="/partner-app" element={<PrivateRoute><PartnerDashboard /></PrivateRoute>} />
          <Route path="/connect-stripe" element={<PrivateRoute><ConnectStripe /></PrivateRoute>} />

          {/* === PAIEMENT === */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* === ADMIN === */}
          <Route path="/admin/login" element={<SuperAccess />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/scan-qr" element={<ProtectedAdminRoute><ScanQR /></ProtectedAdminRoute>} />

          {/* === LEGAL === */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* === 404 === */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}
