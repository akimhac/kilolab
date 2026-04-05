import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { 
  User, Mail, Phone, MapPin, Save, ArrowLeft, CheckCircle, Loader2,
  Trash2, AlertTriangle, Shield, Calendar, Clock, Bell, Eye, EyeOff,
  Lock, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'client' | 'washer' | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // Profile data
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_marketing: false,
    push_enabled: true,
  });

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [canDelete, setCanDelete] = useState(true);
  const [deleteBlockReason, setDeleteBlockReason] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // Get user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setUserRole(profileData.role);
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          postal_code: profileData.postal_code || '',
        });
        setNotifications({
          email_orders: profileData.email_orders !== false,
          email_marketing: profileData.email_marketing === true,
          push_enabled: profileData.push_enabled !== false,
        });
      }

      // Check if user can delete account
      await checkCanDeleteAccount(user.id, profileData?.role);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanDeleteAccount = async (userId: string, role: string) => {
    try {
      // Check for active orders (exclude cancelled, completed, and refunded)
      const { data: activeOrders, error } = await supabase
        .from('orders')
        .select('id, status')
        .or(`client_id.eq.${userId},washer_id.eq.${userId}`)
        .not('status', 'in', '("cancelled","completed","refunded")')
        .limit(1);

      console.log('Active orders check:', activeOrders, error);

      if (activeOrders && activeOrders.length > 0) {
        setCanDelete(false);
        setDeleteBlockReason('Vous avez des commandes en cours. Terminez-les avant de supprimer votre compte.');
        return;
      }

      // For washers: check for pending payouts
      if (role === 'washer') {
        const { data: washerData } = await supabase
          .from('washers')
          .select('pending_payout, last_payout_date')
          .eq('id', userId)
          .single();

        if (washerData?.pending_payout > 0) {
          setCanDelete(false);
          setDeleteBlockReason(`Vous avez ${washerData.pending_payout.toFixed(2)}€ en attente de paiement. Attendez le prochain virement.`);
          return;
        }

        // Check if last payout was less than 30 days ago
        if (washerData?.last_payout_date) {
          const lastPayout = new Date(washerData.last_payout_date);
          const daysSincePayout = Math.floor((Date.now() - lastPayout.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSincePayout < 30) {
            setCanDelete(false);
            setDeleteBlockReason(`Pour des raisons de sécurité, vous devez attendre 30 jours après votre dernier paiement. Encore ${30 - daysSincePayout} jour(s).`);
            return;
          }
        }
      }

      setCanDelete(true);
    } catch (error) {
      console.error('Error checking delete eligibility:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          postal_code: profile.postal_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          email_orders: notifications.email_orders,
          email_marketing: notifications.email_marketing,
          push_enabled: notifications.push_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Préférences enregistrées !');
    } catch (error: any) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !canDelete || deleteConfirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper SUPPRIMER pour confirmer');
      return;
    }

    const t = toast.loading('Suppression en cours...');
    try {
      // Log deletion reason
      await supabase.from('account_deletions').insert({
        user_id: user.id,
        email: user.email,
        reason: deleteReason,
        deleted_at: new Date().toISOString(),
      });

      // Anonymize user data instead of hard delete (for legal compliance)
      await supabase.from('user_profiles').update({
        full_name: 'Compte supprimé',
        phone: null,
        address: null,
        email: `deleted_${user.id}@kilolab.fr`,
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      }).eq('id', user.id);

      // If washer, also anonymize washer record
      if (userRole === 'washer') {
        await supabase.from('washers').update({
          full_name: 'Washer supprimé',
          phone: null,
          email: null,
          address: null,
          is_available: false,
          status: 'deleted',
        }).eq('id', user.id);
      }

      // Sign out user
      await supabase.auth.signOut();

      toast.success('Votre compte a été supprimé', { id: t });
      navigate('/');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message, { id: t });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft size={18} />
            Retour
          </button>

          <h1 className="text-2xl font-black text-slate-900 mb-6">Paramètres du compte</h1>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Sécurité', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? tab.id === 'delete' ? 'bg-red-500 text-white' : 'bg-teal-500 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
                  <AddressAutocomplete
                    value={profile.address}
                    onChange={(val) => setProfile({ ...profile, address: val })}
                    onSelect={(addr) => setProfile({ 
                      ...profile, 
                      address: addr.label,
                      city: addr.city, 
                      postal_code: addr.postcode 
                    })}
                    placeholder="12 rue de la Paix, Paris"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      placeholder="Paris"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={profile.postal_code}
                      onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                      placeholder="75001"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Enregistrer
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-900">Emails de commandes</p>
                    <p className="text-sm text-slate-500">Confirmations, mises à jour de statut</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email_orders}
                    onChange={(e) => setNotifications({ ...notifications, email_orders: e.target.checked })}
                    className="w-5 h-5 accent-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-900">Emails marketing</p>
                    <p className="text-sm text-slate-500">Offres, promotions, actualités</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email_marketing}
                    onChange={(e) => setNotifications({ ...notifications, email_marketing: e.target.checked })}
                    className="w-5 h-5 accent-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-900">Notifications push</p>
                    <p className="text-sm text-slate-500">Alertes sur votre appareil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push_enabled}
                    onChange={(e) => setNotifications({ ...notifications, push_enabled: e.target.checked })}
                    className="w-5 h-5 accent-teal-500"
                  />
                </div>
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Enregistrer
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-teal-600" size={20} />
                    <p className="font-bold text-teal-800">Connexion securisee</p>
                  </div>
                  <p className="text-sm text-teal-700">
                    Votre compte est protege par l'authentification Supabase.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-slate-900">Modifier le mot de passe</p>
                  <p className="text-sm text-slate-500">Un email de reinitialisation sera envoye a {user?.email}</p>
                  <button
                    onClick={async () => {
                      const t = toast.loading('Envoi en cours...');
                      try {
                        const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        if (!error) {
                          toast.success('Email de reinitialisation envoye ! Verifiez votre boite mail.', { id: t, duration: 6000 });
                        } else {
                          toast.error('Erreur: ' + error.message, { id: t });
                        }
                      } catch (e: any) {
                        toast.error('Erreur: ' + e.message, { id: t });
                      }
                    }}
                    className="w-full py-3.5 border-2 border-teal-500 text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition flex items-center justify-center gap-2"
                    data-testid="reset-password-btn"
                  >
                    <Lock size={18} />
                    Envoyer le lien de reinitialisation
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="font-bold text-slate-900 mb-2">Deconnexion</p>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut({ scope: 'global' });
                      navigate('/login');
                    }}
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                    data-testid="logout-all-btn"
                  >
                    Se deconnecter de tous les appareils
                  </button>
                </div>

                {/* Danger Zone - Account Deletion */}
                <div className="pt-6 border-t-2 border-red-200">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="text-red-600" size={20} />
                      <p className="font-bold text-red-800">Zone dangereuse</p>
                    </div>
                    <p className="text-sm text-red-700">
                      La suppression de votre compte est irreversible. Vos donnees seront anonymisees.
                    </p>
                  </div>

                  {!canDelete && deleteBlockReason && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                      <p className="text-sm text-amber-800 font-medium">{deleteBlockReason}</p>
                    </div>
                  )}

                  {canDelete && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Raison de la suppression (optionnel) :</p>
                        <textarea
                          value={deleteReason}
                          onChange={(e) => setDeleteReason(e.target.value)}
                          rows={2}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                          placeholder="Dites-nous pourquoi vous partez..."
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Tapez <strong>SUPPRIMER</strong> pour confirmer :</p>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full border border-red-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                          placeholder="SUPPRIMER"
                          data-testid="delete-confirm-input"
                        />
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'SUPPRIMER'}
                        className="w-full py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="delete-account-btn"
                      >
                        <Trash2 size={18} />
                        Supprimer definitivement mon compte
                      </button>
                    </div>
                  )}

                  {!canDelete && (
                    <a 
                      href="mailto:contact@kilolab.fr?subject=Demande%20de%20suppression%20de%20compte"
                      className="block w-full py-3.5 border-2 border-red-300 text-red-500 rounded-xl font-bold text-center hover:bg-red-50 transition"
                    >
                      Contacter le support pour suppression
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
