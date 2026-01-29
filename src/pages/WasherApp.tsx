import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { DollarSign, Package, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WasherApp() {
  const [stats, setStats] = useState({ 
    totalEarnings: 0, 
    completedOrders: 0, 
    pendingOrders: 0 
  });
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    fetchWasherData();
  }, []);

  const fetchWasherData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer les missions du Washer
    const { data: orders } = await supabase
      .from('washer_orders') // Nouvelle table à créer
      .select('*')
      .eq('washer_id', user.id)
      .order('created_at', { ascending: false });

    if (orders) {
      setMissions(orders);
      const earnings = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.washer_earnings || 0), 0);
      
      setStats({
        totalEarnings: earnings,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Mon Dashboard Washer 💰</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-xl text-green-600">
                <DollarSign size={24}/>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold">Gains totaux</p>
            <p className="text-3xl font-black">{stats.totalEarnings.toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                <Package size={24}/>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold">Missions terminées</p>
            <p className="text-3xl font-black">{stats.completedOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-4 rounded-xl text-orange-600">
                <Clock size={24}/>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold">En attente</p>
            <p className="text-3xl font-black">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* MISSIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-bold text-xl mb-4">Mes Missions</h2>
          
          {missions.length === 0 ? (
            <p className="text-slate-400 text-center py-10">
              Aucune mission pour le moment. Les premières commandes arrivent bientôt ! 🚀
            </p>
          ) : (
            <div className="space-y-4">
              {missions.map(mission => (
                <div key={mission.id} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-sm font-bold">#{mission.id.slice(0, 8)}</span>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(mission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      mission.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {mission.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-slate-600">{mission.weight} kg</span>
                    <span className="text-sm font-bold text-teal-600">{mission.washer_earnings} €</span>
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
