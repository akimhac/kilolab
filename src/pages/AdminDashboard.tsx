import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, CheckCircle, XCircle, Phone, MapPin, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    // 1. Vérification du PASS SECRET
    const isBypass = localStorage.getItem('kilolab_admin_bypass') === 'true';
    if (isBypass) {
        fetchData();
        return;
    }

    // 2. Sinon vérification classique
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }
    
    const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') { 
        navigate('/'); 
        toast.error("Accès refusé");
    } else {
        fetchData();
    }
  };

  const fetchData = async () => {
    try {
        const { data: ordersData } = await supabase.from('orders').select('*, user_profiles(full_name, phone)').order('created_at', { ascending: false });
        setOrders(ordersData || []);
        
        const { data: partnersData } = await supabase.from('user_profiles').select('*').eq('role', 'partner');
        setPartners(partnersData || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const validatePartner = async (id: string) => {
    await supabase.from('user_profiles').update({ status: 'active' }).eq('id', id);
    toast.success("Partenaire validé !");
    fetchData();
  };

  const deletePartner = async (id: string) => {
    if(!confirm("Supprimer ce partenaire ?")) return;
    await supabase.from('user_profiles').delete().eq('id', id);
    toast.success("Partenaire supprimé.");
    fetchData();
  };

  if (loading) return <div className="p-10 text-center">Chargement Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard 👑</h1>
            <button onClick={() => { localStorage.removeItem('kilolab_admin_bypass'); navigate('/'); }} className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1 font-bold"><LogOut size={14}/> Quitter</button>
        </div>

        {/* SECTION PARTENAIRES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-teal-500"/> Gestion Partenaires ({partners.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500"><th className="p-3">Société / Nom</th><th className="p-3">Email</th><th className="p-3">Statut</th><th className="p-3">Action</th></tr>
                    </thead>
                    <tbody>
                        {partners.map(p => (
                            <tr key={p.id} className="border-t border-slate-100">
                                <td className="p-3 font-bold">{p.full_name || 'Sans nom'}</td>
                                <td className="p-3">{p.email}</td>
                                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status === 'active' ? 'Actif' : 'En attente'}</span></td>
                                <td className="p-3 flex gap-2">
                                    {p.status !== 'active' && (
                                        <button onClick={() => validatePartner(p.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Valider</button>
                                    )}
                                    <button onClick={() => deletePartner(p.id)} className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-xs font-bold"><XCircle size={12}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* SECTION COMMANDES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag className="text-teal-500"/> Dernières Commandes</h2>
            <div className="space-y-4">
                {orders.map(o => (
                    <div key={o.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <div className="font-bold text-lg">Cmd #{o.id.slice(0,6)} <span className="text-sm font-normal text-slate-500">({o.weight}kg)</span></div>
                            <div className="text-sm text-slate-500">Client: {o.user_profiles?.full_name || 'Inconnu'} • {new Date(o.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <span className="font-bold text-xl">{o.total_price} €</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'pending' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                            {o.user_profiles?.phone && <a href={`tel:${o.user_profiles.phone}`} className="p-2 bg-white border rounded-full text-slate-600"><Phone size={16}/></a>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
