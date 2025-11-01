import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Clock, CheckCircle, Plus, LogOut, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  speed: string;
  weight_kg: number;
  price_gross_cents: number;
  created_at: string;
  partners?: {
    name: string;
    city: string;
  };
}

export default function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Vérifier l'authentification
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Non authentifié');
        navigate('/login');
        return;
      }

      console.log('✅ Utilisateur authentifié:', user.email);
      setUserEmail(user.email || '');

      // Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('❌ Erreur profil:', profileError);
        // Créer le profil s'il n'existe pas
        await supabase.from('user_profiles').insert({
          email: user.email,
          role: 'client',
          name: user.email?.split('@')[0],
        });
      }

      if (profile?.role === 'partner') {
        navigate('/partner-dashboard');
        return;
      }

      // Charger les commandes
      if (profile) {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            partners:partner_id (name, city)
          `)
          .eq('client_id', profile.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('❌ Erreur commandes:', ordersError);
        } else {
          setOrders(ordersData || []);
        }
      }

    } catch (error) {
      console.error('❌ Erreur:', error);
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
      paid: 'Payé - À traiter',
      in_progress: 'En cours',
      ready: 'Prêt à récupérer',
      delivered: 'Récupéré',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_weight: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      awaiting_payment: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      paid: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      in_progress: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      ready: 'bg-green-500/20 text-green-300 border-green-500/50',
      delivered: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const stats = {
    pending: orders.filter(o => o.status === 'pending_weight' || o.status === 'awaiting_payment').length,
    inProgress: orders.filter(o => o.status === 'paid' || o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'ready' || o.status === 'delivered').length,
    total: orders.length,
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mon Espace Client</h1>
            <p className="text-white/60">Gérez vos commandes de pressing</p>
            {userEmail && (
              <p className="text-white/40 text-sm mt-1">Connecté en tant que {userEmail}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/new-order')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle commande
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Package className="w-10 h-10 text-yellow-400 mb-2" />
            <p className="text-white/60 text-sm">En attente</p>
            <p className="text-3xl font-bold text-white">{stats.pending}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Clock className="w-10 h-10 text-blue-400 mb-2" />
            <p className="text-white/60 text-sm">En cours</p>
            <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
            <p className="text-white/60 text-sm">Terminées</p>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Package className="w-10 h-10 text-purple-400 mb-2" />
            <p className="text-white/60 text-sm">Total</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Mes commandes</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">Aucune commande pour le moment</p>
              <button
                onClick={() => navigate('/new-order')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all font-semibold"
              >
                Créer ma première commande
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-semibold text-lg mb-1">
                        Commande #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-white/60 text-sm">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-white/60 text-sm">Formule</p>
                      <p className="text-white font-medium capitalize">{order.speed}</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm">Poids</p>
                      <p className="text-white font-medium">{order.weight_kg} kg</p>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm">Prix</p>
                      <p className="text-white font-medium">
                        {(order.price_gross_cents / 100).toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  {order.partners && (
                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <p className="text-white/60 text-sm">Laverie partenaire</p>
                      <p className="text-white font-medium">
                        {order.partners.name} - {order.partners.city}
                      </p>
                    </div>
                  )}

                  {order.status === 'awaiting_payment' && (
                    <button
                      onClick={() => navigate(`/checkout?order_id=${order.id}`)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Payer maintenant
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
