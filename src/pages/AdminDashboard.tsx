import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, DollarSign, CheckCircle, Search, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, partners: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Récupérer les Stats Globales
      const { data: ordersData } = await supabase.from('orders').select('*');
      const { data: partnersData } = await supabase.from('partners').select('id'); // Table partners supposée existante

      if (ordersData) {
        const revenue = ordersData.reduce((acc, order) => acc + (order.total_price || 0), 0);
        const pending = ordersData.filter(o => o.status === 'pending').length;
        
        setStats({
          revenue: revenue,
          orders: ordersData.length,
          partners: partnersData ? partnersData.length : 0,
          pending: pending
        });

        // 2. Stocker les commandes pour le tableau (Trier par date récente)
        // On prend les 50 dernières commandes
        const sortedOrders = [...ordersData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Erreur admin:", error);
      toast.error("Erreur de chargement des données admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-black mb-2">Admin Dashboard 👑</h1>
                <p className="text-slate-500">Vue d'ensemble de l'activité Kilolab.</p>
            </div>
            <button onClick={() => window.location.reload()} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50">
                Rafraîchir
            </button>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Chiffre d'affaires</p>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                    <span className="text-3xl font-black text-slate-900">{stats.revenue.toFixed(2)} €</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Commandes Totales</p>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><ShoppingBag size={24}/></div>
                    <span className="text-3xl font-black text-slate-900">{stats.orders}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Partenaires</p>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Users size={24}/></div>
                    <span className="text-3xl font-black text-slate-900">{stats.partners}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">À Valider</p>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><CheckCircle size={24}/></div>
                    <span className="text-3xl font-black text-slate-900">{stats.pending}</span>
                </div>
            </div>
        </div>

        {/* --- TABLEAU DÉTAILLÉ DES COMMANDES --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-xl">Détail des Commandes</h2>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Search size={20}/></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Filter size={20}/></button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Client / Adresse</th>
                            <th className="p-4">Poids / Prix</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-mono font-bold">#{order.id.toString().slice(0,6)}</td>
                                <td className="p-4 text-slate-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                    <div className="text-xs">{new Date(order.created_at).toLocaleTimeString()}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-900">{order.pickup_address || "Adresse inconnue"}</div>
                                    <div className="text-xs text-slate-400">ID Client: {order.client_id?.slice(0,8)}</div>
                                </td>
                                <td className="p-4">
                                    <span className="font-bold">{order.weight} kg</span>
                                    <span className="text-slate-400 mx-2">|</span>
                                    <span className="text-teal-600 font-bold">{order.total_price} €</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase 
                                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-900 transition">
                                        <Eye size={18}/>
                                    </button>
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
