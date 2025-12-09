import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, CheckCircle, Loader2, Shield, Euro } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', siret: '', address: '', city: '', postal_code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = formData.email.trim().toLowerCase();

    try {
      // Vérifier si l'email existe déjà
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

      // Insérer le nouveau partenaire
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

      if (insertError) {
        console.error('Erreur:', insertError);
        toast.error('Erreur lors de l\'inscription. Réessayez.');
        setLoading(false);
        return;
      }

      toast.success('Demande envoyée ! Validation sous 24h.');
      navigate('/partner-coming-soon');

    } catch (err) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      <header className="p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5" />Retour
          </button>
          <Link to="/" className="text-2xl font-bold text-white">Kilolab</Link>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="text-white">
            <div className="inline-block px-4 py-2 bg-yellow-400 text-purple-900 rounded-full font-bold text-sm mb-6">
              GAGNEZ DÈS LE PREMIER CLIENT !
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Devenez partenaire Kilolab</h1>
            <p className="text-xl text-white/90 mb-8">Inscription 100% gratuite • Validation sous 24h</p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { icon: Euro, title: "0€ d'inscription" },
                { icon: Shield, title: "0€ d'abonnement" },
                { icon: CheckCircle, title: "0 engagement" }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <b.icon className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{b.title}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Pourquoi nous rejoindre ?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /><span>+1800 pressings déjà partenaires</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /><span>Commission de seulement 10%</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /><span>Nouveaux clients chaque jour</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400" /><span>Dashboard de gestion inclus</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Inscription gratuite</h2>
            <p className="text-slate-600 mb-6">Remplissez le formulaire, on vous valide sous 24h</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom du pressing *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="Pressing du Centre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email professionnel *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="contact@monpressing.fr" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="01 23 45 67 89" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">N° SIRET (optionnel)</label>
                  <input type="text" value={formData.siret} onChange={(e) => setFormData({...formData, siret: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="123 456 789 00012" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse du pressing *</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="12 rue du Commerce" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ville *</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="Paris" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code postal *</label>
                  <input type="text" required value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500" placeholder="75001" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Envoi...</> : <><Store className="w-5 h-5" />Devenir partenaire gratuitement</>}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                En vous inscrivant, vous acceptez nos <Link to="/legal/cgu" className="text-purple-600 hover:underline">CGU</Link>.
                Contact : contact@kilolab.fr
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
