import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Users, ShoppingBag, CheckCircle, Phone, LogOut } from 'lucide-react';
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
    const isBypass = localStorage.getItem('kilolab_admin_bypass') === 'true';
    if (!isBypass) {
        // Si pas de sésame, dehors !
        window.location.href = '/admin-access';
        return;
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        setOrders(ordersData || []);
        
        // Simulation pour l'instant
        setPartners([
            { id: '1', full_name: 'Pressing Example', email: 'test@press.com', status: 'pending' }
        ]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard 👑</h1>
            <button onClick={() => { localStorage.removeItem('kilolab_admin_bypass'); window.location.href='/'; }} className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1 font-bold"><LogOut size={14}/> Quitter</button>
        </div>

        {/* SECTION COMMANDES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag className="text-teal-500"/> Dernières Commandes</h2>
            <div className="space-y-4">
                {orders.length === 0 && <p className="text-slate-400 text-sm">Aucune commande.</p>}
                {orders.map(o => (
                    <div key={o.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <div className="font-bold text-lg">Cmd #{o.id.toString().slice(0,6)} <span className="text-sm font-normal text-slate-500">({o.weight}kg)</span></div>
                            <div className="text-sm text-slate-500">{new Date(o.created_at).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-400 mt-1">{o.pickup_address}</div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{o.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION PARTENAIRES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-teal-500"/> Candidatures Partenaires</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500"><th className="p-3">Société</th><th className="p-3">Email</th><th className="p-3">Statut</th><th className="p-3">Action</th></tr>
                    </thead>
                    <tbody>
                        {partners.map(p => (
                            <tr key={p.id} className="border-t border-slate-100">
                                <td className="p-3 font-bold">{p.full_name}</td>
                                <td className="p-3">{p.email}</td>
                                <td className="p-3"><span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">En attente</span></td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => toast.success("Validé !")} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Valider</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
