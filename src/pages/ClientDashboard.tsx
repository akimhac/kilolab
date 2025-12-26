import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Package, Clock, CheckCircle, ArrowRight, MapPin, Loader2, Plus } from 'lucide-react';
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
        navigate('/login');
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

  const activeOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-3xl font-black mb-1">Bonjour, {user?.email?.split('@')[0]} 👋</h1>
                <p className="text-slate-500">Heureux de vous revoir.</p>
            </div>
            <Link to="/new-order" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                <Plus size={18}/> Nouvelle commande
            </Link>
        </div>

        {/* COMMANDE EN COURS (ACTIVE) */}
        {activeOrder ? (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-teal-100 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                            En cours
                        </span>
                        <h2 className="text-2xl font-black">Commande #{activeOrder.id.toString().slice(0,6)}</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400">Total estimé</div>
                        <div className="text-xl font-black text-slate-900">{activeOrder.total_price} €</div>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                        <span className={activeOrder.status === 'pending' ? 'text-teal-600' : ''}>Collecte</span>
                        <span className={activeOrder.status === 'cleaning' ? 'text-teal-600' : ''}>Lavage</span>
                        <span className={activeOrder.status === 'ready' ? 'text-teal-600' : ''}>Prêt</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-teal-500 transition-all duration-1000"
                            style={{ width: activeOrder.status === 'pending' ? '33%' : activeOrder.status === 'cleaning' ? '66%' : '100%' }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                    <MapPin size={18} className="text-teal-500 shrink-0"/>
                    <span>{activeOrder.pickup_address}</span>
                </div>
            </div>
        ) : (
            <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-300 text-center mb-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Package size={32}/>
                </div>
                <h3 className="font-bold text-lg mb-2">Aucune commande en cours</h3>
                <p className="text-slate-500 mb-6 text-sm">Votre panier à linge est plein ? C'est le moment.</p>
                <Link to="/new-order" className="text-teal-600 font-bold hover:underline">Lancer une lessive &rarr;</Link>
            </div>
        )}

        {/* HISTORIQUE */}
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Clock size={20}/> Historique</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {pastOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">Vos anciennes commandes apparaîtront ici.</div>
            ) : (
                pastOrders.map(order => (
                    <div key={order.id} className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={20}/></div>
                            <div>
                                <div className="font-bold">Commande #{order.id.toString().slice(0,6)}</div>
                                <div className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">{order.total_price} €</div>
                            <div className="text-xs text-slate-500">{order.weight} kg</div>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}
