import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, Upload, Check, AlertCircle, Sparkles, Scale, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BecomeWasher() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [volume, setVolume] = useState(20); // Pour le simulateur

  // Simulation revenus : Mix 50/50 Standard/Express => Moyenne 4€/kg * 70% = 2.8€/kg net
  const revenue = (volume * 2.80).toFixed(0);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', city: '', postalCode: '', address: '', idCardUrl: '',
    has_machine: false, has_scale: false, use_hypoallergenic: false, accept_terms: false
  });

  const uploadIdCard = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `id-cards/${fileName}`;
      const { error } = await supabase.storage.from('documents').upload(filePath, file); // J'ai corrigé le bucket 'washers' -> 'documents' si besoin
      if (error) throw error;
      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      setFormData({ ...formData, idCardUrl: data.publicUrl });
      toast.success("Pièce d'identité reçue !");
    } catch (error: any) {
      toast.error("Erreur upload: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.has_machine || !formData.has_scale || !formData.use_hypoallergenic || !formData.accept_terms) {
        toast.error("Veuillez accepter tous les engagements qualité");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('washers').insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        postal_code: formData.postalCode,
        id_card_url: formData.idCardUrl,
        status: 'pending',
        has_machine: formData.has_machine,
        has_scale: formData.has_scale,
        use_hypoallergenic: formData.use_hypoallergenic
      });

      if (error) throw error;
      setStep(4); // Succès
      toast.success("Candidature envoyée !");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} /> Devenez Washer Kilolab
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Transforme ta machine à laver<br/><span className="text-teal-600">en machine à cash 💰</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Gagne de l'argent en lavant le linge de ta ville. Liberté totale, sans abonnement.
          </p>
        </div>

        {/* ÉTAPES */}
        <div className="flex justify-between mb-12 max-w-lg mx-auto">
          {[1, 2, 3].map(num => (
            <div key={num} className={`flex-1 ${num < 3 ? 'mr-2' : ''}`}>
              <div className={`h-2 rounded-full transition-all ${step >= num ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: INFOS */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">1. Tes informations</h2>
              <div className="space-y-4">
                <input required type="text" placeholder="Nom complet" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 border rounded-xl" />
                <div className="grid md:grid-cols-2 gap-4">
                    <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input required type="tel" placeholder="Téléphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Ville" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border rounded-xl" />
                    <input required type="text" placeholder="Code postal" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full mt-6 py-4 bg-teal-600 text-white rounded-xl font-bold">Continuer</button>
            </div>
          )}

          {/* STEP 2: ID */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">2. Identité</h2>
              <div className="mb-6 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 relative">
                {!formData.idCardUrl ? (
                    <>
                        <Upload className="mx-auto mb-2 text-slate-400"/>
                        <p className="font-bold text-slate-600">Clique pour uploader ta CNI/Passeport</p>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && uploadIdCard(e.target.files[0])} />
                    </>
                ) : (
                    <div className="text-green-600 font-bold flex items-center justify-center gap-2"><Check/> Document reçu</div>
                )}
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border font-bold rounded-xl">Retour</button>
                <button type="button" onClick={() => setStep(3)} disabled={!formData.idCardUrl} className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-xl disabled:opacity-50">Continuer</button>
              </div>
            </div>
          )}

          {/* STEP 3: ENGAGEMENTS */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">3. Charte Qualité</h2>
              
              {/* Simulateur Mini */}
              <div className="bg-slate-900 text-white p-6 rounded-xl mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span>Volume hebdo: {volume}kg</span>
                    <span className="text-2xl font-bold text-teal-400">{parseInt(revenue) * 4}€ / mois</span>
                </div>
                <input type="range" min="10" max="100" value={volume} onChange={e => setVolume(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"/>
              </div>

              <div className="space-y-4 mb-8">
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:border-teal-500 transition">
                    <input type="checkbox" className="mt-1" checked={formData.has_machine} onChange={e => setFormData({...formData, has_machine: e.target.checked})} />
                    <span className="text-sm">Je possède une machine à laver propre.</span>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:border-teal-500 transition">
                    <input type="checkbox" className="mt-1" checked={formData.has_scale} onChange={e => setFormData({...formData, has_scale: e.target.checked})} />
                    <span className="text-sm">J'achète un <strong>peson</strong> pour peser le linge.</span>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:border-teal-500 transition">
                    <input type="checkbox" className="mt-1" checked={formData.use_hypoallergenic} onChange={e => setFormData({...formData, use_hypoallergenic: e.target.checked})} />
                    <span className="text-sm">J'utilise une <strong>lessive hypoallergénique</strong>.</span>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:border-teal-500 transition">
                    <input type="checkbox" className="mt-1" checked={formData.accept_terms} onChange={e => setFormData({...formData, accept_terms: e.target.checked})} />
                    <span className="text-sm">J'accepte les conditions (Indépendant, Com 30%).</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border font-bold rounded-xl">Retour</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin"/> : "Valider mon inscription"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCÈS */}
          {step === 4 && (
            <div className="text-center p-8 bg-white border rounded-2xl">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32}/></div>
                <h2 className="text-2xl font-black mb-2">Dossier reçu ! 🎉</h2>
                <p className="text-slate-600 mb-6">On t'appelle sous 24h pour valider ton profil.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Retour Accueil</button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
