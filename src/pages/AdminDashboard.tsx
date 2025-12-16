import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, Phone, MapPin, CheckCircle, XCircle, Clock, Search, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'waiting', 'partners'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        // 1. Récupérer TOUS les profils (Clients + Partners)
        const { data: profiles } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });
        setUsers(profiles || []);

        // 2. Récupérer TOUTES les commandes (avec infos basiques)
        // Note: Pour avoir le nom/tel du client, on fera le lien manuellement avec les profils chargés ci-dessus
        const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        setOrders(orderData || []);

    } catch (e) {
        console.error(e);
        toast.error("Erreur chargement données");
    } finally {
        setLoading(false);
    }
  };

  // --- ACTIONS ---

  const verifyPartner = async (userId: string) => {
    if(!confirm("Valider ce partenaire ? Il aura accès au dashboard.")) return;
    const { error } = await supabase.from('user_profiles').update({ status: 'active' }).eq('id', userId);
    if (error) toast.error('Erreur');
    else { toast.success('Partenaire validé !'); fetchData(); }
  };

  const deleteUser = async (userId: string) => {
     if(!confirm("SUPPRIMER DÉFINITIVEMENT ?")) return;
     // On supprime le profil (la base supprimera le reste via cascade si configuré, sinon faudra nettoyer)
     const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
     if (error) toast.error('Erreur suppression');
     else { toast.success('Utilisateur supprimé'); fetchData(); }
  };

  const markOrderHandled = async (orderId: string) => {
      // Pour la conciergerie : on dit qu'on a traité le lead
      const { error } = await supabase.from('orders').update({ status: 'pending' }).eq('id', orderId);
      if (error) toast.error('Erreur');
      else { toast.success('Lead traité ! Commande en attente de pressing.'); fetchData(); }
  };

  // --- HELPER POUR LIER LES DONNÉES ---
  const getUser = (id: string) => users.find(u => u.id === id) || { full_name: 'Inconnu', phone: 'Non renseigné' };

  // --- CALCULS STATS ---
  const pendingPartners = users.filter(u => u.role === 'partner' && u.status === 'pending').length;
  const waitingLeads = orders.filter(o => o.status === 'waiting_list').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg"><Users className="text-white"/></div>
                    Tour de Contrôle
                </h1>
                <p className="text-slate-400 mt-2">Gérez les leads, les partenaires et les utilisateurs.</p>
            </div>
            <button onClick={fetchData} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm">
                Actualiser
            </button>
        </div>

        {/* ALERTES / STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* CARTE LEADS (URGENT) */}
            <div className={`p-6 rounded-2xl border ${waitingLeads > 0 ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className={`text-sm font-bold uppercase ${waitingLeads > 0 ? 'text-amber-400' : 'text-slate-400'}`}>Leads Conciergerie</p>
                        <h3 className="text-4xl font-bold mt-1">{waitingLeads}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${waitingLeads > 0 ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                        <Phone size={24}/>
                    </div>
                </div>
                <p className="text-xs text-slate-400">Clients en attente d'appel (Zone sans pressing)</p>
            </div>

            {/* CARTE PARTENAIRES À VALIDER */}
            <div className={`p-6 rounded-2xl border ${pendingPartners > 0 ? 'bg-teal-500/10 border-teal-500/50' : 'bg-slate-900 border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className={`text-sm font-bold uppercase ${pendingPartners > 0 ? 'text-teal-400' : 'text-slate-400'}`}>Partenaires en attente</p>
                        <h3 className="text-4xl font-bold mt-1">{pendingPartners}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${pendingPartners > 0 ? 'bg-teal-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                        <CheckCircle size={24}/>
                    </div>
                </div>
                <p className="text-xs text-slate-400">Pressings inscrits à vérifier</p>
            </div>

            {/* CARTE TOTAL USERS */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase">Total Inscrits</p>
                        <h3 className="text-4xl font-bold mt-1">{users.length}</h3>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-full text-slate-400"><Users size={24}/></div>
                </div>
                <p className="text-xs text-slate-400">Clients + Partenaires</p>
            </div>
        </div>

        {/* SECTION 1 : LEADS CONCIERGERIE (Ce qu'il faut traiter) */}
        {waitingLeads > 0 && (
            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={20}/> À TRAITER EN PRIORITÉ
                </h2>
                <div className="bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-amber-500/10 text-amber-200 text-xs uppercase">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Adresse & Besoin</th>
                                <th className="p-4">Téléphone</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.filter(o => o.status === 'waiting_list').map(o => {
                                const client = getUser(o.client_id);
                                return (
                                    <tr key={o.id} className="hover:bg-white/5">
                                        <td className="p-4 text-sm text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold">{client.full_name}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-sm"><MapPin size={14} className="text-slate-500"/> {o.pickup_address}</div>
                                            <div className="text-xs text-slate-500 mt-1">{o.weight} kg • {o.total_price} €</div>
                                        </td>
                                        <td className="p-4">
                                            <a href={`tel:${client.phone}`} className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
                                                <Phone size={14}/> {client.phone || "Non renseigné"}
                                            </a>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => markOrderHandled(o.id)} className="text-xs border border-slate-600 px-3 py-1 rounded hover:bg-slate-800 text-slate-400">
                                                Marquer traité
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* SECTION 2 : TOUS LES UTILISATEURS */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Base de données Utilisateurs</h2>
                <div className="flex gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === 'all' ? 'bg-indigo-500' : 'bg-slate-800'}`}>Tout</button>
                    <button onClick={() => setFilter('partner')} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === 'partner' ? 'bg-indigo-500' : 'bg-slate-800'}`}>Partenaires</button>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-slate-400">
                            <tr>
                                <th className="p-4">Nom / Email</th>
                                <th className="p-4">Rôle</th>
                                <th className="p-4">Téléphone</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users
                                .filter(u => filter === 'all' || u.role === filter)
                                .map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="font-bold">{user.full_name || 'Sans nom'}</div>
                                        <div className="text-slate-500 text-xs">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'partner' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.role === 'partner' ? 'PRO' : 'CLIENT'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">{user.phone || '-'}</td>
                                    <td className="p-4">
                                        {user.status === 'pending' ? (
                                            <span className="text-yellow-400 flex items-center gap-1"><Clock size={12}/> À vérifier</span>
                                        ) : (
                                            <span className="text-teal-400 flex items-center gap-1"><CheckCircle size={12}/> Actif</span>
                                        )}
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        {user.role === 'partner' && user.status === 'pending' && (
                                            <button onClick={() => verifyPartner(user.id)} className="bg-teal-500 hover:bg-teal-400 text-black px-3 py-1 rounded font-bold text-xs flex items-center gap-1">
                                                <CheckCircle size={14}/> Valider
                                            </button>
                                        )}
                                        <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-500 hover:text-red-500 transition">
                                            <XCircle size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
