import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PromoPopup from './components/PromoPopup';
import CookieConsent from './components/CookieConsent';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PartnerLanding = lazy(() => import('./pages/PartnerLanding'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const NewOrder = lazy(() => import('./pages/NewOrder'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PartnersMap = lazy(() => import('./pages/PartnersMap'));
const CGV = lazy(() => import('./pages/CGV'));

const Loader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="text-white text-xl">Chargement...</div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<><LandingPage /><PromoPopup /><CookieConsent /></>} />
            <Route path="/partners" element={<PartnerLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/new-order" element={<NewOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/partners-map" element={<PartnersMap />} />
            <Route path="/cgv" element={<CGV />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}
