import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, TrendingUp, Euro, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/login');
  };

  const loadOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setOrders(data || []);
    } catch (error) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      toast.success('Statut mis à jour');
      loadOrders();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: orders.length,
    revenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
    pending: orders.filter(o => o.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-600 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8">
          Dashboard Pressing
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Package, label: 'Commandes', value: stats.total, color: 'blue' },
            { icon: Euro, label: 'CA Total', value: `${stats.revenue}€`, color: 'green' },
            { icon: TrendingUp, label: 'En attente', value: stats.pending, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Commandes</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{order.weight_kg}kg - {order.total_amount}€</p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="px-4 py-2 border-2 border-blue-300 rounded-lg font-semibold"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="in_progress">En cours</option>
                    <option value="ready">Prête</option>
                    <option value="completed">Terminée</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
