import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { Building2, User, Mail, Link as LinkIcon, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BecomePartner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Données enrichies pour qualification B2B
  const [formData, setFormData] = useState({
    companyName: '',
    siret: '',
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation d'envoi vers Supabase
    setTimeout(() => {
        setLoading(false);
        setStep(2);
        toast.success("Candidature envoyée au service conformité !");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
        
        {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32}/>
                    </div>
                    <h1 className="text-3xl font-black mb-2">Devenir Partenaire</h1>
                    <p className="text-slate-500">Rejoignez le réseau Kilolab. Vérification sous 24h.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION ENTREPRISE */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2">L'Entreprise</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nom de la société</label>
                                <input required type="text" placeholder="Pressing des Lices..." className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">SIRET</label>
                                <input required type="text" placeholder="123 456 789 00012" className="w-full p-3 bg-slate-50 border rounded-xl"
                                    value={formData.siret} onChange={e => setFormData({...formData, siret: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Adresse complète</label>
                            <input required type="text" placeholder="12 Rue de la Paix, 75000 Paris" className="w-full p-3 bg-slate-50 border rounded-xl"
                                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        </div>
                    </div>

                    {/* SECTION CONTACT */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b pb-2 mt-6">Le Gérant</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nom complet</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                    <input required type="text" placeholder="Jean Dupont" className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                        value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Email Pro</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                    <input required type="email" placeholder="jean@pressing.com" className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Lien LinkedIn / Site Web (Optionnel)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                <input type="url" placeholder="https://linkedin.com/in/..." className="w-full pl-10 p-3 bg-slate-50 border rounded-xl"
                                    value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Aide à accélérer la validation de votre dossier.</p>
                        </div>
                    </div>

                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition flex justify-center items-center gap-2 shadow-lg">
                        {loading ? <Loader2 className="animate-spin"/> : "Envoyer ma candidature"}
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48}/>
                </div>
                <h2 className="text-3xl font-black mb-4">Dossier reçu !</h2>
                <p className="text-slate-500 text-lg mb-8">
                    Notre équipe vérifie votre Kbis et vos installations.<br/>
                    Vous recevrez vos accès "Espace Pro" sous 24h.
                </p>
                <button onClick={() => navigate('/')} className="px-8 py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-900 transition">
                    Retour à l'accueil
                </button>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
