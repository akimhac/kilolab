// src/pages/PartnerDashboard.tsx
// Dashboard complet pour les pressings partenaires

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Package, Clock, CheckCircle, Truck, Euro, Star, 
  Users, TrendingUp, ArrowLeft, LogOut, RefreshCw,
  ChevronRight, Phone, Mail, MapPin, QrCode, Search,
  AlertCircle, Loader2, Eye, MessageSquare, BarChart3,
  Calendar, Filter, X, Check, Play, Pause
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  user_id: string;
  weight_kg: number;
  service_type: 'standard' | 'express';
  price_per_kg: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Trouver le partenaire associé à cet email
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (partnerError || !partnerData) {
        toast.error('Compte partenaire non trouvé');
        navigate('/');
        return;
      }

      if (!partnerData.is_active) {
        toast.error('Votre compte est en attente de validation');
        navigate('/');
        return;
      }

      setPartner(partnerData);
      await loadOrders(partnerData.id);
      await loadStats(partnerData.id);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Charger les infos utilisateurs
      const ordersWithUsers = await Promise.all(
        (data || []).map(async (order) => {
          const { data: userData } = await supabase.auth.admin.getUserById(order.user_id).catch(() => ({ data: null }));
          return {
            ...order,
            user_email: userData?.user?.email || 'Client',
            user_name: userData?.user?.user_metadata?.name || 'Client'
          };
        })
      );

      setOrders(ordersWithUsers);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const loadStats = async (partnerId: string) => {
    try {
      // Commandes
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('partner_id', partnerId);

      const orders = ordersData || [];
      const completed = orders.filter(o => o.status === 'completed');
      const pending = orders.filter(o => ['pending', 'confirmed', 'in_progress', 'ready'].includes(o.status));

      // Avis
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('partner_id', partnerId);

      const reviews = reviewsData || [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending.length,
        completedOrders: completed.length,
        totalRevenue: completed.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Mettre à jour localement
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus as any } : o
      ));

      toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);

      // Recharger les stats
      if (partner) {
        await loadStats(partner.id);
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      in_progress: 'En cours',
      ready: 'Prêt',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      completed: 'bg-slate-100 text-slate-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'in_progress',
      in_progress: 'ready',
      ready: 'completed'
    };
    return flow[currentStatus] || null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.user_email?.toLowerCase().includes(query) ||
        order.user_name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{partner?.name}</h1>
              <p className="text-sm text-slate-500">{partner?.city}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/scanner"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                <QrCode className="w-5 h-5" />
                Scanner QR
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-slate-500">En cours</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-500">Terminées</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.completedOrders}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">Chiffre d'affaires</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalRevenue.toFixed(0)}€</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500">Note moyenne</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              <span className="text-sm font-normal text-slate-400"> ({stats.totalReviews} avis)</span>
            </p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par ID, client..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Filtre par statut */}
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'pending', 'confirmed', 'in_progress', 'ready', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    filterStatus === status
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'Toutes' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-slate-900">
              Commandes ({filteredOrders.length})
            </h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                return (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between gap-4">
                      {/* Infos commande */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            order.service_type === 'express' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {order.service_type === 'express' ? '⚡ Express' : 'Standard'}
                          </span>
                        </div>

                        <p className="font-medium text-slate-900 truncate">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.user_name || order.user_email || 'Client'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>

                        {order.notes && (
                          <p className="text-xs text-slate-500 mt-2 bg-yellow-50 p-2 rounded">
                            📝 {order.notes}
                          </p>
                        )}
                      </div>

                      {/* Prix et poids */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">
                          {order.total_amount?.toFixed(2)}€
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.weight_kg} kg × {order.price_per_kg}€
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {nextStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                            disabled={updatingStatus === order.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {updatingStatus === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            {getStatusLabel(nextStatus)}
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <Link
                            to={`/scanner?order=${order.id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2"
                          >
                            <QrCode className="w-4 h-4" />
                            Scanner
                          </Link>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rappel commission */}
        <div className="mt-8 bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-green-800">
            💰 <strong>Rappel :</strong> Commission Kilolab de 10% sur chaque commande. 
            Votre part sur ce mois : <strong>{(stats.totalRevenue * 0.9).toFixed(2)}€</strong>
          </p>
        </div>
      </div>

      {/* Modal détails commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Détails commande</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500">ID Commande</p>
                <p className="font-mono font-bold">{selectedOrder.id}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Statut</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Service</p>
                  <p className="font-medium">{selectedOrder.service_type === 'express' ? '⚡ Express' : 'Standard'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Poids</p>
                  <p className="font-medium">{selectedOrder.weight_kg} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Prix/kg</p>
                  <p className="font-medium">{selectedOrder.price_per_kg}€</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="font-bold text-green-600 text-xl">{selectedOrder.total_amount?.toFixed(2)}€</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Date de création</p>
                <p className="font-medium">
                  {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-slate-500">Instructions client</p>
                  <p className="bg-yellow-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* QR Code pour retrait */}
              {(selectedOrder.status === 'ready' || selectedOrder.status === 'completed') && (
                <div className="bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-sm text-slate-500 mb-2">Code de retrait</p>
                  <p className="text-3xl font-mono font-bold text-slate-900">
                    {selectedOrder.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t">
              {getNextStatus(selectedOrder.status) && selectedOrder.status !== 'completed' && (
                <button
                  onClick={() => {
                    const next = getNextStatus(selectedOrder.status);
                    if (next) {
                      updateOrderStatus(selectedOrder.id, next);
                      setSelectedOrder(null);
                    }
                  }}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition"
                >
                  Passer à : {getStatusLabel(getNextStatus(selectedOrder.status) || '')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
