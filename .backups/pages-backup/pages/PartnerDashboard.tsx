import { useAuth } from '@/hooks/useAuth';
import { usePartnerOrders } from '@/hooks/usePartnerOrders';
import { Package, TrendingUp, Clock, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function PartnerDashboard() {
  const { user, signOut } = useAuth();
  const { orders, loading, stats, updateOrderStatus } = usePartnerOrders(user?.id);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      toast.success('Statut mis à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Partenaire</h1>
            <p className="text-gray-400">Bienvenue {user?.full_name} !</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            </div>
            <p className="text-gray-400">Commandes totales</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">{stats.pending}</h3>
            </div>
            <p className="text-gray-400">En attente</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">{stats.completed}</h3>
            </div>
            <p className="text-gray-400">Terminées</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">{stats.revenue}€</h3>
            </div>
            <p className="text-gray-400">Revenus</p>
          </div>
        </div>

        {/* Orders Management */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Gestion des commandes</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-300">
                        Service: <span className="text-white font-semibold">{order.service_type}</span>
                      </p>
                      <p className="text-gray-300">
                        Poids: <span className="text-white font-semibold">{order.weight} kg</span>
                      </p>
                      {order.notes && (
                        <p className="text-gray-400 text-sm mt-2">Note: {order.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-2">{order.total_price}€</div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En cours</option>
                        <option value="ready">Prêt</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}