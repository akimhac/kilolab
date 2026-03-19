import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

type Stats = {
  // Orders
  totalOrders: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  
  // Revenue
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  averageOrderValue: number;
  
  // Users
  totalClients: number;
  newClientsToday: number;
  newClientsThisWeek: number;
  totalWashers: number;
  activeWashers: number;
  pendingWashers: number;
  
  // Performance
  avgDeliveryTime: number;
  satisfactionRate: number;
  returnRate: number;
};

type RecentOrder = {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  weight: number;
  formula: string;
  pickup_address: string;
};

type RecentUser = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  role: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  assigned: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-violet-100 text-violet-700',
  washing: 'bg-teal-100 text-teal-700',
  ready: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  assigned: 'Assigné',
  picked_up: 'Collecté',
  washing: 'Lavage',
  ready: 'Prêt',
  completed: 'Livré',
  cancelled: 'Annulé',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  trend,
  trendValue 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: any; 
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-bold ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400'
          }`}>
            {trend === 'up' ? <ArrowUp size={14} /> : trend === 'down' ? <ArrowDown size={14} /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <span className="text-sm font-bold text-green-600">LIVE</span>
    </div>
  );
}

export default function LiveStatus() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return false;
    }
    
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'akim.hachili@gmail.com';
    if (user.email !== adminEmail) {
      window.location.href = '/';
      return false;
    }
    
    setIsAdmin(true);
    return true;
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, created_at, status, total_price, weight, formula, pickup_address, client_rating')
        .order('created_at', { ascending: false });

      // Fetch users (clients)
      const { data: clients } = await supabase
        .from('user_profiles')
        .select('id, created_at, full_name, email, role')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      // Fetch washers
      const { data: washers } = await supabase
        .from('washers')
        .select('id, created_at, status, full_name')
        .order('created_at', { ascending: false });

      const allOrders = orders || [];
      const allClients = clients || [];
      const allWashers = washers || [];

      // Calculate stats
      const ordersToday = allOrders.filter(o => o.created_at >= todayStart);
      const ordersThisWeek = allOrders.filter(o => o.created_at >= weekStart);
      const ordersThisMonth = allOrders.filter(o => o.created_at >= monthStart);
      
      const completedOrders = allOrders.filter(o => o.status === 'completed');
      const pendingOrders = allOrders.filter(o => o.status === 'pending');
      const inProgressOrders = allOrders.filter(o => ['assigned', 'picked_up', 'washing', 'ready'].includes(o.status));
      const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');

      const totalRevenue = completedOrders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
      const revenueToday = completedOrders.filter(o => o.created_at >= todayStart).reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
      const revenueThisWeek = completedOrders.filter(o => o.created_at >= weekStart).reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
      const revenueThisMonth = completedOrders.filter(o => o.created_at >= monthStart).reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);

      const clientsToday = allClients.filter(c => c.created_at >= todayStart);
      const clientsThisWeek = allClients.filter(c => c.created_at >= weekStart);

      const approvedWashers = allWashers.filter(w => w.status === 'approved');
      const pendingWashersCount = allWashers.filter(w => w.status === 'pending');

      // Ratings
      const ratedOrders = completedOrders.filter(o => o.client_rating);
      const avgRating = ratedOrders.length > 0 
        ? ratedOrders.reduce((sum, o) => sum + o.client_rating, 0) / ratedOrders.length 
        : 0;

      setStats({
        totalOrders: allOrders.length,
        ordersToday: ordersToday.length,
        ordersThisWeek: ordersThisWeek.length,
        ordersThisMonth: ordersThisMonth.length,
        pendingOrders: pendingOrders.length,
        inProgressOrders: inProgressOrders.length,
        completedOrders: completedOrders.length,
        cancelledOrders: cancelledOrders.length,
        
        totalRevenue,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        
        totalClients: allClients.length,
        newClientsToday: clientsToday.length,
        newClientsThisWeek: clientsThisWeek.length,
        totalWashers: allWashers.length,
        activeWashers: approvedWashers.length,
        pendingWashers: pendingWashersCount.length,
        
        avgDeliveryTime: 48,
        satisfactionRate: avgRating > 0 ? (avgRating / 5) * 100 : 95,
        returnRate: completedOrders.length > 0 ? (cancelledOrders.length / allOrders.length) * 100 : 0,
      });

      // Recent orders (last 10)
      setRecentOrders(allOrders.slice(0, 10) as RecentOrder[]);

      // Recent users (last 5)
      setRecentUsers(allClients.slice(0, 5) as RecentUser[]);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    const init = async () => {
      const isAdminUser = await checkAdmin();
      if (isAdminUser) {
        await fetchStats();
        setLoading(false);
      }
    };
    init();
  }, [checkAdmin, fetchStats]);

  // Real-time updates
  useEffect(() => {
    if (!isAdmin) return;

    const ordersChannel = supabase
      .channel('live-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchStats();
      })
      .subscribe();

    const usersChannel = supabase
      .channel('live-users')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_profiles' }, () => {
        fetchStats();
      })
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(usersChannel);
      clearInterval(interval);
    };
  }, [isAdmin, fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-teal-500" size={48} />
          <p className="text-slate-400">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-orange-500" size={48} />
          <p className="text-slate-400">Erreur de chargement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-black text-white">Dashboard Live</h1>
              <LiveIndicator />
            </div>
            <p className="text-slate-400">
              Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Alert Banner for pending orders */}
        {stats.pendingOrders > 0 && (
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-4 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-orange-300 font-bold text-lg">
                {stats.pendingOrders} commande{stats.pendingOrders > 1 ? 's' : ''} en attente
              </p>
              <p className="text-orange-400/70 text-sm">
                Des commandes attendent d'être assignées à un washer
              </p>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Commandes aujourd'hui"
            value={stats.ordersToday}
            subtitle={`${stats.ordersThisWeek} cette semaine`}
            icon={Package}
            color="bg-teal-500"
            trend={stats.ordersToday > 0 ? 'up' : 'neutral'}
            trendValue={stats.ordersToday > 0 ? `+${stats.ordersToday}` : '0'}
          />
          <StatCard
            title="CA aujourd'hui"
            value={formatCurrency(stats.revenueToday)}
            subtitle={`${formatCurrency(stats.revenueThisWeek)} cette semaine`}
            icon={DollarSign}
            color="bg-green-500"
            trend={stats.revenueToday > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Nouveaux clients"
            value={stats.newClientsToday}
            subtitle={`${stats.newClientsThisWeek} cette semaine`}
            icon={Users}
            color="bg-blue-500"
            trend={stats.newClientsToday > 0 ? 'up' : 'neutral'}
            trendValue={stats.newClientsToday > 0 ? `+${stats.newClientsToday}` : '0'}
          />
          <StatCard
            title="Satisfaction"
            value={`${stats.satisfactionRate.toFixed(0)}%`}
            subtitle="Basé sur les avis"
            icon={Target}
            color="bg-purple-500"
            trend={stats.satisfactionRate >= 80 ? 'up' : 'down'}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-white">{stats.totalOrders}</p>
            <p className="text-sm text-slate-400">Total commandes</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-400">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-slate-400">CA total</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-blue-400">{stats.totalClients}</p>
            <p className="text-sm text-slate-400">Clients</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-teal-400">{stats.activeWashers}</p>
            <p className="text-sm text-slate-400">Washers actifs</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-amber-400">{formatCurrency(stats.averageOrderValue)}</p>
            <p className="text-sm text-slate-400">Panier moyen</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-purple-400">{stats.ordersThisMonth}</p>
            <p className="text-sm text-slate-400">Ce mois</p>
          </div>
        </div>

        {/* Orders Status */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Order Pipeline */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-teal-400" />
              Pipeline commandes
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-300">En attente</span>
                </div>
                <span className="text-2xl font-bold text-orange-400">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300">En cours</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">{stats.inProgressOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-300">Terminées</span>
                </div>
                <span className="text-2xl font-bold text-green-400">{stats.completedOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-300">Annulées</span>
                </div>
                <span className="text-2xl font-bold text-red-400">{stats.cancelledOrders}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
                {stats.totalOrders > 0 && (
                  <>
                    <div 
                      className="bg-orange-500 h-full" 
                      style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                    />
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(stats.inProgressOrders / stats.totalOrders) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Dernières commandes
            </h2>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentOrders.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Aucune commande</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-slate-700/50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        order.status === 'completed' ? 'bg-green-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/20' :
                        order.status === 'pending' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                      }`}>
                        {order.status === 'completed' ? (
                          <CheckCircle size={18} className="text-green-400" />
                        ) : order.status === 'cancelled' ? (
                          <XCircle size={18} className="text-red-400" />
                        ) : order.status === 'pending' ? (
                          <Clock size={18} className="text-orange-400" />
                        ) : (
                          <Package size={18} className="text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {formatDate(order.created_at)} · {formatTime(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatCurrency(parseFloat(String(order.total_price)))}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Washers & Users */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Washers Stats */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-teal-400" />
              Washers
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-teal-400">{stats.activeWashers}</p>
                <p className="text-xs text-slate-400">Actifs</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-orange-400">{stats.pendingWashers}</p>
                <p className="text-xs text-slate-400">En attente</p>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-slate-400">{stats.totalWashers}</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>

            {stats.pendingWashers > 0 && (
              <a 
                href="/admin" 
                className="mt-4 block w-full py-3 bg-teal-600 text-white text-center rounded-xl font-bold hover:bg-teal-700 transition"
              >
                Valider les washers en attente
              </a>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Nouveaux clients
            </h2>
            
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {recentUsers.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Aucun nouveau client</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between bg-slate-700/50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.full_name || 'Client'}</p>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <a 
            href="/admin" 
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition"
          >
            Admin Dashboard
          </a>
          <a 
            href="/admin/analytics" 
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition"
          >
            Analytics détaillés
          </a>
        </div>
      </div>
    </div>
  );
}
