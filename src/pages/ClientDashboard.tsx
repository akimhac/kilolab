import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { ShoppingBag, Clock, User, ArrowRight, QrCode, LogOut, X, Gift, Plus } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderQR, setSelectedOrderQR] = useState<any>(null);
  const [showReferralPopup, setShowReferralPopup] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('orders').select('*').eq('client_id', user.id).order('created_at', { ascending: false });
        setOrders(data || []);
        
        // POP-UP PARRAINAGE : On l'affiche une fois par session
        const hasSeenPopup = sessionStorage.getItem('hasSeenReferral');
        if (!hasSeenPopup) {
            setTimeout(() => setShowReferralPopup(true), 1500); // Apparaît après 1.5s
            sessionStorage.setItem('hasSeenReferral', 'true');
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {/* POP-UP PARRAINAGE (NOUVEAU) */}
      {showReferralPopup && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                <button onClick={() => setShowReferralPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Gift size={40} className="animate-bounce"/>
                </div>
                <h3 className="text-2xl font-extrabold mb-2 text-slate-900">Gagnez 5€ !</h3>
                <p className="text-slate-500 mb-6">Invitez un ami à tester Kilolab. Vous gagnez 5€, lui aussi.</p>
                <Link to="/referral" className="block w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                    Voir mon code promo
                </Link>
                <button onClick={() => setShowReferralPopup(false)} className="mt-4 text-sm text-slate-400 font-bold hover:text-slate-600">Non merci</button>
            </div>
         </div>
      )}

      {/* MODALE QR CODE (Inchangée) */}
      {selectedOrderQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center relative">
              <button onClick={() => setSelectedOrderQR(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full"><X size={20}/></button>
              <h3 className="text-2xl font-bold mb-2">Code Retrait</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner border inline-block my-4"><QRCode value={selectedOrderQR.id} size={180} /></div>
              <p className="font-mono text-lg font-bold">#{selectedOrderQR.id.slice(0,8)}</p>
           </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Mon Espace</h1>
                <p className="text-slate-500">Gérez vos commandes et votre profil.</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link to="/new-order" className="px-6 py-3 bg-teal-500 text-slate-900 rounded-xl font-bold hover:bg-teal-400 transition flex items-center gap-2 shadow-lg shadow-teal-500/20">
                    <Plus size={20}/> Nouvelle Commande
                </Link>
                <button onClick={handleLogout} className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2">
                    <LogOut size={18}/>
                </button>
            </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
             <Link to="/referral" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap border border-purple-100"><Gift size={16}/> Parrainage</Link>
             <Link to="/settings" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap"><User size={16}/> Mon Profil</Link>
        </div>

        {!loading && orders.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300"/>
                <h2 className="text-xl font-bold mb-2">Aucune commande en cours</h2>
                <p className="text-slate-500 mb-6">Profitez de votre temps libre, on s'occupe du linge.</p>
            </div>
        )}

        <div className="grid gap-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={`p-4 rounded-2xl ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-lg">Commande #{order.id.slice(0,6)}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                <Clock size={14}/> {new Date(order.created_at).toLocaleDateString()} • {order.weight}kg
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right mr-4">
                            <div className="text-xl font-bold text-slate-900">{order.total_price} €</div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'waiting_list' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {order.status === 'waiting_list' ? 'En attente' : order.status}
                            </span>
                        </div>
                        <button onClick={() => setSelectedOrderQR(order)} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition flex flex-col items-center justify-center w-20">
                            <QrCode size={24}/>
                            <span className="text-[10px] font-bold mt-1">QR</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
