import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Users, Store, ShoppingBag, Mail, TrendingUp, MapPin, 
  Clock, CheckCircle, XCircle, Eye, RefreshCw, LogOut,
  AlertTriangle, Settings, BarChart3, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

// Email admin autorisé
const ADMIN_EMAIL = 'contact@kilolab.fr';

interface Stats {
  totalUsers: number;
  totalPartners: number;
  activePartners: number;
  pendingPartners: number;
  totalOrders: number;
  pendingOrders: number;
  totalContacts: number;
  unreadContacts: number;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  postal_code: string;
  is_active: boolean;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalPartners: 0, activePartners: 0, pendingPartners: 0,
    totalOrders: 0, pendingOrders: 0, totalContacts: 0, unreadContacts: 0
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'contacts' | 'users'>('overview');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Vous devez être connecté');
      navigate('/login');
      return;
    }

    const userEmail = session.user.email?.toLowerCase();
    
    // Vérifier si c'est l'admin
    if (userEmail !== ADMIN_EMAIL && userEmail !== 'akim.hachili@gmail.com') {
      toast.error('Accès non autorisé');
      navigate('/');
      return;
    }

    setAuthorized(true);
    await loadAllData();
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Stats utilisateurs
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Stats partenaires
      const { data: partnersData, count: partnerCount } = await supabase
        .from('partners')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      const activeCount = partnersData?.filter(p => p.is_active).length || 0;
      const pendingCount = partnersData?.filter(p => !p.is_active).length || 0;

      // Stats commandes
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: pendingOrderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Messages contact (si la table existe)
      let contactCount = 0;
      let unreadCount = 0;
      let contactsData: ContactMessage[] = [];
      
      const { data: contactData, count: cCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (contactData) {
        contactsData = contactData;
        contactCount = cCount || 0;
        unreadCount = contactData.filter(c => !c.is_read).length;
      }

      setStats({
        totalUsers: userCount || 0,
        totalPartners: partnerCount || 0,
        activePartners: activeCount,
        pendingPartners: pendingCount,
        totalOrders: orderCount || 0,
        pendingOrders: pendingOrderCount || 0,
        totalContacts: contactCount,
        unreadContacts: unreadCount
      });

      setPartners(partnersData || []);
      setContacts(contactsData);

    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (partnerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('partners')
      .update({ is_active: !currentStatus })
      .eq('id', partnerId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
      return;
    }

    toast.success(currentStatus ? 'Partenaire désactivé' : 'Partenaire activé !');
    await loadAllData();
  };

  const markContactAsRead = async (contactId: string) => {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', contactId);
    
    await loadAllData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold">Accès non autorisé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center font-bold">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold">Kilolab Admin</h1>
              <p className="text-xs text-slate-400">Dashboard administrateur</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={loadAllData} className="p-2 hover:bg-slate-700 rounded-lg transition">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'partners', label: 'Partenaires', icon: Store, badge: stats.pendingPartners },
            { id: 'contacts', label: 'Messages', icon: Mail, badge: stats.unreadContacts },
            { id: 'users', label: 'Utilisateurs', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                  <span className="text-slate-400 text-sm">Utilisateurs</span>
                </div>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg"><Store className="w-5 h-5 text-green-400" /></div>
                  <span className="text-slate-400 text-sm">Partenaires actifs</span>
                </div>
                <p className="text-3xl font-bold text-green-400">{stats.activePartners}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.pendingPartners} en attente</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><ShoppingBag className="w-5 h-5 text-purple-400" /></div>
                  <span className="text-slate-400 text-sm">Commandes</span>
                </div>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.pendingOrders} en cours</p>
              </div>
              
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg"><Mail className="w-5 h-5 text-amber-400" /></div>
                  <span className="text-slate-400 text-sm">Messages</span>
                </div>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.unreadContacts} non lus</p>
              </div>
            </div>

            {/* Partenaires en attente */}
            {stats.pendingPartners > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-bold text-amber-400">
                    {stats.pendingPartners} partenaire(s) en attente de validation
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveTab('partners')}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition"
                >
                  Voir les demandes
                </button>
              </div>
            )}

            {/* Derniers partenaires */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Derniers partenaires inscrits</h3>
              <div className="space-y-3">
                {partners.slice(0, 5).map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-slate-400">{partner.city} ({partner.postal_code})</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      partner.is_active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {partner.is_active ? 'Actif' : 'En attente'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold">Tous les partenaires ({stats.totalPartners})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 text-left text-sm text-slate-400">
                  <tr>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Téléphone</th>
                    <th className="p-4">Ville</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                      <td className="p-4 font-medium">{partner.name}</td>
                      <td className="p-4 text-slate-400">{partner.email}</td>
                      <td className="p-4 text-slate-400">{partner.phone}</td>
                      <td className="p-4 text-slate-400">{partner.city} ({partner.postal_code})</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          partner.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {partner.is_active ? 'Actif' : 'En attente'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePartnerStatus(partner.id, partner.is_active)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            partner.is_active
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {partner.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-12 text-center">
                <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucun message de contact</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className={`bg-slate-800 rounded-2xl p-6 border ${
                    contact.is_read ? 'border-slate-700' : 'border-teal-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold">{contact.name}</h4>
                      <p className="text-sm text-slate-400">{contact.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!contact.is_read && (
                        <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                      )}
                      <span className="text-xs text-slate-500">
                        {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <p className="font-medium text-teal-400 mb-2">{contact.subject}</p>
                  <p className="text-slate-300">{contact.message}</p>
                  {!contact.is_read && (
                    <button
                      onClick={() => markContactAsRead(contact.id)}
                      className="mt-4 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-sm hover:bg-teal-500/30 transition"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-bold mb-4">Statistiques utilisateurs</h3>
            <p className="text-slate-400">Total: {stats.totalUsers} utilisateurs inscrits</p>
            <p className="text-sm text-slate-500 mt-4">
              Pour des raisons de confidentialité, les détails des utilisateurs ne sont pas affichés ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
