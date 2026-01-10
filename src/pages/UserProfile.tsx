import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, MapPin, Phone, Mail, Save, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/select-dashboard');
          return;
        }
        setUser(user);
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            postal_code: profile.postal_code || '',
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      toast.success('Profil sauvegardé !');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="flex justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition">
            <ArrowLeft size={20} /> Retour
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition"
          >
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-teal-100 rounded-full text-teal-600 mb-4">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nom complet"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Téléphone"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ville"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="Code Postal"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <Save size={20} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
