// Dashboard Admin Avancé - Analytics, Heatmap, KPIs
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { FadeInOnScroll, CountUp } from '../components/animations/ScrollAnimations';
import {
  TrendingUp, TrendingDown, Users, Package, DollarSign, Star,
  MapPin, Calendar, Clock, Filter, Download, RefreshCw,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle, Loader2,
  BarChart3, PieChart, Activity, Target, Zap, ArrowUpRight, Map
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

// Lazy load the heavy components
const OrderHeatmap = lazy(() => import('../components/OrderHeatmap'));
const AdvancedAnalyticsDashboard = lazy(() => import('../components/AdvancedAnalytics').then(m => ({ default: m.AdvancedAnalyticsDashboard })));

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalClients: number;
  totalWashers: number;
  avgRating: number;
  avgOrderValue: number;
  completionRate: number;
  growthRate: number;
}

interface OrdersByDay {
  date: string;
  count: number;
  revenue: number;
}

interface OrdersByCity {
  city: string;
  count: number;
  revenue: number;
}

interface OrdersByStatus {
  status: string;
  count: number;
}

interface TopWasher {
  id: string;
  name: string;
  completedOrders: number;
  totalRevenue: number;
  avgRating: number;
}

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ordersByDay, setOrdersByDay] = useState<OrdersByDay[]>([]);
  const [ordersByCity, setOrdersByCity] = useState<OrdersByCity[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus[]>([]);
  const [topWashers, setTopWashers] = useState<TopWasher[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d': return subDays(now, 7);
      case '30d': return subDays(now, 30);
      case '90d': return subDays(now, 90);
      default: return new Date('2020-01-01');
    }
  };

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const startDate = getDateFilter();

      // Fetch all orders in date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch comparison period for growth
      const prevStartDate = subDays(startDate, dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90);
      const { data: prevOrders } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Fetch clients count
      const { count: totalClients } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      // Fetch washers count
      const { count: totalWashers } = await supabase
        .from('washers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Fetch reviews for avg rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('is_public', true);

      // Calculate stats
      const allOrders = orders || [];
      const completedOrders = allOrders.filter(o => o.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
      const avgRating = reviews?.length 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;
      const completionRate = allOrders.length > 0 
        ? (completedOrders.length / allOrders.length) * 100 
        : 0;
      const growthRate = prevOrders?.length 
        ? ((allOrders.length - prevOrders.length) / prevOrders.length) * 100 
        : 0;

      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        totalClients: totalClients || 0,
        totalWashers: totalWashers || 0,
        avgRating,
        avgOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        completionRate,
        growthRate,
      });

      // Orders by day
      const days = eachDayOfInterval({ start: startDate, end: new Date() });
      const dailyData = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayOrders = allOrders.filter(o => 
          format(new Date(o.created_at), 'yyyy-MM-dd') === dayStr
        );
        return {
          date: dayStr,
          count: dayOrders.length,
          revenue: dayOrders.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0),
        };
      });
      setOrdersByDay(dailyData);

      // Orders by city (extract from address)
      const cityMap = new Map<string, { count: number; revenue: number }>();
      allOrders.forEach(o => {
        const match = o.pickup_address?.match(/\d{5}\s+([A-Za-zÀ-ÿ\s-]+)/);
        const city = match ? match[1].trim() : 'Inconnu';
        const existing = cityMap.get(city) || { count: 0, revenue: 0 };
        cityMap.set(city, {
          count: existing.count + 1,
          revenue: existing.revenue + (parseFloat(o.total_price) || 0),
        });
      });
      const cityData = Array.from(cityMap.entries())
        .map(([city, data]) => ({ city, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setOrdersByCity(cityData);

      // Orders by status
      const statusMap = new Map<string, number>();
      allOrders.forEach(o => {
        statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
      });
      const statusData = Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }));
      setOrdersByStatus(statusData);

      // Top washers
      const { data: washers } = await supabase
        .from('washers')
        .select('id, first_name, last_name, avg_rating')
        .eq('status', 'approved');

      if (washers) {
        const washerStats = await Promise.all(washers.map(async (w) => {
          const { count, data: washerOrders } = await supabase
            .from('orders')
            .select('total_price', { count: 'exact' })
            .eq('washer_id', w.id)
            .eq('status', 'completed')
            .gte('created_at', startDate.toISOString());

          const revenue = washerOrders?.reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0) || 0;

          return {
            id: w.id,
            name: `${w.first_name} ${w.last_name?.[0] || ''}.`,
            completedOrders: count || 0,
            totalRevenue: revenue,
            avgRating: w.avg_rating || 0,
          };
        }));

        setTopWashers(washerStats.sort((a, b) => b.completedOrders - a.completedOrders).slice(0, 5));
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'bg-orange-500' },
    assigned: { label: 'Assigné', color: 'bg-blue-500' },
    picked_up: { label: 'Collecté', color: 'bg-indigo-500' },
    washing: { label: 'Lavage', color: 'bg-teal-500' },
    ready: { label: 'Prêt', color: 'bg-emerald-500' },
    completed: { label: 'Terminé', color: 'bg-green-500' },
    cancelled: { label: 'Annulé', color: 'bg-red-500' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="animate-spin text-teal-500" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Analytics</h1>
            <p className="text-slate-500">Vue d'ensemble de l'activité</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex bg-white rounded-xl border border-slate-200 p-1">
              {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    dateRange === range
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {range === '7d' ? '7 jours' : range === '30d' ? '30 jours' : range === '90d' ? '90 jours' : 'Tout'}
                </button>
              ))}
            </div>
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              <RefreshCw size={20} className={`text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FadeInOnScroll direction="up" delay={0}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Package className="text-teal-600" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${stats?.growthRate && stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.growthRate && stats.growthRate >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(stats?.growthRate || 0).toFixed(0)}%
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                <CountUp end={stats?.totalOrders || 0} duration={1500} />
              </p>
              <p className="text-sm text-slate-500">Commandes</p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="up" delay={100}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                <CountUp end={stats?.totalRevenue || 0} suffix="€" duration={1500} />
              </p>
              <p className="text-sm text-slate-500">Chiffre d'affaires</p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="up" delay={200}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                <CountUp end={stats?.totalClients || 0} duration={1500} />
              </p>
              <p className="text-sm text-slate-500">Clients</p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll direction="up" delay={300}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Star className="text-amber-600" size={24} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {(stats?.avgRating || 0).toFixed(1)}/5
              </p>
              <p className="text-sm text-slate-500">Note moyenne</p>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Orders Chart */}
          <FadeInOnScroll direction="up" delay={400}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-teal-500" /> Commandes par jour
              </h3>
              <div className="h-48 flex items-end gap-1">
                {ordersByDay.slice(-14).map((day, idx) => {
                  const maxCount = Math.max(...ordersByDay.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${format(new Date(day.date), 'd MMM', { locale: fr })}: ${day.count} commandes`}
                      />
                      <span className="text-xs text-slate-400 -rotate-45 origin-top-left">
                        {format(new Date(day.date), 'd', { locale: fr })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInOnScroll>

          {/* Status Distribution */}
          <FadeInOnScroll direction="up" delay={500}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PieChart size={20} className="text-purple-500" /> Statuts des commandes
              </h3>
              <div className="space-y-3">
                {ordersByStatus.map((item, idx) => {
                  const total = ordersByStatus.reduce((sum, s) => sum + s.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  const config = STATUS_LABELS[item.status] || { label: item.status, color: 'bg-slate-500' };
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{config.label}</span>
                        <span className="text-slate-500">{item.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${config.color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Heatmap Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Map size={24} className="text-red-500" /> Carte de chaleur
            </h2>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              {showHeatmap ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showHeatmap && (
            <Suspense fallback={
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-teal-500" size={40} />
              </div>
            }>
              <OrderHeatmap dateRange={dateRange} />
            </Suspense>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Cities */}
          <FadeInOnScroll direction="up" delay={600}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-red-500" /> Top villes
              </h3>
              <div className="space-y-3">
                {ordersByCity.slice(0, 5).map((city, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-900">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{city.count} cmd</p>
                      <p className="text-xs text-slate-500">{city.revenue.toFixed(0)}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* Top Washers */}
          <FadeInOnScroll direction="up" delay={700}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-500" /> Top Washers
              </h3>
              <div className="space-y-3">
                {topWashers.map((washer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-slate-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{washer.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {washer.avgRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{washer.completedOrders} cmd</p>
                      <p className="text-xs text-green-600">{washer.totalRevenue.toFixed(0)}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-4 text-white">
            <p className="text-white/70 text-sm">Panier moyen</p>
            <p className="text-2xl font-black">{(stats?.avgOrderValue || 0).toFixed(2)}€</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
            <p className="text-white/70 text-sm">Taux complétion</p>
            <p className="text-2xl font-black">{(stats?.completionRate || 0).toFixed(0)}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
            <p className="text-white/70 text-sm">Washers actifs</p>
            <p className="text-2xl font-black">{stats?.totalWashers || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
            <p className="text-white/70 text-sm">Croissance</p>
            <p className="text-2xl font-black">{stats?.growthRate && stats.growthRate >= 0 ? '+' : ''}{(stats?.growthRate || 0).toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
