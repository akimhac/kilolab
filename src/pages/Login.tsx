import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Connexion Supabase
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        // 2. On récupère le profil pour savoir où rediriger
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        toast.success(`Bon retour !`);

        // 3. Redirection intelligente
        if (profile?.role === 'admin') {
           navigate('/admin-dashboard');
        } else if (profile?.role === 'partner') {
           navigate('/partner-dashboard');
        } else {
           navigate('/dashboard'); // Client normal
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 pb-20 px-4 flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Connexion</h1>
            <p className="text-slate-500">Accédez à votre espace Kilolab</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Mot de passe</label>
                <Link to="/contact" className="text-xs text-teal-600 hover:underline">Oublié ?</Link>
              </div>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition" />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Pas encore de compte ? <Link to="/signup" className="text-teal-600 font-bold hover:underline">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
