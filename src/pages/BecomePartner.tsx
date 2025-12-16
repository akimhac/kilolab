import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Building2, User, Mail, Lock, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Inscription Auth
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (user) {
        // 2. Création du Profil PARTNER (Status: pending)
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            full_name: formData.companyName, // On met le nom de la boîte en principal
            email: formData.email,
            phone: formData.phone,
            role: 'partner', // CRUCIAL
            status: 'pending' // En attente de validation par Akim
          });

        if (profileError) throw profileError;

        toast.success("Candidature envoyée !");
        navigate('/partner-login'); // Redirige vers login ou page d'attente
      }
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      <Navbar />
      
      <div className="pt-32 max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        
        {/* COLONNE GAUCHE : ARGUMENTS */}
        <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-bold rounded-full mb-6">
                <Building2 size={16}/> Espace Professionnel
            </div>
            <h1 className="text-4xl font-extrabold mb-6">Rejoignez le réseau Kilolab.</h1>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Augmentez votre chiffre d'affaires sans effort. Nous vous apportons le volume, vous gérez la qualité.
            </p>
            
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0"><CheckCircle size={20}/></div>
                    <div>
                        <h3 className="font-bold">Paiement Garanti</h3>
                        <p className="text-sm text-slate-500">Virements automatiques Stripe J+1.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0"><CheckCircle size={20}/></div>
                    <div>
                        <h3 className="font-bold">Zéro Frais Fixe</h3>
                        <p className="text-sm text-slate-500">Commission uniquement sur les commandes.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="flex-1 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6">Candidature Partenaire</h2>
            
            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-slate-700">Nom de la société / Pressing</label>
                    <div className="relative mt-1">
                        <Building2 size={18} className="absolute left-3 top-3 text-slate-400"/>
                        <input required name="companyName" onChange={handleChange} type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Pressing des Lilas"/>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700">Votre Nom</label>
                    <div className="relative mt-1">
                        <User size={18} className="absolute left-3 top-3 text-slate-400"/>
                        <input required name="fullName" onChange={handleChange} type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="Jean Dupont"/>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700">Téléphone</label>
                    <div className="relative mt-1">
                        <Phone size={18} className="absolute left-3 top-3 text-slate-400"/>
                        <input required name="phone" onChange={handleChange} type="tel" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="06 12 34 56 78"/>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700">Email Pro</label>
                    <div className="relative mt-1">
                        <Mail size={18} className="absolute left-3 top-3 text-slate-400"/>
                        <input required name="email" onChange={handleChange} type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="contact@pressing.com"/>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                    <div className="relative mt-1">
                        <Lock size={18} className="absolute left-3 top-3 text-slate-400"/>
                        <input required name="password" onChange={handleChange} type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" placeholder="••••••••"/>
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-lg mt-4">
                    {loading ? <Loader2 className="animate-spin"/> : "Envoyer ma candidature"}
                </button>
            </form>
            
            <p className="text-xs text-center text-slate-400 mt-6">
                Déjà partenaire ? <Link to="/login" className="text-teal-600 font-bold hover:underline">Connexion</Link>
            </p>
        </div>

      </div>
    </div>
  );
}
