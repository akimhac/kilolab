#!/bin/bash

echo "🔧 CORRECTION DASHBOARD + CARTE..."
echo ""

# ============================================
# 1. RESTAURER ClientDashboard.tsx (version qui marchait)
# ============================================
echo "📝 1/2 - Restauration du ClientDashboard..."

cat > src/pages/ClientDashboard.tsx << 'DASHEOF'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Clock, CheckCircle, Box, LogOut } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  speed: string;
  weight_kg: number | null;
  price_gross_cents: number;
  created_at: string;
  partner?: {
    name: string;
  };
}

export default function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    ready: 0,
    completed: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          partner:partners(name)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      
      setStats({
        total: data?.length || 0,
        inProgress: data?.filter(o => o.status === 'in_progress').length || 0,
        ready: data?.filter(o => o.status === 'ready').length || 0,
        completed: data?.filter(o => o.status === 'delivered').length || 0,
      });
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending_weight: 'En attente de pesée',
      awaiting_payment: 'En attente de paiement',
      paid: 'Payé',
      in_progress: 'En cours',
      ready: 'Prêt',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  const getSpeedLabel = (speed: string) => {
    const labels: Record<string, string> = {
      premium: 'Premium (72-96h)',
      express: 'Express (24h)',
      ultra_express: 'Ultra Express (6h)',
    };
    return labels[speed] || speed;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mon espace client</h1>
            <p className="text-white/60">Bienvenue !</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/new-order"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              + Nouvelle commande
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <Package className="w-10 h-10 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">Commandes totales</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-yellow-400" />
              <div>
                <p className="text-white/60 text-sm">En cours</p>
                <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Prêt</p>
                <p className="text-3xl font-bold text-white">{stats.ready}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <Box className="w-10 h-10 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Terminées</p>
                <p className="text-3xl font-bold text-white">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Mes commandes</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-4">Vous n'avez pas encore de commande</p>
              <Link
                to="/new-order"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                + Créer ma première commande
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/order/${order.id}`}
                  className="block bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold mb-1">
                        Commande #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-white/60 text-sm mb-2">
                        {order.partner?.name || 'Partenaire non défini'}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-white/70">
                          {getSpeedLabel(order.speed)}
                        </span>
                        {order.weight_kg && (
                          <span className="text-white/70">
                            {order.weight_kg} kg
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm mb-2">
                        {getStatusLabel(order.status)}
                      </span>
                      <p className="text-white font-bold">
                        {(order.price_gross_cents / 100).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
DASHEOF

echo "✅ ClientDashboard restauré"

# ============================================
# 2. VÉRIFIER LA ROUTE /partners-map DANS App.tsx
# ============================================
echo "📝 2/2 - Vérification de la route carte..."

# Vérifier si la route existe
if ! grep -q 'path="/partners-map"' src/App.tsx; then
    echo "⚠️  Route manquante, ajout en cours..."
    
    # Ajouter l'import
    if ! grep -q "import PartnersMap" src/App.tsx; then
        sed -i '/import.*pages/a import PartnersMap from '"'"'./pages/PartnersMap'"'"';' src/App.tsx
    fi
    
    # Ajouter la route (après la route login)
    sed -i '/<Route path="\/login"/a \        <Route path="/partners-map" element={<PartnersMap />} />' src/App.tsx
    
    echo "✅ Route /partners-map ajoutée"
else
    echo "✅ Route /partners-map déjà présente"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CORRECTIONS TERMINÉES !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔄 Redémarre maintenant:"
echo "   npm run dev"
echo ""
echo "🌐 Puis teste:"
echo "   http://localhost:5173/partners-map"
echo ""
