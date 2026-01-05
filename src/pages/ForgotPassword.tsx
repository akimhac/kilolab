import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast.success('Email envoyé ! Vérifiez votre boîte mail.');
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          
          {!sent ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-teal-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-teal-100 text-sm">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <div className="text-center pt-4">
                  <Link 
                    to="/login" 
                    className="text-sm text-slate-600 hover:text-teal-600 transition font-medium"
                  >
                    ← Retour à la connexion
                  </Link>
                </div>

              </form>
            </div>
          ) : (
            // Success State
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Email envoyé !
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                Nous avons envoyé un lien de réinitialisation à<br/>
                <strong className="text-slate-900">{email}</strong>
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-teal-800 font-medium">
                  📧 Pensez à vérifier vos <strong>spams</strong> si vous ne voyez pas l'email
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Renvoyer un email
                </button>
                
                <Link 
                  to="/login" 
                  className="block w-full py-3 text-slate-600 hover:text-teal-600 transition font-medium"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
