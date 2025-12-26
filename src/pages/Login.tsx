import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Bascule entre Login et Inscription
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Compte créé ! Vérifiez vos emails.");
      } else {
        // --- CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie !");
        navigate('/dashboard'); // On envoie vers le Dashboard Client
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
            
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black mb-2">{isSignUp ? "Créer un compte" : "Bon retour !"}</h1>
                <p className="text-slate-500 text-sm">Gérez vos commandes de pressing simplement.</p>
            </div>

            {/* TOGGLE */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                <button onClick={() => setIsSignUp(false)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${!isSignUp ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Connexion</button>
                <button onClick={() => setIsSignUp(true)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${isSignUp ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Inscription</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute top-3.5 left-4 text-slate-400" size={20}/>
                    <input 
                        type="email" 
                        required 
                        placeholder="Votre email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition bg-slate-50 focus:bg-white"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute top-3.5 left-4 text-slate-400" size={20}/>
                    <input 
                        type="password" 
                        required 
                        placeholder="Mot de passe" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition bg-slate-50 focus:bg-white"
                    />
                </div>

                {!isSignUp && (
                    <div className="text-right">
                        <Link to="/forgot-password" className="text-xs text-teal-600 font-bold hover:underline">Mot de passe oublié ?</Link>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg mt-6"
                >
                    {loading ? <Loader2 className="animate-spin"/> : (isSignUp ? "S'inscrire" : "Se connecter")} <ArrowRight size={20}/>
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
