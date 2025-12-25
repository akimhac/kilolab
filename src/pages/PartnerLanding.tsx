import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import OrderTicket from '../components/OrderTicket';
import { Package, DollarSign, Filter, Printer, X, Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    setUserId(user.id);
    await fetchOrders(user.id);
  };

  const fetchOrders = async (uid: string) => {
    setLoading(true);

    // Récupérer les commandes assignées au partenaire
    const { data: myOrders, error: myError } = await supabase
      .from('orders')
      .select('*')
      .eq('partner_id', uid)
      .order('created_at', { ascending: false });

    // Récupérer les commandes disponibles (non assignées)
    const { data: available, error: availError } = await supabase
      .from('orders')
      .select('*')
      .is('partner_id', null)
      .eq('status', 'pending')
      .order('pickup_date', { ascending: true });

    if (myError) {
      console.error("Erreur fetch myOrders:", myError);
      toast.error("Impossible de charger vos commandes.");
    } else {
      setOrders(myOrders || []);
      calculateStats(myOrders || []);
    }

    if (availError) {
      console.error("Erreur fetch available:", availError);
    } else {
      setAvailableOrders(available || []);
    }

    setLoading(false);
  };

  const calculateStats = (data: any[]) => {
    const revenue = data.reduce((acc, order) => {
      return acc + (order.status === 'completed' ? parseFloat(order.total_price || 0) : 0);
    }, 0);
    const pending = data.filter(o => 
      o.status !== 'completed' && o.status !== 'cancelled'
    ).length;
    
    setStats({
      total: data.length,
      pending: pending,
      revenue: parseFloat(revenue.toFixed(2))
    });
  };

  const takeOrder = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ 
        partner_id: userId,
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .is('partner_id', null);

    if (error) {
      toast.error("Erreur : commande déjà prise ou problème réseau");
      console.error(error);
    } else {
      toast.success("Commande prise en charge !");
      fetchOrders(userId);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const updates: any = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .eq('partner_id', userId);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } else {
      const statusLabels: any = {
        'assigned': 'Assignée',
        'in_progress': 'En cours',
        'ready': 'Prête',
        'completed': 'Terminée'
      };
      toast.success(`Commande ${statusLabels[newStatus] || newStatus}`);
      
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus, ...updates } : o
      ));
      calculateStats(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus, ...updates } : o
      ));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        
        {/* HEADER & STATS */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Espace Partenaire</h1>
          <p className="text-slate-500 mb-8">Gérez votre production en temps réel.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CARTE 1 : A TRAITER */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl text-orange-600">
                <Package size={24}/>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">À traiter</p>
                <p className="text-3xl font-black">{stats.pending}</p>
              </div>
            </div>

            {/* CARTE 2 : REVENUS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-xl text-green-600">
                <DollarSign size={24}/>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold">CA Réalisé</p>
                <p className="text-3xl font-black">{stats.revenue} €</p>
              </div>
            </div>

            {/* CARTE 3 : COMMANDES DISPONIBLES */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-teal-500/20 flex items-center gap-4 text-white">
              <div className="bg-white/20 p-4 rounded-xl">
                <UserPlus size={24}/>
              </div>
              <div>
                <p className="text-teal-100 text-sm font-bold">Disponibles</p>
                <p className="text-3xl font-black">{availableOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COMMANDES DISPONIBLES À PRENDRE */}
        {availableOrders.length > 0 && (
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 mb-8 border border-teal-200">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-teal-600"/> 
              Commandes disponibles à prendre
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        #{order.id.slice(0, 8)}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">
                        Collecte : {new Date(order.pickup_date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                      Dispo
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Poids</span>
                      <span className="font-bold">{order.weight || '?'} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Montant</span>
                      <span className="font-bold text-teal-600">{order.total_price || '?'} €</span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      📍 {order.pickup_address || 'Adresse non spécifiée'}
                    </div>
                  </div>

                  <button 
                    onClick={() => takeOrder(order.id)}
                    className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-teal-500 transition flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16}/> Prendre en charge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLEAU DES MES COMMANDES */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <Filter size={20}/> Mes Commandes
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { key: 'all', label: 'Tout' },
                { key: 'assigned', label: 'Assigné' },
                { key: 'in_progress', label: 'En cours' },
                { key: 'ready', label: 'Prêt' },
                { key: 'completed', label: 'Terminé' }
              ].map(f => (
                <button 
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    filter === f.key 
                      ? 'bg-white shadow-sm text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-6">ID / Dates</th>
                  <th className="p-6">Détails</th>
                  <th className="p-6">Client</th>
                  <th className="p-6">Statut</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                )}
                
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-6">
                      <span className="font-mono font-bold text-slate-900">
                        #{order.id.slice(0, 8)}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">
                        Créé : {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-teal-600 font-bold mt-1">
                        Collecte : {new Date(order.pickup_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold">
                        {order.weight ? `${order.weight} kg` : '- kg'}
                      </div>
                      <div className="text-xs text-teal-600 font-bold">
                        {order.total_price ? `${order.total_price} €` : '- €'}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {order.items || "Standard"}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-medium truncate max-w-xs">
                        📍 {order.pickup_address || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                        ${order.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'ready' ? 'bg-purple-100 text-purple-700' : 
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          'bg-slate-100'}`}>
                        {order.status === 'assigned' ? 'Assigné' : 
                         order.status === 'in_progress' ? 'Lavage' : 
                         order.status === 'ready' ? 'Prêt' : 
                         order.status === 'completed' ? 'Terminé' : order.status}
                      </span>
                    </td>
                    <td className="p-6 text-right flex justify-end gap-2">
                      {/* BOUTON IMPRIMER */}
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition" 
                        title="Imprimer Étiquette"
                      >
                        <Printer size={18}/>
                      </button>

                      {/* WORKFLOW : assigned → in_progress → ready → completed */}
                      {order.status === 'assigned' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'in_progress')} 
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-500 transition"
                        >
                          Démarrer
                        </button>
                      )}
                      {order.status === 'in_progress' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'ready')} 
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-purple-500 transition"
                        >
                          Prêt
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'completed')} 
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-500 transition"
                        >
                          Terminer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODALE D'IMPRESSION --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg">Impression Étiquette</h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-slate-200 rounded-full transition"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 flex justify-center bg-slate-100 print:bg-white">
              <div className="scale-90 origin-top">
                <OrderTicket 
                  orderId={selectedOrder.id.slice(0, 8)}
                  customerName={selectedOrder.pickup_address || "Client Kilolab"}
                  weight={selectedOrder.weight || 0}
                  items={selectedOrder.items || "Standard"}
                  date={new Date(selectedOrder.pickup_date).toLocaleDateString()}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button 
                onClick={handlePrint} 
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
              >
                <Printer size={20}/> Imprimer
              </button>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-6 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
