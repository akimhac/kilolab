import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_EMAILS = ['admin@kilolab.fr', 'contact@kilolab.fr', 'akim.hachili@gmail.com'];

export default function SuperAccess() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      toast.error('⛔ Accès réservé aux administrateurs');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      if (error) throw error;
      if (!data.session) throw new Error('Pas de session');
      
      if (!ADMIN_EMAILS.includes(data.session.user.email || '')) {
        await supabase.auth.signOut();
        throw new Error('⛔ Accès refusé');
      }
      toast.success('✅ Connexion réussie !');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Super Access 🚀</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-700 rounded text-white border border-slate-600"
            placeholder="Email admin"
          />
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-700 rounded text-white border border-slate-600"
            placeholder="Mot de passe"
          />
          <button disabled={loading} type="submit" className="w-full py-3 bg-teal-500 text-white rounded font-bold hover:bg-teal-600">
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
