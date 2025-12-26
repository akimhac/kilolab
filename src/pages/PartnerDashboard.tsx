import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import OrderTicket from '../components/OrderTicket';
import { Package, DollarSign, Filter, Printer, X, Loader2, UserPlus, LogOut, CheckCircle, Play, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  
  // Deux listes distinctes : Celles que je dois faire, et celles disponibles
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Pour l'impression

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    try {
      // 1. Auth Check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      // 2. Security Check (Role)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'partner') {
        toast.error("Accès réservé aux partenaires certifiés.");
        navigate('/dashboard'); // Renvoi vers dashboard client
        return;
      }

      // 3. Get Partner Info (Nom du pressing, etc.)
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('email', user.email) // On lie via l'email
        .single();
      
      setPartner(partnerData);

      // 4. Fetch Orders
      await fetchOrders(user.id);

    } catch (error) {
      console.error("Erreur init:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    // A. Mes commandes (Assignées à moi)
    const { data: mine } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', userId)
      .order('created_at', { ascending: false });

    if (mine) {
      setMyOrders(mine);
      calculateStats(mine);
    }

    // B. Commandes Disponibles (Marketplace - Pas de partenaire et statut pending)
    const { data: available } = await supabase
      .from('orders')
      .select('*')
      .is('partner_id', null)
      .eq('status', 'pending')
      .order('pickup_date', { ascending: true });

    if (available) {
      setAvailableOrders(available);
    }
  };

  const calculateStats = (orders: any[]) => {
    const revenue = orders.reduce((acc, order) => {
      // Le partenaire touche 100% ou 70% selon ton business model. Ici on met 70%.
      return acc + (order.status === 'completed' ? (order.total_price * 0.7) : 0);
    }, 0);

    const pending = orders.filter(o => 
      o.status !== 'completed' && o.status !== 'cancelled'
    ).length;
    
    setStats({
      total: orders.length,
      pending: pending,
      revenue: parseFloat(revenue.toFixed(2))
    });
  };

  // --- ACTIONS ---

  const takeOrder = async (orderId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic Update : On enlève visuellement la commande de la liste dispo
    setAvailableOrders(prev => prev.filter(o => o.id !== orderId));

    const { error } = await supabase
      .from('orders')
      .update({ 
        partner_id: user.id,
        status: 'assigned' 
      })
      .eq('id', orderId)
      .is('partner_id', null); // Sécurité anti-conflit

    if (error) {
      toast.error("Déjà prise par un autre !");
      fetchOrders(user.id); // On rafraichit
    } else {
      toast.success("Commande acceptée !");
      fetchOrders(user.id); // On rafraichit pour l'avoir dans "Mes commandes"
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error("Erreur mise à jour");
    } else {
      toast.success("Statut mis à jour");
      // Mise à jour locale
      setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      // Si terminé, on recalcule le CA
      if (newStatus === 'completed') {
         const updatedList = myOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
         calculateStats(updatedList);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtrage pour l'affichage
  const filteredMyOrders = filter === 'all' 
    ? myOrders 
    : myOrders.filter(o => o.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      {/* HEADER & KPI */}
      <div className="bg-slate-900 text-white pt-24 pb-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Partenaire Certifié</span>
                    </div>
                    <h1 className="text-3xl font-black">{partner?.company_name || "Mon Pressing"}</h1>
                    <p className="text-slate-400 text-sm mt-1">Tableau de bord de production.</p>
                </div>
                <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition">
                    <LogOut size={16}/> Déconnexion
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400"><Package size={24}/></div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">À traiter</p>
                        <p className="text-3xl font-black">{stats.pending}</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="bg-green-500/20 p-3 rounded-xl text-green-400"><DollarSign size={24}/></div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase">CA Estimé</p>
                        <p className="text-3xl font-black">{stats.revenue} €</p>
                    </div>
                </div>
                <div className="bg-teal-600 p-6 rounded-2xl border border-teal-500 flex items-center gap-4 shadow-lg shadow-teal-500/20">
                    <div className="bg-white/20 p-3 rounded-xl text-white"><UserPlus size={24}/></div>
                    <div>
                        <p className="text-teal-100 text-xs font-bold uppercase">Disponibles</p>
                        <p className="text-3xl font-black">{availableOrders.length}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        
        {/* 1. MARKETPLACE (Commandes à prendre) */}
        {availableOrders.length > 0 && (
            <div className="mb-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h2 className="font-black text-xl mb-4 flex items-center gap-2 text-slate-800 ml-1">
                    <MapPin className="text-teal-600"/> Nouvelle demande dans votre zone
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-teal-100 hover:border-teal-300 transition group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">DISPO</div>
                            
                            <div className="mb-4">
                                <span className="font-mono text-xs font-bold text-slate-400">#{order.id.slice(0,8)}</span>
                                <h3 className="font-bold text-lg mt-1">{order.pickup_address ? order.pickup_address.split(',')[0] : "Adresse masquée"}</h3>
                                <p className="text-sm text-slate-500">{new Date(order.pickup_date).toLocaleDateString()}</p>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Poids</p>
                                    <p className="font-bold">{order.weight} kg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Gain</p>
                                    <p className="font-black text-teal-600 text-lg">{(order.total_price * 0.7).toFixed(2)} €</p>
                                </div>
                            </div>

                            <button onClick={() => takeOrder(order.id)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition flex items-center justify-center gap-2 shadow-md">
                                <UserPlus size={18}/> Accepter la course
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 2. MES COMMANDES (Production) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="font-black text-xl flex items-center gap-2">
                    <Filter size={20}/> Production en cours
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
                    {['all', 'assigned', 'cleaning', 'ready', 'completed'].map(key => (
                        <button 
                            key={key} 
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize whitespace-nowrap ${filter === key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {key === 'all' ? 'Tout' : key === 'assigned' ? 'À faire' : key === 'cleaning' ? 'Lavage' : key === 'ready' ? 'Prêt' : 'Fini'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-6">ID</th>
                            <th className="p-6">Détails</th>
                            <th className="p-6">Statut</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredMyOrders.length === 0 && (
                            <tr><td colSpan={4} className="p-12 text-center text-slate-400">Aucune commande ici.</td></tr>
                        )}
                        {filteredMyOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                                <td className="p-6">
                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">#{order.id.slice(0,6)}</span>
                                    <div className="text-xs text-slate-400 mt-2">{new Date(order.pickup_date).toLocaleDateString()}</div>
                                </td>
                                <td className="p-6">
                                    <div className="font-bold">{order.weight} kg <span className="text-slate-400 font-normal">| {order.formula || 'Eco'}</span></div>
                                    <div className="text-xs text-slate-500 mt-1 max-w-xs truncate">{order.pickup_address}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                                        ${order.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' : 
                                          order.status === 'cleaning' ? 'bg-blue-100 text-blue-700' : 
                                          order.status === 'ready' ? 'bg-purple-100 text-purple-700' : 
                                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right flex justify-end items-center gap-2">
                                    <button onClick={() => setSelectedOrder(order)} className="p-2 border rounded-lg hover:bg-slate-100" title="Imprimer"><Printer size={18}/></button>
                                    
                                    {order.status === 'assigned' && (
                                        <button onClick={() => updateStatus(order.id, 'cleaning')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition flex gap-2"><Play size={16}/> Start</button>
                                    )}
                                    {order.status === 'cleaning' && (
                                        <button onClick={() => updateStatus(order.id, 'ready')} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-500 transition flex gap-2"><CheckCircle size={16}/> Prêt</button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button onClick={() => updateStatus(order.id, 'completed')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition flex gap-2"><CheckCircle size={16}/> Livré</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MODALE IMPRESSION */}
        {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-lg">Ticket Commande</h3>
                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="p-6 flex justify-center bg-slate-100">
                        <div className="scale-90 origin-top">
                            <OrderTicket 
                                orderId={selectedOrder.id.slice(0,8)}
                                customerName={selectedOrder.pickup_address || "Client"}
                                weight={selectedOrder.weight}
                                items={selectedOrder.formula}
                                date={new Date(selectedOrder.pickup_date).toLocaleDateString()}
                            />
                        </div>
                    </div>
                    <div className="p-4 border-t flex gap-3">
                        <button onClick={handlePrint} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex justify-center gap-2"><Printer size={20}/> Imprimer</button>
                        <button onClick={() => setSelectedOrder(null)} className="px-6 py-3 border rounded-xl font-bold hover:bg-slate-50">Fermer</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
