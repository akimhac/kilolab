import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  User, 
  History, 
  LogOut,
  Eye,
  MapPin,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  id: string;
  partner_id: string;
  weight_kg: number;
  service_type: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  partner?: {
    name: string;
    address: string;
    city: string;
  };
};

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'profile'>('current');
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);
      await Promise.all([
        loadOrders(session.user.id),
        loadProfile(session.user.id)
      ]);
    } catch (error) {
      console.error('Erreur auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (userId: string) => {
    try {
      // Commandes en cours (pas completed ou cancelled)
      const { data: current } = await supabase
        .from('orders')
        .select(`
          *,
          partner:partners(name, address, city)
        `)
        .eq('user_id', userId)
        .not('status', 'in', '(completed,cancelled)')
        .order('created_at', { ascending: false });

      // Commandes terminées
      const { data: past } = await supabase
        .from('orders')
        .select(`
          *,
          partner:partners(name, address, city)
        `)
        .eq('user_id', userId)
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(10);

      setCurrentOrders(current || []);
      setPastOrders(past || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmé', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      in_progress: { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Package },
      ready: { label: 'Prêt', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'Terminé', color: 'bg-slate-100 text-slate-800', icon: CheckCircle },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: Clock }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Kilolab
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-slate-900 font-semibold"
              >
                Accueil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-900 mb-2">
            Bonjour {profile.full_name || user?.email?.split('@')[0]} ! 👋
          </h2>
          <p className="text-lg text-slate-600">
            Bienvenue sur votre tableau de bord
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Commandes en cours</p>
                <p className="text-3xl font-black text-slate-900">{currentOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Commandes terminées</p>
                <p className="text-3xl font-black text-slate-900">{pastOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Kg nettoyés</p>
                <p className="text-3xl font-black text-slate-900">
                  {[...currentOrders, ...pastOrders].reduce((sum, o) => sum + o.weight_kg, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Nouvelle commande */}
        <button
          onClick={() => navigate('/partners-map')}
          className="w-full mb-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-[1.02]"
        >
          ➕ Nouvelle commande
        </button>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 px-6 py-4 font-bold text-center transition ${
                activeTab === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Commandes en cours ({currentOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-bold text-center transition ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History className="w-5 h-5 inline mr-2" />
              Historique
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 font-bold text-center transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Mon profil
            </button>
          </div>

          <div className="p-6">
            {/* Commandes en cours */}
            {activeTab === 'current' && (
              <div>
                {currentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg text-slate-600 mb-4">
                      Aucune commande en cours
                    </p>
                    <button
                      onClick={() => navigate('/partners-map')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition"
                    >
                      Créer une commande
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-300 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </p>
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              {order.partner?.name || 'Pressing'}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {order.partner?.address}, {order.partner?.city}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-slate-500">Poids</p>
                            <p className="font-bold text-slate-900">{order.weight_kg} kg</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Service</p>
                            <p className="font-bold text-slate-900">
                              {order.service_type === 'express' ? 'Express' : 'Standard'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Montant</p>
                            <p className="font-bold text-blue-600">{order.total_amount.toFixed(2)}€</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                          <button
                            onClick={() => navigate(`/order/${order.id}`)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold text-sm flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Suivre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Historique */}
            {activeTab === 'history' && (
              <div>
                {pastOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg text-slate-600">
                      Aucun historique pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-slate-200 rounded-xl p-6 bg-slate-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </p>
                            <h3 className="font-bold text-slate-900">
                              {order.partner?.name || 'Pressing'}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex gap-6">
                            <span className="text-slate-600">
                              {order.weight_kg} kg • {order.service_type === 'express' ? 'Express' : 'Standard'}
                            </span>
                          </div>
                          <p className="font-bold text-slate-900">{order.total_amount.toFixed(2)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profil */}
            {activeTab === 'profile' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <p className="font-bold text-slate-900">{user?.email}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Nom complet</p>
                    <p className="font-bold text-slate-900">{profile.full_name || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Téléphone</p>
                    <p className="font-bold text-slate-900">{profile.phone || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Adresse</p>
                    <p className="font-bold text-slate-900">
                      {profile.address ? `${profile.address}, ${profile.postal_code} ${profile.city}` : 'Non renseignée'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Modifier mon profil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
