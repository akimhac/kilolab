import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Package, CheckCircle, Clock, Play, ArrowRight, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      // 1. Récupérer le profil Partenaire lié à cet utilisateur
      // (Note: Dans Supabase, il faudra lier l'email du user à la table 'partners')
      // Pour ce test, on peut simuler ou récupérer le premier partenaire si tu es admin
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('email', user.email) // On suppose que le partner s'est inscrit avec cet email
        .single();

      if (partnerError || !partnerData) {
        // Si pas de compte partenaire, on redirige ou on affiche une erreur
        // Pour le test, on ne bloque pas, on affiche juste l'interface vide
        console.log("Compte partenaire non trouvé pour cet email");
      } else {
        setPartner(partnerData);
        
        // 2. Récupérer les commandes assignées à ce partenaire
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('partner_id', partnerData.id) // IMPORTANT : Filtrer par partenaire
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false });
            
        if (ordersData) setOrders(ordersData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Statut mis à jour : ${newStatus}`);
      
      // Mise à jour locale pour éviter de recharger
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  // Calculs rapides pour le header
  const ordersToDo = orders.filter(o => o.status === 'pending' || o.status === 'cleaning');
  const revenue = orders.filter(o => o.status === 'completed').reduce((acc, curr) => acc + (curr.total_price * 0.7), 0); // Ex: Partner touche 70%

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      <Navbar />
      
      {/* HEADER PARTENAIRE */}
      <div className="bg-slate-900 text-white pt-24 pb-12 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Espace Pro</span>
                    {partner && <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Actif</span>}
                </div>
                <h1 className="text-3xl font-black">{partner?.company_name || "Mon Pressing"}</h1>
                <p className="text-slate-400 text-sm mt-1">Gérez votre production en temps réel.</p>
            </div>
            
            {/* KPI RAPIDES */}
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 min-w-[140px]">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">À traiter</div>
                    <div className="text-2xl font-black">{ordersToDo.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 min-w-[140px]">
                    <div className="text-teal-300 text-xs font-bold uppercase mb-1">Gain estimé</div>
                    <div className="text-2xl font-black text-teal-400">{revenue.toFixed(0)} €</div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        
        {/* LISTE DES COMMANDES */}
        <div className="space-y-4">
            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32}/>
                    </div>
                    <h3 className="font-bold text-lg">Aucune commande assignée</h3>
                    <p className="text-slate-500">Les nouvelles commandes apparaîtront ici.</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                        {/* Header Carte */}
                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
                                    ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                                      order.status === 'cleaning' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {order.status === 'pending' ? '!' : order.status === 'cleaning' ? '⚙️' : '✓'}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">Cmd #{order.id.toString().slice(0,6)}</h3>
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <Clock size={14}/> {new Date(order.created_at).toLocaleDateString()}
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="font-bold text-slate-700">{order.weight} kg</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* ACTION BUTTONS */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => updateStatus(order.id, 'cleaning')}
                                        className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                                    >
                                        <Play size={18}/> Lancer Lavage
                                    </button>
                                )}
                                {order.status === 'cleaning' && (
                                    <button 
                                        onClick={() => updateStatus(order.id, 'ready')}
                                        className="flex-1 md:flex-none bg-teal-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-400 transition shadow-lg shadow-teal-500/30"
                                    >
                                        <CheckCircle size={18}/> Marquer Prêt
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl font-bold border border-green-100 flex items-center gap-2">
                                        <CheckCircle size={18}/> Prêt à récupérer
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Détails Carte */}
                        <div className="p-6 bg-slate-50 flex flex-col md:flex-row gap-6 text-sm">
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Formule</p>
                                <p className="font-bold text-slate-900 capitalize">{order.formula || 'Standard'}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Instructions</p>
                                <p className="text-slate-600 italic">"Pas d'assouplissant svp"</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Revenu Partenaire</p>
                                <p className="font-bold text-teal-600">{(order.total_price * 0.7).toFixed(2)} €</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
