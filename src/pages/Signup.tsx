import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Phone, ArrowLeft, Loader2, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // 1. Créer le compte auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error('Cet email est déjà utilisé. Connectez-vous.');
          navigate('/login');
        } else {
          toast.error(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('Erreur lors de la création du compte');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;
      const userEmail = formData.email.trim().toLowerCase();

      // 2. Créer le profil utilisateur
      await supabase.from('user_profiles').insert({
        id: userId,
        user_id: userId,
        email: userEmail,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        role: 'client'
      });

      // 3. IMPORTANT : Vérifier si cet email correspond à un partenaire existant
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id, name, is_active')
        .eq('email', userEmail)
        .single();

      if (existingPartner) {
        // Lier le user_id au partenaire existant
        await supabase
          .from('partners')
          .update({ user_id: userId })
          .eq('id', existingPartner.id);

        // Mettre à jour le rôle dans user_profiles
        await supabase
          .from('user_profiles')
          .update({ role: 'partner' })
          .eq('user_id', userId);

        toast.success(`Compte créé ! Votre pressing "${existingPartner.name}" est maintenant lié.`);
        
        if (existingPartner.is_active) {
          navigate('/partner-dashboard');
        } else {
          navigate('/partner-coming-soon');
        }
      } else {
        toast.success('Compte créé avec succès !');
        navigate('/client-dashboard');
      }

    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-slate-600">Rejoignez Kilolab gratuitement</p>
          </div>

          {/* Info partenaire */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-teal-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-teal-800">Vous êtes un pressing partenaire ?</p>
                <p className="text-teal-600">Utilisez l'email avec lequel vous vous êtes inscrit comme partenaire pour lier automatiquement votre compte.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="jean@exemple.fr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
