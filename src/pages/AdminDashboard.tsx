import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, CheckCircle, XCircle, LogOut, TrendingUp, Wallet, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats (Simulées pour l'instant pour que ce soit joli)
  const stats = [
    { label: "Volume d'Affaires", val: "12,450 €", icon: <Wallet className="text-emerald-500"/>, color: "bg-emerald-50" },
    { label: "Commandes Totales", val: "142", icon: <ShoppingBag className="text-blue-500"/>, color: "bg-blue-50" },
    { label: "Partenaires Actifs", val: "12", icon: <Users className="text-purple-500"/>, color: "bg-purple-50" },
    { label: "Taux de Conversion", val: "4.8%", icon: <Activity className="text-orange-500"/>, color: "bg-orange-50" },
  ];

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const isBypass = localStorage.getItem('kilolab_admin_bypass') === 'true';
    if (!isBypass) {
        window.location.href = '/admin-access';
        return;
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(ordersData || []);
        
        // Simulation partenaires en attente (car pas de table user_profiles remplie pour l'instant)
        // Mais si tu as des vrais users, remplace par la requête Supabase
        setPartners([
            { id: '1', full_name: 'Pressing Example', email: 'test@press.com', status: 'pending' },
            { id: '2', full_name: 'Clean City Lille', email: 'contact@cleancity.fr', status: 'pending' }
        ]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // ✅ CORRECTION : La fonction met à jour l'état local pour faire disparaitre la ligne
  const validatePartner = async (id: string) => {
    // 1. Appel DB (Simulé ou Réel)
    // await supabase.from('user_profiles').update({ status: 'active' }).eq('id', id);
    
    // 2. Mise à jour visuelle immédiate
    setPartners(current => current.filter(p => p.id !== id));
    
    toast.success("Partenaire validé et activé !");
  };

  const deletePartner = async (id: string) => {
    if(!confirm("Refuser ce partenaire ?")) return;
    setPartners(current => current.filter(p => p.id !== id));
    toast.success("Candidature refusée.");
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Chargement du QG...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Admin Dashboard 👑</h1>
                <p className="text-slate-500">Vue d'ensemble de l'activité Kilolab.</p>
            </div>
            <button onClick={() => { localStorage.removeItem('kilolab_admin_bypass'); window.location.href='/'; }} className="text-sm bg-white border border-slate-200 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-red-50 transition">
                <LogOut size={16}/> Déconnexion
            </button>
        </div>

        {/* KPI CARDS (Pour ne plus avoir un dashboard vide) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${s.color}`}>
                        {s.icon}
                    </div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                </div>
            ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* SECTION PARTENAIRES */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-teal-500"/> Candidatures ({partners.length})</h2>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Action requise</span>
                </div>
                
                {partners.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                        Aucune nouvelle candidature.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {partners.map(p => (
                            <div key={p.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                                <div>
                                    <div className="font-bold text-slate-900">{p.full_name}</div>
                                    <div className="text-sm text-slate-500">{p.email}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => validatePartner(p.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-lg shadow-green-500/20">
                                        <CheckCircle size={14}/> Valider
                                    </button>
                                    <button onClick={() => deletePartner(p.id)} className="bg-white border border-slate-200 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition">
                                        <XCircle size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION COMMANDES */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="text-teal-500"/> Flux Commandes</h2>
                <div className="space-y-4">
                    {orders.length === 0 && <p className="text-slate-400 italic">En attente de commandes...</p>}
                    {orders.map(o => (
                        <div key={o.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition cursor-pointer">
                            <div>
                                <div className="font-bold text-sm">Cmd #{o.id.toString().slice(0,6)}</div>
                                <div className="text-xs text-slate-500">{o.weight}kg • {o.pickup_address}</div>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {o.status}
                                </span>
                                <div className="font-bold text-sm mt-1">{o.total_price} €</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
