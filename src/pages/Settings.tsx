import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import NotificationSettings from '../components/NotificationSettings';
import { ThemeToggle } from '../components/ThemeToggle';
import { User, Mail, Phone, MapPin, Bell, Shield, Trash2, LogOut, Loader2, Save, ChevronRight, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  default_address: string;
  notifications_enabled: boolean;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile({ ...data, email: user.email || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          default_address: profile.default_address,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Profil mis à jour !');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin text-teal-500" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Paramètres</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'profile' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <User size={16} /> Profil
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'notifications' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Bell size={16} /> Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'security' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <Shield size={16} /> Sécurité
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'appearance' ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <Palette size={16} /> Apparence
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 mb-4">Informations personnelles</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-slate-600">{profile.email}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500">+33</span>
                    <input
                      type="tel"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="6 12 34 56 78"
                      className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse par défaut</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl">
                      <MapPin size={16} className="text-slate-400" />
                    </span>
                    <input
                      type="text"
                      value={profile.default_address || ''}
                      onChange={(e) => setProfile({ ...profile, default_address: e.target.value })}
                      placeholder="Votre adresse"
                      className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <NotificationSettings />
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 mb-4">Préférences email</h2>
              <div className="space-y-3">
                {[
                  { id: 'email_orders', label: 'Mises à jour commandes', desc: 'Statut de vos commandes' },
                  { id: 'email_promo', label: 'Promotions', desc: 'Offres et réductions' },
                  { id: 'email_news', label: 'Newsletter', desc: 'Actualités Kilolab' },
                ].map((pref) => (
                  <label key={pref.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900">{pref.label}</p>
                      <p className="text-sm text-slate-500">{pref.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500 rounded" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 mb-4">Mot de passe</h2>
              <button className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-between">
                <span>Modifier le mot de passe</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="font-bold text-slate-900 mb-4">Déconnexion</h2>
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Se déconnecter
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900">
              <h2 className="font-bold text-red-600 dark:text-red-400 mb-4">Zone dangereuse</h2>
              <button className="w-full py-3 px-4 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} />
                Supprimer mon compte
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">Cette action est irréversible</p>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Thème</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Choisissez l'apparence de l'application. Le mode automatique s'adapte aux préférences de votre système.
              </p>
              <ThemeToggle variant="buttons" />
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h2 className="font-bold mb-2">Mode sombre activé !</h2>
              <p className="text-sm text-white/80">
                Profitez d'une expérience visuelle plus confortable la nuit et économisez la batterie sur les écrans OLED.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
