import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { 
  User, Mail, Phone, MapPin, Loader2, AlertCircle, 
  ArrowLeft, LogOut, Save, Building 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [isEditable, setIsEditable] = useState(false);

  // Pour les clients (éditable)
  const [formData, setFormData] = useState({
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
        navigate('/select-dashboard');
        return;
      }

      const userRole = user.user_metadata?.role || 'client';
      setRole(userRole);

      // ✅ Washers et Partners = LECTURE SEULE
      setIsEditable(userRole === 'client');

      // Récupérer selon le rôle
      if (userRole === 'washer') {
        const { data } = await supabase
          .from('washers')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } else if (userRole === 'partner') {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      } else {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        setProfile(data);

        if (data) {
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            postal_code: data.postal_code || '',
          });
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isEditable) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('✅ Profil sauvegardé !');
      fetchProfile();
    } catch (error: any) {
      toast.error('❌ Erreur: ' + error.message);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-2xl font-bold mb-2">Profil non trouvé</h2>
            <p className="text-slate-600">Impossible de charger vos informations.</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MODE LECTURE SEULE (Washers & Partners)
  if (!isEditable) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
          <div className="flex justify-between mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
            >
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
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {(profile.full_name || profile.company_name || 'U').charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-black mb-2">
                {profile.full_name || profile.company_name || 'Mon profil'}
              </h1>
              <span className="px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">
                {role === 'washer' && '🧺 Washer'}
                {role === 'partner' && '🏪 Partenaire'}
              </span>
            </div>

            {/* Informations */}
            <div className="space-y-4">
              
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <Mail className="text-teal-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-medium mb-1">Email</p>
                  <p className="font-bold text-slate-900">{profile.email}</p>
                </div>
              </div>

              {/* Téléphone */}
              {profile.phone && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <Phone className="text-teal-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium mb-1">Téléphone</p>
                    <p className="font-bold text-slate-900">{profile.phone}</p>
                  </div>
                </div>
              )}

              {/* Adresse */}
              {profile.address && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="text-teal-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium mb-1">Adresse</p>
                    <p className="font-bold text-slate-900">{profile.address}</p>
                    <p className="text-sm text-slate-600">
                      {profile.postal_code} {profile.city}
                    </p>
                  </div>
                </div>
              )}

              {/* Ville (si pas d'adresse) */}
              {!profile.address && profile.city && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="text-teal-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium mb-1">Ville</p>
                    <p className="font-bold text-slate-900">
                      {profile.postal_code} {profile.city}
                    </p>
                  </div>
                </div>
              )}

              {/* Washer : Statut */}
              {role === 'washer' && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <User className="text-teal-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium mb-1">Statut</p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        profile.status === 'approved' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {profile.status === 'approved' ? '✅ Approuvé' : '⏳ En attente'}
                      </span>
                      {profile.is_available && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          📍 Disponible
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Partner : Infos business */}
              {role === 'partner' && profile.company_name && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <Building className="text-teal-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium mb-1">Entreprise</p>
                    <p className="font-bold text-slate-900">{profile.company_name}</p>
                    {profile.siret && (
                      <p className="text-sm text-slate-600">SIRET: {profile.siret}</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Info lecture seule */}
            <div className="mt-8 pt-6 border-t">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <p className="text-sm text-blue-700 flex items-start gap-2">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Pour modifier vos informations, contactez notre support à{' '}
                    <a href="mailto:support@kilolab.fr" className="font-bold underline">
                      support@kilolab.fr
                    </a>
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ✅ MODE ÉDITABLE (Clients uniquement)
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="flex justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
          >
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
            <p className="text-gray-500">{profile.email}</p>
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
                value={profile.email || ''}
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
