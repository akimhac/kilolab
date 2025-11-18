import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendWeightNotification, sendReadyNotification } from '../lib/notifications';
import {
  Package,
  Clock,
  CheckCircle,
  LogOut,
  TrendingUp,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  Scale
} from 'lucide-react';

interface Order {
  id: string;
  status: string;
  speed: 'premium' | 'express' | 'ultra';
  weight_kg: number | null;
  price_gross_cents: number;
  created_at: string;
  client_id: string;
  user_profiles?: {
    name: string;
    email: string;
  };
}

interface PartnerProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  role?: string;
}

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'stats'>('orders');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    revenue: 0,
    revenueThisMonth: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) throw profileError;

      if (profileData.role !== 'partner') {
        navigate('/client-dashboard');
        return;
      }

      setProfile(profileData);

      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('email', user.email)
        .single();

      if (partner) {
        setPartnerId(partner.id);

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`*, user_profiles:client_id (name, email)`)
          .eq('partner_id', partner.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);

        const total = ordersData?.length || 0;
        const pending = ordersData?.filter(o => o.status === 'pending_weight').length || 0;
        const inProgress = ordersData?.filter(o => o.status === 'paid' || o.status === 'in_progress').length || 0;
        const completed = ordersData?.filter(o => o.status === 'ready' || o.status === 'delivered').length || 0;

        const revenue = ordersData
          ?.filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.price_gross_cents || 0), 0) || 0;

        const firstOfMonth = new Date();
        firstOfMonth.setDate(1);
        const revenueThisMonth =
          ordersData
            ?.filter(o => new Date(o.created_at) >= firstOfMonth && o.status !== 'cancelled')
            .reduce((sum, o) => sum + (o.price_gross_cents || 0), 0) || 0;

        setStats({ total, pending, inProgress, completed, revenue, revenueThisMonth });
      }
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleWeightUpdate = async (orderId: string, weight: number) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const pricePerKg = order.speed === 'premium' ? 500 : order.speed === 'express' ? 1000 : 1500;
      const newPrice = Math.round(weight * pricePerKg);

      const { error } = await supabase
        .from('orders')
        .update({
          weight_kg: weight,
          price_gross_cents: newPrice,
          status: 'awaiting_payment'
        })
        .eq('id', orderId);

      if (error) throw error;

      // 🚀 ENVOYER EMAIL CLIENT
      if (order.user_profiles?.email) {
        await sendWeightNotification(order.user_profiles.email, {
          weight,
          price: newPrice / 100,
          orderId,
          partnerName: profile?.name || 'Votre pressing',
        });
      }

      alert(
        `✅ Poids enregistré : ${weight} kg\nPrix : ${(newPrice / 100).toFixed(2)}€\n\n📧 Email envoyé au client !`
      );
      loadData();
    } catch (error: any) {
      console.error('Error:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;

      // 🚀 ENVOYER EMAIL SI COMMANDE PRÊTE
      if (newStatus === 'ready' && order?.user_profiles?.email) {
        await sendReadyNotification(order.user_profiles.email, {
          orderId,
          partnerName: profile?.name || 'Votre pressing',
          partnerAddress: profile?.address || '',
        });
        alert('✅ Statut mis à jour !\n📧 Email envoyé au client !');
      } else {
        alert('✅ Statut mis à jour !');
      }
      
      loadData();
    } catch (error: any) {
      console.error('Error:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending_weight: '⚖️ À peser',
      awaiting_payment: '💳 En attente paiement',
      paid: '✅ Payé - À traiter',
      in_progress: '🔄 En cours',
      ready: '✅ Prêt',
      delivered: '📦 Livré',
      cancelled: '❌ Annulé'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_weight: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      awaiting_payment: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      paid: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      ready: 'bg-green-500/20 text-green-300 border-green-500/50',
      delivered: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/50'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🏢 Espace Partenaire</h1>
            <p className="text-white/60">Bienvenue {profile?.name || 'Partenaire'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          {(['orders', 'stats', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab ? 'bg-green-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab === 'orders' ? '📦 Commandes' : tab === 'stats' ? '📊 Statistiques' : '👤 Mon Profil'}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <Package className="w-10 h-10 text-blue-300 mb-2" />
                <p className="text-white/60 text-sm">Commandes totales</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <Scale className="w-10 h-10 text-yellow-300 mb-2" />
                <p className="text-white/60 text-sm">À peser</p>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <TrendingUp className="w-10 h-10 text-blue-300 mb-2" />
                <p className="text-white/60 text-sm">En cours</p>
                <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <CheckCircle className="w-10 h-10 text-green-300 mb-2" />
                <p className="text-white/60 text-sm">Terminées</p>
                <p className="text-3xl font-bold text-white">{stats.completed}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
                <DollarSign className="w-12 h-12 text-green-300 mb-3" />
                <p className="text-white/80 text-lg mb-2">CA total</p>
                <p className="text-5xl font-bold text-white mb-2">{(stats.revenue / 100).toFixed(2)} €</p>
                <p className="text-green-300 text-sm">Depuis le début</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30">
                <TrendingUp className="w-12 h-12 text-blue-300 mb-3" />
                <p className="text-white/80 text-lg mb-2">CA ce mois-ci</p>
                <p className="text-5xl font-bold text-white mb-2">
                  {(stats.revenueThisMonth / 100).toFixed(2)} €
                </p>
                <p className="text-blue-300 text-sm">
                  {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && profile && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Mon Profil Partenaire</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Nom du pressing
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {profile.name}
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/70">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Téléphone
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {profile.phone || 'Non renseigné'}
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ville
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {profile.postal_code} {profile.city}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Adresse
                </label>
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                  {profile.address || 'Non renseignée'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">📦 Commandes à traiter</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white font-semibold text-lg mb-1">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        {order.user_profiles && (
                          <p className="text-white/60 text-sm mt-1">👤 Client: {order.user_profiles.name}</p>
                        )}
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-sm">Formule</p>
                        <p className="text-white font-medium">
                          {order.speed === 'premium'
                            ? '🕐 Premium (72-96h)'
                            : order.speed === 'express'
                            ? '⚡ Express (24h)'
                            : '🚀 Ultra Express (6h)'}
                        </p>
                      </div>

                      <div>
                        <p className="text-white/60 text-sm">Poids</p>
                        <p className="text-white font-medium">
                          {order.weight_kg ? `${order.weight_kg} kg` : '⚖️ À peser'}
                        </p>
                      </div>

                      <div>
                        <p className="text-white/60 text-sm">Prix</p>
                        <p className="text-white font-medium">{(order.price_gross_cents / 100).toFixed(2)} €</p>
                      </div>
                    </div>

                    {order.status === 'pending_weight' && (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
                        <p className="text-yellow-200 font-semibold mb-3">⚖️ Pesée requise</p>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Poids réel (kg)"
                            id={`weight-${order.id}`}
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`weight-${order.id}`) as HTMLInputElement;
                              const weight = parseFloat(input.value);
                              if (weight > 0) {
                                handleWeightUpdate(order.id, weight);
                              } else {
                                alert('Veuillez entrer un poids valide');
                              }
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-all font-semibold flex items-center gap-2"
                          >
                            <Scale className="w-4 h-4" />
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    )}

                    {order.status === 'paid' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        🔄 Commencer le traitement
                      </button>
                    )}

                    {order.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        ✅ Marquer comme prêt
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        📦 Marquer comme récupéré
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
