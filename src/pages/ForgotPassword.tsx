import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Envoi via Supabase (Redirection vers la page de changement)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });

    setLoading(false);

    if (error) {
      toast.error("Erreur : " + error.message);
    } else {
      setSent(true);
      toast.success("Email envoyé !");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="pt-32 px-4 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Mot de passe oublié ?</h1>
              <p className="text-slate-500 mb-8">Entrez votre email pour recevoir un lien de réinitialisation.</p>
              <form onSubmit={handleReset} className="space-y-4">
                <div className="relative text-left">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                          placeholder="votre@email.com"
                        />
                    </div>
                </div>
                <button disabled={loading} type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin"/> : <>Envoyer le lien <ArrowRight size={18}/></>}
                </button>
              </form>
              <div className="mt-6">
                <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-slate-600">Retour connexion</Link>
              </div>
            </>
          ) : (
            <div className="py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32}/>
                </div>
                <h2 className="text-xl font-bold mb-2">Email envoyé !</h2>
                <p className="text-slate-500 mb-6">Vérifiez votre boîte mail.</p>
                <Link to="/login" className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold">Retour</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
