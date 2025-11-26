import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Building2, CheckCircle, XCircle, Clock, Eye, 
  Users, Package, Euro, TrendingUp, AlertCircle, Search,
  Mail, Phone, MapPin, Calendar, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postal_code: string;
  siret?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  price_per_kg?: number;
}

interface Stats {
  totalPartners: number;
  activePartners: number;
  pendingPartners: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPartners: 0,
    activePartners: 0,
    pendingPartners: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'inactive'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Vérifier si l'utilisateur est admin (email spécifique ou table admins)
      const adminEmails = ['admin@kilolab.fr', 'contact@kilolab.fr']; // À personnaliser
      
      if (!adminEmails.includes(session.user.email || '')) {
        toast.error('Accès non autorisé');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Charger tous les partenaires
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnersError) throw partnersError;
      setPartners(partnersData || []);

      // Calculer les stats
      const active = partnersData?.filter(p => p.is_active === true).length || 0;
      const pending = partnersData?.filter(p => p.is_active === false || p.is_active === null).length || 0;

      // Charger les commandes
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount');

      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      // Compter les utilisateurs (approximatif)
      const { count: usersCount } = await supabase
        .from('orders')
        .select('user_id', { count: 'exact', head: true });

      setStats({
        totalPartners: partnersData?.length || 0,
        activePartners: active,
        pendingPartners: pending,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        totalUsers: usersCount || 0
      });

    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleValidatePartner = async (partnerId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ 
          is_active: approve,
          validated_at: approve ? new Date().toISOString() : null
        })
        .eq('id', partnerId);

      if (error) throw error;

      toast.success(approve ? 'Partenaire validé !' : 'Partenaire refusé');
      
      // Recharger les données
      await loadData();
      setSelectedPartner(null);

      // TODO: Envoyer un email au partenaire

    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const filteredPartners = partners.filter(p => {
    // Filtre par statut
    if (filter === 'active' && !p.is_active) return false;
    if (filter === 'inactive' && p.is_active !== false) return false;
    if (filter === 'pending' && p.is_active !== false && p.is_active !== null) return false;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.postal_code?.includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-400" />
              Administration Kilolab
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard 
            icon={Building2} 
            label="Total Pressings" 
            value={stats.totalPartners} 
            color="purple" 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Actifs" 
            value={stats.activePartners} 
            color="green" 
          />
          <StatCard 
            icon={Clock} 
            label="En attente" 
            value={stats.pendingPartners} 
            color="yellow" 
          />
          <StatCard 
            icon={Package} 
            label="Commandes" 
            value={stats.totalOrders} 
            color="blue" 
          />
          <StatCard 
            icon={Euro} 
            label="CA Total" 
            value={`${stats.totalRevenue.toFixed(0)}€`} 
            color="pink" 
          />
          <StatCard 
            icon={Users} 
            label="Clients" 
            value={stats.totalUsers} 
            color="cyan" 
          />
        </div>

        {/* Alertes */}
        {stats.pendingPartners > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <p className="text-yellow-200">
              <strong>{stats.pendingPartners} partenaire(s)</strong> en attente de validation
            </p>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Boutons de filtre */}
            <div className="flex gap-2">
              {[
                { key: 'pending', label: 'En attente', count: stats.pendingPartners },
                { key: 'active', label: 'Actifs', count: stats.activePartners },
                { key: 'all', label: 'Tous', count: stats.totalPartners }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                    filter === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === key ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des partenaires */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Pressing</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Ville</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-white/50">
                      Aucun partenaire trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-white">{partner.name}</p>
                          <p className="text-sm text-white/50">{partner.address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white">{partner.city}</p>
                        <p className="text-sm text-white/50">{partner.postal_code}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{partner.email}</p>
                        {partner.phone && (
                          <p className="text-sm text-white/50">{partner.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-white/70 text-sm">
                        {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4">
                        {partner.is_active === true ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            Actif
                          </span>
                        ) : partner.is_active === false ? (
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                            Refusé
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedPartner(partner)}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                            title="Voir détails"
                          >
                            <Eye className="w-5 h-5 text-white/70" />
                          </button>
                          {!partner.is_active && (
                            <>
                              <button
                                onClick={() => handleValidatePartner(partner.id, true)}
                                className="p-2 hover:bg-green-500/20 rounded-lg transition"
                                title="Valider"
                              >
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </button>
                              <button
                                onClick={() => handleValidatePartner(partner.id, false)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition"
                                title="Refuser"
                              >
                                <XCircle className="w-5 h-5 text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal détails partenaire */}
        {selectedPartner && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedPartner.name}</h2>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <XCircle className="w-6 h-6 text-white/70" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white">{selectedPartner.address}</p>
                    <p className="text-white/70">{selectedPartner.postal_code} {selectedPartner.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <a href={`mailto:${selectedPartner.email}`} className="text-purple-400 hover:underline">
                    {selectedPartner.email}
                  </a>
                </div>

                {selectedPartner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <a href={`tel:${selectedPartner.phone}`} className="text-white">
                      {selectedPartner.phone}
                    </a>
                  </div>
                )}

                {selectedPartner.siret && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <span className="text-white">SIRET: {selectedPartner.siret}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">
                    Inscrit le {new Date(selectedPartner.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {selectedPartner.description && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/80">{selectedPartner.description}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedPartner.is_active !== true && (
                  <button
                    onClick={() => handleValidatePartner(selectedPartner.id, true)}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Valider
                  </button>
                )}
                {selectedPartner.is_active !== false && (
                  <button
                    onClick={() => handleValidatePartner(selectedPartner.id, false)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Refuser
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant carte stat
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  const colors: Record<string, string> = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    blue: 'from-blue-500 to-blue-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4`}>
      <Icon className="w-6 h-6 text-white/80 mb-2" />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  );
}
