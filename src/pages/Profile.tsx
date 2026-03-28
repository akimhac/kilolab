import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Phone, MapPin, Save, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
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
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft size={18} />
            Retour
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={36} />
              </div>
              <h1 className="text-xl font-bold">{profile.full_name || 'Mon Profil'}</h1>
              <p className="text-teal-100 text-sm">{user?.email}</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <User size={14} className="inline mr-2" />
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Mail size={14} className="inline mr-2" />
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                  />
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié</p>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Phone size={14} className="inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <MapPin size={14} className="inline mr-2" />
                  Adresse
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="123 rue de la Paix"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Ville et Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Code postal</label>
                  <input
                    type="text"
                    value={profile.postal_code}
                    onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                    placeholder="75001"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
