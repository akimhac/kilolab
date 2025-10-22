import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';

// Pages publiques
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { PartnersMap } from './pages/PartnersMap';
import { NotFound } from './pages/NotFound';

// Pages paiement (accessibles via redirect Stripe)
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancelled } from './pages/PaymentCancelled';

// Pages protégées - Client
import { ClientDashboard } from './pages/ClientDashboard';
import { NewOrder } from './pages/NewOrder';
import { OrderDetail } from './pages/OrderDetail';

// Pages protégées - Partenaire
import { PartnerDashboard } from './pages/PartnerDashboard';

/**
 * Router intelligent du Dashboard
 * Redirige automatiquement vers le bon dashboard selon le rôle de l'utilisateur
 */
function DashboardRouter() {
  const { user } = useAuth();

  // Sécurité supplémentaire (normalement déjà géré par ProtectedRoute)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirection selon le rôle
  if (user.role === 'partner') {
    return <PartnerDashboard />;
  }

  return <ClientDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Notifications toast globales */}
      <ToastContainer />

      <Routes>
        {/* ==================== ROUTES PUBLIQUES ==================== */}
        
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Carte des partenaires - Publique pour inscription pressings */}
        <Route path="/partners" element={<PartnersMap />} />

        {/* ==================== PAIEMENT STRIPE ==================== */}
        
        {/* 
          Pages de retour Stripe - Protégées pour sécurité 
          L'utilisateur doit être connecté pour accéder aux pages de paiement
        */}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute requireRole="client">
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-cancelled"
          element={
            <ProtectedRoute requireRole="client">
              <PaymentCancelled />
            </ProtectedRoute>
          }
        />

        {/* ==================== ROUTES PROTÉGÉES ==================== */}
        
        {/* Dashboard intelligent (client ou partenaire) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* ==================== ROUTES CLIENT UNIQUEMENT ==================== */}
        
        {/* Création de commande */}
        <Route
          path="/new-order"
          element={
            <ProtectedRoute requireRole="client">
              <NewOrder />
            </ProtectedRoute>
          }
        />
        
        {/* Détail d'une commande */}
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute requireRole="client">
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* ==================== PAGE 404 ==================== */}
        
        {/* Toute route non définie redirige vers 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}