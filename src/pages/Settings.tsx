import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import NotificationSettings from '../components/NotificationSettings';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { User, Mail, Phone, MapPin, Bell, Shield, Trash2, LogOut, Loader2, Save, ChevronRight, Palette, Globe } from 'lucide-react';
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
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
      const { error } = await supabase.from('user_profiles').update({
        first_name: profile.first_name, last_name: profile.last_name,
        phone: profile.phone, default_address: profile.default_address,
      }).eq('id', profile.id);
      if (error) throw error;
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
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
      <div className="bg-slate-50 min-h-screen"><Navbar />
        <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-teal-500" size={40} /></div>
      </div>
    );
  }

  const tabs = [
    { key: 'profile' as const, icon: <User size={16} />, label: t('settings.tabs.profile') },
    { key: 'notifications' as const, icon: <Bell size={16} />, label: t('settings.tabs.notifications') },
    { key: 'security' as const, icon: <Shield size={16} />, label: t('settings.tabs.security') },
    { key: 'appearance' as const, icon: <Palette size={16} />, label: t('settings.tabs.appearance') },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{t('settings.title')}</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && profile && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('settings.profile.title')}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settings.profile.firstName')}</label>
                    <input type="text" value={profile.first_name || ''} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settings.profile.lastName')}</label>
                    <input type="text" value={profile.last_name || ''} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settings.profile.email')}</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                    <Mail size={16} className="text-slate-400" /><span className="text-slate-600 dark:text-slate-300">{profile.email}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t('settings.profile.emailReadonly')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settings.profile.phone')}</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-xl text-slate-500">+33</span>
                    <input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="6 12 34 56 78" className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('settings.profile.address')}</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-xl"><MapPin size={16} className="text-slate-400" /></span>
                    <input type="text" value={profile.default_address || ''} onChange={(e) => setProfile({ ...profile, default_address: e.target.value })}
                      placeholder={t('settings.profile.address')} className="flex-1 px-4 py-3 rounded-r-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full mt-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? t('settings.profile.saving') : t('settings.profile.save')}
              </button>
            </div>

            {/* Language selector in profile */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-slate-600 dark:text-slate-300" />
                <h2 className="font-bold text-slate-900 dark:text-white">{t('settings.tabs.profile') === 'Profil' ? 'Langue' : 'Language'}</h2>
              </div>
              <LanguageSelector variant="buttons" />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <NotificationSettings />
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('settings.notifications.emailPrefs')}</h2>
              <div className="space-y-3">
                {[
                  { id: 'email_orders', label: t('settings.notifications.orderUpdates'), desc: t('settings.notifications.orderUpdatesDesc') },
                  { id: 'email_promo', label: t('settings.notifications.promos'), desc: t('settings.notifications.promosDesc') },
                  { id: 'email_news', label: t('settings.notifications.newsletter'), desc: t('settings.notifications.newsletterDesc') },
                ].map((pref) => (
                  <label key={pref.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{pref.label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{pref.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500 rounded" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('settings.security.password')}</h2>
              <button className="w-full py-3 px-4 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-between">
                <span>{t('settings.security.changePassword')}</span><ChevronRight size={16} />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('settings.security.logout')}</h2>
              <button onClick={handleLogout}
                className="w-full py-3 px-4 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <LogOut size={16} /> {t('settings.security.logoutBtn')}
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-red-100 dark:border-red-900">
              <h2 className="font-bold text-red-600 dark:text-red-400 mb-4">{t('settings.security.dangerZone')}</h2>
              <button className="w-full py-3 px-4 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> {t('settings.security.deleteAccount')}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">{t('settings.security.deleteWarning')}</p>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('settings.appearance.title')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('settings.appearance.description')}</p>
              <ThemeToggle variant="buttons" />
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h2 className="font-bold mb-2">{t('settings.appearance.darkModeTitle')}</h2>
              <p className="text-sm text-white/80">{t('settings.appearance.darkModeDesc')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
