import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Package, Clock, CheckCircle, ArrowRight, MapPin, Loader2, Plus, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        navigate('/login'); // Sécurité : si pas connecté, on dégage
        return;
    }
    setUser(user);

    // Récupérer les commandes du client
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  // On sépare la commande active (en cours) des anciennes (historique)
  const activeOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48}/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-black mb-1">Mon Espace Client 👋</h1>
                <p className="text-slate-500">Suivez vos commandes en temps réel.</p>
            </div>
            <div className="flex gap-3">
                <Link to="/referral" className="bg-white text-teal-600 border border-teal-200 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-teal-50 transition">
                    <Gift size={18}/> Parrainage
                </Link>
                <Link to="/new-order" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                    <Plus size={18}/> Commander
                </Link>
            </div>
        </div>

        {/* --- COMMANDE ACTIVE (LA PLUS IMPORTANTE) --- */}
        {activeOrder ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-teal-100 mb-12 relative overflow-hidden">
                {/* Barre de décoration */}
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

                {/* PROGRESS BAR VISUELLE */}
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

                {/* INFOS PRATIQUES */}
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
            // EMPTY STATE (Pas de commande)
            <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-slate-200 text-center mb-12 hover:border-teal-200 transition group cursor-pointer" onClick={() => navigate('/new-order')}>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition">
                    <Package size={32}/>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Aucune commande en cours</h3>
                <p className="text-slate-500 mb-6 text-sm">Votre panier à linge déborde ? C'est le moment.</p>
                <span className="text-teal-600 font-bold flex items-center justify-center gap-2">Lancer une lessive <ArrowRight size={16}/></span>
            </div>
        )}

        {/* --- HISTORIQUE --- */}
        {pastOrders.length > 0 && (
            <>
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Clock size={20}/> Historique</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {pastOrders.map(order => (
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
