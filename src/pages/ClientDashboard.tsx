import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { 
  Package, Clock, CheckCircle, ArrowRight, MapPin, Loader2, Plus, Gift,
  TrendingUp, Droplet, Home, UserCheck, Award, BarChart3, DollarSign, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ========================================
// GRAPHIQUES SVG MAISON (pas de dépendance)
// ========================================
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
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2"/>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="2"/>
      <polyline points={points} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((point, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
        const y = height - padding - (point.value / maxValue) * (height - 2 * padding);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#14b8a6" stroke="white" strokeWidth="2"/>
            <text x={x} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748b">{point.date}</text>
          </g>
        );
      })}
    </svg>
  );
}

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
              style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
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

  // ========================================
  // NOTIFICATIONS TEMPS RÉEL
  // ========================================
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('client-orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `client_id=eq.${user.id}`
      }, (payload) => {
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
      })
      .subscribe();

    return () => subscription.unsubscribe();
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

  // ========================================
  // STATISTIQUES AVANCÉES
  // ========================================
  const clientStats = useMemo(() => {
    const completed = orders.filter(o => o.status === 'completed');
    const totalSpent = completed.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const totalKg = completed.reduce((sum, o) => sum + parseFloat(o.weight || 0), 0);
    const avgOrderValue = completed.length > 0 ? totalSpent / completed.length : 0;
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

  const loyaltyLevel = useMemo(() => {
    const count = clientStats.completedOrders;
    if (count >= 20) return { level: 'Platine 💎', color: 'purple', progress: 100, next: 'Max' };
    if (count >= 10) return { level: 'Gold 🏆', color: 'yellow', progress: (count / 20) * 100, next: '20 pour Platine' };
    if (count >= 5) return { level: 'Silver 🥈', color: 'slate', progress: (count / 10) * 100, next: '10 pour Gold' };
    return { level: 'Bronze 🥉', color: 'orange', progress: (count / 5) * 100, next: '5 pour Silver' };
  }, [clientStats]);

  const monthlySpending = useMemo(() => {
    const monthMap = new Map<string, number>();
    orders.filter(o => o.status === 'completed').forEach(order => {
      const month = new Date(order.created_at).toLocaleDateString('fr-FR', { month: 'short' });
      monthMap.set(month, (monthMap.get(month) || 0) + parseFloat(order.total_price || 0));
    });
    return Array.from(monthMap.entries()).slice(-6).map(([date, value]) => ({ date, value: parseFloat(value.toFixed(2)) }));
  }, [orders]);

  const formulaDistribution = useMemo(() => {
    const formulaMap = new Map<string, number>();
    orders.forEach(order => {
      const formula = order.formula || 'Eco';
      formulaMap.set(formula, (formulaMap.get(formula) || 0) + 1);
    });
    const colors: any = { 'Eco': '#14b8a6', 'Express': '#f59e0b', 'Premium': '#8b5cf6' };
    return Array.from(formulaMap.entries()).map(([label, value]) => ({ label, value, color: colors[label] || '#64748b' }));
  }, [orders]);

  const filteredPastOrders = useMemo(() => {
    let filtered = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterPeriod !== 'all') {
      const days = filterPeriod === '30d' ? 30 : 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(o => new Date(o.created_at) >= cutoffDate);
    }
    return filtered;
  }, [orders, searchTerm, filterPeriod]);

  const activeOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');
  const orderSteps = [
    { key: 'pending', label: 'Reçu', icon: Package },
    { key: 'assigned', label: 'Assigné', icon: UserCheck },
    { key: 'in_progress', label: 'Lavage', icon: Droplet },
    { key: 'ready', label: 'Prêt', icon: CheckCircle },
    { key: 'completed', label: 'Livré', icon: Home }
  ];
  const currentStepIndex = orderSteps.findIndex(s => s.key === activeOrder?.status);

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
                showAnalytics ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <BarChart3 size={18}/> {showAnalytics ? 'Vue simple' : 'Analytics'}
            </button>
            <Link to="/referral" className="bg-white text-teal-600 border border-teal-200 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-50 transition">
              <Gift size={18}/> Parrainage
            </Link>
            <Link to="/new-order" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
              <Plus size={18}/> Commander
            </Link>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="text-blue-600" size={20}/>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Commandes</p>
            <p className="text-2xl font-black text-slate-900">{clientStats.completedOrders}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2">
              <DollarSign className="text-teal-600" size={20}/>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Dépensé</p>
            <p className="text-2xl font-black text-teal-600">{clientStats.totalSpent.toFixed(2)} €</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="text-purple-600" size={20}/>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Kg lavés</p>
            <p className="text-2xl font-black text-purple-600">{clientStats.totalKg.toFixed(1)} kg</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Award className="text-green-600" size={20}/>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Panier moyen</p>
            <p className="text-2xl font-black text-green-600">{clientStats.avgOrderValue.toFixed(2)} €</p>
          </div>
        </div>

        {/* ANALYTICS */}
        {showAnalytics && (
          <div className="mb-8 space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-bold uppercase mb-1">Niveau de fidélité</p>
                  <p className="text-2xl font-black">{loyaltyLevel.level}</p>
                </div>
                <Award size={40} className="text-white/30"/>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                <div className="bg-white h-full transition-all duration-1000 rounded-full" style={{ width: `${loyaltyLevel.progress}%` }} />
              </div>
              <p className="text-purple-100 text-sm">
                {loyaltyLevel.next !== 'Max' ? `Plus que ${loyaltyLevel.next}` : '🎉 Niveau maximum atteint !'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-teal-600" size={20}/>
                  Dépenses mensuelles
                </h3>
                <SimpleLineChart data={monthlySpending} />
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="text-blue-600" size={20}/>
                  Répartition par formule
                </h3>
                <MiniBarChart data={formulaDistribution} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl">🌱</div>
                <div className="flex-1">
                  <p className="text-green-600 font-bold text-sm uppercase mb-1">Impact Environnemental</p>
                  <p className="text-2xl font-black text-green-900 mb-1">{clientStats.co2Saved} kg CO₂</p>
                  <p className="text-green-700 text-sm">économisés grâce à Kilolab ! 🌍</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TON CODE EXISTANT POUR LA COMMANDE ACTIVE - CONSERVÉ TEL QUEL */}
        {activeOrder ? (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-teal-100 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-blue-500"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block 
                  ${activeOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-teal-100 text-teal-700'}`}>
                  {activeOrder.status === 'pending' ? 'En attente' : activeOrder.status === 'cleaning' ? 'Nettoyage' : 'Prêt'}
                </span>
                <h2 className="text-2xl font-black">Commande #{activeOrder.id.toString().slice(0,6)}</h2>
                <p className="text-slate-400 text-sm mt-1">{new Date(activeOrder.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm text-slate-400">Total estimé</div>
                <div className="text-2xl font-black text-slate-900">{activeOrder.total_price} €</div>
              </div>
            </div>

            {/* PROGRESS BAR VISUELLE AMÉLIORÉE */}
            <div className="mb-8 relative">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide px-1">
                <span className={activeOrder.status ? 'text-teal-600' : ''}>Reçu</span>
                <span className={activeOrder.status === 'cleaning' || activeOrder.status === 'ready' ? 'text-teal-600' : ''}>Lavage</span>
                <span className={activeOrder.status === 'ready' ? 'text-teal-600' : ''}>Prêt</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                  style={{ 
                    width: activeOrder.status === 'pending' ? '33%' : 
                           activeOrder.status === 'cleaning' ? '66%' : 
                           activeOrder.status === 'ready' ? '100%' : '5%' 
                  }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm"><MapPin size={18} className="text-teal-500"/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Lieu de collecte</p>
                  <p className="font-medium truncate">{activeOrder.pickup_address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-white p-2 rounded-lg shadow-sm"><Package size={18} className="text-teal-500"/></div>
                <div>
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
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Clock size={20}/> Historique</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').map(order => (
                <div key={order.id} className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={20}/></div>
                    <div>
                      <div className="font-bold text-slate-900">Commande #{order.id.toString().slice(0,6)}</div>
                      <div className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{order.total_price} €</div>
                    <div className="text-xs text-slate-500">{order.weight} kg</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
