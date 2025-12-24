import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, LogOut, ExternalLink, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MODALE D'INSPECTION
  const [inspectPartner, setInspectPartner] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    if (localStorage.getItem('kilolab_admin_bypass') !== 'true') {
        window.location.href = '/admin-access';
        return;
    }
    fetchData();
  };

  const fetchData = async () => {
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(ordersData || []);
    
    // Simulation de partenaires AVEC NOTE (Algo Confiance)
    setPartners([
        { id: '1', company: 'Pressing des Lices', manager: 'Jean Dupont', email: 'jean@lices.fr', siret: '80293489200012', city: 'Vannes', status: 'pending', rating: 4.8 },
        { id: '2', company: 'Clean City', manager: 'Sarah Connor', email: 'sarah@skynet.com', siret: '40212345600023', city: 'Lille', status: 'pending', rating: 3.9 }
    ]);
    setLoading(false);
  };

  const validatePartner = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setInspectPartner(null);
    toast.success("Partenaire validé et notifié !");
  };

  const rejectPartner = (id: string) => {
    if(!confirm("Refuser ce dossier ?")) return;
    setPartners(prev => prev.filter(p => p.id !== id));
    setInspectPartner(null);
    toast.error("Partenaire refusé.");
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Chargement QG...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      
      {/* MODALE INSPECTION */}
      {inspectPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-xl">Inspection Dossier</h3>
                    <button onClick={() => setInspectPartner(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Société</p>
                            <p className="font-bold text-lg">{inspectPartner.company}</p>
                            <p className="text-slate-500">{inspectPartner.city} • SIRET: {inspectPartner.siret}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Gérant</p>
                            <p className="font-bold">{inspectPartner.manager}</p>
                            <a href={`mailto:${inspectPartner.email}`} className="text-teal-600 text-sm hover:underline">{inspectPartner.email}</a>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Vérifications externes (KYB)</p>
                        
                        <a href={`https://www.societe.com/cgi-bin/search?champs=${inspectPartner.siret}`} target="_blank" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-500 transition group">
                            <span className="font-bold text-slate-700">Societe.com</span>
                            <ExternalLink size={16} className="text-slate-400 group-hover:text-teal-500"/>
                        </a>
                        <a href={`https://www.pappers.fr/recherche?q=${inspectPartner.siret}`} target="_blank" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-500 transition group">
                            <span className="font-bold text-slate-700">Pappers.fr</span>
                            <ExternalLink size={16} className="text-slate-400 group-hover:text-teal-500"/>
                        </a>
                        <a href={`http://googleusercontent.com/maps.google.com/?q=${inspectPartner.company}+${inspectPartner.city}`} target="_blank" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-500 transition group">
                            <span className="font-bold text-slate-700">Google Maps (Avis)</span>
                            <ExternalLink size={16} className="text-slate-400 group-hover:text-teal-500"/>
                        </a>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={() => rejectPartner(inspectPartner.id)} className="flex-1 py-3 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50">Refuser</button>
                        <button onClick={() => validatePartner(inspectPartner.id)} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black shadow-lg">Valider le dossier</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-slate-900">Admin Dashboard 👑</h1>
            <button onClick={() => { localStorage.removeItem('kilolab_admin_bypass'); window.location.href='/'; }} className="bg-white border text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50"><LogOut size={16}/> Sortir</button>
        </div>

        {/* METRIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase">Volume (Mois)</div>
                <div className="text-2xl font-black text-emerald-600">12,450 €</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase">Commandes</div>
                <div className="text-2xl font-black text-slate-900">142</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase">Partenaires</div>
                <div className="text-2xl font-black text-purple-600">12</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase">À valider</div>
                <div className="text-2xl font-black text-orange-500">{partners.length}</div>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* LISTE PARTENAIRES (AVEC NOTE DE CONFIANCE) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Users className="text-teal-500"/> Candidatures</h2>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{partners.length} en attente</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {partners.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">Rien à signaler chef !</div>}
                    {partners.map(p => (
                        <div key={p.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                            <div>
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                    {p.company}
                                    {p.rating && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${p.rating >= 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            ★ {p.rating}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-500">{p.city}</div>
                            </div>
                            <button onClick={() => setInspectPartner(p)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-teal-500 transition">
                                <Search size={14}/> Inspecter
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* LISTE COMMANDES */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingBag className="text-teal-500"/> Dernières Commandes</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {orders.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">En attente de clients...</div>}
                    {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                            <div>
                                <div className="font-bold text-sm">Cmd #{o.id.toString().slice(0,6)}</div>
                                <div className="text-xs text-slate-500">{new Date(o.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {o.status}
                                </span>
                                <div className="font-bold text-sm">{o.total_price} €</div>
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
