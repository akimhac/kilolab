import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { 
  Package, Clock, CheckCircle, ArrowRight, MapPin, Loader2, Plus, Gift,
  TrendingUp, Calendar, Droplet, Home, UserCheck, Download, Award,
  BarChart3, DollarSign
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Composant graphique SVG maison (ultra-léger, pas de dépendance)
function SimpleLineChart({ data }: { data: { date: string; value: number }[] }) {
  if (data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const width = 400;
  const height = 150;
  const padding = 30;
  
  const points = data.map((point, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (point.value / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Grille de fond */}
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2"/>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2"/>
      
      {/* Ligne de données */}
      <polyline
        points={points}
        fill="none"
        stroke="#14b8a6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Points */}
      {data.map((point, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
        const y = height - padding - (point.value / maxValue) * (height - 2 * padding);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#14b8a6" stroke="white" strokeWidth="2"/>
            <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748b">
              {point.date}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Composant barre de progression mini
function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">{item.label}</span>
            <span className="font-bold text-slate-900">{item.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | '30d' | '90d'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  // Notifications temps réel avec Supabase Realtime
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('client-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `client_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order updated:', payload);
          fetchData();
          
          if (payload.eventType === 'UPDATE') {
            const newStatus = (payload.new as any).status;
            const statusMessages: any = {
              'assigned': '✅ Votre commande a été assignée à un partenaire !',
              'in_progress': '🧼 Votre linge est en cours de lavage !',
              'ready': '🎉 Votre commande est prête pour la livraison !',
              'completed': '✨ Commande livrée ! Merci de votre confiance.'
            };
            
            if (statusMessages[newStatus]) {
              toast.success(statusMessages[newStatus], { duration: 5000 });
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  // Statistiques client
  const clientStats = useMemo(() => {
    const completed = orders.filter(o => o.status === 'completed');
    const totalSpent = completed.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const totalKg = completed.reduce((sum, o) => sum + parseFloat(o.weight || 0), 0);
    const avgOrderValue = completed.length > 0 ? totalSpent / completed.length : 0;
    
    // Économies CO2 (exemple : 1kg lavé = 0.5kg CO2 économisé vs pressing traditionnel)
    const co2Saved = (totalKg * 0.5).toFixed(1);
    
    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      totalSpent,
      totalKg,
      avgOrderValue,
      co2Saved
    };
  }, [orders]);

  // Programme de fidélité
  const loyaltyLevel = useMemo(() => {
    const count = clientStats.completedOrders;
    if (count >= 20) return { level: 'Platine 💎', color: 'purple', progress: 100, next: 'Max' };
    if (count >= 10) return { level: 'Gold 🏆', color: 'yellow', progress: (count / 20) * 100, next: '20 pour Platine' };
    if (count >= 5) return { level: 'Silver 🥈', color: 'slate', progress: (count / 10) * 100, next: '10 pour Gold' };
    return { level: 'Bronze 🥉', color: 'orange', progress: (count / 5) * 100, next: '5 pour Silver' };
  }, [clientStats]);

  // Graphique dépenses mensuelles
  const monthlySpending = useMemo(() => {
    const monthMap = new Map<string, number>();
    
    orders
      .filter(o => o.status === 'completed')
      .forEach(order => {
        const month = new Date(order.created_at).toLocaleDateString('fr-FR', { month: 'short' });
        monthMap.set(month, (monthMap.get(month) || 0) + parseFloat(order.total_price || 0));
      });

    return Array.from(monthMap.entries())
      .slice(-6)
      .map(([date, value]) => ({ date, value: parseFloat(value.toFixed(2)) }));
  }, [orders]);

  // Répartition par formule
  const formulaDistribution = useMemo(() => {
    const formulaMap = new Map<string, number>();
    
    orders.forEach(order => {
      const formula = order.formula || 'Eco';
      formulaMap.set(formula, (formulaMap.get(formula) || 0) + 1);
    });

    const colors: any = {
      'Eco': '#14b8a6',
      'Express': '#f59e0b', 
      'Premium': '#8b5cf6'
    };

    return Array.from(formulaMap.entries()).map(([label, value]) => ({
      label,
      value,
      color: colors[label] || '#64748b'
    }));
  }, [orders]);

  // Filtrage historique
  const filteredPastOrders = useMemo(() => {
    let filtered = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par période
    if (filterPeriod !== 'all') {
      const days = filterPeriod === '30d' ? 30 : 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(o => new Date(o.created_at) >= cutoffDate);
    }
    
    return filtered;
  }, [orders, searchTerm, filterPeriod]);

  const activeOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');

  // Steps détaillés pour le tracking
  const orderSteps = [
    { key: 'pending', label: 'Reçu', icon: Package },
    { key: 'assigned', label: 'Assigné', icon: UserCheck },
    { key: 'in_progress', label: 'Lavage', icon: Droplet },
    { key: 'ready', label: 'Prêt', icon: CheckCircle },
    { key: 'completed', label: 'Livré', icon: Home }
  ];

  const currentStepIndex = orderSteps.findIndex(s => s.key === activeOrder?.status);

  const downloadInvoice = (orderId: string) => {
    toast.success('Téléchargement de la facture...');
    // Implémentation réelle : générer PDF ou rediriger
    window.open(`/invoice/${orderId}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-teal-600" size={48}/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">Mon Espace Client 👋</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${loyaltyLevel.color}-100 text-${loyaltyLevel.color}-700`}>
                {loyaltyLevel.level}
              </span>
            </div>
            <p className="text-slate-500">Suivez vos commandes en temps réel.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
                showAnalytics 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-600'
              }`}
            >
              <BarChart3 size={18}/> {showAnalytics ? 'Vue simple' : 'Analytics'}
            </button>
            <Link to="/referral" className="bg-white text-teal-600 border border-teal-200 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-50 transition">
              <Gift size={18}/> Parrainage
            </Link>
            <Link to="/new-order" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
              <Plus size={18}/> Commander
            </Link>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={20}/>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Commandes</p>
            <p className="text-2xl font-black text-slate-900">{clientStats.completedOrders}</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-teal-600" size={20}/>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Dépensé</p>
            <p className="text-2xl font-black text-teal-600">{clientStats.totalSpent.toFixed(2)} €</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="text-purple-600" size={20}/>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Kg lavés</p>
            <p className="text-2xl font-black text-purple-600">{clientStats.totalKg.toFixed(1)} kg</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="text-green-600" size={20}/>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Panier moyen</p>
            <p className="text-2xl font-black text-green-600">{clientStats.avgOrderValue.toFixed(2)} €</p>
          </div>
        </div>

        {/* SECTION ANALYTICS */}
        {showAnalytics && (
          <div className="mb-8 space-y-6">
            {/* Programme de fidélité */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-bold uppercase mb-1">Niveau de fidélité</p>
                  <p className="text-2xl font-black">{loyaltyLevel.level}</p>
                </div>
                <Award size={40} className="text-white/30"/>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                <div 
                  className="bg-white h-full transition-all duration-1000 rounded-full"
                  style={{ width: `${loyaltyLevel.progress}%` }}
                />
              </div>
              <p className="text-purple-100 text-sm">
                {loyaltyLevel.next !== 'Max' && `Plus que ${loyaltyLevel.next}`}
                {loyaltyLevel.next === 'Max' && '🎉 Niveau maximum atteint !'}
              </p>
            </div>

            {/* Graphiques */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dépenses mensuelles */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-teal-600" size={20}/>
                  Dépenses mensuelles
                </h3>
                <SimpleLineChart data={monthlySpending} />
              </div>

              {/* Répartition par formule */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="text-blue-600" size={20}/>
                  Répartition par formule
                </h3>
                <MiniBarChart data={formulaDistribution} />
              </div>
            </div>

            {/* Impact environnemental */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                  🌱
                </div>
                <div className="flex-1">
                  <p className="text-green-600 font-bold text-sm uppercase mb-1">Impact Environnemental</p>
                  <p className="text-2xl font-black text-green-900 mb-1">{clientStats.co2Saved} kg CO₂</p>
                  <p className="text-green-700 text-sm">économisés grâce à Kilolab ! 🌍</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMMANDE ACTIVE */}
        {activeOrder ? (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-teal-100 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-blue-500"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block 
                  ${activeOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    activeOrder.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                    activeOrder.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                    activeOrder.status === 'ready' ? 'bg-green-100 text-green-700' : 
                    'bg-teal-100 text-teal-700'}`}>
                  {activeOrder.status === 'pending' ? 'En attente' : 
                   activeOrder.status === 'assigned' ? 'Assigné' :
                   activeOrder.status === 'in_progress' ? 'Nettoyage' : 
                   activeOrder.status === 'ready' ? 'Prêt' : activeOrder.status}
                </span>
                <h2 className="text-2xl font-black">Commande #{activeOrder.id.toString().slice(0,6)}</h2>
                <p className="text-slate-400 text-sm mt-1">{new Date(activeOrder.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm text-slate-400">Total</div>
                <div className="text-2xl font-black text-slate-900">{activeOrder.total_price} €</div>
              </div>
            </div>

            {/* STEPPER DÉTAILLÉ */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6 relative">
                {/* Ligne de fond */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
                <div 
                  className="absolute top-6 left-0 h-0.5 bg-teal-500 transition-all duration-1000 -z-10"
                  style={{ width: `${((currentStepIndex + 1) / orderSteps.length) * 100}%` }}
                />
                
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isActive 
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/50' 
                          : 'bg-slate-200 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-teal-200' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <p className={`text-xs font-bold text-center ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimation livraison */}
            {activeOrder.pickup_date && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase">Livraison estimée</p>
                    <p className="font-bold text-blue-900">
                      {new Date(activeOrder.pickup_date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INFOS PRATIQUES */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm"><MapPin size={18} className="text-teal-500"/></div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase">Lieu de collecte</p>
                  <p className="font-medium truncate">{activeOrder.pickup_address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm"><Package size={18} className="text-teal-500"/></div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase">Détails</p>
                  <p className="font-medium">{activeOrder.weight} kg • Formule {activeOrder.formula || 'Eco'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-slate-200 text-center mb-12 hover:border-teal-200 transition group cursor-pointer" onClick={() => navigate('/new-order')}>
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition">
              <Package size={32}/>
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-900">Aucune commande en cours</h3>
            <p className="text-slate-500 mb-6 text-sm">Votre panier à linge déborde ? C'est le moment.</p>
            <span className="text-teal-600 font-bold flex items-center justify-center gap-2">Lancer une lessive <ArrowRight size={16}/></span>
          </div>
        )}

        {/* HISTORIQUE */}
        {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length > 0 && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Clock size={20}/> Historique
              </h3>
              
              {/* Filtres */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
                />
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {(['all', '30d', '90d'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setFilterPeriod(period)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                        filterPeriod === period 
                          ? 'bg-white shadow-sm text-slate-900' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {period === 'all' ? 'Tout' : period === '30d' ? '30j' : '90j'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {filteredPastOrders.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  Aucune commande trouvée.
                </div>
              ) : (
                filteredPastOrders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className={`p-6 flex items-center justify-between hover:bg-slate-50 transition ${
                      index !== filteredPastOrders.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle size={20}/> : <X size={20}/>}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">Commande #{order.id.toString().slice(0,6)}</div>
                        <div className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <div className="font-bold text-slate-900">{order.total_price} €</div>
                        <div className="text-xs text-slate-500">{order.weight} kg</div>
                      </div>
                      <button 
                        onClick={() => downloadInvoice(order.id)}
                        className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 transition"
                        title="Télécharger la facture"
                      >
                        <Download size={16}/>
                        <span className="hidden md:inline">Facture</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}