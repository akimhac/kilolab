import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, User, Store, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'client' | 'partner'>('client');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: role,
            status: role === 'partner' ? 'pending' : 'active'
          });

        if (profileError) console.error("Erreur profil:", profileError);

        toast.success('Compte créé ! Vérifiez vos emails.');
        
        if (role === 'partner') {
          navigate('/become-partner');
        } else {
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-extrabold text-white tracking-tight">
          Kilolab<span className="text-teal-500">.</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-slate-200">
          {/* CGU/RGPD - NOUVEAU */}
<div className="text-sm">
  <label className="flex items-start gap-3 cursor-pointer">
    <input 
      type="checkbox" 
      required
      className="mt-0.5 w-4 h-4 accent-teal-600" 
    />
    <span className="text-slate-300">
      J'accepte les{' '}
      <Link to="/cgu" target="_blank" className="text-teal-400 underline font-bold">
        CGU
      </Link>
      ,{' '}
      <Link to="/cgv" target="_blank" className="text-teal-400 underline font-bold">
        CGV
      </Link>
      {' '}et la{' '}
      <Link to="/privacy" target="_blank" className="text-teal-400 underline font-bold">
        politique RGPD
      </Link>
      .
    </span>
  </label>
</div>
          Créer votre compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                role === 'client' 
                  ? 'border-teal-500 bg-teal-500/10 text-white' 
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              {role === 'client' && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-teal-500" /></div>}
              <User className={`w-8 h-8 mb-2 ${role === 'client' ? 'text-teal-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm">Je suis Client</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`relative flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                role === 'partner' 
                  ? 'border-purple-500 bg-purple-500/10 text-white' 
                  : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              {role === 'partner' && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-purple-500" /></div>}
              <Store className={`w-8 h-8 mb-2 ${role === 'partner' ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm">Je suis Pressing</span>
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Nom complet</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="mt-1 appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Mot de passe</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="mt-1 appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-900 transition-all ${
                role === 'client' ? 'bg-teal-500 hover:bg-teal-400' : 'bg-purple-500 hover:bg-purple-400'
              }`}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-teal-500 hover:text-teal-400 text-sm">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
