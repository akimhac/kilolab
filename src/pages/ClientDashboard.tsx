import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Clock, CheckCircle, XCircle, ArrowLeft, Gift, Star, TrendingUp, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { loyaltyService, LoyaltyPoints } from '../services/loyaltyService';

interface Order {
  id: string;
  partner_id: string;
  weight_kg: number;
  service_type: string;
  total_amount: number;
  status: string;
  created_at: string;
  partners: {
    name: string;
    address: string;
    city: string;
  };
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPoints | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; orderId: string | null}>({
    isOpen: false,
    orderId: null
  });
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    loadOrders(session.user.id);
    loadLoyaltyData(session.user.id);
  };

  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          partners (name, address, city)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);

      // Charger les avis pour chaque commande terminée
      if (data && data.length > 0) {
        const completedOrders = data.filter(o => o.status === 'completed');
        const reviewChecks = await Promise.all(
          completedOrders.map(async (order) => {
            const reviewed = await checkIfReviewed(order.id);
            return { orderId: order.id, reviewed };
          })
        );
        const reviewed = new Set(
          reviewChecks.filter(r => r.reviewed).map(r => r.orderId)
        );
        setReviewedOrders(reviewed);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Impossible de charger vos commandes. Réessayez dans quelques instants.');
    } finally {
      setLoading(false);
    }
  };

  const loadLoyaltyData = async (userId: string) => {
    const points = await loyaltyService.getUserPoints(userId);
    setLoyaltyData(points);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'confirmed': return <Package className="w-5 h-5 text-blue-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-purple-500" />;
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      in_progress: 'En cours',
      ready: 'Prête',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      standard: 'Standard (48-72h)',
      express: 'Express (24h)'
    };
    return labels[type] || type;
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('status', 'pending');

      if (error) throw error;
      
      toast.success('Commande annulée avec succès');
      if (user) loadOrders(user.id);
    } catch (error: any) {
      toast.error('Impossible d\'annuler cette commande. Elle a peut-être déjà été traitée.');
    } finally {
      setConfirmDialog({ isOpen: false, orderId: null });
    }
  };

  const checkIfReviewed = async (orderId: string) => {
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', orderId)
      .single();

    return !!data;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  // Calculer les stats
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const nextTierInfo = loyaltyData ? loyaltyService.getNextTierInfo(loyaltyData.tier, loyaltyData.lifetime_points) : null;
  const tierIcon = loyaltyData ? loyaltyService.getTierIcon(loyaltyData.tier) : '🥉';
  const tierColor = loyaltyData ? loyaltyService.getTierColor(loyaltyData.tier) : 'from-slate-400 to-slate-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/referral')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-xl transition"
            >
              <Gift className="w-5 h-5" />
              Parrainage
            </button>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
              className="text-slate-600 hover:text-slate-900 transition font-semibold"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Mon espace
          </h1>
          <p className="text-slate-600">
            Bienvenue {user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total commandes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Commandes</p>
                <p className="text-3xl font-black text-slate-900">{orders.length}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Dont {completedOrders.length} terminées
            </p>
          </div>

          {/* Total dépensé */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total dépensé</p>
                <p className="text-3xl font-black text-slate-900">{totalSpent.toFixed(0)}€</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Depuis le début
            </p>
          </div>

          {/* Programme fidélité */}
          {loyaltyData && (
            <div className={`bg-gradient-to-br ${tierColor} rounded-2xl p-6 shadow-lg text-white lg:col-span-1 md:col-span-2`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{tierIcon}</div>
                  <div>
                    <p className="text-white/80 text-sm">Programme Fidélité</p>
                    <p className="text-2xl font-black">{loyaltyData.points} points</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/loyalty')}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-bold transition text-sm"
                >
                  Voir mes récompenses
                </button>
              </div>
              
              {!nextTierInfo?.isMaxTier && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/80">Progression vers {nextTierInfo?.name?.toUpperCase()}</span>
                    <span className="text-white/80">{nextTierInfo?.pointsNeeded} points restants</span>
                  </div>
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((loyaltyData.lifetime_points / (loyaltyData.lifetime_points + (nextTierInfo?.pointsNeeded || 1))) * 100))}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/partners-map')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Nouvelle commande
          </button>
          <button
            onClick={() => navigate('/loyalty')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Mes récompenses
          </button>
          <button
            onClick={() => navigate('/referral')}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl p-6 font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Parrainer un ami
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Mes commandes</h2>
          
          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucune commande"
              description="Vous n'avez pas encore passé de commande. Trouvez un pressing près de chez vous pour commencer."
              actionLabel="Trouver un pressing"
              onAction={() => navigate('/partners-map')}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-lg text-slate-900">
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {getServiceLabel(order.service_type)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500">Pressing</p>
                      <p className="font-semibold text-slate-900">{order.partners.name}</p>
                      <p className="text-sm text-slate-600">{order.partners.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Détails</p>
                      <p className="font-semibold text-slate-900">{order.weight_kg} kg</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-2xl font-black text-blue-600">
                      {order.total_amount.toFixed(2)}€
                    </div>
                    <div className="flex gap-3">
                      {order.status === 'completed' && !reviewedOrders.has(order.id) && (
                        <button
                          onClick={() => navigate(`/review/${order.id}`)}
                          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Laisser un avis
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => setConfirmDialog({ isOpen: true, orderId: order.id })}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Annuler la commande"
        message="Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible."
        confirmLabel="Oui, annuler"
        cancelLabel="Non, garder"
        danger
        onConfirm={() => confirmDialog.orderId && handleCancelOrder(confirmDialog.orderId)}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null })}
      />
    </div>
  );
}
