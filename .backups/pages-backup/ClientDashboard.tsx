import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { Package, Plus, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

export function ClientDashboard() {
  const { user, signOut } = useAuth();
  const { orders, loading } = useOrders(user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'ready': return 'Prêt';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getServiceText = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard (72-96h)';
      case 'express': return 'Express (24h)';
      case 'ultra': return 'Premium (6h)';
      default: return type;
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
            <h1 className="text-3xl font-bold text-white mb-2">Mon espace client</h1>
            <p className="text-gray-400">Bienvenue {user?.full_name} !</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/new-order"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
            >
              <Plus className="w-5 h-5" />
              Nouvelle commande
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
            </div>
            <p className="text-gray-400">Commandes totales</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'processing').length}
              </h3>
            </div>
            <p className="text-gray-400">En cours</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'ready').length}
              </h3>
            </div>
            <p className="text-gray-400">Prêt</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'completed').length}
              </h3>
            </div>
            <p className="text-gray-400">Terminées</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Mes commandes</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">Vous n'avez pas encore de commande</p>
              <Link
                to="/new-order"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
              >
                <Plus className="w-5 h-5" />
                Créer ma première commande
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/order/${order.id}`}
                  className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {order.partner?.name || 'Partenaire'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {getServiceText(order.service_type)} • {order.weight} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">
                        {order.total_price}€
                      </div>
                      <p className="text-gray-400 text-sm">Voir détails →</p>
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