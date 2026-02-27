// Advanced Analytics - Funnel, Retention, Cohort Analysis
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  TrendingUp, TrendingDown, Users, ArrowRight, Target, 
  RefreshCw, Calendar, Filter, ChevronDown, Download,
  BarChart3, Activity, Zap, AlertCircle, CheckCircle
} from 'lucide-react';
import { format, subDays, startOfWeek, eachWeekOfInterval, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==========================
// FUNNEL ANALYSIS
// ==========================

interface FunnelStep {
  name: string;
  count: number;
  percentage: number;
  dropoff: number;
}

interface FunnelAnalysisProps {
  dateRange?: '7d' | '30d' | '90d';
}

export function FunnelAnalysis({ dateRange = '30d' }: FunnelAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);

  useEffect(() => {
    fetchFunnelData();
  }, [dateRange]);

  const fetchFunnelData = async () => {
    setLoading(true);
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), days).toISOString();

      // Fetch various metrics
      const [
        { count: visitors },
        { count: signups },
        { count: ordersStarted },
        { count: ordersCompleted },
        { count: ordersDelivered },
      ] = await Promise.all([
        // Visitors estimation (based on page views if tracked, otherwise use signups * 10)
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', startDate),
        // Signups
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', startDate),
        // Orders started (created)
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startDate),
        // Orders paid
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startDate).eq('payment_status', 'paid'),
        // Orders delivered
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startDate).eq('status', 'delivered'),
      ]);

      // Estimate visitors (10x signups for demo)
      const estimatedVisitors = (signups || 0) * 10;

      const steps: FunnelStep[] = [
        { name: 'Visiteurs', count: estimatedVisitors, percentage: 100, dropoff: 0 },
        { name: 'Inscriptions', count: signups || 0, percentage: 0, dropoff: 0 },
        { name: 'Commandes créées', count: ordersStarted || 0, percentage: 0, dropoff: 0 },
        { name: 'Commandes payées', count: ordersCompleted || 0, percentage: 0, dropoff: 0 },
        { name: 'Commandes livrées', count: ordersDelivered || 0, percentage: 0, dropoff: 0 },
      ];

      // Calculate percentages and dropoffs
      for (let i = 0; i < steps.length; i++) {
        steps[i].percentage = steps[0].count > 0 ? (steps[i].count / steps[0].count) * 100 : 0;
        if (i > 0) {
          steps[i].dropoff = steps[i-1].count > 0 
            ? ((steps[i-1].count - steps[i].count) / steps[i-1].count) * 100 
            : 0;
        }
      }

      setFunnelData(steps);
    } catch (error) {
      console.error('Error fetching funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxCount = useMemo(() => Math.max(...funnelData.map(s => s.count), 1), [funnelData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Target className="text-purple-500" size={20} />
          Entonnoir de conversion
        </h3>
        <span className="text-sm text-slate-500">{dateRange === '7d' ? '7 derniers jours' : dateRange === '30d' ? '30 derniers jours' : '90 derniers jours'}</span>
      </div>

      <div className="space-y-3">
        {funnelData.map((step, idx) => (
          <div key={step.name} className="relative">
            {/* Connector arrow */}
            {idx > 0 && (
              <div className="absolute -top-2 left-8 flex items-center text-slate-300">
                <div className="w-px h-2 bg-slate-200"></div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {/* Step indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                idx === 0 ? 'bg-purple-500 text-white' : 
                idx === funnelData.length - 1 ? 'bg-green-500 text-white' :
                'bg-slate-200 text-slate-600'
              }`}>
                {idx + 1}
              </div>

              {/* Bar and info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{step.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{step.count.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      step.percentage >= 50 ? 'bg-green-100 text-green-700' :
                      step.percentage >= 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {step.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-purple-500' :
                      idx === funnelData.length - 1 ? 'bg-green-500' :
                      'bg-teal-500'
                    }`}
                    style={{ width: `${(step.count / maxCount) * 100}%` }}
                  />
                </div>
                {/* Dropoff indicator */}
                {idx > 0 && step.dropoff > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown size={12} className="text-red-500" />
                    <span className="text-xs text-red-500">-{step.dropoff.toFixed(1)}% dropoff</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 font-medium">Taux de conversion global</p>
            <p className="text-xs text-purple-500">Visiteurs → Livraisons</p>
          </div>
          <p className="text-2xl font-black text-purple-700">
            {funnelData.length > 0 && funnelData[0].count > 0 
              ? ((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(2)
              : '0.00'}%
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================
// RETENTION ANALYSIS
// ==========================

interface RetentionCohort {
  week: string;
  startDate: Date;
  initialUsers: number;
  retention: number[]; // Week 0, 1, 2, 3, 4...
}

interface RetentionAnalysisProps {
  weeks?: number;
}

export function RetentionAnalysis({ weeks = 8 }: RetentionAnalysisProps) {
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState<RetentionCohort[]>([]);

  useEffect(() => {
    fetchRetentionData();
  }, [weeks]);

  const fetchRetentionData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, weeks * 7);
      
      // Get all weeks in range
      const weekStarts = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });

      // Fetch users and their orders
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, created_at')
        .gte('created_at', startDate.toISOString())
        .eq('role', 'client');

      if (usersError) throw usersError;

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, created_at')
        .gte('created_at', startDate.toISOString());

      if (ordersError) throw ordersError;

      // Build cohorts
      const cohortData: RetentionCohort[] = [];

      for (let i = 0; i < weekStarts.length - 1; i++) {
        const weekStart = weekStarts[i];
        const weekEnd = weekStarts[i + 1];

        // Users who signed up this week
        const cohortUsers = (users || []).filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt >= weekStart && createdAt < weekEnd;
        });

        if (cohortUsers.length === 0) continue;

        const userIds = new Set(cohortUsers.map(u => u.id));
        const retention: number[] = [];

        // Calculate retention for each subsequent week
        for (let w = 0; w < weeks - i; w++) {
          const retentionWeekStart = subDays(endDate, (weeks - i - w - 1) * 7);
          const retentionWeekEnd = subDays(endDate, (weeks - i - w - 2) * 7);

          // Count users who ordered in this retention week
          const activeUsers = new Set(
            (orders || [])
              .filter(o => {
                const orderDate = new Date(o.created_at);
                return userIds.has(o.user_id) && 
                       orderDate >= retentionWeekStart && 
                       orderDate < retentionWeekEnd;
              })
              .map(o => o.user_id)
          );

          retention.push((activeUsers.size / cohortUsers.length) * 100);
        }

        cohortData.push({
          week: format(weekStart, "'S'w", { locale: fr }),
          startDate: weekStart,
          initialUsers: cohortUsers.length,
          retention,
        });
      }

      setCohorts(cohortData);
    } catch (error) {
      console.error('Error fetching retention data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRetentionColor = (value: number) => {
    if (value >= 70) return 'bg-green-500 text-white';
    if (value >= 50) return 'bg-green-400 text-white';
    if (value >= 30) return 'bg-yellow-400 text-slate-900';
    if (value >= 15) return 'bg-orange-400 text-white';
    if (value > 0) return 'bg-red-400 text-white';
    return 'bg-slate-100 text-slate-400';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="h-64 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-500" size={20} />
          Rétention par cohorte
        </h3>
        <span className="text-sm text-slate-500">{weeks} dernières semaines</span>
      </div>

      {cohorts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-2 font-medium text-slate-500">Cohorte</th>
                <th className="text-center py-2 px-2 font-medium text-slate-500">Users</th>
                {Array.from({ length: Math.min(6, weeks) }, (_, i) => (
                  <th key={i} className="text-center py-2 px-2 font-medium text-slate-500">
                    S{i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.slice(-8).map((cohort, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-2 px-2 font-medium text-slate-700">{cohort.week}</td>
                  <td className="py-2 px-2 text-center text-slate-600">{cohort.initialUsers}</td>
                  {cohort.retention.slice(0, 6).map((value, weekIdx) => (
                    <td key={weekIdx} className="py-1 px-1 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-xs font-medium ${getRetentionColor(value)}`}>
                        {value > 0 ? `${value.toFixed(0)}%` : '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <Users size={48} className="mx-auto mb-3 text-slate-300" />
          <p>Pas assez de données pour l'analyse de rétention</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 justify-center text-xs">
        <span className="text-slate-500">Rétention:</span>
        <span className="px-2 py-1 bg-green-500 text-white rounded">70%+</span>
        <span className="px-2 py-1 bg-yellow-400 text-slate-900 rounded">30-50%</span>
        <span className="px-2 py-1 bg-red-400 text-white rounded">&lt;15%</span>
      </div>
    </div>
  );
}

// ==========================
// KEY METRICS CARDS
// ==========================

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export function MetricCard({ title, value, change, icon, color, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="font-medium">{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// ==========================
// ADVANCED ANALYTICS DASHBOARD
// ==========================

export function AdvancedAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState({
    ltv: 0,
    cac: 0,
    churnRate: 0,
    repeatRate: 0,
    avgOrderValue: 0,
    ordersPerUser: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvancedMetrics();
  }, [dateRange]);

  const fetchAdvancedMetrics = async () => {
    setLoading(true);
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), days).toISOString();

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_price, status')
        .gte('created_at', startDate)
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      // Fetch users
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('role', 'client');

      if (usersError) throw usersError;

      const totalRevenue = (orders || []).reduce((sum, o) => sum + parseFloat(o.total_price || '0'), 0);
      const totalOrders = orders?.length || 0;
      const uniqueCustomers = new Set((orders || []).map(o => o.user_id)).size;
      
      // Calculate metrics
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const ordersPerUser = uniqueCustomers > 0 ? totalOrders / uniqueCustomers : 0;
      
      // Repeat rate: users with more than 1 order
      const orderCountByUser = (orders || []).reduce((acc, o) => {
        acc[o.user_id] = (acc[o.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const repeatCustomers = Object.values(orderCountByUser).filter(c => c > 1).length;
      const repeatRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

      // LTV estimation (avg order value * orders per user * 12 months factor)
      const ltv = avgOrderValue * ordersPerUser * 12;

      // CAC estimation (placeholder - would need marketing spend data)
      const cac = 15; // Example: 15€ per customer

      // Churn rate estimation
      const churnRate = Math.max(0, 100 - repeatRate - 20); // Simplified

      setMetrics({
        ltv,
        cac,
        churnRate,
        repeatRate,
        avgOrderValue,
        ordersPerUser,
      });
    } catch (error) {
      console.error('Error fetching advanced metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Analytics avancés</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                dateRange === range
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {range === '7d' ? '7 jours' : range === '30d' ? '30 jours' : '90 jours'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="LTV Client"
          value={`${metrics.ltv.toFixed(0)}€`}
          icon={<Users size={20} className="text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-500"
          subtitle="Valeur vie client"
        />
        <MetricCard
          title="Panier moyen"
          value={`${metrics.avgOrderValue.toFixed(2)}€`}
          icon={<BarChart3 size={20} className="text-white" />}
          color="bg-gradient-to-br from-teal-500 to-emerald-500"
        />
        <MetricCard
          title="Taux de repeat"
          value={`${metrics.repeatRate.toFixed(1)}%`}
          icon={<RefreshCw size={20} className="text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
          subtitle="Clients récurrents"
        />
        <MetricCard
          title="Cmd/client"
          value={metrics.ordersPerUser.toFixed(1)}
          icon={<Zap size={20} className="text-white" />}
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
      </div>

      {/* Funnel & Retention */}
      <div className="grid md:grid-cols-2 gap-6">
        <FunnelAnalysis dateRange={dateRange} />
        <RetentionAnalysis weeks={8} />
      </div>
    </div>
  );
}

export default AdvancedAnalyticsDashboard;
