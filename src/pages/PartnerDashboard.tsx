import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendOrderReady } from '../services/emailService';
import { Package, Clock, CheckCircle, Euro, ArrowLeft, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

interface Order {
  id: string;
  user_id: string;
  weight_kg: number;
  service_type: string;
  total_amount: number;
  status: string;
  created_at: string;
  users?: {
    email: string;
  };
}

interface Stats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  completed_orders: number;
}

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ total_orders: 0, pending_orders: 0, total_revenue: 0, completed_orders: 0 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; orderId: string | null; action: string | null}>({
    isOpen: false,
    orderId: null,
    action: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (partnerId) {
      loadOrders();
      loadStats();
    }
  }, [partnerId, statusFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    await getPartnerId(session.user.email);
  };

  const getPartnerId = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast.error('Aucun pressing associé à ce compte');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      setPartnerId(data.id);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la vérification du compte');
    }
  };

  const loadOrders = async () => {
    if (!partnerId) return;

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          users:user_id (email)
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!partnerId) return;

    try {
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('status, total_amount')
        .eq('partner_id', partnerId);

      if (error) throw error;

      const stats = {
        total_orders: allOrders?.length || 0,
        pending_orders: allOrders?.filter(o => o.status === 'pending').length || 0,
        completed_orders: allOrders?.filter(o => o.status === 'completed').length || 0,
        total_revenue: allOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      };

      setStats(stats);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .eq('partner_id', partnerId);

      if (error) throw error;

      // Si commande prête, envoyer email au client
      if (newStatus === 'ready') {
        const order = orders.find(o => o.id === orderId);
        if (order && order.users?.email) {
          try {
            const { data: partner } = await supabase
              .from('partners')
              .select('name, address, city')
              .eq('id', partnerId)
              .single();

            if (partner) {
              await sendOrderReady({
                customerEmail: order.users.email,
                customerName: order.users.email.split('@')[0],
                orderNumber: orderId.substring(0, 8).toUpperCase(),
                partnerName: partner.name,
                partnerAddress: `${partner.address}, ${partner.city}`
              });
            }
          } catch (emailError) {
            console.error('Email error:', emailError);
          }
        }
      }

      toast.success('Statut mis à jour avec succès');
      loadOrders();
      loadStats();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setConfirmDialog({ isOpen: false, orderId: null, action: null });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      completed: 'bg-slate-100 text-slate-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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

  const getNextStatus = (currentStatus: string) => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'in_progress',
      in_progress: 'ready',
      ready: 'completed'
    };
    return flow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? getStatusLabel(nextStatus) : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
            className="text-slate-600 hover:text-slate-900 transition font-semibold"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Dashboard Pressing
          </h1>
          <p className="text-slate-600">
            Gérez vos commandes Kilolab
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
            <Package className="w-10 h-10 mb-3 opacity-80" />
            <div className="text-3xl font-black mb-1">{stats.total_orders}</div>
            <div className="text-blue-100">Commandes totales</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
            <Clock className="w-10 h-10 mb-3 opacity-80" />
            <div className="text-3xl font-black mb-1">{stats.pending_orders}</div>
            <div className="text-orange-100">En attente</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
            <CheckCircle className="w-10 h-10 mb-3 opacity-80" />
            <div className="text-3xl font-black mb-1">{stats.completed_orders}</div>
            <div className="text-green-100">Terminées</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <Euro className="w-10 h-10 mb-3 opacity-80" />
            <div className="text-3xl font-black mb-1">{stats.total_revenue.toFixed(2)}€</div>
            <div className="text-purple-100">Chiffre d'affaires</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-slate-900">Filtrer par statut :</span>
            {['all', 'pending', 'confirmed', 'in_progress', 'ready', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'Toutes' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Liste commandes */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <EmptyState
              icon={Package}
              title={statusFilter === 'all' ? 'Aucune commande' : `Aucune commande "${getStatusLabel(statusFilter)}"`}
              description={statusFilter === 'all' ? "Vous n'avez pas encore reçu de commande via Kilolab." : "Changez de filtre pour voir d'autres commandes."}
              actionLabel={statusFilter !== 'all' ? 'Voir toutes les commandes' : undefined}
              onAction={statusFilter !== 'all' ? () => setStatusFilter('all') : undefined}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {order.service_type === 'express' ? 'Express (24h)' : 'Standard (48-72h)'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Commande #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">{order.total_amount.toFixed(2)}€</div>
                    <div className="text-sm text-slate-500">{order.weight_kg} kg</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-slate-500">Client</p>
                    <p className="font-semibold text-slate-900">{order.users?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {order.status !== 'completed' && order.status !== 'cancelled' && getNextStatus(order.status) && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDialog({ 
                        isOpen: true, 
                        orderId: order.id, 
                        action: getNextStatus(order.status) 
                      })}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
                    >
                      Passer à : {getNextStatusLabel(order.status)}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmer le changement de statut"
        message={`Êtes-vous sûr de vouloir changer le statut de cette commande vers "${confirmDialog.action ? getStatusLabel(confirmDialog.action) : ''}" ?`}
        confirmLabel="Oui, confirmer"
        cancelLabel="Annuler"
        onConfirm={() => confirmDialog.orderId && confirmDialog.action && handleStatusChange(confirmDialog.orderId, confirmDialog.action)}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null, action: null })}
      />
    </div>
  );
}
