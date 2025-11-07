import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalPartners: 0,
    totalClients: 0,
    revenueThisMonth: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: orders } = await supabase.from('orders').select('price_gross_cents, created_at');
      const { data: partners } = await supabase.from('partners').select('id');
      const { data: clients } = await supabase.from('user_profiles').select('id').eq('role', 'client');

      const totalRevenue = orders?.reduce((sum, o) => sum + o.price_gross_cents, 0) || 0;
      
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      const revenueThisMonth = orders
        ?.filter(o => new Date(o.created_at) >= firstOfMonth)
        .reduce((sum, o) => sum + o.price_gross_cents, 0) || 0;

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue: totalRevenue / 100,
        totalPartners: partners?.length || 0,
        totalClients: clients?.length || 0,
        revenueThisMonth: revenueThisMonth / 100,
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">👑 Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Package className="w-10 h-10 text-blue-400 mb-2" />
            <p className="text-white/60 text-sm">Commandes</p>
            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Users className="w-10 h-10 text-purple-400 mb-2" />
            <p className="text-white/60 text-sm">Partenaires</p>
            <p className="text-3xl font-bold text-white">{stats.totalPartners}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Users className="w-10 h-10 text-green-400 mb-2" />
            <p className="text-white/60 text-sm">Clients</p>
            <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <DollarSign className="w-10 h-10 text-yellow-400 mb-2" />
            <p className="text-white/60 text-sm">CA Total</p>
            <p className="text-3xl font-bold text-white">{stats.totalRevenue.toFixed(0)}€</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
          <TrendingUp className="w-12 h-12 text-green-300 mb-3" />
          <p className="text-white/80 text-lg mb-2">CA ce mois-ci</p>
          <p className="text-5xl font-bold text-white">{stats.revenueThisMonth.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
}
