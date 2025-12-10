import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, CheckCircle, Loader2, Shield, Euro, ArrowRight, Check, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', siret: '', address: '', city: '', postal_code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = formData.email.trim().toLowerCase();

    try {
      // 1. Vérification doublon
      const { data: existing } = await supabase
        .from('partners')
        .select('id, is_active, name')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        if (existing.is_active) {
          toast.error(`"${existing.name}" est déjà partenaire ! Connectez-vous.`);
          navigate('/login');
        } else {
          toast.error('Une demande est déjà en cours pour cet email.');
        }
        setLoading(false);
        return;
      }

      // 2. Création du partenaire
      const { error: insertError } = await supabase
        .from('partners')
        .insert({
          name: formData.name.trim(),
          email: email,
          phone: formData.phone.trim(),
          siret: formData.siret.trim() || null,
          address: formData.address.trim(),
          city: formData.city.trim().toUpperCase(),
          postal_code: formData.postal_code.trim(),
          is_active: false,
          price_per_kg: 3.00
        });

      if (insertError) throw insertError;

      // 3. Succès visuel
      toast.success('Candidature envoyée !');
      setIsSuccess(true);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error(err);
      toast.error('Erreur technique. Contactez le support.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-lg w-full bg-slate-900 border border-teal-500/30 rounded-3xl p-10 shadow-2xl">
          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Vérification en cours...</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Merci <strong>{formData.name}</strong>. Nous vérifions si votre établissement fait partie des <strong>1800 pressings éligibles</strong> au label Kilolab.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 mb-8 text-sm text-slate-500">
            Vous recevrez une réponse sous 24h à <span className="text-white">{formData.email}</span>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-teal-500 selection:text-white">
      
      <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Retour
          </button>
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-lg">K</div>
            Kilolab Pro
          </Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold"
            >
              <MapPin className="w-4 h-4" /> Vérifiez votre éligibilité
            </motion.div>
            
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Transformez votre pressing en<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Hub Digital.</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed">
              Nous référençons les meilleurs pressings indépendants de France pour leur apporter une clientèle digitale. Vérifiez si votre établissement peut rejoindre le réseau.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Euro, title: "0€ d'inscription" },
                { icon: Shield, title: "0€ d'abonnement" },
                { icon: CheckCircle, title: "0 engagement" }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-300">
                  <b.icon className="w-4 h-4 text-teal-400" />
                  <span className="font-medium text-sm">{b.title}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
              {/* --- MODIFICATION ICI : TEXTE ÉLITE / FOMO --- */}
              <h3 className="text-lg font-bold text-white mb-6">Nous avons référencé 1800 pressings d'élite. En faites-vous partie ?</h3>
              <ul className="space-y-4">
                {[
                  "Apport de nouveaux clients (Web & Mobile)",
                  "Commission fixe de 10% uniquement sur nos apports",
                  "Paiement garanti chaque semaine",
                  "Outils de gestion simplifiés offerts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-teal-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-2xl font-bold text-white mb-2">Tester mon éligibilité</h2>
            <p className="text-slate-500 mb-8 text-sm">Vérifiez si votre zone est éligible à l'offre Kilolab.</p>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom du pressing</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="Ex: Pressing de la Gare" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Pro</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="pro@pressing.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="06..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SIRET (Optionnel)</label>
                  <input type="text" value={formData.siret} onChange={(e) => setFormData({...formData, siret: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="14 chiffres" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adresse</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="12 rue du Commerce" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ville</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="Paris" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Postal</label>
                  <input type="text" required value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition" placeholder="75001" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Vérifier mon éligibilité <ArrowRight className="w-5 h-5" /></>}
              </button>
              
              <p className="text-center text-xs text-slate-600">
                En cliquant, vous acceptez nos CGU Partenaires.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
