import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Package, CheckCircle, Clock, DollarSign, QrCode, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer les commandes assignées à ce partenaire
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: any[]) => {
    const revenue = data.reduce((acc, order) => acc + (order.status === 'completed' ? order.total_price : 0), 0);
    const pending = data.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    setStats({
        total: data.length,
        pending: pending,
        revenue: parseFloat(revenue.toFixed(2))
    });
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) toast.error("Erreur de mise à jour");
    else {
        toast.success(`Commande passée en : ${newStatus}`);
        fetchOrders(); // Rafraichir
    }
  };

  // Filtrage visuel
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* HEADER & STATS */}
        <div className="mb-10">
            <h1 className="text-3xl font-black mb-2">Espace Partenaire</h1>
            <p className="text-slate-500 mb-8">Gérez votre production et vos revenus.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Package size={24}/></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">À traiter</p>
                        <p className="text-3xl font-black">{stats.pending}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-xl text-green-600"><DollarSign size={24}/></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">CA Réalisé</p>
                        <p className="text-3xl font-black">{stats.revenue} €</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition" onClick={() => toast('Fonction scanner à venir !')}>
                    <div className="bg-slate-900 p-4 rounded-xl text-white"><QrCode size={24}/></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">Action Rapide</p>
                        <p className="text-lg font-black">Scanner un sac</p>
                    </div>
                </div>
            </div>
        </div>

        {/* FILTRES & LISTE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="font-bold text-xl flex items-center gap-2"><Filter size={20}/> Commandes</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['all', 'pending', 'cleaning', 'completed'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition ${filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {f === 'all' ? 'Tout' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-6">ID / Date</th>
                            <th className="p-6">Détails</th>
                            <th className="p-6">Client</th>
                            <th className="p-6">Statut Actuel</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 && (
                            <tr><td colSpan={5} className="p-10 text-center text-slate-400">Aucune commande trouvée.</td></tr>
                        )}
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                                <td className="p-6">
                                    <span className="font-mono font-bold text-slate-900">#{order.id}</span>
                                    <div className="text-xs text-slate-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="p-6">
                                    <div className="font-bold">{order.weight} kg</div>
                                    <div className="text-xs text-teal-600 font-bold">{order.total_price} €</div>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-medium">{order.pickup_address}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                          order.status === 'cleaning' ? 'bg-blue-100 text-blue-700' : 
                                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateStatus(order.id, 'cleaning')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition">
                                            Lancer Lavage
                                        </button>
                                    )}
                                    {order.status === 'cleaning' && (
                                        <button onClick={() => updateStatus(order.id, 'completed')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-500/20 transition">
                                            Terminer
                                        </button>
                                    )}
                                    {order.status === 'completed' && (
                                        <span className="text-green-600 font-bold flex items-center justify-end gap-1"><CheckCircle size={16}/> Fini</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
