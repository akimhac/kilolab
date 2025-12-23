import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Lock, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérification de la session au chargement
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // L'utilisateur est bien là pour changer son mdp
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: password });

    setLoading(false);

    if (error) {
      toast.error("Erreur : " + error.message);
    } else {
      toast.success("Mot de passe modifié avec succès !");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <h1 className="text-2xl font-bold mb-6 text-center">Nouveau mot de passe</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      placeholder="Entrez votre nouveau mot de passe"
                      minLength={6}
                    />
                </div>
                <button disabled={loading} type="submit" className="w-full py-3 bg-teal-500 text-slate-900 rounded-xl font-bold flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : <>Valider <Check size={18}/></>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
